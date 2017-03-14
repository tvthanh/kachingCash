(function($){
'use strict';

(function () {
    'use strict';

    angular.module('kachingCore', ['underscore', 'ngSanitize', 'ngAnimate', 'ngCookies', 'ui.router', 'mgcrea.ngStrap', 'oc.lazyLoad', 'highcharts-ng', 'daterangepicker', 'angularFileUpload', 'ui.bootstrap']);

    angular.module('kachingCore').constant('apiUrl', kachingAppConfig.apiUrl).constant('sessionDays', 30).config(['$stateProvider', '$urlRouterProvider', 'highchartsNGProvider', '$locationProvider', function config($stateProvider, $urlRouterProvider, highchartsNGProvider, $locationProvider) {
        $stateProvider.state('login', {
            url: '/login',
            templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/login/login-layout.html',
            controller: 'loginCtrl'
        }).state('activate', {
            url: '/activate/?uid&token',
            templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/activate/activate-layout.html'
        }).state('resetPassword', {
            url: '/reset-password/?uid&token',
            templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/reset-password/reset-password-layout.html'
        });
    }]).controller('kachingCoreCtrl', ['$scope', '$rootScope', '$ocLazyLoad', '$urlRouter', '$modal', '$window', 'authService', '$state', '$alert', function ($scope, $rootScope, $ocLazyLoad, $urlRouter, $modal, $window, authService, $state, $alert) {

        $rootScope.online = navigator.onLine;
        $window.addEventListener('offline', function () {
            $rootScope.$apply(function () {
                $rootScope.online = false;
            });
        }, false);

        $window.addEventListener('online', function () {
            $rootScope.$apply(function () {
                $rootScope.online = true;
            });
        }, false);

        $scope.$watch('online', function (status) {
            if (status || status === 'true') {} else {
                $alert({
                    title: '',
                    content: 'Please check your network connection!',
                    container: '#alerts-container',
                    placement: 'top-right',
                    duration: 5,
                    type: 'danger',
                    show: true
                });
            }
        });

        $rootScope.kachingAppConfig = kachingAppConfig;

        if (kachingAppConfig.isHomePage === true && authService.isLoggedIn()) {
            $window.location.href = kachingAppConfig.panelUrl;
        } else if (kachingAppConfig.isPanelPage === true) {
            $scope.isPanelPage = true;
            $ocLazyLoad.load(kachingAppConfig.wpTemplateUri + '/dist/js/panelApp.js').then(function (panelApp) {
                $urlRouter.sync();
            });
        } else {
            $state.go('login');
        }

        $scope.showSignupDialog = function () {
            $modal({
                templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/login/templates/signup-modal-tmpl.html',
                controller: 'signupModalCtrl',
                animation: 'am-fade-and-scale',
                placement: 'center'
            });
        };
    }]);

    angular.module('kachingCore').directive('enterPress', function () {
        return function (scope, element, attrs) {
            element.bind('keydown keypress', function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.enterPress);
                    });

                    event.preventDefault();
                }
            });
        };
    });
})();
'use strict';

(function () {
    'use strict';

    angular.module('kachingCore').controller('loginCtrl', ['$scope', '$alert', '$modal', '$state', '$window', 'authService', 'utils', function ($scope, $alert, $modal, $state, $window, authService, utils) {

        $scope.view = {
            busy: false,
            formError: false
        };

        $scope.loginFormData = {
            email: '',
            password: ''
        };

        $scope.signinFormSubmit = function () {

            $scope.view.busy = true;
            $scope.view.formError = false;

            authService.login($scope.loginFormData.email, $scope.loginFormData.password).then(function (user) {
                $scope.view.busy = false;
                $window.location.href = kachingAppConfig.panelUrl;
            }, function () {
                $scope.view.busy = false;
                $scope.view.formError = true;
            });
        };

        $scope.showSignupDialog = function () {
            $modal({
                templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/signup/signup-tmpl.html',
                controller: 'signupModalCtrl',
                animation: 'am-fade-and-scale',
                // placement: 'center',
                backdrop: 'static'
            });
        };

        $scope.showForgotPasswordDialog = function () {
            $modal({
                templateUrl: templateDirUri + '/assets/kaching/forgot-password/forgot-password-tmpl.html',
                controller: 'forgotPasswordModalCtrl',
                animation: 'am-fade-and-scale',
                // placement: 'center'
                backdrop: 'static'
            });
        };
    }]);
})();
'use strict';

(function () {
    'use strict';

    angular.module('kachingCore').controller('signupModalCtrl', ['$scope', '$rootScope', 'errorHandler', '$modal', 'utils', 'userService', 'FileUploader', function ($scope, $rootScope, errorHandler, $modal, utils, userService, FileUploader) {
        $scope.view = {
            sending: false,
            submitted: false,
            success: false
        };

        $scope.data = {
            firstName: '',
            lastName: '',
            email: '',
            company: '',
            password: '',
            avatar: undefined
        };

        $scope.view.signupSuccess = false;

        $scope.changeTooltipClass = function () {
            angular.element('.tooltip-inner').addClass('custom-tooltip-inner');
            angular.element('.tooltip-arrow').addClass('custom-tooltip-arrow');
        };

        $scope.fieldHasError = utils.fieldHasError;
        $scope.profileImageUploader = new FileUploader();

        $scope.previewImage = function (event) {
            var imageFile = event.target.files[0];
            if (imageFile) {
                var reader = new FileReader();
                reader.readAsDataURL(imageFile);
                reader.addEventListener('load', function () {
                    angular.element('#profileImage').css('background-image', 'url(' + reader.result + ')');
                });

                $scope.data.avatar = imageFile;
            }
        };

        $scope.showErrors = function () {
            return $scope.view.submitted;
        };

        $scope.clearCustomErrors = function () {
            $scope.form1.email.$setValidity('emailRegistered', true);
            $scope.form1.email.$setValidity('emailInvalid', true);
        };

        $scope.usertypeImgSrc = function (type) {
            var image = '';
            if (type === 'advertiser') {
                image = $scope.data.usertype === 1 ? 'ic_advertiser_fill.svg' : 'ic_advertiser.svg';
            }
            if (type === 'publisher') {
                image = $scope.data.usertype === 2 ? 'ic_publisher_fill.svg' : 'ic_publisher.svg';
            }
            return kachingAppConfig.wpTemplateUri + '/assets/images/' + image;
        };

        var hasEmailError = function hasEmailError(response) {
            var error = _.findWhere(response.data.errorDetails.paramsMistake.mistakenParams, { name: 'email' });
            if (typeof error !== 'undefined') {
                return true;
            } else {
                return false;
            }
        };

        $scope.signupFormSubmit = function () {
            $scope.view.submitted = true;
            if ($scope.form1.$valid) {
                switch ($scope.targetOption) {
                    case '1':
                        $scope.data.company_code = $scope.code;
                        break;
                    case '2':
                        $scope.data.company_code = 'demo';
                        break;
                    case '3':
                        $scope.data.company_code = 'temporary';
                        break;
                    default:

                }
                $scope.register();
            }
        };

        $scope.register = function () {
            userService.registerUser($scope.data).then(function (repsonse) {
                $scope.view.success = true;
                $scope.view.signupSuccess = true;
            }, function (response) {
                $scope.view.signupSuccess = false;
                $scope.view.success = false;
                $scope.view.sending = false;

                if (response.status === 400 && hasEmailError(response)) {
                    $scope.form1.email.$setValidity('emailRegistered', false);
                    $scope.view.sending = false;
                } else {
                    errorHandler.processApiResponse(response);
                    $scope.$hide();
                }
            });
        };

        $scope.showCodeError = function () {
            return $scope.data && $scope.targetOption == 1;
        };
    }]);
})();
'use strict';

