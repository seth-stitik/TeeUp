const express = require('express');
const router = express.Router();
const pool = require('../db');

// Add a comment
router.post('/', async (req, res) => {
    const { user_id, post_id, content } = req.body;
    try {
        const result = await pool.query('INSERT INTO comments (user_id, post_id, content, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *', [user_id, post_id, content]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding comment', error);
        res.status(500).send('Unable to add comment');
    }
});

// Get comments for a post
router.get('/:post_id', async (req, res) => {
    const { post_id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC', [post_id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching comments', error);
        res.status(500).send('Unable to get comments');
    }
});

// Get all likes (testing purposes only)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM comments');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching all comments:', error);
        res.status(500).send('Unable to fetch comments');
    }
});

// Delete a comment
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM comments WHERE id = $1', [id]);
        res.status(200).send('Comment deleted');
    } catch (error) {
        console.error('Error deleting comment', error);
        res.status(500).send('Unable to remove comment');
    }
});

module.exports = router;