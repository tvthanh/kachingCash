(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'userManagementDetailCtrl', [
            '$scope',
            '$state',
            '$stateParams',
            '$q',
            'FileUploader',
            'kachingZonesHelpers',
            'userManagementService',
            'advertiserOrganizationManagementService',
            'utils',
        function (
            $scope,
            $state,
            $stateParams,
            $q,
            FileUploader,
            kachingZonesHelpers,
            userManagementService,
            advertiserOrganizationManagementService,
            utils
        ) {
            var service = userManagementService;
            var advertiserService = advertiserOrganizationManagementService;
            var helpers = kachingZonesHelpers;
            var userID = $stateParams.id;

            $scope.view = {
                busy: true,
                submitted: false
            }

            $scope.fieldHasError = utils.fieldHasError;

            $scope.data = {
                first_name: '',
                last_name: '',
                email: '',
                avatar: undefined
            };

            $scope.statusUsers = service.getStatus();
            $scope.statusUser = $scope.statusUsers[0] || undefined;
            $scope.goToUserList = goToUserList;
            $scope.saveUserDetail = saveUserDetail;
            $scope.createUser = createUser;
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

            if (!$stateParams.id) {
                $scope.data.status = $scope.statusUser.label;
            }

            $scope.profileImageUploader = new FileUploader();

            $scope.previewImage = function(event) {
                var imageFile = event.target.files[0];
                if (imageFile) {
                    var reader = new FileReader();
                    reader.readAsDataURL(imageFile);
                    reader.addEventListener('load', function() {
                        angular.element('#profileImage').css('background-image', 'url(' + reader.result + ')');
                    });

                    $scope.data.avatar = imageFile;
                }
            };

            function getCompanyList() {
                advertiserService.getAdvertiserOrganizationList({page: 1, page_size: 999999999}).then(
                    function getSuccessfully(data) {
                        $scope.companyList = [];
                        $scope.companyList = data.results.map(function(item) {
                            return {
                                id: item.id,
                                name: item.name
                            }
                        })
                    },
                    function getFailingly(err) {
                        console.error(err);
                    }
                );
            }

            function getUserDetail() {
                $scope.view.busy = true;
                service.getUserDetail(userID).then(
                    function getSuccessfully(data) {
                        $scope.data = data;
                        $scope.data.status = _.findWhere($scope.statusUsers, {value: data.status});
                        angular.element('#profileImage').css('background-image', 'url(' + $scope.data.avatar + ')');
                        $scope.data.date_joined = moment(data.date_joined).format('YYYY-MM-DD hh:mm');
                        if ($scope.locations) {
                            $scope.data.country = _.findWhere($scope.locations, {id: data.country});
                        }
                        $scope.view.busy = false;
                    },
                    function getFailingly(err) {
                        console.error(err);
                        $scope.view.busy = false;
                    }
                );
            }

            function saveUserDetail() {
                $scope.view.submitted = true;
                if ($scope.form1.$valid) {
                    var dataItem = $scope.data;
                    var data = {
                        id: dataItem.id ? dataItem.id : '',
                        first_name: $scope.data.first_name,
                        last_name: $scope.data.last_name,
                        email: $scope.data.email,
                        address: $scope.data.address,
                        country: $scope.data.country.id,
                        city: $scope.data.city,
                        postal_code: $scope.data.postal_code,
                        status: $scope.data.status.value
                    };
                    if ($scope.data.avatar && typeof($scope.data.avatar) === 'object') {
                        data.avatar = $scope.data.avatar;
                    }
                    $scope.view.busy = true;
                    service.saveUserDetail(data).then((response) => {
                        $scope.view.busy = false;
                        helpers.alert('success', 'User has been updated.');
                        $state.go('kaching.userManagement', { updatingId: data.id });
                    }, (error) => {
                        $scope.view.busy = false;
                        helpers.alert('danger', 'User has not been updated.');
                    });
                }
            }

            function createUser() {
                $scope.view.submitted = true;
                if ($scope.form1.$valid) {
                    var data = {
                        first_name: $scope.data.first_name,
                        last_name: $scope.data.last_name,
                        email: $scope.data.email,
                        password: $scope.data.password,
                        address: $scope.data.address,
                        country: $scope.data.country.id,
                        city: $scope.data.city,
                        postal_code: $scope.data.postal_code,
                        status: $scope.statusUser.value,
                        advertiser: $scope.data.company.id
                    };
                    if ($scope.data.avatar && typeof($scope.data.avatar) === 'object') {
                        data.avatar = $scope.data.avatar;
                    }
                    $scope.view.busy = true;
                    service.createUser(data).then((response) => {
                        $scope.view.busy = false;
                        helpers.alert('success', 'User has been created.');
                        $state.go('kaching.userManagement');
                    }, (error) => {
                        $scope.view.busy = false;
                        helpers.alert('danger', 'User has not been created.');
                    });
                }
            }

            function goToUserList() {
                $state.go('kaching.userManagement');
            }

            var init = function() {
                service.getCountryList().then(
                    (data) => {
                        $scope.locations = data;
                        if ($stateParams.id) {
                            getUserDetail();
                        } else {
                            getCompanyList();
                        }
                        $scope.view.busy = false;
                    },
                    (error) => {
                        if ($stateParams.id) {
                            getUserDetail();
                        } else {
                            getCompanyList();
                        }
                        $scope.view.busy = false;
                    }
                );
            };

            init();

        }]);
})();
