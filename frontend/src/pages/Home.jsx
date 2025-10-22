import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { Link } from 'react-router-dom';
import review from '../components/Review';
import Popular from '../components/Popular';
import HighlyRated from '../components/HighlyRated';

import '../index.css';

function Home() {
  const { user } = useContext(UserContext);
  const [search, setSearch] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState(false);
  const [numReviewsBoxes, setNumReviewsBoxes] = useState([false, false, false]);
  const [ratingBoxes, setRatingBoxes] = useState([false, false, false, false]);
  const [countryBoxes, setCountryBoxes] = useState([false, false, false, false, '']);
  const [searchLocs, setSearchLocs] = useState([]);
  const [searchSummaries, setSearchSummaries] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const processReviewsConds = () => {
    let reviewsConds = 'AND ( ';
    let counter = 0;
    if (numReviewsBoxes[0]) {
      reviewsConds = reviewsConds + `NumReviews >= 5 `;
      counter++;
    }
    if (numReviewsBoxes[1]) {
      if (counter >= 1) {
        reviewsConds = reviewsConds + 'OR ';
      }
      reviewsConds = reviewsConds + `NumReviews BETWEEN 2 and 4 `;
      counter++;
    }
    if (numReviewsBoxes[2]) {
      if (counter >= 1) {
        reviewsConds = reviewsConds + 'OR ';
      }
      reviewsConds = reviewsConds + `NumReviews <= 2 `;
      counter++;
    }

    if (counter === 0) {
      return '';
    } else {
      return reviewsConds + ') ';
    }
  };

  const processRatingsConds = () => {
    let ratingsConds = 'AND ( ';
    let counter = 0;
    if (ratingBoxes[0]) {
      ratingsConds = ratingsConds + `TotalScore > 4 `;
      counter++;
    }
    if (ratingBoxes[1]) {
      if (counter >= 1) {
        ratingsConds = ratingsConds + 'OR ';
      }
      ratingsConds = ratingsConds + `TotalScore BETWEEN 3 and 4 `;
      counter++;
    }
    if (ratingBoxes[2]) {
      if (counter >= 1) {
        ratingsConds = ratingsConds + 'OR ';
      }
      ratingsConds = ratingsConds + `TotalScore BETWEEN 2 and 3 `;
      counter++;
    }
    if (ratingBoxes[3]) {
      if (counter >= 1) {
        ratingsConds = ratingsConds + 'OR ';
      }
      ratingsConds = ratingsConds + `TotalScore < 2 `;
      counter++;
    }

    if (counter === 0) {
      return '';
    } else {
      return ratingsConds + ') ';
    }
  };

  const processCountryConds = () => {
    let countryConds = 'AND ( ';
    let counter = 0;
    if (countryBoxes[0]) {
      countryConds = countryConds + `Country = 'Canada' `;
      counter++;
    }
    if (countryBoxes[1]) {
      if (counter >= 1) {
        countryConds = countryConds + 'OR ';
      }
      countryConds = countryConds + `Country = 'France' `;
      counter++;
    }
    if (countryBoxes[2]) {
      if (counter >= 1) {
        countryConds = countryConds + 'OR ';
      }
      countryConds = countryConds + `Country = 'USA' `;
      counter++;
    }
    if (countryBoxes[3]) {
      if (counter >= 1) {
        countryConds = countryConds + 'OR ';
      }
      countryConds = countryConds + `(Lower(Country) LIKE '%${countryBoxes[4]}%') `;
      counter++;
    }

    if (counter === 0) {
      return '';
    } else {
      return countryConds + ') ';
    }
  };

  const constructQueryWhere = () => {
    let query = `(Lower(FoodLocationName) LIKE '%${search.toLowerCase()}%') `;
    if (!advancedFilters) {
      return query;
    }
    let reviewsConds = processReviewsConds();
    let ratingsConds = processRatingsConds();
    let countryConds = processCountryConds();
    query = query + reviewsConds + ratingsConds + countryConds;

    return query;
  };

  // FYI, this returns the full FoodLocation and FoodLocationSummary for each search result.
  const sendSearch = async (e) => {
    e.preventDefault();
    setAdvancedFilters(false);
    setNumReviewsBoxes([false, false, false]);
    setRatingBoxes([false, false, false, false]);
    setCountryBoxes([false, false, false, false, '']);
    try {
      let queryWhere = constructQueryWhere();
      const response = await fetch('/api/foodlocation/findLocs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: queryWhere }),
      });
      let res = await response.json();

      if (!response.ok) {
        setError(res.error);
        return null;
      }
      const foodLocations = res['FoodLocations'];
      if (typeof foodLocations === 'object') {
        setSearchLocs(foodLocations);
        let summariesArr = Array(foodLocations.length);
        let counter = 0;
        for (const result of foodLocations) {
          summariesArr[counter] = await getFLSummary(result);
          counter++;
        }
        setSearchSummaries(summariesArr);
      } //hi

      if (foodLocations.length === 0) {
        setMessage('No results found.');
      } else {
        setMessage(`${foodLocations.length} result${foodLocations.length === 1 ? '' : 's'} found`);
      }

      return null;
    } catch (e) {
      console.log('something weird happened');
      return null;
    }
  };

  const getFLSummary = async (foodLocationObj) => {
    const response = await fetch('/api/foodlocationsummary/get-foodlocationsummary-obj', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        flName: foodLocationObj[0],
        address: foodLocationObj[1],
        postalCode: foodLocationObj[2],
        country: foodLocationObj[3],
      }),
    });
    let res = await response.json();
    const summary = res['data'];
    if (typeof summary === 'object') {
      return summary[0];
    }

    if (!response.ok) {
      setError(res.error);
      return null;
    }
  };

  // To display a dynamic number of results, I figure something like this would work nice.
  const displayResults = () => {
    let dispArray = [];
    if (searchLocs === []) {
      return dispArray;
    } else {
      for (const result of searchSummaries) {
        dispArray.push(
          <div className="row mb-3">
            <Link to={`/location/${result[3]}/${result[6]}/${result[5]}/${result[4]}`}>
              View {result[3]}, {result[4]}, {result[5]}, {result[6]}
            </Link>
            {result[2]}
          </div>
        );
      }
    }
    return dispArray;
  };

  const Checkbox = ({ label, value, onChange, text }) => {
    return (
      <div className="row">
        <label>
          <input type="checkbox" checked={value} onChange={onChange} />
          {label}
        </label>
        {text}
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-light text-center mt-3">
        Hi {user.firstName} {user.lastName}! What can I do for you today?
      </h1>
      <div className="container mt-4 d-flex justify-content-center">
        <form className="d-flex" style={{ width: '40%' }} role="search" onSubmit={sendSearch}>
          <input
            className="form-control"
            type="search"
            placeholder="Search locations..."
            aria-label="Search"
            title="Enter a search term"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="button" type="submit" disabled={search.trim() === ''}>
            Search
          </button>
        </form>
      </div>
      <button
        className="button"
        disabled={search.trim() === ''}
        onClick={() => {
          setAdvancedFilters(!advancedFilters);
          setNumReviewsBoxes([false, false, false]);
          setRatingBoxes([false, false, false, false]);
          setCountryBoxes([false, false, false, false, '']);
        }}
      >
        {advancedFilters ? <div>Hide advanced filters</div> : <div>Show advanced filters</div>}
      </button>
      {advancedFilters ? (
        <div className="row">
          <div className="col">
            <strong>Number of reviews:</strong>
            <Checkbox
              text="5 or more"
              onChange={() => {
                let reviewsBoxes = numReviewsBoxes;
                reviewsBoxes[0] = !reviewsBoxes[0];
                setNumReviewsBoxes(reviewsBoxes);
              }}
            />
            <Checkbox
              text="2-4"
              onChange={() => {
                let reviewsBoxes = numReviewsBoxes;
                reviewsBoxes[1] = !reviewsBoxes[1];
                setNumReviewsBoxes(reviewsBoxes);
              }}
            />
            <Checkbox
              text="1 or less"
              onChange={() => {
                let reviewsBoxes = numReviewsBoxes;
                reviewsBoxes[2] = !reviewsBoxes[2];
                setNumReviewsBoxes(reviewsBoxes);
              }}
            />
          </div>
          <div className="col">
            <strong>Country:</strong>
            <Checkbox
              text="Canada"
              onChange={() => {
                let cBoxes = countryBoxes;
                cBoxes[0] = !cBoxes[0];
                setCountryBoxes(cBoxes);
              }}
            />
            <Checkbox
              text="France"
              onChange={() => {
                let cBoxes = countryBoxes;
                cBoxes[1] = !cBoxes[1];
                setCountryBoxes(cBoxes);
              }}
            />
            <Checkbox
              text="USA"
              onChange={() => {
                let cBoxes = countryBoxes;
                cBoxes[2] = !cBoxes[2];
                setCountryBoxes(cBoxes);
              }}
            />
            <div className="row mb-3">
              <Checkbox
                text="Other:"
                onChange={() => {
                  let cBoxes = countryBoxes;
                  cBoxes[3] = !cBoxes[3];
                  setCountryBoxes(cBoxes);
                }}
              />
              <input
                placeholder="Start entering a contry..."
                onChange={(e) => {
                  let cBoxes = countryBoxes;
                  cBoxes[4] = e.target.value.toLowerCase();
                  setCountryBoxes(cBoxes);
                }}
              />
            </div>
          </div>
          <div className="col">
            <strong>Average rating:</strong>
            <Checkbox
              text=">4"
              onChange={() => {
                let rBoxes = ratingBoxes;
                rBoxes[0] = !rBoxes[0];
                setRatingBoxes(rBoxes);
              }}
            />
            <Checkbox
              text="3-4"
              onChange={() => {
                let rBoxes = ratingBoxes;
                rBoxes[1] = !rBoxes[1];
                setRatingBoxes(rBoxes);
              }}
            />
            <Checkbox
              text="2-3"
              onChange={() => {
                let rBoxes = ratingBoxes;
                rBoxes[2] = !rBoxes[2];
                setRatingBoxes(rBoxes);
              }}
            />
            <Checkbox
              text="<2"
              onChange={() => {
                let rBoxes = ratingBoxes;
                rBoxes[3] = !rBoxes[3];
                setRatingBoxes(rBoxes);
              }}
            />
          </div>
        </div>
      ) : (
        ''
      )}
      <label className="form-label text-center text-light">{message}</label>
      <div> {displayResults()} </div>

      <Popular />
      <HighlyRated />
    </div>
  );
}

export default Home;
