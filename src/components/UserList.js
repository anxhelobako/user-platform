import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Added to navigate to user profiles or manage them
import "./UserList.css"; // You can style the components here if needed

const UserList = ({ currentUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch all users from the API
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // Check if current user is an admin
  const isAdmin = currentUser?.role === "admin";

  return (
    <div>
      <h2>👥 Users</h2>
      {isAdmin && <p>Admins have full access to all users.</p>}
      
      <div className="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>

            {/* Link to user profile */}
            <Link to={`/users/${user.id}`}>View Profile</Link>

            {/* Only show admin actions for admin users */}
            {isAdmin && (
              <div>
                <button>Edit</button>
                <button>Delete</button>
                <button>View Details</button>
              </div>
            )}

            {/* Allow regular users to edit their own profile */}
            {currentUser?.id === user.id && !isAdmin && (
              <div>
                <button>✏️ Edit My Profile</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
