require('dotenv').config({ path: __dirname + '/.env' });
console.log('DEBUG: GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Set' : 'Not Set');
const { Client, GatewayIntentBits } = require('discord.js');
const { getEmbedding } = require('./services/embedding');
const { cosineSimilarity } = require('./services/similarity');
const storage = require('./utils/storage');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: ['CHANNEL'],
});

// Map to track admins who have pending FAQ reply requests (adminId => { guildId, question })
const pendingFaqReplies = new Map();

// Put your admin Discord user ID here:
const adminId = '1318996489607057522';

client.once('ready', () => {
  console.log(`Bot is online as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const isDM = message.channel.type === 1; // DM channel type is 1 in discord.js v14 it might be different, but keeping logic consistent

  // Handle admin replies in DMs (answering unknown questions)
  if (!message.guild && pendingFaqReplies.has(message.author.id)) {
    const pending = pendingFaqReplies.get(message.author.id);
    const { guildId, question } = pending;

    // Admin chooses to skip saving answer
    if (message.content.toLowerCase().trim() === 'skip') {
      // Logic for skipped question - currently just removing pending state
      // In advanced version we could update analytics
      await message.reply("✅ Skipped saving the question.");
      pendingFaqReplies.delete(message.author.id);
      return;
    }

    // Generate embedding for question to save with answer
    const embedding = await getEmbedding(question);
    if (!embedding) {
      await message.reply("❌ Failed to generate embedding.");
      return;
    }

    // Save new FAQ entry in JSON Storage
    await storage.addFaq({
      guildId,
      question,
      answer: message.content.trim(),
      embedding
    });

    await message.reply("✅ New FAQ saved successfully!");
    console.log(`✅ Saved new FAQ for guild ${guildId}: "${question}" -> "${message.content.trim()}"`);

    // Remove pending state for admin
    pendingFaqReplies.delete(message.author.id);
    return;
  }

  // Only handle messages inside guilds
  if (!message.guild) return;

  const guildId = message.guild.id;
  const userMsg = message.content.toLowerCase().trim();

  // Load all FAQs for the guild from JSON Storage
  const allFaqs = await storage.getFaqs();
  // Filter for this guild (if we strictly enforce guild-specific FAQs, otherwise check all "default" or specific)
  const faqs = allFaqs.filter(f => f.guildId === guildId || f.guildId === 'default');

  if (!faqs.length) {
    // No FAQs at all? Just return for now, or maybe default message
    // return; 
  }

  // Get embedding for user's message
  const userEmbedding = await getEmbedding(userMsg);
  if (!userEmbedding) return;

  // Find best matching FAQ using cosine similarity
  let bestMatch = null;
  let bestScore = 0.0;

  for (const faq of faqs) {
    if (!faq.embedding) continue;
    const score = cosineSimilarity(userEmbedding, faq.embedding);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = faq;
    }
  }

  console.log("🔍 User question:", userMsg);
  console.log("📘 Matched FAQ:", bestMatch?.question);
  console.log("📊 Similarity score:", bestScore);

  // Get similarity threshold from settings
  const settings = await storage.getSettings();
  const THRESHOLD = settings.similarityThreshold || 0.85;

  // Check match
  if (bestScore >= THRESHOLD) {
    console.log(`🧠 Matched with "${bestMatch.question}" (score: ${bestScore.toFixed(2)})`);
    console.log(`🧠 Matched with "${bestMatch.question}" (score: ${bestScore.toFixed(2)})`);
    await storage.logActivity('matched', message.author.id); // Log successful match with user ID
    await message.channel.send(bestMatch.answer);
    return;
  }

  // Handle Unknown Question
  // Add to unknown storage
  const unknown = await storage.addUnknownQuestion(userMsg, guildId);

  // Notify admin if count reaches threshold (e.g. 3)
  if (unknown.count === 3) {
    try {
      const adminUser = await client.users.fetch(adminId);
      if (adminUser) {
        await adminUser.send(
          `❓ The question **"${userMsg}"** has been asked 3 times in **${message.guild.name}**.\n` +
          `Reply with an answer or type \`skip\` to ignore.`
        );

        // Track this as pending
        pendingFaqReplies.set(adminUser.id, { guildId, question: userMsg });
      }
    } catch (err) {
      console.error("Failed to send DM to admin:", err);
    }

    // We could technically delete it from 'unknowns' here if we want to reset processing
    // but for now we keep it as record.
    // We could technically delete it from 'unknowns' here if we want to reset processing
    // but for now we keep it as record.
    await storage.logActivity('unmatched', message.author.id); // Log unmatched with user ID
    return;
  } else if (unknown.count === 1) {
    // First time asked
    await storage.logActivity('unmatched', message.author.id); // Log unmatched with user ID
    // await message.channel.send("🤔 I'm not sure how to answer that yet.");
  }

  // Optional: Send default message if no match found
  // await message.channel.send("🤔 I'm not sure how to answer that yet.");
});

client.login(process.env.DISCORD_TOKEN);

