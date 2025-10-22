import React, { useContext, useEffect, useState } from 'react';
import '../index.css';
import { Link, useParams } from 'react-router-dom';
import Review from './Review';

const UserReviews = () => {
  const { userID } = useParams();
  const [userReviews, setUserReviews] = useState([]);

  useEffect(() => {
    fetchUserReviews();
  }, []);

  async function fetchUserReviews() {
    try {
      const response = await fetch('/api/review/get-user-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: userID,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Information retrieved successfully:', result);
      setUserReviews(result.data);
      return result.data;
    } catch (e) {
      console.error('Error retrieving user information:', e);
    }
  }

  return (
    <div className="app">
      <h1 className="mainheader"> Reviews </h1>
      <div>
        {/*{userReviews.length > 0 ? (*/}
        {/*    userReviews.map((review, index) => (*/}
        {/*        <div className="backgroundreview">*/}
        {/*            <h2>{review.locationName}</h2>*/}
        {/*            <div>{review.locationAddress}, {review.locationPostalCode}, {review.locationCountry}</div>*/}
        {/*            <div>Day visited: {review.dayVisited}, {review.timestamp}</div>*/}
        {/*            <div>Overall rating: {review.overallRating}</div>*/}
        {/*            <div>Service rating: {review.serviceRating}</div>*/}
        {/*            <div>Wait time rating: {review.waitTimeRating}</div>*/}
        {/*        </div>*/}
        {/*    ))*/}
        {/*) : (*/}
        {/*    <p>No reviews available to display.</p>*/}
        {/*)}*/}
        {userReviews.length > 0 ? (
          userReviews.map((review, index) => (
            <div key={index} className="review-card">
              <Review ReviewID={review.reviewID} />
            </div>
          ))
        ) : (
          <p>No reviews available to display.</p>
        )}
      </div>
    </div>
  );
};

export default UserReviews;
