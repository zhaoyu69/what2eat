const Parse = require('parse/node');
const KindObj = Parse.Object.extend("Kind");
const { skipCount } = require('../helpers/parse');

function queryWith(query, condition) {
  const { name, sorter } = condition;
  if(name) {
    query.contains('name', name);
  }
  if(sorter && sorter.order) {
    const { field, order } = sorter;
    query[`${order}ing`](`${field}`);
  } else {
    query.descending("updatedAt");
  }
}

function getKinds(condition) {
  const { pageNo, pageSize } = condition;
  const query = new Parse.Query(KindObj);
  query.notEqualTo('isDeleted', true);
  if(pageNo && pageSize) {
    query.skip(skipCount(pageNo, pageSize));
    query.limit(pageSize);
  } else {
    query.limit(99999);
  }
  queryWith(query, condition);
  return query.find();
}

function getKindsTotal(condition) {
  const query = new Parse.Query(KindObj);
  query.notEqualTo('isDeleted', true);
  queryWith(query, condition);
  return query.count();
}

function updateKind(id, name, description, thumbUrl) {
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
