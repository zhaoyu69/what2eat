function toJSON(doc) {
  if (doc) {
    return doc.toJSON();
  }
  else {
    return null;
  }
}

function toJSONList(docs) {
  return docs.map(toJSON);
}

function parseobj2json(obj) {
  return obj instanceof Array ? toJSONList(obj) : toJSON(obj);
}

function skipCount(pageNo, pageSize) {
  return (pageNo - 1) * pageSize;
}

module.exports = {
  toJSON,
  toJSONList,
  parseobj2json,
  skipCount
}
