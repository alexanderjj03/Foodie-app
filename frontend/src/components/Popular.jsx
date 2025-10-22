import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Popular = () => {
  const [popularLocations, setPopularLocations] = useState([]);
  const [showLocations, setShowLocations] = useState(false); // State to toggle visibility of the locations

  // Function to fetch the trending summaries when the button is pressed
  const fetchTrendingSummaries = async () => {
    try {
      const response = await fetch('/api/foodlocationsummary/get-popular-summaries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Information retrieved successfully:', result);
      setPopularLocations(result.data);
      setShowLocations(true); // Show locations after data is fetched
    } catch (e) {
      console.error('Error retrieving food location information:', e);
    }
  };

  return (
    <div>
      <h2>Popular Food Locations</h2>
      <div>These locations are highly rated!</div>

      <button
        className="button"
        onClick={() => {
          setShowLocations(!showLocations);
          if (!showLocations) {
            fetchTrendingSummaries();
          }
        }}
      >
        {showLocations ? 'Close' : 'Show Highly Rated Locations'}
      </button>

      {showLocations && popularLocations.length === 0 && <p>No highly rated locations available</p>}

      {showLocations &&
        popularLocations.length > 0 &&
        popularLocations.map((location, index) => (
          <div key={index}>
            <Link
              to={`/location/${location.foodLocationName}/${location.country}/${location.postalCode}/${location.address}`}
            >
              View {location.foodLocationName}, {location.address}, {location.postalCode},{' '}
              {location.country}
            </Link>
          </div>
        ))}
    </div>
  );
};

export default Popular;
