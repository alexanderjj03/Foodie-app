import React, { useContext, useEffect, useState } from 'react';
import '../index.css';
import { Link, useParams } from 'react-router-dom';

const UserComments = () => {
  const { userID } = useParams();
  const [userComments, setUserComments] = useState([]);

  useEffect(() => {
    fetchUserComments();
  }, []);

  async function fetchUserComments() {
    try {
      const response = await fetch('/api/comments/get-user-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: userID,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Information retrieved successfully:', result);
      setUserComments(result.data);
      return result.data;
    } catch (e) {
      console.error('Error retrieving user information:', e);
    }
  }

  return (
    <div className="app">
      <h1 className="mainheader"> Comments </h1>
      <div>
        {userComments.length > 0 ? (
          userComments.map((comment, index) => (
            <div className="backgroundreview">
              <div>{comment.commentTimestamp}</div>
              <div>{comment.commentContent}</div>
              <div>{comment.commentLikes} likes</div>
            </div>
          ))
        ) : (
          <p>No comments available to display.</p>
        )}
      </div>
    </div>
  );
};

export default UserComments;
