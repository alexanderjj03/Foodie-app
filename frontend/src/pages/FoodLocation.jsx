import React, { useContext, useEffect, useState } from 'react';
import '../index.css';
import { Link, useParams } from 'react-router-dom';
import Review from '../components/Review';
import { UserContext } from '../contexts/UserContext';
import { ADMIN_UUID, formatISODate } from '../Helper';
import PhotoScroller from '../components/PhotoScroller';

const FoodLocation = () => {
  const { user } = useContext(UserContext);
  const [foodLocationInformation, setFoodLocationInformation] = useState({});
  const [foodLocationSummaryInformation, setFoodLocationSummaryInformation] = useState({});
  const [viewReviews, setViewReviews] = useState(false);
  const [reviewIDs, setReviewIDs] = useState([]);
  const [locationAvgScore, setLocationAvgScore] = useState(0);

  const [showPrice, setShowPrice] = useState(false);
  const [showType, setShowType] = useState(false);
  const [showIsHalal, setShowIsHalal] = useState(false);
  const [showIsGlutenFree, setShowIsGlutenFree] = useState(false);
  const [showIsVegetarian, setShowIsVegetarian] = useState(false);
  const [dishes, setDishes] = useState([]);
  const [limitedTimeDishes, setLimitedTimeDishes] = useState([]);
  const [foodLocationPhotos, setFoodLocationPhotos] = useState([]);

  const routeParams = useParams();

  useEffect(() => {
    fetchFoodlocationInformation()
      .then((foodLocationSummaryID) => {
        fetchFoodlocationSummaryInformation(foodLocationSummaryID);
      })
      .catch((error) => {
        console.error('Error fetching food location info:', error);
      });
    fetchLocationAvgScore();
    fetchReviewIDs();
  }, []);

  const fetchLocationAvgScore = async () => {
    try {
      const response = await fetch('/api/foodlocation/get-location-avg-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: routeParams.name,
          address: routeParams.address,
          postalCode: routeParams.postalcode,
          country: routeParams.country,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setLocationAvgScore(result.avgScore);
    } catch (e) {
      console.error('Error retrieving food location information:', e);
    }
  };

  const fetchFoodlocationInformation = async () => {
    try {
      const response = await fetch('/api/foodlocation/get-foodlocation-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: routeParams.name,
          address: routeParams.address,
          postalCode: routeParams.postalcode,
          country: routeParams.country,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setFoodLocationInformation(result.data[0]);
      return result.data[0].foodLocationSummaryID;
    } catch (e) {
      console.error('Error retrieving food location information:', e);
    }
  };

  const fetchFoodlocationSummaryInformation = async (id) => {
    try {
      const response = await fetch('/api/foodlocationsummary/get-foodlocationsummary-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          foodLocationSummaryID: id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setFoodLocationSummaryInformation(result.data[0]);

      const photosResponse = await fetch('/api/photos/get-foodlocationsummary-photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summaryID: id,
        }),
      });

      if (!photosResponse.ok) {
        throw new Error(`Error getting photos: ${response.status} ${response.statusText}`);
      }

      const photosResult = await photosResponse.json();
      setFoodLocationPhotos(photosResult.photos);
    } catch (e) {
      console.error('Error retrieving food location information:', e);
    }
  };

  const fetchReviewIDs = async () => {
    try {
      const response = await fetch('/api/review/get-review-ids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: routeParams.name,
          address: routeParams.address,
          postalCode: routeParams.postalcode,
          country: routeParams.country,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const reviewIDs = result.data;
      if (typeof reviewIDs === 'object') {
        setReviewIDs(reviewIDs);
      }
    } catch (e) {
      console.error('Error retrieving review information:', e);
    }
  };

  const fetchDishesWithFields = async () => {
    try {
      const response = await fetch('/api/dish/get-dishes-with-fields', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: routeParams.name,
          address: routeParams.address,
          postalCode: routeParams.postalcode,
          country: routeParams.country,
          showPrice: showPrice,
          showType: showType,
          showIsHalal: showIsHalal,
          showIsGlutenFree: showIsGlutenFree,
          showIsVegetarian: showIsVegetarian,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        console.error(
          `Error retrieving dish information: ${response.status} ${response.statusText}`
        );
        return false;
      }

      setDishes(result.data);
      return true;
    } catch (e) {
      console.error('Error retrieving user information:', e);
      return false;
    }
  };

  const getLimitedTime = async () => {
    try {
      const ltResponse = await fetch('/api/dish/get-lt-dish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flName: routeParams.name,
          address: routeParams.address,
          postalCode: routeParams.postalcode,
          country: routeParams.country,
        }),
      });

      const result = await ltResponse.json();
      if (!ltResponse.ok || !result.success) {
        console.error(
          `Error retrieving dish information: ${ltResponse.status} ${ltResponse.statusText}`
        );
        return false;
      }
      setLimitedTimeDishes(result.data);
      console.log(limitedTimeDishes);
      console.log(limitedTimeDishes);
      return true;
    } catch (e) {
      console.error('Error retrieving user information:', e);
      return false;
    }
  };

  const handleSubmitDishFields = async (e) => {
    e.preventDefault();
    const dishesFetched = await fetchDishesWithFields();
    const ltFetched = await getLimitedTime();

    if (!dishesFetched || !ltFetched) {
      alert('Unable to fetch dishes or limited time dishes.');
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-center">
        {user.userID === ADMIN_UUID && (
          <Link
            className="btn carrot-btn mb-3"
            to={`/location/${routeParams.name}/${routeParams.country}/${routeParams.postalcode}/${routeParams.address}/add-dish`}
          >
            Add Dish
          </Link>
        )}
      </div>
      <h1 className="display-4 text-center mb-4">{foodLocationInformation.name}</h1>
      <div className="text-muted text-center mb-3">
        {foodLocationInformation.address}, {foodLocationInformation.city},{' '}
        {foodLocationInformation.country} - {foodLocationInformation.genre}
      </div>

      <div className="d-flex justify-content-center mb-3">
        <div>
          <p className="lead mb-4">{foodLocationSummaryInformation.description}</p>
        </div>
      </div>
      <div className="d-flex justify-content-center mb-3">
        <div>
          <strong>{foodLocationInformation.numReviews}</strong> reviews
        </div>
      </div>

      <div className="d-flex justify-content-center mb-4">
        <div>
          <strong>Rating:</strong> {locationAvgScore}
        </div>
      </div>

      <div className="mt-4 mb-4">
        {foodLocationPhotos.length > 0 && <PhotoScroller photos={foodLocationPhotos} />}
      </div>

      <form className="mb-5" onSubmit={handleSubmitDishFields}>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            onChange={() => setShowPrice(!showPrice)}
            checked={showPrice}
            id="showPrice"
          />
          <label className="form-check-label" htmlFor="showPrice">
            Show price
          </label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            onChange={() => setShowType(!showType)}
            checked={showType}
            id="showType"
          />
          <label className="form-check-label" htmlFor="showType">
            Show type
          </label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            onChange={() => setShowIsHalal(!showIsHalal)}
            checked={showIsHalal}
            id="showIsHalal"
          />
          <label className="form-check-label" htmlFor="showIsHalal">
            Show is halal
          </label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            onChange={() => setShowIsGlutenFree(!showIsGlutenFree)}
            checked={showIsGlutenFree}
            id="showIsGlutenFree"
          />
          <label className="form-check-label" htmlFor="showIsGlutenFree">
            Show is gluten free
          </label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            onChange={() => setShowIsVegetarian(!showIsVegetarian)}
            checked={showIsVegetarian}
            id="showIsVegetarian"
          />
          <label className="form-check-label" htmlFor="showIsVegetarian">
            Show is vegetarian
          </label>
        </div>
        <button type="submit" className="btn carrot-btn mt-3">
          Show dishes
        </button>
      </form>

      {dishes.length > 0 && (
        <div>
          <h2>Dishes</h2>
          <div className="row">
            {dishes.map((dish, index) => (
              <div key={index} className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{dish.dishName}</h5>
                    {dish.price !== undefined && <p>Price: {dish.price.toFixed(2)}</p>}
                    {dish.type !== undefined && <p>Type: {dish.type}</p>}
                    {dish.isHalal !== undefined && <p>Halal: {dish.isHalal ? 'Yes' : 'No'}</p>}
                    {dish.isGlutenFree !== undefined && (
                      <p>Gluten-Free: {dish.isGlutenFree ? 'Yes' : 'No'}</p>
                    )}
                    {dish.isVegetarian !== undefined && (
                      <p>Vegetarian: {dish.isVegetarian ? 'Yes' : 'No'}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {limitedTimeDishes.length > 0 && (
        <div>
          <h2>Limited Time Dishes</h2>
          <div className="row">
            {limitedTimeDishes.map((ltDish, index) => (
              <div key={index} className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{ltDish.dishName}</h5>
                    <p>Start Date: {formatISODate(ltDish.startDate)}</p>
                    <p>End Date: {formatISODate(ltDish.endDate)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        <button className="btn carrot-btn" onClick={() => setViewReviews(!viewReviews)}>
          {!viewReviews ? 'View All Reviews' : 'Close'}
        </button>

        {viewReviews && (
          <div className="mt-4">
            <h2>Reviews</h2>
            <Link
              className="btn carrot-btn mb-3"
              to={`/location/${routeParams.name}/${routeParams.country}/${routeParams.postalcode}/${routeParams.address}/add-review`}
            >
              Add Your Review
            </Link>
            <div className="reviews-list">
              {reviewIDs.length > 0 ? (
                reviewIDs.map((review, index) => (
                  <div key={index} className="review-card mb-3">
                    <Review ReviewID={review.id} />
                  </div>
                ))
              ) : (
                <p>No reviews available to display.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodLocation;
