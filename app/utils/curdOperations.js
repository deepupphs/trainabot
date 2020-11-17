"use strict";

module.exports = {
  findOne: (model, query, selected) => {
    let db_model = model.Model;
    //console.log(db_model)
    return new Promise(function (resolve, reject) {
      db_model
        .findOne(query)
        .select(selected)
        .then((response) => {
          //console.log("-- find one response ", response);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  create: (model, query) => {
    console.log("connected to create");
    let db_model = model.Model;
    //console.log(db_model);
    return new Promise(function (resolve, reject) {
      db_model
        .create(query)
        .then((response) => {
          //console.log("-- create response ", response);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  update: (model, query) => {
    let db_model = model.Model;
    return new Promise(function (resolve, reject) {
      db_model
        .updateOne(query[0], query[1], query[2])
        .then((response) => {
          //console.log("-- update response ", response);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  findAll: (model, query, selected, populate, sort) => {
    let db_model = model.Model;
    //console.log(selected);
    return new Promise(function (resolve, reject) {
      db_model
        .find(query)
        .select(selected)
        .populate(populate)
        .sort(sort)
        .then((response) => {
          //console.log("-- get all response ", response);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  delete: (model, query) => {
    let db_model = model.Model;
    //console.log(db_model)
    return new Promise(function (resolve, reject) {
      db_model
        .deleteOne(query)
        .then((response) => {
          //console.log("-- delete ", response);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  //mongodb aggregation pipeline
  aggregation: (model, pipeline) => {
    let db_model = model.Model;
    // console.log(
    //   "---------------------------aggregation----------------------------------",
    //   pipeline
    // );
    return new Promise(function (resolve, reject) {
      db_model
        .aggregate(pipeline)
        .then((response) => {
          console.log(`aggregation response ==== ${response}`);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
