const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Query database for a user with provided email
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length > 0) {
            const user = rows[0];

            // Check if user exists and password is correct
            if (await bcrypt.compare(password, user.password)) {
                // Generate JWT token
                const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
                
                // Send token and userId as response
                res.json({ token, userId: user.id }); // Include the userId in the response
            } else {
                // User not found or password does not match
                res.status(400).send("Invalid credentials");
            }
        } else {
            res.status(400).send("User not found");
        }
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;