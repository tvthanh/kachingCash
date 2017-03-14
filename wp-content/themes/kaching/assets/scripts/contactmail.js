(function($) {
// wpcf7:invalid
// wpcf7:spam
// wpcf7:mailsent
// wpcf7:mailfailed
// wpcf7:submit
$(".wpcf7").on('wpcf7:mailsent', function(event){
  // Your code here
  toastr.success('Sent successfully');
});	
$(".wpcf7").on('wpcf7:invalid', function(event){
  // Your code here
  toastr.error('Please fill in all required fields');
});

$(".wpcf7").on('wpcf7:mailfailed', function(event){
  // Your code here
  toastr.error('Failed to send e-mail');
});
// var form = $('#contactform');

// $(form).submit(function(event) {
//     // Stop the browser from submitting the form.
//     event.preventDefault();

// 	var formData = $(form).serialize();
// 	$.ajax({
// 	    type: 'POST',
// 	    url: baseLocation + '/mailer.php',
// 	    data: formData
// 	})
// 	.done(function(response) {
// 	    // Make sure that the formMessages div has the 'success' class.
// 	    toastr.success('Sent successfully');

// 	    // Clear the form.
// 	    $('#fname').val('');
// 	    $('#lname').val('');	    
// 	    $('#contactemail').val('');
// 	    $('#title').val('');	    
// 	    $('#message').val('');
// 	})
// 	.fail(function(data) {
// 		toastr.error('Please fill in all required fields');
// 	});
// });

})(jQuery);