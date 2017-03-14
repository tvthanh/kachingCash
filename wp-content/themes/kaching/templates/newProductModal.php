<div class="modal fade left" id="newProductsModal" tabindex="-1" role="dialog" aria-labelledby="newProductsModal">
  <div class="modal-wrapper text-center">
    <div class="modal-wrapper-head">  
      <!-- <i class="ion-close-round" data-dismiss="modal" aria-label="Close"></i> -->

    </div>
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><i class="ion-close-round"></i></span></span></button>
          <h4 class="modal-title">Add New Product</h4>
        </div>
       <form id="uploadproduct" data-parsley-validate>
        <div class="modal-body">

          <div id="addmediacontent" class="form-container">
 
              <div class="form-group">
                <input name="title" type="text" class="form-control" placeholder="Name of your media collection" required="" data-parsley-maxlength="32" data-parsley-required-message="Required.">
              </div>  
              <div class="form-group">
                <input name="url" type="text" class="form-control" placeholder="URL" required="" data-parsley-maxlength="32" data-parsley-required-message="Required.">
              </div>    
              <div class="form-group">
                <input name="price" type="text" class="form-control" placeholder="Price" required="" data-parsley-maxlength="32" data-parsley-required-message="Required.">
              </div>                                       
              <div class="form-group">
                <div class="row row-min">
                  <div class="col-md-4 min-padding">
                    <span class="file-input btn btn-upload btn-file btn-block product-image-upload">
                        <span class="resolution">100x160</span><input name="image"  required="" type="file" multiple>
                    </span>
                  </div>
                  <div class="col-md-8 min-padding">
                    <div class="form-group">
                      <textarea name="description" type="text" class="form-control" placeholder="Description" required="" data-parsley-maxlength="32" data-parsley-required-message="Required."></textarea>
                    </div>
                  </div>
                </div>
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