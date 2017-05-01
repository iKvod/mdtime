/**
 * Created by rafa on 17/04/2017.
 */
/**
 * Created by rafa on 11/04/2017.
 */
var express = require('express');
var router = express.Router();
var Subsidary = require('../../models/company/subsidary');
var dbOps = require('../Helpers/dbRouteCommon');



router.get('/', function (req, res, next) {
  Subsidary.find({})
    .lean()
    .exec(function (err, cands) {
      if(err){
        err.status = 500;
        err.message = 'Неизвестная ошибка';
        res.send(err);
        return;
      }
      if(cands.length){
        res.send(cands);
      } else{
        res.send({message: "Нет данных", status: 404})
      }
    })
});

router.post('/', function (req, res, next) {
  var subs = new Subsidary({
    subsidary: req.body.subsidary,
    secondary: req.body.secondary
  });

  subs.save(function (err, savedData) {
    if(err){
      err.status = 500;
      err.message = 'Неизвестная ошибка';
      res.send(err);
      return;
    }

    res.status(201).send({message: 'Компания ' + savedData.subsidary + ' сохранена успешно'})
  });

});

router.put('/sub/:id', function (req, res, next) {
  dbOps.updateOneRoute(Subsidary, req.params.id, req.body.subsidary, 'subsidary',
    function (err, data) {
    if(err){
      res.send(err);
      return;
    }
      res.send(data);
  });
});


router.delete('/:id', function (req, res, next) {
  Subsidary.remove({_id: req.params.id})
    .lean()
    .exec(function (err, data) {
      if(err){
        err.status = 500;
        err.message = 'Ошибка неизветсная.';
        res.send(err);
        return;
      }
      res.send(data);
    })
});


module.exports = router;
