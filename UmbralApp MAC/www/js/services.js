angular.module('app.services', [])



.factory("LoginService", ['$soap', function ($soap) {
    //var base_url = "http://10.0.2.2:8273/U02709C.asmx";
    //var base_url = "http://10.0.167.27/MRAT_UQA/U02709C.asmx";
    var base_url = "http://www.opendat.cl/umbral_ws/U02709C.asmx";

    $soap.setCredentials("umbral", "1234");

    return {

        // verifica la cuenta del usuario
        VerificarCuenta: function (idCuenta) {
            return $soap.post(base_url, "U02709D", {
                idCuenta: idCuenta
            });
        },

        // obtiene el estado de la cuenta ingresada
        ObtenerEstadoCuenta: function (idCuenta) {
            return $soap.post(base_url, "U02709E", {
                idCuenta: idCuenta
            });
        },

        // verifica la clave del usuario que se está autenticando
        VerificarClave: function (password, idCuenta) {
            return $soap.post(base_url, "U0270A1", {
                contraseña: password
                , idCuenta: idCuenta
            });
        },

        ActivarCuenta: function (idCuenta, newPass) {
            return $soap.post(base_url, "U0270A2", {
                idCuenta: idCuenta
                , newPass: newPass
            });
        }

    }
}])

.factory("PushNotificationService", ['$soap', function ($soap) {
    //var base_url = "http://10.0.2.2:8273/U02709C.asmx";
    //var base_url = "http://10.0.167.27/MRAT_UQA/U02709C.asmx";
    var base_url = "http://www.opendat.cl/umbral_ws/U02709C.asmx";

    $soap.setCredentials("umbral", "1234");

    return {

        // Busca al usuario en la tabla U027100 y verifica si existe, si no existe, inserta el registro
        // si existe verfica que sea la misma instanceID, si no es la misma, actualiza la instanceID y
        // si es la misma no hace nada.
        BuscarCliente: function (idPersona, UUID, newInstanceID, idCuenta) {
            return $soap.post(base_url, "U02709F", {
                idPersona: idPersona
                , UUID: UUID
                , newInstanceID: newInstanceID
                , idCuenta: idCuenta
            });
        },

        ActualizarFecha: function (UUID, idCuenta, fechaCreado, estadoNotificacion) {
            return $soap.post(base_url, "U0270A0", {
                UUID: UUID
                , idCuenta: idCuenta
                , fechaCreado: fechaCreado
                , estadoNotificacion: estadoNotificacion
            });
        },

        GetNotifications: function (idCuenta, lastReg) {
            return $soap.post(base_url, "U0270A5", {
                idCuenta: idCuenta
                , lastReg: lastReg
            });
        },

        GetNombreApellido: function (idCuenta) {
            return $soap.post(base_url, "U0270A6", {
                idCuenta: idCuenta
            });
        }

    }
}])

.factory("SolicitudCuentaService", ['$soap', function ($soap) {

    var base_url = "http://www.opendat.cl/umbral_ws/U028A64.asmx";

    $soap.setCredentials("umbral", "1234");

    return {
        ObtenerDatosPersona: function (rutPersona, rutEmpresa) {
            return $soap.post(base_url, "U028A65", {
                rutPersona: rutPersona
                , rutEmpresa: rutEmpresa
            });
        },
        GenerarSolicitudCuenta: function (IdPersona, RutEmpresa, Cuenta, Correo, Fono, PerfilID, Comentario) {
            return $soap.post(base_url, "U028A66", {
                IdPersona: IdPersona
                , RutEmpresa: RutEmpresa
                , Cuenta: Cuenta
                , Correo: Correo
                , Fono: Fono
                , PerfilID: PerfilID
                , Comentario: Comentario
            });
        },
        ObtenerPerfiles: function () {
            return $soap.post(base_url, "U028A67");
        }
        
    }

}])

.factory('MenuDinamicoService', ['$soap', function ($soap) {
    //var base_url = "http://10.0.2.2:8273/U0281CC.asmx";
    //var base_url = "http://10.0.167.27/MRAT_UQA/U0281CC.asmx";
    var base_url = "http://www.opendat.cl/umbral_ws/U0281CC.asmx";

    $soap.setCredentials("umbral", "1234");

    return {
        GetMenuDinamico: function (idCuenta) {
            return $soap.post(base_url, "U0281CD", {
                idCuenta: idCuenta
            });
        }
    }
}])



