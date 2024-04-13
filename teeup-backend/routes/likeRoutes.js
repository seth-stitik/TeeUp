const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/authMiddleware');

// Add a like
router.post('/', async (req, res) => {
    const { user_id, post_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO likes (user_id, post_id) VALUES ($1, $2) ON CONFLICT (user_id, post_id) DO NOTHING RETURNING *',
            [user_id, post_id]
        );
        if (result.rows.length > 0) {
            res.status(201).json(result.rows[0]); // Like was added successfully
        } else {
            res.status(200).send('Like already exists'); // No new like was added because of conflict
        }
    } catch (error) {
        console.error('Error adding like', error);
        res.status(500).send('Unable to add like');
    }
});

// GET likes for a post
router.get('/count/:postId', async (req, res) => {
    const { postId } = req.params;
    try {
        const result = await pool.query(
            'SELECT COUNT(*) FROM likes WHERE post_id = $1',
            [postId]
        );
        res.json({ postId: postId, count: parseInt(result.rows[0].count) });
    } catch (error) {
        console.error('Error fetching like count:', error);
        res.status(500).send('Unable to fetch like count');
    }
});

// Get all likes (testing purposes only)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM likes');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching all likes:', error);
        res.status(500).send('Unable to fetch likes');
    }
});

// Check if a user has liked a post
router.get('/status/:postId', authenticateToken, async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.userId; // assuming you have user ID available via auth middleware

    try {
        const result = await pool.query(
            'SELECT * FROM likes WHERE post_id = $1 AND user_id = $2',
            [postId, userId]
        );
        if (result.rows.length > 0) {
            res.json({ liked: true });
        } else {
            res.json({ liked: false });
        }
    } catch (error) {
        console.error('Error checking like status:', error);
        res.status(500).send('Unable to check like status');
    }
});

// Remove a like
router.delete('/', async (req, res) => {
    const { user_id, post_id } = req.body;
    try {
        await pool.query('DELETE FROM likes WHERE user_id = $1 AND post_id = $2', [user_id, post_id]);
        res.status(200).send('Like removed');
    } catch (error) {
        console.error('Error removing like', error);
        res.status(500).send('Unable to remove like');
    }
});

module.exports = router;