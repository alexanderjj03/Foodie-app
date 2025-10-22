import React, { useContext } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserContext } from './contexts/UserContext';
import AddFoodLocation from './pages/AddFoodLocation';
import FoodLocation from './pages/FoodLocation';
import ProfileComments from './components/ProfileComments';
import UserReviews from './components/UserReviews';
import EditAccountDetails from './components/EditAccountDetails';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
import SearchUserFoodTypePhotos from './components/SearchUserFoodTypePhotos';
import McDonaldsHallOfFame from './pages/McDonaldsHallOfFame';
import AddDish from './pages/AddDish';
import { ADMIN_UUID } from './Helper';
import AddReview from './pages/AddReview';

function App() {
  const { user, login } = useContext(UserContext);
  const handleButtonClick = async () => {
    try {
      const response = await fetch('/api/run-init-script-sql', {
        method: 'POST',
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="app">
      <Router>
        {user && <Navbar />}
        <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
          <div className="container mt-4 flex-grow-1">
            <Routes>
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/login"
                element={
                  user ? (
                    <Navigate to="/home" />
                  ) : (
                    <Login handleLogin={login} className="login-page" />
                  )
                }
              />
              <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
              <Route
                path="/add-location"
                element={
                  user && user.userID === ADMIN_UUID ? <AddFoodLocation /> : <Navigate to="/home" />
                }
              />
              <Route
                path="/profile/:userID"
                element={user ? <Profile /> : <Navigate to="/login" />}
              >
                <Route path="reviews" element={<UserReviews />} />
                <Route path="comments" element={<ProfileComments />} />
                <Route path="edit-details" element={<EditAccountDetails />} />
                <Route path="photo-food-search" element={<SearchUserFoodTypePhotos />} />
              </Route>
              <Route
                path="/profile/:userID"
                element={user ? <Profile /> : <Navigate to="/login" />}
              />
              <Route
                path="/mcdonalds-hall-of-fame"
                element={user ? <McDonaldsHallOfFame /> : <Navigate to="/login" />}
              />
              <Route
                path="/location/:name/:country/:postalcode/:address"
                element={user ? <FoodLocation /> : <Navigate to="/login" />}
              />
              <Route
                path="/location/:name/:country/:postalcode/:address/add-dish"
                element={
                  user && user.userID === ADMIN_UUID ? (
                    <AddDish />
                  ) : (
                    <Navigate to="/location/:name/:country/:postalcode/:address" />
                  )
                }
              />
              <Route
                path="/location/:name/:country/:postalcode/:address/add-review"
                element={
                  user ? (
                    <AddReview />
                  ) : (
                    <Navigate to="/location/:name/:country/:postalcode/:address" />
                  )
                }
              />
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="*" element={<Navigate to={user ? '/home' : '/login'} />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
