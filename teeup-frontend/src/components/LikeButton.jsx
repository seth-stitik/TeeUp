import React, { useState, useEffect } from 'react';

function LikeButton({ postId }) {
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const token = localStorage.getItem('token');  // Define token here so it's accessible everywhere in this component

  useEffect(() => {
    // Fetch the initial like count
    fetch(`http://localhost:5000/api/likes/count/${postId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setLikeCount(data.count);
    });

    // Checking if user has liked post
    fetch(`http://localhost:5000/api/likes/status/${postId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setLiked(data.liked));  // Adjust according to the actual response key
  }, [postId, token]);  // Include token in the dependency array to ensure it's captured if it changes

  const handleLike = () => {
    const method = liked ? 'DELETE' : 'POST';
    fetch(`http://localhost:5000/api/likes`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // Use token here
      },
      body: JSON.stringify({ user_id: localStorage.getItem('userId'), post_id: postId })
    }).then(response => {
      if (response.ok) {
        setLiked(!liked);
        setLikeCount(prev => liked ? prev - 1 : prev + 1);
      }
    });
  };

  return (
    <div>
        <button onClick={handleLike}>
            {liked ? 'Unlike' : 'Like'} {likeCount}
        </button>
    </div>
  );
}

export default LikeButton;
