<div class="modal fade left" id="resetPassModal" tabindex="-1" role="dialog" aria-labelledby="resetPassLabel">
  <div class="modal-wrapper text-center">
    <div class="modal-wrapper-head">
      <!-- <i class="ion-close-round" data-dismiss="modal" aria-label="Close"></i> -->
    </div>
    <div class="modal-dialog" role="document">
      <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><i class="ion-close-round"></i></span></span></button>
            <h4 class="modal-title">Forgot your password?</h4>
          </div>
          <form id="resetpass" data-parsley-validate>
          <div class="modal-body">
              <div class="form-container">
                <p>Enter your email adress below and we will send you password reset instructions </p>
                <div class="form-group">
                  <input id="resetemail" type="email" class="form-control" placeholder="Email" required="" data-parsley-required-message="E-mail is required.">
                </div>
              </div>
          </div>
          <div class="modal-footer">
            <div class="form-container">
              <button type="button" class="btn sign-in-btn btn-link clear-btn" data-dismiss="modal" id="gotosignin">Cancel</button>
              <button  type="submit" class="btn sign-in-btn btn-primary" value="validate">Reset Password</button>
            </div>
          </div>
        </form>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
    <span class="bottom-info"></span>
  </div><!-- /. modal-wrapper -->
</div><!-- /.modal -->