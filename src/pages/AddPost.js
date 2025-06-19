import React, { useState } from "react";
import { useUser } from "../store/UserProvider";
import { createPost } from "../api/api";
import "./AddPost.css";

const AddPost = ({ setPosts }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser(); // Get current user from context

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!title.trim()) {
      setError("Title cannot be empty");
      return;
    }
    if (!body.trim()) {
      setError("Content cannot be empty");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newPost = {
        title,
        body,
        userId: user?.id || 1, // Use logged-in user's ID or fallback
      };

      const createdPost = await createPost(newPost);

      // Verify the post was created successfully
      if (!createdPost?.id) {
        throw new Error("Post creation failed - no ID returned");
      }

      // Update parent component's state
      setPosts(prevPosts => [{
        ...createdPost,
        userId: user?.id || 1, // Ensure correct user ID
        createdAt: new Date().toISOString() // Add timestamp
      }, ...prevPosts]);

      // Reset form
      setTitle("");
      setBody("");
    } catch (error) {
      console.error("Post creation error:", error);
      setError(error.message || "Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-post-container">
      <h2>Create New Post</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="post-title-input"
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <textarea
            placeholder="Write your post content here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="post-content-input"
            rows={6}
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={loading || !title.trim() || !body.trim()}
        >
          {loading ? (
            <>
              <span className="spinner"></span> Creating...
            </>
          ) : (
            "Publish Post"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddPost;