import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useUser } from "../store/UserProvider";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {setUser,setIsAuthenticated}=useUser()

  const handleLogin = (e) => {
    e.preventDefault();

    let user = null;

    //   Define users with roles
    if (username === "admin" && password === "admin123") {
      user = { username: "admin", role: "admin" };
    } else if (username === "user" && password === "user123") {
      user = { username: "user", role: "user" };
    }

    if (user) {
      localStorage.setItem("user", JSON.stringify(user)); // Store user object properly
      setUser(user);
      setIsAuthenticated(true);
      navigate("/"); // Redirect to Home
    } else {
      setError("Invalid username or password");
    }
  };

  
  

  return (
    <div className="login-container">
      <h2>🔐 Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
