var elementapp = angular.module('dashboardApp',['dashboardApp.controllers','ngRoute']).config(["$routeProvider","$locationProvider",function($routeProvider, $locationProvider){
        $routeProvider.when('/', {
            controller: 'indexController',
            templateUrl: baseUrl+'app/views/index.html'
        })
        .when('/create-travel', {
        	controller: 'createTravelController',
        	templateUrl: baseUrl+'app/views/createTravel.html'
        })
        .otherwise({redirectTo:'/'});
    }]);