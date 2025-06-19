import React, { useState } from "react";
import { Link } from "react-router-dom";
import { updatePost, patchPost } from "../api/api";
import './Posts.css';
import { useUser } from "../store/UserProvider";

const PostList = ({ posts, setPosts, handleDelete }) => {
  const [editMode, setEditMode] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedBody, setEditedBody] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const postsPerPage = 5;
  const { user: currentUser } = useUser();

  // Pagination calculations
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const canEditPost = (post) => {
    return currentUser?.role === 'admin' || currentUser?.id === post.userId;
  };

  const handleUpdate = async (postId) => {
    try {
      if (!editedTitle.trim() || !editedBody.trim()) {
        alert("Title and body cannot be empty.");
        return;
      }

      const updatedPost = { 
        title: editedTitle, 
        body: editedBody,
        userId: posts.find(p => p.id === postId).userId
      };
      
      const newPost = await updatePost(postId, updatedPost);
      setPosts(posts.map(post => post.id === postId ? newPost : post));
      setEditMode(null);
    } catch (error) {
      alert(`Update failed: ${error.message}`);
    }
  };

  const startEdit = (post, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canEditPost(post)) {
      alert("You can only edit your own posts");
      return;
    }
    setEditMode(post.id);
    setEditedTitle(post.title);
    setEditedBody(post.body);
  };

  const handleDeleteClick = async (postId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setDeletingId(postId);
      await handleDelete(postId);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="post-list-container">
      <h2>Posts</h2>
      <Link to="/add-post" className="new-post-link">➕ Add New Post</Link>

      <div className="posts-grid">
        {currentPosts.map((post) => (
          <Link 
            to={`/posts/${post.id}`} 
            className="post-card-link"
            key={post.id}
          >
            <div className="post-card">
              {editMode === post.id ? (
                <div className="edit-form" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    placeholder="Post title"
                    className="edit-input"
                  />
                  <textarea
                    value={editedBody}
                    onChange={(e) => setEditedBody(e.target.value)}
                    placeholder="Post content"
                    className="edit-textarea"
                  />
                  <div className="edit-buttons">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdate(post.id);
                      }}
                      className="save-button"
                    >
                      Save
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditMode(null);
                      }}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3>{post.title}</h3>
                  <p>{post.body}</p>
                  <small className="post-meta">Posted by User #{post.userId}</small>

                  <div className="post-actions">
                    {canEditPost(post) && (
                      <button 
                        onClick={(e) => startEdit(post, e)}
                        className="edit-button"
                      >
                        ✏️ Edit
                      </button>
                    )}

                    {currentUser?.role === 'admin' && (
                      <button 
                        onClick={(e) => handleDeleteClick(post.id, e)}
                        disabled={deletingId === post.id}
                        className="delete-button"
                      >
                        {deletingId === post.id ? 'Deleting...' : '🗑️ Delete'}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="page-button"
          >
            ⬅ Previous
          </button>
          
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="page-button"
          >
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
};

export default PostList;