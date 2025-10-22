const { withOracleDB } = require('../../appService');

//INSERT Photo
async function insertPhoto(photo) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `INSERT INTO Photo (PHOTOID, IMAGEURL, DESCRIPTION, PHOTOTIMESTAMP, REVIEWID, SUMMARYID) VALUES (:photoID, :image, :description, SYSDATE, :reviewID, :summaryID)`,
      {
        photoID: photo.photoID,
        image: photo.imageURL,
        description: photo.description,
        reviewID: photo.reviewID,
        summaryID: photo.summaryID,
      },
      { autoCommit: true }
    );

    return result.rowsAffected && result.rowsAffected > 0;
  });
}

async function getUserAveragePhotoLikes(userID) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `SELECT AVG(PhotoVoteCount) AS AvgVotesPerPhoto
             FROM (
                      SELECT COUNT(v.VoteID) AS PhotoVoteCount
                      FROM PHOTO p
                               LEFT JOIN VOTE v ON p.PHOTOID = v.PHOTOID
                               JOIN REVIEW r ON p.REVIEWID = r.REVIEWID
                      WHERE r.USERID = :userID
                      GROUP BY p.PHOTOID
                  )`,
      {
        userID: userID,
      },
      { autoCommit: true }
    );
    if (!result || result.rows.length === 0) {
      return 0;
    }
    return result.rows[0][0];
  });
}

async function getPhotosFromUserOfFoodType(userID, type) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `SELECT DISTINCT
                 p.PHOTOID,
                 p.IMAGEURL,
                 p.DESCRIPTION,
                 p.PHOTOTIMESTAMP,
                 p.REVIEWID,
                 p.SUMMARYID,
                 r.FOODLOCATIONNAME,
                 r.ADDRESS,
                 r.POSTALCODE,
                 r.COUNTRY,
                 f.CITY,
                 (SELECT COUNT(v.VoteID)
                  FROM VOTE v
                  WHERE v.PHOTOID = p.PHOTOID) AS PhotoLikes
             FROM
                 DISH d,
                 REVIEWSDISH rd,
                 REVIEW r,
                 PHOTO p,
                 FOODLOCATION f,
                 VOTE v
             WHERE
                 d.DISHNAME = rd.DISHNAME
               AND d.FOODLOCATIONNAME = rd.FOODLOCATIONNAME
               AND d.ADDRESS = rd.ADDRESS
               AND d.POSTALCODE = rd.POSTALCODE
               AND d.COUNTRY = rd.COUNTRY
               AND rd.REVIEWID = r.REVIEWID
               AND r.REVIEWID = p.REVIEWID
               AND f.FOODLOCATIONNAME = d.FOODLOCATIONNAME
               AND f.ADDRESS = d.ADDRESS
               AND f.POSTALCODE = d.POSTALCODE
               AND f.COUNTRY = d.COUNTRY
               AND r.USERID = :userID
               AND LOWER(d.TYPE) = :type`,
      {
        userID: userID,
        type: type,
      },
      { autoCommit: true }
    );

    return result.rows.map((row) => {
      return {
        photoID: row[0],
        imageURL: row[1],
        description: row[2],
        photoTimestamp: row[3],
        reviewID: row[4],
        summaryID: row[5],
        foodLocationName: row[6],
        address: row[7],
        postalCode: row[8],
        country: row[9],
        city: row[10],
        photoLikes: row[11],
      };
    });
  });
}

