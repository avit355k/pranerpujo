const mongoose = require('mongoose');

const awardSchema = new mongoose.Schema({
  awardName: { type: String, required: true },
  logo: { type: String },
  winners: [
    {
      year: { type: Number },
      pandels: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Pandel',
        },
      ],
    },
  ],
});

module.exports = mongoose.model('Award', awardSchema);
