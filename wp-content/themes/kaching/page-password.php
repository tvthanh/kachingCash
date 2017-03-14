
<?php while (have_posts()) : the_post(); ?>
	<div class="wrap container" role="document">
  	<div class="row">
		<toastr></toastr>
	</div> 	
  	<div class="content row">
		  <?php get_template_part('templates/page', 'header'); ?>
		  <?php get_template_part('templates/content', 'page'); ?>

			<div class="col-md-7">
				<form id="savesettings" class="form-horizontal" data-parsley-validate>

				  <div class="form-group">
				    <label for="inputPassword" class="col-sm-2 control-label">New Password:</label>
				    <div class="col-sm-6">
				      <input id="settingpass" type="password" class="form-control" id="inputPassword" required="" placeholder="Password" data-parsley-required-message="New password is required.">
				    </div>

				  </div>
				  <div class="form-group">
				    <label for="inputPassword" class="col-sm-2 control-label">Repeat:</label>
				    <div class="col-sm-6">
				      <input type="password" class="form-control" id="inputPassword" placeholder="Repeat Password" required="" data-parsley-equalto="#settingpass" data-parsley-required-message="Required.">
				    </div>

				  </div>
				  <div class="form-group">
				    <label class="col-sm-2 control-label"></label>
				    <div class="col-sm-10">
				      <button type="submit" class="btn btn-primary" value="validate">Save</button> 
				    </div>
				  </div>
				</form>
			</div>


		</div>
	</div>
<?php endwhile; ?>	