
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/authMiddleware');


////////////////////////
// Post Management ////
//////////////////////

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
    const { content } = req.body;
    const user_id = req.user.userId;
    const newPostQuery = 'INSERT INTO posts (user_id, content, created_at) VALUES ($1, $2, NOW()) RETURNING *';
    try {
        const { rows } = await pool.query(newPostQuery, [user_id, content]);
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating post');
    }
});

// PUT endpoint for updating post's content
router.put('/posts/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const user_id = req.user.userId;
    const updatePostQuery = 'UPDATE posts SET content = $1 WHERE id = $2 AND user_id = $3 RETURNING *';
    try {
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
    const user_id = req.user.userId;
    try {
        const result = await pool.query('DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING *', [id, user_id]);
        if (result.rows.length > 0) {
            res.send('Post deleted successfully');
        } else {
            res.status(404).send('Post not found or user not authorized');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

///////////////////////
// Like Management ///
/////////////////////

// Add a like
router.post('/likes', authenticateToken, async (req, res) => {
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

// GET likes count for a post
router.get('/likes/count/:postId', async (req, res) => {
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

// Get all likes (for testing purposes)
router.get('/likes', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM likes');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching all likes:', error);
        res.status(500).send('Unable to fetch likes');
    }
});

// Remove a like
router.delete('/likes', authenticateToken, async (req, res) => {
    const { user_id, post_id } = req.body;
    try {
        await pool.query('DELETE FROM likes WHERE user_id = $1 AND post_id = $2', [user_id, post_id]);
        res.status(200).send('Like removed');
    } catch (error) {
        console.error('Error removing like', error);
        res.status(500).send('Unable to remove like');
    }
});

/////////////////////////
// Comment Management //
///////////////////////

// Add a comment
router.post('/comments', authenticateToken, async (req, res) => {
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
router.get('/comments/post/:post_id', async (req, res) => {
    const { post_id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC', [post_id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching comments', error);
        res.status(500).send('Unable to get comments');
    }
});

// Get all comments (testing purposes only)
router.get('/comments', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM comments');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching all comments:', error);
        res.status(500).send('Unable to fetch comments');
    }
});

// Delete a comment
router.delete('/comments/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM comments WHERE id = $1', [id]);
        res.status(200).send('Comment deleted');
    } catch (error) {
        console.error('Error deleting comment', error);
        res.status(500).send('Unable to remove comment');
    }
});

// Add additional routes for likes and comments if necessary here...

module.exports = router;