(function () {
    'use strict';

    angular.module('kachingCore').controller('forgotPasswordModalCtrl', ['$scope', 'errorHandler', '$modal', 'utils', 'userService', function ($scope, errorHandler, $modal, utils, userService) {

        $scope.fieldHasError = utils.fieldHasError;

        $scope.view = {
            sending: false,
            submitted: false,
            success: false
        };

        $scope.data = {
            email: ''
        };

        $scope.showErrors = function () {
            return $scope.view.submitted;
        };

        $scope.formSubmit = function () {
            $scope.view.submitted = true;
            if ($scope.form1.$valid) {

                $scope.view.sending = true;

                userService.passwordResetRequest($scope.data.email).then(function (user) {
                    $scope.view.sending = false;
                    $scope.view.success = true;
                }, function (response) {
                    errorHandler.processApiResponse(response);
                    $scope.$hide();
                });
            }
        };

        $scope.showLoginDialog = function () {
            $scope.$hide();
            $modal({
                templateUrl: templateDirUri + '/assets/js/kaching-core/components/loginModal/modalTmpl.html',
                controller: 'loginModalCtrl',
                animation: 'am-fade-and-scale',
                placement: 'center'
            });
        };
    }]);
})();
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
    'use strict';

    angular.module('kachingCore').factory('utils', [function () {

        var fieldHasError = function fieldHasError(elScope, formName, fieldName, error) {
            var field;

            if (elScope.hasOwnProperty(formName) && _typeof(elScope[formName]) === 'object') {
                field = elScope[formName][fieldName];
            } else if (elScope.$parent.hasOwnProperty(formName) && _typeof(elScope.$parent[formName]) === 'object') {
                field = elScope.$parent[formName][fieldName];
            }

            if (typeof field === 'undefined') {
                return false;
            }

            if (typeof error !== 'undefined') {
                return field.$error[error] ? true : false;
            } else {
                return field.$invalid ? true : false;
            }
        };

        // Allow only 1 image and 1 video in the upload queue
        var cleanupUploaderQueue = function cleanupUploaderQueue(uploader) {
            var videoItems = [],
                audioItems = [],
                imageItems = [],
                wt3AndImageItems = [];
            angular.forEach(uploader.getNotUploadedItems(), function (item, index) {
                if (item.alias === 'video') {
                    videoItems.push({ queueIndex: index });
                } else if (item.alias === 'audio') {
                    audioItems.push({ queueIndex: index });
                } else if (item.alias === 'wt3AndImage') {
                    wt3AndImageItems.push({ queueIndex: index });
                } else {
                    imageItems.push({ queueIndex: index });
                }
            });
            if (videoItems.length > 1) {
                uploader.removeFromQueue(videoItems[0].queueIndex);
            }
            if (audioItems.length > 1) {
                uploader.removeFromQueue(audioItems[0].queueIndex);
            }
            if (imageItems.length > 1) {
                uploader.removeFromQueue(imageItems[0].queueIndex);
            }
            if (wt3AndImageItems.length > 1) {
                uploader.removeFromQueue(wt3AndImageItems[0].queueIndex);
            }
        };

        var addUploaderTypeFilter = function addUploaderTypeFilter(uploader, alias, filter) {
            var name = Object.keys(filter)[0];
            var acceptedTypes = filter[name];
            uploader.filters.push({
                name: name,
                fn: function fn(file, uploaderItem) {
                    if (uploaderItem.alias !== alias) {
                        return true;
                    }
                    if (acceptedTypes.indexOf(file.type) === -1) {
                        return false;
                    } else {
                        return true;
                    }
                }
            });
        };

        // URL validation regex based on the Django URL validator used in the backend
        //   Differences:
        //     - scheme has been made optional
        //     - there is no check for the dashes at the end of domain name and tld (due to lack of support for lookbehind in JS)
        var urlRegex = function urlRegex() {

            var ul = '\\u00a1-\\uffff'; // unicode letters range (must be a unicode string, not a raw string)

            // IP patterns
            var ipv4_re = '(?:25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)){3}';
            var ipv6_re = '([0-9a-f:\\.]+)'; // (simple regex, validated later)

            // Host patterns
            var hostname_re = '[a-z' + ul + '0-9](?:[a-z' + ul + '0-9-]{0,61}[a-z' + ul + '0-9])?';

            // Max length for domain name labels is 63 characters per RFC 1034 sec. 3.1
            var domain_re = '(?:\\.(?!-)[a-z' + ul + '0-9-]{1,63})*';

            // Original was (with lookbehind):
            // domain_re = r'(?:\.(?!-)[a-z' + ul + r'0-9-]{1,63}(?<!-))*'

            var tld_re = '';
            tld_re += '\\.'; // dot
            tld_re += '(?!-)'; // can't start with a dash
            tld_re += '(?:[a-z' + ul + '-]{2,63}'; // domain label
            tld_re += '|xn--[a-z0-9]{1,59})'; // or punycode label
            // tld_re += '(?<!-)';                            // can't end with a dash (lookbehind...)
            tld_re += '\\.?'; // may have a trailing dot

            var host_re = '(' + hostname_re + domain_re + tld_re + '|localhost)';

            var regex = '';
            regex += '^(?:(?:[a-z0-9\\.\\-\\+]*):\\/\\/)?'; // scheme. This is one big diffrence from the backend validation - scheme is optional
            regex += '(?:\\S+(?::\\S*)?@)?'; // user:pass authentication
            regex += '(?:' + ipv4_re + '|' + ipv6_re + '|' + host_re + ')';
            regex += '(?::\\d{2,5})?'; // port
            regex += '(?:[/?#][^\\s]*)?'; // resource path
            regex += '$';

            return new RegExp(regex, 'i');
        };

        var campaignId = undefined;

        var getCampaignId = function getCampaignId() {
            return campaignId;
        };

        var setCampaignId = function setCampaignId(value) {
            campaignId = value;
        };

        var viewDetail = false;

        var getViewDetail = function getViewDetail() {
            return viewDetail;
        };

        var setViewDetail = function setViewDetail(value) {
            viewDetail = value;
        };

        var helper = {
            isImage: function isImage(url) {
                var type = '|' + url.slice(url.lastIndexOf('.') + 1) + '|';
                return '|jpg|png|jpeg|'.indexOf(type) !== -1;
            },
            isAudio: function isAudio(url) {
                var type = '|' + url.slice(url.lastIndexOf('.') + 1) + '|';
                return '|mp3|'.indexOf(type) !== -1;
            },
            isVideo: function isVideo(url) {
                var type = '|' + url.slice(url.lastIndexOf('.') + 1) + '|';
                return '|mkv|flv|vob|ogv|ogg|avi|wmv|mpg|m4v|mp4|mov|'.indexOf(type) !== -1;
            },
            isWikiTude: function isWikiTude(url) {
                var type = '|' + url.slice(url.lastIndexOf('.') + 1) + '|';
                return '|wt3|'.indexOf(type) !== -1;
            }
        };

        var getArType = function getArType(url) {
            if (helper.isImage(url)) {
                return 'image';
            }
            if (helper.isAudio(url)) {
                return 'audio';
            }
            if (helper.isVideo(url)) {
                return 'video';
            }
            if (helper.isWikiTude(url)) {
                return 'wikitude';
            }
            return false;
        };

        return {
            fieldHasError: fieldHasError,
            cleanupUploaderQueue: cleanupUploaderQueue,
            addUploaderTypeFilter: addUploaderTypeFilter,
            urlRegex: urlRegex,
            getCampaignId: getCampaignId,
            setCampaignId: setCampaignId,
            getArType: getArType,
            setViewDetail: setViewDetail,
            getViewDetail: getViewDetail
        };
    }]);
})();
'use strict';

