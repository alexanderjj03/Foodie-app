const express = require('express');
const appService = require('./appService');

const router = express.Router();
const userRouter = require('./src/controller/UserController');
const foodLocationRouter = require('./src/controller/FoodLocationController');
const reviewRouter = require('./src/controller/ReviewController');

const foodLocationSummaryRouter = require('./src/controller/FoodLocationSummaryController');
const photoRouter = require('./src/controller/PhotoController');
const locationRouter = require('./src/controller/FoodLocationController');
const dishRouter = require('./src/controller/DishController');
const commentRouter = require('./src/controller/CommentController');

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.

router.use('/users', userRouter);
router.use('/photos', photoRouter);
router.use('/locations', locationRouter);
router.use('/foodlocation', foodLocationRouter);
router.use('/review', reviewRouter);
router.use('/foodlocationsummary', foodLocationSummaryRouter);
router.use('/dish', dishRouter);
router.use('/comments', commentRouter);

router.post('/run-init-script-sql', async (req, res) => {
  const initiateResult = await appService.runInitScriptSQL();
  if (initiateResult) {
    res.status(200).json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.get('/check-db-connection', async (req, res) => {
  const isConnect = await appService.testOracleConnection();
  if (isConnect) {
    res.send('connected');
  } else {
    res.send('unable to connect');
  }
});

router.post('/newAcc', async (req, res) => {
  const user = req.body['user'];
  const pass = req.body['pass'];
  try {
    const result = await appService.findUserPass(user);
    if (exists(result, pass)) {
      res.status(400).json({ status: 'Account with this username and password exists.' });
    } else {
      const result2 = await appService.makeNewAcc(user, pass);
      if (result2 === true) {
        res.status(200).json({ status: 'Successful.' });
      } else {
        res.status(500).json({ status: 'Database error' });
      }
    }
  } catch (err) {
    res.status(500).json({ status: 'Database error' });
  }
});

function exists(arr, search) {
  return arr.some((row) => row.includes(search));
}

module.exports = router;
