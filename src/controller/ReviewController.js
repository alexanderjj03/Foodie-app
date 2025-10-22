const express = require('express');
const router = express.Router();
const reviewService = require('../service/ReviewService');
const foodLocationService = require('../service/FoodLocationService');
const dishService = require('../service/DishService');
const photoService = require('../service/PhotoService');
const commentService = require('../service/CommentService');
const FLSummaryService = require('../service/FLSummaryService');
const reviewsDishService = require('../service/ReviewsDishSevice');
const userService = require('../service/UserService');
const Comment = require('../model/Comment');
const Review = require('../model/Review');
const Photo = require('../model/Photo');
const ReviewsDish = require('../model/ReviewsDish');
const { generateUUID } = require('../Helper');

router.post('/getReviewInfo', async (req, res) => {
  try {
    const searchKey = req.body['id'];
    const result = await reviewService.searchRevs(searchKey);
    res.json({ success: true, reviewInfo: result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/post-review', async (req, res) => {
  try {
    const newCommentID = generateUUID();
    const newReviewID = generateUUID();
    const summaryID = await FLSummaryService.getSummaryID(
      req.body.name,
      req.body.address,
      req.body.postalCode,
      req.body.country
    );
    await reviewService.insertReview(
      new Review(
        newReviewID,
        req.body.overallRating,
        req.body.serviceRating,
        req.body.waitTimeRating,
        null,
        req.body.name,
        req.body.address,
        req.body.postalCode,
        req.body.country,
        req.body.userID
      )
    );

    for (const photo of req.body.photos) {
      await photoService.insertPhoto(
        new Photo(
          generateUUID(),
          photo.imageURL,
          0,
          photo.description,
          null,
          newReviewID,
          summaryID
        )
      );
    }
    for (const dish of req.body.dishes) {
      await reviewsDishService.insertReviewsDish(
        new ReviewsDish(
          newReviewID,
          dish.dishName,
          dish.score,
          req.body.name,
          req.body.address,
          req.body.postalCode,
          req.body.country
        )
      );
    }
    if (req.body.comment && req.body.comment.trim() !== '') {
      await commentService.addComment(
        new Comment(newCommentID, req.body.comment, null, newReviewID, null, req.body.userID)
      );
    }
    const updatedNumReviews = await reviewService.getNumReviews(req.body.userID);
    await userService.updateReviewCount(req.body.userID, updatedNumReviews);
    const updatedNumReviewsLocation = await reviewService.getNumReviewsForFoodLocation(
      req.body.name,
      req.body.address,
      req.body.postalCode,
      req.body.country
    );
    await foodLocationService.updateReviewCount(
      req.body.name,
      req.body.address,
      req.body.postalCode,
      req.body.country,
      updatedNumReviewsLocation
    );
    const updatedAverageScore = await reviewService.getLocationAverageScore(
      req.body.name,
      req.body.address,
      req.body.postalCode,
      req.body.country
    );
    await FLSummaryService.updateAverageScore(summaryID, updatedAverageScore);

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/getDishReviews', async (req, res) => {
  try {
    const searchKey = req.body['id'];
    const result = await reviewService.searchDishRevs(searchKey);
    if (!result) {
      return res.status(400).json({ success: false, error: 'Internal database error' });
    }
    res.json({ success: true, dishReviews: result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/delete-review', async (req, res) => {
  try {
    const result = await reviewService.deleteReview(req.body.reviewID);
    if (!result) {
      return res.status(400).json({ success: false, error: 'Internal database error' });
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/*
ENDPOINT: GET /api/review/get-user-reviews
BODY: userID
RETURNS ON SUCCESS: {success: boolean, data: [{ reviewID, overallRating, serviceRating, waitTimeRating, dayVisited, timestamp, locationName, locationAddress, locationPostalCode, locationCountry }]}
 */
router.post('/get-user-reviews', async (req, res) => {
  try {
    const result = await reviewService.getUserReviews(req.body.userID);
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Failed to get user reviews from: ' + req.body.userID,
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

router.post('/get-review-ids', async (req, res) => {
  try {
    const result = await reviewService.getReviewIDs(
      req.body.name,
      req.body.address,
      req.body.postalCode,
      req.body.country
    );
    if (!result) {
      return res.status(404).json({
        success: false,
        error:
          'Failed to get review IDS: ' +
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

/*
ENDPOINT: GET /api/review/get-user-avg-ratings
BODY: userID
RETURNS ON SUCCESS: {success: boolean, data: [{ avgOverallRating, avgServiceRating, avgWaitTimeRating, dayVisited }]}
 */
router.post('/get-user-avg-ratings', async (req, res) => {
  try {
    const result = await reviewService.getUserAvgRatings(req.body.userID);
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Failed to get user reviews from: ' + req.body.userID,
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

module.exports = router;