(function () {
    'use strict';

    angular.module('kachingCore').controller('forgotPasswordModalCtrl', ['$scope', 'errorHandler', '$modal', 'utils', 'userService', function ($scope, errorHandler, $modal, utils, userService) {

        $scope.fieldHasError = utils.fieldHasError;

        $scope.view = {
            sending: false,
            submitted: false,
            success: false
        };

        $scope.data = {
            email: ''
        };

        $scope.showErrors = function () {
            return $scope.view.submitted;
        };

        $scope.formSubmit = function () {
            $scope.view.submitted = true;
            if ($scope.form1.$valid) {

                $scope.view.sending = true;

                userService.passwordResetRequest($scope.data.email).then(function (user) {
                    $scope.view.sending = false;
                    $scope.view.success = true;
                }, function (response) {
                    errorHandler.processApiResponse(response);
                    $scope.$hide();
                });
            }
        };

        $scope.showLoginDialog = function () {
            $scope.$hide();
            $modal({
                templateUrl: 'kaching-core/components/loginModal/modalTmpl.html',
                controller: 'loginModalCtrl',
                animation: 'am-fade-and-scale',
                placement: 'center'
            });
        };
    }]);
})();
'use strict';

(function () {
    'use strict';

    angular.module('kachingCore').controller('resetPasswordModalCtrl', ['$scope', 'errorHandler', '$modal', 'utils', 'userService', function ($scope, errorHandler, $modal, utils, userService) {

        $scope.fieldHasError = utils.fieldHasError;

        $scope.view = {
            sending: false,
            submitted: false,
            success: false
        };

        $scope.data = {
            newPassword: '',
            newPasswordRepeat: '',
            token: kachingAppConfig.resetPassword.token,
            uid: kachingAppConfig.resetPassword.uid
        };

        $scope.showErrors = function () {
            return $scope.view.submitted;
        };

        $scope.formSubmit = function () {
            $scope.view.submitted = true;
            if ($scope.form1.$valid) {

                $scope.view.sending = true;

                userService.passwordReset($scope.data.newPassword, $scope.data.uid, $scope.data.token).then(function () {
                    $scope.view.sending = false;
                    $scope.view.success = true;
                }, function (response) {
                    errorHandler.processApiResponse(response);
                    $scope.$hide();
                });
            }
        };

        $scope.showLoginDialog = function () {
            $scope.$hide();
            $modal({
                templateUrl: templateDirUri + '/assets/js/kaching-core/components/loginModal/modalTmpl.html',
                // templateUrl: 'kaching-core/components/loginModal/modalTmpl.html',// from master
                controller: 'loginModalCtrl',
                animation: 'am-fade-and-scale',
                placement: 'center'
            });
        };
    }]);
})();
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
    'use strict';

    angular.module('kachingCore').factory('apiService', ['$http', '$cookies', '$q', '$window', 'apiUrl', 'authToken', function ($http, $cookies, $q, $window, apiUrl, authToken) {

        return {
            get: getRequest,
            put: putRequest,
            post: postRequest,
            patch: patchRequest,
            delete: deleteRequest,
            postMultiPart: postMultiPart,
            patchMultiPart: patchMultiPart
        };

        function makeRequest(method, path, data, authRequired) {

            var deferred = $q.defer();

            var request = {
                method: method,
                url: apiUrl + path
            };

            if (data) {
                if (method === 'GET') {
                    request.params = data;
                } else {
                    request.data = data;
                }
            }

            if (authRequired) {
                request.headers = {
                    'Authorization': 'Token ' + authToken.get(true)
                };
            }

            $http(request).then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                if (response.status === 403 && request.url.match(/\/auth\/logout\/$/) === null) {
                    destroyCookies();
                    $window.location.href = kachingAppConfig.panelUrl + '#expired';
                }
                deferred.reject(response);
            });

            return deferred.promise;
        }

        function destroyCookies() {
            $cookies.remove('usertype', {
                path: '/'
            });
            authToken.delete();
        }

        function getRequest(path, data, authRequired) {
            data = (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' ? false : data;
            authRequired = authRequired === true ? true : false;
            return makeRequest('GET', path, data, authRequired);
        }

        function putRequest(path, data, authRequired) {
            data = (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' ? false : data;
            authRequired = authRequired === true ? true : false;
            return makeRequest('PUT', path, data, authRequired);
        }

        function postRequest(path, data, authRequired) {
            data = (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' ? false : data;
            authRequired = authRequired === true ? true : false;
            return makeRequest('POST', path, data, authRequired);
        }

        function patchRequest(path, data, authRequired) {
            data = (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' ? false : data;
            authRequired = authRequired === true ? true : false;
            return makeRequest('PATCH', path, data, authRequired);
        }

        function deleteRequest(path, data, authRequired) {
            data = (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' ? false : data;
            authRequired = authRequired === true ? true : false;
            return makeRequest('DELETE', path, data, authRequired);
        }

        function makeMultiPartRequest(method, path, data, authRequired) {

            var deferred = $q.defer();

            var request = {
                method: method,
                url: apiUrl + path,
                transformRequest: angular.identity
            };

            if (authRequired) {
                request.headers = {
                    'Content-Type': undefined,
                    'Authorization': 'Token ' + authToken.get(true)
                };
            } else {
                request.headers = {
                    'Content-Type': undefined
                };
            }

            var fd = new FormData();

            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    fd.append(key, data[key]);
                }
            }

            request.data = fd;

            $http(request).then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                if (response.status === 403 && request.url.match(/\/auth\/logout\/$/) === null) {
                    destroyCookies();
                    $window.location.href = kachingAppConfig.panelUrl + '#expired';
                }
                deferred.reject(response);
            });

            return deferred.promise;
        }

        function postMultiPart(path, data, authRequired) {
            data = (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' ? false : data;
            authRequired = authRequired === true ? true : false;
            return makeMultiPartRequest('POST', path, data, authRequired);
        }

        function patchMultiPart(path, data, authRequired) {
            data = (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' ? false : data;
            authRequired = authRequired === true ? true : false;
            return makeMultiPartRequest('PATCH', path, data, authRequired);
        }
    }]);
})();
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
    'use strict';

    angular.module('kachingCore').factory('apiUlabService', ['$http', '$cookies', '$q', '$window', 'ulabApiUrl', 'ulabService', function ($http, $cookies, $q, $window, ulabApiUrl, ulabService) {

        return {
            get: getRequest,
            put: putRequest,
            post: postRequest,
            patch: patchRequest,
            delete: deleteRequest
        };

        function makeRequest(method, path, data, authRequired) {

            var deferred = $q.defer();

            var request = {
                method: method,
                url: ulabApiUrl + path
            };

            if (data) {
                if (method === 'GET') {
                    request.params = data;
                } else {
                    request.data = data;
                    request.data.email = 'kachingmail@ulab.com';
                    request.data.password = '12345678';
                }
            }

            if (authRequired) {
                request.headers = {
                    'Accept': 'application/vnd.ulab.v0+json',
                    'Authorization': 'Bearer ' + ulabService.getUlabToken()
                };
            }

            $http(request).then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                if (response.status === 403 && request.url.match(/\/auth\/logout\/$/) === null) {
                    $window.location.href = kachingAppConfig.panelUrl + '#expired';
                }
                deferred.reject(response);
            });

            return deferred.promise;
        }

        function getRequest(path, data, authRequired) {
            data = (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' ? false : data;
            authRequired = authRequired === true ? true : false;
            return makeRequest('GET', path, data, authRequired);
        }

        function putRequest(path, data, authRequired) {
            data = (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' ? false : data;
            authRequired = authRequired === true ? true : false;
            return makeRequest('PUT', path, data, authRequired);
        }

        function postRequest(path, data, authRequired) {
            data = (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' ? false : data;
            authRequired = authRequired === true ? true : false;
            return makeRequest('POST', path, data, authRequired);
        }

        function patchRequest(path, data, authRequired) {
            data = (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' ? false : data;
            authRequired = authRequired === true ? true : false;
            return makeRequest('PATCH', path, data, authRequired);
        }

        function deleteRequest(path, data, authRequired) {
            data = (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' ? false : data;
            authRequired = authRequired === true ? true : false;
            return makeRequest('DELETE', path, data, authRequired);
        }
    }]);
})();
'use strict';

(function () {
    'use strict';

    angular.module('kachingCore').factory('ulabService', ['$http', '$cookies', '$q', function ($http, $cookies, $q) {

        var tokenInfo = null;

        return {
            getToken: getToken,
            requestUlabAuthToken: requestUlabAuthToken,
            saveUlabToken: saveUlabToken,
            deleteUlabToken: deleteUlabToken,
            getUlabToken: getUlabToken
        };

        function getToken(forceNew) {
            var deferred = $q.defer();

            requestAuthToken().then(function (token) {
                // saveToken(token, token.expires_in);
                deferred.resolve(token);
            }, function (error) {
                // deleteToken();
                deferred.reject();
            });

            return deferred.promise;
        }

        function requestAuthToken() {
            var deferred = $q.defer();

            var data = {
                client_id: 'kaching_2da03ec3',
                client_secret: '5c853e7535e265cef8ax92Ka',
                grant_type: 'client_credentials',
                scope: 'client_access'
            };

            var request = {
                method: 'POST',
                url: 'http://search.ulab.com/oauth2',
                headers: {
                    Accept: 'application/vnd.ulab.v0+json'
                },
                data: data
            };

            $http(request).then(function (result) {
                if (result.data.status_code === 200) {
                    tokenInfo = {
                        token_type: result.data.token_type,
                        expires_in: result.data.expires_in,
                        access_token: result.data.access_token
                    };
                    deferred.resolve(tokenInfo);
                } else {
                    deferred.reject();
                }
            }).catch(function (res) {
                deferred.reject();
            });

            return deferred.promise;
        }

        function requestUlabAuthToken() {
            var deferred = $q.defer();

            var data = {
                client_id: 'kaching_2da03ec3',
                client_secret: '5c853e7535e265cef8ax92Ka',
                grant_type: 'client_credentials',
                scope: 'client_access'
            };

            var request = {
                method: 'POST',
                url: 'http://search.ulab.com/oauth2',
                headers: {
                    Accept: 'application/vnd.ulab.v0+json'
                },
                data: data
            };

            $http(request).then(function (result) {
                if (result.data.status_code === 200) {
                    var token = {
                        name: result.data.token_type,
                        expires: result.data.expires_in,
                        value: result.data.access_token
                    };
                    deferred.resolve(token);
                } else {
                    deferred.reject();
                }
            }).catch(function (res) {
                deferred.reject();
            });

            return deferred.promise;
        }

        function saveUlabToken(token) {
            var now = new Date();
            now.setHours(now.getHours() + token.expires / 3600);
            var expires = now;
            $cookies.put(token.name, token.value, {
                path: '/',
                expires: expires
            });
        }

        function deleteUlabToken() {
            $cookies.remove('Bearer', {
                path: '/'
            });
        }

        function getUlabToken() {
            var token = $cookies.get('Bearer');
            if (token) {
                return token;
            } else {
                return false;
            }
        }
    }]);
})();
'use strict';

(function () {
    'use strict';

    angular.module('kachingCore').factory('authService', ['$q', '$cookies', 'utils', 'apiService', 'authToken', 'userService', 'sessionDays', 'ulabService', function ($q, $cookies, utils, apiService, authToken, userService, sessionDays, ulabService) {
        return {
            switchUserType: switchUserType,
            isLoggedIn: isLoggedIn,
            getUsertype: getUsertype,
            isAdvertiser: isAdvertiser,
            isDeveloper: isDeveloper,
            login: login,
            logout: logout
        };

        function switchUserType(type) {

            var expires = new Date();
            expires.setDate(expires.getDate() + sessionDays);

            if (type === 'advertiser') {
                if (isAdvertiser()) {
                    return false;
                }
                $cookies.put('usertype', 'advertiser', {
                    path: '/',
                    expires: expires
                });
                return true;
            } else if (type === 'developer') {
                if (isDeveloper()) {
                    return false;
                }
                $cookies.put('usertype', 'developer', {
                    path: '/',
                    expires: expires
                });
                return true;
            }
        }

        function parseUsertype(usertype) {
            usertype = parseInt(usertype);
            if (usertype === 1) {
                return 'advertiser';
            } else if (usertype === 2) {
                return 'developer';
            } else {
                return false;
            }
        }

        function isLoggedIn() {
            return authToken.get(true) !== false && typeof getUsertype() !== 'undefined' ? true : false;
        }

        function getUsertype() {
            return $cookies.get('usertype');
        }

        function isAdvertiser() {
            return getUsertype() === 'advertiser';
        }

        function isDeveloper() {
            return getUsertype() === 'developer';
        }

        function requestAuthToken(email, password) {

            var deferred = $q.defer();

            apiService.post('/api-token-auth/', {
                email: email,
                password: password
            }).then(function (response) {
                deferred.resolve(response.token);
            }, function (response) {
                deferred.reject(response);
            });

            return deferred.promise;
        }

        function login(email, password) {

            var deferred = $q.defer();

            $cookies.remove('usertype', {
                path: '/'
            });
            authToken.delete();
            ulabService.deleteUlabToken();

            requestAuthToken(email, password).then(function (token) {

                // var expires = new Date();
                // expires.setDate(expires.getDate() + sessionDays);
                var now = new Date();
                now.setHours(now.getHours() + 2);
                var expires = now;

                authToken.save(token, expires);

                userService.getUser().then(function (user) {
                    $cookies.put('usertype', 'advertiser', {
                        path: '/',
                        expires: expires
                    });
                    deferred.resolve(user);
                }, function () {
                    deferred.reject();
                });
            }, function () {
                deferred.reject();
            });

            ulabService.requestUlabAuthToken().then(function (ulabToken) {
                ulabService.saveUlabToken(ulabToken);
            });

            return deferred.promise;
        }

        function logout() {

            var deferred = $q.defer();

            apiService.post('/auth/logout/', false, true).finally(function () {
                $cookies.remove('usertype', {
                    path: '/'
                });
                authToken.delete();
                deferred.resolve();
            });

            ulabService.deleteUlabToken();

            return deferred.promise;
        }
    }]);
})();
'use strict';

(function () {
    'use strict';

    angular.module('kachingCore').factory('authToken', ['$cookies', function ($cookies) {
        var authToken;

        return {
            save: saveToken,
            delete: deleteToken,
            get: getToken
        };

        function saveToken(token, expires) {
            $cookies.put('token', token, {
                path: '/',
                expires: expires
            });
        }

        function deleteToken() {
            $cookies.remove('token', {
                path: '/'
            });
        }

        function getToken(forceCookieCheck) {

            if (authToken && !forceCookieCheck) {
                return authToken;
            }

            var token = $cookies.get('token');
            if (token) {
                authToken = token;
                return authToken;
            }

            return false;
        }
    }]);
})();
'use strict';

(function () {
    'use strict';

    angular.module('kachingCore').factory('userService', ['$q', 'apiService', function ($q, apiService) {

        var user;

        return {
            getUser: getUser,
            getBalance: getBalance,
            updateUser: updateUser,
            changePassword: changePassword,
            passwordResetRequest: passwordResetRequest,
            passwordReset: passwordReset,
            registerUser: registerUser,
            activateAccount: activateAccount,
            getCountries: getCountries
        };

        function getUser() {

            var deferred = $q.defer();

            apiService.get('/users/profile/', false, true).then(function (response) {
                user = {
                    id: response.id,
                    email: response.email,
                    firstName: response.first_name ? response.first_name : '',
                    lastName: response.last_name ? response.last_name : '',
                    company: response.company ? response.company : '',
                    country: response.country ? response.country.toString() : undefined,
                    city: response.city ? response.city : '',
                    address: response.address ? response.address : '',
                    postalCode: response.postal_code ? response.postal_code : '',
                    avatar: response.avatar
                };
                document.cookie = 'isStaff=' + response.is_staff + ';';
                deferred.resolve(user);
            }, function (response) {
                deferred.reject(response);
            });

            return deferred.promise;
        }

        function getBalance() {

            var deferred = $q.defer();

            apiService.get('/auth/me/balance/', false, true).then(function (response) {
                deferred.resolve(response);
            }, function (response) {
                deferred.reject(response);
            });

            return deferred.promise;
        }

        function updateUser(user) {

            var deferred = $q.defer();
            var data = {
                first_name: user.firstName,
                last_name: user.lastName,
                email: user.email,
                company: user.company,
                country: user.country,
                city: user.city,
                address: user.address,
                postal_code: user.postalCode,
                avatar: user.avatar
            };

            if (data.avatar) {
                apiService.patchMultiPart('/users/profile/', data, true).then(function (data) {
                    deferred.resolve(data);
                }, function (response) {
                    deferred.reject(response);
                });
            } else {
                apiService.patch('/users/profile/', data, true).then(function (data) {
                    deferred.resolve(data);
                }, function (response) {
                    deferred.reject(response);
                });
            }
            return deferred.promise;
        }

        function changePassword(currentPassword, newPassword) {

            var deferred = $q.defer();

            var data = {
                new_password: newPassword,
                current_password: currentPassword
            };

            apiService.post('/auth/password/', data, true).then(function (data) {
                deferred.resolve(data);
            }, function (response) {
                deferred.reject(response);
            });

            return deferred.promise;
        }

        function passwordResetRequest(email) {

            var deferred = $q.defer();

            var data = { email: email };

            apiService.post('/auth/password/reset/', data, false).then(function (data) {
                deferred.resolve(data);
            }, function (response) {
                deferred.reject(response);
            });

            return deferred.promise;
        }

        function passwordReset(password, uid, token) {

            var deferred = $q.defer();

            var data = {
                uid: uid,
                token: token,
                new_password: password
            };

            apiService.post('/auth/password/reset/confirm/', data, false).then(function (data) {
                deferred.resolve(data);
            }, function (response) {
                deferred.reject(response);
            });

            return deferred.promise;
        }

        function registerUser(user) {

            var deferred = $q.defer();

            var data = {
                first_name: user.firstName,
                last_name: user.lastName,
                email: user.email,
                company: user.company,
                password: user.password,
                groups: 1,
                company_code: user.company_code
            };

            if (user.avatar) {
                data.avatar = user.avatar;
            }

            apiService.postMultiPart('/auth/register/', data, false).then(function (data) {
                deferred.resolve(data);
            }, function (response) {
                deferred.reject(response);
            });

            return deferred.promise;
        }

        function activateAccount(uid, token) {

            var deferred = $q.defer();

            var data = {
                uid: uid,
                token: token
            };

            apiService.post('/auth/activate/', data, false).then(function (response) {
                deferred.resolve(response);
            }, function (response) {
                deferred.reject(response);
            });

            return deferred.promise;
        }

        function getCountries() {

            var deferred = $q.defer();

            apiService.get('/countries/', null, true).then(function (response) {
                var countries = [];
                angular.forEach(response, function (item) {
                    countries.push({ id: item.id, name: item.short_name });
                });
                deferred.resolve(countries);
            }, function (response) {
                deferred.reject(response);
            });

            return deferred.promise;
        }
    }]);
})();
'use strict';

(function () {
    'use strict';

    angular.module('kachingCore').factory('errorHandler', ['$alert', function ($alert) {

        var processApiResponse = function processApiResponse(response) {

            if (response.status !== 403) {

                $alert({
                    title: 'ERROR!',
                    content: 'An error has occured. Please try again later.',
                    container: '#alerts-container',
                    placement: 'top',
                    duration: 3,
                    type: 'danger',
                    show: true
                });
            }
        };

        return {
            processApiResponse: processApiResponse
        };
    }]);
})();
'use strict';

(function () {
    'use strict';

    angular.module('kachingCore').directive('loader', function () {
        return {
            restrict: 'A',
            templateUrl: templateDirUri + '/assets/js/kaching-core/directives/loader/loaderTmpl.html'
            // templateUrl: 'kaching-core/directives/loader/loaderTmpl.html'// from master
        };
    });
})();
'use strict';

(function () {
    'use strict';

    angular.module('kachingCore').directive('preventDefault', function () {
        return {
            restrict: 'A',
            link: function link(scope, element, attrs) {
                if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                    element.on('click', function (e) {
                        e.preventDefault();
                    });
                }
            }
        };
    });
})();
'use strict';

