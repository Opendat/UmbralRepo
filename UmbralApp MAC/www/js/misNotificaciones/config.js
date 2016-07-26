'use strict';

angular
    .module('misNotificaciones.module')
    .config(function config($stateProvider) {
        $stateProvider
            .state('misNotificaciones', {
                url: '/misNotificaciones?idCuenta'
                , templateUrl: 'templates/misNotificaciones.html'
                , controller: 'misNotificacionesCtrl'

            })
    });