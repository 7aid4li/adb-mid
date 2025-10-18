// Handles fetching user profiles and their postcard lists.
const router = require('express').Router();
const User = require('../models/user.model');
const Postcard = require('../models/postcard.model');

// --- GET /api/users/:userId ---
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-passwordHash -email'); // Exclude sensitive info
        if (!user) return res.status(404).json({ msg: 'User not found.' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- GET /api/users/:userId/sent ---
router.get('/:userId/sent', async (req, res) => {
    try {
        const postcards = await Postcard.find({ senderId: req.params.userId })
            .select('postcardID countryTo sentDate status');
        res.json(postcards);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- GET /api/users/:userId/received ---
router.get('/:userId/received', async (req, res) => {
    try {
        const postcards = await Postcard.find({ receiverId: req.params.userId })
            .select('postcardID countryFrom receivedDate imageUrl');
        res.json(postcards);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
