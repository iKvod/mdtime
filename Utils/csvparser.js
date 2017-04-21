/**
 * Created by rafa on 10/04/2017.
 */
'use strict';

var parser = require('csv-parser');
var fs = require('fs');


var obj = {};

var parseCsvToJson = function (csvDir, callback) {
  var parsedData = [];

  fs.createReadStream(csvDir)
    .pipe(parser())
    .on('data', function (data) {
      obj = {
       "id":data.id,
       "today_date":data.today_date,
       "vacancy_id": data.vacancy_id,
       "general_name": data.general_name,
       "general_middle_name": data.general_middle_name,
       "general_surname": data.general_surname,
       "general_sex": data.general_sex,
       "general_birthday": data.general_birthday,
       "general_birth_place": data.general_birth_place,
       "general_nationality": data.general_nationality,
       "personal_work_conditions": data.personal_work_conditions,
       "personal_experience": data.personal_experience,
       "personal_house_phone": data.personal_house_phone,
       "personal_phone": data.personal_phone,
       "personal_email": data.personal_email,
       "personal_education_level": data.personal_education_level,
       "personal_life_place": data.personal_life_place,
       "personal_can_move": data.personal_can_move,
       "personal_photo": data.personal_photo,
       "personal_cv": data.personal_cv,
       "personal_can_trips": data.personal_can_trips,
       "education_name": data.education_name,
       "education_faculty": data.education_faculty,
       "education_specialty": data.education_specialty,
       "education_ball": data.education_ball,
       "education_start": data.education_start,
       "education_end": data.education_end,
       "education_form": data.education_form,
       "education_kazakh": data.education_kazakh,
       "education_russian": data.education_russian,
       "education_english": data.education_english,
       "education_other": data.education_other,
       "summery_desired_salary": data.summery_desired_salary,
       "summery_where_find_us": data.summery_where_find_us,
       "summery_when_can_start_work": data.summery_when_can_start_work,
       "summery_fb": data.summery_fb,
       "summery_insta": data.summery_insta,
       "summery_vk": data.summery_vk,
       "summery_interview_type": data.summery_interview_type,
       "summery_take_important": data.summery_take_important,
       "summery_family": data.summery_family,
       "summery_car": data.summery_car,
       "summery_question": data.summery_question,
       "summery_additional": data.summery_additional,
       "summery_certificates": data.summery_certificates,
       "interview_day": data.interview_day,
       "interview_time": data.interview_time
       };
       parsedData.push(obj);
      // console.log('Name: %s Age: %s', data.general_name, data.general_surname);
    })
    .on('end', function () {
      callback(parsedData);
      obj = {};
    });
};


var parseToJsonApplied = function (csvDir, callback) {
  var parsedData = [];
  var object = {};

  fs.createReadStream(csvDir)
   .pipe(parser())
    .on('data', function (data) {
      object.email  = data['Эл.почта'];
      object.guest_id = data['ID Номер'];

      parsedData.push(object);
      object = {};
    })
    .on('end', function () {
      callback(parsedData);
    });
};


var parseArchiveEmployees = function(dir, callback){
  var parsedData = [];
  var object = {};

  fs.createReadStream(dir)
    .pipe(parser())
    .on('data', function (data) {
      object = {
        employee_id: data['ID Сотрудника'],
        botId: data['tel ID'],
        username: data['username'],
        firstname: data['Имя'],
        lastname: data['Фамилия'],
        email: data['Почта'],
        fired: false,
        firedDate: null,
        phonenumber: data['Личный номер'],
        department: 1,
        position: data['Директор'],
        salary_fixed: 0,
        bonus: 0,
        worker_type: null,
        work_time: null
      };

      parsedData.push(object);
    })
    .on('end', function () {
      callback(parsedData);
    });
};


module.exports = {
  parseCsvToJson: parseCsvToJson,
  parseToJsonApplied:parseToJsonApplied,
  parseArchiveEmployees:parseArchiveEmployees
};





