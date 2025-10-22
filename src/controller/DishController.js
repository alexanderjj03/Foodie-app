const express = require('express');
const router = express.Router();
const dishService = require('../service/DishService');
const limitedTimeDishService = require('../service/LTDishService');
const LimitedTimeDish = require('../model/LimitedTimeDish');
const Dish = require('../model/Dish');
const { withOracleDB } = require('../../appService');

/*
ENDPOINT: GET /api/dish/get-dish-info
BODY: name, address, postalCode, country
RETURNS ON SUCCESS: {success: boolean, data: [{ dishName, price, type, isHalal, isGlutenFree, isVegetarian }]}
 */
router.post('/get-dish-info', async (req, res) => {
  try {
    const result = await dishService.getDishInfo(
      req.body.name,
      req.body.address,
      req.body.postalCode,
      req.body.country
    );
    if (!result) {
      return res.status(404).json({
        success: false,
        error:
          'Failed to get dishes matching food location: ' +
          req.body.name +
          req.body.address +
          req.body.postalCode +
          req.body.country,
      });
    }
    res.json({
      success: true,
      data: result,
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/*
ENDPOINT: GET /api/dish/get-dishes-with-fields
BODY: name, address, postalCode, country, showPrice, showType, showIsHalal, showIsGlutenFree, showIsVegetarian
RETURNS ON SUCCESS: {success: boolean, data: [{ dishName, price?, type?, isHalal?, isGlutenFree?, isVegetarian? }]}
 */
router.post('/get-dishes-with-fields', async (req, res) => {
  try {
    const result = await dishService.getDishesWithFields(
      req.body.name,
      req.body.address,
      req.body.postalCode,
      req.body.country,
      req.body.showPrice,
      req.body.showType,
      req.body.showIsHalal,
      req.body.showIsGlutenFree,
      req.body.showIsVegetarian
    );
    if (!result) {
      return res.status(404).json({
        success: false,
        error:
          'Failed to get dishes matching food location: ' +
          req.body.name +
          req.body.address +
          req.body.postalCode +
          req.body.country,
      });
    }
    res.json({
      success: true,
      data: result,
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/get-lt-dish', async (req, res) => {
  try {
    const result = await dishService.getLTDishes(
      req.body.flName,
      req.body.address,
      req.body.postalCode,
      req.body.country
    );
    res.json({
      success: true,
      data: result,
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/add-dishes', async (req, res) => {
  try {
    for (const dish of req.body.dishes) {
      const result = await dishService.insertDish(
        new Dish(
          dish.dishName,
          dish.price,
          dish.type,
          dish.isHalal,
          dish.isGlutenFree,
          dish.isVegetarian,
          req.body.foodLocationName,
          req.body.address,
          req.body.postalCode,
          req.body.country
        )
      );
      if (!result) {
        return res.status(404).json({
          success: false,
          error: `Failed to insert dish: ${dish.dishName}`,
        });
      }
    }
    if (req.body.limitedTimeDishes.length !== 0) {
      for (const limitedTimeDish of req.body.limitedTimeDishes) {
        const result = await limitedTimeDishService.insertLTDish(
          new LimitedTimeDish(
            limitedTimeDish.dishName,
            req.body.foodLocationName,
            req.body.address,
            req.body.postalCode,
            req.body.country,
            limitedTimeDish.startDateTime,
            limitedTimeDish.endDateTime
          )
        );
        if (!result) {
          return res.status(404).json({
            success: false,
            error: `Failed to insert limited time dish: ${limitedTimeDish.dishName}`,
          });
        }
      }
    }
    res.json({
      success: true,
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = router;
