var dashboardAppServices = angular.module("dashboardApp.services", []);

    dashboardAppServices.factory('allServices', ["$location", "$http", "$log", "$q", function ($location, $http, $log, $q) {
        return {
            getCurrentUser: function () {
                var deferred = $q.defer();
                var urlToUse = baseUrl + 'api/v1/getCurrentUser';
                // console.log(urlToUse);

                $http.get(urlToUse).success(function (data) {
                    deferred.resolve(data);
                }).error(function (data) {
                        deferred.reject();
                    });
                return deferred.promise;
            },
            getUserJourneys: function() {
                var deferred = $q.defer();
                var urlToUse = baseUrl + '/api/v1/';
                console.log(urlToUse);

                $http.get(urlToUse).success(function (data) {
                    deferred.resolve(data);
                }).error(function (data) {
                        deferred.reject();
                    });
                return deferred.promise;

            },
            getOverlappingTravels: function(id) {
                var deferred = $q.defer();
                var urlToUse = baseUrl + '/api/v1/'+'?id='+id;
                console.log(urlToUse);

                $http.get(urlToUse).success(function (data) {
                    deferred.resolve(data);
                }).error(function (data) {
                        deferred.reject();
                    });
                return deferred.promise;

            },
            createTravel : function(model) {
                var deferred = $q.defer();
                var start = model.startTime.getTime() + model.startDate.getTime();
                var end = model.endTime.getTime() + model.endDate.getTime();
                var urlToUse = baseUrl + 'api/v1/add'+'?from='+model.from+'&to='+model.to+'&start='+start+'&end='+end;
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