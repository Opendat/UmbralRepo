angular.module('app.controllers', ['ionic'])

.controller('misNotificacionesCtrl', function ($scope, PushNotificationService, MenuDinamicoService, $ionicLoading, $stateParams, $ionicHistory, $state, $ionicPopover, $ionicPopup, $ionicSideMenuDelegate) {

    $scope.notifications = [];
    $scope.opciones = [];
    $scope.noMoreItemsAvailable = false;

    PushNotificationService.GetNombreApellido($scope.idCuenta)
        .then(function (response) {
            $scope.nombreApellido = response;
        });


    // funcion que se ejecut cuando se hace click sobre el titulo de una notificacion
    $scope.openPopover = function ($event, tituloNotificacion, detalleNotificacion) {

        $scope.title = tituloNotificacion;

        $scope.content = detalleNotificacion;

        $ionicPopover.fromTemplateUrl('templates/popover.html', {
            scope: $scope
            , animation: 'slide-in-up'
        }).then(function (popover) {
            $scope.popover = popover;
            $scope.popover.show($event);
        });

    };

    $scope.showPopover = function () {
        $scope.popover.show();
    }
    $scope.closePopover = function () {
        $scope.popover.hide();
    };

    $scope.select = function (index) {
        $scope.selected = index;
    };


    $scope.toggleRight = function () {
        $ionicSideMenuDelegate.toggleRight();
    };

    if ($stateParams.idCuenta) {
        $scope.idCuenta = $stateParams.idCuenta;
    }
    // cargando
    $ionicLoading.show({
        template: 'Cargando...'
    });

    $ionicLoading.hide();

    // recarga la pagina actual
    $scope.ActualizarView = function () {
        $state.go($state.current, {}, {
            reload: true
        });
    }

    // se ejecuta cuando se pulsa el boton de cerrar sesion en el menu lateral derecho
    $scope.CerrarSesion = function () {

        $ionicLoading.show({
            template: 'Cerrando Sesión...'
        });


        // se elimina del localstorage usuario y contraseñas si es que existen
        if (window.localStorage.getItem("username") != null) {
            window.localStorage.removeItem("username")
        }

        if (window.localStorage.getItem("password") != null) {
            window.localStorage.removeItem("password")
        }

        // se almacena el savelogin con show para indicar que debe mostrar mensaje al iniciar sesion
        window.localStorage.setItem("savelogin", "show");

        // timeout de 2 segundos que permite ocultar mensaje, limpiar cache e historial, etc
        setTimeout(function () {
            $ionicLoading.hide();
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            $ionicHistory.nextViewOptions({
                disableBack: true
                , historyRoot: true
            });
            $state.go('conectarse');
        }, 2000);
    }


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

    // carga menu dinamico lateral derecho desde el webservice correspondiente
    MenuDinamicoService.GetMenuDinamico($scope.idCuenta).then(function (opcionesArray) {

        if (opcionesArray.length == 0) {
            //alert('no hay opciones');
        }
        //$scope.opciones = $scope.opciones.concat(opciones);

        // algoritmo para crear menu dinamico, de menu y submenu
        $scope.items = [];

        var i = 0;
        var j = 0;
        var k = 0;
        var l = 0;
        while (i < opcionesArray.length) {
            $scope.subitems = [];
            l = 0;

            $scope.items[k] = {
                precedente: opcionesArray[i].PRECEDENTE
                , subitems: $scope.subitems
            };


            while (j < opcionesArray.length && opcionesArray[i].PRECEDENTE == opcionesArray[j].PRECEDENTE) {

                $scope.subitems[l] = {
                    nombre: opcionesArray[j].ID_OPCION
                    , webservice: opcionesArray[j].WEB_SERVICE
                };
                j++;
                l++;
            }
            i = j;

            k++;
        }


    });


    // permite mostrar y ocultar items en el menu dinamico derecho
    $scope.toggleOption = function (option) {
        if ($scope.isOptionShown(option)) {
            $scope.shownOption = null;
        } else {
            $scope.shownOption = option;
        }
    };
    $scope.isOptionShown = function (option) {
        return $scope.shownOption === option;
    };

    // almacena la cantidad de notificaciones recientes 
    $scope.cantidadNotificacionesRecientes = 0;
    if (window.localStorage.getItem("cantidadNotificacionesRecientes") != null) {
        $scope.cantidadNotificacionesRecientes = parseInt(window.localStorage.getItem("cantidadNotificacionesRecientes"));
    }


    $scope.ItemMenu = function (webservice) {

        var webMethod = 'AntecedentesPersonales';

        //alert(webservice);

        $state.go('miOpcion', {
            idCuenta: $scope.idCuenta
            , webService: webservice
            , webMethod: webMethod
        });
    }

})