(function () {
    'use strict';

    angular.module('kachingCore').directive('passwordMatch', [function () {
        return {
            require: 'ngModel',
            link: function link(scope, elem, attrs, ctrl) {
                var firstPassword = '#' + attrs.passwordMatch;
                elem.add(firstPassword).on('keyup', function () {
                    scope.$apply(function () {
                        var v = elem.val() === jQuery(firstPassword).val();
                        ctrl.$setValidity('pwmatch', v);
                    });
                });
            }
        };
    }]);
})();
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
    'use strict';

    angular.module('kachingCore').directive('panelTitle', ['$rootScope', '$timeout', '$state', function ($rootScope, $timeout, $state) {
        return {
            link: function link(scope, el, attrs, ctrl) {

                var originalTitle = el.text();

                $rootScope.$on('$stateChangeSuccess', function () {
                    var stateTitle = '';
                    if (_typeof($state.$current.data) === 'object' && typeof $state.$current.data.title !== 'undefined') {
                        stateTitle = $state.$current.data.title + ' – ';
                    }
                    $timeout(function () {
                        el.text(stateTitle + originalTitle);
                    });
                });
            }
        };
    }]);
})();
'use strict';

(function () {
    'use strict';

    angular.module('kachingCore').directive('kachingHeader', ['$window', 'authService', function ($window, authService) {
        return {
            restrict: 'A',
            controller: function controller($scope) {

                $scope.loggedIn = authService.isLoggedIn();

                $scope.logoClick = function () {
                    if (authService.isLoggedIn()) {
                        $window.location.href = kachingAppConfig.homeUrl + 'panel/';
                    } else {
                        $window.location.href = kachingAppConfig.homeUrl;
                    }
                };
            }
        };
    }]);
})();
'use strict';

