angular.module('app.controllers', ['ionic'])


.controller('conectarseCtrl', function ($scope, LoginService, PushNotificationService, FuncionesGlobales, $ionicPopup, $ionicLoading, $cordovaDevice, $ionicPlatform, $state, $cordovaToast, $timeout, $http, $rootScope, $cordovaNetwork, $interval, $http, $ionicHistory) {

    $ionicPlatform.ready(function () {

        console.log('ionicPlatform.ready');
        document.addEventListener("deviceready", onDeviceReady, false);

        // Lectura de archivo de texto (versionamiento de la app)
        window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + "www/version.properties", gotFile, fail);

        function fail(e) {
            console.log("FileSystem Error");
            console.dir(e);
        }

        function gotFile(fileEntry) {

            fileEntry.file(function (file) {
                var reader = new FileReader();

                reader.onloadend = function (e) {

                    //console.log("Text is: " + this.result);

                    var string = this.result.split('\n');

                    var version_n = 0;
                    var version_b = 0;

                    for (var i = 0; i < string.length; i++) {

                        if (string[i].indexOf('VERSION_NUMBER') > -1) {

                            version_n = string[i].split('=')[1];

                        }

                        if (string[i].indexOf('VERSION_BUILD') > -1) {

                            version_b = string[i].split('=')[1];

                        }

                    }
                    $scope.version = 'Version 1.' + version_n + ' (' + version_b + ')';
                    console.log($scope.version);

                }

                reader.readAsText(file);
            });

        }

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



    $scope.formData = {};
    // función para verificar la cuenta del usuario
    $scope.verificarCuenta = function () {

        if ($scope.formData.idCuenta == null || $scope.formData.idCuenta == '') // si el campo es vacío
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


        ////$scope.idCuenta = $scope.idCuenta.toUpperCase();

        //        LoginService.VerificarCuenta($scope.formData.idCuenta).then(function (response) {
        //
        //                $scope.idPersona = response;
        //                $ionicLoading.hide();
        //
        //                if (response != "Error de Autenticación") {
        //                    if (response != "NoEncontrado") { // si encontró la cuenta
        //                        if (response != "CuentaEmpresa") {
        //                            $ionicLoading.show({
        //                                template: 'Cargando...'
        //                            });
        //
        //                            window.localStorage.setItem("username", $scope.formData.idCuenta); // se guarda la variable idPersona en almacenamiento local
        //
        //                            PushNotificationService.BuscarCliente($scope.idPersona, $scope.UUID, $scope.newInstanceID, $scope.formData.idCuenta).then(function (response) {
        //                                $ionicLoading.hide();
        //                            });
        //
        //                            LoginService.ObtenerEstadoCuenta($scope.formData.idCuenta).then(function (response) {
        //                                $scope.estadoCuenta = response;
        //
        //                                // si es Activa (tabla cuenta) o si es Aprobada (tabla estado solicitud de cuentas)
        //                                if ($scope.estadoCuenta == "Z0B9917" || $scope.estadoCuenta == "Z0B99B2") {
        //                                    // si es, es porque la cuenta está habilitada para iniciar sesión y se redirecciona a la ventana correspondiente
        //                                    $state.go('conectarse2', {
        //                                        idCuenta: $scope.formData.idCuenta
        //                                        , idPersona: $scope.idPersona
        //                                    });
        //                                } else {
        //                                    // se notifica que debe activar la cuenta, una contraseña se le proporcionará y se redirecciona a que la cambie
        //                                    $ionicPopup.alert({
        //                                        title: 'Activar Cuenta'
        //                                        , template: 'En unos momentos, se le proporcionará la contraseña para poder activar su cuenta'
        //                                    });
        //                                    $state.go('cambioDeClave', {
        //                                        idCuenta: $scope.formData.idCuenta
        //                                        , mensaje: $scope.mensaje
        //                                    });
        //                                }
        //                                $scope.idCuenta = "";
        //                                $scope.idPersona = "";
        //                                $scope.estadoCuenta = "";
        //                            });
        //                        } else {
        //                            $ionicPopup.alert({
        //                                title: 'Cuenta incorrecta'
        //                                , template: 'No puede utilizar para éste propósito, una cuenta tipo Empresa.'
        //                            });
        //                        }
        //
        //
        //
        //                    } else {
        //
        //                        $ionicPopup.alert({
        //                            title: 'Cuenta no encontrada'
        //                            , template: 'La cuenta ingresada no se ha encontrado. Vuelva a intentar.'
        //                        });
        //                    }
        //                } else {
        //                    $ionicPopup.alert({
        //                        title: 'Error de Autenticación'
        //                        , template: 'Error de Autenticación'
        //                    });
        //                }
        //
        //
        //            }
        //            , function (reponse) {
        //                $ionicLoading.hide();
        //
        //                $ionicPopup.alert({
        //                    title: 'Conexión no establecida'
        //                    , template: 'La Conexión superó el tiempo de espera.'
        //                });
        //            });

        var username = 'umbral';
        var password = '1234';

        $.soap({
            url: 'http://www.opendat.cl/umbral_ws/U02709C.asmx'
            , appendMethodToURL: false
            , namespaceURL: 'http://tempuri.org/'
            , error: function (SOAPResponse) {
                // show error
            }
            , HTTPHeaders: {
                Authorization: 'Basic ' + btoa(username + ':' + password)
            }
        });


        $.soap({
            method: 'U02709D'
            , data: {
                idCuenta: $scope.formData.idCuenta
            }
            , SOAPAction: 'http://tempuri.org/U02709D'
            , success: function (soapResponse) {

                $ionicLoading.hide();
                
                var response = $(soapResponse.toString()).find('U02709DResult').text();
                $scope.idPersona = response;



                if (response != "Error de Autenticación") {
                    if (response != "NoEncontrado") { // si encontró la cuenta
                        if (response != "CuentaEmpresa") {

                            $ionicLoading.show({
                                template: 'Cargando...'
                            });

                            window.localStorage.setItem("username", $scope.formData.idCuenta);


                            $.soap({
                                method: 'U02709F'
                                , data: {
                                    idPersona: $scope.idPersona
                                    , UUID: $scope.UUID
                                    , newInstanceID: $scope.newInstanceID
                                    , idCuenta: $scope.formData.idCuenta
                                }
                                , SOAPAction: 'http://tempuri.org/U02709F'
                                , success: function (soapResponse) {

                                    $ionicLoading.hide();

                                    $.soap({
                                        method: 'U02709E'
                                        , data: {
                                            idCuenta: $scope.formData.idCuenta
                                        }
                                        , SOAPAction: 'http://tempuri.org/U02709E'
                                        , success: function (soapResponse) {

                                            var response = $(soapResponse.toString()).find('U02709EResult').text();
                                            $scope.estadoCuenta = response;
                                            // si es Activa (tabla cuenta) o si es Aprobada (tabla estado solicitud de cuentas)
                                            if ($scope.estadoCuenta == "Z0B9917" || $scope.estadoCuenta == "Z0B99B2") {
                                                // si es, es porque la cuenta está habilitada para iniciar sesión y se redirecciona a la ventana correspondiente
                                                $state.go('conectarse2', {
                                                    idCuenta: $scope.formData.idCuenta
                                                    , idPersona: $scope.idPersona
                                                });
                                            } else {
                                                // se notifica que debe activar la cuenta, una contraseña se le proporcionará y se redirecciona a que la cambie
                                                $ionicPopup.alert({
                                                    title: 'Activar Cuenta'
                                                    , template: 'En unos momentos, se le proporcionará la contraseña para poder activar su cuenta'
                                                });
                                                $state.go('cambioDeClave', {
                                                    idCuenta: $scope.formData.idCuenta
                                                    , mensaje: $scope.mensaje
                                                });
                                            }
                                            $scope.idCuenta = "";
                                            $scope.idPersona = "";
                                            $scope.estadoCuenta = "";
                                        }
                                    });
                                }
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
        });


    }

    $scope.solicitudCuenta = function () {
        $state.go('solicitudCuenta');
    }



    function onDeviceReady() {

        //        // Android customization
        //        cordova.plugins.backgroundMode.setDefaults({
        //            text: 'Doing heavy tasks.'
        //        });
        //        // Enable background mode
        //        cordova.plugins.backgroundMode.enable();

        // Called when background mode has been activated
        //        cordova.plugins.backgroundMode.onactivate = function () {
        //            setTimeout(function () {
        //                // Modify the currently displayed notification
        //                cordova.plugins.backgroundMode.configure({
        //                    text: 'Running in background for more than 5s now.'
        //                });
        //            }, 5000);
        //        }

        //        document.addEventListener("resume", onResume, false);
        //
        //        function onResume() {
        //            
        //            console.log('reconnect');
        //            //location.reload();
        //            navigator.app.loadUrl("file:///android_asset/www/index.html");
        //
        //        }


        //            document.addEventListener("pause", function () {
        //                //alert('background')
        //            }, false);





        //        function checkConnection() {
        //            var networkState = navigator.connection.type;
        //
        //            var states = {};
        //            states[Connection.UNKNOWN] = 'Unknown connection';
        //            states[Connection.ETHERNET] = 'Ethernet connection';
        //            states[Connection.WIFI] = 'WiFi connection';
        //            states[Connection.CELL_2G] = 'Cell 2G connection';
        //            states[Connection.CELL_3G] = 'Cell 3G connection';
        //            states[Connection.CELL_4G] = 'Cell 4G connection';
        //            states[Connection.CELL] = 'Cell generic connection';
        //            states[Connection.NONE] = 'No network connection';
        //
        //            console.log('Connection type: ' + states[networkState]);
        //
        //
        //            if (window.localStorage.getItem("beforeState") != null) {
        //
        //                if (states[networkState] == window.localStorage.getItem("beforeState")) {
        //
        //                    checkConnection2();
        //
        //                } else {
        //                    window.localStorage.setItem("beforeState", states[networkState]);
        //
        //                    $interval.cancel(interval);
        //
        //                    $ionicPopup.alert({
        //                            title: 'La conexión a internet ha cambiado'
        //                            , content: 'Disculpe, se dectectó una conexión diferente. Por favor, abra nuevamente la aplicación.'
        //                        })
        //                        .then(function (result) {
        //
        //                            ionic.Platform.exitApp();
        //                        });
        //
        //                }
        //            } else {
        //                window.localStorage.setItem("beforeState", states[networkState]);
        //
        //                checkConnection2();
        //            }
        //
        //
        //        }
        //
        //        var interval = $interval(function () {
        //            checkConnection();
        //        }, 5000);
        //
        //
        //
        //        function checkConnection2() {
        //
        //            // Check for network connection
        //            if (window.Connection) {
        //                if (navigator.connection.type == Connection.NONE) {
        //                    $interval.cancel(interval);
        //
        //                    $ionicPopup.alert({
        //                            title: 'No hay conexión a internet'
        //                            , content: 'Disculpe, no se detectó conexión a internet. Por favor, reconecte e intente de nuevo.'
        //                        })
        //                        .then(function (result) {
        //
        //                            ionic.Platform.exitApp();
        //                        });
        //                }
        //            }
        //        }



        if (window.localStorage.getItem("username") !== null && window.localStorage.getItem("password") !== null) {

            var user = window.localStorage.getItem("username");
            var pass = window.localStorage.getItem("password");

            LoginService.VerificarClave(pass, user).then(function (response) {

                if (response == false) {

                    $ionicLoading.show({
                        template: 'Se ha detectado un cambio de contraseña...'
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
                    }, 1500);
                }
            })

            $scope.idCuenta = window.localStorage.getItem("username");
            $scope.password = window.localStorage.getItem("password");


            window.localStorage.setItem("savelogin", "hide");

            $state.go('misNotificaciones', {
                idCuenta: $scope.idCuenta,

            });

        } else {
            window.localStorage.setItem("savelogin", "show");
        }

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


.controller('solicitudCuentaCtrl', function ($scope, $ionicPopup, FuncionesGlobales, SolicitudCuentaService, $ionicLoading, $stateParams, $ionicHistory, $state) {

    FuncionesGlobales.goLogin($scope, $state);

    //de prueba
    //$scope.rutPersona = "11343475-9";
    //$scope.rutEmpresa = "76005567-0";

    // función para verificar que la persona exista y este asociada a la empresa
    $scope.verificarPersonaEmpresa = function () {

        if ($scope.rutPersona == null || $scope.rutPersona == '') // si el campo es vacío
        {
            $ionicPopup.alert({
                title: 'Campo Vacío'
                , template: 'Por favor, ingrese el Rut de Persona'
            });
            return;
        }
        if ($scope.rutEmpresa == null || $scope.rutEmpresa == '') // si el campo es vacío
        {
            $ionicPopup.alert({
                title: 'Campo Vacío'
                , template: 'Por favor, ingrese el Rut de Empresa'
            });
            return;
        }

        $ionicLoading.show({
            template: 'Verificando...'
        });

        SolicitudCuentaService.ObtenerDatosPersona($scope.rutPersona, $scope.rutEmpresa).then(function (response) {
            $ionicLoading.hide();

            if (response.Resultado) {

                if (response.Resultado == 'Cliente o Empresa ingresada no encontrada') {
                    $ionicPopup.alert({
                        title: 'Cliente no encontrado'
                        , template: 'Rut de Persona o Empresa no encontrado.'
                    });
                }


                if (response.Resultado == 'Cliente solicitante no está asociado a la Empresa ingresada') {
                    $ionicPopup.alert({
                        title: 'Cliente no asociado'
                        , template: 'Persona solicitante no está asociado a la Empresa ingresada.'
                    });
                }

                if (response.Resultado == 'Cliente solicitante no está habilitado para solicitar una cuenta') {
                    $ionicPopup.alert({
                        title: 'Cliente no habilitado'
                        , template: 'Persona solicitante no está habilitada para solicitar una cuenta.'
                    });
                }

                if (response.Resultado == 'Ya existe una cuenta para el Cliente solicitante') {
                    $ionicPopup.alert({
                        title: 'Cliente ya existe'
                        , template: 'Ya existe una cuenta para la Persona solicitante.'
                    });
                }

            } else {

                $state.go('solicitudCuenta2', {
                    Nombre: response.Nombre
                    , Domicilio: response.Domicilio
                    , Correo: response.Correo
                    , Fono: response.Fono
                    , IdPersona: response.IdPersona
                    , RutEmpresa: response.RutEmpresa
                });

            }
        });



    }
})

.controller('solicitudCuenta2Ctrl', function ($scope, $ionicPopup, FuncionesGlobales, SolicitudCuentaService, $ionicLoading, $stateParams, $ionicHistory, $state, $stateParams) {


    FuncionesGlobales.goLogin($scope, $state);

    if ($stateParams.Nombre) {
        $scope.Nombre = $stateParams.Nombre;
    }
    if ($stateParams.Domicilio) {
        $scope.Domicilio = $stateParams.Domicilio;
    }
    if ($stateParams.Correo) {
        //$scope.Correo = $stateParams.Correo;
    }
    if ($stateParams.Fono) {
        //$scope.Fono = $stateParams.Fono;
    }
    if ($stateParams.IdPersona) {
        $scope.IdPersona = $stateParams.IdPersona;
    }
    if ($stateParams.RutEmpresa) {
        $scope.RutEmpresa = $stateParams.RutEmpresa;
    }

    SolicitudCuentaService.ObtenerPerfiles().then(function (response) {

        var i = 0;
        var array = [];
        while (i < response.length) {

            array.push({
                id: response[i].Id
                , nombre: response[i].Nombre
            });

            if (response[i].Nombre == 'Trabajador') {
                $scope.selectedItem = array[i];
            }
            i++;
        }
        $scope.items = array;

    });


    // funcion que permite generar una solicitud de cuenta
    $scope.generarSolicitud = function () {


        if ($scope.Cuenta == null || $scope.Cuenta == '') // si el campo es vacío
        {
            $ionicPopup.alert({
                title: 'Campo Vacío'
                , template: 'Por favor, ingrese un nombre de Cuenta'
            });
            return;
        }

        if ($scope.Correo == null || $scope.Correo == '') {
            $scope.Correo = '';
        }

        if ($scope.Fono == null || $scope.Fono == '') {
            $scope.Fono = '';
        }

        if ($scope.Comentario == null || $scope.Comentario == '') {
            $scope.Comentario = '';
        }

        $ionicLoading.show({
            template: 'Verificando...'
        });

        var PerfilID = $scope.selectedItem.id;

        SolicitudCuentaService.GenerarSolicitudCuenta($scope.IdPersona, $scope.RutEmpresa, $scope.Cuenta, $scope.Correo, $scope.Fono, PerfilID, $scope.Comentario).then(function (response) {

            $ionicLoading.hide();


            if (response != 'Ingreso correcto.') {
                if (response == 'No se puede enviar su solicitud.') {
                    $ionicPopup.alert({
                        title: 'Error de Solicitud'
                        , template: 'Hubo un error al crear la solicitud de Cuenta.'
                    });
                }

                if (response == 'Hubo un error al ingresar la contraseña.') {
                    $ionicPopup.alert({
                        title: 'Error de Contraseña'
                        , template: 'Hubo un error al generar la contraseña.'
                    });
                }
                if (response == 'Hubo un error al crear la auditoria para esta solicitud.') {
                    $ionicPopup.alert({
                        title: 'Error de Auditoria'
                        , template: 'Hubo un error al crear la auditoria para la solicitud generada.'
                    });
                }

            } else {
                $ionicPopup.alert({
                    title: 'Solicitud de Cuenta'
                    , template: 'La Solicitud ha sido enviada Correctamente.'
                }).then(function (res) {

                    $state.go('conectarse');

                });
            }
        });

    }

})