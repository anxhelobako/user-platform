// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from "../store/UserProvider";
import "./Home.css";
import PostList from "../components/PostList";


const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        // Fetch 9 posts (multiple of 3 for perfect rows)
        const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=9");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Enhance posts with additional data
        const enhancedPosts = data.map(post => ({
          ...post,
          userId: Math.floor(Math.random() * 10) + 1,  // Random user between 1-10
          likes: Math.floor(Math.random() * 100),     // Mock likes count
          comments: Math.floor(Math.random() * 30),   // Mock comments count
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)) // Random date in last 7 days
        }));
        
        // Sort by newest first
        enhancedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setPosts(enhancedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        // You might want to set an error state here for UI display
      } finally {
        setLoading(false);
      }
    };
  
    // Add a small delay to demonstrate loading state (remove in production)
    const timer = setTimeout(() => {
      fetchPosts();
    }, 800);
  
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>Welcome to Our Community</h1>
        <p>Discover and share amazing content with like-minded people</p>
        {user && (
          <Link to="/add-post" className="cta-button">
            Create New Post
          </Link>
        )}
      </section>

      {/* Featured Posts */}
      <section className="featured-posts">
        <div className="section-header">
          <h2>📢 Latest Posts</h2>
          <div className="sort-controls">
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <article 
                key={post.id} 
                className="post-card"
              >
                <div className="card-header">
                  <span className="author-tag">User #{post.userId}</span>
                  {user?.role === 'admin' && (
                    <span className="admin-tag">Admin</span>
                  )}
                </div>
                
                <Link to={`/posts/${post.id}`} className="post-content">
                  <h3>{post.title}</h3>
                  <p>{post.body.substring(0, 100)}...</p>
                </Link>
                
                <div className="card-footer">
                  <div className="post-stats">
                    <span>👍 24</span>
                    <span>💬 8</span>
                  </div>
                  <Link 
                    to={`/posts/${post.id}`} 
                    className="read-more-link"
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      {!user && (
        <section className="newsletter-cta">
          <h3>Join Our Community</h3>
          <p>Sign up to create and save your favorite posts</p>
          <div className="auth-links">
            <Link to="/login" className="auth-btn login-btn">Log In</Link>
            <Link to="/register" className="auth-btn signup-btn">Sign Up</Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;