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
        // .state('checklist', {
        //   url: '/checklist',
        //   templateUrl: 'Components/checklist/checklist-tmpl.html',
        //   controller: 'ChecklistCtrl',
        //   controllerAs: 'vm'/*,
        //    resolve: {
        //    user : function(ChecklistService){
        //    var userData = ChecklistService.query();
        //    return userData.$promise;
        //    }
        //    }*/
        // })
        .state("checkin", { //state for creating new FAQﬁ
          url:'/checkin/code/:employeeId/:id',
          templateUrl:"Components/checkin/checkin-tmpl.html",
          controller:"CheckinCtrl",
          controllerAs:"vm"
          ,resolve: {
              data: function(CheckinService, $stateParams){
                  // return CheckinService.getUserData();
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
          controller:"WebcamController",
          controllerAs:"vm",
        })
        .state('checkin.success', {
          url:'/success',
          templateUrl:'components/checklist/success_checkin_page.html',
          controller:"CheckinCtrl",
          controllerAs:'vm'
        })
        .state("checkout", {
          url:'/checkout/code/:employeeId/:id',
          templateUrl:'components/checklist/checkout_code_form.html',
          controller:'CheckoutCtrl',
          controllerAs:'vm'
        })
        .state('checkout.image',{
          url:'/camera',
          templateUrl:'components/checklist/checkout_image_form.html',
          controller:'CheckoutCtrl',
          controllerAs:'vm'
        })
        .state('checkout.success', {
          url:'/success',
          templateUrl:'components/checklist/success_checkin_page.html',
          controller:"CheckoutCtrl",
          controllerAs:'vm'
        })
        // .state('error',{
        //   url:'/error',
        //   template:"<h1>Upps, Error</h1>>",
        //   controller:"",
        //   controllerAs:''
        // })
        // .state('success', {
        //   url:'/success',
        //   templateUrl:'components/checklist/success_checkin_page.html',
        //   controller:"",
        //   controllerAs:''
        // })
        // .state('admin',{
        //   url:'/admin',
        //   templateUrl:'components/admin_panel/admin.main/admin_panel.html',
        //   controller:'AdminCtrl',
        //   controllerAs:'vm'
        // })
        // .state('admin.reports', {
        //   url: '/reports',
        //   templateUrl: 'components/admin_panel/salaryReport/salary-report.html',
        //   controller: 'SalaryCtrl',
        //   controllerAs: 'vm',
        //   resolve: {
        //     report: function (SalaryService) {
        //       return SalaryService.getSalaryReports().getAll().$promise;
        //     }
        //   }
        //   // params: {
        //   //   month: null
        //   // }
        // })
        // .state('admin.employees', {
        //   url:'/employees',
        //   templateUrl:'components/admin_panel/employees/employees.html',
        //   controller: 'EmployeesCtrl',
        //   controllerAs: 'vm',
        //   resolve: {
        //     users: function (EmployeesService) {
        //       return EmployeesService.query().$promise;
        //     }
        //   }
        // })
        // .state('admin.employees.archived', {
        //   url:'/archived',
        //   templateUrl:'components/admin_panel/employees/employees.archived.html',
        //   controller: 'EmployeeArchCtrl',
        //   controllerAs: 'vm',
        //   resolve: {
        //     archivedUsers: function (EmpArchiveService) {
        //       return EmpArchiveService.query().$promise;
        //     }
        //   }
        // })
        // .state('admin.settings', {
        //   url: '/settings',
        //   templateUrl: 'components/settings/settings.html',
        //   controller: 'SettingsCtrl',
        //   controllerAs: 'vm',
        //   resolve: {
        //     dpts: function (DepartmentsService) {
        //       return DepartmentsService.getAll().$promise;
        //     },
        //     positions: function (PositionsService) {
        //       return PositionsService.getAll().$promise;
        //     }
        //   }
        // })
        // .state('departmentadd', {
        //   url:'/settings/department',
        //   templateUrl:'',
        //   controller: 'DepartmentsCtrl',
        //   conrollerAs: 'vm'
        //
        //
        // })
        // .state('fun', {
        //   url:'/fun',
        //   templateUrl: 'components/fun/fun.html',
        //   controller: 'FunCtrl',
        //   controllerAs: 'vm'
        // });

      $urlRouterProvider.otherwise("/");
      $locationProvider.html5Mode(true);
    }])
  .run(function($state){
    $state.go('main');
  });
