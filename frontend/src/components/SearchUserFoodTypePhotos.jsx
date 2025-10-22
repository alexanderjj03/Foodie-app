import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PhotoScroller from './PhotoScroller';

const SearchUserFoodTypePhotos = () => {
  const [search, setSearch] = useState('');
  const { userID } = useParams();
  const [photos, setPhotos] = useState([]);
  const [averagePhotoLikes, setAveragePhotoLikes] = useState(null);
  const [showButton, setShowButton] = useState(true);

  const [displayResults, setDisplayResults] = useState(false);

  const sendSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/photos/get-photos-from-user-of-food-type', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID: userID, type: search.toLowerCase() }),
      });
      let res = await response.json();
      if (response.ok) {
        setPhotos(res.photos);
      }
      setDisplayResults(true);
    } catch (err) {
      console.log('something went wrong with fetching');
    }
  };

  const fetchAveragePhotoLikes = async () => {
    try {
      const response = await fetch('/api/photos/get-user-average-photo-likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID: userID }),
      });
      let res = await response.json();
      if (response.ok) {
        setAveragePhotoLikes(res.averagePhotoLikes);
        setShowButton(false);
      }
    } catch (err) {
      console.log('something went wrong with fetching');
    }
  };
  return (
    <div className="container d-flex flex-column align-items-center mt-4">
      <div className="my-2">
        {showButton && (
          <a
            className="link-primary"
            onClick={fetchAveragePhotoLikes}
            style={{ cursor: 'pointer' }}
          >
            Show user average photo likes
          </a>
        )}
        {averagePhotoLikes && (
          <div>
            <strong>Average Photo Likes:</strong> {averagePhotoLikes}
          </div>
        )}
      </div>
      <div className="w-50">
        <form className="d-flex" role="search" onSubmit={sendSearch}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search for photos of food type..."
            aria-label="Search"
            title="Enter a search term"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn carrot-btn" type="submit" disabled={search.trim() === ''}>
            Search
          </button>
        </form>
      </div>

      <div className="mt-4 w-100 d-flex justify-content-center">
        {photos.length > 0 ? (
          <PhotoScroller photos={photos} />
        ) : (
          displayResults && <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default SearchUserFoodTypePhotos;
