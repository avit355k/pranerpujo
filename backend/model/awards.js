const mongoose = require('mongoose');

const awardSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  awardName: { type: String, required: true },
  category: { type: String },
  description: { type: String },
  pandel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pandel',
    required: true
  }
});

module.exports = mongoose.model('Award', awardSchema);
