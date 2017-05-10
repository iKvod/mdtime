/**
 * Created by rafa on 02/05/2017.
 */
(function (){
  'use Strict'
  angular
    .module('checklist')
    //.constant("baseURL", "https:checklist.automato.me")
    .constant("baseURL", "") // testing
    .factory('CheckinService', CheckinService)
    .factory('CheckoutService', CheckoutService)


  CheckinService.$inject = ['$resource', 'baseURL'];
  CheckoutService.$inject = ['$resource', 'baseURL'];


  function CheckinService($resource, baseURL){
    var checklist = {};


    checklist.checkId = function (employeeId) {
      return $resource(baseURL + '/api/checklist/check/' + employeeId);
    };

    checklist.getCode = function () {
      return $resource(baseURL + '/api/checklist/check/:id', {id: "@id"});
    };

    checklist.getUserData = function () {
      return $resource(baseURL + '/api/checklist/:id', {id: "@id"});
    };
    
    checklist.sendCode = function () {
      return $resource('/api/checklist/code/:id', { id: "@id" },
        { update: {
            method: 'PUT',
            params: { "id":"@id" },
            isArray: false,
            cache: false
        }
      });
    };

    checklist.saveImage = function (img) {
      image = img;

    };
    checklist.getImage = function () {
      return image;
    };
    
    
    // return $resource(baseURL + '/api/checklist/checkin/:id', { id: "@id" }, {
    //   query: {
    //     method: 'POST',
    //     params: { "id": "@id" },
    //     isArray: false,
    //     cache: false
    //   }
    // });

    return checklist;
  }
  function CheckoutService($resource, baseURL){
    var checklist = {};


    checklist.checkId = function (employeeId) {
      return $resource(baseURL + '/api/checklist/check/' + employeeId);
    };

    checklist.getCode = function () {
      return $resource(baseURL + '/api/checklist/check/:id', {id: "@id"});
    };

    checklist.getUserData = function () {
      return $resource(baseURL + '/api/checklist/:id', {id: "@id"});
    };

    checklist.sendCode = function () {
      return $resource('/api/checklist/code/:id', { id: "@id" },
        { update: {
          method: 'PUT',
          params: { "id":"@id" },
          isArray: false,
          cache: false
        }
        });
    };

    var image = null;
    var report = null;
    var insight = null;

    checklist.saveImage = function (img) {
      image = img;

    };
    checklist.getImage = function () {
      return image;
    };

    checklist.saveReport = function (data) {
      report = data;

    };
    checklist.getReport = function () {
      return report;
    };

    checklist.saveInsight = function (data) {
      insight = data;

    };
    checklist.getInsight = function () {
      return insight;
    };

    checklist.getReportData = function () {
      return {
        image: checklist.getImage(),
        report: checklist.getReport(),
        insight: checklist.getInsight()
      }
    };

    checklist.cleanService = function () {
      image = null;
      report = null;
      insight = null;
    };

    // return $resource(baseURL + '/api/checklist/checkin/:id', { id: "@id" }, {
    //   query: {
    //     method: 'POST',
    //     params: { "id": "@id" },
    //     isArray: false,
    //     cache: false
    //   }
    // });

    return checklist;
  }


})();

// factory.("Post", function($recorse){
//     return $resource(url, {}, {
//         query: {
//             method: "GET",
//             params: {},
//             isArray: true,
//             cache: true,
//             //transformRequest,
//             //interceptor
//         },
//         get: {
//             method: "GET",
//             //params: {"id": @id},
//             isArray: true,
//             cache: true,
//         }
//     })
// })


// Post.query();
// Post.get();

