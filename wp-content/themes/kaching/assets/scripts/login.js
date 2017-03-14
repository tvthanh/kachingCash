var signIn;
(function($) {

	signIn = {
		saveCookie: function(username, group, userid){
			var now = new Date();
			var time = now.getTime();
			time += 3600 * 2000;
			now.setTime(time);
			document.cookie =
			'username=' + username +
			'; expires=' + now.toUTCString() +
			'; path=/';
			document.cookie =
			'usertype=' + group +
			'; expires=' + now.toUTCString() +
			'; path=/';
			localStorage.setItem("usrid", userid);
			this.redirect(group);
		},
		redirect: function(group){
			if(group === 1){
				location.href = '/campaigns/';
			} else {
				location.href = '/api-keys/';
			}
		},
		sendData: function(event){
			event.preventDefault();
			var context = this;
			var api_login =  server + "/api-token-auth/";
			var email = $('body').find("#emailUsr").val();
			var password = $('body').find("#logPass").val();
			var emailField = $('body').find("#emailUsr").parsley();
			var passwordField = $('body').find("#logPass").parsley();
			var tjson = {
				"email": email,
				"password": password
			};
			window.ParsleyUI.removeError(emailField, "emailError");
			window.ParsleyUI.removeError(passwordField, "passwordError");
			// var tjson = {
			// 	"username": username,
			// 	"password": password};
			// var jsonData = JSON.stringify(tjson);
			$.ajax({
				type: 'POST',
				// headers: jsonData,
			    dataType: "json",
				url: api_login,
				data: tjson,
			 //    beforeSend: function (xhr) {
				//     xhr.setRequestHeader ("Authorization", "Basic " + btoa(email + ":" + password));
				// },
			   success: function(response) {

					var conn = response.token;
					var user = response.user_company;
					localStorage.setItem("conn", conn);
					localStorage.setItem("user", user);
					// toastr.success('Hello ' + user);
					// if (top.location.pathname !== baseLocation + '/documentation/'){
					// 	setTimeout(function(){
							// location.href = baseLocation + '/api-keys/';
					// 	}, 200);
					// } else {
					// 	$('#myModal').modal('hide');
					// }
					userProfile.getUserData();


			   },

				complete: function(xhr, textStatus, res) {
				    // console.log(xhr);
				    if(xhr.status === 400){
				       // toastr.error('Invalid email or password.');
				       if(xhr.responseText[0] === '{'){
				       		// console.log(xhr.responseText[0]);
					       	// window.ParsleyUI.addError(emailField, "emailError", JSON.parse(xhr.responseText).email[0].message);
					       	window.ParsleyUI.addError(emailField, "emailError", "Invalid credentials");
				       } else {
					       	// console.log(xhr.responseText[0]);
							window.ParsleyUI.addError(passwordField, "passwordError", xhr.responseText);
						}
				    } else if(xhr.status === 404){
				    	window.ParsleyUI.addError(emailField, "emailError", "Connection error");
				    }
				}
			});

		}
	};
	// signIn.saveCookie();
	$('body').delegate( "#signinform", "submit", signIn.sendData);
	$('body').delegate('#gotosignup', 'click', function(event) {
		event.preventDefault();
		$('#myModal').modal('hide');
		$('#myModal2').modal('show');
	});
	$('body').delegate('#forgotpass', 'click', function(event) {
		event.preventDefault();
		$('#myModal').modal('hide');
		$('#resetPassModal').modal('show');
	});

})(jQuery);