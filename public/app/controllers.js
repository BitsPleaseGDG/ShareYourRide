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
            console.log('Submit Start');
            if(angular.isDefined($scope.model.startTime)) {
                console.log($scope.model.startTime);
            }
            if(angular.isDefined($scope.model.endTime)) {
                console.log($scope.model.endTime);

            }
            if(angular.isDefined($scope.model.startDate)) {
                console.log($scope.model.startDate);
            }
            if(angular.isDefined($scope.model.endDate)) {
                console.log($scope.model.endDate);

            }
            if(angular.isDefined($scope.model.from)) {
                console.log($scope.model.from);

            }
            if(angular.isDefined($scope.model.to)) {
                console.log($scope.model.to);

            }
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
