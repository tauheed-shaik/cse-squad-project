const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg' },
    bio: { type: String, default: 'CSE A Student | Class of 2026' },
    allowAnonymous: { type: Boolean, default: true },
    rollNumber: { type: String, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
