const Service = require('../../appService');

//INSERT ReviewsDish
async function insertReviewsDish(reviewsDish) {
  return await Service.withOracleDB(async (connection) => {
    const result = await connection.execute(
      `INSERT INTO ReviewsDish (REVIEWID, DISHNAME, DISHRATING, FOODLOCATIONNAME, ADDRESS, POSTALCODE, COUNTRY) 
VALUES (:reviewID, :dishName, :dishRating, :foodLocationName, :address, :postalCode, :country)`,
      {
        reviewID: reviewsDish.reviewID,
        dishName: reviewsDish.dishName,
        dishRating: reviewsDish.dishRating,
        foodLocationName: reviewsDish.foodLocationName,
        address: reviewsDish.address,
        postalCode: reviewsDish.postalCode,
        country: reviewsDish.country,
      },
      { autoCommit: true }
    );
    return result.rowsAffected && result.rowsAffected > 0;
  });
}
module.exports = {
  insertReviewsDish,
};
