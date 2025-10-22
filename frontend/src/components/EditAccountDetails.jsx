import React, { useContext, useState } from 'react';
import '../index.css';
import { UserContext } from '../contexts/UserContext';

const EditAccountDetails = () => {
  const { user, logout } = useContext(UserContext);

  //Email
  const [updateEmail, setUpdateEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  //Password
  const [updatePassword, setUpdatePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [retypeNewPassword, setRetypeNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');

  const changeEmail = async () => {
    try {
      console.log('old email: ' + user.email);
      const response = await fetch('/api/users/change-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldEmail: user.email,
          newEmail: newEmail,
        }),
      });
      const result = await response.json();
      console.log(result);
      if (!response.ok || !result.success) {
        return false;
      }
      return true;
    } catch (e) {
      console.error('Error retrieving user information:', e);
      return false;
    }
  };

  const checkOldPassword = async () => {
    try {
      let response = await fetch('/api/users/check-old-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          password: oldPassword,
        }),
      });
      const result = await response.json();
      console.log(result.ok);
      console.log(result.success);
      return !(!response.ok || !result.success);
    } catch (e) {
      console.error('Error retrieving user information:', e);
    }
  };

  const changePassword = async () => {
    try {
      const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          password: newPassword,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        console.error(
          `Error retrieving user information: ${response.status} ${response.statusText}`
        );
        return false;
      }
      console.log('Information retrieved successfully:', result);
      return true;
    } catch (e) {
      console.error('Error retrieving user information:', e);
      return false;
    }
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    if (!newEmail) {
      alert('Please add an email');
      return;
    }

    if (newEmail === user.email) {
      alert('New email must not be the same as old email');
      return;
    }

    if (validateEmail(newEmail)) {
      setNewEmail('');
      setUpdateEmail(false);
      if (await changeEmail()) {
        user.email = newEmail;
        alert('Email updated to ' + newEmail);
        console.log(user);
      } else {
        alert('Failed to update email');
      }
    }
  };

  function updateEmailClick() {
    setUpdateEmail(!updateEmail);
  }

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      alert('Please add a password');
      return;
    }

    if (!(await checkOldPassword())) {
      alert('Old password incorrect');
      return;
    }

    if (newPassword !== retypeNewPassword) {
      alert('New password does not match');
      return;
    }

    if (newPassword === oldPassword) {
      alert('Cannot make new password the same as current password');
      return;
    }

    setOldPassword('');
    setNewPassword('');
    setRetypeNewPassword('');
    setUpdatePassword(false);
    if (await changePassword()) {
      alert('Password changed to successfully');
    } else {
      alert('Failed to change password');
    }
  };

  const deleteAccount = async () => {
    try {
      const response = await fetch('/api/users/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: user.userID,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        return false;
      }
      return true;
    } catch (e) {
      console.error('Error retrieving deleting user:', e);
      return false;
    }
  };

  const handleDeleteAccount = () => {
    const userConfirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (userConfirmed) {
      if (deleteAccount()) {
        console.log('Account deleted');
        logout();
      }
    } else {
      console.log('Action canceled');
    }
  };

  function updatePasswordClick() {
    setUpdatePassword(!updatePassword);
  }

  function validateEmail(email) {
    const regex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;

    const isValid = regex.test(email);
    if (!isValid) {
      alert('Invalid Email Address ' + email);
    }
    return isValid;
  }

  return (
    <div className="app">
      <h3 className="mainheader">Edit Account Details</h3>
      <h4>Email</h4>
      <div>
        {updateEmail ? (
          <form onSubmit={handleSubmitEmail} className="p-3">
            <div className="mb-3">
              <input
                type="email"
                className="form-control w-50"
                placeholder="New email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="button">
              Update
            </button>
          </form>
        ) : (
          ''
        )}
      </div>

      {updateEmail ? (
        <button type="button" className="btn-close" aria-label="Close" onClick={updateEmailClick} />
      ) : (
        <button
          type="button"
          className="button"
          style={{ width: '15vw' }}
          onClick={updateEmailClick}
        >
          {' '}
          Update email
        </button>
      )}

      <h4>Password</h4>
      <div>
        {updatePassword ? (
          <form onSubmit={handleSubmitPassword} className="p-3">
            <div className="mb-3">
              <input
                type="password"
                className="form-control w-50"
                placeholder="Old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control w-50"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control w-50"
                placeholder="Retype new password"
                value={retypeNewPassword}
                onChange={(e) => setRetypeNewPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="button">
              Update
            </button>
          </form>
        ) : (
          ''
        )}
      </div>

      {updatePassword ? (
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={updatePasswordClick}
        />
      ) : (
        <button
          type="button"
          className="button"
          style={{ width: '15vw' }}
          onClick={updatePasswordClick}
        >
          {' '}
          Update password
        </button>
      )}

      <button type="button" className="my-5 button" onClick={handleDeleteAccount}>
        Delete Account
      </button>
    </div>
  );
};

export default EditAccountDetails;
