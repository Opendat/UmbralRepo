angular.module('app.services', [])



.factory("LoginService", ['$soap', function ($soap) {
    //var base_url = "http://10.0.2.2:8273/U02709C.asmx";
    var base_url = "http://10.0.167.27/MRAT_UQA/U02709C.asmx";

    return {

        // verifica la cuenta del usuario
        VerificarCuenta: function (idCuenta) {
            return $soap.post(base_url, "VerificarCuenta", {
                idCuenta: idCuenta
            });
        },

        // obtiene el estado de la cuenta ingresada
        ObtenerEstadoCuenta: function (idCuenta) {
            return $soap.post(base_url, "ObtenerEstadoCuenta", {
                idCuenta: idCuenta
            });
        },

        // verifica la clave del usuario que se está autenticando
        VerificarClave: function (password, idCuenta) {
            return $soap.post(base_url, "VerificarClave", {
                contraseña: password
                , idCuenta: idCuenta
            });
        },

        ActivarCuenta: function (idCuenta, newPass) {
            return $soap.post(base_url, "ActualizarClaveCuentaCreada", {
                idCuenta: idCuenta
                , newPass: newPass
            });
        }

    }
}])

.factory("PushNotificationService", ['$soap', function ($soap) {
    //var base_url = "http://10.0.2.2:8273/U02709C.asmx";
    var base_url = "http://10.0.167.27/MRAT_UQA/U02709C.asmx";

    return {

        // Busca al usuario en la tabla U027100 y verifica si existe, si no existe, inserta el registro
        // si existe verfica que sea la misma instanceID, si no es la misma, actualiza la instanceID y
        // si es la misma no hace nada.
        BuscarCliente: function (idPersona, UUID, newInstanceID, idCuenta) {
            return $soap.post(base_url, "BuscarCliente", {
                idPersona: idPersona
                , UUID: UUID
                , newInstanceID: newInstanceID
                , idCuenta: idCuenta
            });
        },

        ActualizarFecha: function (UUID, idCuenta, fechaCreado, estadoNotificacion) {
            return $soap.post(base_url, "ActualizarFechaNotificacion", {
                UUID: UUID
                , idCuenta: idCuenta
                , fechaCreado: fechaCreado
                , estadoNotificacion: estadoNotificacion
            });
        },

        GetNotifications: function (idCuenta, lastReg) {
            return $soap.post(base_url, "ObtenerNotificaciones", {
                idCuenta: idCuenta
                , lastReg: lastReg
            });
        },

        GetNombreApellido: function (idCuenta) {
            return $soap.post(base_url, "ObtenerNombreApellidoCuenta", {
                idCuenta: idCuenta
            });
        }

    }
}])



.factory('MenuDinamicoService', ['$soap', function ($soap) {
    //var base_url = "http://10.0.2.2:8273/U0281CC.asmx";
    var base_url = "http://10.0.167.27/MRAT_UQA/U0281CC.asmx";

    return {
        GetMenuDinamico: function (idCuenta) {
            return $soap.post(base_url, "MenuOpciones", {
                idCuenta: idCuenta
            });
        }
    }
}]);

// funcion que permite ejecutar un webservice dinamico (parametros de url y webmethod)
makeDynamicService = function (webService, webMethod) {
    return ['$soap', function ($soap) {

        var base_url = webService;

        return {
            run: function (idCuenta) {
                return $soap.post(base_url, webMethod, {
                    idCuenta: idCuenta
                });
            }
        }
        }]
}

//makeService = function(module, identifier) {
//    module.factory(identifier+'-service', ['echo', function(echo) {
//            return {
//                run: function(msg) {
//                    return echo.echo(identifier + ": " + msg);
//                }
//            };
//        }]);
//    };

//.factory('timeoutHttpIntercept', [function ($rootScope, $q) {
//    return {
//        'request': function (config) {
//            config.timeout = 5000;
//            return config;
//        }
//    };
// }])
//
//.config(['$httpProvider', function ($httpProvider) {
//    $httpProvider.interceptors.push('timeoutHttpIntercept');
//}]);