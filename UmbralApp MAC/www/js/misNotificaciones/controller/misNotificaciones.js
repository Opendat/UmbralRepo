'use strict';

angular.module('misNotificaciones.module').controller('misNotificacionesCtrl', function ($scope, PushNotificationService, MenuOpcionesFunction, MenuDinamicoService, $ionicLoading, $stateParams, $ionicHistory, $state, $ionicPopover, $ionicPopup, $ionicSideMenuDelegate, FuncionesGlobales, $cordovaPrinter, $sce) {

    $scope.notifications = [];
    $scope.noMoreItemsAvailable = false;


    if ($stateParams.idCuenta) {
        $scope.idCuenta = $stateParams.idCuenta;
    }

    // cargando
    $ionicLoading.show({
        template: 'Cargando...'
    });


    FuncionesGlobales.openPopover($scope, $sce, $ionicPopover);

    FuncionesGlobales.toogleRight($scope, $state, $ionicSideMenuDelegate, MenuDinamicoService, PushNotificationService, $scope.idCuenta, $ionicLoading, MenuOpcionesFunction);

    FuncionesGlobales.cerrarSesion($scope, $ionicLoading, $ionicHistory, $state);

    FuncionesGlobales.actualizarVista($scope, $state);


    if (window.localStorage.getItem("savelogin") !== null && window.localStorage.getItem("savelogin") == "show") {

        var confirmPopup = $ionicPopup.confirm({
            title: 'UmbralApp'
            , template: '¿Te gustaría que la aplicación recuerde tu usuario y contraseña?'
        });
        confirmPopup.then(function (res) {
            if (res) {

            } else {
                if (window.localStorage.getItem("username") != null) {
                    window.localStorage.removeItem("username")
                }

                if (window.localStorage.getItem("password") != null) {
                    window.localStorage.removeItem("password")
                }


            }
        });
    }

    window.localStorage.removeItem("savelogin");


    // se ejecuta cuando se actualiza el panel de notificaciones
    $scope.loadMore = function () {
        // carga las notificaciones desde el webservice correspondiente
        PushNotificationService.GetNotifications($scope.idCuenta, $scope.notifications.length).then(function (notifications) {

            if (notifications.length <= 0) {
                $scope.noMoreItemsAvailable = true;
            } else {
                $scope.notifications = $scope.notifications.concat(notifications);
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');

            window.localStorage.setItem("cantidadNotificacionesRecientes", 0);


        });
    }


    // almacena la cantidad de notificaciones recientes 
    $scope.cantidadNotificacionesRecientes = 0;
    if (window.localStorage.getItem("cantidadNotificacionesRecientes") != null) {
        $scope.cantidadNotificacionesRecientes = parseInt(window.localStorage.getItem("cantidadNotificacionesRecientes"));
    }

    $scope.imprimir = function (pivote) {
        if ($cordovaPrinter.isAvailable()) {

            $cordovaPrinter.print(pivote);
        } else {
            alert("Printing is not available on device");
        }
    }

    $scope.gotomap = function (latitud, longitud) {

        launchnavigator.isAppAvailable(launchnavigator.APP.GOOGLE_MAPS, function (isAvailable) {
            var app;
            var transport;
            if (isAvailable) {
                app = launchnavigator.APP.GOOGLE_MAPS;
                transport = launchnavigator.TRANSPORT_MODE.WALKING;
            } else {
                console.warn("Google Maps");
                app = launchnavigator.APP.USER_SELECT;
            }
            
            var coordenadas = latitud +","+ longitud;
            launchnavigator.navigate([latitud, longitud], {
                app: app,
                transportMode: transport
            });
        });
    }

    $ionicLoading.hide();

})


angular.module('misNotificaciones.module').filter('hrefToJS', function ($sce, $sanitize) {
    return function (text) {
        var regex = /href="([\S]+)"/g;
        //var newString = $sanitize(text).replace(regex, "onClick=\"window.open('$1', '_blank', 'location=yes')\"");
        var newString = $sanitize(text).replace(regex, "href onClick=\"window.open('$1', '_blank', 'location=yes');return false;\"");
        return $sce.trustAsHtml(newString);
    }
})