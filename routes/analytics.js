const express = require('express');
const router = express.Router();
const storage = require('../utils/storage');

router.get('/', async (req, res) => {
    try {
        const stats = await storage.getStats();
        const unknowns = await storage.getUnknownQuestions();

        // Sort by count desc
        const pendingQuestions = unknowns
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
            .map(q => ({
                question: q.text,
                count: q.count,
                guildId: q.guildId || 'default'
            }));

        res.json({
            ...stats, // stats now includes chartData
            pendingQuestions,
            system: {
                description: "Simple Analytics Mode",
                matchedDescription: "Estimated based on FAQ count",
                unmatchedDescription: "Based on recorded unknown questions"
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
