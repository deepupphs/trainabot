const utils = require("../utils");
const logger = require("../handlers/logHandlers");
const Joi = require("joi");
const orderid = require("order-id")("mysecret");

module.exports = {
  createOrder: async (req, res) => {
    //validation
    const schema = Joi.object().keys({
      user_name: Joi.string().required(),
      user_email: Joi.string().required(),
      user_phone: Joi.string().required(),
      address: Joi.string().required(),
      order_value: Joi.string().required(),
    });

    const checkDetails = {
      user_name: req.body.user_name,
      user_email: req.body.user_email,
      user_phone: req.body.user_phone,
      address: req.body.address,
      order_value: req.body.order_value,
    };

    Joi.validate(checkDetails, schema, async (err, value) => {
      if (err) {
        // send a 422 error response if validation fails
        console.log("error", err.details[0].message);
        return res.status(422).json({
          success: false,
          data: {
            msg: err.details[0].message,
            results: null,
          },
        });
      } else {
        try {
          let findemail = {
            email: req.body.user_email,
          };

          let userDetails = await utils.MODEL_ORM.findOne(
            utils.MODEL.users,
            findemail
          );

          console.log("userDetails is", userDetails);

          if (userDetails != null) {
            const orderuid = orderid.generate();

            let query1 = {
              user_name: req.body.user_name,
              user_email: req.body.user_email,
              user_phone: req.body.user_phone,
              address: req.body.address,
              order_value: req.body.order_value,
              order_id: orderuid,
            };

            console.log("query1 is", query1);

            let creatingorder = await utils.MODEL_ORM.create(
              utils.MODEL.orders,
              query1
            );

            console.log("creatingorder is", creatingorder);

            if (creatingorder != null) {
              let userQuery = [
                {
                  email: req.body.user_email,
                },
                {
                  $addToSet: {
                    order_id: creatingorder.order_id,
                  },
                },
                {
                  w: 1,
                },
              ];

              console.log("userQuery is", userQuery);

              let userUpdate = await utils.MODEL_ORM.update(
                utils.MODEL.users,
                userQuery
              );

              console.log("userUpdate is", userUpdate);

              if (userUpdate.nModified) {
                return res.status(200).json({
                  success: true,
                  data: {
                    msg: ` Order id Added to User Collection`,
                    results: null,
                  },
                });
              } else {
                return res.status(400).json({
                  success: false,
                  data: {
                    msg: ` Order id not Added to User Collection`,
                    results: null,
                  },
                });
              }
            } else {
              return res.status(200).json({
                success: false,
                data: {
                  msg: ` Order not Created successfully`,
                  results: null,
                },
              });
            }
          } else {
            console.log(`unauthorized : user with this email not found`);
            logger.info(`unauthorized :  user with this email not found`);
            return res.status(401).json({
              success: false,
              data: {
                msg: `User unauthorized`,
                results: null,
              },
            });
          }
        } catch (e) {
          logger.error("Order Create error : ", e);
          return res.status(500).json({
            success: false,
            data: {
              msg: e.message,
              results: null,
            },
          });
        }
      }
    });
  },

  //================Get All Orders======================================
  getAllOrders: async (req, res) => {
    try {
      let query = {};

      let getAllOrdersDetails = await utils.MODEL_ORM.findAll(
        utils.MODEL.orders,
        query
      );

      console.log("all orders", getAllOrdersDetails);

      if (getAllOrdersDetails != null) {
        logger.info("All Orders Details found successfully");
        return res.status(200).json({
          success: true,
          data: {
            msg: `All Orders Details found successfully`,
            results: getAllOrdersDetails,
          },
        });
      } else {
        return res.status(404).json({
          success: true,
          data: {
            msg: `All Orders Details Not found `,
            results: [],
          },
        });
      }
    } catch (e) {
      logger.error("Get All Orders details error : ", e.message);
      return res.status(500).json({
        success: false,
        data: {
          msg: e.message,
          results: null,
        },
      });
    }
  },

  //================Get Single Order======================================
  getSingleOrder: async (req, res) => {
    try {
      let query = {
        _id: req.params.ID,
      };

      console.log("query", query);

      let getSingleOrderDetails = await utils.MODEL_ORM.findOne(
        utils.MODEL.orders,
        query
      );

      console.log("all order", getSingleOrderDetails);

      if (getSingleOrderDetails != null) {
        logger.info("Order Details found successfully");
        return res.status(200).json({
          success: true,
          data: {
            msg: `Order Details found successfully`,
            results: getSingleOrderDetails,
          },
        });
      } else {
        return res.status(404).json({
          success: true,
          data: {
            msg: `Order Details Not found `,
            results: [],
          },
        });
      }
    } catch (e) {
      logger.error("Get User details error : ", e.message);
      return res.status(500).json({
        success: false,
        data: {
          msg: e.message,
          results: null,
        },
      });
    }
  },

  //===========================Get All Orders with User Details=========================================

  getAllOrdersWithUser: async (req, res) => {
    try {
      let user = utils.MODEL.users.Model;
      let order = utils.MODEL.orders.Model;

      console.log("user_model ", user);

      const Orders = await order
        .aggregate([
          {
            $lookup: {
              from: "users",
              localField: "order_id",
              foreignField: "order_id",
              as: "OrderDetails",
            },
          },
          {
            $unwind: "$OrderDetails",
          },

          {
            $project: {
              user_location: "$OrderDetails.user_location",
              designation: "$OrderDetails.designation",
              user_name: 1,
              user_email: 1,
              address: 1,
              order_value: 1,
            },
          },
        ])

        .exec()
        .then((Orders) => {
          if (Orders.length > 0) {
            let result = {
              Orders,
            };
            logger.info("All Order Details found successfully");
            return res.status(200).json({
              success: true,
              data: {
                msg: `All Order Details found successfully`,
                results: result,
              },
            });
          } else {
            logger.info("Order not found");
            return res.status(200).json({
              success: false,
              data: {
                msg: `Order not found`,
                results: null,
              },
            });
          }
        });
    } catch (e) {
      logger.error("Get All Order details error : ", e.message);
      return res.status(500).json({
        success: false,
        data: {
          msg: e.message,
          results: null,
        },
      });
    }
  },

  //==========================Get All Orders with Single User Details============================================

  getOrdersWithSingleUser: async (req, res) => {
    try {
      let user = utils.MODEL.users.Model;
      let order = utils.MODEL.orders.Model;

      console.log("user_model ", user);

      const Orders = await user

        .aggregate([
          { $match: { email: req.params.email } },
          {
            $lookup: {
              from: "orders",
              localField: "order_id",
              foreignField: "order_id",
              as: "OrderDetails",
            },
          },
          {
            $unwind: "$OrderDetails",
          },

          {
            $project: {
              order_value: "$OrderDetails.order_value",
              address: "$OrderDetails.address",
              name: 1,
              email: 1,
              phone: 1,
              user_location: 1,
              designation: 1,
              company: 1,
            },
          },
        ])

        .exec()
        .then((Orders) => {
          if (Orders.length > 0) {
            let result = {
              Orders,
            };
            logger.info("All Order Details found successfully");
            return res.status(200).json({
              success: true,
              data: {
                msg: `All Order Details found successfully`,
                results: result,
              },
            });
          } else {
            logger.info("Order not found");
            return res.status(200).json({
              success: false,
              data: {
                msg: `Order not found`,
                results: null,
              },
            });
          }
        });
    } catch (e) {
      logger.error("Get All Order details error : ", e.message);
      return res.status(500).json({
        success: false,
        data: {
          msg: e.message,
          results: null,
        },
      });
    }
  },
};
