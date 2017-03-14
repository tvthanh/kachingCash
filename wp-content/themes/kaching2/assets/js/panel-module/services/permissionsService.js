(function(){
    "use strict";

    angular.module('panelApp')
        .factory('permissionsService', [
            'statePermissions',
            'authService',
        function(
            statePermissions,
            authService
        ) {

            var userHasAccess = function( stateName ) {
                var usertype = authService.getUsertype();
                return _.contains( statePermissions[usertype], stateName );
            };

            return {
                userHasAccess: userHasAccess
            };
        }]);

})();
