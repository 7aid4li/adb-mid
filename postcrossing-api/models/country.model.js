const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const countrySchema = new Schema({
    countryCode: { type: String, required: true, unique: true },
    countryName: { type: String, required: true },
    totalSent: { type: Number, default: 0 },
    totalReceived: { type: Number, default: 0 },
});

const Country = mongoose.model('Country', countrySchema);
module.exports = Country;
