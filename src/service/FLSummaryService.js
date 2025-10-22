const appService = require('../../appService');
const { withOracleDB } = require('../../appService');

async function insertFLSummary(foodLocationSummary) {
  return await appService.withOracleDB(async (connection) => {
    const result = await connection.execute(
      `INSERT INTO FoodLocationSummary (SUMMARYID, AVERAGERATING, DESCRIPTION, FOODLOCATIONNAME, ADDRESS, POSTALCODE, COUNTRY) 
VALUES (:summaryID, :averageRating, :description, :foodLocationName, :address, :postalCode, :country)`,
      {
        summaryID: foodLocationSummary.summaryID,
        averageRating: foodLocationSummary.averageRating,
        description: foodLocationSummary.description,
        foodLocationName: foodLocationSummary.foodLocationName,
        address: foodLocationSummary.foodLocationName,
        postalCode: foodLocationSummary.postalCode,
        country: foodLocationSummary.country,
      },
      { autoCommit: true }
    );

    return result.rowsAffected && result.rowsAffected > 0;
  });
}
async function getFoodLocationSummaryInfo(foodLocationSummaryID) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      'SELECT * FROM FOODLOCATIONSUMMARY WHERE SUMMARYID=:foodLocationSummaryID',
      {
        foodLocationSummaryID: foodLocationSummaryID,
      }
    );
    if (result.rows.length === 0) {
      return {};
    }
    return result.rows.map((row) => {
      return {
        summaryID: row[0],
        averageRating: row[1],
        description: row[2],
      };
    });
  });
}

async function getTrendingSummaries() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      'SELECT r.FOODLOCATIONNAME, r.ADDRESS, r.POSTALCODE, r.COUNTRY, AVG(s.AVERAGERATING) AS AVG_RATING, COUNT(*) AS REVIEW_COUNT FROM FOODLOCATIONSUMMARY s, REVIEW r WHERE s.FOODLOCATIONNAME = r.FOODLOCATIONNAME AND s.ADDRESS = r.ADDRESS AND s.POSTALCODE = r.POSTALCODE AND s.COUNTRY = r.COUNTRY GROUP BY r.FOODLOCATIONNAME, r.ADDRESS, r.POSTALCODE, r.COUNTRY HAVING COUNT(*) > 1 AND AVG(s.AVERAGERATING) > 4',
      {}
    );

    if (result.rows.length === 0) {
      return {};
    }

    return result.rows.map((row) => {
      return {
        foodLocationName: row[0],
        address: row[1],
        postalCode: row[2],
        country: row[3],
        averageRating: row[4],
        reviewCount: row[5],
      };
    });
  });
}

async function getHighlyReviewedSummaries() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      'SELECT r.FOODLOCATIONNAME, r.ADDRESS, r.POSTALCODE, r.COUNTRY FROM FOODLOCATIONSUMMARY s, REVIEW r WHERE s.FOODLOCATIONNAME = r.FOODLOCATIONNAME AND s.ADDRESS = r.ADDRESS AND s.POSTALCODE = r.POSTALCODE AND s.COUNTRY = r.COUNTRY GROUP BY r.FOODLOCATIONNAME, r.ADDRESS, r.POSTALCODE, r.COUNTRY HAVING COUNT(*) > (SELECT AVG(review_count) FROM (SELECT COUNT(*) AS review_count FROM FOODLOCATIONSUMMARY s, REVIEW r WHERE s.FOODLOCATIONNAME = r.FOODLOCATIONNAME AND s.ADDRESS = r.ADDRESS AND s.POSTALCODE = r.POSTALCODE AND s.COUNTRY = r.COUNTRY GROUP BY r.FOODLOCATIONNAME, r.ADDRESS, r.POSTALCODE, r.COUNTRY))',
      {}
    );

    if (result.rows.length === 0) {
      return {};
    }

    return result.rows.map((row) => {
      return {
        foodLocationName: row[0],
        address: row[1],
        postalCode: row[2],
        country: row[3],
      };
    });
  });
}

async function searchSummaries(name, address, postal, country) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      'SELECT * FROM FoodLocationSummary WHERE FoodLocationName=:n AND Address=:a AND PostalCode=:p AND Country=:c',
      [name, address, postal, country]
    );
    return result.rows;
  }).catch((e) => {
    Promise.reject(e.message);
  });
}

async function getSummaryID(name, address, postal, country) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      'SELECT SUMMARYID FROM FoodLocationSummary WHERE FoodLocationName=:n AND Address=:a AND PostalCode=:p AND Country=:c',
      [name, address, postal, country]
    );
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0][0];
  });
}

async function updateAverageScore(summaryID, updatedAverageScore) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `UPDATE FOODLOCATIONSUMMARY SET AVERAGERATING=:score WHERE SUMMARYID=:summaryID`,
      {
        summaryID: summaryID,
        score: updatedAverageScore,
      },
      { autoCommit: true }
    );
    return result.rowsAffected && result.rowsAffected > 0;
  });
}

module.exports = {
  insertFLSummary,
  searchSummaries,
  getFoodLocationSummaryInfo,
  getTrendingSummaries,
  getHighlyReviewedSummaries,
  getSummaryID,
  updateAverageScore,
};
