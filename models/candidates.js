/**
 * Created by rafa on 09/04/2017.
 */

'use strict';

var mongoose = require('mongoose');
mongoose.Promise = global.Promise


var Schema = mongoose.Schema;


var Candidate = new Schema({
  'id': { type: Number },
  'today_date': { type: Date, default: null},
  'general_name' : { type: String, default: null },
  'general_middle_name' : { type: String, default: null},
  'general_surname' : { type: String, default: null},
  'general_sex' : { type: String, default: null},
  'general_birthday' : { type: String, default: null},
  'general_birth_place' : { type: String, default: null},
  'general_nationality' : { type: String, default: null},
  'personal_work_conditions' : { type: String, default: null},
  'personal_experience' : { type: String, default: null},
  'personal_house_phone' : { type: String, default: null},
  'personal_phone' : { type: String, default: null},
  'personal_email' : { type: String, default: null},
  'personal_education_level' : { type: String, default: null},
  'personal_life_place' : { type: String, default: null},
  'personal_can_move' : { type: String, default: null},
  'personal_photo' : { type: String, default: null},
  'personal_cv' : { type: String, default: null},
  'personal_can_trips' : { type: String, default: null},
  'education_name' : { type: String, default: null},
  'education_faculty' : { type: String, default: null},
  'education_specialty' : { type: String, default: null},
  'education_ball' : { type: String, default: null},
  'education_start' : { type: Date, default: null},
  'education_end' : { type: Date, default: null},
  'education_form' : { type: String, default: null},
  'education_kazakh' : { type: String, default: null},
  'education_russian' : { type: String, default: null},
  'education_english' : { type: String, default: null},
  'education_other' : { type: String, default: null},
  'lastwork_name' : { type: String, default: null},
  'lastwork_position' : { type: String, default: null},
  'lastwork_salary' : { type: String, default: null},
  'lastwork_start' : { type: String, default: null},
  'lastwork_end' : { type: String, default: null},
  'lastwork_rating' : { type: String, default: null},
  'lastwork_duties' : { type: String, default: null},
  'lastwork__end_reason' : { type: String, default: null},
  'lastwork_reference_person' : { type: String, default: null},
  'lastwork_reference_person_position' : { type: String, default: null},
  'lastwork_reference_person_phone' : { type: String, default: null},
  'summery_desired_salary' : { type: String, default: null},
  'summery_where_find_us' : { type: String, default: null},
  'summery_when_can_start_work' : { type: String, default: null},
  'summery_fb' : { type: String, default: null},
  'summery_insta' : { type: String, default: null},
  'summery_vk' : { type: String, default: null},
  'summery_interview_type' : { type: String, default: null},
  'summery_take_important' : { type: String, default: null},
  'summery_family' : { type: String, default: null},
  'summery_car' : { type: String, default: null},
  'summery_question' : { type: String, default: null},
  'summery_additional' : { type: String, default: null},
  'summery_certificates' : { type: String, default: null},
  'interview_day' : { type: String, default: null},
  'interview_time' : { type: String, default: null},
  'vacancy_id' : { type: String, default: null},
  'guest_id': { type: String }
});


module.exports = mongoose.model('Candidate', Candidate);
