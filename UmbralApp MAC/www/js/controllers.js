angular.module('app.controllers', ['ionic'])

.controller('misNotificacionesCtrl', function ($scope, PushNotificationService, MenuOpcionesFunction, MenuDinamicoService, $ionicLoading, $stateParams, $ionicHistory, $state, $ionicPopover, $ionicPopup, $ionicSideMenuDelegate) {

    $scope.notifications = [];
    $scope.noMoreItemsAvailable = false;



    // funcion que se ejecuta cuando se hace click sobre el titulo de una notificacion
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


    $scope.select = function (index) {
        $scope.selected = index;
    };


    $scope.toggleRight = function () {
        // cargando
        $ionicLoading.show({
            template: 'Cargando...'
        });
        MenuOpcionesFunction.MenuOpciones($scope, $state, $ionicSideMenuDelegate, MenuDinamicoService, PushNotificationService, $scope.idCuenta, $ionicLoading);

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
            }, 1000);
        }
        // almacena la cantidad de notificaciones recientes 
    $scope.cantidadNotificacionesRecientes = 0;
    if (window.localStorage.getItem("cantidadNotificacionesRecientes") != null) {
        $scope.cantidadNotificacionesRecientes = parseInt(window.localStorage.getItem("cantidadNotificacionesRecientes"));
    }


})

.controller('appMantencionCtrl', function ($scope, $injector, $ionicLoading, $stateParams, $ionicHistory, $state, $ionicSideMenuDelegate, MenuOpcionesFunction, MenuDinamicoService, PushNotificationService) {


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


    $scope.toggleRight = function () {

        // cargando
        $ionicLoading.show({
            template: 'Cargando...'
        });
        MenuOpcionesFunction.MenuOpciones($scope, $state, $ionicSideMenuDelegate, MenuDinamicoService, PushNotificationService, $scope.idCuenta, $ionicLoading);

        $ionicSideMenuDelegate.toggleRight();

    };



    $scope.GoHome = function () {
        $state.go('misNotificaciones', {
            idCuenta: $scope.idCuenta
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
        }, 1000);
    }

    $scope.title = $scope.title;
    $scope.content = "Aplicación en mantenimiento";

    $ionicLoading.hide();

})

.controller('appPlantillaCtrl', function ($scope, $injector, $ionicLoading, $stateParams, $ionicHistory, $state, $ionicSideMenuDelegate, MenuOpcionesFunction, MenuDinamicoService, PushNotificationService) {


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



    // recarga la pagina actual
    $scope.ActualizarView = function () {
        $state.go($state.current, {}, {
            reload: true
        });
    }


    $scope.toggleRight = function () {

        // cargando
        $ionicLoading.show({
            template: 'Cargando...'
        });
        MenuOpcionesFunction.MenuOpciones($scope, $state, $ionicSideMenuDelegate, MenuDinamicoService, PushNotificationService, $scope.idCuenta, $ionicLoading);

        $ionicSideMenuDelegate.toggleRight();
    };




    // llamado al webservice dinamico
    var fn = makeDynamicService($scope.webService, $scope.webMethod);

    $injector.instantiate(fn).run($scope.idCuenta).then(function (content) {

        $scope.content = "";

        if (content) {
            $scope.content = content;
        }

    });



    $scope.GoHome = function () {
        $state.go('misNotificaciones', {
            idCuenta: $scope.idCuenta
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
        }, 1000);
    }

    $ionicLoading.hide();

})


.controller('appFormularioCtrl', function ($scope, $injector, $ionicLoading, $stateParams, $ionicHistory, $state, $ionicSideMenuDelegate, MenuOpcionesFunction, MenuDinamicoService, PushNotificationService) {


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



    // recarga la pagina actual
    $scope.ActualizarView = function () {
        $state.go($state.current, {}, {
            reload: true
        });
    }

    $scope.ToggleApp = function (idCuenta, idOpcion) {

        // U0283C2 (ToggleApp)
        var fn = makeDynamicService2($scope.webService, 'U0283C2');

        $injector.instantiate(fn).run(idCuenta, idOpcion).then(function (estado) {


        });
    }

    $scope.toggleRight = function () {

        // cargando
        $ionicLoading.show({
            template: 'Cargando...'
        });
        MenuOpcionesFunction.MenuOpciones($scope, $state, $ionicSideMenuDelegate, MenuDinamicoService, PushNotificationService, $scope.idCuenta, $ionicLoading);

        $ionicSideMenuDelegate.toggleRight();
    };




    // llamado al webservice dinamico
    var fn = makeDynamicService($scope.webService, $scope.webMethod);

    $injector.instantiate(fn).run($scope.idCuenta).then(function (opciones) {

        $scope.opciones = [];


        if (opciones && opciones.length > 0) {
            $scope.opciones = opciones;
        }


    });



    $scope.GoHome = function () {
        $state.go('misNotificaciones', {
            idCuenta: $scope.idCuenta
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
        }, 1000);
    }

    $scope.getChecked = function (condicion) {

        // si esta habilitada
        if (condicion == 'Z0B9DE9') {
            return true;
        } else {
            return false;
        }
    }
    $ionicLoading.hide();

})


