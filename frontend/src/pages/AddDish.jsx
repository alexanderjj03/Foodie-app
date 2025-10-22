import React, { useState, useEffect } from 'react';
import '../index.css';
import { useNavigate, useParams } from 'react-router-dom';

function AddDish() {
  const navigate = useNavigate();
  const { name, country, postalcode, address } = useParams();

  const [dishes, setDishes] = useState([
    {
      dishName: '',
      price: '',
      type: '',
      isHalal: 0,
      isGlutenFree: 0,
      isVegetarian: 0,
      isLimitedTime: false,
      startDateTime: '',
      endDateTime: '',
    },
  ]);

  const [isFormValid, setIsFormValid] = useState(false); // To track form validity

  const handleAddClick = () => {
    setDishes([
      ...dishes,
      {
        dishName: '',
        price: '',
        type: '',
        isHalal: 0,
        isGlutenFree: 0,
        isVegetarian: 0,
        isLimitedTime: false,
        startDateTime: '',
        endDateTime: '',
      },
    ]);
  };

  const handleDeleteClick = (index) => {
    const updatedDishes = dishes.filter((_, i) => i !== index);
    setDishes(updatedDishes);
  };

  const handleInputChange = (index, field, value) => {
    const updatedDishes = [...dishes];
    updatedDishes[index][field] = value;
    setDishes(updatedDishes);
  };

  const validateForm = () => {
    const allFieldsFilled = dishes.every(
      (dish) =>
        dish.dishName &&
        dish.price &&
        dish.type &&
        (dish.isLimitedTime ? dish.startDateTime && dish.endDateTime : true)
    );

    setIsFormValid(allFieldsFilled);
  };

  useEffect(() => {
    validateForm();
  }, [dishes]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const limitedTimeDishes = dishes.filter((dish) => dish.isLimitedTime);

    try {
      let response = await fetch('/api/dish/add-dishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          foodLocationName: name,
          country: country,
          postalCode: postalcode,
          address: address,
          dishes: dishes,
          limitedTimeDishes: limitedTimeDishes,
        }),
      });

      response = await response.json();

      if (response.success) {
        alert('Dishes added successfully!');
        navigate(`/location/${name}/${country}/${postalcode}/${address}`);
      } else {
        alert('Error adding dishes');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
    }
  };

  return (
    <div className="no-scroll">
      <div
        className="container mt-5 d-flex justify-content-center align-items-center"
        style={{ minHeight: '100vh' }}
      >
        <div className="col-12 col-md-6 col-lg-4">
          <h2 className="text-center mb-4 text-light">Add Dish</h2>

          <form onSubmit={handleSubmit}>
            {dishes.map((dish, index) => (
              <div key={index} className="mb-3">
                <label className="form-label text-center text-light">Dish {index + 1}</label>

                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={dish.dishName}
                  onChange={(e) => handleInputChange(index, 'dishName', e.target.value)}
                  placeholder="Dish Name"
                  required
                />

                <input
                  type="number"
                  step="0.01"
                  className="form-control form-control-sm mt-2"
                  value={dish.price}
                  onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                  placeholder="Price"
                  required
                />

                <input
                  type="text"
                  className="form-control form-control-sm mt-2"
                  value={dish.type}
                  onChange={(e) => handleInputChange(index, 'type', e.target.value)}
                  placeholder="Type"
                  required
                />

                <div className="form-check mt-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={dish.isHalal === 1}
                    onChange={(e) => handleInputChange(index, 'isHalal', e.target.checked ? 1 : 0)}
                  />
                  <label className="form-check-label">Halal</label>
                </div>

                <div className="form-check mt-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={dish.isGlutenFree === 1}
                    onChange={(e) =>
                      handleInputChange(index, 'isGlutenFree', e.target.checked ? 1 : 0)
                    }
                  />
                  <label className="form-check-label">Gluten-Free</label>
                </div>

                <div className="form-check mt-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={dish.isVegetarian === 1}
                    onChange={(e) =>
                      handleInputChange(index, 'isVegetarian', e.target.checked ? 1 : 0)
                    }
                  />
                  <label className="form-check-label">Vegetarian</label>
                </div>

                <div className="form-check mt-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={dish.isLimitedTime}
                    onChange={(e) => handleInputChange(index, 'isLimitedTime', e.target.checked)}
                  />
                  <label className="form-check-label">Limited Time Dish</label>
                </div>

                {dish.isLimitedTime && (
                  <div>
                    <label className="form-label text-light">Start Date and Time</label>
                    <input
                      type="datetime-local"
                      className="form-control form-control-sm mt-2"
                      value={dish.startDateTime}
                      onChange={(e) => handleInputChange(index, 'startDateTime', e.target.value)}
                      required
                    />

                    <label className="form-label text-light">End Date and Time</label>
                    <input
                      type="datetime-local"
                      className="form-control form-control-sm mt-2"
                      value={dish.endDateTime}
                      onChange={(e) => handleInputChange(index, 'endDateTime', e.target.value)}
                      required
                    />
                  </div>
                )}

                <button
                  type="button"
                  className="btn btn-danger mt-2"
                  onClick={() => handleDeleteClick(index)}
                >
                  Delete Dish
                </button>
              </div>
            ))}

            <div className="d-flex justify-content-center mb-5">
              <button type="button" className="button" onClick={handleAddClick}>
                Add More Dishes
              </button>
            </div>

            <div className="d-flex justify-content-center mb-5">
              <button
                type="submit"
                className={`button w-50 ${isFormValid ? 'enabled' : 'disabled'}`}
                disabled={!isFormValid}
              >
                Submit Dishes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddDish;
