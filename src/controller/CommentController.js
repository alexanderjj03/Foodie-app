const express = require('express');
const router = express.Router();
const Comment = require('../model/Comment');
const { generateUUID } = require('../Helper');
const commentService = require('../service/CommentService');
const voteService = require('../service/VoteService');
const Vote = require('../model/Vote');
const reviewService = require('../service/ReviewService');

router.post('/getTopComment', async (req, res) => {
  try {
    const result = await commentService.getTopComment(req.body.reviewID);
    res.json({ success: true, topComment: result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/*
ENDPOINT: GET /api/comments/get-user-comments
BODY: userID
RETURNS : {success: boolean, data: [{ "commentID", "content", "commentTimestamp", "reviewID", "parentCommentID", "userID"}]}
 */
router.post('/get-user-comments', async (req, res) => {
  try {
    const result = await commentService.getCommentsFromUser(req.body.userID);
    if (!result) {
      return res.status(404).json({
        success: false,
        error: `Failed to get comments from user: ${req.body.userID}`,
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

router.post('/get-replies', async (req, res) => {
  try {
    const result = await commentService.getReplies(req.body.commentID);
    if (!result) {
      return res.status(404).json({
        success: false,
        error: `Failed to get comments replies to comment: ${req.body.commentID}`,
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

router.post('/get-comment-likes', async (req, res) => {
  try {
    const result = await voteService.getCommentLikes(req.body.commentID);
    res.json({
      success: true,
      numLikes: result,
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/comment-liked-by-user', async (req, res) => {
  try {
    const result = await voteService.commentLikedByUser(req.body.commentID, req.body.userID);
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
    const vote = new Vote(generateUUID(), req.body.userID, null, req.body.commentID);
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
    const result = await voteService.deleteCommentLike(req.body.commentID, req.body.userID);
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

router.post('/delete-comment', async (req, res) => {
  try {
    const result = await commentService.deleteComment(req.body.commentID);
    if (!result) {
      return res.status(400).json({ success: false, error: 'failed to delete comment' });
    }
    res.json({
      success: true,
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/reply', async (req, res) => {
  try {
    const comment = new Comment(
      generateUUID(),
      req.body.content,
      null,
      null,
      req.body.commentID,
      req.body.userID
    );
    const result = await commentService.addComment(comment);
    if (!result) {
      return res.status(400).json({ success: false, error: 'failed to insert reply' });
    }
    res.json({
      success: true,
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = router;
