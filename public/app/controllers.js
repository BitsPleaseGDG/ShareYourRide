
function groupBy( array , f )
{
    var groups = {};
    array.forEach( function( o )
    {
        var group = JSON.stringify( f(o) );
        groups[group] = groups[group] || [];
        groups[group].push( o );
    });
    return Object.keys(groups).map( function( group )
    {
        return groups[group];
    })
}
var elementapp = angular.module('dashboardApp.controllers',["dashboardApp.services"]);
    elementapp.controller('indexController',["$scope","allServices",function($scope, allServices) {

        $scope.abc = "jell";
        allServices.getCurrentUser().then(function (data) {
        	$scope.user = data.data;
        });


    }]);
    elementapp.controller('createTravelController',["$scope","allServices","$location",function($scope, allServices, $location) {
        $scope.model={};

        allServices.getCurrentUser().then(function (data) {
            $scope.user = data.data;
        });
        $scope.submit = function() {
            allServices.createTravel($scope.model).then(function(data) {
                console.log(data);
                if(data.type==true) {
                    $location.path('/travels/'+data.insert_id);
                }
            });
        };






//        $scope.latitude = "";
//        $scope.longitude = "";
//        $scope.refresh = false;


    }]);
    elementapp.controller('showJourneys',["$scope","allServices","$location",function($scope, allServices, $location) {
        $scope.model={};

        allServices.getCurrentUser().then(function (data) {
            $scope.user = data.data;
        });
        allServices.getAllTravels().then(function(data) {
            for (var i = 0; i<data.travels.length; i++) {
                data.travels[i].start_datetime = convertTime(data.travels[i].start_datetime);
                data.travels[i].end_datetime = convertTime(data.travels[i].end_datetime);
            }
            $scope.data = data.travels;
        })



    }]);
    elementapp.controller('showJourney',["$scope","$routeParams","allServices","$location",function($scope, $routeParams,allServices, $location) {
        $scope.model={};

        allServices.getCurrentUser().then(function (data) {
            $scope.user = data.data;
        });
        allServices.getOverlappingTravels($routeParams.id).then(function(data) {
            console.log(data.groups);
            if(data.groups.length > 0) {
                $scope.from = data.groups[0].start_from;
                $scope.to = data.groups[0].upto;

            }
            for (var i = 0; i<data.groups.length; i++) {
                data.groups[i].start_datetime = convertTime(data.groups[i].start_datetime);
                data.groups[i].end_datetime = convertTime(data.groups[i].end_datetime);
                data.groups[i].spotsLeft = data.groups[i].capacity - data.groups.length;
                console.log(data.groups[i].capacity - data.groups.length);
            }
            for (var i = 0; i<data.travels.length; i++) {
                data.travels[i].start_datetime = convertTime(data.travels[i].start_datetime);
                data.travels[i].end_datetime = convertTime(data.travels[i].end_datetime);
            }
            var result = groupBy(data.groups, function(item)
            {
                return [item.group_id];
            });

            for (var i = 0; i<result.length; i++) {
                result[i][0].spotsLeft = result[i][0].capacity-result[i].length ;
            }
            $scope.groups = result;
            $scope.individuals = data.travels;
            if(data.travels.length > 0) {
                $scope.from = data.travels[0].start_from;
                $scope.to = data.travels[0].upto;

            }

//            console.log(data.travels);
            $scope.addgroup = function (a) {
                console.log(a);
                allServices.joinGroup(a,$routeParams.id).then(function(data) {
                    $location.path('/groups/'+a);
                });
            };
            $scope.createGroup = function (a) {
                allServices.makeGroup(a,$routeParams.id).then(function(data) {
                    if(data.type) {
                        $location.path('/groups/'+data.insertId);
                    }
                    console.log(data.type);

                });
            };
            console.log(result);
        });



    }]);

    elementapp.controller('group',["$scope","$routeParams","allServices",function($scope, $routeParams,allServices) {
        $scope.model={};

        allServices.getCurrentUser().then(function (data) {
            $scope.user = data.data;
        });
        allServices.getOverlappingTravels($routeParams.id).then(function(data) {
            $scope.data = data.groups;
        })



    }]);
    function convertTime(ms) {
        return new Date(ms).toString();
    }