(function () {
    'use strict';

    angular.module('kachingCore').directive('userNavBar', ['$rootScope', 'userService', 'authService', '$modal', '$window', '$state', function ($rootScope, userService, authService, $modal, $window, $state) {
        return {
            restrict: 'A',
            replace: 'true',
            scope: {
                'loggedIn': '=',
                'isHomepage': '='
            },
            templateUrl: templateDirUri + '/assets/js/kaching-core/directives/userNavBar/userNavBarTmpl.html',
            // templateUrl: 'kaching-core/directives/userNavBar/userNavBarTmpl.html',
            controller: function controller($scope) {

                $scope.user = {};
                $scope.username = '';
                $scope.balance = null;

                $scope.isPanel = kachingAppConfig.isPanelPage;

                $scope.urls = {
                    account: kachingAppConfig.panelUrl + '#/account',
                    funds: kachingAppConfig.panelUrl + '#/add-funds',
                    cards: kachingAppConfig.panelUrl + '#/credit-cards',
                    searchIconUrl: kachingAppConfig.wpTemplateUri + '/assets/images/search.png',
                    userIconUrl: kachingAppConfig.wpTemplateUri + '/assets/images/ic_user.png'
                };

                if ($scope.loggedIn) {
                    userService.getUser().then(function (user) {
                        $scope.user = user;
                        $scope.username = user.email;
                    }, function () {});
                    userService.getBalance().then(function (response) {
                        $scope.balance = response.credits_balance;
                    });
                }

                $rootScope.$on('accountBalanceChanged', function () {
                    userService.getBalance().then(function (response) {
                        $scope.balance = response.credits_balance;
                    });
                });

                $scope.logout = function () {
                    authService.logout().then(function () {
                        $window.location.href = kachingAppConfig.homeUrl;
                    });
                };

                $scope.isAdvertiser = function () {
                    return authService.isAdvertiser();
                };

                $scope.isDeveloper = function () {
                    return authService.isDeveloper();
                };

                $scope.switchUserType = function (type) {

                    if (authService.switchUserType(type)) {
                        if (!$scope.isPanel) {
                            $window.location.href = kachingAppConfig.panelUrl;
                        } else {
                            if (type === 'advertiser') {
                                $state.transitionTo('dashboard');
                            } else if (type === 'developer') {
                                $state.transitionTo('apikeys');
                            }
                        }
                    }
                };

                $scope.showLoginDialog = function () {
                    $modal({
                        templateUrl: templateDirUri + '/assets/js/kaching-core/components/loginModal/modalTmpl.html',
                        // templateUrl: 'kaching-core/components/loginModal/modalTmpl.html',
                        controller: 'loginModalCtrl',
                        animation: 'am-fade-and-scale',
                        placement: 'center'
                    });
                };

                $scope.showSignupDialog = function () {
                    $modal({
                        templateUrl: templateDirUri + '/assets/js/kaching-core/components/signupModal/modalTmpl.html',
                        // templateUrl: 'kaching-core/components/signupModal/modalTmpl.html',
                        controller: 'signupModalCtrl',
                        animation: 'am-fade-and-scale',
                        placement: 'center'
                    });
                };
                $scope.showStartCampaignDialog = function (e) {
                    e.preventDefault();
                    $modal({
                        templateUrl: templateDirUri + '/assets/kaching/campaign/campaign-modal-tmpl.html',
                        controller: 'startCampaingCtrl',
                        // controller: 'signupModalCtrl',
                        animation: 'am-fade-and-scale',
                        placement: 'center'
                    });
                };

                $scope.showUserSettingsPopup = function () {

                    var option = {
                        templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/userSettings/userSettingsTmpl.html',
                        controller: 'userSettingsCtrl',
                        animation: 'am-fade-and-scale',
                        // placement: 'center',
                        backdrop: 'static',
                        title: 'User Settings',
                        onShow: function onShow() {
                            angular.element('html').css('overflow', 'hidden');
                        },
                        onBeforeHide: function onBeforeHide() {
                            angular.element('html').css('overflow', 'initial');
                        },
                        resolve: {
                            campaignId: function campaignId() {
                                return undefined;
                            }
                        }
                    };

                    $modal(option);
                };
            }
        };
    }]);
})();
'use strict';

