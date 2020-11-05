module.exports = function(app) {
  app.use('/kind', require('./kind'));
  app.use('/food', require('./food'));
};

