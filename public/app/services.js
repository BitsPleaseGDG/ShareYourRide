var dashboardAppServices = angular.module("dashboardApp.services", []);

    dashboardAppServices.factory('home', ["$location", "$http", "$log", "$q", function ($location, $http, $log, $q) {
        return {
            getTakeMeAnywhereUrl: function () {
                var deferred = $q.defer();
                var urlToUse = baseUrl + '/api/v1/getTakeMeAnywhereUrl';
                console.log(urlToUse);

                $http.get(urlToUse).success(function (data) {
                    deferred.resolve(data);
                }).error(function (data) {
                        deferred.reject();
                    });
                return deferred.promise;
            },
            getTopPlaces: function(data) {
                var deferred = $q.defer();
                var urlToUse = baseUrl + '/api/v1/getTopPlaces?count='+data;
                console.log(urlToUse);

                $http.get(urlToUse).success(function (data) {
                    deferred.resolve(data);
                }).error(function (data) {
                        deferred.reject();
                    });
                return deferred.promise;

            }
        }

    }]);