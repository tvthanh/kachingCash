<?php 
    if(isset($_COOKIE["username"])){
?>   
<?php while (have_posts()) : the_post(); ?>
	<div class="wrap container" role="document">
  	<div class="row">
		<toastr></toastr>
	</div>  	
	<form id="settingsForm" class="form-horizontal" autocomplete="false" data-parsley-validate>
  	<div class="content row settings">
<!-- 		  <?php get_template_part('templates/page', 'header'); ?> -->

		  <?php get_template_part('templates/content', 'page'); ?>
		<div class="page-header">
			<div class="col-xs-12">
				<h1>
					Account settings
				</h1>
			</div>
		</div>
			<div class="col-md-8">

				  <div class="form-group">
				    <label class="col-sm-3 control-label">Full Name:</label>
				    <div class="col-sm-4">
				      <input id="firstName" value="test" class="form-control" required="" data-parsley-required-message="Required.">
				    </div>
				    <div class="col-sm-5">
				      <input id="lastName" type="text" class="form-control" placeholder="Last Name" required="" data-parsley-required-message="Last name is required.">
				    </div>
				  </div>
				  <div class="form-group">
				    <label class="col-sm-3 control-label">Email:</label>
				    <div class="col-sm-9">
				      <input id="settingsemail" type="email" class="form-control" placeholder="E-mail Adress" required="" data-parsley-required-message="E-mail is required.">
				    </div>
				  </div>
				  <div class="form-group">
				    <label for="inputPassword" autocomplete="false" class="col-sm-3 control-label">Password:</label>
				    <div class="col-sm-5">
				      <input id="settingpass" type="password" class="form-control" id="inputPassword" placeholder="Password"  required="" data-parsley-required-message="Password is required." >
				    </div>
				    <div class="col-sm-4">
				      <span data-toggle="modal" data-target="#passwordModal" class="btn btn-block btn-primary">Change Password</span>
				    </div>
				  </div>
				  <div class="form-group">
				    <label class="col-sm-3 control-label">Company:</label>
				    <div class="col-sm-9">
				      <input id="settingcompany" type="text" class="form-control" placeholder="Company Name"  required="" data-parsley-required-message="Company name is required.">
				    </div>
				  </div>
<!-- 				  <div class="form-group">
				    <label class="col-sm-2 control-label"></label>
				    <div class="col-sm-10">
				      <span id="savesettings" class="btn btn-primary">Save</span>
				    </div>
				  </div> -->

				<hr>
			</div>


		</div>

		<div class="content row">
		<div class="page-header">
			<div class="col-xs-12">
				<h1>
					Bank account information
				</h1>
			</div>
		</div>		
			<div class="col-md-8">

				  <div class="form-group">
				    <label class="col-sm-3 control-label">Country:</label>
				    <div class="col-sm-9 selectwrapsettings">
				      <select id="bank_country" class="form-control">
				      	<option value="USA">USA</option>
				      	<option value="France">France</option>				      	
				      </select>
				    </div>

				  </div>
				  <div class="form-group">
				    <label class="col-sm-3 control-label">Account Owner:</label>
				    <div class="col-sm-9">
				      <input id="bank_account_owner_name" type="text" class="form-control" placeholder="Account Owner">
				    </div>
				  </div>
				  <div class="form-group">
				    <label for="inputPassword" class="col-sm-3 control-label">Bank Name:</label>
				    <div class="col-sm-9">
				      <input id="bank_name" type="text" class="form-control" placeholder="Bank Name">
				    </div>

				  </div>
				  <div class="form-group">
				    <label class="col-sm-3 control-label">Account number:</label>
				    <div class="col-sm-9">
				      <input id="bank_account_number" type="text" class="form-control" placeholder="Bank Account Number">
				    </div>
				  </div>
				  <div class="form-group">
				    <label class="col-sm-3 control-label"></label>
				    <div class="col-sm-9">
				      <button id="savesettings" type="submit" class="btn btn-primary" value="validate">Save</button>
				    </div>
				  </div>
			
			</div>			
		</div>
		</form>
	</div>
<?php endwhile; ?>	
<?php } else {?>
	<div class="wrap container" role="document">
	  	<div class="row">
			<toastr></toastr>
		</div>
	</div>
<?php } ?>
<?php include get_template_part('templates/change-password-modal'); ?>	