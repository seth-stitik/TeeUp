import React, { useState, useEffect } from 'react';

function Comments({ postId}) {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/api/comments/${postId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => res.json())
        .then(setComments);
        }, [postId]);

        const addComment = (comment) => {
            const token = localStorage.getItem('token');
            fetch(`http://localhost:5000/api/comments`, { // Ensure this doesn't include the post ID in the URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ user_id: localStorage.getItem('userId'), post_id: postId, content: comment })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();  // Convert the response to JSON only if the response is OK
                } else {
                    throw new Error('Failed to post comment');
                }
            })
            .then(newComment => {
                setComments(prev => [...prev, newComment]);
            })
            .catch(error => console.error('Error posting comment:', error));
        };

        const deleteComment = (commentId) => {
            const token = localStorage.getItem('token');
            fetch(`http://localhost:5000/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(response => {
                if (response.ok) {
                    setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
                } else {
                    console.error('Failed to delete comment');
                }
            });
        };
        
return (
    <div>
        {comments.map(comment => (
            <div key={comment.id}>
                <p><strong>{comment.username}</strong>: {comment.content}</p>
                <small>{new Date(comment.created_at).toLocaleString()}</small>
                {localStorage.getItem('userId') === String(comment.user_id) && (
                    <button onClick={() => deleteComment(comment.id)}>Delete</button>
                )}
            </div>
        ))}
        <CommentForm onCommentSubmit={addComment} />
    </div>

);
}

function CommentForm({ onCommentSubmit }) {
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onCommentSubmit(comment);
        setComment('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
            />
            <button type="submit">Add Comment</button>
        </form>
    );
}

export default Comments;