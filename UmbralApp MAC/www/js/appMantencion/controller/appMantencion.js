'use strict';

angular.module('appMantencion.module').controller('appMantencionCtrl', function ($scope, $injector, $ionicLoading, $stateParams, $ionicHistory, $state, $ionicSideMenuDelegate, MenuOpcionesFunction, MenuDinamicoService, PushNotificationService, FuncionesGlobales) {


    // cargando
    $ionicLoading.show({
        template: 'Cargando...'
    });

    if ($stateParams.idCuenta) {
        $scope.idCuenta = $stateParams.idCuenta;
    }
    if ($stateParams.title) {
        $scope.title = $stateParams.title;
    }


    
    FuncionesGlobales.toogleRight($scope, $state, $ionicSideMenuDelegate, MenuDinamicoService, PushNotificationService, $scope.idCuenta, $ionicLoading, MenuOpcionesFunction);

    FuncionesGlobales.cerrarSesion($scope, $ionicLoading, $ionicHistory, $state);

    FuncionesGlobales.actualizarVista($scope, $state);

    FuncionesGlobales.goHome($scope, $state);

   

    $scope.title = $scope.title;
    $scope.content = "Aplicación en mantenimiento";

    $ionicLoading.hide();

})