.controller('miOpcionCtrl', function ($scope, $injector, $ionicLoading, $stateParams, $ionicHistory, $state) {


    if ($stateParams.idCuenta) {
        $scope.idCuenta = $stateParams.idCuenta;
    }
    if ($stateParams.webService) {
        $scope.webService = $stateParams.webService;
    }
    if ($stateParams.webMethod) {
        $scope.webMethod = $stateParams.webMethod;
    }

    

    //    var antecedentes = '<b>Nombre:</b> Cristian Reyes Alcalde <br/> <b>Rut:</b> 16.480.546-8 <br/><br/> <b>Id Verificación:</b> 970070 <br/><b>Pórtico:</b> 001001001 <br/><br/><b>Empleador:</b> Opendat <br/><b>Rut:</b> 72026324-5<br/><b>Domicilio:</b> 14 de febrero 2065, Antofagasta';


    // llamado al webservice dinamico
    var fn = makeDynamicService($scope.webService, $scope.webMethod);



    $scope.title = 'Mis Antecedentes';


    $injector.instantiate(fn).run($scope.idCuenta).then(function (content) {
        $scope.content = content;
    });


})




.controller('conectarseCtrl', function ($scope, LoginService, PushNotificationService, $ionicPopup, $ionicLoading, $cordovaDevice, $ionicPlatform, $state, $cordovaToast, $timeout, $http) {

    $ionicPlatform.ready(function () {

        document.addEventListener("deviceready", function () {

            if (window.localStorage.getItem("username") !== null && window.localStorage.getItem("password") !== null) {

                $scope.idCuenta = window.localStorage.getItem("username");
                $scope.password = window.localStorage.getItem("password");


                window.localStorage.setItem("savelogin", "hide");

                $state.go('misNotificaciones', {
                    idCuenta: $scope.idCuenta,

                });

            } else {
                window.localStorage.setItem("savelogin", "show");
            }
        }, false);
        // se obtiene la UUID del dispositivo
        $scope.UUID = $cordovaDevice.getUUID();

        // generar instanceID
        var push = PushNotification.init({
            android: {
                senderID: "401797945987"
                , forceShow: "true"
            }
            , ios: {
                //                senderID: "999493903347",
                //                gcmSandbox: "true",
                alert: "true"
                , badge: "true"
                , sound: "true"
                , clearBadge: "true"
            , }
            , windows: {}
        });

        push.on('registration', function (data) {
            $scope.newInstanceID = data.registrationId;
        });

        push.on('notification', function (data) {
            if ($cordovaDevice.getPlatform() == "Android") {
                $scope.fechaCreado = data.additionalData["_fechaCreado"];
                $scope.notifyCuenta = data.additionalData["_idCuenta"];
                $scope.titulo = data.title;

            } else { // ios
                $scope.fechaCreado = data.additionalData.fecha;
                $scope.notifyCuenta = data.additionalData.idcuenta;
                $scope.titulo = data.additionalData.titulo;

                //                $cordovaToast.showLongTop(data.message);

            }
            $scope.mensaje = data.message;
            $scope.ESTADO_DISPOSITIVO_MOVIL = "Z0B9CEE";



            push.finish(function () {

                PushNotificationService.ActualizarFecha($scope.UUID, $scope.notifyCuenta, $scope.fechaCreado, $scope.ESTADO_DISPOSITIVO_MOVIL).then(function (response) {});




                //                $scope.notifications = [];
                //                PushNotificationService.GetNotifications($scope.notifyCuenta, $scope.notifications.length).then(function (notifications) {
                //
                //                    var cantidadNotificaciones = window.localStorage.getItem("cantidadNotificaciones");
                //                    if (cantidadNotificaciones != null && (notifications.length > parseInt(cantidadNotificaciones))) {
                //                        $scope.cantidadNotificacionesRecientes = notifications.length - parseInt(cantidadNotificaciones);
                //                    } else {
                //                        $scope.cantidadNotificacionesRecientes = 0;
                //                    }
                //                    window.localStorage.setItem("cantidadNotificaciones", notifications.length);
                //                });


                window.localStorage.setItem("cantidadNotificacionesRecientes", 1);


                if ($scope.titulo == "Administracion de Cuenta") {
                    $ionicPopup.alert({
                        title: 'Activar Cuenta!'
                        , template: 'Has recibido tu contraseña, activa tu cuenta'
                    }).then(function (res) {
                        $state.go('cambioDeClave', {
                            idCuenta: $scope.notifyCuenta
                            , mensaje: $scope.mensaje
                        });
                        $scope.mensaje = "";
                        $scope.notifyCuenta = "";
                    });
                } else {
                    $scope.mensaje = "";
                    $scope.notifyCuenta = "";
                }
                $scope.fechaCreado = "";

                console.log('finish successfully called');



                $state.go($state.current, {}, {
                    reload: true
                });

            });

        });

        push.on('error', function (e) {
            e.message
        });

    });

    // función para verificar la cuenta del usuario
    $scope.verificarCuenta = function () {
        if ($scope.idCuenta == null || $scope.idCuenta == '') // si el campo es vacío
        {
            $ionicPopup.alert({
                title: 'Campo Vacío'
                , template: 'Por favor, ingrese: <br> - Cuenta de Usuario'
            });
            return;
        }
        $ionicLoading.show({
            template: 'Verificando...'
        });


        //$scope.idCuenta = $scope.idCuenta.toUpperCase();

        LoginService.VerificarCuenta($scope.idCuenta).then(function (response) {

                $scope.idPersona = response;
                $ionicLoading.hide();

                if (response != "NoEncontrado") { // si encontró la cuenta
                    $ionicLoading.show({
                        template: 'Cargando...'
                    });

                    window.localStorage.setItem("username", $scope.idCuenta); // se guarda la variable idPersona en almacenamiento local

                    PushNotificationService.BuscarCliente($scope.idPersona, $scope.UUID, $scope.newInstanceID, $scope.idCuenta).then(function (response) {
                        $ionicLoading.hide();
                    });

                    LoginService.ObtenerEstadoCuenta($scope.idCuenta).then(function (response) {
                        $scope.estadoCuenta = response;

                        // si no es Activa (tabla cuenta) o si no es Aprobada (tabla estado solicitud de absentismos?????)
                        if ($scope.estadoCuenta == "Z0B9917" || $scope.estadoCuenta == "Z0B9A41") {
                            // si no es porque lacuenta está habilitada para iniciar sesión y se redirecciona a la ventana correspondiente
                            $state.go('conectarse2', {
                                idCuenta: $scope.idCuenta
                                , idPersona: $scope.idPersona
                            });
                        } else {
                            // se notifica que debe activar la contraseña que se le proporcionará y se redirecciona a que cambie la clave
                            $ionicPopup.alert({
                                title: 'Activar Cuenta'
                                , template: 'En unos momentos, se le proporcionará la contraseña para poder activar su cuenta'
                            });
                            $state.go('cambioDeClave', {
                                idCuenta: $scope.idCuenta
                                , mensaje: $scope.mensaje
                            });
                        }
                        $scope.idCuenta = "";
                        $scope.idPersona = "";
                        $scope.estadoCuenta = "";
                    });


                } else {

                    $ionicPopup.alert({
                        title: 'Cuenta no encontrada'
                        , template: 'La cuenta ingresada no se ha encontrado. Vuelva a intentar.'
                    });
                }


            }
            , function (reponse) {
                $ionicLoading.hide();

                $ionicPopup.alert({
                    title: 'Conexión no establecida'
                    , template: 'La Conexión superó el tiempo de espera.'
                });
            });

        //        timePromise.catch(function (err) {
        //            $ionicLoading.hide();
        //
        //            $ionicPopup.alert({
        //                title: 'Conexión no establecida'
        //                , template: 'La Conexión superó el tiempo de espera.'
        //            });
        //        });
    }
})


