<div class="modal fade left" id="newAssetsModal" tabindex="-1" role="dialog" aria-labelledby="newAssetsModal">
  <div class="modal-wrapper text-center">
    <div class="modal-wrapper-head">  
      <!-- <i class="ion-close-round" data-dismiss="modal" aria-label="Close"></i> -->

    </div>
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><i class="ion-close-round"></i></span></span></button>
          <h4 class="modal-title">Add media collection</h4>
        </div>
       <form id="uploadmedia" data-parsley-validate>
        <div class="modal-body">

          <div id="addmediacontent" class="form-container">

              <div class="form-group">
                <input name="name" type="text" class="form-control" placeholder="Name of your media collection" required="" data-parsley-maxlength="32" data-parsley-required-message="Required.">
              </div>  
              <div class="form-group">
                <textarea name="description" type="text" class="form-control" placeholder="Description" required="" data-parsley-maxlength="32" data-parsley-required-message="Required."></textarea>
              </div>                            
              <div class="form-group">
                <span class="file-input btn btn-block btn-upload btn-file video-1">
                    <span class="resolution">VIDEO 16:9</span><input name="video" type="file"  required="" multiple>
                </span>
              </div>
              <div class="form-group upload-holder">
                <span class="file-input btn btn-upload btn-file file-1">
                    <span class="resolution">320x300</span> <input accept="image/png, image/jpeg" name="summary_image" type="file"  required="" multiple>
                </span>

                <span class="file-input btn btn-upload btn-file file-2">
                    <span class="resolution">260x170</span> <input accept="image/png, image/jpeg" name="landscape" type="file" required="" multiple>
                </span>

                <span class="file-input btn btn-upload btn-file file-3">
                    <span class="resolution">100x160</span> <input accept="image/png, image/jpeg" name="portrait" type="file" required="" multiple>
                </span>
              </div>                                          
          </div>

         

        </div>
        <div class="modal-footer">
       
          <div id="signupbutton" class="form-container">
            <button class="btn btn-default" data-dismiss="modal" aria-label="Close">CANCEL</button>
            <button type="submit" class="btn btn-primary" value="validate">Done</button>
          </div>

        </div>
        </form>        
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
    
  </div><!-- /. modal-wrapper -->
</div><!-- /.modal -->