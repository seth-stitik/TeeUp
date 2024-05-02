const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // Adjust the path as necessary

router.post('/signup', async (req, res) => {
    
    const { username, email, password, bio, handicap } = req.body;
   
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Prepare SQL query for inserting new user
        const insertUserQuery = 'INSERT INTO users (username, email, password, bio, handicap) VALUES ($1, $2, $3, $4, $5) RETURNING id';

        // Execute the query and get the user ID
        const { rows } = await pool.query(insertUserQuery, [username, email, hashedPassword, bio, handicap]);
        const userId = rows[0].id;

        // Generate JWT token
        const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: '24h' });

        // Send token as response
        res.status(201).json({ token });
    } catch (error) {
        console.error(error);

        // Send a different status code for duplicate username/email
        if (error.code === '23505') {
            res.status(409).send("Username or email already exists.");
        } else {
            // For other errors, send a generic error response
            res.status(500).send("Error creating user");
        }
    }
});

router.post('/login', async (req, res) => {
    
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
