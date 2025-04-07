import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Product() {
  const [backlog, setBacklog] = useState([]);
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false); // Track if the user is authenticated

  // Check if the user is authenticated when the component mounts
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:3000"}/auth/check-auth`, { withCredentials: true });
        setAuthenticated(response.data.authenticated);  // Update authenticated state
      } catch (err) {
        console.error('Error checking authentication:', err);
        setAuthenticated(false);  // Default to not authenticated
      }
    };

    checkAuthentication();
  }, []); // Run only once when the component mounts

  useEffect(() => {
    // Fetch the backlog data if the user is authenticated
    if (authenticated) {
      const fetchBacklog = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:3000"}/api/backlog`, { withCredentials: true });
          setBacklog(response.data.issues);  // Assuming response.data is an array of issues
        } catch (err) {
          setError('Error fetching backlog');
        }
      };

      fetchBacklog();
    }
  }, [authenticated]); // Trigger when authentication changes

  // Redirect the user to the OAuth login URL
  const handleLogin = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:3000"}/auth/atlassian`;  // Redirect to your backend's OAuth route
  };

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:3000"}/auth/logout`, { withCredentials: true });
      setAuthenticated(false);  // Set authenticated to false after logging out
      setBacklog([]);  // Clear the backlog data
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <div className="App">
      <h1>Product Backlog</h1>

      {/* Display login button if the user is not authenticated */}
      {!authenticated ? (
        <button onClick={handleLogin}>Login to JIRA</button>
      ) : (
        <div>
          <button onClick={handleLogout}>Logout</button> {/* Logout button */}
          {error && <p>{error}</p>}
          <ul>
            {backlog.map(issue => (
              <li key={issue.id}>
                <h3>{issue.fields.summary}</h3>
                <p>Priority: {issue.fields.priority.name}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Product;
