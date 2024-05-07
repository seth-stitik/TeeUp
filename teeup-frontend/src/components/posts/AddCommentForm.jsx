import React, { useState } from 'react';

function AddCommentForm({ post_id, onCommentAdded }) {
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;  // Prevent empty comments
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ post_id, content: comment, user_id: parseInt(localStorage.getItem('user_id')) })
    });
    if (response.ok) {
      const newComment = await response.json();
      onCommentAdded(newComment);
      setComment('');
    } else {
      console.error('Failed to post comment:', await response.text());
    }
  };
  


  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        required
        style={{ flex: 1, marginRight: '10px' }}
      />
      <button type="submit">Comment</button>
    </form>
  );
}

export default AddCommentForm;
