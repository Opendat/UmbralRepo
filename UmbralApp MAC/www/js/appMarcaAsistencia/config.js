'use strict';

angular
    .module('appMarcaAsistencia.module')
    .config(function config($stateProvider) {
        $stateProvider
            .state('appMarcaAsistencia', {
                url: '/appMarcaAsistencia/:idCuenta/:webService/:webMethod/:title'
                , templateUrl: 'templates/appMarcaAsistencia.html'
                , controller: 'appMarcaAsistenciaCtrl'

            })
    });