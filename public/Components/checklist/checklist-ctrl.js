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
        vm.image = null;

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
                  $state.go("checkin.image");
                }
              });
        };


        //data to be sent to ceo(notifying)
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
          $http({
            url:'/api/checklist/image/' + $stateParams.id,
            method: 'POST',
            data: { image: image, report: vm.data }
          })
            .then(function(response){
              ToastService.successToast(3000, "Данные отправлены");
              $state.go('checkin.success');
            }, function (error) {
              ToastService.errorToast(3000,"Ошибка при отправке данных");
            });
        };
      }])
  .controller('CheckoutCtrl', ['$state','$http','$stateParams', 'CheckoutService', 'WebcamService','data','ToastService',
    function($state, $http, $stateParams, CheckoutService, WebcamService, data, ToastService){
      var vm = this;
      vm.userData = data;
      vm.greeting = "Здравствуйте, сделайте Checkout!";
      vm.successGreating = "Надеемся день у Вас был плодотворным!";


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
              $state.go("checkout.image");
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
          console.log(vm.data);
          vm.image = image;
          console.log(image);
          $http({
            url:'/api/checklist/image/' + $stateParams.id,
            method: 'POST',
            data: { image: image, report: vm.data }
          })
            .then(function(response){
              console.log(response);
              ToastService.successToast(3000, "Данные отправлены");
              $state.go('checkout.success');
            }, function (error) {
              ToastService.errorToast(3000,"Ошибка при отправке данных");
              console.log(error);
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

    }]);