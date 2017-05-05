/**
 * Created by rafa on 01/05/2017.
 */
angular.module('checklist')
  .controller('MainCtrl',
    ['$state', '$stateParams', 'CheckinService','ToastService',
      function ($state, $stateParams, CheckinService, ToastService) {
        var vm = this;
        vm.id = '';

        vm.sendId = function (emplId) {
          var id = emplId.toUpperCase();
          if(id) {
            var User = CheckinService.getCode();

              User.get({id: id})
              .$promise
              .then(function (data){
                if(data){
                  ToastService.successToast(6000, data.message);
                  if(data.data.checked){
                    $state.go('checkout', {
                      employeeId: data.data.employee_id,
                      id: data.data._id
                    })
                  } else {
                    $state.go('checkin', {
                      employeeId: data.data.employee_id,
                      id: data.data._id
                    })
                  }
                }
              }, function (err) {
                ToastService.errorToast(3009, err.data.message);
              })
          }
        };

      }]);