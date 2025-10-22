import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { ADMIN_UUID, formatISODate } from '../Helper';

const CommentCard = ({
  commentID,
  content,
  commentTimestamp,
  firstName,
  lastName,
  userID,
  onReload,
}) => {
  const { user } = useContext(UserContext);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [likes, setLikes] = useState(0);
  const [likeStatus, setLikeStatus] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [reloadTrigger, setReloadTrigger] = useState(false);

  const handleReload = () => {
    console.log('reloaded ' + content);
    setReloadTrigger(!reloadTrigger);
  };

  const handleShowReplies = () => {
    setShowReplies(!showReplies);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const response = await fetch('/api/comments/delete-comment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ commentID }),
        });
        if (response.ok) {
          handleReload();
          onReload();
        } else {
          console.error(`Error deleting comment: ${response.status}`);
        }
      } catch (err) {
        console.error('Error deleting comment:', err);
      }
    }
  };

  const handleSubmitReply = async () => {
    try {
      const response = await fetch('/api/comments/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentID: commentID,
          userID: user.userID,
          content: replyContent,
        }),
      });

      if (response.ok) {
        setReplyContent('');
        setShowReplyBox(false);
        handleReload();
        onReload();
      } else {
        console.error('Failed to submit reply:', response.statusText);
      }
    } catch (err) {
      console.error('Error submitting reply:', err);
    }
  };

  const handleLike = async () => {
    try {
      const newStatus = !likeStatus;
      const apiEndpoint = newStatus ? '/api/comments/like' : '/api/comments/delete-like';

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentID: commentID, userID: user.userID }),
      });

      if (response.ok) {
        setLikes((prev) => prev + (newStatus ? 1 : -1));
        setLikeStatus(newStatus);
      }
    } catch (err) {
      console.error('Error updating like status:', err);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments/get-replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentID: commentID }),
      });
      const data = await response.json();
      setReplies(data.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const fetchLikes = async () => {
    try {
      const response = await fetch('/api/comments/get-comment-likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentID: commentID }),
      });

      if (response.ok) {
        const data = await response.json();
        setLikes(data.numLikes);
      } else {
        console.error(`Error fetching comment likes: ${response.status}`);
      }
    } catch (e) {
      console.error('Error fetching comment likes:', e);
    }
  };

  const fetchLikeStatus = async () => {
    try {
      const response = await fetch('/api/comments/comment-liked-by-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentID: commentID, userID: user.userID }),
      });
      const data = await response.json();
      if (response.ok && data.isLiked) {
        setLikeStatus(true);
      } else {
        setLikeStatus(false);
      }
    } catch (e) {
      console.error('Error fetching comment likes:', e);
    }
  };

  useEffect(() => {
    fetchComments();
    fetchLikes();
    fetchLikeStatus();
    console.log('re-fetched replies');
  }, [commentID, reloadTrigger]);

  return (
    <div className="d-flex flex-start mb-4">
      <div
        className="card w-100"
        style={{
          backgroundColor: '#f4dfd0',
          border: 'none',
          borderLeft: '4px solid #f47356',
          borderRadius: '0',
        }}
      >
        <div className="card-body p-4 pe-0">
          <div>
            <h5>
              <Link to={`/profile/${userID}`} className="text-decoration-none text-dark">
                {`${firstName} ${lastName}`}
              </Link>
            </h5>
            <p className="small">{formatISODate(commentTimestamp)}</p>
            <p>{content}</p>

            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <button
                  className={`btn p-0 ${likeStatus ? 'text-danger' : 'text-muted'}`}
                  onClick={handleLike}
                  style={{ fontSize: '1.5rem', background: 'none', border: 'none' }}
                >
                  <i className={`bi ${likeStatus ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                </button>
                <span
                  className={`ms-2 fs-4 ${likeStatus ? 'text-danger' : 'text-dark'} fw-bold`}
                  id="like-count"
                >
                  {likes}
                </span>
              </div>
              {(user.userID === userID || user.userID === ADMIN_UUID) && (
                <button
                  className="btn p-0 position-absolute top-0 end-0 m-2 text-muted"
                  style={{
                    fontSize: '1.5rem',
                    background: 'none',
                    border: 'none',
                  }}
                  onClick={handleDelete}
                >
                  <i className="bi bi-trash"></i>
                </button>
              )}
            </div>
          </div>

          <div className="mt-2">
            <button
              className="btn btn-link text-decoration-none"
              onClick={() => setShowReplyBox(!showReplyBox)}
            >
              {showReplyBox ? 'Cancel Reply' : 'Reply'}
            </button>

            {showReplyBox && (
              <div className="mt-3">
                <textarea
                  className="form-control"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows="3"
                  maxLength="999"
                  placeholder="Write your reply..."
                ></textarea>
                <div className="mt-2">
                  <button className="btn carrot-btn me-2" onClick={handleSubmitReply}>
                    Submit
                  </button>
                  <button className="btn btn-secondary" onClick={() => setShowReplyBox(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {replies && replies.length > 0 && (
            <button className="btn btn-link" onClick={handleShowReplies}>
              {showReplies ? 'Hide Replies' : 'Show Replies'}
            </button>
          )}

          {showReplies && replies && replies.length > 0 && (
            <div
              className="mt-3"
              style={{
                paddingTop: '10px',
                marginTop: '15px',
                position: 'relative',
                overflowY: 'auto',
              }}
            >
              {replies.map((reply) => (
                <CommentCard
                  key={reply.commentID}
                  commentID={reply.commentID}
                  content={reply.content}
                  firstName={reply.firstName}
                  lastName={reply.lastName}
                  commentTimestamp={reply.commentTimestamp}
                  userID={reply.userID}
                  onReload={handleReload}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
