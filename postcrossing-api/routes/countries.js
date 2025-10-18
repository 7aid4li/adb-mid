// Handles fetching country-level statistics.
const router = require('express').Router();
const Country = require('../models/country.model');

// --- GET /api/countries ---
router.get('/', async (req, res) => {
    try {
        // Find all countries and sort by name
        const countries = await Country.find().sort({ countryName: 1 });
        res.json(countries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
