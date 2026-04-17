const express = require('express');
const router = express.Router();
const Memory = require('../models/Memory');
const auth = require('../middleware/auth');
const { upload, cloudinary } = require('../config/cloudinary');
const streamifier = require('streamifier');

// Get all memories (Public view - limited or auth view - full)
router.get('/', async (req, res) => {
    try {
        const memories = await Memory.find().sort({ createdAt: -1 }).populate('userId', 'name profilePic');
        res.json(memories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create memory
router.post('/', auth, upload.single('media'), async (req, res) => {
    try {
        const { title, description, year, tags } = req.body;
        console.log('Upload request received:', { title, year, hasFile: !!req.file });
        
        let mediaUrl = '';
        let mediaType = 'image';

        if (req.file) {
            console.log('File details:', {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            });

            mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
            
            const uploadPromise = new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { 
                        folder: 'cse-memories', 
                        resource_type: mediaType === 'video' ? 'video' : 'auto',
                        chunk_size: 6000000 
                    },
                    (error, result) => {
                        if (error) {
                            console.error('Cloudinary upload error details:', error);
                            reject(error);
                        } else {
                            console.log('Cloudinary upload success status:', result.resource_type);
                            resolve(result.secure_url);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
            
            mediaUrl = await uploadPromise;
        }

        const newMemory = new Memory({
            userId: req.user,
            title,
            description,
            mediaUrl,
            mediaType,
            year,
            tags: tags ? tags.split(',') : []
        });

        const savedMemory = await newMemory.save();
        res.status(201).json(savedMemory);
    } catch (err) {
        console.error('Memory creation failed:', err);
        res.status(500).json({ error: err.message });
    }
});

// Like a memory
router.post('/:id/like', auth, async (req, res) => {
    try {
        const memory = await Memory.findById(req.params.id);
        if (memory.likes.includes(req.user)) {
            memory.likes = memory.likes.filter(id => id.toString() !== req.user);
        } else {
            memory.likes.push(req.user);
        }
        await memory.save();
        res.json(memory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Comment on a memory
router.post('/:id/comment', auth, async (req, res) => {
    try {
        const { text, userName, userPic } = req.body;
        const memory = await Memory.findById(req.params.id);
        memory.comments.push({ userId: req.user, text, userName, userPic });
        await memory.save();
        res.json(memory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a memory
router.delete('/:id', auth, async (req, res) => {
    try {
        const memory = await Memory.findById(req.params.id);
        if (!memory) return res.status(404).json({ message: 'Memory not found' });

        if (memory.userId.toString() !== req.user) {
            return res.status(401).json({ message: 'Unauthorized to delete this memory' });
        }

        await memory.deleteOne();
        res.json({ message: 'Memory deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
