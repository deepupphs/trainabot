const mongoose = require("mongoose");

const ModelSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },

  user_location: {
    type: String,
  },

  designation: {
    type: String,
  },

  company: {
    type: String,
  },
  order_id: [String],

  created_date: {
    type: Date,
    default: Date.now,
  },
});

//========Hiding important field and unwanted fields=======================

ModelSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.__v;

  return userObject;
};

module.exports.Model = mongoose.model("Users", ModelSchema);
