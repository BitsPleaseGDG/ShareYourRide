    var elementapp = angular.module('dashboardApp.controllers',["dashboardApp.services"]);
    elementapp.controller('indexController',["$scope",function($scope) {

        $scope.abc = "jell";


    }]);
    elementapp.controller('testController',["$scope",function($scope) {

        $scope.latitude = "";
        $scope.longitude = "";
        $scope.refresh = false;


    }]);
