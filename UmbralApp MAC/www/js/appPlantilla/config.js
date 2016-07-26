'use strict';

angular
    .module('appPlantilla.module')
    .config(function config($stateProvider) {
        $stateProvider
            .state('appPlantilla', {
                url: '/appPlantilla/:idCuenta/:webService/:webMethod/:title'
                , templateUrl: 'templates/appPlantilla.html'
                , controller: 'appPlantillaCtrl'

            })
    });