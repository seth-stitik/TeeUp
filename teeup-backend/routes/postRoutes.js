const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET all posts
router.get('/posts', async (req, res) => {
    try {
        const newPostQuery = 'SELECT * FROM posts ORDER BY created_at DESC';
        const { rows } = await pool.query(newPostQuery);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching posts');
    }
});

// POST a new post
router.post('/posts', authenticateToken, async (req, res) => {
    try {
        const { content } = req.body;
        const user_id = req.user.userId;
        const newPostQuery = 'INSERT INTO posts (user_id, content, created_at) VALUES ($1, $2, NOW()) RETURNING *'; // NOW() is a PostgreSQL function that returns the current date and time

        const { rows } = await pool.query(newPostQuery, [user_id, content]);
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating post');
    }
});

// PUT endpoint for updating post's content
router.put('/posts/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const user_id = req.user.userId; // Verify user owns the post

        //Update post if user is the owner
        const updatePostQuery = 'UPDATE posts SET content = $1 WHERE id = $2 AND user_id = $3 RETURNING *';
        const { rows } = await pool.query(updatePostQuery, [content, id, user_id]);

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).send('Post not found or user not authorized to edit this post');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating post');
    }
});

// DELETE endpoint for removing a post
router.delete('/posts/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.userId; // Assuming your JWT includes the userId

    try {
        const result = await pool.query('DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING *', [id, user_id]);
        if (result.rows.length > 0) {
            res.send('Post deleted successfully');
        } else {
            // No rows affected, could be due to unauthorized access or post not found
            res.status(404).send('Post not found or user not authorized');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


module.exports = router;