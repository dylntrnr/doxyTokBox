'use strict';

var myApp = angular.module('content', [])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/home', {templateUrl: '/partials/home', controller: HomeCtrl});
    $routeProvider.when('/schedule', {templateUrl: 'partials/schedule', controller: RoomCtrl});
    $routeProvider.when('/confirmed', {templateUrl: 'partials/confirmed', controller: ConfCtrl});
    $routeProvider.when('/about', {templateUrl: 'partials/about'});
    $routeProvider.otherwise({redirectTo: '/home'});
  }]);

myApp.factory('Data', function () {
  return {date: null, time: null, ampm: null};
});