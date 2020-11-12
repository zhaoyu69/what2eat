const router = require("express-promise-router")();
const KindService = require("../services/kind");
const { parseobj2json } = require('../helpers/parse');
const { reDataGenerator } = require('../helpers/reData');

router.post('/getKinds', async (req, res) => {
  const list = await KindService.getKinds(req.body).then(parseobj2json);
  const total = await KindService.getKindsTotal(req.body);
  const result = reDataGenerator({
    data: {list, total}
  });
  res.send(result);
});
router.post('/updateKind', async (req, res) => {
  const { id, name, description, thumbUrl } = req.body;
  const data = await KindService.updateKind(id, name, description, thumbUrl).then(parseobj2json);
  const result = reDataGenerator({
    data
  });
  res.send(result);
});
router.post('/getKindDetail', async (req, res) => {
  const { id } = req.body;
  const data = await KindService.getKindDetail(id).then(parseobj2json);
  const result = reDataGenerator({
    data
  });
  res.send(result);
});
router.post('/removeKind', async (req, res) => {
  const { id } = req.body;
  const data = await KindService.removeKind(id).then(parseobj2json);
  const result = reDataGenerator({
    data
  });
  res.send(result);
});

module.exports = router;
