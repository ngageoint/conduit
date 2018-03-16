angular.module('conduit').config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "../templates/conduit.html"
    }).when("/home", {
        templateUrl : "../templates/conduit.html"
    })
    .when("/create-account", {
        templateUrl : "../templates/create-account.html"
    });

    $locationProvider.html5Mode(true);
});