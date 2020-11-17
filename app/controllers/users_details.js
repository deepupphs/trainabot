const utils = require("../utils");
const logger = require("../handlers/logHandlers");
const Joi = require("joi");

module.exports = {
  addUser: async (req, res) => {
    //validation
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      user_location: Joi.string().required(),
      designation: Joi.string().required(),
      company: Joi.string().required(),
    });

    const checkDetails = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      user_location: req.body.user_location,
      designation: req.body.designation,
      company: req.body.company,
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
          let query1 = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            user_location: req.body.user_location,
            designation: req.body.designation,
            company: req.body.company,
          };

          console.log("query1 is", query1);

          let addinguser = await utils.MODEL_ORM.create(
            utils.MODEL.users,
            query1
          );

          console.log("addinguser is", addinguser);

          if (addinguser != null) {
            logger.info("User Added successfully");
            return res.status(201).json({
              success: true,
              data: {
                msg: "User Added successfully",
                results: addinguser,
              },
            });
          } else {
            return res.status(200).json({
              success: false,
              data: {
                msg: ` User not Added successfully`,
                results: null,
              },
            });
          }
        } catch (e) {
          logger.error("Add User error : ", e);
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

  //================Get All Users======================================
  getAllUsers: async (req, res) => {
    try {
      let query = {};

      let getAllUserDetails = await utils.MODEL_ORM.findAll(
        utils.MODEL.users,
        query
      );

      console.log("all users", getAllUserDetails);

      if (getAllUserDetails != null) {
        logger.info("All Users Details found successfully");
        return res.status(200).json({
          success: true,
          data: {
            msg: `All Users Details found successfully`,
            results: getAllUserDetails,
          },
        });
      } else {
        return res.status(404).json({
          success: true,
          data: {
            msg: `All Users Details Not found `,
            results: [],
          },
        });
      }
    } catch (e) {
      logger.error("Get All Users details error : ", e.message);
      return res.status(500).json({
        success: false,
        data: {
          msg: e.message,
          results: null,
        },
      });
    }
  },

  //================Get Single Users======================================
  getSingleUsers: async (req, res) => {
    try {
      let query = {
        _id: req.params.ID,
      };

      console.log("query", query);

      let getSingleUserDetails = await utils.MODEL_ORM.findOne(
        utils.MODEL.users,
        query
      );

      console.log("all users", getSingleUserDetails);

      if (getSingleUserDetails != null) {
        logger.info("User Details found successfully");
        return res.status(200).json({
          success: true,
          data: {
            msg: `User Details found successfully`,
            results: getSingleUserDetails,
          },
        });
      } else {
        return res.status(404).json({
          success: true,
          data: {
            msg: `User Details Not found `,
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
};