.controller('appPanelCtrl', function ($scope, $injector, $ionicLoading, $stateParams, $ionicHistory, $state, $ionicSideMenuDelegate, MenuOpcionesFunction, MenuDinamicoService, PushNotificationService, $ionicPopover
    , $ionicPopup, $timeout, $ionicScrollDelegate) {


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



    // recarga la pagina actual
    $scope.ActualizarView = function () {
        $state.go($state.current, {}, {
            reload: true
        });
    }


    // funcion que se ejecuta al hacer click sobre un elemento de resumen de conciliacion
    $scope.openPopover = function ($event, fecha_origen, fecha_texto) {

        if (fecha_origen && fecha_texto) {
            //U028746 (ObtenerDetalleConciliacion)
            var fn = makeDynamicService4($scope.webService, "U028746");

            $injector.instantiate(fn).run($scope.idCuenta, fecha_origen).then(function (detalle) {


                if (detalle && detalle.length > 0) {

                    $scope.title_ = fecha_texto;
                    $scope.content_ = detalle;

                    $ionicPopover.fromTemplateUrl('templates/popover.html', {
                        scope: $scope
                        , animation: 'slide-in-up'
                    }).then(function (popover) {

                        $scope.popover = popover;
                        $scope.popover.show($event);

                    });
                }


            });
        }


    };



    $scope.scrollEvent = function () {

        var sv = $ionicScrollDelegate.$getByHandle('horizontal').getScrollView();

        var container = sv.__container;

        var originaltouchStart = sv.touchStart;
        var originaltouchMove = sv.touchMove;

        container.removeEventListener('touchstart', sv.touchStart);
        document.removeEventListener('touchmove', sv.touchMove);

        sv.touchStart = function (e) {
            e.preventDefault = function () {}
            originaltouchStart.apply(sv, [e]);
        }

        sv.touchMove = function (e) {
            e.preventDefault = function () {}
            originaltouchMove.apply(sv, [e]);
        }

        container.addEventListener("touchstart", sv.touchStart, false);
        document.addEventListener("touchmove", sv.touchMove, false);

    }

    // Execute action on hide popover
    $scope.$on('popover.hidden', function () {
        // Execute action

    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function () {
        // Execute action

    });



    $scope.toggleRight = function () {

        // cargando
        $ionicLoading.show({
            template: 'Cargando...'
        });
        MenuOpcionesFunction.MenuOpciones($scope, $state, $ionicSideMenuDelegate, MenuDinamicoService, PushNotificationService, $scope.idCuenta, $ionicLoading);

        $ionicSideMenuDelegate.toggleRight();
    };




    // cargando
    $ionicLoading.show({
        template: 'Cargando...'
    });

    $ionicLoading.hide();

    $scope.GoHome = function () {
        $state.go('misNotificaciones', {
            idCuenta: $scope.idCuenta
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
        }, 1000);
    }

    $scope.registros = [];
    $scope.noMoreItemsAvailable = false;

    $scope.loadMore = function () {


        //llamado al webservice dinamico
        var fn = makeDynamicService3($scope.webService, $scope.webMethod);

        $injector.instantiate(fn).run($scope.idCuenta, $scope.registros.length).then(function (registros) {


            if (registros && registros.length <= 0) {

                $scope.noMoreItemsAvailable = true;
            } else {

                $scope.registros = $scope.registros.concat(registros);
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');


        });
    }


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

                if (response != "Error de Autenticación") {
                    if (response != "NoEncontrado") { // si encontró la cuenta
                        if (response != "CuentaEmpresa") {
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
                                title: 'Cuenta incorrecta'
                                , template: 'No puede utilizar para éste propósito, una cuenta tipo Empresa.'
                            });
                        }



                    } else {

                        $ionicPopup.alert({
                            title: 'Cuenta no encontrada'
                            , template: 'La cuenta ingresada no se ha encontrado. Vuelva a intentar.'
                        });
                    }
                } else {
                    $ionicPopup.alert({
                        title: 'Error de Autenticación'
                        , template: 'Error de Autenticación'
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


.controller('appMarcaAsistenciaCtrl', function ($scope, $stateParams, RegistroAsistenciaService, $ionicPlatform, $ionicPopup, $ionicLoading, $ionicHistory, $cordovaGeolocation, $cordovaBarcodeScanner, $state, $ionicSideMenuDelegate, MenuOpcionesFunction, MenuDinamicoService, PushNotificationService) {


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


    $scope.VERIFICACIONES = [];
    $scope.LISTA_FILTRADA = []; //lista con las reglas filtradas segun convenio.
    $scope.SUGERENCIA = []; //lista que contendra el evento de suguerencia.
    $scope.LineaTiempo = [];
    $scope.MoreRV = false;
    $scope.showJor = false;
    $scope.showIni = true;
    $scope.disabledButtonFilter = true; //nesesario para la disponibilidad del boton de filtro.


    // recarga la pagina actual
    $scope.ActualizarView = function () {
        $state.go($state.current, {}, {
            reload: true
        });
    }

    $scope.toggleRight = function () {

        // cargando
        $ionicLoading.show({
            template: 'Cargando...'
        });
        MenuOpcionesFunction.MenuOpciones($scope, $state, $ionicSideMenuDelegate, MenuDinamicoService, PushNotificationService, $scope.idCuenta, $ionicLoading);

        $ionicSideMenuDelegate.toggleRight();
    };


    $scope.GoHome = function () {
        $state.go('misNotificaciones', {
            idCuenta: $scope.idCuenta
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
        }, 1000);
    }


    $ionicLoading.show({
        template: 'Cargando...'
    });



    //busco la ubicacion geografica.
    var posOptions = {
        timeout: 3000
        , enableHighAccuracy: true
    };

    $ionicLoading.hide();

    ProcesoBusquedaReglas($scope.idCuenta);

    //    //se verifica que el dispositivo tengo habilitado el GPS.
    //    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
    //        
    //        $ionicLoading.hide();
    //
    //        ProcesoBusquedaReglas($scope.idCuenta);
    //
    //    }, function (err) {
    //        $ionicLoading.hide();
    //        //$scope.showIni = false;
    //        $ionicPopup.alert({
    //            title: 'Error en GeoLocalización'
    //            , template: 'No es posible obtener la posición geográfica para su registro.<br>Favor revisar conexión y revisar activación de geolocalización de su dispositivo.'
    //        });
    //
    //        volverMisNotificaciones();
    //
    //    });

    function ProcesoBusquedaReglas(idCuenta) {
        $ionicLoading.show({
            template: 'Cargando...'
        });

        RegistroAsistenciaService.GetReglaVerificacion(idCuenta).then(function (listaRV) {
            if (listaRV.length == 0) {
                $ionicLoading.hide();
                //la persona no tiene reglas de verificacion.
                $ionicPopup.alert({
                    title: 'Error en regla de verificación'
                    , template: 'Actualmente no tiene reglas de verificación asociadas. Contactar al fiscalizador.'
                });

                volverMisNotificaciones();

            } else if (listaRV.length == 1) {
                $scope.VERIFICACIONES = listaRV;
                $scope.ProcesoEventos(listaRV);
            } else {
                //Existe mas de una regla de verificacion activa de la persona.
                //se activa el filtro de convenios.
                $scope.VERIFICACIONES = listaRV;
                $scope.selConvenio = "Seleccione Convenio"; //inicializacion para el select de convenio.
                $scope.selJornada = "Seleccione Jornada";
                $scope.MoreRV = true;
                $scope.showJor = false;
                $ionicLoading.hide();
            }
        }, function (err) {

            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Error en obtención de reglas de verificación. Contactar al fiscalizador'
                , template: 'Error de conexión.'
            }).then(function (res) {
                volverMisNotificaciones();
            });
        });
    }



    /*  Funcion que filtra las reglas de verificacion de la persona segun el convenio seleccionado.
        Esta funcion permite desplegar las opciones dentro de la lista de jornadas que puede seleccionar.
    */
    function filtrado(convenio) {
        var list = [];
        for (i = 0; i < $scope.VERIFICACIONES.length; i++) {
            if ($scope.VERIFICACIONES[i].U0205FA == convenio) {
                list.push($scope.VERIFICACIONES[i]);
            }
        }
        return list;
    }

    /*
        Funcion usada al seleccionar un convenio en el Select. 
        se filtra las reglas de verificacion segun el convenio seleccionado, desplegando las jornadas de ese convenio.
    */
    $scope.SelectJornada = function (convenio) {
        if (convenio == null) {
            $scope.showJor = false;
            $scope.disabledButtonFilter = true;
        } else {
            //filtro las reglas de verificacion segun el convenio elegido.
            var listaFiltrada = filtrado(convenio.U0205FA);
            $scope.LISTA_FILTRADA = listaFiltrada;
            $scope.showJor = true;
        }
    }

    /*
        Funcion usada para controlar la disponibilidad del boton de seleccion de convenio y jornada, en la seccion de filtro.
    */
    $scope.SelectFiltro = function (jornada) {
        if (jornada == null) {
            $scope.disabledButtonFilter = true;
        } else {
            $scope.disabledButtonFilter = false;
        }
    }


    /*
        Funcion usada para resaltar la sugerencia de marcaje segun la hora del servidor.
    */
    function sugerencia() {
        $ionicPopup.show({
            title: 'Sugerencia de marcaje'
            , subtitle: '¿Es este el marcaje que deseas realizar?', //template: '<div><button class="button button-block button-large button-positive" ng-click = ng-click="ProcesoMarcaje(li)">'+$scope.SUGERENCIA[0].NOMBRE_EVENTO+'</button></div>',
            template: '<div><button class="button button-block button-large button-positive">Ola</button></div>',

            scope: $scope
            , buttons: [{
                text: 'No seleccionar'
            , }]
        });

    }

    function ObtenerLineaTiempo(listado) {
        //busco la linea de tiempo de la persona.
        RegistroAsistenciaService.getLineaTiempo(listado[0].U0205F9, listado[0].U0205FB).then(function (lineaTiempo) {
            //obtengo la sugerencia de linea de tiempo.
            RegistroAsistenciaService.Sugerencia(listado[0].U0205F9, listado[0].U0205FB).then(function (sugerencia_evento) {
                $scope.LineaTiempo = lineaTiempo;

                if (lineaTiempo.length == 0) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Error en Línea de Planificaciones'
                        , template: 'Actualmente no tiene planificación de jornadas.<br>Contactar al fiscalizador.'
                    });

                    volverMisNotificaciones();

                } else {
                    $ionicLoading.hide();
                    //si el evento se gatillo desde la seccion de filtrado o directamente.
                    if ($scope.LISTA_FILTRADA.length != 0) {
                        //el proceso se gatillo desde la seccion de filtrado.
                        $scope.VERIFICACIONES = $scope.LISTA_FILTRADA; //reemplazo las verificaciones por la regla seleccionada en el filtro.
                    }
                    $scope.MoreRV = false;

                }

                if (sugerencia_evento.length != 0) {
                    $scope.SUGERENCIA = sugerencia_evento;
                    //sugerencia();
                }


            }, function (err) {
                $ionicLoading.hide();
                alert("Error en obtención de la sugerencia de la línea de tiempo: " + err);
            });
        }, function (err) {
            $ionicLoading.hide();
            alert("Error en obtención de la línea de tiempo: " + err);
        });
    }

    
    /*
        Funcion que inicia la etapa de seleccion de eventos de marcajes.
        Se recibe la regla de verificacion el cual corresponde la linea de tiempo a seleccionar. (lista_filtrada o regla de verificacion directamente).
    */
    $scope.ProcesoEventos = function (listado) {
        $scope.IdPersona = listado[0].U0205FB;
        $scope.NivelAutorizacion = listado[0].U020615;
        if (listado[0].U020615 == 'Z0B9E42' || listado[0].U020615 == 'Z0B9E43') { //Z0B9E42=autorizado , Z0B9E43=IncluirQR
            ObtenerLineaTiempo(listado);
        } else {
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Error en Dotaciones Nombradas'
                , template: 'Actualmente no esta autorizado para realizar marcajes movil.<br>Favor consultar a su fiscalizador.'
            });

            volverMisNotificaciones();
        }

    }

    function RegistroMarca(lineaT, localizacionGeografica) {
        switch (lineaT.U0269FC) {
        case 'Z0B99D3': // Inicio Jornada

            RegistroAsistenciaService.IngresoMarcaje($scope.idCuenta, lineaT.U0269FC, lineaT.U0269F9, lineaT.U0269FE, localizacionGeografica).then(function () {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Ingreso Correcto'
                    , template: 'Se ha realizado el registro de marcaje.'
                });

                volverMisNotificaciones();
            }, function () {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Error en registro de marca'
                    , template: 'No ha sido posible realizar el registro de marcaje.'
                });
            });
            break;
        case 'Z0B99D5': // Inicio Colacion

            RegistroAsistenciaService.IngresoMarcaje($scope.idCuenta, lineaT.U0269FC, lineaT.U0269F9, lineaT.U0269FE, localizacionGeografica).then(function () {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Ingreso Correcto'
                    , template: 'Se ha realizado el registro de marcaje.'
                });

                volverMisNotificaciones();
            }, function () {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Error en registro de marca'
                    , template: 'No ha sido posible realizar el registro de marcaje.'
                });
            });
            break;
        case 'Z0B99D6': // Termino Colacion

            RegistroAsistenciaService.IngresoMarcaje($scope.idCuenta, lineaT.U0269FC, lineaT.U0269F9, lineaT.U0269FE, localizacionGeografica).then(function () {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Ingreso Correcto'
                    , template: 'Se ha realizado el registro de marcaje.'
                });

                volverMisNotificaciones();
            }, function () {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Error en registro de marca'
                    , template: 'No ha sido posible realizar el registro de marcaje.'
                });
            });

            break;
        case 'Z0B99D4': // Termino Jornada

            RegistroAsistenciaService.IngresoMarcaje($scope.idCuenta, lineaT.U0269FC, lineaT.U0269F9, lineaT.U0269FE, localizacionGeografica).then(function () {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Ingreso Correcto'
                    , template: 'Se ha realizado el registro de marcaje.'
                });

                volverMisNotificaciones();
            }, function () {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Error en registro de marca'
                    , template: 'No ha sido posible realizar el registro de marcaje.'
                });
            });
            break;
        } //fin SWITCH
    } //fin Funcion REGISTROMARCA

    /*
        Funcion usada para la autentificacion por codigo QR.
        Se verifica si la persona debe autenticar con codigo QR segun su Dotacion (convenio).
    */
    function Autenticacion(evento, localizacionGeografica) {
        if ($scope.NivelAutorizacion == "Z0B9E43") {
            //inicio funcion de lectura de codigo QR.
            $cordovaBarcodeScanner.scan().then(function (dataQR) {
                // lectura exitosa, se obtiene la informacion y se procesa.
                RegistroAsistenciaService.VerificarQR(dataQR.text, $scope.IdPersona).then(function (ResVerificacion) {
                    if (ResVerificacion == true) {
                        //ingreso los datos a la BD.
                        RegistroMarca(evento, localizacionGeografica);
                    } else {
                        //autentificacion Fallida.
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'Error en Autentificación'
                            , template: 'No es posible realizar tu registro. La credencial presentada no está asociada a tu cuenta.'
                        });
                        volverMisNotificaciones();
                    }

                });
            }, function (error) {
                // error de lectura.
                $ionicPopup.alert({
                    title: 'Error de lectura'
                    , template: 'Error de lectura, intente nuevamente.'
                });
                return false;
            });
        } else {
            //la persona esta autorizado sin codigo QR.
            RegistroMarca(evento, localizacionGeografica);
        }
    }

    function volverMisNotificaciones() {
        //ionic.Platform.exitApp();
        //$scope.showIni = true;
        $scope.showJor = false;
        $scope.MoreRV = false;

        $ionicLoading.hide();

        $state.go('misNotificaciones', {
            idCuenta: $scope.idCuenta
        });

    }

    /*
        Funcion usada al seleccionar un evento de marca.
        Se inicia el proceso de marcaje, comenzando con la etapa de autentificacion.
    */
    $scope.ProcesoMarcaje = function (lineaT) {
            $ionicLoading.show({
                template: 'Cargando...'
            });
            var options = {
                timeout: 3000
                , enableHighAccuracy: true
            };
            $cordovaGeolocation.getCurrentPosition(options).then(function (pos) {
                var lat = pos.coords.latitude
                var long = pos.coords.longitude
                var loc = lat + ";" + long;

                Autenticacion(lineaT, loc);

            }, function (err) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Error en GeoLocalización'
                    , template: 'No es posible obtener la posición geográfica para su registro.<br>Favor revisar conexión y revisar activación de geolocalización de su dispositivo.'
                });
                volverMisNotificaciones();
            }); //fin getCurrentPosition
        } // fin Proceso marcaje


}); // fin controller