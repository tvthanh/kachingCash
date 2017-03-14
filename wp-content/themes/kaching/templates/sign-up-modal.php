<div class="modal fade left" id="myModal2" tabindex="-1" role="dialog" aria-labelledby="myModal2Label">
  <div id="signupmodal" class="modal-wrapper text-center">
    <div class="modal-wrapper-head">
      <!-- <i class="ion-close-round" data-dismiss="modal" aria-label="Close"></i> -->
    </div>
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><i class="ion-close-round"></i></span></span></button>
          <h4 class="modal-title">Sign Up</h4>
        </div>
       <form id="signupform" data-parsley-validate>
        <div class="modal-body">
          <div id="signupcontent" class="form-container">
              <div class="form-group">
                <div class="col-md-5 padd-l"><input id="firstname" name="firstname" type="text" class="form-control" placeholder="First Name" required="" data-parsley-maxlength="32" data-parsley-required-message="Required."></div>
                <div class="col-md-7 padd-r"><input id="lastname" name="lastname" type="text" class="form-control" placeholder="Last Name" required="" data-parsley-maxlength="32" data-parsley-required-message="Last name is required."></div>
              </div>
              <div class="form-group">
                <input id="email" type="email" class="form-control" placeholder="E-mail" data-parsley-maxlength="254" required="" data-parsley-required-message="E-mail is required.">
              </div>
              <div class="form-group">
                <input id="company" type="text" class="form-control" placeholder="Company" required=""  data-parsley-maxlength="64" data-parsley-required-message="Company name is required.">
              </div>
              <div class="form-group">
                <input id="password" type="password" name="password" class="form-control" placeholder="Password" required="" data-parsley-minlength="6" data-parsley-required-message="Password is required.">
              </div>
              <div class="form-group user-select">
                <h5>Account type:</h5>
                <div class="user-container" data-user="1"  data-toggle="tooltip" data-placement="top" title="" data-original-title="Lorem ipsum dolor sit amet, consectetur adipiscing elit.">
                  <div class="user-crop"  >
                    <img width="100" height="100" src="<?php bloginfo('template_url'); ?>/assets/images/ic_advertiser.svg" alt="Advertiser">
                    <img width="100" height="100" src="<?php bloginfo('template_url'); ?>/assets/images/ic_advertiser_fill.svg" alt="Advertiser">
                  </div>
                  <span>Advertiser</span>
                </div>
                <div class="user-container right" data-user="2" data-toggle="tooltip" data-placement="top" title="Lorem ipsum dolor sit amet, consectetur adipiscing elit.">
                  <div class="user-crop">
                    <img width="100" height="100" src="<?php bloginfo('template_url'); ?>/assets/images/ic_publisher.svg" alt="Publisher">
                    <img width="100" height="100" src="<?php bloginfo('template_url'); ?>/assets/images/ic_publisher_fill.svg" alt="Publisher">
                  </div>
                  <span>Publisher</span>
                </div>
                <div class="usergroup-error">You need to select one of these options.</div>
              </div>
          </div>
        </div>
        <div class="modal-footer">
          <div id="signupbutton" class="form-container">
            <button id="registersubmit" type="submit" class="btn sign-up-btn btn-primary" value="validate">Sign Up</button>
          </div>
        </div>
        </form>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
    <span class="bottom-info">Already have an account? <a href="" id="gotosignin">Sign In</a></span>
  </div><!-- /. modal-wrapper -->
</div><!-- /.modal -->