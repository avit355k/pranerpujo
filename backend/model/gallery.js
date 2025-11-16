const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    photos: [
        {
            type: String, // image URLs
        },
    ],
    video: { type: String, }, // youtube video URLs
    pandel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pandel',
        required: true
    },
    year: { type: Number, required: true },

}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
