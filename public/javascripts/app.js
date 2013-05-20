'use strict';

angular.module('content', [])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/home', {templateUrl: '/partials/home', controller: HomeCtrl});
    $routeProvider.when('/schedule', {templateUrl: 'partials/schedule', controller: RoomCtrl});
    $routeProvider.when('/about', {templateUrl: 'partials/about'});
    $routeProvider.otherwise({redirectTo: '/home'});
  }]);