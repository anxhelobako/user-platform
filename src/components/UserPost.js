import React, { useState, useEffect } from "react";

const UserPost = ({ userId }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!userId) return;

    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching user posts:", error));
  }, [userId]);

  return (
    <div>
      <h2>📝 Posts by User {userId}</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <strong>{post.title}</strong>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserPost;
