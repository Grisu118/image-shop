/**
 * Created by benjamin on 22.03.2016.
 */
angular.module('imageShopAdm.size', [])

    .config(['$stateProvider', '$urlRouterProvider',  function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('sizes', {
                url: '/sizes',
                templateUrl: "views/adm/size/size.html",
                controller: 'SizeCtrl as ctrl',
                data: {
                    permissions: {
                        except: ['anonymous'],
                        redirectTo: 'auth'
                    }
                }
            })
    }])

    .controller('SizeCtrl', ['$state', '$http', '$rootScope', '$uibModal', '$location', function ($state, $http, $rootScope, $uibModal, $location) {
        var vm = this;

        this.getSize = function () {
            $http.get('api/sizes').then(function (response) {
                if (response.data.error) {
                    alert("Error");
                } else {
                    vm.sizes = response.data.data;
                }
            }, function (response) {
                alert("Failure");
            });
        };

        var init = function () {
            vm.getSize();
        };

        init();

        this.delete = function (id) {
            if (confirm('Delete Size ' + id + '?')) {
                $http.delete('api/sizes/' + id).then(function (response) {
                    vm.getSize();
                }, function (response) {
                    console.log(response);
                });
            }
        };

        this.openCreateSizeModal = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'views/adm/size/createSizeDialog.html',
                controller: 'SizeDetailDialogController as ctrl'
            });

            modalInstance.size = {
                text: null,
                price: ''
            };

            modalInstance.result.then(function (size) {
                var config = {
                    headers: {
                        'Content-Type': 'application/json;'
                    }
                };

                $http.post('api/sizes', size, config).then(function (response) {
                    if (response.status == 201) {//Created
                        vm.getSize();
                    }
                }, function (response) {
                    console.log(response);
                });
            });
        };

        this.openEditSizeModal = function (id) {

            $http.get('api/sizes/' + id).then(function (response) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'views/adm/size/createSizeDialog.html',
                    controller: 'SizeDetailDialogController as ctrl'
                });
                response.data.price = parseFloat(response.data.price);
                modalInstance.size = response.data;

                modalInstance.result.then(function (size) {
                    var config = {
                        headers: {
                            'Content-Type': 'application/json;'
                        }
                    };

                    $http.put('api/sizes/' + id, size, config).then(function (response) {
                        if (response.status == 200) {//Updated
                            vm.getSizes();
                        }
                    }, function (response) {
                        console.log(response);
                    });
                });
            });
        };

    }]).controller('SizeDetailDialogController',
    ['$uibModalInstance', function ($uibModalInstance) {


        this.size = $uibModalInstance.size;

        this.ok = function () {
            $uibModalInstance.close(this.size);
        };

        this.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]).directive('sizeElement', function () {
        return {
            restrict: 'A',
            templateUrl: 'views/adm/size/listelement.html',
            scope: {
                size: '=size',
                controller: '=controller'
            }
        };
    });
