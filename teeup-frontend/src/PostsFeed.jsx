import React, { useState, useEffect } from 'react';
import CreatePost from './CreatePost';
import PostItem from './PostItem';

const PostsFeed = () => {
  const [posts, setPosts] = useState([]);
  const currentUserId = localStorage.getItem('userId'); // Example: Get the current user's ID from localStorage

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts');
      if (!response.ok) {
        throw new Error('Network response was no bueno');
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const refreshPosts = () => {
    fetchPosts(); // Refresh the list of posts after any operation
  };

  return (
    <div>
      <CreatePost onPostCreated={refreshPosts} />
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            currentUserId={currentUserId}
            onDelete={refreshPosts}
            onEdit={refreshPosts}
          />
        ))
      ) : (
        <p>No posts to display.</p>
      )}
    </div>
  );
};

export default PostsFeed;