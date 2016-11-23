'use strict';

angular.module('misNotificaciones.module').controller('misNotificacionesCtrl', function ($scope, PushNotificationService, MenuOpcionesFunction, MenuDinamicoService, $ionicLoading, $stateParams, $ionicHistory, $state, $ionicPopover, $ionicPopup, $ionicSideMenuDelegate, FuncionesGlobales, $cordovaPrinter, $sce, $injector) {

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

            var coordenadas = latitud + "," + longitud;
            launchnavigator.navigate([latitud, longitud], {
                app: app
                , transportMode: transport
            });
        });
    }

//    $scope.enviarCorreo = function (title, mensaje) {
//
//        var string = mensaje.split('<br/>');
//
//        var destinatario = "";
//        var evento = "";
//        var fecha = "";
//        //var datos;
//        for (var i = 0; i < string.length; i++) {
//
//            if (string[i].indexOf('Correo') > -1) {
//
//                destinatario = string[i].split(':')[2].split('<')[0];
//                //destinatario = destinatario.replace(/ /g,'');
//
//            }
//            
//            if(string[i].indexOf('Evento') > -1){
//                evento = string[i].split(':')[1];
//            }
//            if(string[i].indexOf('Fecha') > -1){
//                fecha = string[i].split(' ')[1];
//                fecha = fecha + " " + string[i].split(' ')[2];
//            }
//
////            if (string[i].indexOf('Nombre') > -1 || string[i].indexOf('Rut') > -1) {
////
////                datos =  datos + " " + string[i].split('>')[1].split('<')[0];
////
////            }
////            
////            if(string[i].indexOf('Ubicación') > -1){
////                
////            }
//
//        }
//        //U02835C (EnviarCorreo)
//        var fn = makeDynamicService5("http://www.opendat.cl/umbral_ws/U02835C.asmx", "U02835F");
//
//        var asunto = title + " " + evento + " " + fecha;
//        
//        $injector.instantiate(fn).run(destinatario, asunto, mensaje).then(function (resultado) {
//
//            if (resultado == "ok") {
//                $ionicPopup.alert({
//                    title: 'Correo enviado'
//                    , template: 'Correo enviado correctamente.'
//                });
//            } else {
//                $ionicPopup.alert({
//                    title: 'Error de envío'
//                    , template: 'Hubo un error al enviar el correo.'
//                });
//            }
//
//        });
//    }

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