import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com";

// Helper function to get current user
const getCurrentUser = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user || { id: 1, role: "user" }; // Default fallback
};

// Pexels API Configuration
const PEXELS_API_KEY = 'd4OJc8qGwCLfs40Ucp37dYEMapJ0reZYxsFoUiRuNNBDD9mnnLXC6t2a'; // Replace with your actual API key
const PEXELS_BASE_URL = 'https://api.pexels.com/v1';

// Pexels API Functions
export const searchPhotos = async (query, perPage = 15) => {
  try {
    const response = await fetch(
      `${PEXELS_BASE_URL}/search?query=${encodeURIComponent(query)}&per_page=${perPage}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Pexels API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching photos from Pexels:', error);
    throw error;
  }
};


export const getCuratedPhotos = async (perPage = 15) => {
  try {
    const response = await fetch(
      `${PEXELS_BASE_URL}/curated?per_page=${perPage}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Pexels API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching curated photos from Pexels:', error);
    throw error;
  }
};

export const getRelevantPhoto = async (query) => {
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
      {
        headers: {
          Authorization: PEXELS_API_KEY
        }
      }
    );
    
    if (!response.ok) throw new Error('Failed to fetch relevant photo');
    
    const data = await response.json();
    return data.photos[0]?.src.medium || null;
  } catch (error) {
    console.error('Error fetching relevant photo:', error);
    return null;
  }
};

// User-related functions
export const getUsers = () => axios.get(`${API_URL}/users`);

export const getUserPosts = (userId) => 
  axios.get(`${API_URL}/posts?userId=${userId}`).then(response => ({
    ...response,
    data: response.data.map(post => ({
      ...post,
      userId // Ensure userId is set
    }))
  }));

// Post-related functions
export const createPost = async (postData) => {
  const currentUser = getCurrentUser();
  try {
    const response = await axios.post(`${API_URL}/posts`, {
      ...postData,
      userId: currentUser.id
    }, {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    });
    return {
      ...response.data,
      userId: currentUser.id, // Ensure correct owner
      createdAt: new Date().toISOString() // Add timestamp
    };
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }
};

export const fetchPostsWithOwners = async () => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    return response.data.map(post => ({
      ...post,
      userId: post.userId || Math.floor(Math.random() * 10) + 1,
      createdAt: post.createdAt || new Date().toISOString()
    }));
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const updatePost = async (postId, updatedPost) => {
  const currentUser = getCurrentUser();
  try {
    // Verify ownership
    const originalPost = await axios.get(`${API_URL}/posts/${postId}`);
    if (currentUser.role !== "admin" && currentUser.id !== originalPost.data.userId) {
      throw new Error("You can only edit your own posts");
    }

    const response = await axios.put(`${API_URL}/posts/${postId}`, {
      ...updatedPost,
      userId: originalPost.data.userId // Preserve original owner
    }, {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${currentUser.token || ''}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

export const patchPost = async (postId, updatedFields) => {
  const currentUser = getCurrentUser();
  try {
    const originalPost = await axios.get(`${API_URL}/posts/${postId}`);
    if (currentUser.role !== "admin" && currentUser.id !== originalPost.data.userId) {
      throw new Error("Unauthorized edit attempt");
    }

    const response = await axios.patch(`${API_URL}/posts/${postId}`, updatedFields, {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${currentUser.token || ''}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error patching post:", error);
    throw error;
  }
};

export const deletePost = async (postId) => {
  const currentUser = getCurrentUser();
  try {
    if (currentUser.role !== "admin") {
      throw new Error("Admin privileges required");
    }

    const response = await axios.delete(`${API_URL}/posts/${postId}`, {
      headers: {
        'Authorization': `Bearer ${currentUser.token || ''}`
      }
    });
    return response.status === 200;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

// Comment-related functions
export const getPostComments = (postId) => 
  axios.get(`${API_URL}/posts/${postId}/comments`);

// Media-related functions
export const getPhotos = async () => {
  try {
    const response = await axios.get(`${API_URL}/photos`);
    return response.data.map(photo => ({
      ...photo,
      userId: Math.floor(Math.random() * 10) + 1
    }));
  } catch (error) {
    console.error("Error fetching photos:", error);
    throw error;
  }
};

export const getAlbums = (userId) => 
  axios.get(`${API_URL}/albums?userId=${userId}`);

export const getTodos = (userId) => 
  axios.get(`${API_URL}/todos?userId=${userId}`);