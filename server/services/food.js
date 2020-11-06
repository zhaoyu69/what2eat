const Parse = require('parse/node');
const FoodObj = Parse.Object.extend("Food");
const KindObj = Parse.Object.extend("Kind");
const { skipCount } = require('../helpers/parse');

function getFoods(condition) {
  const {pageNo, pageSize, name} = condition;
  const query = new Parse.Query(FoodObj);
  query.notEqualTo('isDeleted', true);
  if(pageNo && pageSize) {
    // 分页查询
    query.skip(skipCount(pageNo, pageSize));
    query.limit(pageSize);
  } else {
    // 全量查询
    query.limit(99999);
  }
  if(name) {
    // 名称模糊查询
    query.fullText('name', name);
  }
  query.include(['kind']);
  return query.find();
}

function getFoodsTotal(condition) {
  const { name } = condition;
  const query = new Parse.Query(FoodObj);
  query.notEqualTo('isDeleted', true);
  if(name) {
    // 名称模糊查询
    query.fullText('name', name);
  }
  return query.count();
}

function updateFood(id, name, description, kindId, price, thumbUrl) {
  const foodObj = id ? FoodObj.createWithoutData(id) : new FoodObj();
  foodObj.set('name', name);
  foodObj.set('description', description);
  foodObj.set('kind', KindObj.createWithoutData(kindId));
  foodObj.set('price', price);
  foodObj.set('thumbUrl', thumbUrl);
  return foodObj.save();
}

function getFoodDetail(id) {
  const query = new Parse.Query(FoodObj);
  query.notEqualTo('isDeleted', true);
  return query.get(id);
}

function removeFood(id) {
  const foodObj = FoodObj.createWithoutData(id);
  foodObj.set('isDeleted', true);
  return foodObj.save();
}

module.exports = {
  getFoods,
  getFoodsTotal,
  updateFood,
  getFoodDetail,
  removeFood
};
