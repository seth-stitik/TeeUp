const express = require('express');
const router = express.Router();
const pool = require('../db');

// Add a like
router.post('/', async (req, res) => {
    const { user_id, post_id } = req.body;
    try {
        const result = await pool.query('INSERT INTO likes (user_id, post_id) VALUES ($1, $2) RETURNING *', [user_id, post_id]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).send('User already liked this post');
        } else {
        console.error('Error adding like', error);
        res.status(500).send('Unable to add like');
        }
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