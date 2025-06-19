import React, { useState, useEffect } from 'react';
import './AlbumList.css';

const AlbumList = () => {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/albums')
      .then((res) => res.json())
      .then((data) => setAlbums(data))
      .catch((error) => console.error('Error fetching albums:', error));
  }, []);

  return (
    <div className="albums-container">
      <h2 className="albums-title">📸 Albums</h2>
      <div className="albums-grid">
        {albums.map((album) => (
          <div key={album.id} className="album-card">
            <img
              className="album-thumbnail"
              src={`https://via.placeholder.com/200x200?text=${album.title}`}
              alt={album.title}
            />
            <h3 className="album-title">{album.title}</h3>
            <p className="album-details">Click to view details</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumList;
