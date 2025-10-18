const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
    email: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, required: true },
    countryCode: { type: String, required: true },
    profilePictureUrl: { type: String, default: '' },
    bio: { type: String, default: '' },
    joinDate: { type: Date, default: Date.now },
    stats: {
        totalSent: { type: Number, default: 0 },
        totalReceived: { type: Number, default: 0 }
    },
    sentPostcards: [{ type: Schema.Types.ObjectId, ref: 'Postcard' }],
    receivedPostcards: [{ type: Schema.Types.ObjectId, ref: 'Postcard' }],
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
