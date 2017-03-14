<div class="confirmation-modal modal fade" id="passwordModal" tabindex="-1" role="dialog" aria-labelledby="passwordModalLabel">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">Change Password</h4>
      </div>
      <form id="changepass" data-parsley-validate>
      <div class="modal-body text-center">
        <div class="form-container">

            <div class="form-group">
              <input id="oldPass" type="password" class="form-control" placeholder="Old password" required="" data-parsley-error-message="Old password is not valid" data-parsley-required-message="Old password is required.">
            </div>
            <div class="form-group">
              <input id="newPass" type="password" class="form-control" placeholder="New password" required="" data-parsley-minlength="6" data-parsley-required-message="New password is required.">
            </div>
            <div class="form-group">
              <input id="newPassConfirm" type="password" class="form-control" placeholder="Repeat password" required="" data-parsley-minlength="6" data-parsley-required-message="Repeat password is required." data-parsley-equalto="#newPass">
            </div>                

        </div>
      </div>
      <div class="modal-footer text-center">
        <div class="form-container">
          <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
          <button type="submit" class="btn btn-primary" value="validate">OK</button>
        </div>
      </div>
      </form>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->