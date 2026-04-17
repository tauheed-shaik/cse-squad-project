const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const Memory = require('../models/Memory');
const { upload, cloudinary } = require('../config/cloudinary');
const streamifier = require('streamifier');

// Get all users
router.get('/all', auth, async (req, res) => {
    try {
        const users = await User.find().select('name profilePic allowAnonymous');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get current user
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user profile by ID
router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId || userId === 'undefined' || userId.length < 24) {
            return res.status(400).json({ message: 'Invalid or missing User ID' });
        }
        
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Hero not found in the registry' });
        }
        
        const userMemories = await Memory.find({ userId: userId });
        res.json({ user, memories: userMemories });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update profile
router.put('/update', auth, upload.single('profilePic'), async (req, res) => {
    try {
        const { name, bio, allowAnonymous } = req.body;
        let updateData = { name, bio, allowAnonymous };

        if (req.file) {
            const uploadPromise = new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'cse-profiles', resource_type: 'image' },
                    (error, result) => {
                        if (result) {
                            resolve(result.secure_url);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
            
            updateData.profilePic = await uploadPromise;
        }

        const user = await User.findByIdAndUpdate(req.user, updateData, { new: true }).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
