const defaultReData = {
  code: 0,
  message: '',
  data: null,
};
function reDataGenerator(reData) {
  return {
    ...defaultReData,
    ...reData
  }
}
module.exports = {
  reDataGenerator
}
