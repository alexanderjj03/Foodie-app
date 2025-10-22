import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSignUp = async (email, password, firstName, lastName) => {
    try {
      let userExistsResponse = await fetch('/api/users/user-exists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });
      userExistsResponse = await userExistsResponse.json();
      if (userExistsResponse.userExists) {
        setError('This email already exists');
        return false;
      }
      const response = await fetch('/api/users/create-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
        }),
      });
      let signupResponse = await response.json();

      if (!response.ok) {
        setError(signupResponse.error);
        return false;
      }

      return true;
    } catch (e) {
      console.log('Something weird happened');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (await handleSignUp(email, password, firstName, lastName)) {
      navigate('/login');
    }
  };

  return (
    <div className="no-scroll">
      <div
        className="container mt-5 d-flex justify-content-center align-items-center"
        style={{ minHeight: '100vh' }}
      >
        <div className="col-12 col-md-6 col-lg-4">
          <h2 className="text-center mb-4 text-light">Sign Up</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="firstName" className="form-label text-light">
                  First Name
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="col">
                <label htmlFor="lastName" className="form-label text-light">
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-center text-light">
                Email
              </label>
              <input
                type="email"
                className="form-control form-control-sm"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label text-center text-light">
                Password
              </label>
              <input
                type="password"
                className="form-control form-control-sm"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label text-center text-light">
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control form-control-sm"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="d-flex justify-content-center mb-3">
              <button type="submit" className="button w-50">
                Sign Up
              </button>
            </div>
          </form>
          <div className="d-flex justify-content-center">
            <Link to="/login" className="btn btn-link text-light p-0">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
