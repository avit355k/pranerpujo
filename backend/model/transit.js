const mongoose = require('mongoose');

const transistModeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    key: { type: String, enum: ['metro', 'train'], required: true, unique: true },
    icon: { type: String, required: true }, // 'train-front' (lucide name or asset key)
    color: { type: String, required: true }, // '#39A78D', the Metro / Local Trains button
    order: { type: Number, default: 0 }, // chip order in the UI
}, { timestamps: true });

const transitLineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    mode: { type: mongoose.Schema.Types.ObjectId, ref: 'TransitMode', required: true, index: true },
    color: { type: String, required: true },
    iconOverride: String,
    order: { type: Number, default: 0 },
}, { timestamps: true });

const stationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: String,
    line: { type: mongoose.Schema.Types.ObjectId, ref: 'TransitLine', required: true },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    sequence: { type: Number, required: true },
    transitTip: String,
    colorOverride: String,
    iconOverride: String,
}, { timestamps: true });
stationSchema.index({ line: 1, sequence: 1 }, { unique: true });

const stationPandalSchema = new mongoose.Schema({
    station: { type: mongoose.Schema.Types.ObjectId, ref: 'Station', required: true, index: true },
    pandal: { type: mongoose.Schema.Types.ObjectId, ref: 'Pandel', required: true },
    sequence: { type: Number, required: true },
    distanceFromStationM: { type: Number, required: true, min: 0 },   // cumulative
    access: {
        mode: { type: String, enum: ['walk', 'rickshaw', 'auto', 'bus'], default: 'walk' },
        minutes: Number,
    },
    tips: String,
}, { timestamps: true });
stationPandalSchema.index({ station: 1, sequence: 1 }, { unique: true });
stationPandalSchema.index({ station: 1, pandal: 1 }, { unique: true });

// --- CREATE AND EXPORT MODELS ---
const TransitMode = mongoose.model("TransitMode", transistModeSchema);
const TransitLine = mongoose.model('TransitLine', transitLineSchema);
const Station = mongoose.model('Station', stationSchema);
const StationPandal = mongoose.model('StationPandal', stationPandalSchema);

module.exports = { TransitMode, TransitLine, Station, StationPandal };