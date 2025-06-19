import React, { useState, useEffect } from "react";
import "../App.css";

const Albums = () => {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/albums")
      .then((res) => res.json())
      .then((data) => setAlbums(data))
      .catch((error) => console.error("Error fetching albums:", error));
  }, []);

  return (
    <div className="container">
      <h2>📸 Albums</h2>
      <div className="albums-grid">
        {albums.map((album) => (
          <div key={album.id} className="album-card">
            <h4>{album.title}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Albums;
