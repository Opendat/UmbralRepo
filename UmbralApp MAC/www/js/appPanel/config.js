'use strict';

angular
    .module('appPanel.module')
    .config(function config($stateProvider) {
        $stateProvider
            .state('appPanel', {
                url: '/appPanel/:idCuenta/:webService/:webMethod/:title'
                , templateUrl: 'templates/appPanel.html'
                , controller: 'appPanelCtrl'

            })
    });