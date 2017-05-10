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
    ['$state','$stateParams','$http','CheckinService','WebcamService','ToastService','data','$timeout',
      function($state,$stateParams, $http, CheckinService, WebcamService, ToastService, data, $timeout){

        var vm = this;
        vm.userData = data;
        console.log(data);
        vm.code = '';
        vm.image = null;
        vm.hdr = true;
        console.log($state.current.name);

        //if code sent then form hidden
        // and show the success
        vm.isCodeSent = false;

        //go parent state
        //used when the employee is not himself
        vm.goParent = function () {
          $state.go('main');
        };

        //show/hide HDR
        vm.showHdr = function () {
          vm.hdr = !vm.hdr;
        };

        //sending code and writing report checkin data
        vm.sendCode = function (code) {
          var codeS = CheckinService.sendCode();
            codeS
            .update({ id: $stateParams.employeeId, emplId: $stateParams.id, code: code , checked: true})
              .$promise
              .catch(function (err) {
                if(err){
                  // console.log(err);
                  ToastService.errorToast(3000, err.data.message)
                }
              })
              .then(function (resp) {
                if(resp){
                  // console.log(resp);
                  ToastService.successToast(3000, resp.message);
                  vm.isCodeSent = true;
                  $timeout(function () {
                    $state.go("checkin.image");
                  }, 1000);
                }
              });
        };

        //data to be sent to ceo(notifying);
        vm.data = {
          emplId: $stateParams.employeeId,
          name: data.firstname + " " + data.lastname,
          botId: data.botId,
          checked: !data.checked,
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
          vm.image = image;
          CheckinService.saveImage(image);
          $http({
            url:'/api/checklist/image/' + $stateParams.id,
            method: 'POST',
            data: { image: image, report: vm.data }
          })
            .then(function(response){
              ToastService.successToast(3000, "Данные отправлены");
              $state.go('checkin.success', {
                image: vm.image
              });
            }, function (error) {
              ToastService.errorToast(3000, "Ошибка при отправке данных");
            });
        };
        if($state.current.name === 'checkin.success'){
          vm.image = CheckinService.getImage();
          // console.log(vm.image);
        }

      }])
  .controller('CheckoutCtrl', ['$state','$http','$stateParams', 'CheckoutService', 'WebcamService','data','ToastService','$timeout',
    function($state, $http, $stateParams, CheckoutService, WebcamService, data, ToastService, $timeout){
      var vm = this;
      vm.userData = data;
      // console.log(data);

      //if code sent then form hidden
      // and show the success
      vm.isCodeSent = false;

      //go parent state
      //used when the employee is not himself
      vm.goParent = function () {
        $state.go('main');
      };

      vm.hdr = true;
      //show/hide HDR
      vm.showHdr = function () {
        vm.hdr = !vm.hdr;
      };

      //data to be sent to ceo(notifying)
      vm.data = {
        emplId: $stateParams.employeeId,
        name: data.firstname + " " + data.lastname,
        botId: data.botId,
        checked: !data.checked,
        id: $stateParams.id,
        report: null,
        insight: null,
        image: null
      };

      var image = null;
      vm.image = null;

      vm.sendCode = function (code) {
        var codeS = CheckoutService.sendCode();
        codeS
          .update({ id: $stateParams.employeeId, emplId: $stateParams.id, code: code , checked: false})
          .$promise
          .catch(function (err) {
            if(err){
              ToastService.errorToast(3000, err.data.message)
            }
          })
          .then(function (resp) {
            if(resp){
              // console.log(resp);
              ToastService.successToast(3000, resp.message);
              vm.isCodeSent = true;
              $timeout(function () {
                $state.go("checkout.image");
              }, 1000);
            }
          });
      };

            //set image
      vm.sendData = function (img) {
        if(img){
          CheckoutService.saveImage(img);
          $state.go('checkout.report');
        } else {

        }
      };

      vm.setReport = function () {
        if(vm.data.report){
          CheckoutService.saveReport(vm.data.report);
          $state.go('checkout.insight');
        } else {
          ToastService.errorToast(300, "Заполните поле");
        }
      };

      //sending captured image to the server/bot writing
      // image to file system
      // and data to CEO
      vm.sendReport = function(){

        getReports(function () {
          // console.log(vm.data);
          vm.image = image;
          // console.log(image);
          $http({
            url:'/api/checklist/image/' + $stateParams.id,
            method: 'POST',
            data: { image: image, report: vm.data }
          })
            .then(function(response){
              // console.log(response);
              ToastService.successToast(3000, "Данные отправлены");
              $state.go('checkout.success');
            }, function (error) {
              ToastService.errorToast(3000,"Ошибка при отправке данных");
              // console.log(error);
            });

        });
      };

      function getReports(callback) {
        if(vm.data.insight){
          CheckoutService.saveInsight(vm.data.insight);
          var reports = CheckoutService.getReportData();
          vm.data.insight = reports.insight;
          image = reports.image;
          vm.data.report = reports.report;
          callback();
        } else {
          ToastService.errorToast(3000, "Введите ссылку на инсайт");
        }
      };

      if($state.current === 'checkout.success'){
        vm.image = CheckoutService.getImage();
      }

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
      if($state.current.name === 'checkout.success'){
        vm.image = CheckoutService.getImage();
        // console.log(vm.image);
      }

    }]);