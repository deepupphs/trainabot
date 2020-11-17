const ordersController = require("../controllers/orders");
const utils = require("../utils");

module.exports = (router) => {
  router.route("/users/create-order").post(ordersController.createOrder);

  router.route("/users/get-all-order").get(ordersController.getAllOrders);

  router
    .route("/users/get-single-order/:ID")
    .get(ordersController.getSingleOrder);

  router
    .route("/users/get-all-user-order")
    .get(ordersController.getAllOrdersWithUser);

  router
    .route("/users/get-single-user-order/:email")
    .get(ordersController.getOrdersWithSingleUser);
};
