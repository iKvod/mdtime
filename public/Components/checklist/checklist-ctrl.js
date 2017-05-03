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
    ['$state','$stateParams','$http', '$rootScope','CheckinService','WebcamService','ToastService','data',
      function($state,$stateParams, $http, $rootScope, CheckinService, WebcamService, ToastService, data){

        var vm = this;
        vm.userData = data;
        vm.code = '';

        vm.sendCode = function (code) {
          var codeS = CheckinService.sendCode();
            codeS
            .update({ id: $stateParams.employeeId, emplId: $stateParams.id, code: code })
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


        //old checklist
        vm.greeting = "Добро пожаловать! Отметтесь пожалуйста";
        vm.successGreating = "Вы отметились в системе!";
        vm.data = {
          message: "Пришел(пришла) на работу",
          id: $stateParams.employee_id,
          name: $rootScope.name,
          botId: $rootScope.botId
        };

        //WEBCAM snacpshot taking
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

        //sending captured image to the server/bot
        vm.sendData = function(image){
          $http({
            url:'/api/bot/image',
            method: 'POST',
            data: {image:image, report: vm.data}
          })
            .then(function(response){
              $state.go('checkin.success');
              console.log(response);
            }, function (error) {
              console.log(error);
            });
        };

        // reports checkin in db
        vm.checkIn = function(code){
          // console.log(code);
          var id = $stateParams.employee_id;
          // console.log(id);
          var checkin = CheckinService.query({id:id});

          checkin.$promise
            .then(
              function(data){
                // console.log("Checkin");
                // console.log(data);
                $state.go('checkin.image', {employee_id: data._id});


              },  function(err){
                // console.log(err);
              });
        };

      }])
  .controller('CheckoutCtrl', ['$state', '$rootScope','$http','$stateParams', 'CheckoutService', 'WebcamService',
    function($state, $rootScope, $http, $stateParams, CheckoutService, WebcamService){
      var vm = this;
      vm.greeting = "Здравствуйте, сделайте Checkout!";
      vm.successGreating = "Надеемся день у Вас был плодотворным!";
      vm.data = {
        message: "Уходит с работы!",
        id: $stateParams.employee_id,
        report:'',
        bookreport:'',
        name: $rootScope.name,
        botId: $rootScope.botId
      };
      vm.report = '';


      //WEB CAM
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

      //sending checkout report to the server
      vm.checkOut = function(code){
        //console.log("Checkout code: " + code);
        var id = $stateParams.employee_id;

        var checkOut = CheckoutService.query({id:id});

        checkOut.$promise
          .then(function(data){
            // console.log($stateParams.employee_id);
            $state.go('checkout.image', {reload:true});
          }, function(err){
            console.log(err);
          });
      };

      //sending report to the server and notification to CEO and Pr. Manager
      vm.sendReport  = function (report){
        var id = $stateParams.employee_id;
        vm.report = report;
        var obj = {};
        obj.report = vm.report;
        var reporting = new CheckoutService(obj);
        reporting.$update({id:id})

      };

      //sending checkout report to bot
      vm.sendData = function(image, report, reportBook){
        vm.data.report = report;
        vm.data.bookreport = reportBook;
        $http({
          url:'/api/bot/image',
          method: 'POST',
          data: {image: image, report: vm.data}
        })
          .then(function(response){
            $state.go('checkout.success');
            //console.log(response);
          }, function (error) {
            console.log(error);
          });
      }

    }]);