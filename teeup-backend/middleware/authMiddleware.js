require('dotenv').config({ path: '../.env' });

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    //Extract the token from the Authorization header
    console.log("Authenticating token...");
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
    
    if (token == null) {
        console.log("No token found.");
        return res.sendStatus(401); // No token, unauthorized
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log("Error verifying token:", err.message);
            return res.sendStatus(403); // Token invalid or expired
        }
        console.log("Token verified, user ID:", user.userId);
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };
