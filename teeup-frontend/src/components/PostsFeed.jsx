import React, { useState, useEffect, useContext } from 'react'; // Import useContext
import { AuthContext } from '../contexts/AuthContext'; // Adjust the import path as necessary
import CreatePost from './CreatePost';
import PostItem from './PostItem';

const PostsFeed = () => {
  const [posts, setPosts] = useState([]);
  const { auth } = useContext(AuthContext); // Use AuthContext to get the auth state
  const currentUserId = auth.userId; // Get currentUserId from the auth state

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
            currentUserId={currentUserId} // Pass currentUserId obtained from AuthContext
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
