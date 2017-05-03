/**
 * Created by rafa on 01/05/2017.
 */
angular.module('checklist')
  .controller('ChecklistCtrl',
    ['$state', '$stateParams', 'ChecklistService',
    function ($state, $stateParams, ChecklistService) {
      var vm = this;
      console.log('Here');

      vm.id = '';


      vm.sendId = function (id) {

        $state.go('');

        console.log(id)

      };

      vm.send = function () {

        console.log(vm.id);

      };



    }])
  .controller('CheckinCtrl',
    ['$state','$stateParams','$http','CheckinService','WebcamService','ToastService','data',
      function($state,$stateParams, $http, CheckinService, WebcamService, ToastService, data){

        var vm = this;
        vm.userData = data;
        // console.log(data);
        vm.code = '';

        //sending code and writing report checkin data
        vm.sendCode = function (code) {
          var codeS = CheckinService.sendCode();
            codeS
            .update({ id: $stateParams.employeeId, emplId: $stateParams.id, code: code , checked: true})
              .$promise
              .catch(function (err) {
                if(err){
                  console.log(err);
                  ToastService.errorToast(3000, err.data.message)
                }
              })
              .then(function (resp) {
                if(resp){
                  console.log(resp);
                  ToastService.successToast(3000, resp.message);
                  $state.go("checkin.image");
                }
              });
        };


        //data to be sent to ceo(notifying)
        vm.data = {
          emplId: $stateParams.employeeId,
          name: data.firstname + " " + data.lastname,
          botId: data.botId,
          checked: data.checked,
          id: $stateParams.id
        };
        // console.log(vm.data);

        //Webcam taking photo
        vm.showweb = true;
        vm.webcam = WebcamService.webcam;
        //override function for be call when capture is finalized
        vm.webcam.success = function(image, type) {
          vm.photo = image;
          vm.fotoContentType = type;
          vm.showweb = false;
        };

        function turnOffWebCam() {
          if(vm.webcam && vm.webcam.isTurnOn===true)
            vm.webcam.turnOff();
        }

        //sending captured image to the server/bot writing
        // image to file system
        // and data to CEO
        vm.sendData = function(image){
          // console.log(image);
          $http({
            url:'/api/checklist/image/' + $stateParams.id,
            method: 'POST',
            data: { image: image, report: vm.data }
          })
            .then(function(response){
              ToastService.successToast(3000, "Данные отправлены");
              // $state.go('checkin.success');
              console.log(response);
            }, function (error) {
              ToastService.errorToast(3000,"Ошибка при отправке данных");
              console.log(error);
            });
        };
      }])
  .controller('CheckoutCtrl', ['$state','$http','$stateParams', 'CheckoutService', 'WebcamService','data','ToastService',
    function($state, $http, $stateParams, CheckoutService, WebcamService, data, ToastService){
      var vm = this;
      vm.userData = data;
      console.log(data);
      vm.greeting = "Здравствуйте, сделайте Checkout!";
      vm.successGreating = "Надеемся день у Вас был плодотворным!";
      // vm.data = {
      //   id: $stateParams.employeeId,
      //   report:'',
      //   bookreport:'',
      //   name: $rootScope.name,
      //   botId: $rootScope.botId
      // };

      //data to be sent to ceo(notifying)
      vm.data = {
        emplId: $stateParams.employeeId,
        name: data.firstname + " " + data.lastname,
        botId: data.botId,
        checked: data.checked,
        id: $stateParams.id,
        report:'',
        vkreport:''
      };


      vm.report = '';

      vm.sendCode = function (code) {
        var codeS = CheckoutService.sendCode();
        codeS
          .update({ id: $stateParams.employeeId, emplId: $stateParams.id, code: code , checked: false})
          .$promise
          .catch(function (err) {
            if(err){
              console.log(err);
              ToastService.errorToast(3000, err.data.message)
            }
          })
          .then(function (resp) {
            if(resp){
              console.log(resp);
              ToastService.successToast(3000, resp.message);
              $state.go("checkout.image");
            }
          });
      };

      //WEB CAM
      //Webcam taking photo
      vm.showweb = true;
      vm.webcam = WebcamService.webcam;
      //override function for be call when capture is finalized
      vm.webcam.success = function(image, type) {
        vm.photo = image;
        vm.fotoContentType = type;
        vm.showweb = false;
      };

      function turnOffWebCam() {
        if(vm.webcam && vm.webcam.isTurnOn===true)
          vm.webcam.turnOff();
      }

      //sending captured image to the server/bot writing
      // image to file system
      // and data to CEO
      vm.sendData = function(image){
        // console.log(image);
        $http({
          url:'/api/checklist/image/' + $stateParams.id,
          method: 'POST',
          data: { image: image, report: vm.data }
        })
          .then(function(response){
            ToastService.successToast(3000, "Данные отправлены");
            // $state.go('checkin.success');
            console.log(response);
          }, function (error) {
            ToastService.errorToast(3000,"Ошибка при отправке данных");
            console.log(error);
          });
      };

      //sending checkout report to the server
      // vm.checkOut = function(code){
      //   //console.log("Checkout code: " + code);
      //   var id = $stateParams.employee_id;
      //   var checkOut = CheckoutService.query({id:id});
      //
      //   checkOut.$promise
      //     .then(function(data){
      //       // console.log($stateParams.employee_id);
      //       $state.go('checkout.image', {reload:true});
      //     }, function(err){
      //       console.log(err);
      //     });
      // };

      //sending report to the server and notification to CEO and Pr. Manager
      vm.sendReport  = function (report){
        var id = $stateParams.employee_id;
        vm.report = report;
        var obj = {};
        obj.report = vm.report;
        var reporting = new CheckoutService(obj);
        reporting.$update({id:id})
      };

      // //sending checkout report to bot
      // vm.sendData = function(image, report, reportBook){
      //   vm.data.report = report;
      //   vm.data.bookreport = reportBook;
      //   $http({
      //     url:'/api/bot/image',
      //     method: 'POST',
      //     data: {image: image, report: vm.data}
      //   })
      //     .then(function(response){
      //       $state.go('checkout.success');
      //       //console.log(response);
      //     }, function (error) {
      //       console.log(error);
      //     });
      // }

    }]);