(function () {
    'use strict';

    angular.module('kachingCore').directive('resetPassword', ['$alert', '$modal', 'utils', 'userService', '$location', '$state', function ($alert, $modal, utils, userService, $location, $state) {
        return {
            restrict: 'A',
            templateUrl: templateDirUri + '/assets/js/kaching-core/directives/resetPassword/resetPasswordTmpl.html',
            controller: function controller($scope) {

                $scope.fieldHasError = utils.fieldHasError;

                $scope.view = {
                    urlError: false,
                    sending: false,
                    submitted: false,
                    success: false
                };

                var kachingQueryParams = {
                    uid: $location.search().uid,
                    token: $location.search().token
                };

                $scope.data = {
                    newPassword: '',
                    newPasswordRepeat: '',
                    token: kachingQueryParams.token,
                    uid: kachingQueryParams.uid
                };

                if (typeof kachingQueryParams.uid === 'undefined' || typeof kachingQueryParams.token === 'undefined') {
                    $scope.view.urlError = true;
                }

                $scope.showErrors = function () {
                    return $scope.view.submitted;
                };

                $scope.formSubmit = function () {
                    $scope.view.submitted = true;
                    if ($scope.form1.$valid) {

                        $scope.view.sending = true;

                        userService.passwordReset($scope.data.newPassword, $scope.data.uid, $scope.data.token).then(function () {
                            $scope.view.sending = false;
                            $scope.view.success = true;
                        }, function (response) {
                            $scope.view.urlError = true;
                        });
                    }
                };

                $scope.showLoginDialog = function () {
                    // $modal({
                    //     templateUrl: templateDirUri + '/assets/js/kaching-core/components/loginModal/modalTmpl.html',
                    //     controller: 'loginModalCtrl',
                    //     animation: 'am-fade-and-scale',
                    //     placement: 'center'
                    // });
                    $state.go('login');
                };

                $scope.showForgotPasswordDialog = function () {
                    // $modal({
                    //     templateUrl: templateDirUri + '/assets/js/kaching-core/components/forgotPasswordModal/modalTmpl.html',
                    //     controller: 'forgotPasswordModalCtrl',
                    //     animation: 'am-fade-and-scale',
                    //     placement: 'center'
                    // });
                    $modal({
                        templateUrl: templateDirUri + '/assets/kaching/forgot-password/forgot-password-tmpl.html',
                        controller: 'forgotPasswordModalCtrl',
                        animation: 'am-fade-and-scale',
                        // placement: 'center'
                        backdrop: 'static'
                    });
                };
            }
        };
    }]);
})();
'use strict';

