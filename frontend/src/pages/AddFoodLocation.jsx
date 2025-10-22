import React, { useState } from 'react';
import '../index.css';

function AddFoodLocation() {
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleCreate = async (
    locationName,
    locationAddress,
    postalCode,
    country,
    city,
    genre,
    description
  ) => {
    try {
      let createResponse = await fetch('/api/locations/create-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          foodLocationName: locationName,
          address: locationAddress,
          postalCode: postalCode,
          country: country,
          city: city,
          genre: genre,
          description: description,
        }),
      });
      createResponse = await createResponse.json();
      if (!createResponse.success) {
        setError(createResponse.error);
      } else {
        setError(null);
        setStatus('success');
      }
    } catch (e) {
      console.log('Something weird happened');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleCreate(
      locationName,
      locationAddress,
      postalCode,
      country,
      city,
      genre,
      description
    );
  };

  return (
    <div className="no-scroll">
      <div
        className="container mt-5 d-flex justify-content-center align-items-center"
        style={{ minHeight: '100vh' }}
      >
        <div className="col-12 col-md-6 col-lg-4">
          <h2 className="text-center mb-4 text-light">Add food location</h2>
          {status === 'error' && <div className="alert alert-danger">{error}</div>}
          {status === 'success' && (
            <div className="alert alert-success">Successfully added food location</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="locationName" className="form-label text-center text-light">
                Location name
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="locationName"
                maxLength="50"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label text-center text-light">
                Address
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="address"
                value={locationAddress}
                maxLength="150"
                onChange={(e) => setLocationAddress(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="postalCode" className="form-label text-center text-light">
                Postal code
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="postalCode"
                value={postalCode}
                maxLength="10"
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="country" className="form-label text-center text-light">
                Country
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="country"
                value={country}
                maxLength="50"
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="city" className="form-label text-center text-light">
                City
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="city"
                value={city}
                maxLength="100"
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="genre" className="form-label text-center text-light">
                Genre
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="genre"
                value={genre}
                maxLength="50"
                onChange={(e) => setGenre(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label text-center text-light">
                Description
              </label>
              <textarea
                className="form-control form-control-sm"
                id="description"
                value={description}
                maxLength="255`"
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="d-flex justify-content-center mb-5">
              <button type="submit" className="button w-50">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddFoodLocation;
