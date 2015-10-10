var elementapp = angular.module('dashboardApp',['dashboardApp.controllers','ngRoute']).config(["$routeProvider","$locationProvider",function($routeProvider, $locationProvider){
        $routeProvider.when('/', {
            controller: 'indexController',
            templateUrl: baseUrl+'app/views/index.html'
        })
        .when('/test', {
        	controller: 'testController',
        	templateUrl: baseUrl+'app/views/test.html'
        })
        .otherwise({redirectTo:'/'});
    }]);