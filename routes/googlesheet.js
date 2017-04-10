/**
 * Created by rafa on 09/04/2017.
 */

var express = require('express');
var router = express.Router();
var Candidate = require('../models/candidates');


router.get('/candidate', function(req, res, next){
  Candidate.find({}, function (err, candidates) {
    if(err){
      console.log(err);
      return;
    }

    res.send(candidates);
  })

});

router.post('/candidate', function (req, res, next) {
  console.log(req.body);
  var cand = req.body;

  var candidate = new Candidate({
    'general_name' : cand.general_name,
    'general_middle_name' : cand.general_middle_name,
    'general_surname' : cand.general_surname ,
    'general_sex' : cand.general_sex,
    'general_birthday' : cand.general_birthday,
    'general_birth_place' : cand.general_birth_place,
    'general_nationality' : cand.general_nationality,
    'personal_work_conditions' : cand.personal_work_conditions,
    'personal_experience' : cand.personal_experience,
    'personal_house_phone' : cand.personal_house_phone,
    'personal_phone' : cand.personal_phone,
    'personal_email' : cand.personal_email,
    'personal_education_level' : cand.personal_education_level,
    'personal_life_place' : cand.personal_life_place,
    'personal_can_move' : cand.personal_can_move,
    'personal_photo' : cand.personal_photo,
    'personal_cv' : cand.personal_cv,
    'personal_can_trips' : cand.personal_can_trips,
    'education_name' : cand.education_name,
    'education_faculty' :cand.education_faculty,
    'education_specialty' :cand.education_specialty,
    'education_ball' : cand.education_ball,
    'education_start' : cand.education_start,
    'education_end' : cand.education_end,
    'education_form' : cand.education_form,
    'education_kazakh' : cand.education_kazakh,
    'education_russian' : cand.education_russian,
    'education_english' : cand.education_english,
    'education_other' : cand.education_other,
    'lastwork_name' : cand.lastwork_name,
    'lastwork_position' : cand.lastwork_position,
    'lastwork_salary' : cand.lastwork_salary,
    'lastwork_start' : cand.lastwork_start,
    'lastwork_end' : cand.lastwork_end,
    'lastwork_rating' : cand.lastwork_rating,
    'lastwork_duties' : cand.lastwork_duties,
    'lastwork__end_reason' : cand.lastwork__end_reason,
    'lastwork_reference_person' : cand.lastwork_reference_person,
    'lastwork_reference_person_position' : cand.lastwork_reference_person_position,
    'lastwork_reference_person_phone' : cand.lastwork_reference_person_phone,
    'summery_desired_salary' : cand.summery_desired_salary,
    'summery_where_find_us' : cand.summery_where_find_us,
    'summery_when_can_start_work' : cand.summery_when_can_start_work,
    'summery_fb' : cand.summery_fb,
    'summery_insta' : cand.summery_insta,
    'summery_vk' : cand.summery_vk,
    'summery_interview_type' : cand.summery_interview_type,
    'summery_take_important' : cand.summery_take_important,
    'summery_family' : cand.summery_family,
    'summery_car' : cand.summery_car,
    'summery_question' : cand.summery_question,
    'summery_additional' : cand.summery_additional,
    'summery_certificates' : cand.summery_certificates,
    'interview_day' : cand.interview_day,
    'interview_time' : cand.interview_time,
    'vacancy_id' : cand.vacancy_id,
    'megaplan': Math.floor(Math.random() * (90000000 - 1000) + 1000),
    'one_c': Math.floor(Math.random() * (90000000 - 1000) + 1000),
    'computer': Math.floor(Math.random() * (90000000 - 1000) + 1000),
    'guest_id': cand.id_user,
    'department': cand.department
  });
  
  
  candidate.save(function (err, savedCandidate) {
    if(err){
      res.status(500).send(err)
      return;
    }
    res.send('Candidate saved');
  })

});

//Not complited
router.put('/candidate/:id', function (req, res, next) {
  console.log(req.body);
  var candidate = req.body;

  Candidate.findById(req.params.id)
    .exec(function (err, cand) {

        cand.general_name = candidate.general_name || cand.general_name;
        cand.general_surname = candidate.general_surname || cand.general_surname;
        cand.megaplan = candidate.megaplan || cand.megaplan;
        cand.one_c =  candidate.one_c || cand.one_c;
        cand.employee_id = candidate.employee_id;
        cand.bot_id = candidate.bot_id || cand.bot_id;
        cand.admin = candidate.admin;
        cand.guest_id = candidate.guest_id || cand.guest_id;


      cand.save(function (err, saved) {
            if(err){
              res.status(500).send(err);
              return;
            }
            res.send(saved);
        });
    });
});

// router.delete('/', function (req, res, next) {
//
// });
//
//
// router.get('/:id', function (req, res, next) {
//
// });
//
// router.put('/:id', function (req, res, next) {
//
// });
//
// router.delete('/:id', function (req, res, next) {
//
// });

module.exports = router;