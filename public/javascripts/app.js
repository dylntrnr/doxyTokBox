'use strict';

angular.module('content', [])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/home', {templateUrl: '/partials/home', controller: HomeCtrl});
    $routeProvider.when('/schedule', {templateUrl: 'partials/schedule', controller: RoomCtrl});
    $routeProvider.when('/confirmed', {templateUrl: 'partials/confirmed', controller: ConfCtrl});
    $routeProvider.when('/about', {templateUrl: 'partials/about'});
    $routeProvider.otherwise({redirectTo: '/home'});
  }]);