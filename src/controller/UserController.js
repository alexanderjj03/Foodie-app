const express = require('express');
const router = express.Router();
const userService = require('../service/UserService');
const User = require('../model/User');
const { generateUUID } = require('../Helper');

/*
ENDPOINT: PUT /api/users/create-user
BODY: email, password
RETURNS: {success : boolean}
 */
router.put('/create-user', async (req, res) => {
  try {
    const user = new User(
      generateUUID(),
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.password,
      0
    );
    const result = await userService.insertUser(user);
    if (!result) {
      return res.status(400).json({ success: false, error: 'Failed to create user' });
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/*
ENDPOINT: POST /api/users/user-exists
BODY: email
RETURNS: {success : boolean, result: boolean}
 */
router.post('/user-exists', async (req, res) => {
  try {
    const result = await userService.emailExists(req.body.email);
    return res.json({ success: true, userExists: result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/*
ENDPOINT: POST /api/users/change-password
BODY: email, password
RETURNS: {success : boolean}
 */
router.post('/change-password', async (req, res) => {
  try {
    const result = await userService.updatePasswordWithEmail(req.body.email, req.body.password);
    if (!result) {
      return res.status(400).json({
        success: false,
        error: 'Failed to update password for: ' + req.body.email,
      });
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/check-old-password', async (req, res) => {
  try {
    const result = await userService.authenticateUser(req.body.email, req.body.password);
    if (!result) {
      return res.status(400).json({
        success: false,
      });
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/delete-account', async (req, res) => {
  try {
    const result = await userService.deleteAccount(req.body.userID);
    if (!result) {
      return res.status(400).json({
        success: false,
      });
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/*
ENDPOINT: POST /api/users/change-password
BODY: oldEmail, newEmail
RETURNS: {success : boolean}
 */
router.post('/change-email', async (req, res) => {
  try {
    const result = await userService.updateEmailWithEmail(req.body.oldEmail, req.body.newEmail);
    if (!result) {
      return res.status(400).json({
        success: false,
        error: 'Failed to update email for: ' + req.body.email,
      });
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/*
ENDPOINT: GET /api/users/get-user-info
BODY: userID
RETURNS ON SUCCESS: {success: boolean, data: [{ userID, firstName, lastName, numReviews }]}
 */
router.post('/get-user-info', async (req, res) => {
  try {
    const result = await userService.getUserInfoWithID(req.body.userID);
    // const result = await userService.getAll();
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Failed to get user: ' + req.body.userID,
      });
    }
    res.json({
      success: true,
      data: result,
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/*
ENDPOINT: POST /api/users/authenticate-user
BODY: { email, password }
RETURNS ON SUCCESS: {success: boolean, user: { userID, firstName, lastName, email, numReviews, password }}
 */
router.post('/authenticate-user', async (req, res) => {
  try {
    const result = await userService.authenticateUser(req.body.email, req.body.password);
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Email or password is incorrect',
      });
    }
    res.json({
      success: true,
      user: result,
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = router;
