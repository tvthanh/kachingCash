<div class="confirmation-modal modal fade" id="newCampaignModal" tabindex="-1" role="dialog" aria-labelledby="newCampaignModal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">New Campaign - Step 1</h4>
      </div>
      <form id="addnewcampaign" data-parsley-validate>
      <div class="modal-body text-center">
        <div class="row">
          <div class="col-md-6">  
            <div class="campaign-container">
                <label>Campaign Details</label>
                <div class="form-group">
                  <input id="title" type="text" class="form-control" placeholder="Name of your campaign" required="" data-parsley-required-message="Key Name is required.">
                </div>
                <div class="form-group">
                  <input id="title" type="text" class="form-control" placeholder="Type your company name" required="" data-parsley-required-message="Key Name is required.">
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class='input-group date' id='datetimepicker1'>
                        <input type='text' class="form-control" />
                        <span class="input-group-addon">
                            <span class="glyphicon glyphicon-triangle-bottom"></span>
                        </span>
                    </div>
                  </div>
                  <div class="col-md-6">                  
                      <div class='input-group date' id='datetimepicker2'>
                          <input type='text' class="form-control" />
                          <span class="input-group-addon">
                              <span class="glyphicon glyphicon-triangle-bottom"></span>
                          </span>
                      </div>
                  </div>
                </div>
                <label>Media for your campaign</label>
                <div class="form-group">
                  <input id="views" type="text" class="form-control" placeholder="Name Your media" required="" data-parsley-required-message="Key Name is required.">
                </div>      
                       
                <div class="row media">
                  <div class="col-xs-6 col-sm-4 "> 
                      <div class="crop editable"> 
                        <img src="  key.portrait  "> 
                      </div> 
                      <label class="separate">100x160 Pixels</label>                             
                  </div> 
                  <div class="col-xs-6 col-sm-4 "> 
                      <div class="crop editable"> 
                        <img src="  key.landscape  "> 
                      </div> 
                      <label class="separate">260x170 Pixels</label>                                  
                  </div>    
                  <div class="col-xs-12 col-sm-4"> 
                      <div class="crop editable"> 
                        <img src="  key.summary_image  "> 
                      </div> 
                      <label class="separate">320x300 Pixels</label>                                
                  </div>      
                </div>
                <!-- <div class="row"> -->
                  <div align="center" class="embed-responsive embed-responsive-16by9 editable"> 
                    <video class="embed-responsive-item"> 
                      <source src="  key.video  " type="video/mp4"> 
                    </video> 
                  </div>
                  <label>Video in scale 16:9</label>   


                <!-- </div>            -->

            </div>
          </div>    
          <div class="col-md-6">
            <div class="campaign-container">
                <label>Products for your campaign</label>           

                <div class="form-group">
                  <input id="views" type="text" class="form-control" placeholder="Name of yout product" required="" data-parsley-required-message="Key Name is required.">
                </div>
                <div class="form-group">
                  <input id="views" type="text" class="form-control" placeholder="URL of product" required="" data-parsley-required-message="Key Name is required.">
                </div>                   
                <div class="row">
                  <div class="col-md-4">
                      <div class="crop editable"> 
                        <img src="  key.summary_image  "> 
                      </div> 
                      <label>Add product image</label>    
                  </div>
                  <div class="col-md-8">                  
                    <div class="form-group">
                      <textarea class="form-control" name="" id="" cols="30" rows="6" placeholder="Description of your products"></textarea>
                    </div>                    
                  </div>

                </div>
                <button type="button" class="btn btn-default pull-right" data-dismiss="modal">Add from library</button>
<!--                 <div class="form-group">
                  <input id="views" type="text" class="form-control" placeholder="Views Total" required="" data-parsley-required-message="Key Name is required.">
                </div>
                <div class="form-group">
                  <input id="budget" type="text" class="form-control" placeholder="Budget" required="" data-parsley-required-message="Key Name is required.">
                </div>  -->
            </div>
          </div>    
        </div>
      </div>
      <div class="modal-footer text-center">
        <div class="col-md-6">
          <div class="campaign-container">
            <button type="button" class="btn btn-default pull-right" data-dismiss="modal">Add from library</button>           
          </div>
        </div>
        <div class="col-md-6">
          <div class="campaign-container">
            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
            <button id="savekey" type="submit" class="btn btn-primary" value="validate">Next Step</button>
          </div>          
        </div>

      </div>
      </form>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->