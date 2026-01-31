const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const FAQ_FILE = path.join(DATA_DIR, 'faqs.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const ACTIVITY_FILE = path.join(DATA_DIR, 'activity.json');

// Ensure data directory exists
async function init() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function readJSON(file, defaultData = []) {
  try {
    await init();
    const data = await fs.readFile(file, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeJSON(file, defaultData);
      return defaultData;
    }
    throw error;
  }
}

async function writeJSON(file, data) {
  await init();
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

// FAQ Methods
exports.getFaqs = async () => {
  return await readJSON(FAQ_FILE, []);
};

exports.addFaq = async (faq) => {
  const faqs = await readJSON(FAQ_FILE, []);
  const newFaq = { ...faq, _id: Date.now().toString(), createdAt: new Date() };
  faqs.push(newFaq);
  await writeJSON(FAQ_FILE, faqs);
  return newFaq;
};

exports.updateFaq = async (id, updates) => {
  const faqs = await readJSON(FAQ_FILE, []);
  const index = faqs.findIndex(f => f._id === id);
  if (index === -1) return null;

  faqs[index] = { ...faqs[index], ...updates };
  await writeJSON(FAQ_FILE, faqs);
  return faqs[index];
};

// Unknown Question Methods
exports.getUnknownQuestions = async () => {
  return await readJSON(path.join(DATA_DIR, 'unknowns.json'), []);
};

exports.addUnknownQuestion = async (text, guildId) => {
  const file = path.join(DATA_DIR, 'unknowns.json');
  const unknowns = await readJSON(file, []);

  // Check if exists
  const existingIndex = unknowns.findIndex(u => u.text.toLowerCase() === text.toLowerCase());

  if (existingIndex >= 0) {
    unknowns[existingIndex].count += 1;
    unknowns[existingIndex].lastAsked = new Date();
    await writeJSON(file, unknowns);
    return unknowns[existingIndex];
  } else {
    const newUnknown = {
      _id: Date.now().toString(),
      text,
      count: 1,
      guildId,
      firstAsked: new Date(),
      lastAsked: new Date()
    };
    unknowns.push(newUnknown);
    await writeJSON(file, unknowns);
    return newUnknown;
  }
};

// Analytics Helper
// Activity Logging
exports.logActivity = async (type) => {
  const activities = await readJSON(ACTIVITY_FILE, []);
  activities.push({
    type, // 'matched' or 'unmatched'
    timestamp: new Date()
  });
  // Keep only last 30 days of logs to prevent file bloating
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentActivities = activities.filter(a => new Date(a.timestamp) > thirtyDaysAgo);

  await writeJSON(ACTIVITY_FILE, recentActivities);
};

// Analytics Helper
exports.getStats = async () => {
  const faqs = await exports.getFaqs();
  const unknowns = await exports.getUnknownQuestions();
  const activities = await readJSON(ACTIVITY_FILE, []);

  // Calculate real counts from activity log
  const matchedCount = activities.filter(a => a.type === 'matched').length;
  const unmatchedCount = activities.filter(a => a.type === 'unmatched').length;

  // Total queries processed
  const totalQueries = matchedCount + unmatchedCount;

  // Calculate Unique Users from activity log
  const uniqueUsers = new Set(activities.map(a => a.userId).filter(id => id)).size;

  // Generate Daily Chart Data (Last 7 Days)
  const chartData = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayName = days[d.getDay()];
    const dateStr = d.toISOString().split('T')[0];

    const dayActivities = activities.filter(a =>
      new Date(a.timestamp).toISOString().split('T')[0] === dateStr
    );

    chartData.push({
      name: dayName,
      queries: dayActivities.length
    });
  }

  return {
    totalFaqs: faqs.length,
    totalUnknown: unknowns.length,
    matched: matchedCount,
    unmatched: unmatchedCount,
    totalQueries, // New metric for "Total Questions"
    uniqueUsers, // New metric for "Users Engaged"
    accuracy: totalQueries > 0 ? ((matchedCount / totalQueries) * 100).toFixed(2) : 0,
    chartData // Return the real chart data
  };
};

exports.deleteFaq = async (id) => {
  const faqs = await readJSON(FAQ_FILE, []);
  const filtered = faqs.filter(f => f._id !== id);
  await writeJSON(FAQ_FILE, filtered);
  return true;
};

// Settings Methods
exports.getSettings = async () => {
  return await readJSON(SETTINGS_FILE, { similarityThreshold: 0.85 });
};

exports.updateSettings = async (updates) => {
  let settings = await readJSON(SETTINGS_FILE, { similarityThreshold: 0.85 });
  settings = { ...settings, ...updates };
  await writeJSON(SETTINGS_FILE, settings);
  return settings;
};
