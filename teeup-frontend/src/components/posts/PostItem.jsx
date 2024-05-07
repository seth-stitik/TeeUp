import React, { useEffect, useState } from 'react';
import AddCommentForm from './AddCommentForm';

function PostItem({ post, currentUserId, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [likes, setLikes] = useState(0);
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchLikes();
    fetchComments();
  }, [post.id]); // Ensure it re-fetches when post.id changes

  const fetchLikes = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/likes/count/${post.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  
    if (response.ok) {
      const data = await response.json();
      setLikes(data.count);
      setLikedByCurrentUser(data.likedByCurrentUser);
    } else {
      console.error('Failed to fetch likes:', await response.text());
    }
  };

  const toggleLike = async () => {
    const method = likedByCurrentUser ? 'DELETE' : 'POST';
    const body = { user_id: currentUserId, post_id: post.id };
    const response = await fetch('http://localhost:5000/api/likes', {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(body)
    });
  
    if (response.ok) {
      setLikedByCurrentUser(!likedByCurrentUser);
      setLikes(likes + (likedByCurrentUser ? -1 : 1));
    } else {
      console.error('Failed to toggle like', await response.json());
    }
  };  

  const fetchComments = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/comments/post/${post.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Data fetched:", data); // Log to see the fetched data
        setComments(data);
      } else {
        throw new Error('Failed to fetch comments');
      }
    } catch (error) {
      console.error("Fetching error:", error);
    }
  };
  
  const onCommentAdded = (newComment) => {
    setComments(prevComments => [...prevComments, newComment]);
  };

  const deleteComment = async (commentId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (response.ok) {
      fetchComments();  // Re-fetch comments to update the list
    } else {
      console.error('Failed to delete comment');
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/posts/${post.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (response.ok) {
      onDelete(); // Refresh posts in the parent component
    } else {
      alert('Failed to delete post.');
    }
  };

  const handleEdit = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/posts/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ content: editContent }),
    });

    if (response.ok) {
      setIsEditing(false);
      onEdit(); // Optionally refresh or directly update the post list in the parent component
    } else {
      alert('Failed to edit post.');
    }
  };

  return (
    <div key={post.id}>
      {isEditing ? (
        <>
          <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
          <button onClick={handleEdit}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{post.username || 'Anonymous'}</h3>
          <p>{post.content}</p>
          <small>{new Date(post.created_at).toLocaleString()}</small>
          {Number(currentUserId) === post.user_id && (
            <>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </>
          )}
          <button onClick={toggleLike}>{likedByCurrentUser ? 'Unlike' : 'Like'} ({likes})</button>
        </>
      )}
      <AddCommentForm post_id={post.id} onCommentAdded={onCommentAdded} />
      {comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.content}</p>
          <small>Commented by {comment.username} on {new Date(comment.created_at).toLocaleString()}</small>
          {currentUserId === comment.user_id && (
            <button onClick={() => deleteComment(comment.id)}>Delete</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default PostItem;
