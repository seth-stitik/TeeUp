const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/', async (req, res) => {
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

module.exports = router;
