const Parse = require('parse/node');
const PoolObj = Parse.Object.extend("Pool");
const FoodObj = Parse.Object.extend("Food");
const { skipCount } = require('../helpers/parse');

function getPools(condition) {
  const { pageNo, pageSize } = condition;
  const query = new Parse.Query(PoolObj);
  query.notEqualTo('isDeleted', true);
  query.skip(skipCount(pageNo, pageSize));
  query.limit(pageSize);
  query.include(['foods', 'foods.kind']);
  return query.find();
}

function getPoolsTotal() {
  const query = new Parse.Query(PoolObj);
  query.notEqualTo('isDeleted', true);
  return query.count();
}

function updatePool(id, name, description, foodIds) {
  const poolObj = id ? PoolObj.createWithoutData(id) : new PoolObj();
  const parseFoods = foodIds.map(foodId => FoodObj.createWithoutData(foodId));
  poolObj.set('foods', parseFoods);
  poolObj.set('name', name);
  poolObj.set('description', description);
  return poolObj.save();
}

function getPoolDetail(id) {
  const query = new Parse.Query(PoolObj);
  query.notEqualTo('isDeleted', true);
  return query.get(id);
}

function removePool(id) {
  const poolObj = PoolObj.createWithoutData(id);
  poolObj.set('isDeleted', true);
  return poolObj.save();
}

module.exports = {
  getPools,
  getPoolsTotal,
  updatePool,
  getPoolDetail,
  removePool
};