.factory("RegistroAsistenciaService", ['$soap', function ($soap) {


    //var base_url = "http://10.0.167.27/MRAT_UQA/U028424.asmx";
    var base_url = "http://www.opendat.cl/umbral_ws/U028424.asmx";

    $soap.setCredentials("umbral", "1234");

    return {

        //Funcion que busca las reglas de verificacion asignadas a la persona segun su ID de cuenta.
        //RETURN: Lista con objetos 'ReglasVerificacion'
        GetReglaVerificacion: function (idCuenta) {
            return $soap.post(base_url, "U028425", {
                idCuenta: idCuenta
            });
        },

        //obtengo la linea de tiempo actual para el despliegue en pantalla.
        getLineaTiempo: function (idVerificacion, idPersona) {
            return $soap.post(base_url, "U028426", {
                idVerificacion: idVerificacion
                , idPersona: idPersona
            });
        },

        //Envio regitro de marcaje.
        IngresoMarcaje: function (idAccount, typeEvent, idVerificacion, idPersona, geoLoc) {
            return $soap.post(base_url, "U028427", {
                _idCard: idAccount
                , _typeEvent: typeEvent
                , _idVerificacion: idVerificacion
                , _idPersona: idPersona
                , _loc_geo: geoLoc
            });
        },

        //Obtengo el resultado de la verificacion de la persona segun codigo QR.
        VerificarQR: function (dataQR, idPersona) {
            return $soap.post(base_url, "U028428", {
                codigoQR: dataQR
                , idPersona: idPersona
            });
        },

        //Obtengo la sugerencia de evento segun la hora actual.
        Sugerencia: function (verificacion, idPersona) {
            return $soap.post(base_url, "U028429", {
                idVerificacion: verificacion
                , idPersona: idPersona
            });
        }

    }
}])


.factory('FuncionesGlobales', function () {
    var root = {};

    root.toogleRight = function ($scope, $state, $ionicSideMenuDelegate, MenuDinamicoService, PushNotificationService, idCuenta, $ionicLoading, MenuOpcionesFunction) {

        $scope.toggleRight = function () {
            // cargando
            $ionicLoading.show({
                template: 'Cargando...'
            });
            MenuOpcionesFunction.MenuOpciones($scope, $state, $ionicSideMenuDelegate, MenuDinamicoService, PushNotificationService, idCuenta, $ionicLoading);

            $ionicSideMenuDelegate.toggleRight();

        }
    };
    root.cerrarSesion = function ($scope, $ionicLoading, $ionicHistory, $state) {
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
    };

    root.actualizarVista = function ($scope, $state) {
        // recarga la pagina actual
        $scope.ActualizarView = function () {
            $state.go($state.current, {}, {
                reload: true
            });
        }
    };

    root.openPopover = function ($scope, $ionicPopover) {
        // funcion que se ejecuta cuando se hace click sobre el titulo de una notificacion
        $scope.openPopover = function ($event, titulo, detalle) {

            $scope.title = titulo;

            $scope.content = detalle;

            $ionicPopover.fromTemplateUrl('templates/popover.html', {
                scope: $scope
                , animation: 'slide-in-up'
            }).then(function (popover) {
                $scope.popover = popover;
                $scope.popover.show($event);
            });

        }
    };

    root.goHome = function ($scope, $state) {
        $scope.GoHome = function () {
            $state.go('misNotificaciones', {
                idCuenta: $scope.idCuenta
            });
        }
    }
    
    root.goLogin = function ($scope, $state) {
        $scope.GoLogin = function () {
            $state.go('conectarse');
        }
    }

    return root;
})

