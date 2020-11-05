const express = require('express');
const router = require("express-promise-router")();
const FoodService = require("../services/food");
const { parseobj2json } = require('../helpers/parse');

router.post('/getFoods', async (req, res) => {
  return FoodService.getFoods().then(parseobj2json);
});
router.post('/addFood', async (req, res) => {
  return FoodService.addFood().then(parseobj2json);
});
router.post('/updateFood', async (req, res) => {
  return FoodService.updateFood().then(parseobj2json);
});
router.post('/getFoodDetail', async (req, res) => {
  return FoodService.getFoodDetail().then(parseobj2json);
});
router.post('/removeFood', async (req, res) => {
  return FoodService.removeFood().then(parseobj2json);
});

module.exports = router;