(function () {
    'use strict';

    angular.module('kachingCore').directive('activateAccount', ['$alert', '$modal', '$window', 'authService', 'userService', 'utils', '$location', function ($alert, $modal, $window, authService, userService, utils, $location) {
        return {
            restrict: 'A',
            templateUrl: templateDirUri + '/assets/js/kaching-core/directives/activateAccount/activateAccountTmpl.html',
            controller: function controller($scope) {

                $scope.view = {
                    verificationError: false,
                    verificationSuccess: false,
                    verificationProcessing: false,
                    logginProcessing: false,
                    formError: false
                };

                $scope.loginFormData = {
                    email: '',
                    password: ''
                };

                $scope.view.verificationProcessing = true;

                var kachingQueryParams = {
                    uid: $location.search().uid,
                    token: $location.search().token
                };

                authService.logout().then(function () {

                    if (typeof kachingQueryParams.uid !== 'string' || typeof kachingQueryParams.token !== 'string') {

                        $scope.view.verificationProcessing = false;
                        $scope.view.verificationError = true;
                    } else {

                        userService.activateAccount(kachingQueryParams.uid, kachingQueryParams.token).then(function () {
                            $scope.view.verificationProcessing = false;
                            $scope.view.verificationSuccess = true;
                        }, function () {
                            $scope.view.verificationProcessing = false;
                            $scope.view.verificationError = true;
                        });
                    }
                });

                $scope.signinFormSubmit = function () {

                    $scope.view.logginProcessing = true;
                    $scope.view.formError = false;

                    authService.login($scope.loginFormData.email, $scope.loginFormData.password).then(function (user) {
                        $scope.view.logginProcessing = false;
                        $window.location.href = kachingAppConfig.panelUrl;
                    }, function () {
                        $scope.view.logginProcessing = false;
                        $scope.view.formError = true;
                    });
                };

                $scope.showForgotPasswordDialog = function () {
                    $modal({
                        templateUrl: templateDirUri + '/assets/kaching/forgot-password/forgot-password-tmpl.html',
                        controller: 'forgotPasswordModalCtrl',
                        animation: 'am-fade-and-scale',
                        // placement: 'center'
                        backdrop: 'static'
                    });
                };
            }
        };
    }]);
})();
'use strict';

(function () {
  var picker;

  picker = angular.module('daterangepicker', []);

  picker.constant('dateRangePickerConfig', {
    clearLabel: 'Clear',
    locale: {
      separator: ' - ',
      format: 'YYYY-MM-DD'
    }
  });

  picker.directive('dateRangePicker', ['$compile', '$timeout', '$parse', 'dateRangePickerConfig', function ($compile, $timeout, $parse, dateRangePickerConfig) {
    return {
      require: 'ngModel',
      restrict: 'A',
      scope: {
        min: '=',
        max: '=',
        model: '=ngModel',
        opts: '=options',
        clearable: '='
      },
      link: function link($scope, element, attrs, modelCtrl) {
        var _clear, _init, _initBoundaryField, _mergeOpts, _picker, _setDatePoint, _setEndDate, _setStartDate, _validate, _validateMax, _validateMin, customOpts, el, opts;
        _mergeOpts = function _mergeOpts() {
          var extend, localeExtend;
          localeExtend = angular.extend.apply(angular, Array.prototype.slice.call(arguments).map(function (opt) {
            return opt != null ? opt.locale : void 0;
          }).filter(function (opt) {
            return !!opt;
          }));
          extend = angular.extend.apply(angular, arguments);
          extend.locale = localeExtend;
          return extend;
        };
        el = $(element);
        customOpts = $scope.opts;
        opts = _mergeOpts({}, dateRangePickerConfig, customOpts);
        _picker = null;
        _clear = function _clear() {
          _picker.setStartDate();
          return _picker.setEndDate();
        };
        _setDatePoint = function _setDatePoint(setter) {
          return function (newValue) {
            if (_picker && newValue) {
              return setter(moment(newValue));
            }
          };
        };
        _setStartDate = _setDatePoint(function (m) {
          if (_picker.endDate < m) {
            _picker.setEndDate(m);
          }
          opts.startDate = m;
          return _picker.setStartDate(m);
        });
        _setEndDate = _setDatePoint(function (m) {
          if (_picker.startDate > m) {
            _picker.setStartDate(m);
          }
          opts.endDate = m;
          return _picker.setEndDate(m);
        });
        _validate = function _validate(validator) {
          return function (boundary, actual) {
            if (boundary && actual) {
              return validator(moment(boundary), moment(actual));
            } else {
              return true;
            }
          };
        };
        _validateMin = _validate(function (min, start) {
          return min.isBefore(start) || min.isSame(start, 'day');
        });
        _validateMax = _validate(function (max, end) {
          return max.isAfter(end) || max.isSame(end, 'day');
        });
        modelCtrl.$formatters.push(function (objValue) {
          var f;
          f = function f(date) {
            if (!moment.isMoment(date)) {
              return moment(date).format(opts.locale.format);
            } else {
              return date.format(opts.locale.format);
            }
          };
          if (opts.singleDatePicker && objValue) {
            return f(objValue);
          } else if (objValue.startDate) {
            return [f(objValue.startDate), f(objValue.endDate)].join(opts.locale.separator);
          } else {
            return '';
          }
        });
        modelCtrl.$render = function () {
          if (modelCtrl.$modelValue && modelCtrl.$modelValue.startDate) {
            _setStartDate(modelCtrl.$modelValue.startDate);
            _setEndDate(modelCtrl.$modelValue.endDate);
          } else {
            _clear();
          }
          return el.val(modelCtrl.$viewValue);
        };
        modelCtrl.$parsers.push(function (val) {
          var f, objValue, x;
          f = function f(value) {
            return moment(value, opts.locale.format);
          };
          objValue = {
            startDate: null,
            endDate: null
          };
          if (angular.isString(val) && val.length > 0) {
            if (opts.singleDatePicker) {
              objValue = f(val);
            } else {
              x = val.split(opts.locale.separator).map(f);
              objValue.startDate = x[0];
              objValue.endDate = x[1];
            }
          }
          return objValue;
        });
        modelCtrl.$isEmpty = function (val) {
          return !(angular.isString(val) && val.length > 0);
        };
        _init = function _init() {
          var eventType, results;
          el.daterangepicker(angular.extend(opts, {
            autoUpdateInput: false
          }), function (start, end) {
            return $scope.$apply(function () {
              return $scope.model = opts.singleDatePicker ? start : {
                startDate: start,
                endDate: end
              };
            });
          });
          _picker = el.data('daterangepicker');
          results = [];
          for (eventType in opts.eventHandlers) {
            results.push(el.on(eventType, function (e) {
              var eventName;
              eventName = e.type + '.' + e.namespace;
              return $scope.$evalAsync(opts.eventHandlers[eventName]);
            }));
          }
          return results;
        };
        _init();
        $scope.$watch('model.startDate', function (n) {
          return _setStartDate(n);
        });
        $scope.$watch('model.endDate', function (n) {
          return _setEndDate(n);
        });
        _initBoundaryField = function _initBoundaryField(field, validator, modelField, optName) {
          if (attrs[field]) {
            modelCtrl.$validators[field] = function (value) {
              return value && validator(opts[optName], value[modelField]);
            };
            return $scope.$watch(field, function (date) {
              opts[optName] = date ? moment(date) : false;
              return _init();
            });
          }
        };
        _initBoundaryField('min', _validateMin, 'startDate', 'minDate');
        _initBoundaryField('max', _validateMax, 'endDate', 'maxDate');
        if (attrs.options) {
          $scope.$watch('opts', function (newOpts) {
            opts = _mergeOpts(opts, newOpts);
            return _init();
          }, true);
        }
        if (attrs.clearable) {
          $scope.$watch('clearable', function (newClearable) {
            if (newClearable) {
              opts = _mergeOpts(opts, {
                locale: {
                  cancelLabel: opts.clearLabel
                }
              });
            }
            _init();
            if (newClearable) {
              return el.on('cancel.daterangepicker', function () {
                return $scope.$apply(function () {
                  return $scope.model = opts.singleDatePicker ? null : {
                    startDate: null,
                    endDate: null
                  };
                });
              });
            }
          });
        }
        return $scope.$on('$destroy', function () {
          return _picker != null ? _picker.remove() : void 0;
        });
      }
    };
  }]);
}).call(undefined);
'use strict';

