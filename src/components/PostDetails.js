import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import UserProfile from "./UserProfile";
import "./PostDetails.css";
import { useUser } from "../store/UserProvider";
import { deletePost } from "../api/api";
import { getRelevantPhoto } from '../api/api';

const PostDetails = ({ currentUser }) => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser(); // Get current logged-in user from context

  useEffect(() => {
    
    const fetchPostData = async () => {
      try {
        setLoading(true);
        // Fetch Post Details
        const postResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
        const postData = await postResponse.json();
        setPost(postData);

        // Fetch Comments
        const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
      } catch (error) {
        setError("Failed to fetch post details");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [postId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      setLoading(true);
      const success = await deletePost(postId);
      if (success) {
        navigate("/posts");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!post) return <h3>Loading post details...</h3>;

  return (
    <div className="post-detail">
      <h2>{post.title}</h2>
      <p>{post.body}</p>

      {/* Current User Info */}
      <div className="current-user-info">
        {user && (
          <p>Logged in as: {user.name} ({user.role})</p>
        )}
      </div>

      {/* Post Author Info */}
      <UserProfile userId={post.userId} />

      {/* Image Placeholder */}
      <div className="post-images">
        <img
          src={`https://via.placeholder.com/600/${postId % 100}`}
          alt="Post Visual"
          className="post-image"
        />
      </div>

      {/* Delete Button (only for admin) */}
      {user?.role === "admin" && (
        <button 
          onClick={handleDelete}
          className="delete-button"
          disabled={loading}
        >
          {loading ? 'Deleting...' : '🗑️ Delete Post'}
        </button>
      )}

      {/* Comments Section */}
      <h3>💬 Comments ({comments.length})</h3>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <div className="comments-container">
          {comments.map((comment) => (
            <div key={comment.id} className="comment-card">
              <h4>{comment.name}</h4>
              <p>{comment.body}</p>
              <p className="comment-email">{comment.email}</p>
            </div>
          ))}
        </div>
      )}

      <Link to="/posts" className="back-link">← Back to Posts</Link>
    </div>
  );
};

export default PostDetails;