(function($) {
    var usertype, submitted = false;
    var usergroupSelected = function() {
        return $('.user-container').hasClass('selected');
    };
    $('body').delegate( "#signupform").on('click', '.user-container', function(){
        usertype = $(this).data('user');
        $(this).addClass('selected');
        $('.user-container').not($(this)).removeClass('selected');
        $('.user-crop').removeClass('error');
        $('.usergroup-error').hide();
        console.log(usertype);
    });
    $('body').delegate( "#signupform").on('hover', '[data-toggle="tooltip"]', function(event) {
        $(this).tooltip();
    });
    $('body').delegate( "#signupform", "submit", function(event) {
        event.preventDefault();
        var api_register =  server + "/auth/register/";
        var emailField = $('body').find("#email").parsley();
        var firstname = $('body').find("#firstname").val();
        var lastname = $('body').find("#lastname").val();
        var company = $('body').find("#company").val();
        var password = $('body').find("#password").val();
        var email = $('body').find("#email").val();
        var usergroupError = $('.usergroup-error');
        if ( !usergroupSelected() ) {
            $('.user-crop').addClass('error');
            usergroupError.show();
            return;
        } else {
            usergroupError.hide();
        }
        window.ParsleyUI.removeError(emailField, "emailError");
        var tjson = {
            "first_name": firstname,
            "last_name": lastname,
            "company": company,
            "email": email,
            "password": password,
            "groups": usertype
        };
        // var jsonData = JSON.stringify(tjson);
        // console.log("data = ", jsonData);
        $.ajax({
            type: 'POST',
            dataType: "json",
            url: api_register,
            data: tjson,
            success: function(response) {
                $('#myModal2').modal('hide');
                $('#registerSuccessModal').modal('show');
                // toastr.success('Successfully created Account');
            },
            complete: function(xhr, textStatus) {
                if(xhr.status === 400){
                    window.ParsleyUI.addError(emailField, "emailError", "User with given email already exists");
                }
            }
        });
    });
    $('body').delegate('#gotosignin', 'click', function(event) {
        event.preventDefault();
        $('#myModal2').modal('hide');
        $('#myModal').modal('show');
    });
    $('body').delegate('#gotosigninmod', 'click', function(event) {
        event.preventDefault();
        $('#registerSuccessModal').modal('hide');
        $('#myModal').modal('show');
    });
})(jQuery);