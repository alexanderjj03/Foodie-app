import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const McDonaldsHallOfFame = () => {
  const [search, setSearch] = useState('');
  const [displayResults, setDisplayResults] = useState(false);
  const { userID } = useParams();
  const [hallOfFame, setHallOfFame] = useState([]);

  const sendSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/foodlocation/get-mcd-hall-of-fame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city: search.toLowerCase() }),
      });
      let res = await response.json();
      if (response.ok) {
        setHallOfFame(res.users);
      }
      setDisplayResults(true);
    } catch (err) {
      console.log('something went wrong with fetching');
    }
  };
  return (
    <div className="container d-flex flex-column align-items-center mt-4">
      <h1 className="text-light">Search for GOATs that have been to every McDonald's in a city</h1>
      <div className="w-50">
        <form className="d-flex" role="search" onSubmit={sendSearch}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search for cities"
            aria-label="Search"
            title="Enter a search term"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn carrot-btn" type="submit" disabled={search.trim() === ''}>
            Search
          </button>
        </form>
        <div className="mt-4 w-100 d-flex justify-content-center flex-wrap">
          {hallOfFame.length > 0
            ? hallOfFame.map((user, index) => (
                <div
                  key={index}
                  className="card m-2"
                  style={{
                    width: '18rem',
                    textAlign: 'center',
                    backgroundColor: '#FFD700',
                    color: '#000',
                    border: '2px solid #DAA520',
                    borderRadius: '10px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                    padding: '1rem',
                    fontFamily: "'Times New Roman', serif",
                    fontWeight: 'bold',
                  }}
                >
                  <div className="card-body">
                    <h5
                      className="card-title"
                      style={{
                        textShadow: '1px 1px 2px #B8860B',
                        margin: '0',
                      }}
                    >
                      <Link
                        to={`/profile/${user.userID}`}
                        className="text-decoration-none"
                        style={{ color: 'inherit' }}
                      >
                        {user.firstName} {user.lastName}
                      </Link>
                    </h5>
                  </div>
                </div>
              ))
            : displayResults && <p>No GOATs</p>}
        </div>
      </div>
    </div>
  );
};

export default McDonaldsHallOfFame;
