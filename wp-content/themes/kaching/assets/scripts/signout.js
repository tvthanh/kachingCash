var logOut;
(function($) {

	logOut = {
		logout: function logOut(event) {
			event.preventDefault();
			console.log('work');
			localStorage.clear();
			document.cookie = 'username=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
			document.cookie = 'usertype=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
			// toastr.success('You are successfully logged out.');
			setTimeout(function(){
				location.href = baseLocation;
			}, 500);

		}
	};
	$('body').delegate( "#signout", "click", logOut.logout);	
})(jQuery);