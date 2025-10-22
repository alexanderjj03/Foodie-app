import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Login({ handleLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const authentication = async (email, password) => {
    try {
      const response = await fetch('/api/users/authenticate-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password }),
      });
      let auth = await response.json();

      if (!response.ok) {
        setError(auth.error);
        return null;
      }

      return auth.user;
    } catch (e) {
      console.log('something weird happened');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await authentication(email, password);
    if (user) {
      handleLogin(user);
    }
  };

  return (
    <div className="app">
      <div
        className="container mt-5 d-flex justify-content-center align-items-center pb"
        style={{ minHeight: '100vh', transform: 'translateY(-10vh)' }}
      >
        <div className="col-12 col-md-6 col-lg-4">
          <div className="mainheader">
            <h1 className="text-center mb-4 ">Login</h1>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-center ">
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
              <label htmlFor="password" className="form-label text-center ">
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
            <div className="d-flex justify-content-center mb-3">
              <button type="submit" className="button" style={{ width: '15vw' }}>
                Login
              </button>
            </div>
          </form>
          <div className="d-flex justify-content-center">
            <Link to="/signup" className="btn btn-link text-light p-0">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
