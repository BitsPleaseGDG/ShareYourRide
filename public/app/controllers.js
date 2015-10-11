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
        $scope.submit = function() {
            allServices.createTravel($scope.model).then(function(data) {
                console.log(data);
            });
        };






//        $scope.latitude = "";
//        $scope.longitude = "";
//        $scope.refresh = false;


    }]);
    elementapp.controller('showJourneys',["$scope","allServices",function($scope, allServices) {
        $scope.model={};

        allServices.getCurrentUser().then(function (data) {
            $scope.user = data.data;
        });
        allServices.getUserJourneys().then(function(data) {
            $scope.data = data.data;
        })



    }]);
    elementapp.controller('showJourney',["$scope","$routeParams","allServices",function($scope, $routeParams,allServices) {
        $scope.model={};

        allServices.getCurrentUser().then(function (data) {
            $scope.user = data.data;
        });
        allServices.getOverlappingTravels($routeParams.id).then(function(data) {
            $scope.data = data.data;
        })



    }]);

    elementapp.controller('group',["$scope","$routeParams","allServices",function($scope, $routeParams,allServices) {
        $scope.model={};

        allServices.getCurrentUser().then(function (data) {
            $scope.user = data.data;
        });
        allServices.getOverlappingTravels($routeParams.id).then(function(data) {
            $scope.data = data.data;
        })



    }]);
