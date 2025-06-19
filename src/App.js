import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import { fetchPostsWithOwners, deletePost } from "./api/api";
import Home from "./pages/Home";
import Albums from "./pages/Albums";
import Posts from "./pages/Posts";
import Users from "./pages/Users";
import AddPost from "./pages/AddPost";
import PostDetail from "./components/PostDetails";
import PostList from "./components/PostList";
import PhotoGallery from "./components/PhotoGallery";
import AlbumDetails from "./components/AlbumDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import "./App.css";
import { useUser } from "./store/UserProvider";

const App = () => {
  const { user, setUser, isAuthenticated, setIsAuthenticated } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // // Initialize authentication and data
  // useEffect(() => {
  //   const checkAuthState = () => {
  //     const storedUser = JSON.parse(localStorage.getItem("user"));
  //     if (storedUser) {
  //       setUser(storedUser);
  //       setIsAuthenticated(true);
  //     }
  //   };

  //   checkAuthState();
  //   window.addEventListener('storage', checkAuthState);

  //   return () => {
  //     window.removeEventListener('storage', checkAuthState);
  //   };
  // }, [setUser, setIsAuthenticated]);

  // Fetch posts independently of auth state
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const postsData = await fetchPostsWithOwners();
        setPosts(postsData.slice(0, 10)); // Limit for demo
      } catch (err) {
        setError("Failed to fetch posts");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Enhanced delete handler with error handling
  const handleDelete = async (postId) => {
    try {
      if (!user || user.role !== "admin") {
        throw new Error("You don't have admin privileges");
      }

      setLoading(true);
      const success = await deletePost(postId);
      if (success) {
        setPosts(posts.filter(post => post.id !== postId));
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    window.dispatchEvent(new Event('storage'));
  };

  const handleAddPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const App = () => {
    const [posts, setPosts] = useState([]); // This is the source of truth
  }
  return (
    <Router>
      <div className="container">
        {!isAuthenticated ? (
          <Routes>
            <Route path="*" element={
                <Login 
                  setUser={setUser} 
                  setIsAuthenticated={setIsAuthenticated} 
                />
              } 
            />
          </Routes>
        ) : (
          <>
            <nav className="app-nav">
              <div className="nav-links">
                <Link to="/">🏠 Home</Link>
                <Link to="/posts">📝 Posts</Link>
                <Link to="/albums">📸 Albums</Link>
                <Link to="/users">👥 Users</Link>
                <Link to="/photos">🖼️ Photos</Link>
                <Link to="/add-post">✏️ Add Post</Link>
              </div>
              <div className="user-controls">
                <span className="user-info">
                  {user?.name} ({user?.role})
                </span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </nav>

            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home posts={posts} />} />
                <Route path="/albums" element={<Albums />} />
                <Route path="/albums/:albumId" element={<AlbumDetails />} />
                
                <Route 
                  path="/posts" 
                  element={
                    <PostList 
                      posts={posts} 
                      setPosts={setPosts} 
                      currentUser={user} 
                      handleDelete={handleDelete}
                    />
                  } 
                />
                <Route 
                  path="/posts/:postId" 
                  element={<PostDetail currentUser={user} />} 
                />
                
                <Route 
                  path="/add-post" 
                  element={
                    <AddPost 
                  setPosts={setPosts} />
                  } 
                />
                
                <Route
                  path="/admin/posts"
                  element={
                    <ProtectedRoute user={user} allowedRoles={["admin"]}>
                      <PostList 
                        posts={posts} 
                        setPosts={setPosts} 
                        currentUser={user} 
                        handleDelete={handleDelete}
                      />
                    </ProtectedRoute>
                  }
                />
                
                <Route path="/users" element={<Users currentUser={user} />} />
                <Route path="/photos" element={<PhotoGallery />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </>
        )}
      </div>
    </Router>
  );
};

export default App;