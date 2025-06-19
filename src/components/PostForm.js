import React, { useState } from "react";

const PostForm = ({ onPostAdded }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPost = {
      title,
      body,
      userId: 1, // Required by JSONPlaceholder API
    };

    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        throw new Error("Failed to add post");
      }

      const data = await response.json();
      console.log("Post created:", data);
      onPostAdded(data); // Update post list in UI

      setTitle(""); // Clear form after submission
      setBody("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <h2>Create a New Post</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Write something..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default PostForm;