async function getPhotosForReview(reviewID) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `SELECT DISTINCT
                 p.PHOTOID,
                 p.IMAGEURL,
                 p.DESCRIPTION,
                 p.PHOTOTIMESTAMP,
                 p.REVIEWID,
                 p.SUMMARYID,
                 r.FOODLOCATIONNAME,
                 r.ADDRESS,
                 r.POSTALCODE,
                 r.COUNTRY,
                 f.CITY,
                 (SELECT COUNT(v.VoteID)
                  FROM VOTE v
                  WHERE v.PHOTOID = p.PHOTOID) AS PhotoLikes
             FROM
                 DISH d,
                 REVIEWSDISH rd,
                 REVIEW r,
                 PHOTO p,
                 FOODLOCATION f,
                 VOTE v
             WHERE
                 d.DISHNAME = rd.DISHNAME
               AND d.FOODLOCATIONNAME = rd.FOODLOCATIONNAME
               AND d.ADDRESS = rd.ADDRESS
               AND d.POSTALCODE = rd.POSTALCODE
               AND d.COUNTRY = rd.COUNTRY
               AND rd.REVIEWID = r.REVIEWID
               AND r.REVIEWID = p.REVIEWID
               AND f.FOODLOCATIONNAME = d.FOODLOCATIONNAME
               AND f.ADDRESS = d.ADDRESS
               AND f.POSTALCODE = d.POSTALCODE
               AND f.COUNTRY = d.COUNTRY
               AND r.REVIEWID = :reviewID
            `,
      {
        reviewID: reviewID,
      },
      { autoCommit: true }
    );

    return result.rows.map((row) => {
      return {
        photoID: row[0],
        imageURL: row[1],
        description: row[2],
        photoTimestamp: row[3],
        reviewID: row[4],
        summaryID: row[5],
        foodLocationName: row[6],
        address: row[7],
        postalCode: row[8],
        country: row[9],
        city: row[10],
        photoLikes: row[11],
      };
    });
  });
}

async function getPhotosForSummary(summaryID) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `SELECT DISTINCT
                    p.PHOTOID,
                    p.IMAGEURL,
                    p.DESCRIPTION,
                    p.PHOTOTIMESTAMP,
                    p.REVIEWID,
                    p.SUMMARYID,
                    r.FOODLOCATIONNAME,
                    r.ADDRESS,
                    r.POSTALCODE,
                    r.COUNTRY,
                    f.CITY,
                    (SELECT COUNT(v.VoteID)
                     FROM VOTE v
                     WHERE v.PHOTOID = p.PHOTOID) AS PhotoLikes
                FROM
                    DISH d,
                    REVIEWSDISH rd,
                    REVIEW r,
                    PHOTO p,
                    FOODLOCATION f,
                    VOTE v
                WHERE
                    d.DISHNAME = rd.DISHNAME
                  AND d.FOODLOCATIONNAME = rd.FOODLOCATIONNAME
                  AND d.ADDRESS = rd.ADDRESS
                  AND d.POSTALCODE = rd.POSTALCODE
                  AND d.COUNTRY = rd.COUNTRY
                  AND rd.REVIEWID = r.REVIEWID
                  AND r.REVIEWID = p.REVIEWID
                  AND f.FOODLOCATIONNAME = d.FOODLOCATIONNAME
                  AND f.ADDRESS = d.ADDRESS
                  AND f.POSTALCODE = d.POSTALCODE
                  AND f.COUNTRY = d.COUNTRY
                  AND p.SUMMARYID = :summaryID
            `,
      {
        summaryID: summaryID,
      },
      { autoCommit: true }
    );

    return result.rows.map((row) => {
      return {
        photoID: row[0],
        imageURL: row[1],
        description: row[2],
        photoTimestamp: row[3],
        reviewID: row[4],
        summaryID: row[5],
        foodLocationName: row[6],
        address: row[7],
        postalCode: row[8],
        country: row[9],
        city: row[10],
        photoLikes: row[11],
      };
    });
  });
}

//DELETE Photo
async function deletePhoto(
  removePhotoID,
  removeImage,
  removePhotoLikes,
  removeDescription,
  removeTimestamp,
  removeReviewID,
  removeSummaryID
) {
  return await withOracleDB(async (connection) => {
    try {
      const result = await connection.execute(
        `DELETE FROM Photo WHERE PhotoID = :removePhotoID`,
        {
          removePhotoID: removePhotoID,
          removeImage: removeImage,
          removePhotoLikes: removePhotoLikes,
          removeDescription: removeDescription,
          removeTimestamp: removeTimestamp,
          removeReviewID: removeReviewID,
          removeSummaryID: removeSummaryID,
        },
        { autoCommit: true }
      );

      return result.rowsAffected && result.rowsAffected > 0;
    } catch (error) {
      console.error('Error deleting Photo:', error);
      return false;
    }
  });
}
module.exports = {
  insertPhoto,
  deletePhoto,
  getPhotosFromUserOfFoodType,
  getPhotosForReview,
  getUserAveragePhotoLikes,
  getPhotosForSummary,
};
