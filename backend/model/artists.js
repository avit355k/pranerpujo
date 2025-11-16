const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['Artist', 'Idol Artist'], 
        default: 'Others'
    },
    bio: { type: String },
    image: { type: String },

    // Track work yearwise
    works: [{
        year: { type: Number, required: true },
        pandel: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Pandel' 
        },
        theme: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Theme' 
        },
        description: { type: String } // optional description about that year's work
    }]
}, { timestamps: true });

module.exports = mongoose.model('Artist', artistSchema);
