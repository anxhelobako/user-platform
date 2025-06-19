import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './AlbumDetails.css';

const AlbumDetail = () => {
  const { id } = useParams(); // To get the album ID from the URL
  const [album, setAlbum] = useState({});
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    // Fetching album details
    fetch(`https://jsonplaceholder.typicode.com/albums/${id}`)
      .then((res) => res.json())
      .then((data) => setAlbum(data))
      .catch((error) => console.error('Error fetching album:', error));

    // Fetching photos for the album
    fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${id}`)
      .then((res) => res.json())
      .then((data) => setPhotos(data))
      .catch((error) => console.error('Error fetching photos:', error));
  }, [id]);

  return (
    <div className="album-detail">
      <h2>{album.title}</h2>
      <div className="photos-grid">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-card">
            <img
              src={photo.thumbnailUrl}
              alt={photo.title}
              className="photo-thumbnail"
            />
            <p>{photo.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumDetail;
