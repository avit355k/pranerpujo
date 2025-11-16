const mongoose = require('mongoose');

const pandelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: {
        city: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    logo: { type: String },
    address: { type: String, required: true },
    founded: { type: Number }, // Year established
    type: {
        type: String,
        enum: ['Barowari', 'Bonedi Bari'],
        required: true
    },
    zone: {
        type: String,
        enum: ['North Kolkata', 'South Kolkata', 'North & East City', 'Behala', 'Haridevpur & Others', 'SaltLake & Central', 'Bonedi Bari'],
        required: true
    },
    heritageStatus: { type: Boolean, default: false },
    nearestLocation: {
        metro: { type: String },
        railway: { type: String },
        bus: { type: String },  // <-- Changed from Number to String
    },
    contactNumbers: [{ type: String }],  // <-- Supports multiple numbers
    email: { type: String },
    socialLinks: {
        facebook: { type: String },
        website: { type: String }
    },
}, { timestamps: true });

module.exports = mongoose.model('Pandel', pandelSchema);
