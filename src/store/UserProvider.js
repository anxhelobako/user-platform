// src/store/UserProvider.js
import React, { createContext, useState, useEffect, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    } 
    // else {
    //   // Mock user for demo purposes (remove in production)
    //   const demoUser = { 
    //     id: 1, 
    //     name: "Demo User", 
    //     role: "admin", 
    //     token: "mock-token" 
    //   };
    //   localStorage.setItem("user", JSON.stringify(demoUser));
    //   setUser(demoUser);
    //   setIsAuthenticated(true);
    // }
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        setUser,
        isAuthenticated, 
        setIsAuthenticated,
        logout 
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);