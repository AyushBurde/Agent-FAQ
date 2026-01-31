const express = require('express');
const router = express.Router();
const storage = require('../utils/storage');
const { getEmbedding } = require('../services/embedding');

// GET all FAQs
router.get('/', async (req, res) => {
    try {
        const faqs = await storage.getFaqs();
        // Sort by createdAt desc if possible, or just reverse
        faqs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        res.json(faqs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST new FAQ
router.post('/', async (req, res) => {
    try {
        const { question, answer, guildId = 'default' } = req.body;

        // Generate embedding
        const embedding = await getEmbedding(question);

        const newFaq = await storage.addFaq({
            question,
            answer,
            guildId,
            embedding
        });

        res.status(201).json(newFaq);
    } catch (error) {
        console.error("Error creating FAQ:", error);
        res.status(500).json({ error: error.message });
    }
});

// PUT update FAQ
router.put('/:id', async (req, res) => {
    try {
        const { question, answer } = req.body;

        let updateData = { question, answer };
        if (question) {
            const embedding = await getEmbedding(question);
            if (embedding) {
                updateData.embedding = embedding;
            }
        }

        const updatedFaq = await storage.updateFaq(req.params.id, updateData);

        if (!updatedFaq) {
            return res.status(404).json({ error: 'FAQ not found' });
        }

        res.json(updatedFaq);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE FAQ
router.delete('/:id', async (req, res) => {
    try {
        const success = await storage.deleteFaq(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'FAQ not found' });
        }
        res.json({ message: 'FAQ deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
