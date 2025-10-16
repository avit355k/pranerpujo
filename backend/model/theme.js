const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
    title: { type: String },
    concept: { type: String },
    mainImage: { type: String },
    year: { type: Number },
    pandel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pandel',
        required: true
    },
    artists: [{
        artist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Artist',
            
        },
        roles: [{
            type: String,
           enum: ['Artist', 'Idol Artist'], 
        }],
        description: { type: String } // optional extra info
    }],
    gallery: [{ type: String }],   // quick inline gallery (optional)
    youtubeLink: { type: String }
});

module.exports = mongoose.model('Theme', themeSchema);
