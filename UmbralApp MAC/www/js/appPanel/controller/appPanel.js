'use strict';

angular.module('appPanel.module').controller('appPanelCtrl', function ($scope, $injector, $ionicLoading, $stateParams, $ionicHistory, $state, $ionicSideMenuDelegate, MenuOpcionesFunction, MenuDinamicoService, PushNotificationService, $ionicPopover
    , $ionicPopup, $timeout, $ionicScrollDelegate, FuncionesGlobales) {


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


    // funcion que se ejecuta al hacer click sobre un elemento de resumen de conciliacion
    $scope.openPopover = function ($event, fecha_origen, fecha_texto) {

        // cargando
        $ionicLoading.show({
            template: 'Cargando...'
        });

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

                        $ionicLoading.hide();

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