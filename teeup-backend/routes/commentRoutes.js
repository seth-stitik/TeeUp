const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/authMiddleware');

// Add a comment
router.post('/', async (req, res) => {
    const { user_id, post_id, content } = req.body;
    try {
        // Insert the comment and return the necessary fields including the username
        const result = await pool.query(
            'INSERT INTO comments (user_id, post_id, content, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, content, created_at, user_id',
            [user_id, post_id, content]
        );
        const commentWithUser = await pool.query(
            'SELECT comments.*, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE comments.id = $1',
            [result.rows[0].id] // Using the id of the newly inserted comment
        );
        res.status(201).json(commentWithUser.rows[0]);
    } catch (error) {
        console.error('Error adding comment', error);
        res.status(500).send('Unable to add comment');
    }
});

// Get comments for a post
router.get('/:post_id', async (req, res) => {
    const { post_id } = req.params;
    try {
        const result = await pool.query(
            'SELECT comments.*, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE post_id = $1 ORDER BY created_at ASC', 
            [post_id]
        );
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
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId; // Ensure your auth middleware is providing userId

    try {
        const comment = await pool.query('SELECT * FROM comments WHERE id = $1', [id]);
        if (comment.rows.length > 0 && comment.rows[0].user_id === userId) {
            await pool.query('DELETE FROM comments WHERE id = $1', [id]);
            res.status(200).send('Comment deleted');
        } else {
            res.status(403).send('Unauthorized to delete this comment');
        }
    } catch (error) {
        console.error('Error deleting comment', error);
        res.status(500).send('Unable to remove comment');
    }
});


module.exports = router;