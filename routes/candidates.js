/**
 * Created by rafa on 11/04/2017.
 */
var express = require('express');
var router = express.Router();
var Candidate = require('../models/candidates');

router.get('/', function (req, res, next) {
  Candidate.find({})
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

router.put('/:id', function (req, res, next) {
  Candidate.findOne({_id: req.params.id})
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


module.exports = router;
