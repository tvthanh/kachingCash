(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'advertiserManagementDetailCtrl', [
            '$scope',
            '$state',
            '$q',
            'advertiserOrganizationManagementService',
            'kachingZonesHelpers',
            'utils',
        function (
            $scope,
            $state,
            $q,
            advertiserOrganizationManagementService,
            kachingZonesHelpers,
            utils
        ) {
            var service = advertiserOrganizationManagementService;
            var helpers = kachingZonesHelpers;
            var advertiserId = $state.params.id;

            $scope.statusAdvertisers = service.getStatus();
            $scope.statusAdvertiser = $scope.statusAdvertisers[0] || undefined;
            $scope.goToAdvertiseList = goToAdvertiseList;
            $scope.saveAdvertiseDetail = saveAdvertiseDetail;
            $scope.createAdvertisement = createAdvertisement;
            $scope.data = {};
            $scope.view = {
                busy: true,
                submitted: false
            }

            $scope.fieldHasError = utils.fieldHasError;

            if (!$state.params.id) {
                var currentDate = moment().utc().valueOf();
                $scope.data.date_joined = moment(currentDate).format('YYYY-MM-DD hh:mm');
                $scope.data.status = $scope.statusAdvertiser.label;
            }

            $scope.daterange = {
                dates: {
                    startDate: null,
                    endDate: null
                },
                min: moment().format('YYYY-MM-DD'),
                display: 'Select date range'
            };

            $scope.$watch('daterange.dates', function(newValue, oldValue) {
                if ( newValue === null ) {
                    return;
                }
                if (newValue.startDate) {
                    $scope.daterange.display = newValue.startDate.format('YYYY-MM-DD') + ' - ' + newValue.endDate.format('YYYY-MM-DD');
                }
            });

            function goToAdvertiseList() {
                $state.go('kaching.advertiserOrganizationManagement');
            }

            $scope.getAdvertiserDetail = function() {
                service.getAdvertiserDetail(advertiserId).then(
                    (data) => {
                        $scope.data = data;
                        $scope.data.status = _.findWhere($scope.statusAdvertisers, {value:data.status});
                        if ($scope.locations) {
                            $scope.data.country = _.findWhere($scope.locations, {id: data.country});
                        }
                        $scope.data.date_joined = data.date_joined ? moment(data.date_joined).format('YYYY-MM-DD hh:mm') : '-';
                        $scope.view.busy = false;
                    },
                    (error) => {
                        console.log(error);
                        $scope.view.busy = false;
                    }
                );
            }

            function saveAdvertiseDetail() {
                $scope.view.submitted = true;
                if ($scope.form1.$valid) {
                    var dataItem = $scope.data;
                    var data = {
                        id:  dataItem.id ? dataItem.id : '',
                        name: $scope.data.name,
                        email: $scope.data.email,
                        country: $scope.data.country.id,
                        address: $scope.data.address,
                        city: $scope.data.city,
                        status: $scope.data.status.value,
                    };
                    $scope.view.busy = true;
                    service.updateAdvertiserDetail(data).then((response) => {
                        helpers.alert('success', 'Business has been updated.');
                        $state.go('kaching.advertiserOrganizationManagement', { updatingId: data.id });
                        $scope.view.busy = false;
                    }, (error) => {
                        $scope.view.busy = false;
                        helpers.alert('danger', 'Business has not been updated.');
                    });
                }
            }

            function createAdvertisement() {
                $scope.view.submitted = true;
                if ($scope.form1.$valid) {
                    var data = {
                        name: $scope.data.name,
                        email: $scope.data.email,
                        country: $scope.data.country.id,
                        address: $scope.data.address,
                        city: $scope.data.city,
                        // date: $scope.data.date_joined,
                        status: $scope.statusAdvertiser.value
                    };
                    $scope.view.busy = true;
                    service.createAdvertisement(data).then((response) => {
                        helpers.alert('success', 'Business has been created.');
                        $state.go('kaching.advertiserOrganizationManagement');
                        $scope.view.busy = false;
                    }, (error) => {
                        $scope.view.busy = false;
                        helpers.alert('danger', 'Business has not been created.');
                    });
                }
            }

            function init() {
                service.getCountryList().then(
                    (data) => {
                        $scope.locations = data;
                        if ($state.params.id) {
                            $scope.getAdvertiserDetail();
                        }
                        $scope.view.busy = false;
                    },
                    (error) => {
                        if ($state.params.id) {
                            $scope.getAdvertiserDetail();
                        }
                        $scope.view.busy = false;
                    }
                );
            };

            init();

        }]);
})();
