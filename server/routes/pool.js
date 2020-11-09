const router = require("express-promise-router")();
const PoolService = require("../services/pool");
const { parseobj2json } = require('../helpers/parse');
const { reDataGenerator } = require('../helpers/reData');

router.post('/getPools', async (req, res) => {
  const { pageNo, pageSize } = req.body;
  const list = await PoolService.getPools({pageNo, pageSize}).then(parseobj2json);
  const total = await PoolService.getPoolsTotal();
  const result = reDataGenerator({
    data: {list, total}
  });
  res.send(result);
});
router.post('/updatePool', async (req, res) => {
  const { id, name, description, foodIds } = req.body;
  const data = await PoolService.updatePool(id, name, description, foodIds).then(parseobj2json);
  const result = reDataGenerator({
    data
  });
  res.send(result);
});
router.post('/setCurrentPool', async (req, res) => {
  const { id, isCurrent } = req.body;
  const data = await PoolService.setCurrentPool(id, isCurrent).then(parseobj2json);
  const result = reDataGenerator({
    data
  });
  res.send(result);
});
router.post('/getPoolDetail', async (req, res) => {
  const { id } = req.body;
  const data = await PoolService.getPoolDetail(id).then(parseobj2json);
  const result = reDataGenerator({
    data
  });
  res.send(result);
});
router.post('/removePool', async (req, res) => {
  const { id } = req.body;
  const data = await PoolService.removePool(id).then(parseobj2json);
  const result = reDataGenerator({
    data
  });
  res.send(result);
});
router.post('/getCurrentPool', async (req, res) => {
  const data = await PoolService.getCurrentPool().then(parseobj2json);
  const result = reDataGenerator({
    data
  });
  res.send(result);
});

module.exports = router;