.controller('conectarse2Ctrl', function ($scope, $ionicLoading, LoginService, $ionicPopup, $stateParams, $state) {

    if ($stateParams.idCuenta) {
        $scope.idCuenta = $stateParams.idCuenta;
    }
    if ($stateParams.idPersona) {
        $scope.idPersona = $stateParams.idPersona;
    }

    // función para verificar la cuenta del usuario
    $scope.verificarClave = function () {
        if ($scope.password == null || $scope.password == '') // si el campo es vacío
        {
            $ionicPopup.alert({
                title: 'Campo Vacío'
                , template: 'Por favor, ingrese: <br> - Contraseña'
            });
            return;
        }
        $ionicLoading.show({
            template: 'Verificando...'
        });

        LoginService.VerificarClave($scope.password, $scope.idCuenta).then(function (response) {
            $scope.respuesta = response;
            $ionicLoading.hide();

            if (response == true) { // si la autenticación es valida

                window.localStorage.setItem("password", $scope.password); // se guarda la variable password en almacenamiento local

                $state.go('misNotificaciones', {
                    idCuenta: $scope.idCuenta
                });
            } else {
                $ionicPopup.alert({
                    title: 'Clave Incorrecta'
                    , template: 'Por favor, vuelva a ingresar la clave.'
                });
            }
            $scope.password = "";
        }, function (reponse) {
            $ionicLoading.hide();

            $ionicPopup.alert({
                title: 'Conexión no establecida'
                , template: 'La Conexión superó el tiempo de espera.'
            });
        });
    }

})



