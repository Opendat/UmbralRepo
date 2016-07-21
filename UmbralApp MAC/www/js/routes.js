angular.module('app.routes', [])

.config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

        .state('misNotificaciones', {
        url: '/mis-notificaciones?idCuenta'
        , templateUrl: 'templates/misNotificaciones.html'
        , controller: 'misNotificacionesCtrl'
    })

    .state('conectarse', {
        url: '/conectarse'
        , templateUrl: 'templates/conectarse.html'
        , controller: 'conectarseCtrl'
    })

    .state('conectarse2', {
        url: '/iniciar-sesion/:idCuenta/:idPersona'
        , templateUrl: 'templates/conectarse2.html'
        , controller: 'conectarse2Ctrl'
    })

    .state('cambioDeClave', {
        url: '/cambiar-clave/:idCuenta/:mensaje'
        , templateUrl: 'templates/cambioDeClave.html'
        , controller: 'cambioDeClaveCtrl'
    })

    .state('appPlantilla', {
        url: '/app-plantilla/:idCuenta/:webService/:webMethod/:title'
        , templateUrl: 'templates/appPlantilla.html'
        , controller: 'appPlantillaCtrl'
    })

    .state('appFormulario', {
        url: '/app-formulario/:idCuenta/:webService/:webMethod/:title'
        , templateUrl: 'templates/appFormulario.html'
        , controller: 'appFormularioCtrl'
    })

    .state('appMantencion', {
        url: '/app-mantencion/:idCuenta/:title'
        , templateUrl: 'templates/appMantencion.html'
        , controller: 'appMantencionCtrl'
    })
    
    .state('appPanel', {
        url: '/app-panel/:idCuenta/:webService/:webMethod/:title'
        , templateUrl: 'templates/appPanel.html'
        , controller: 'appPanelCtrl'
    })
    
    .state('appMarcaAsistencia', {
        url: '/app-marca/:idCuenta/:webService/:webMethod/:title'
        , templateUrl: 'templates/appMarcaAsistencia.html'
        , controller: 'appMarcaAsistenciaCtrl'
    })


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/conectarse');

});