const Parse = require('parse/node');
const KindObj = Parse.Object.extend("Kind");
const { skipCount } = require('../helpers/parse');

function getKinds(condition) {
  const { pageNo, pageSize, name } = condition;
  const query = new Parse.Query(KindObj);
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
  return query.find();
}

function getKindsTotal(condition) {
  const { name } = condition;
  const query = new Parse.Query(KindObj);
  query.notEqualTo('isDeleted', true);
  if(name) {
    // 名称模糊查询
    query.fullText('name', name);
  }
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
