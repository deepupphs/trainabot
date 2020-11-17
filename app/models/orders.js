const mongoose = require("mongoose");


const ModelSchema = mongoose.Schema({
  user_name: {
    type: String,
    required: true,
    trim: true,
 
  },
  user_email: {
    type: String,
    required: true,
    lowercase: true,
  },
  user_phone: {
    type: String,
    required: true,
    trim: true,
  },

  address: {
    type: String,
    required: true,
  },

  order_value: {
    type: String,
    required: true,
  },
 
  order_id: {
    type: String,
  },

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

module.exports.Model = mongoose.model("Orders", ModelSchema);
