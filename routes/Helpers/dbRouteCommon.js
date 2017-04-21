/**
 * Created by rafa on 18/04/2017.
 */
var errorHandeler = require('./errorHandlers');

var getAllRoute = function (Model, query , selectObj, populateStr, callback) {
  if(populateStr){
    Model.find(query)
      .lean()
      .select(selectObj)
      .populate(populateStr) // string
      .exec(function (err, data) {
        if(err){
          callback(errorHandeler.errorHandlerBasic(err, 'Неизвестная ошибка', 500), null);
          return;
        }

        if(data.length > 0 && data.length){
          callback(null, data)
        } else {
          var error = {};
          callback(errorHandeler.errorHandlerBasic(error, 'Не найден', 404), null);
        }
      })
  } else {
    Model.find(query)
      .lean()
      .select(selectObj)
      .exec(function (err, data) {
        if(err){
          callback(errorHandeler.errorHandlerBasic(err, 'Неизвестная ошибка', 500), null);
          return;
        }

        if(data.length > 0 && data.length){
          callback(null, data)
        } else {
          var error = {};
          callback(errorHandeler.errorHandlerBasic(error, 'Не найден', 404), null);
        }
      })
  }
};


var getByIdRoute = function (Model, query, selectObj, populateObj, callback ) {

  Model.findOne( query )
    .lean()
    .select(selectObj)
    .populate(populateObj)
    .exec(function (err, data) {
      if(err){
        callback(errorHandeler.errorHandlerBasic(err, 'Неизвестная ошибка', 500), null);
        return;
      }

      if(data){
        callback(null, data)
      } else {
        var error = {};
        callback(errorHandeler.errorHandlerBasic(error, 'Не найден', 404), null);
      }
    });
};

var createRoute = function (Model, data, callback) {
  var schema = new Model(data);

  schema.save(function (err, savedData) {
    if(err){
      callback(errorHandeler.errorHandlerBasic(err, 'Неизвестная ошибка', 500), null);
      return;
    }
    callback(null, savedData);
  });
};


var updateRoute = function (Model, id, data, callback) {
  Model.find({_id: id})
  //TODO

};

var deleteOneRoute = function (Model, id, callback) {
  Model.remove({_id: id})
    .exec(function (err, data) {
      if(err){
        callback(errorHandeler.errorHandlerBasic(err, 'Неизвестная ошибка при удалений'), null);
        return;
      }
      if(data){
        callback(null, data);
      }
    });
};

var deleteAllRoute = function (Model, callback) {
  Model.remove({})
    .exec(function (err, data) {
      if(err){
        callback(errorHandeler.errorHandlerBasic(err, 'Неизвестная ошибка при удалений'), null);
        return;
      }
      if(data){
        callback(null, data);
      }
    });
};



module.exports = {
  getAllRoute: getAllRoute,
  getByIdRoute: getByIdRoute,
  createRoute: createRoute,
  deleteOneRoute: deleteOneRoute,
  deleteAllRoute: deleteAllRoute
};