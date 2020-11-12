const Parse = require('parse/node');
const FoodObj = Parse.Object.extend("Food");
const KindObj = Parse.Object.extend("Kind");
const { skipCount } = require('../helpers/parse');

function queryWith(query, condition) {
  const { name, kindIds=[], minPrice, maxPrice, sorter } = condition;
  if(name) {
    query.contains('name', name);
  }
  if(kindIds.length) {
    query.containedIn('kind', kindIds.map(kindId => KindObj.createWithoutData(kindId)));
  }
  if(minPrice) {
    query.greaterThanOrEqualTo('price', minPrice);
  }
  if(maxPrice) {
    query.lessThanOrEqualTo('price', maxPrice);
  }
  if(sorter && sorter.order) {
    const { field, order } = sorter;
    query[`${order}ing`](`${field}`);
  } else {
    query.descending("updatedAt");
  }
  return query;
}

function getFoods(condition) {
  const {pageNo, pageSize} = condition;
  const query = new Parse.Query(FoodObj);
  query.notEqualTo('isDeleted', true);
  if(pageNo && pageSize) {
    query.skip(skipCount(pageNo, pageSize));
    query.limit(pageSize);
  } else {
    query.limit(99999);
  }
  queryWith(query, condition);
  query.include(['kind']);
  return query.find();
}

function getFoodsTotal(condition) {
  const query = new Parse.Query(FoodObj);
  query.notEqualTo('isDeleted', true);
  queryWith(query, condition);
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
