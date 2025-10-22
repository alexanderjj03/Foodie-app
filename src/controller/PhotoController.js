const express = require('express');
const router = express.Router();
const photoService = require('../service/PhotoService');
const Photo = require('../model/Photo');
const { generateUUID } = require('../Helper');
const voteService = require('../service/VoteService');
const Vote = require('../model/Vote');

/*
ENDPOINT: PUT /api/users/insert-photo
BODY: email, password
RETURNS: {success : boolean}
 */
router.put('/insert-photo', async (req, res) => {
  try {
    const photo = new Photo(
      generateUUID(),
      req.body.imageURL,
      req.body.description,
      req.body.photoTimestamp,
      req.body.reviewID,
      req.body.summaryID
    );
    const result = await photoService.insertPhoto(photo);
    if (!result) {
      return res.status(400).json({ success: false, error: 'Failed to insert photo' });
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/get-photos-from-user-of-food-type', async (req, res) => {
  try {
    const result = await photoService.getPhotosFromUserOfFoodType(req.body.userID, req.body.type);
    if (!result) {
      return res.status(404).json({
        success: false,
        error: `Failed to get photos from user ${req.body.user} of food type ${req.body.type}`,
      });
    }
    res.json({
      success: true,
      photos: result,
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/get-photos-for-review', async (req, res) => {
  try {
    const result = await photoService.getPhotosForReview(req.body.reviewID);
    if (!result) {
      return res.status(404).json({
        success: false,
        error: `Failed to get photos from user ${req.body.user} of food type ${req.body.type}`,
      });
    }
    res.json({
      success: true,
      photos: result,
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/get-photo-likes', async (req, res) => {
  try {
    const result = await voteService.getPhotoLikes(req.body.photoID);
    res.json({
      success: true,
      numLikes: result,
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/photo-liked-by-user', async (req, res) => {
  try {
    const result = await voteService.photoLikedByUser(req.body.photoID, req.body.userID);
    res.json({
      success: true,
      isLiked: result,
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/like', async (req, res) => {
  try {
    const vote = new Vote(generateUUID(), req.body.userID, req.body.photoID, null);
    const result = await voteService.insertVote(vote);
    if (!result) {
      return res.status(400).json({ success: false, error: 'failed to insert like' });
    }
    res.json({
      success: true,
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/delete-like', async (req, res) => {
  try {
    const result = await voteService.deletePhotoLike(req.body.photoID, req.body.userID);
    if (!result) {
      return res.status(400).json({ success: false, error: 'failed to delete like' });
    }
    res.json({
      success: true,
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/get-user-average-photo-likes', async (req, res) => {
  try {
    const result = await photoService.getUserAveragePhotoLikes(req.body.userID);
    res.json({
      success: true,
      averagePhotoLikes: result.toFixed(1),
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/get-foodlocationsummary-photos', async (req, res) => {
  try {
    const result = await photoService.getPhotosForSummary(req.body.summaryID);
    if (!result) {
      return res.status(404).json({
        success: false,
        error: `Failed to get photos from summary ${req.body.summaryID}`,
      });
    }
    res.json({
      success: true,
      photos: result,
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
module.exports = router;
