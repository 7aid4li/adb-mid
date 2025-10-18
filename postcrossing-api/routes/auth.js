// Handles user registration and login.
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// --- POST /api/auth/register ---
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, fullName, countryCode } = req.body;

        // Validation
        if (!username || !email || !password || !fullName || !countryCode) {
            return res.status(400).json({ msg: 'Please enter all fields.' });
        }

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User with this email already exists.' });

        user = await User.findOne({ username });
        if (user) return res.status(400).json({ msg: 'Username is already taken.' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            passwordHash,
            fullName,
            countryCode,
            joinDate: new Date(),
        });

        const savedUser = await newUser.save();

        // Create JWT Token
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- POST /api/auth/login ---
router.post('/login', async (req, res) => {
     try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: 'Please enter all fields.' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials.' });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials.' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
            },
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
