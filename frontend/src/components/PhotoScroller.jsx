import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { formatISODate } from '../Helper';
import { UserContext } from '../contexts/UserContext';

const PhotoScroller = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likeStatus, setLikeStatus] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    setCurrentIndex(0);
  }, [photos]);

  useEffect(() => {
    const fetchLikesData = async () => {
      const likeStatusData = await Promise.all(
        photos.map((photo) => fetchLikeStatus(photo.photoID))
      );
      setLikeStatus(likeStatusData);
    };

    if (photos.length > 0) {
      fetchLikesData();
    }
  }, [photos]);

  const goLeft = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : photos.length - 1));
  };

  const goRight = () => {
    setCurrentIndex((prevIndex) => (prevIndex < photos.length - 1 ? prevIndex + 1 : 0));
  };

  const handleLike = async (photoID, index) => {
    try {
      const newStatus = !likeStatus[index];
      const apiEndpoint = newStatus ? '/api/photos/like' : '/api/photos/delete-like';

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoID, userID: user.userID }),
      });

      if (response.ok) {
        photos[index].photoLikes = photos[index].photoLikes + (newStatus ? 1 : -1);

        const updatedStatus = [...likeStatus];
        updatedStatus[index] = newStatus;
        setLikeStatus(updatedStatus);
      }
    } catch (err) {
      console.error('Error updating like status:', err);
    }
  };

  const fetchLikeStatus = async (photoID) => {
    try {
      const response = await fetch('/api/photos/photo-liked-by-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoID: photoID, userID: user.userID }),
      });

      const data = await response.json();
      return response.ok && data.isLiked;
    } catch (e) {
      console.error('Error fetching photo like status:', e);
      return false;
    }
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="d-flex align-items-center">
        <button className="btn carrot-btn me-2" onClick={goLeft} disabled={photos.length <= 1}>
          &#8249;
        </button>
        <div
          className="d-flex overflow-hidden"
          style={{
            width: '80%',
            position: 'relative',
            height: 'auto',
          }}
        >
          <div
            className="d-flex transition-all"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: 'transform 0.3s ease-in-out',
              height: 'auto',
            }}
          >
            {photos.map((photo, index) => (
              <div
                key={index}
                className="d-flex flex-column align-items-center"
                style={{
                  flex: '0 0 100%',
                  textAlign: 'center',
                }}
              >
                <img
                  src={photo.imageURL}
                  alt={`Photo ${index + 1}`}
                  style={{
                    width: '100%',
                    maxWidth: '400px',
                    height: 'auto',
                    objectFit: 'contain',
                    borderRadius: '10px',
                  }}
                />
                <div
                  className="mt-2"
                  style={{
                    width: '100%',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px',
                  }}
                >
                  <div style={{ textAlign: 'left', padding: '10px' }}>
                    <div className="d-flex justify-content-center align-items-center">
                      <button
                        className={`btn p-0 ${likeStatus[index] ? 'text-danger' : 'text-muted'}`}
                        onClick={() => handleLike(photo.photoID, index)}
                        style={{ fontSize: '1.5rem', background: 'none', border: 'none' }}
                      >
                        <i className={`bi ${likeStatus[index] ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                      </button>
                      <span
                        className={`ms-2 fs-4 ${
                          likeStatus[index] ? 'text-danger' : 'text-dark'
                        } fw-bold`}
                        id="like-count"
                      >
                        {photos[index].photoLikes}
                      </span>
                    </div>
                    <p className="mb-1" style={{ wordWrap: 'break-word' }}>
                      <strong>Description:</strong> {photo.description}
                    </p>
                    <p className="mb-1" style={{ wordWrap: 'break-word' }}>
                      <strong>Timestamp:</strong> {formatISODate(photo.photoTimestamp)}
                    </p>
                    <p className="mb-1" style={{ wordWrap: 'break-word' }}>
                      <strong>{photo.foodLocationName}</strong>
                    </p>
                    <p className="mb-1" style={{ wordWrap: 'break-word' }}>
                      <strong>{`${photo.address}, ${photo.city}, ${photo.country}`}</strong>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button className="btn carrot-btn ms-2" onClick={goRight} disabled={photos.length <= 1}>
          &#8250;
        </button>
      </div>
    </div>
  );
};

export default PhotoScroller;
