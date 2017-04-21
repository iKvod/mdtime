/**
 * Created by rafa on 17/04/2017.
 */
/**
 * Created by rafa on 11/04/2017.
 */
var express = require('express');
var router = express.Router();
var Subsidary = require('../models/subsidary');



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

router.put('/:id', function (req, res, next) {
  Subsidary.findOne({_id: req.params.id})
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



// router.get('/news', function (req, res, next) {
//   News.find()
//     .select({
//     })
//     .populate('author')
//     .exec(function (err, data) {
//       console.log(data);
//     });
// });

module.exports = router;
