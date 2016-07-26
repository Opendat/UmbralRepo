'use strict';

angular
    .module('appMantencion.module')
    .config(function config($stateProvider) {
        $stateProvider
            .state('appMantencion', {
                url: '/appMantencion/:idCuenta/:title',
                templateUrl: 'templates/appMantencion.html'
                , controller: 'appMantencionCtrl'

            })
    });