const routes = require('next-routes')();

routes
  .add('/search/:term', '/search/searchindex')
  .add('/campaigns/new', '/campaigns/new')
  .add('/campaigns/gems', '/campaigns/gems')
  .add('/campaigns/mydeck', '/campaigns/mydeck')
  .add('/campaigns/:address', '/campaigns/show') //adding new routes mapping, : represents wildcard variable
// add(url we're looking for, page.js we want to show...)
  .add('/campaigns/:address/requests', '/campaigns/requests/index')
  .add('/campaigns/:address/requests/new', '/campaigns/requests/new');

module.exports = routes;
