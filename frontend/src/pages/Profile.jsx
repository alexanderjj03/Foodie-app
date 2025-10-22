import React, { useContext, useEffect, useState } from 'react';
import '../index.css';
import { UserContext } from '../contexts/UserContext';
import { Link, Outlet, useParams } from 'react-router-dom';
import ProfileRatings from '../components/ProfileRatings';

const Profile = () => {
  const [userInformation, setUserInformation] = useState({});
  const { userID } = useParams();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        const response = await fetch('/api/users/get-user-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userID }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        setUserInformation(result.data);
      } catch (e) {
        console.error('Error retrieving user information:', e);
      }
    };
    fetchUserInformation();
  }, [userID]);

  return (
    <div>
      <div>
        <div className="d-flex justify-content-center">
          <h1 className="mainheader">{userInformation.firstName}'s Profile</h1>
        </div>
        <ProfileRatings />
        <div className="d-flex justify-content-center">
          <ul className="nav">
            <li className="nav-item">
              <Link className="nav-link" to="./reviews">
                Reviews
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="./comments">
                Comments
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="./photo-food-search">
                Search User Photos
              </Link>
            </li>
            {user.userID === userID && (
              <li className="nav-item">
                <Link className="nav-link" to="./edit-details">
                  Edit Details
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div
        style={{
          marginTop: '50px',
          padding: '20px',
        }}
        className="container"
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Profile;
