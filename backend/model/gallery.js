const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    images: [{ type: String }],
    pandel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pandel',
        required: true
    },
    theme: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theme',
        required: true
    },
    year: { type: Number, required: true },

});

module.exports = mongoose.model('Gallery', gallerySchema);
