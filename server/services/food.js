const Parse = require('parse/node');
const FoodObj = Parse.Object.extend("food");

function getFoods() {
  const query = new Parse.Query(FoodObj);
  query.notEqualTo('isDeleted', true);
  return query.find();
}

function addFood(newFood) {
  const foodObj = new FoodObj();
  return foodObj.save();
}

function updateFood(id, newFood) {
  const foodObj = FoodObj.createWithoutData(id);
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
  addFood,
  updateFood,
  getFoodDetail,
  removeFood
};
