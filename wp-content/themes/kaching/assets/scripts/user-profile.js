var userProfile;
(function($) {
	userProfile = {
		userData: server + '/users/profile/',
		getUserData: function(){
		    var token = 'Token ' + window.localStorage.getItem("conn");
    		var context = this;
	      $.ajax({    
	        headers: {'Authorization': token},
	        type: 'GET',
	        dataType: 'json',
	        
	        url: this.userData,

	         success: function(response) {
	          // context.generateTable(response.results);
          
	          signIn.saveCookie(response.company, response.groups[0].id, response.id);
	          return response;
	          // $('.loader').hide();
	         },
	        complete: function(xhr, textStatus) {
	            if(xhr.status === 405){
	            // location.href = baseLocation;
	            //   toastr.error('Your session has expired. Please Sign in.');
	            //   localStorage.clear();
	            // document.cookie = 'username=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
	            // $('.loader').hide();
	            }
	        }       
	      });  			
		}
	};
})(jQuery);