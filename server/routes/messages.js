const express = require('express');
const router = express.Router();
const AnonymousMessage = require('../models/AnonymousMessage');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Send anonymous message
router.post('/send', async (req, res) => {
    try {
        const { toUserId, message } = req.body;
        const user = await User.findById(toUserId);
        if (!user || !user.allowAnonymous) {
            return res.status(400).json({ message: 'User does not accept anonymous messages' });
        }

        const newMessage = new AnonymousMessage({ toUserId, message });
        await newMessage.save();
        res.status(201).json({ message: 'Message sent anonymously' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get my anonymous messages
router.get('/my-messages', auth, async (req, res) => {
    try {
        const messages = await AnonymousMessage.find({ toUserId: req.user }).sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
