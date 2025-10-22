const Service = require('../../appService');
const { withOracleDB } = require('../../appService');

//INSERT Dish
async function insertDish(dish) {
  return await Service.withOracleDB(async (connection) => {
    const result = await connection.execute(
      `INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country) VALUES (:DishName, :Price, :Type, :isHalal, :isGlutenFree, :isVegetarian, :FoodLocationName, :Address, :PostalCode, :Country)`,
      {
        DishName: dish.dishName,
        Price: dish.price,
        Type: dish.type,
        isHalal: dish.isHalal,
        isGlutenFree: dish.isGlutenFree,
        isVegetarian: dish.isVegetarian,
        FoodLocationName: dish.foodLocationName,
        Address: dish.address,
        PostalCode: dish.postalCode,
        Country: dish.country,
      },
      { autoCommit: true }
    );

    return result.rowsAffected && result.rowsAffected > 0;
  });
}

async function getDishInfo(name, address, postalCode, country) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      'SELECT * FROM DISH WHERE FOODLOCATIONNAME=:name AND ADDRESS=:address AND POSTALCODE=:postalCode AND COUNTRY=:country ORDER BY DISHNAME',
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
        dishName: row[0],
        price: row[1],
        type: row[2],
        isHalal: row[3],
        isGlutenFree: row[4],
        isVegetarian: row[5],
      };
    });
  });
}

async function getLTDishes(flName, address, postalCode, country) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      'SELECT DISHNAME, STARTDATE, ENDDATE FROM LimitedTimeDish WHERE FoodLocationName=:flName AND Address=:address AND PostalCode=:postalCode AND Country=:country ORDER BY DISHNAME',
      { flName: flName, address: address, postalCode: postalCode, country: country }
    );
    if (result.rows.length === 0) {
      return [];
    }
    return result.rows.map((row) => {
      return {
        dishName: row[0],
        startDate: row[1],
        endDate: row[2],
      };
    });
  });
}

async function getDishesWithFields(
  name,
  address,
  postalCode,
  country,
  showPrice,
  showType,
  showIsHalal,
  showIsGlutenFree,
  showIsVegetarian
) {
  return await withOracleDB(async (connection) => {
    const selectedFields = ['DISHNAME', 'FoodLocationName', 'Address', 'PostalCode', 'Country'];
    // Always include "DISHNAME"
    if (showPrice == true) selectedFields.push('PRICE');
    if (showType == true) selectedFields.push('TYPE');
    if (showIsHalal == true) selectedFields.push('ISHALAL');
    if (showIsGlutenFree == true) selectedFields.push('ISGLUTENFREE');
    if (showIsVegetarian == true) selectedFields.push('ISVEGETARIAN');
    const selectedFieldsString = selectedFields.join(', ');

    const query = `
            SELECT ${selectedFieldsString}
            FROM DISH
            WHERE FOODLOCATIONNAME = :name AND ADDRESS = :address AND POSTALCODE = :postalCode AND COUNTRY = :country
            ORDER BY DISHNAME
        `;

    const result = await connection.execute(query, {
      name: name,
      address: address,
      postalCode: postalCode,
      country: country,
    });

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows.map((row) => {
      const dish = {
        dishName: row[0],
        flName: row[1],
        address: row[2],
        postalCode: row[3],
        country: row[4],
      };
      let columnIndex = 5;

      if (showPrice) dish.price = row[columnIndex++];
      if (showType) dish.type = row[columnIndex++];
      if (showIsHalal) dish.isHalal = row[columnIndex++];
      if (showIsGlutenFree) dish.isGlutenFree = row[columnIndex++];
      if (showIsVegetarian) dish.isVegetarian = row[columnIndex++];

      return dish;
    });
  });
}

module.exports = {
  insertDish,
  getDishInfo,
  getLTDishes,
  getDishesWithFields,
};
