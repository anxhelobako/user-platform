import React, { useState, useEffect } from "react";
import { searchPhotos, getCuratedPhotos } from "../api/api";
import "./PhotoGallery.css";

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch curated photos on initial load
  useEffect(() => {
    const fetchInitialPhotos = async () => {
      setIsLoading(true);
      try {
        const data = await getCuratedPhotos(50); // Get 50 curated photos
        setPhotos(data.photos);
      } catch (err) {
        setError("Failed to load photos. Please try again later.");
        console.error("Error fetching photos:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialPhotos();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await searchPhotos(query, 50); // Get 50 photos for the search
      setPhotos(data.photos);
    } catch (err) {
      setError("Failed to search photos. Please try a different query.");
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowCurated = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCuratedPhotos(50);
      setPhotos(data.photos);
      setQuery(""); // Clear search query
    } catch (err) {
      setError("Failed to load curated photos. Please try again.");
      console.error("Curated photos error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="photo-gallery">
      <h2>Photo Gallery</h2>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for photos..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
        <button 
          type="button" 
          onClick={handleShowCurated}
          className="curated-button"
        >
          Show Curated Photos
        </button>
      </form>
      
      {/* Status Messages */}
      {isLoading && <div className="loading">Loading photos...</div>}
      {error && <div className="error">{error}</div>}
      
      {/* Photo Grid */}
      <div className="photo-grid">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-card">
            <img 
              src={photo.src.medium} 
              alt={photo.photographer} 
              loading="lazy"
            />
            <div className="photo-info">
              <p className="photo-title">{photo.photographer}</p>
              <a 
                href={photo.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="photo-link"
              >
                View on Pexels
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;