const appService = require('../../appService');
const { withOracleDB } = require('../../appService');

async function insertFoodLocation(foodLocation, foodLocationSummary) {
  return await appService.withOracleDB(async (connection) => {
    const result1 = await connection.execute(
      `INSERT INTO FoodLocation (FOODLOCATIONNAME, ADDRESS, POSTALCODE, COUNTRY, TOTALSCORE, NUMREVIEWS, CITY, GENRE, FOODLOCATIONSUMMARYID) VALUES (:name, :address, :postalCode, :country, 0, 0, :city, :genre, NULL)`,
      {
        name: foodLocation.foodLocationName,
        address: foodLocation.address,
        postalCode: foodLocation.postalCode,
        country: foodLocation.country,
        city: foodLocation.city,
        genre: foodLocation.genre,
      },
      { autoCommit: true }
    );
    const result2 = await connection.execute(
      `INSERT INTO FOODLOCATIONSUMMARY (SUMMARYID, AVERAGERATING, DESCRIPTION, FOODLOCATIONNAME, ADDRESS, POSTALCODE, COUNTRY) VALUES (:summaryID, 0, :description, :name, :address, :postalCode, :country)`,
      {
        summaryID: foodLocationSummary.summaryID,
        description: foodLocationSummary.description,
        name: foodLocationSummary.foodLocationName,
        address: foodLocationSummary.address,
        postalCode: foodLocationSummary.postalCode,
        country: foodLocationSummary.country,
      },
      { autoCommit: true }
    );
    const result3 = await connection.execute(
      `UPDATE FoodLocation SET FoodLocationSummaryID = :summaryID WHERE FoodLocationName = :name AND Address = :address AND PostalCode = :postalCode AND COUNTRY = :country`,
      {
        summaryID: foodLocationSummary.summaryID,
        name: foodLocationSummary.foodLocationName,
        address: foodLocationSummary.address,
        postalCode: foodLocationSummary.postalCode,
        country: foodLocationSummary.country,
      },
      { autoCommit: true }
    );
    return result3.rowsAffected && result3.rowsAffected > 0;
  });
}

async function updateFoodLocationSummaryID(name, address, postalCode, country, newSummaryID) {
  return await appService.withOracleDB(async (connection) => {
    const result = await connection.execute(
      `UPDATE FoodLocation SET FOODLOCATIONSUMMARYID=:newSummaryID WHERE FOODLOCATIONNAME=:name AND ADDRESS=:address AND POSTALCODE=:postalCode AND COUNTRY=:country;`,
      {
        name: name,
        address: address,
        postalCode: postalCode,
        country: country,
        newSummaryID: newSummaryID,
      },
      { autoCommit: true }
    );

    return result.rowsAffected && result.rowsAffected > 0;
  });
}

async function searchLocs(query) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(query);
    return result.rows;
  }).catch((e) => {
    Promise.reject(e.message);
  });
}

async function getFoodLocationInfo(name, address, postalCode, country) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      'SELECT * FROM FOODLOCATION WHERE FOODLOCATIONNAME=:name AND ADDRESS=:address AND POSTALCODE=:postalCode AND COUNTRY=:country',
      {
        name: name,
        address: address,
        postalCode: postalCode,
        country: country,
      }
    );
    if (result.rows.length === 0) {
      return {};
    }
    return result.rows.map((row) => {
      return {
        name: row[0],
        address: row[1],
        postalCode: row[2],
        country: row[3],
        totalScore: row[4],
        numReviews: row[5],
        city: row[6],
        genre: row[7],
        foodLocationSummaryID: row[8],
      };
    });
  });
}

async function getMcdonaldsHallOfFame(city) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `SELECT u.USERID, u.FIRSTNAME, u.LASTNAME
             FROM APPUSER u
                 JOIN REVIEW r ON u.USERID = r.USERID
                 JOIN FOODLOCATION f ON r.FOODLOCATIONNAME = f.FOODLOCATIONNAME
                                            AND r.ADDRESS = f.ADDRESS
                                            AND r.POSTALCODE = f.POSTALCODE
                                            AND r.COUNTRY = f.COUNTRY
             WHERE f.FOODLOCATIONNAME = 'McDonald''s' AND LOWER(f.CITY)=:city
             GROUP BY u.USERID, u.FIRSTNAME, u.LASTNAME
             HAVING COUNT(*) =
                    (SELECT COUNT(*)
                     FROM FOODLOCATION
                     WHERE FOODLOCATIONNAME = 'McDonald''s' AND LOWER(CITY)=:city)`,
      {
        city: city,
      }
    );
    if (result.rows.length === 0) {
      return [];
    }
    return result.rows.map((row) => {
      return {
        userID: row[0],
        firstName: row[1],
        lastName: row[2],
      };
    });
  });
}

async function updateReviewCount(name, address, postalCode, country, numReviews) {
  console.log(`${name} ${address} ${postalCode} ${country} ${numReviews}`);
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `UPDATE FOODLOCATION SET NUMREVIEWS=:numReviews WHERE FoodLocationName=:name AND Address=:address AND PostalCode=:postalCode AND Country=:country`,
      {
        name: name,
        address: address,
        postalCode: postalCode,
        country: country,
        numReviews: numReviews,
      },
      { autoCommit: true }
    );
    console.log(result.rowsAffected && result.rowsAffected > 0);
    return result.rowsAffected && result.rowsAffected > 0;
  });
}
module.exports = {
  insertFoodLocation,
  updateFoodLocationSummaryID,
  searchLocs,
  getFoodLocationInfo,
  getMcdonaldsHallOfFame,
  updateReviewCount,
};
