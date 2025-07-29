const mongoose = require('mongoose');
const UnknownQuestion = require('../models/UnknownQuestion.js');
const Faq = require('../models/Faq.js');
const { requireRole } = require('./authMiddleware');

const MONGO_URI = process.env.MONGO_URI;

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await mongoose.connect(MONGO_URI);
    
    // Get unknown questions that have been asked multiple times
    const unknownQuestions = await UnknownQuestion.find()
      .sort({ count: -1, createdAt: -1 })
      .limit(20);
    
    // Get existing FAQ questions for comparison
    const existingFaqs = await Faq.find().select('question');
    const existingQuestions = existingFaqs.map(faq => faq.question.toLowerCase());
    
    // Generate suggestions based on patterns
    const suggestions = [];
    
    // Group similar questions
    const questionGroups = {};
    unknownQuestions.forEach(unknown => {
      const key = unknown.text.toLowerCase().trim();
      if (!questionGroups[key]) {
        questionGroups[key] = [];
      }
      questionGroups[key].push(unknown);
    });
    
    // Create suggestions for questions asked multiple times
    Object.entries(questionGroups).forEach(([question, instances]) => {
      const totalCount = instances.reduce((sum, inst) => sum + inst.count, 0);
      const guilds = [...new Set(instances.map(inst => inst.guildId))];
      
      if (totalCount >= 2) {
        suggestions.push({
          id: `suggestion_${question.replace(/\s+/g, '_')}`,
          question: question,
          suggestedAnswer: generateSuggestedAnswer(question),
          confidence: Math.min(totalCount / 3, 1.0), // Higher count = higher confidence
          timesAsked: totalCount,
          guilds: guilds.length,
          category: categorizeQuestion(question),
          priority: totalCount >= 3 ? 'high' : totalCount >= 2 ? 'medium' : 'low',
          reason: totalCount >= 3 
            ? 'Asked 3+ times by different users' 
            : 'Asked multiple times, potential FAQ candidate'
        });
      }
    });
    
    // Add AI-generated suggestions based on patterns
    const aiSuggestions = generateAISuggestions(unknownQuestions, existingQuestions);
    suggestions.push(...aiSuggestions);
    
    // Sort by priority and confidence
    suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority] || b.confidence - a.confidence;
    });
    
    res.status(200).json({
      suggestions: suggestions.slice(0, 10), // Return top 10 suggestions
      total: suggestions.length,
      stats: {
        highPriority: suggestions.filter(s => s.priority === 'high').length,
        mediumPriority: suggestions.filter(s => s.priority === 'medium').length,
        lowPriority: suggestions.filter(s => s.priority === 'low').length
      }
    });
    
  } catch (error) {
    console.error('Error generating suggestions:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
}

function generateSuggestedAnswer(question) {
  const questionLower = question.toLowerCase();
  
  // Simple rule-based answer generation
  if (questionLower.includes('tea') || questionLower.includes('coffee')) {
    return "Yes, tea and coffee are available during breaks. Check the refreshment area for timings.";
  }
  if (questionLower.includes('lunch') || questionLower.includes('food') || questionLower.includes('meal')) {
    return "Lunch is provided at the cafeteria. Check the schedule for specific timings.";
  }
  if (questionLower.includes('break') || questionLower.includes('rest')) {
    return "Breaks are scheduled throughout the day. Check the agenda for specific timings.";
  }
  if (questionLower.includes('wifi') || questionLower.includes('internet')) {
    return "WiFi credentials are available at the registration desk. Ask the organizers for details.";
  }
  if (questionLower.includes('parking') || questionLower.includes('car')) {
    return "Parking is available on-site. Please follow the parking guidelines.";
  }
  if (questionLower.includes('time') || questionLower.includes('schedule')) {
    return "Please check the event schedule or ask the organizers for specific timings.";
  }
  
  return "This appears to be a frequently asked question. Please provide a specific answer based on your organization's policies.";
}

function categorizeQuestion(question) {
  const q = question.toLowerCase();
  
  if (q.includes('tea') || q.includes('coffee') || q.includes('food') || q.includes('lunch') || q.includes('meal')) {
    return 'Refreshments';
  }
  if (q.includes('break') || q.includes('rest') || q.includes('time') || q.includes('schedule')) {
    return 'Schedule';
  }
  if (q.includes('wifi') || q.includes('internet') || q.includes('connection')) {
    return 'Technical';
  }
  if (q.includes('parking') || q.includes('car') || q.includes('transport')) {
    return 'Logistics';
  }
  if (q.includes('goodie') || q.includes('gift') || q.includes('swag')) {
    return 'Goodies';
  }
  
  return 'General';
}

function generateAISuggestions(unknownQuestions, existingQuestions) {
  const suggestions = [];
  
  // Find common patterns in questions
  const patterns = {};
  unknownQuestions.forEach(unknown => {
    const words = unknown.text.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (word.length > 3 && !['what', 'when', 'where', 'will', 'have', 'with', 'from', 'this', 'that'].includes(word)) {
        patterns[word] = (patterns[word] || 0) + unknown.count;
      }
    });
  });
  
  // Generate suggestions based on common words
  Object.entries(patterns)
    .filter(([word, count]) => count >= 3)
    .slice(0, 5)
    .forEach(([word, count]) => {
      if (!existingQuestions.some(q => q.includes(word))) {
        suggestions.push({
          id: `ai_${word}`,
          question: `Common question about ${word}`,
          suggestedAnswer: `This appears to be a frequently asked question about ${word}. Please provide a specific answer.`,
          confidence: Math.min(count / 5, 0.8),
          timesAsked: count,
          guilds: 1,
          category: 'AI Generated',
          priority: count >= 5 ? 'high' : 'medium',
          reason: `AI detected ${word} as a frequently mentioned topic`
        });
      }
    });
  
  return suggestions;
}

module.exports = requireRole('admin')(handler); 