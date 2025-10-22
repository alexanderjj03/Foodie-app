const express = require('express');
const router = express.Router();
const foodLocationService = require('../service/FoodLocationService');
const foodLocationSummaryService = require('../service/FLSummaryService');

const FoodLocation = require('../model/FoodLocation');
const FoodLocationSummary = require('../model/FoodLocationSummary');
const { generateUUID } = require('../Helper');
const reviewService = require('../service/ReviewService');

/*
ENDPOINT: POST /api/users/create-location
BODY: { foodLocationName, address, postalCode, country, city, genre, description
RETURNS: {success : boolean}
 */
router.post('/create-location', async (req, res) => {
  try {
    const newUUID = generateUUID();
    const foodLocation = new FoodLocation(
      req.body.foodLocationName,
      req.body.address,
      req.body.postalCode,
      req.body.country,
      0,
      0,
      req.body.city,
      req.body.genre,
      newUUID
    );
    const foodLocationSummary = new FoodLocationSummary(
      newUUID,
      0,
      req.body.description,
      req.body.foodLocationName,
      req.body.address,
      req.body.postalCode,
      req.body.country
    );
    console.log(req.body);
    const locationResult = await foodLocationService.insertFoodLocation(
      foodLocation,
      foodLocationSummary
    );
    if (!locationResult) {
      return res.status(400).json({ success: false, error: 'Failed to insert foodLocation' });
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/*
ENDPOINT: GET /api/foodlocation/get-foodlocation-info
BODY: foodLocationSummaryID
RETURNS ON SUCCESS: {success: boolean, data: [{ name, address, postalCode, country, totalScore, numReviews, city, genre, foodLocationSummaryID }]}
 */
router.post('/get-foodlocation-info', async (req, res) => {
  try {
    const result = await foodLocationService.getFoodLocationInfo(
      req.body.name,
      req.body.address,
      req.body.postalCode,
      req.body.country
    );
    if (!result) {
      return res.status(404).json({
        success: false,
        error:
          'Failed to get food location information: ' +
          req.body.name +
          req.body.address +
          req.body.postalCode +
          req.body.country,
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

router.post('/get-mcd-hall-of-fame', async (req, res) => {
  try {
    const result = await foodLocationService.getMcdonaldsHallOfFame(req.body.city);
    res.json({
      success: true,
      users: result,
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/get-location-avg-score', async (req, res) => {
  try {
    const result = await reviewService.getLocationAverageScore(
      req.body.name,
      req.body.address,
      req.body.postalCode,
      req.body.country
    );
    if (!result) {
      return res.status(404).json({
        success: false,
        error: `Failed to get restaurant average score: ${req.body.name} ${req.body.address} ${req.body.postalCode} ${req.body.country}`,
      });
    }
    res.json({
      success: true,
      avgScore: result.toFixed(1),
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/findLocs', async (req, res) => {
  try {
    const query = req.body['query'];
    const result1 = await foodLocationService.searchLocs(
      'SELECT * FROM FoodLocation WHERE ' + query
    );
    if (!result1) {
      return res.status(400).json({ success: false, error: 'Internal database error' });
    }
    res.json({ success: true, FoodLocations: result1 });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = router;