.factory('MenuOpcionesFunction', function () {
    var root = {};
    root.MenuOpciones = function ($scope, $state, $ionicSideMenuDelegate, MenuDinamicoService, PushNotificationService, idCuenta, $ionicLoading) {


        //====================================================================================
        // carga menu dinamico lateral derecho desde el webservice correspondiente
        MenuDinamicoService.GetMenuDinamico(idCuenta).then(function (opcionesArray) {

            if (opcionesArray.length > 0) {
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
                            , webservice: opcionesArray[j].U027CBE
                            , webmethod: opcionesArray[j].U027CBF
                            , naturaleza: opcionesArray[j].U027CBC
                            , estado: opcionesArray[j].U027CBD
                        };
                        j++;
                        l++;
                    }
                    i = j;

                    k++;
                }

            }

            $ionicLoading.hide();
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
        //============================================================================================================

        // carga el nombre real del usuario
        PushNotificationService.GetNombreApellido($scope.idCuenta)
            .then(function (response) {
                $scope.nombreApellido = response;
            });

        $scope.ItemMenu = function (webservice, webmethod, title, naturaleza, estado) {


            // si estado esta en Mantencion go to appMantencion
            if (estado && estado == 'Z0B9DE7' && title) {
                $state.go('appMantencion', {
                    idCuenta: $scope.idCuenta
                    , title: title
                });

            } else {
                // devuelve true si no es null, undefined, NaN, empty string (""),0, false
                if (webservice && webmethod && title && naturaleza && estado) {

                    //$ionicSideMenuDelegate.toggleRight();

                    switch (naturaleza) {
                        //Formulario
                    case 'Z0B9E04':
                        $state.go('appFormulario', {
                            idCuenta: $scope.idCuenta
                            , webService: webservice
                            , webMethod: webmethod
                            , title: title
                        });
                        break;
                        //Panel
                    case 'Z0B9E05':
                        $state.go('appPanel', {
                            idCuenta: $scope.idCuenta
                            , webService: webservice
                            , webMethod: webmethod
                            , title: title
                        });
                        break;
                        // Plantilla
                    case 'Z0B9E06':
                        $state.go('appPlantilla', {
                            idCuenta: $scope.idCuenta
                            , webService: webservice
                            , webMethod: webmethod
                            , title: title
                        });
                        break;

                        //Marca Notificación
                    case 'Z0B9E7A':
                        $state.go('appMarcaAsistencia', {
                            idCuenta: $scope.idCuenta
                            , webService: webservice
                            , webMethod: webmethod
                            , title: title
                        });
                        break;
                        //Notificacion 
                    case 'Z0B9E07':
                        break;
                    default:


                    }


                }
            }


        }
    };
    return root;
});

// funcion que permite ejecutar un webservice dinamico enviando como parametro {idCuenta}
makeDynamicService = function (webService, webMethod) {
    return ['$soap', function ($soap) {

        var base_url = webService;

        $soap.setCredentials("umbral", "1234");

        return {
            run: function (idCuenta) {
                return $soap.post(base_url, webMethod, {
                    idCuenta: idCuenta
                });
            }
        }
        }]
};

// funcion que permite ejecutar un webservice dinamico enviando como parametros {idCuenta y idOpcion}
makeDynamicService2 = function (webService, webMethod) {
    return ['$soap', function ($soap) {

        var base_url = webService;

        $soap.setCredentials("umbral", "1234");

        return {
            run: function (idCuenta, idOpcion) {
                return $soap.post(base_url, webMethod, {
                    idCuenta: idCuenta
                    , idOpcion: idOpcion
                });
            }
        }
        }]
};

// funcion que permite ejecutar un webservice dinamico enviando como parametros {idCuenta y length}
makeDynamicService3 = function (webService, webMethod) {
    return ['$soap', function ($soap) {

        var base_url = webService;

        $soap.setCredentials("umbral", "1234");

        return {
            run: function (idCuenta, length) {
                return $soap.post(base_url, webMethod, {
                    idCuenta: idCuenta
                    , length: length
                });
            }
        }
        }]
};


// funcion que permite ejecutar un webservice dinamico enviando como parametros {idCuenta y fecha}
makeDynamicService4 = function (webService, webMethod) {
    return ['$soap', function ($soap) {

        var base_url = webService;

        $soap.setCredentials("umbral", "1234");

        return {
            run: function (idCuenta, fecha) {
                return $soap.post(base_url, webMethod, {
                    idCuenta: idCuenta
                    , fecha: fecha
                });
            }
        }
        }]
};