const userDetailsController = require("../controllers/users_details");
const utils = require("../utils");

module.exports = (router) => {
  router.route("/users/add-user").post(userDetailsController.addUser);

  router.route("/users/get-all-user").get(userDetailsController.getAllUsers);

  router
    .route("/users/get-single-user/:ID")
    .get(userDetailsController.getSingleUsers);
};