.controller('cambioDeClaveCtrl', function ($scope, $ionicPopup, LoginService, $ionicLoading, $stateParams, $ionicHistory, $state) {

    $ionicHistory.clearHistory();

    if ($stateParams.idCuenta) {
        $scope.idCuenta = $stateParams.idCuenta;
    }
    if ($stateParams.mensaje) {
        $scope.mensaje = $stateParams.mensaje;
        var lastword = $scope.mensaje.split(" ").pop();
        $scope.oldPass = lastword;
    }
    // función para el cambio de contraseña y activacion de cuenta
    $scope.ActivacionCuenta = function () {
        if ($scope.newPass == null || $scope.newPass == '' || $scope.oldPass == null || $scope.oldPass == '' || $scope.confirmPass == null || $scope.confirmPass == '') // si uno de los campos está vacío
        {
            $ionicPopup.alert({
                title: 'Campo(s) Vacío(s)'
                , template: 'Por favor, ingrese: <br> - Contraseña Actual <br> - Nueva Contraseña <br> - Confirmar Contraseña'
            });
            return;
        }

        if ($scope.newPass != $scope.confirmPass) {
            $ionicPopup.alert({
                title: 'Contraseñas no Coinciden'
                , template: 'La nueva contraseña no coincide con su confirmación.'
            });
            return;
        }

        $ionicLoading.show({
            template: 'Verificando clave...'
        });
        LoginService.VerificarClave($scope.oldPass, $scope.idCuenta).then(function (response) {
            $ionicLoading.hide();
            if (response == false) {
                $ionicPopup.alert({
                    title: 'Contraseña Errónea'
                    , template: 'Su contraseña actual no es correcta. Por favor ingrese de nuevo.'
                });
            } else {
                $ionicLoading.show({
                    template: 'Activando cuenta...'
                });
                LoginService.ActivarCuenta($scope.idCuenta, $scope.newPass).then(function (response) {
                    $ionicLoading.hide();

                    if (response == true) { // si la activación ha sido correcta
                        $ionicPopup.alert({
                            title: 'Cuenta Activada!'
                            , template: 'Se ha activado su cuenta. Ahora puede iniciar sesión.'
                        });
                        $state.go('conectarse');
                    } else {
                        $ionicPopup.alert({
                            title: 'Error al activar'
                            , template: 'Hubo un error al activar. Por favor, intente de nuevo.'
                        });
                    }
                });
            }
        })

    }
})