<div class="confirmation-modal modal fade" id="newkeyModal" tabindex="-1" role="dialog" aria-labelledby="newkeyModalLabel">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">Generate new key</h4>
      </div>
      <form id="addnewkey" data-parsley-validate>
      <div class="modal-body text-center">
        <div class="form-container">

            <div class="form-group">
              <input id="keyname" type="text" class="form-control" placeholder="Key Name" required="" data-parsley-required-message="Key Name is required.">
            </div>
<!--             <div class="form-group selectwrap">
              <select id="keystatus" class="form-control">
                <option value="true">TEST</option>
                <option value="false">PRODUCTION</option>
              </select>
            </div>        -->   

        </div>
      </div>
      <div class="modal-footer text-center">
        <div class="form-container">
          <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
          <button id="savekey" type="submit" class="btn btn-primary" value="validate">Add</button>
        </div>
      </div>
      </form>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->