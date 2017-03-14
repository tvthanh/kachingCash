(function($) {
	
	$('body').delegate( "#resetpass", "submit", function(event) {
		event.preventDefault();
		var api_reset =  server + "/auth/password/reset/";
		var email = $('body').find("#resetemail").val();		
		var tjson = {
			"email": email,
		};

		// var jsonData = JSON.stringify(tjson);
		$.ajax({		
			type: 'POST',
		    dataType: "json",
			url: api_reset,
			data: tjson,
		   success: function(response) {
		   		// toastr.success('If your email exists in our database, you will recive a password recovery link at your email adress in a few minutes.');
				$('#resetPassModal').modal('hide');
				$('#passSuccessModal').modal('show');						   		
		   },
			complete: function(xhr, textStatus) {
			    console.log(xhr.status +' '+ textStatus);
			    if(xhr.status === 400){
			       toastr.error('Error.');	
			    }
			}   		
		});		

	});


})(jQuery);