(function () {
    'use strict';

    angular.module('kachingCore').controller('userSettingsCtrl', ['$scope', '$alert', '$modal', '$q', 'utils', 'errorHandler', 'userService', function ($scope, $alert, $modal, $q, utils, errorHandler, userService) {

        $scope.fieldHasError = utils.fieldHasError;

        $scope.view = {
            loading: true,
            sending: false,
            submitted: false
        };

        $scope.data = {
            user: {},
            countries: []
        };

        $scope.tab = {
            ACCOUNT_DETAILS: 'accountDetails',
            FUND_DETAILS: 'fundDetails'
        };

        var templateFolder = kachingAppConfig.wpTemplateUri + '/assets/kaching/userSettings/tabs/';

        $scope.userSettingTab = {
            accountDetails: templateFolder + 'accountDetailsTmpl.html',
            fundDetails: templateFolder + 'fundDetailsTmpl.html'
        };

        $scope.updateTab = function (tab) {
            $scope.activedTab = tab;
        };

        // $scope.templateUrl = kachingAppConfig.wpTemplateUri + '/assets/js/kaching-core/directives/userNavBar/userNavBarTmpl.html'
        var init = function init() {

            var deferred1 = $q.defer();
            var deferred2 = $q.defer();

            var promisses = [deferred1.promise, deferred2.promise];

            $scope.activedTab = $scope.tab.ACCOUNT_DETAILS;

            userService.getUser().then(function (user) {
                $scope.data.user = user;
                deferred1.resolve(user);
            }, function (response) {
                deferred1.reject(response);
            });

            userService.getCountries().then(function (countries) {
                $scope.data.countries = countries;
                deferred2.resolve(countries);
            }, function (response) {
                deferred2.reject(response);
            });

            $q.all(promisses).then(function () {
                $scope.view.loading = false;
            }, function (response) {
                errorHandler.processApiResponse(response);
            });
        };

        $scope.showErrors = function () {
            return $scope.view.submitted;
        };

        $scope.showPasswordChangeDialog = function () {
            $modal({
                // templateUrl: 'panel-module/components/passwordChangeModal/modalTmpl.html',
                templateUrl: templateDirUri + '/assets/kaching/panel-module/components/passwordChangeModal/modalTmpl.html',
                controller: 'passwordChangeModalCtrl',
                animation: 'am-fade-and-scale',
                placement: 'center',
                backdrop: 'static'
            });
        };

        $scope.saveProfile = function () {
            $scope.view.submitted = true;
            if ($scope.form1.$valid) {
                $scope.view.sending = true;
                userService.updateUser($scope.data.user).then(function () {
                    $scope.view.sending = false;
                    $alert({
                        title: 'Account settings saved.',
                        content: '',
                        container: '#alerts-container',
                        placement: 'top',
                        duration: 3,
                        type: 'success',
                        show: true
                    });
                }, function (response) {
                    errorHandler.processApiResponse(response);
                });
            }
        };

        init();
    }]);
})();
'use strict';

(function () {
    'use strict';

    angular.module('kachingCore').controller('accountDetailsCtrl', ['$scope', '$rootScope', 'errorHandler', '$modal', 'utils', 'userService', 'FileUploader', function ($scope, $rootScope, errorHandler, $modal, utils, userService, FileUploader) {

        // Show / hide edit card form
        $scope.toggleCardForm = function () {
            $scope.isVisibleCardForm = !$scope.isVisibleCardForm;
        };

        $scope.profileImageUploader = new FileUploader();

        $scope.previewImage = function (event) {
            var imageFile = event.target.files[0];
            var reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.addEventListener('load', function () {
                angular.element('#profileImage').css('background-image', 'url(' + reader.result + ')');
            });
        };

        var init = function init() {
            $scope.isVisibleCardForm = true;
            $scope.notification = {
                emailSetting: true,
                fundSetting: true,
                maintanenceSetting: false
            };
        };

        init();
    }]);
})();
'use strict';

(function () {
    'use strict';

    angular.module('kachingCore').controller('fundDetailsCtrl', ['$scope', function ($scope) {

        var dataFundDetails = [{
            title: 'Coca Cola',
            view: '354',
            conversion: '10.5',
            numPayout: '25,000',
            totalFund: '1,000,000'
        }, {
            title: 'Nike',
            view: '296',
            conversion: '25',
            numPayout: '100,000',
            totalFund: '550,000'
        }, {
            title: 'Starbucks',
            view: '64',
            conversion: '45',
            numPayout: '80,000',
            totalFund: '230,000'
        }, {
            title: 'Apple',
            view: '784',
            conversion: '87',
            numPayout: '1,350,000',
            totalFund: '2,300,000'
        }, {
            title: 'Vans',
            view: '59',
            conversion: '12',
            numPayout: '8,000',
            totalFund: '150,000'
        }, {
            title: 'Samsung',
            view: '873',
            conversion: '77',
            numPayout: '900,000',
            totalFund: '2,300,000'
        }, {
            title: 'Camper',
            view: '109',
            conversion: '43',
            numPayout: '81,000',
            totalFund: '350,000'
        }, {
            title: 'Sony',
            view: '45',
            conversion: '52',
            numPayout: '700,000',
            totalFund: '1,500,000'
        }];

        $scope.dataFundDetails = dataFundDetails;
    }]);
})();
})(jQuery);
//# sourceMappingURL=kachingCore.js.map
