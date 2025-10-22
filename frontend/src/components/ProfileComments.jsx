import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CommentSection from './CommentSection';

function ProfileComments() {
  const { userID } = useParams();
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments/get-user-comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID: userID }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setComments(data.data);
      } else {
        console.log('Failed to fetch comments from user');
        setComments([]);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      setComments([]);
    }
  };
  useEffect(() => {
    fetchComments();
  }, [userID]);

  if (!comments) {
    return <div>Loading comments...</div>;
  }
  if (comments.length === 0) {
    return <div>No comments</div>;
  }
  return <CommentSection comments={comments} onReload={fetchComments} />;
}
export default ProfileComments;
