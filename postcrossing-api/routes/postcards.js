// Handles the core logic: requesting and registering postcards.
const router = require('express').Router();
const auth = require('../middleware/auth');
const Postcard = require('../models/postcard.model');
const User = require('../models/user.model');
const Country = require('../models/country.model');
const Match = require('../models/match.model');
const mongoose = require('mongoose');

// --- POST /api/postcards/request ---
// This is the "Send a Card" logic.
router.post('/request', auth, async (req, res) => {
    try {
        const sender = await User.findById(req.user);

        // Find a random user who is not the sender and not from the same country
        const recipientCount = await User.countDocuments({
            _id: { $ne: sender._id },
            countryCode: { $ne: sender.countryCode }
        });

        if (recipientCount === 0) {
            return res.status(404).json({ msg: "No available recipients found." });
        }

        const rand = Math.floor(Math.random() * recipientCount);
        const recipient = await User.findOne({
             _id: { $ne: sender._id },
             countryCode: { $ne: sender.countryCode }
        }).skip(rand);


        // Generate a new Postcard ID
        // (This is a simplified example. A real system would be more robust.)
        const country = await Country.findOne({ countryCode: sender.countryCode });
        const newPostcardID = `${sender.countryCode}-${country.totalSent + 1}`;

        // Create the new postcard
        const newPostcard = new Postcard({
            postcardID: newPostcardID,
            senderId: sender._id,
            receiverId: recipient._id,
            countryFrom: sender.countryCode,
            countryTo: recipient.countryCode,
            sentDate: new Date(),
            status: 'sent',
        });

        await newPostcard.save();

        // Update stats
        await User.updateOne({ _id: sender._id }, { $push: { sentPostcards: newPostcard._id }, $inc: { 'stats.totalSent': 1 } });
        await Country.updateOne({ countryCode: sender.countryCode }, { $inc: { totalSent: 1 } });
        await Country.updateOne({ countryCode: recipient.countryCode }, { $inc: { totalReceived: 1 } });


        res.json({
            receiverName: recipient.fullName,
            // In a real app, you'd have an address field. We'll mock it.
            address: `${recipient.fullName}, 123 Main St, Anytown, ${recipient.countryCode}`,
            postcardID: newPostcardID
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- POST /api/postcards/register ---
router.post('/register', auth, async (req, res) => {
    try {
        const { postcardID } = req.body;
        const user = await User.findById(req.user);

        const postcard = await Postcard.findOne({ postcardID });

        if (!postcard) {
            return res.status(404).json({ msg: 'Postcard ID not found.' });
        }
        
        // Verify the current user is the intended receiver
        if (postcard.receiverId.toString() !== user._id.toString()) {
            return res.status(403).json({ msg: 'This postcard is not addressed to you.' });
        }
        
        if (postcard.status === 'received') {
             return res.status(400).json({ msg: 'This postcard has already been registered.' });
        }

        // Update postcard status
        postcard.status = 'received';
        postcard.receivedDate = new Date();
        await postcard.save();

        // Update receiver's stats
        await User.updateOne({ _id: user._id }, { $push: { receivedPostcards: postcard._id }, $inc: { 'stats.totalReceived': 1 } });


        // --- Reciprocal Match Logic ---
        const reciprocalCard = await Postcard.findOne({
            senderId: user._id, // The current user was the sender
            receiverId: postcard.senderId // The sender of the current card was the receiver
        });

        if (reciprocalCard) {
            const newMatch = new Match({
                initiatorPostcardId: reciprocalCard._id,
                reciprocalPostcardId: postcard._id,
                createdAt: new Date()
            });
            await newMatch.save();
        }

        res.json({ status: 'success', postcard });

    } catch (err) {
         res.status(500).json({ error: err.message });
    }
});


module.exports = router;
