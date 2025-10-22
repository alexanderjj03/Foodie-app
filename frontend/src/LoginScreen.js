import React, { useEffect, useState } from 'react';
import './App.css';
import './LoginScreen.css';
import { App } from './App';

function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [errorMsg2, setErrorMsg2] = useState('');
  const [createNewAcc, setCreateNewAcc] = useState(false);

  const loginAtt = () => {
    return fetch('/api/users/authenticate-user', {
      method: 'POST',
      body: JSON.stringify({ email: username, password: password }),
      headers: {
        'content-type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const result = data['status'];
        console.log(data['status']);
        if (result === 'Login successful') {
          onLoginSuccess();
        } else {
          setErrorMsg(result);
        }
      })
      .catch((err) => {
        setError(true);
      });
  };

  // START HERE
  const newAcc = () => {
    return fetch('/api/newAcc', {
      method: 'POST',
      body: JSON.stringify({ user: newUsername, password: newPassword }),
      headers: {
        'content-type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const result = data['status'];
        console.log(data['status']);
        if (result === 'Successful') {
          onLoginSuccess();
        } else {
          setErrorMsg2(result);
        }
      })
      .catch((err) => {
        setError(true);
      });
  };

  if (!createNewAcc) {
    return (
      <div className="LoginScreen">
        <div className="LoginHoriz">
          <p>Email:</p>
          <textarea
            className={'Username'}
            defaultValue={''}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="LoginHoriz">
          <p>Password:</p>
          <textarea
            className={'Password'}
            defaultValue={''}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="LoginHoriz">
          <p>
            <button onClick={() => setCreateNewAcc(true)}>Create new account</button>
          </p>
          <p>
            <button
              onClick={() => {
                loginAtt();
              }}
            >
              Log in
            </button>
          </p>
        </div>
        <p>{errorMsg}</p>
      </div>
    );
  } else {
    return (
      <div className="LoginScreen">
        <p>New Account Creation Page:</p>
        <div className="LoginHoriz">
          <p>Email:</p>
          <textarea
            className={'Username'}
            defaultValue={''}
            onChange={(e) => setNewUsername(e.target.value)}
          />
        </div>
        <div className="LoginHoriz">
          <p>Password:</p>
          <textarea
            className={'Password'}
            defaultValue={''}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="LoginHoriz">
          <p>
            <button
              onClick={() => {
                setCreateNewAcc(false);
                setNewPassword('');
                setNewUsername('');
              }}
            >
              Go Back
            </button>
          </p>
          <p>
            <button
              onClick={() => {
                newAcc();
              }}
            >
              Create account
            </button>
          </p>
        </div>
        <p>{errorMsg2}</p>
      </div>
    );
  }
}
