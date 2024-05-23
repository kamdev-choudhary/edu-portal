import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function Home() {
  const location = useLocation();
  const [pathSegments, setPathSegments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const segments = location.pathname.split("/").filter((segment) => segment);
    setPathSegments(segments);
  }, [location.pathname]);

  return (
    <div>
      <h1>Home Page</h1>
      <p>Current URL: {location.pathname}</p>
      <p>Path Segments:</p>
      <ul>
        {pathSegments.map((segment, index) => (
          <li key={index}>{segment}</li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
