var elementapp = angular.module('dashboardApp',['dashboardApp.controllers','ngRoute']).config(["$routeProvider","$locationProvider",function($routeProvider, $locationProvider){
        $routeProvider.when('/', {
            controller: 'indexController',
            templateUrl: baseUrl+'app/views/index.html'
        })
        .when('/create-travel', {
        	controller: 'createTravelController',
        	templateUrl: baseUrl+'app/views/createTravel.html'
        })
            .when('/travels', {
                controller: 'showJourneys',
                templateUrl: baseUrl+'app/views/showJourneys.html'
            })
            .when('/travels/:id', {
                controller: 'showJourney',
                templateUrl: baseUrl+'app/views/showJourney.html'
            })
            .when('/groups/:id', {
                controller: 'showJourney',
                templateUrl: baseUrl+'app/views/group.html'
            })
        .otherwise({redirectTo:'/'});
    }]);