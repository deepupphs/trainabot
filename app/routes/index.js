const users = require("./users");
const orders = require("./orders")

module.exports = (router) => {
  users(router);
  orders(router);
  return router;
};
