const { withOracleDB } = require('../../appService');

async function insertUser(user) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `INSERT INTO APPUSER (USERID, FIRSTNAME, LASTNAME, EMAIL, PASSWORD, NUMREVIEWS) VALUES (:userID, :firstName, :lastName, :email, :password, :numReviews)`,
      {
        userID: user.userID,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        numReviews: user.numReviews,
      },
      { autoCommit: true }
    );
    return result.rowsAffected && result.rowsAffected > 0;
  });
}

async function deleteAccount(userID) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `DELETE FROM APPUSER WHERE USERID=:userID`,
      {
        userID: userID,
      },
      { autoCommit: true }
    );
    return result.rowsAffected && result.rowsAffected > 0;
  });
}

async function emailExists(email) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `SELECT * FROM APPUSER WHERE EMAIL=:email`,
      {
        email: email,
      },
      { autoCommit: true }
    );
    return result.rows.length !== 0;
  });
}

async function updatePasswordWithEmail(email, password) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `UPDATE APPUSER SET PASSWORD=:password WHERE EMAIL=:email`,
      {
        email: email,
        password: password,
      },
      { autoCommit: true }
    );
    return result.rowsAffected && result.rowsAffected > 0;
  });
}

async function updateEmailWithEmail(oldEmail, newEmail) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `UPDATE APPUSER SET EMAIL=:newEmail WHERE EMAIL=:oldEmail`,
      {
        oldEmail: oldEmail,
        newEmail: newEmail,
      },
      { autoCommit: true }
    );

    return result.rowsAffected && result.rowsAffected > 0;
  });
}

async function getUserInfoWithID(userID) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute('SELECT * FROM APPUSER WHERE USERID=:userID', {
      userID: userID,
    });
    if (result.rows.length === 0) {
      return {};
    }
    return {
      userID: result.rows[0][0],
      firstName: result.rows[0][1],
      lastName: result.rows[0][2],
      numReviews: result.rows[0][5],
    };
  });
}

async function getAll() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute('SELECT * FROM APPUSER');
    return result.rows.map((row) => {
      return {
        user: row[0],
        email: row[1],
        password: row[2],
        numReviews: row[3],
      };
    });
  });
}

async function authenticateUser(email, password) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      'SELECT * FROM APPUSER WHERE EMAIL=:email AND PASSWORD=:password',
      {
        email: email,
        password: password,
      }
    );
    if (result.rows.length === 0) {
      return null;
    }
    return {
      userID: result.rows[0][0],
      firstName: result.rows[0][1],
      lastName: result.rows[0][2],
      email: result.rows[0][3],
      numReviews: result.rows[0][5],
    };
  });
}

async function updateReviewCount(userID, numReviews) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `UPDATE APPUSER SET NUMREVIEWS=:numReviews WHERE USERID=:userID`,
      {
        userID: userID,
        numReviews: numReviews,
      },
      { autoCommit: true }
    );
    return result.rowsAffected && result.rowsAffected > 0;
  });
}

module.exports = {
  insertUser,
  emailExists,
  updatePasswordWithEmail,
  updateEmailWithEmail,
  getUserInfoWithID,
  authenticateUser,
  deleteAccount,
  updateReviewCount,
};
