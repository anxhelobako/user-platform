// src/components/UserProfile.js
import React, { useState, useEffect } from 'react';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return; // Prevent unnecessary API calls if userId is missing

    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return <p>Loading user info...</p>;
  }

  if (error) {
    return <p>Error loading user info: {error}</p>;
  }

  return (
    <div className="user-profile">
      <h3>👤 About the Author</h3>
      {user ? (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Website:</strong> <a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer">{user.website}</a></p>
          <p><strong>Company:</strong> {user.company?.name}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
        </>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default UserProfile;
