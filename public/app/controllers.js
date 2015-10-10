    var elementapp = angular.module('dashboardApp.controllers',["dashboardApp.services"]);
    elementapp.controller('indexController',["$scope","allServices",function($scope, allServices) {

        $scope.abc = "jell";
        allServices.getCurrentUser().then(function (data) {
        	$scope.user = data.data;
        });


    }]);
    elementapp.controller('createTravelController',["$scope","allServices",function($scope, allServices) {
        $scope.model={};

        allServices.getCurrentUser().then(function (data) {
            $scope.user = data.data;
        });



        $scope.latitude = "";
        $scope.longitude = "";
        $scope.refresh = false;


    }]);
