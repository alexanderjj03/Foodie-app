import React, { useEffect, useState } from 'react';
import CommentCard from './CommentCard';

const CommentSection = ({ comments, onReload }) => {
  const [commentList, setCommentList] = useState([]);
  useEffect(() => {
    setCommentList(comments);
  }, [comments]);

  return (
    <section>
      <div className="container my-5 text-body">
        <div className="row d-flex">
          <div className="col-md-11 col-lg-9 col-xl-7">
            {commentList.map((comment) => (
              <CommentCard
                commentID={comment.commentID}
                content={comment.content}
                commentTimestamp={comment.commentTimestamp}
                firstName={comment.firstName}
                lastName={comment.lastName}
                userID={comment.userID}
                onReload={onReload}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default CommentSection;
