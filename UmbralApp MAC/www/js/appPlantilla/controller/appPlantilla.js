'use strict';

angular.module('appPlantilla.module').controller('appPlantillaCtrl', function ($scope, $injector, $ionicLoading, $stateParams, $ionicHistory, $state, $ionicSideMenuDelegate, MenuOpcionesFunction, MenuDinamicoService, PushNotificationService, FuncionesGlobales) {


    // cargando
    $ionicLoading.show({
        template: 'Cargando...'
    });


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


    // llamado al webservice dinamico
    var fn = makeDynamicService($scope.webService, $scope.webMethod);

    $injector.instantiate(fn).run($scope.idCuenta).then(function (content) {

        $scope.content = "";

        if (content) {
            $scope.content = content;
        }
        
        $ionicLoading.hide();

    });

})