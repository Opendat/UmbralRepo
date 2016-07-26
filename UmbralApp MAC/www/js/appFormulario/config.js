'use strict';

angular
    .module('appFormulario.module')
    .config(function config($stateProvider) {
        $stateProvider
            .state('appFormulario', {
                url: '/appFormulario/:idCuenta/:webService/:webMethod/:title'
                , templateUrl: 'templates/appFormulario.html'
                , controller: 'appFormularioCtrl'

            })
    });