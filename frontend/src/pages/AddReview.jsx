import React, { useContext, useEffect, useState } from 'react';
import '../index.css';
import { UserContext } from '../contexts/UserContext';
import { useNavigate, useParams } from 'react-router-dom';

function AddReview() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { name, country, postalcode, address } = useParams();
  const [waitTimeRating, setWaitTimeRating] = useState('');
  const [serviceRating, setServiceRating] = useState('');
  const [overallRating, setOverallRating] = useState('');
  const [comment, setComment] = useState('');
  // const [summaryID, setSummaryID] = useState('')
  const [dropdownDishes, setDropdownDishes] = useState([]);

  const [dishes, setDishes] = useState([]);
  const [dishError, setDishError] = useState('');

  const [photos, setPhotos] = useState([]);

  // useEffect(async () => {
  //     await getSummaryID();
  // }, []);

  // const getSummaryID = async () => {
  //     try {
  //         const response = await fetch('/api/foodlocationsummary/get-summary-id', {
  //             method: 'POST',
  //             headers: {
  //                 'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify({
  //                 body: JSON.stringify({
  //                     name: name,
  //                     address: address,
  //                     postalCode: postalcode,
  //                     country: country,
  //                 }),
  //             }),
  //         });
  //         const result = await response.json();
  //         if (!response.ok || !result.success) {
  //             console.log(`Error: ${response.status} ${response.statusText}`);
  //         }
  //         setSummaryID(result.summaryID)
  //     } catch (e) {
  //         console.log(e.message);
  //     }
  // }

  const handleAddDish = () => {
    setDishError('');
    setDishes([...dishes, { dishName: '', score: '' }]);
  };

  const handleAddPhoto = () => {
    setPhotos([...photos, { imageURL: '', description: '' }]);
  };

  const handleDishChange = (index, field, value) => {
    const newDishes = [...dishes];
    newDishes[index][field] = value;
    setDishes(newDishes);

    if (field === 'dishName') {
      const isDuplicate = newDishes.some((dish, i) => dish.dishName === value && i !== index);
      if (isDuplicate) {
        setDishError('Each dish must be unique.');
      } else {
        setDishError('');
      }
    }
  };

  const handlePhotoChange = (index, field, value) => {
    const newPhotos = [...photos];
    newPhotos[index][field] = value;
    setPhotos(newPhotos);
  };

  const handleDeleteDish = (index) => {
    const newDishes = dishes.filter((_, i) => i !== index);
    setDishes(newDishes);
  };

  const handleDeletePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/review/post-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: user.userID,
          name: name,
          address: address,
          postalCode: postalcode,
          country: country,
          waitTimeRating: waitTimeRating,
          serviceRating: serviceRating,
          overallRating: overallRating,
          comment: comment,
          dishes: dishes,
          photos: photos,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      alert('Review submitted successfully!');
      navigate(`/location/${name}/${country}/${postalcode}/${address}`);
    } catch (e) {
      console.error('Error retrieving review information:', e);
    }
  };

  const isFormValid = () => {
    const allDishesValid = dishes.every((dish) => dish.dishName !== '' && dish.score !== '');
    const allPhotosValid = photos.every(
      (photo) => photo.imageURL !== '' && photo.description !== ''
    );

    const isUniqueDishes = !dishes.some(
      (dish, index) => dishes.findIndex((d) => d.dishName === dish.dishName) !== index
    );

    return (
      waitTimeRating !== '' &&
      serviceRating !== '' &&
      overallRating !== '' &&
      allDishesValid &&
      allPhotosValid &&
      isUniqueDishes
    );
  };

  const fetchDishesWithFields = async () => {
    try {
      const response = await fetch('/api/dish/get-dish-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          address: address,
          postalCode: postalcode,
          country: country,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        console.error(
          `Error retrieving dish information: ${response.status} ${response.statusText}`
        );
        return false;
      }

      setDropdownDishes(result.data);
      return true;
    } catch (e) {
      console.error('Error retrieving dish information:', e);
      return false;
    }
  };
  useEffect(() => {
    fetchDishesWithFields();
  }, []);

  return (
    <div className="no-scroll">
      <div
        className="container mt-5 d-flex justify-content-center align-items-center"
        style={{ minHeight: '100vh' }}
      >
        <div className="col-12 col-md-6 col-lg-4">
          <h2 className="text-center mb-4 text-light">Restaurant Review</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-center text-light">Wait Time Rating</label>
              <select
                className="form-control form-control-sm"
                value={waitTimeRating}
                onChange={(e) => setWaitTimeRating(e.target.value)}
                required
              >
                <option value="">Score...</option>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label text-center text-light">Service Rating</label>
              <select
                className="form-control form-control-sm"
                value={serviceRating}
                onChange={(e) => setServiceRating(e.target.value)}
                required
              >
                <option value="">Score...</option>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label text-center text-light">Overall Rating</label>
              <select
                className="form-control form-control-sm"
                value={overallRating}
                onChange={(e) => setOverallRating(e.target.value)}
                required
              >
                <option value="">Score...</option>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label text-center text-light">Comments</label>
              <textarea
                className="form-control form-control-sm"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
                maxLength="999"
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-center text-light">Dishes Reviewed</label>
              {dishes.map((dish, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between">
                    <select
                      className="form-control form-control-sm w-50"
                      value={dish.dishName}
                      onChange={(e) => handleDishChange(index, 'dishName', e.target.value)}
                      required
                    >
                      <option value="">Select Food Item</option>
                      {dropdownDishes.map((dropdownDish) => {
                        return (
                          <option value={dropdownDish.dishName}>{dropdownDish.dishName}</option>
                        );
                      })}
                    </select>
                    <select
                      className="form-control form-control-sm w-25"
                      value={dish.score}
                      onChange={(e) => handleDishChange(index, 'score', e.target.value)}
                      required
                    >
                      <option value="">Score...</option>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <option key={rating} value={rating}>
                          {rating}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => handleDeleteDish(index)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
              {dishError && <div className="alert alert-danger">{dishError}</div>}
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={handleAddDish}
              >
                <i className="bi bi-plus-circle"></i> Add Dish
              </button>
            </div>

            <div className="mb-3">
              <label className="form-label text-center text-light">Photos</label>
              {photos.map((photo, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex flex-column">
                    <input
                      type="text"
                      className="form-control form-control-sm mb-2"
                      placeholder="Image URL"
                      value={photo.imageURL}
                      onChange={(e) => handlePhotoChange(index, 'imageURL', e.target.value)}
                      required
                    />
                    <textarea
                      className="form-control form-control-sm mb-2"
                      placeholder="Description"
                      value={photo.description}
                      onChange={(e) => handlePhotoChange(index, 'description', e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeletePhoto(index)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={handleAddPhoto}
              >
                <i className="bi bi-plus-circle"></i> Add Photo
              </button>
            </div>

            <div className="d-flex justify-content-center mb-5">
              <button type="submit" className="button w-50" disabled={!isFormValid()}>
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddReview;
