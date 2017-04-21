/**
 * Created by rafa on 17/04/2017.
 */
/**
 * Created by rafa on 11/04/2017.
 */
var express = require('express');
var router = express.Router();
var Departments = require('../models/departments');
var Subsidaries = require('../models/subsidary');

router.get('/', function (req, res, next) {
  Departments.find({})
    .exec(function (err, cands) {
      if(err){
        err.status = 500;
        err.message = 'Ошибка неизветсная.';
        res.send(err);
        return;
      }
      res.send(cands);
    })
});

router.post('/', function (req, res, next) {

  var dept = new Departments({
    department: req.body.department,
    subsidary: req.body.subsId
  });
  dept.save(function (err, savedData) {
    if(err){
      err.status = 500;
      err.message = ' Неизвестная ошибка.';
      res.send(err);
      return;
    }

    Subsidaries.findById(req.body.subsId)
      .select({'_id':1, 'departments': 1})
      .exec(function (err, subs) {
        subs.departments.push(savedData._id);
        subs.save(function (err, saved) {
          res.send({message: 'Департамент сохранен'});
        });
      });
  })
});

router.get('/:id', function (req, res, next) {
  Departments.findOne({_id: req.params.id})
    .exec(function (err, cands) {
      if(err){
        err.status = 500;
        err.message = 'Ошибка неизветсная.';
        res.send(err);
        return;
      }
      res.send(cands);
    })
});


router.delete('/:id', function (req, res, next) {
  Departments.remove({_id: req.params.id})
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
