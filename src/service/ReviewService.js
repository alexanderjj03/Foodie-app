const { withOracleDB } = require('../../appService');
const Service = require('../../appService');

//INSERT Review
async function insertReview(review) {
  return await Service.withOracleDB(async (connection) => {
    const result = await connection.execute(
      `INSERT INTO Review (REVIEWID, OVERALLRATING, SERVICERATING, WAITTIMERATING, REVIEWTIMESTAMP, FOODLOCATIONNAME, ADDRESS, POSTALCODE, COUNTRY, USERID) 
VALUES (:ReviewID, :OverallRating, :ServiceRating, :WaitTimeRating, SYSDATE, :FoodLocationName, :Address, :PostalCode, :Country, :UserID)`,
      {
        ReviewID: review.reviewID,
        OverallRating: review.overallRating,
        ServiceRating: review.serviceRating,
        WaitTimeRating: review.waitTimeRating,
        FoodLocationName: review.foodLocationName,
        Address: review.address,
        PostalCode: review.postalCode,
        Country: review.country,
        UserID: review.userID,
      },
      { autoCommit: true }
    );

    return result.rowsAffected && result.rowsAffected > 0;
  }).catch(() => {
    console.error('Error inserting Review:', error);
    return false;
  });
}

async function deleteReview(reviewID) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `DELETE FROM Review WHERE ReviewID = :reviewID`,
      {
        reviewID: reviewID,
      },
      { autoCommit: true }
    );
    return result.rowsAffected && result.rowsAffected > 0;
  });
}

async function searchRevs(searchKey) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute('SELECT * FROM Review WHERE ReviewID=:id', [searchKey]);
    return result.rows.map((row) => {
      return {
        reviewID: row[0],
        overallRating: row[1],
        serviceRating: row[2],
        waitTimeRating: row[3],
        reviewTimestamp: row[4],
        foodLocationName: row[5],
        address: row[6],
        postalCode: row[7],
        country: row[8],
        userID: row[9],
      };
    });
  });
}

async function searchDishRevs(searchKey) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute('SELECT * FROM ReviewsDish WHERE ReviewID=:id', [
      searchKey,
    ]);
    return result.rows;
  }).catch((e) => {
    Promise.reject(e.message);
  });
}

async function getLocationAverageScore(foodLocationName, address, postalCode, country) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `SELECT AVG(r.OVERALLRATING) FROM REVIEW r 
                                     WHERE r.FOODLOCATIONNAME=:foodLocationName AND 
                                           R.ADDRESS=:address AND 
                                           POSTALCODE=:postalCode AND 
                                           COUNTRY=:country`,
      {
        foodLocationName: foodLocationName,
        address: address,
        postalCode: postalCode,
        country: country,
      }
    );
    if (result.rows.length === 0) {
      return 0;
    }
    return result.rows[0][0];
  });
}

async function getUserReviews(userID) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute('SELECT * FROM REVIEW WHERE USERID=:userID', {
      userID: userID,
    });
    if (result.rows.length === 0) {
      return {};
    }
    return result.rows.map((row) => {
      return {
        reviewID: row[0],
        overallRating: row[1],
        serviceRating: row[2],
        waitTimeRating: row[3],
        dayVisited: row[4],
        timestamp: row[5],
        locationName: row[6],
        locationAddress: row[7],
        locationPostalCode: row[8],
        locationCountry: row[9],
      };
    });
  });
}

async function getUserAvgRatings(userID) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      'SELECT AVG(OVERALLRATING), AVG(SERVICERATING), AVG(WAITTIMERATING) FROM REVIEW WHERE USERID=:userID GROUP BY USERID',
      {
        userID: userID,
      }
    );
    if (result.rows.length === 0) {
      return {};
    }
    return result.rows.map((row) => {
      return {
        averageOverallRating: row[0],
        averageServiceRating: row[1],
        averageWaitTimeRating: row[2],
      };
    });
  });
}

async function getReviewIDs(name, address, postalCode, country) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      'SELECT ReviewID FROM Review WHERE FoodLocationName=:name AND Address=:address AND PostalCode=:postalCode AND Country=:country',
      {
        name: name,
        address: address,
        postalCode: postalCode,
        country: country,
      }
    );
    if (result.rows.length === 0) {
      return [];
    }
    return result.rows.map((row) => {
      return {
        id: row[0],
      };
    });
  });
}

async function getNumReviews(userID) {
  console.log(userID);
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(`SELECT COUNT(*) FROM REVIEW WHERE USERID=:userID`, {
      userID: userID,
    });
    if (result.rows.length === 0) {
      return '';
    }
    return result.rows[0][0];
  });
}

async function getNumReviewsForFoodLocation(name, address, postalCode, country) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `SELECT COUNT(*) FROM REVIEW WHERE FoodLocationName=:name AND Address=:address AND PostalCode=:postalCode AND Country=:country`,
      {
        name: name,
        address: address,
        postalCode: postalCode,
        country: country,
      }
    );
    if (result.rows.length === 0) {
      return '';
    }
    return result.rows[0][0];
  });
}

module.exports = {
  insertReview,
  deleteReview,
  getReviewIDs,
  searchRevs,
  searchDishRevs,
  getUserReviews,
  getUserAvgRatings,
  getLocationAverageScore,
  getNumReviews,
  getNumReviewsForFoodLocation,
};
