'use strict';

var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'controllers', 'services']);

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
        .when('/home', {
            templateUrl: 'partials/home.html'
        })
        .when('/connect', {
            templateUrl: 'partials/login.html', controller: 'ConnectionCtrl as connectionCtrl'
        })
        .when('/disconnect', {
            templateUrl: 'partials/home.html', controller: 'MainCtrl as mainCtrl'
        })
        .otherwise({
            redirectTo: 'partials/home.html'
        });
}]);