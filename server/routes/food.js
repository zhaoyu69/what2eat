const router = require("express-promise-router")();
const FoodService = require("../services/food");
const { parseobj2json } = require('../helpers/parse');
const { reDataGenerator } = require('../helpers/reData');

router.post('/getFoods', async (req, res) => {
  const { pageNo, pageSize, name } = req.body;
  const list = await FoodService.getFoods({pageNo, pageSize, name}).then(parseobj2json);
  const total = await FoodService.getFoodsTotal({name});
  const result = reDataGenerator({
    data: {list, total}
  });
  res.send(result);
});
router.post('/updateFood', async (req, res) => {
  const { id, name, description, kindId, price, thumbUrl } = req.body;
  const data = await FoodService.updateFood(id, name, description, kindId, price, thumbUrl).then(parseobj2json);
  const result = reDataGenerator({
    data
  });
  res.send(result);
});
router.post('/getFoodDetail', async (req, res) => {
  const { id } = req.body;
  const data = await FoodService.getFoodDetail(id).then(parseobj2json);
  const result = reDataGenerator({
    data
  });
  res.send(result);
});
router.post('/removeFood', async (req, res) => {
  const { id } = req.body;
  const data = await FoodService.removeFood(id).then(parseobj2json);
  const result = reDataGenerator({
    data
  });
  res.send(result);
});

module.exports = router;
