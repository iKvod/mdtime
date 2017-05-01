/**
 * Created by rafa on 01/05/2017.
 */
'use strict';


(function (){

  'use Strict'
  angular
    .module('checklist')
    //.constant("baseURL", "https:checklist.automato.me")
    .constant("baseURL", "") ;// testing

  ChecklistService.$inject = ['$resource', 'baseURL'];


  function ChecklistService($resource, baseURL){
    //return $resource("/api/checklist/:id", { id: "@id" });
    return $resource(baseURL + '/api/checklist/:id', { id: '@id'}, {
      query: {
        method: "GET",
        params: {},
        isArray: false,
        cache: false
        //transformRequest,
        //interceptor
      },
      get: {
        method: "GET",
        params: {"id": "@id"},
        isArray: false,
        cache: false
      }
    })
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

