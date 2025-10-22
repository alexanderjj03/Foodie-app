const { withOracleDB } = require('../../appService');

async function addComment(comment) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `INSERT INTO USERCOMMENT (COMMENTID, CONTENT, COMMENTTIMESTAMP, REVIEWID, PARENTCOMMENTID, USERID) VALUES (:commentID, :content, SYSDATE, :reviewID, :parentCommentID, :userID)`,
      {
        commentID: comment.commentID,
        content: comment.content,
        reviewID: comment.reviewID,
        parentCommentID: comment.parentCommentID,
        userID: comment.userID,
      },
      { autoCommit: true }
    );

    return result.rowsAffected && result.rowsAffected > 0;
  });
}

async function updateCommentContent(commentID, newContent) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `UPDATE USERCOMMENT SET content=:newContent where commentID=:commentID`,
      { newContent: newContent, commentID: commentID },
      { autoCommit: true }
    );

    return result.rowsAffected && result.rowsAffected > 0;
  });
}

async function getCommentsFromUser(userID) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      'SELECT c.COMMENTID, c.CONTENT, c.COMMENTTIMESTAMP, u.FIRSTNAME, u.LASTNAME, u.USERID FROM USERCOMMENT c JOIN APPUSER u ON c.USERID=u.USERID WHERE u.USERID=:userID ORDER BY c.COMMENTTIMESTAMP DESC',
      {
        userID: userID,
      }
    );
    return result.rows.map((row) => {
      return {
        commentID: row[0],
        content: row[1],
        commentTimestamp: row[2],
        firstName: row[3],
        lastName: row[4],
        userID: row[5],
      };
    });
  });
}

async function getTopComment(reviewID) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      'SELECT c.COMMENTID, c.CONTENT, c.COMMENTTIMESTAMP, u.FIRSTNAME, u.LASTNAME, u.USERID FROM USERCOMMENT c JOIN APPUSER u ON c.USERID=u.USERID WHERE c.REVIEWID=:reviewID',
      {
        reviewID: reviewID,
      }
    );
    if (result.rows.length === 0) {
      return null;
    }
    return {
      commentID: result.rows[0][0],
      content: result.rows[0][1],
      commentTimestamp: result.rows[0][2],
      firstName: result.rows[0][3],
      lastName: result.rows[0][4],
      userID: result.rows[0][5],
    };
  });
}

async function getComment(commentID) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      'SELECT * FROM USERCOMMENT WHERE commentID=:commentID',
      { commentID: commentID }
    );
    if (result.rows.length === 0) {
      return null;
    }

    return {
      commentID: result.rows[0][0],
      content: result.rows[0][1],
      commentTimestamp: result.rows[0][2],
      reviewID: result.rows[0][3],
      parentCommentID: result.rows[0][4],
      userID: result.rows[0][5],
    };
  });
}

async function getReplies(commentID) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      'SELECT c.COMMENTID, c.CONTENT, c.COMMENTTIMESTAMP, u.FIRSTNAME, u.LASTNAME, u.USERID FROM USERCOMMENT c JOIN APPUSER u ON c.USERID=u.USERID WHERE c.PARENTCOMMENTID=:parentCommentID ORDER BY c.COMMENTTIMESTAMP',
      {
        parentCommentID: commentID,
      }
    );
    return result.rows.map((row) => {
      return {
        commentID: row[0],
        content: row[1],
        commentTimestamp: row[2],
        firstName: row[3],
        lastName: row[4],
        userID: row[5],
      };
    });
  });
}

async function getCommentReview(userID) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute('SELECT * FROM USERCOMMENT WHERE USERID=:userID', {
      userID: userID,
    });
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows.map((row) => {
      return {
        commentLikes: row[1],
        commentContent: row[2],
        commentTimestamp: row[3],
        reviewID: row[4],
      };
    });
  });
}

async function deleteComment(commentID) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `DELETE FROM USERCOMMENT WHERE COMMENTID=:commentID`,
      {
        commentID: commentID,
      },
      { autoCommit: true }
    );

    return result.rowsAffected && result.rowsAffected > 0;
  });
}

module.exports = {
  deleteComment,
  addComment,
  updateCommentContent,
  getCommentsFromUser,
  getComment,
  getTopComment,
  getReplies,
  getCommentReview,
};
