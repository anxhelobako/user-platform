import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PostList from "../components/PostList";
import "./Posts.css";

const Posts = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10; // Number of posts per page

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  // 🔍 Filter posts based on search query
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 📌 Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="posts-container">
      <h2>📝 All Posts</h2>

      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search posts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      {/* 📝 Display Posts */}
      <PostList posts={currentPosts} setPosts={setPosts} currentUser={currentUser} />

      {/* 🔄 Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          ⬅ Prev
        </button>
        <span> Page {currentPage} </span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev < Math.ceil(filteredPosts.length / postsPerPage) ? prev + 1 : prev
            )
          }
          disabled={currentPage >= Math.ceil(filteredPosts.length / postsPerPage)}
          className="pagination-button"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default Posts;
