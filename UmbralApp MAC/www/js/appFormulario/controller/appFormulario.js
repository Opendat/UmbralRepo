'use strict';

angular.module('appFormulario.module').controller('appFormularioCtrl', function ($scope, $injector, $ionicLoading, $stateParams, $ionicHistory, $state, $ionicSideMenuDelegate, MenuOpcionesFunction, MenuDinamicoService, PushNotificationService, FuncionesGlobales) {

    if ($stateParams.idCuenta) {
        $scope.idCuenta = $stateParams.idCuenta;
    }
    if ($stateParams.webService) {
        $scope.webService = $stateParams.webService;
    }
    if ($stateParams.webMethod) {
        $scope.webMethod = $stateParams.webMethod;
    }
    if ($stateParams.title) {
        $scope.title = $stateParams.title;
    }

    

    FuncionesGlobales.toogleRight($scope, $state, $ionicSideMenuDelegate, MenuDinamicoService, PushNotificationService, $scope.idCuenta, $ionicLoading, MenuOpcionesFunction);

    FuncionesGlobales.cerrarSesion($scope, $ionicLoading, $ionicHistory, $state);

    FuncionesGlobales.actualizarVista($scope, $state);
    
    FuncionesGlobales.goHome($scope, $state);
    
    
    // cargando
    $ionicLoading.show({
        template: 'Cargando...'
    });
    

    // llamado al webservice dinamico
    var fn = makeDynamicService($scope.webService, $scope.webMethod);

    $injector.instantiate(fn).run($scope.idCuenta).then(function (opciones) {

        $scope.opciones = [];


        if (opciones && opciones.length > 0) {
            $scope.opciones = opciones;
        }

        $ionicLoading.hide();
    });

    $scope.ToggleApp = function (idCuenta, idOpcion) {

        // U0283C2 (ToggleApp)
        var fn = makeDynamicService2($scope.webService, 'U0283C2');

        $injector.instantiate(fn).run(idCuenta, idOpcion).then(function (estado) {


        });
    }

    $scope.getChecked = function (condicion) {

        // si esta habilitada
        if (condicion == 'Z0B9DE9') {
            return true;
        } else {
            return false;
        }
    }
    

})