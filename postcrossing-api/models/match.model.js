const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchSchema = new Schema({
    initiatorPostcardId: { type: Schema.Types.ObjectId, ref: 'Postcard', required: true },
    reciprocalPostcardId: { type: Schema.Types.ObjectId, ref: 'Postcard', required: true },
    createdAt: { type: Date, default: Date.now },
});

const Match = mongoose.model('Match', matchSchema);
module.exports = Match;
