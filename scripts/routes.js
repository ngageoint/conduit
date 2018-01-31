angular.module('conduit').config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "../templates/conduit.html"
    })
    .when("/create-account", {
        templateUrl : "../templates/create-account.html"
    });
});