const mongoose = require('mongoose');

const anonymousMessageSchema = new mongoose.Schema({
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('AnonymousMessage', anonymousMessageSchema);
