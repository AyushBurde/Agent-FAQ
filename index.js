require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const { getEmbedding } = require('./backend/embedding');
const { cosineSimilarity } = require('./backend/similarity');
const mongoose = require('mongoose');
const Faq = require('./models/Faq');
const UnknownQuestion = require('./models/UnknownQuestion');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: ['CHANNEL'],
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB error", err));

// Map to track admins who have pending FAQ reply requests (adminId => { guildId, question })
const pendingFaqReplies = new Map();

// Put your admin Discord user ID here:
const adminId = '974589644723326997';

client.once('ready', () => {
  console.log(`🤖 Bot is online as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const isDM = message.channel.type === 1;

  // Handle admin replies in DMs (answering unknown questions)
  if (isDM) {
    const pending = pendingFaqReplies.get(message.author.id);
    if (pending) {
      const { guildId, question } = pending;

      // Admin chooses to skip saving answer
      if (message.content.toLowerCase().trim() === 'skip') {
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

      // Save new FAQ entry in DB
      await Faq.create({
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
  }

  // Only handle messages inside guilds
  if (!message.guild) return;

  const guildId = message.guild.id;
  const userMsg = message.content.toLowerCase().trim();

;

  // Load all FAQs for the guild
  const faqs = await Faq.find({ guildId });
  if (!faqs.length) {
    await message.channel.send("🤔 No FAQs found yet.");
    return;
  }

  // Get embedding for user's message
  const userEmbedding = await getEmbedding(userMsg);
  if (!userEmbedding) return;

  const cleanedMsg = userMsg.replace(/<@!?\d+>/g, '').trim();

  // Find best matching FAQ using cosine similarity
  let bestMatch = null;
  let bestScore = 0.0;
  for (const faq of faqs) {
    const score = cosineSimilarity(userEmbedding, faq.embedding);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = faq;
    }
  }

  // If good match found, reply with answer
  if (bestScore >= 0.85) {
    console.log(`🧠 Matched with "${bestMatch.question}" in guild ${guildId} (score: ${bestScore.toFixed(2)})`);
    await message.channel.send(bestMatch.answer);
    return;
  }

  console.log("🔍 User question:", userMsg);
  console.log("📘 Matched FAQ:", bestMatch?.question);
  console.log("📊 Similarity score:", bestScore)


  // Handle unknown question tracking
  let unknown = await UnknownQuestion.findOne({ guildId, text: userMsg });

  if (unknown) {
    // Increment count since question was asked again
    unknown.count++;
    await unknown.save();

    // Notify admin only when count reaches 3
    if (unknown.count === 3) {
      try {
        const adminUser = await client.users.fetch(adminId);
        if (adminUser) {
          await adminUser.send(
            `❓ The question **"${userMsg}"** has been asked 3 times in **${message.guild.name}** by different users.\n` +
            `Reply with an answer or type \`skip\` to ignore.`
          );

          // Track this question pending reply from admin
          pendingFaqReplies.set(adminUser.id, { guildId, question: userMsg });
        }
      } catch (err) {
        console.error("Failed to send DM to admin:", err);
      }

      // Remove this unknown question so admin is not spammed repeatedly
      await UnknownQuestion.deleteOne({ _id: unknown._id });

      return;
    }
  } else {
    // First time this unknown question was asked, save with count = 1
    await UnknownQuestion.create({
      guildId,
      text: userMsg,
      count: 1,
      embedding: userEmbedding,
    });
  }

  // If no match and no admin notification needed yet, send default message
  await message.channel.send("🤔 I'm not sure how to answer that yet.");
});



client.login(process.env.DISCORD_TOKEN);
