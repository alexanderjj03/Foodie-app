import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { Link } from 'react-router-dom';
import CommentSection from './CommentSection';
import PhotoScroller from './PhotoScroller';
import { ADMIN_UUID, formatISODate } from '../Helper';

function Review({ ReviewID }) {
  const { user } = useContext(UserContext);
  const [reviewID] = useState(ReviewID);
  const [topComment, setTopComment] = useState(null);
  const [error, setError] = useState('');
  const [overallRating, setOvrRating] = useState(-1);
  const [serviceRating, setSrvRating] = useState(-1);
  const [waitTimeRating, setWaitRating] = useState(-1);
  const [timeStamp, setTimeStamp] = useState('');
  const [userID, setUser] = useState('');
  const [userName, setUserName] = useState('');
  const [dishReviews, setDishReviews] = useState([]);
  const [reloadTrigger, setReloadTrigger] = useState(false);
  const [photos, setPhotos] = useState([]);

  const handleReload = () => {
    setReloadTrigger(!reloadTrigger);
  };

  const handleDeleteReview = async () => {
    try {
      const response = await fetch(`/api/review/delete-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewID: ReviewID }),
      });

      const res = await response.json();
      if (response.ok && res.success) {
        alert('Review deleted successfully!');
        setReloadTrigger(!reloadTrigger);
      } else {
        setError(res.error || 'Failed to delete the review.');
      }
    } catch (err) {
      console.error('Error while deleting review:', err);
    }
  };

  const getPhotosForReview = async () => {
    try {
      const response = await fetch('/api/photos/get-photos-for-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewID: ReviewID }),
      });
      let res = await response.json();
      if (response.ok) {
        setPhotos(res.photos);
      }
    } catch (err) {
      console.log('Something went wrong with fetching photos.');
    }
  };

  const getTopComment = async () => {
    try {
      const response = await fetch('/api/comments/getTopComment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewID: ReviewID }),
      });
      let res = await response.json();
      if (!response.ok || !res.success) {
        setError(res.error);
      }
      if (res.topComment) {
        setTopComment(res.topComment);
      }
    } catch (e) {
      console.log('Something weird happened while fetching top comment.');
    }
  };

  const getReviewInfo = async () => {
    try {
      const response = await fetch('/api/review/getReviewInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: ReviewID }),
      });
      let res = await response.json();
      if (!response.ok) {
        setError(res.error);
        return null;
      }
      const reviewInfo = res['reviewInfo'][0];
      setOvrRating(reviewInfo.overallRating);
      setSrvRating(reviewInfo.serviceRating);
      setWaitRating(reviewInfo.waitTimeRating);
      setTimeStamp(reviewInfo.reviewTimestamp);
      setUser(reviewInfo.userID);

      getUserInfo(reviewInfo.userID);

      return null;
    } catch (e) {
      console.log('Something weird happened while fetching review info.');
      return null;
    }
  };

  const getDishReviews = async () => {
    try {
      const response = await fetch('/api/review/getDishReviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: ReviewID }),
      });
      let res = await response.json();
      if (!response.ok) {
        setError(res.error);
        return null;
      }
      const dishReviewInfo = res['dishReviews'];
      if (typeof dishReviewInfo === 'object' && dishReviewInfo.length > 0) {
        setDishReviews(dishReviewInfo);
      }
      return null;
    } catch (e) {
      console.log('Something weird happened while fetching dish reviews.');
      return null;
    }
  };

  const getUserInfo = async (userID) => {
    try {
      const response = await fetch('/api/users/get-user-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID: userID }),
      });
      let res = await response.json();
      const data = res.data;
      if (!response.ok) {
        setError(res.error);
        return null;
      }

      setUserName(data.firstName + ' ' + data.lastName);
    } catch (e) {
      console.log('Something weird happened while fetching user info.');
      return null;
    }
  };

  useEffect(() => {
    getReviewInfo();
    getDishReviews();
    getTopComment();
    getPhotosForReview();
  }, [reviewID, reloadTrigger]);

  return (
    <div className="container my-4">
      {userName !== '' && (
        <div
          className="card mb-3 shadow-sm"
          style={{ backgroundColor: '#f4dfd0', color: '#4a4a4a' }}
        >
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0 text-primary">
              Review by{' '}
              <Link to={`/profile/${userID}`} className="text-decoration-none text-primary">
                {userName}
              </Link>
            </h5>
            {(user.userID === userID || user.userID === ADMIN_UUID) && (
              <button className="btn btn-danger btn-sm" onClick={handleDeleteReview}>
                <i className="bi bi-trash"></i> Delete
              </button>
            )}
          </div>
          <div className="card-body">
            <p className="mb-2 text-muted">
              <i className="bi bi-clock"></i> <strong>Visited:</strong> {formatISODate(timeStamp)}
            </p>
            <p>
              <strong>Overall Rating:</strong> <span className="text-warning">{overallRating}</span>
            </p>
            <p>
              <strong>Service Rating:</strong> <span className="text-success">{serviceRating}</span>
            </p>
            <p>
              <strong>Wait Time Rating:</strong> <span className="text-info">{waitTimeRating}</span>
            </p>
            <div>
              <strong>Dish Ratings:</strong>
              {dishReviews.length > 0 ? (
                dishReviews.map((dishReview, index) => (
                  <div key={index}>
                    <strong>{dishReview[1]}:</strong> {dishReview[2]}
                  </div>
                ))
              ) : (
                <p>No dish ratings available</p>
              )}
            </div>
          </div>
          {topComment && (
            <div className="card-footer" style={{ backgroundColor: '#f4dfd0', color: '#4a4a4a' }}>
              <h6 className="text-secondary">Comments:</h6>
              <CommentSection comments={[topComment]} onReload={handleReload} />
            </div>
          )}
        </div>
      )}
      <div className="mt-4 w-100 d-flex">
        {photos.length > 0 && <PhotoScroller photos={photos} />}
      </div>
    </div>
  );
}

export default Review;
