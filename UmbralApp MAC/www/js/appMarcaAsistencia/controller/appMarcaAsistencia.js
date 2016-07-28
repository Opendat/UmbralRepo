'use strict';

angular.module('appMarcaAsistencia.module').controller('appMarcaAsistenciaCtrl', function ($scope, $stateParams, RegistroAsistenciaService, $ionicPlatform, $ionicPopup, $ionicLoading, $ionicHistory, $cordovaGeolocation, $cordovaBarcodeScanner, $state, $ionicSideMenuDelegate, MenuOpcionesFunction, MenuDinamicoService, PushNotificationService, FuncionesGlobales) {


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


    FuncionesGlobales.toogleRight($scope, $state, $ionicSideMenuDelegate, MenuDinamicoService, PushNotificationService, $scope.idCuenta, $ionicLoading, MenuOpcionesFunction);

    FuncionesGlobales.cerrarSesion($scope, $ionicLoading, $ionicHistory, $state);

    FuncionesGlobales.actualizarVista($scope, $state);
    
    FuncionesGlobales.goHome($scope, $state);


    $ionicLoading.show({
        template: 'Cargando...'
    });



    //busco la ubicacion geografica.
    var posOptions = {
        timeout: 3000
        , enableHighAccuracy: true
    };

//    $ionicLoading.hide();
//
//    ProcesoBusquedaReglas($scope.idCuenta);

        //se verifica que el dispositivo tengo habilitado el GPS.
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            
            $ionicLoading.hide();
    
            ProcesoBusquedaReglas($scope.idCuenta);
    
        }, function (err) {
            $ionicLoading.hide();
            //$scope.showIni = false;
            $ionicPopup.alert({
                title: 'Error en GeoLocalización'
                , template: 'No es posible obtener la posición geográfica para su registro.<br>Favor revisar conexión y revisar activación de geolocalización de su dispositivo.'
            });
    
            volverMisNotificaciones();
    
        });

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
        for (var i = 0; i < $scope.VERIFICACIONES.length; i++) {
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
                var loc = lat + " " + long;

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


})