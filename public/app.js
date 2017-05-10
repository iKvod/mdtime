/**
 * Created by rafa on 01/05/2017.
 */
angular.module('checklist', [
  'ngMaterial',
  'ngAnimate',
  'ui.router',
  'ngResource',
  // 'ngFileUpload',
  'ngAria',
  'webcam'
])
  .config(['$stateProvider', '$urlRouterProvider','$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {

      $stateProvider
        .state('main', {
          url: '/',
          templateUrl: 'Components/main/main-tmpl.html',
          controller: 'MainCtrl',
          controllerAs: 'vm'/*,
           resolve: {
           user : function(ChecklistService){
           var userData = ChecklistService.query();
           return userData.$promise;
           }
           }*/
        })
        .state("checkin", { //state for creating new FAQﬁ
          url:'/checkin/code/:employeeId/:id',
          templateUrl:"Components/checkin/checkin-tmpl.html",
          controller:"CheckinCtrl",
          controllerAs:"vm"
          ,resolve: {
              data: function(CheckinService, $stateParams){
                return CheckinService.getUserData().get({ id: $stateParams.employeeId}).$promise
              }
          }
          ,params: {
            employee_id: null
          }
        })
        .state("checkin.image",{//state for uploadin image and description
          url:'/camera',
          templateUrl:"Components/webcam/webcam.html",
          controller:"CheckinCtrl",
          controllerAs:"vm",
        })
        .state('checkin.success', {
          url:'/success',
          templateUrl:'Components/successError/succes-tmpl.html',
          controller:"CheckinCtrl",
          controllerAs:'vm',
          params: {
            image: null
          }
        })
        .state("checkout", {
          url:'/checkout/code/:employeeId/:id',
          templateUrl:'Components/checkout/checkout-tmpl.html',
          controller:'CheckoutCtrl',
          controllerAs:'vm'
          ,resolve: {
            data: function(CheckinService, $stateParams){
              // return CheckinService.getUserData();
              return CheckinService.getUserData().get({ id: $stateParams.employeeId}).$promise
            }
          }
        })
        .state('checkout.image', {
          url:'/camera',
          templateUrl:'Components/webcam/webcam.html',
          controller:'CheckoutCtrl',
          controllerAs:'vm'
        })
        .state('checkout.report', {
          url:'/report',
          templateUrl:'Components/checkout/report-tmpl.html',
          controller:'CheckoutCtrl',
          controllerAs:'vm',
          params: {
            image: null
          }
        })
        .state('checkout.insight', {
          url:'/insight',
          templateUrl:'Components/checkout/insight-tmpl.html',
          controller:'CheckoutCtrl',
          controllerAs:'vm',
          params: {
            report: null
          }
        })
        .state('checkout.success', {
          url:'/success',
          templateUrl:'Components/successError/succes-tmpl.html',
          controller:"CheckoutCtrl",
          controllerAs:'vm',
          params: {
            image: null
          }
        });

      $urlRouterProvider.otherwise("/");
      $locationProvider.html5Mode(true);
    }])
  .run(function($state){
    $state.go('main');
  });
