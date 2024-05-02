const express = require('express');
const router = express.Router();
const pool = require('../db'); // Adjust the path as necessary
const { authenticateToken } = require('../middleware/authMiddleware'); // Adjust path as necessary

router.get('/profile/:userId', authenticateToken, async (req, res) => {

        console.log(`Fetching profile for user ID: ${req.params.userId}`);
    
        // Check if the user ID in the token matches the requested user ID
        if (parseInt(req.user.userId, 10) !== parseInt(req.params.userId, 10)) {
            console.log("User ID mismatch.");
            return res.status(403).send("Access Denied");
        }
    
        try {
            // Query the database for the user's profile using userId
            const { rows } = await pool.query('SELECT username, email, bio, handicap FROM users WHERE id = $1', [req.params.userId]);
            if (rows.length > 0) {
                // Send the profile data as response
                res.json(rows[0]);
            } else {
                res.status(404).send("User not found");
            }
        } catch (error) {
            console.error("Error fetching profile:", error.message);
            res.status(500).send("Server error");
        }
});

router.put('/profile/:userId', authenticateToken, async (req, res) => {
    
    console.log(`Updating profile for user ID: ${req.params.userId}`);
    if (parseInt(req.user.userId, 10) !== parseInt(req.params.userId, 10)) {
        console.log("User ID mismatch on update.");
        return res.status(403).send("Access Denied");
    }

    const { email, bio, handicap } = req.body;
    try {
        const updateQuery = 'UPDATE users SET email = $1, bio = $2, handicap = $3 WHERE id = $4';
        await pool.query(updateQuery, [email, bio, handicap, req.params.userId]);
        res.send("Profile updated successfully");
    } catch (error) {
        console.error("Error updating profile:", error.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
