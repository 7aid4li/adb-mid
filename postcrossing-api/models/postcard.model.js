const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postcardSchema = new Schema({
    postcardID: { type: String, required: true, unique: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    countryFrom: { type: String, required: true },
    countryTo: { type: String, required: true },
    sentDate: { type: Date, required: true },
    receivedDate: { type: Date },
    status: { type: String, enum: ['sent', 'received', 'expired'], default: 'sent' },
    message: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
}, {
    timestamps: true,
});

const Postcard = mongoose.model('Postcard', postcardSchema);
module.exports = Postcard;
