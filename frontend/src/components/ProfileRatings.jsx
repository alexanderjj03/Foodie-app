import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProfileRatings = () => {
  const [avgRatings, setAvgRatings] = useState({});
  const [showRatings, setShowRatings] = useState(false);
  const { userID } = useParams();

  async function fetchUserRatings() {
    try {
      const response = await fetch('/api/review/get-user-avg-ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Information retrieved successfully:', result);
      setAvgRatings(result.data[0]);
      return result.data;
    } catch (e) {
      console.error('Error retrieving user information:', e);
    }
  }

  const toggleRatingsVisibility = () => {
    fetchUserRatings();
    setShowRatings(!showRatings);
  };

  return (
    <div className="container py-1">
      <div className="text-center">
        <button className={`btn carrot-btn mb-4`} onClick={toggleRatingsVisibility}>
          {showRatings ? 'Close' : "Show User's Average Ratings"}
        </button>
      </div>

      {showRatings && (
        <div className="card mx-auto shadow-lg" style={{ maxWidth: '500px' }}>
          <div className="card-body">
            <h2 className="card-title text-center mb-4">User Ratings</h2>
            {avgRatings ? (
              <>
                <p className="card-text">
                  <strong>Average Overall Rating:</strong>{' '}
                  {Number(avgRatings.averageOverallRating).toFixed(1)}
                </p>
                <p className="card-text">
                  <strong>Average Service Rating:</strong>{' '}
                  {Number(avgRatings.averageServiceRating).toFixed(1)}
                </p>
                <p className="card-text">
                  <strong>Average Wait Time Rating:</strong>{' '}
                  {Number(avgRatings.averageWaitTimeRating).toFixed(1)}
                </p>
              </>
            ) : (
              <p className="text-muted text-center">
                No ratings available. Press the button to fetch ratings.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileRatings;
