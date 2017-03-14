<div class="modal fade left" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-wrapper text-center">
    <div class="modal-wrapper-head">
    </div>
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><i class="ion-close-round"></i></span></button>
          <h4 class="modal-title">Sign In</h4>
        </div>
        <form id="signinform" data-parsley-validate>
        <div class="modal-body">
            <div class="form-container clearfix">
              <div class="form-group">
                <input id="emailUsr" type="text" class="form-control" placeholder="E-mail" required="" data-parsley-required-message="E-mail is required.">
              </div>
              <div class="form-group">
                <input id="logPass" type="password" class="form-control" placeholder="Password" required="" data-parsley-required-message="Password is required.">
              </div>
            </div>
        </div>
        <div class="modal-footer">
          <div class="form-container">
            <button id="gotosignup" type="button" class="btn sign-in-btn btn-link clear-btn" data-dismiss="modal">Sign Up</button>
            <button id="login" type="submit" class="btn sign-in-btn btn-primary" value="validate">Sign In</button>
          </div>
        </div>
        </form>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
    <span class="bottom-info">Forgot your password? <a href="" id="forgotpass">Click here</a></span>
  </div><!-- /. modal-wrapper -->
</div><!-- /.modal -->