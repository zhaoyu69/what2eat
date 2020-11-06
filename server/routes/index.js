module.exports = function(app) {
  app.use('/kind', require('./kind'));
  app.use('/food', require('./food'));
  app.use('/pool', require('./pool'));
};

