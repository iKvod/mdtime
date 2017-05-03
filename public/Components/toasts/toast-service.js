/**
 * Created by rafa on 02/05/2017.
 */
(function (){
  'use Strict'
  angular
    .module('checklist')
    .factory('ToastService', ToastService);

  ToastService.$inject = ['$mdToast'];



  function ToastService($mdToast){
    var toast = {};

    toast.errorToast = function (time, message) {
      $mdToast.show({
        hideDelay   : time,
        position    : 'top right',
        controller  : 'ToastCtrl',
        templateUrl : '/Components/toasts/error-toast-tmpl.html',
        locals: { message: message }
      });
    };

    toast.successToast  = function (time , message) {
      $mdToast.show({
        hideDelay   : time,
        position    : 'top right',
        controller  : 'ToastCtrl',
        templateUrl : '/Components/toasts/success-toast-tmpl.html',
        locals: { message: message }
      });
    };

    return toast;
  }


})();