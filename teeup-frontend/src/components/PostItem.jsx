import React, { useState } from 'react';
import LikeButton from './LikeButton';
import Comments from './Comments';

function PostItem({ post, currentUserId, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  const handleDelete = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from where you store it
    const response = await fetch(`http://localhost:5000/api/posts/${post.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      onDelete(); // Refresh posts in the parent component
    } else {
      alert('Failed to delete post.'); // Handle errors
    }
  };

  const handleEdit = async () => {
    const token = localStorage.getItem('token'); // Ensure you're retrieving the stored token correctly
    const response = await fetch(`http://localhost:5000/api/posts/${post.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ content: editContent }),
    });

    if (response.ok) {
      setIsEditing(false); // Exit edit mode
      onEdit(); // Optionally refresh or directly update the post list in the parent component
    } else {
      alert('Failed to edit post.'); // Handle errors
    }
  };

  return (
    <div key={post.id}>
      {isEditing ? (
        <>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <button onClick={handleEdit}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{post.username} - {post.user_id}</h3>
          <p>{post.content}</p>
          <small>{new Date(post.created_at).toLocaleString()}</small>
          <LikeButton postId={post.id} />
          <Comments postId={post.id} />
          {Number(currentUserId) === post.user_id && (
            <>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default PostItem;
