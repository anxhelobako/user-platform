import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PostList from "../components/PostList";
import AddPost from "../pages/AddPost"; // Import AddPost
import { useUser } from "../store/UserProvider"; // Import useUser hook

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false); // ✅ State to control modal visibility

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((res) => res.json())
      .then((data) => setPosts(data.slice(0, 100))) // Show only 100 posts
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  return (
    <div className="posts-container">
      <h2>📝 All Posts</h2>

      {/* ✅ Button to Open Add Post Modal */}
      <button onClick={() => setShowModal(true)} className="add-post-btn">
        ➕ Add New Post
      </button>

      {/* ✅ Add Post Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowModal(false)}>
              ❌
            </button>
            <AddPost setPosts={setPosts} closeModal={() => setShowModal(false)} />
          </div>
        </div>
      )}

      {/* ✅ Post List */}
      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.body.slice(0, 100)}...</p> {/* Truncate body for preview */}
            <Link to={`/posts/${post.id}`} className="view-details-link">
              View Full Post
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
