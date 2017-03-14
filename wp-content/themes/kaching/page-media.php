<?php 
    if($_COOKIE["usertype"] == 1){
?> 
<?php while (have_posts()) : the_post(); ?>
	<div class="wrap container" role="document">
  	<div class="row">
		<toastr></toastr>
	</div>  	
  	<div class="content">

		  <?php get_template_part('templates/page', 'header'); ?>
		  <?php get_template_part('templates/content', 'page'); ?>
			 <button id="newAssets" type="button" class="btn btn-primary btn-tab-action">New library</button>		  
		<div class="search-list">   
			
				<form id="searchform">
					
					<div class="form-group col-md-3">
						<label for="sel1">Sort</label>
						<div class="input-bg">	
						  <select class="form-control" id="sel1">
						    <option>Sort by name</option>
						    <option>Sort by added date</option>
						    <option>Sort by last used date</option>
						  </select>
						</div>
					</div>
			
					<div class="form-group col-md-3">
						<label for="search">Name:</label>
						<div class="input-bg">	
							<input id="search" class="form-control" type="text" name="s" placeholder="Search"/>
						</div>
					</div>
					<div class="form-group col-md-3">
						<label for="date">Added date:</label>					
						<div class="input-bg">	
							<input id="date" class="form-control" type="text" name="s" placeholder=""/>
						</div>
					</div>
					<div class="form-group col-md-3">
						<label for="used">Last used date:</label>					
						<div class="input-bg">	
							<input id="used" class="form-control" type="text" name="s" placeholder=""/>
						</div>
					</div>										
				</form>
		</div>
<!-- Assets list -->
		<div id="assets-list" class="assets">
			
		</div>
<!-- End -->
	</div>
			<?php include get_template_part('templates/infoModal'); ?>
			<?php include get_template_part('templates/newAssetsModal'); ?>			
			<?php include get_template_part('templates/confirmation-modal'); ?>
			<!-- Loader -->

              <div class="loader">
                <svg class="circular" viewBox="25 25 50 50">
                  <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
                </svg>
                <p class="text-center">Loading...</p>
              </div>

	  </div><!-- /.content -->
	</div><!-- /.wrap -->
<?php endwhile; ?>
<?php } else {?>

	<?php include get_template_part('templates/sessionClosed'); ?>

<?php } ?>