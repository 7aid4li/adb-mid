// Middleware to verify the JWT token on protected routes.
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        // The header will look like this: "Bearer eyJhbGciOiJI..."
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ msg: 'No authentication token, authorization denied.' });
        }
const token = authHeader.split(' ')[1]; // Get the token part after "Bearer "
        if (!token) {
            return res.status(401).json({ msg: 'No authentication token, authorization denied.' });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.status(401).json({ msg: 'Token verification failed, authorization denied.' });
        }

        req.user = verified.id;
        next(); // Move on to the next piece of middleware/route logic
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = auth;
