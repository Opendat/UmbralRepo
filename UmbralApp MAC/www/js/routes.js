angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
      
    .state('misNotificaciones', {
      url: '/mis-notificaciones?idCuenta',
      templateUrl: 'templates/misNotificaciones.html',
      controller: 'misNotificacionesCtrl'
    })
        
    .state('conectarse', {
      url: '/conectarse',
      templateUrl: 'templates/conectarse.html',
      controller: 'conectarseCtrl'
    })
         
    .state('conectarse2', {
      url: '/iniciar-sesion/:idCuenta/:idPersona',
      templateUrl: 'templates/conectarse2.html',
      controller: 'conectarse2Ctrl'
    })
         
    .state('cambioDeClave', {
      url: '/cambiar-clave/:idCuenta/:mensaje',
      templateUrl: 'templates/cambioDeClave.html',
      controller: 'cambioDeClaveCtrl'
    })
        
    .state('miOpcion', {
      url: '/mi-opcion/:idCuenta/:webService/:webMethod',
      templateUrl: 'templates/miOpcion.html',
      controller: 'miOpcionCtrl'
    })
  
  

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/conectarse');

});