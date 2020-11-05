const Parse = require('parse/node');
const KindObj = Parse.Object.extend("kind");
const { skipCount } = require('../helpers/parse');

function getKinds(pageNo, pageSize) {
  const query = new Parse.Query(KindObj);
  query.notEqualTo('isDeleted', true);
  query.skip(skipCount(pageNo, pageSize));
  query.limit(pageSize);
  return query.find();
}

function getKindsTotal() {
  const query = new Parse.Query(KindObj);
  query.notEqualTo('isDeleted', true);
  return query.count();
}

function updateKind(id, name, description, thumbUrl) {
  console.log(id);
  const kindObj = id ? KindObj.createWithoutData(id) : new KindObj();
  kindObj.set('name', name);
  kindObj.set('description', description);
  kindObj.set('thumbUrl', thumbUrl);
  return kindObj.save();
}

function getKindDetail(id) {
  const query = new Parse.Query(KindObj);
  query.notEqualTo('isDeleted', true);
  return query.get(id);
}

function removeKind(id) {
  const kindObj = KindObj.createWithoutData(id);
  kindObj.set('isDeleted', true);
  return kindObj.save();
}

module.exports = {
  getKinds,
  getKindsTotal,
  updateKind,
  getKindDetail,
  removeKind
};
