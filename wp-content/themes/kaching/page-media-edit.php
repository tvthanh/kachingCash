<?php 
    if($_COOKIE["usertype"] == 1){
?> 
<div class="wrap container" role="document">
	<div class="row">
	<toastr></toastr>
</div>  
	<form id="editMedia">	
	<div class="content">

	  <?php get_template_part('templates/page', 'header'); ?>
	  <?php get_template_part('templates/content', 'page'); ?>


	  <button type="submit" class="btn btn-primary btn-tab-action">Accept</button>	    
	<div class="row">

			<div class="col-md-4">
				<h3>Media details</h3>

				<span>Name:</span>
				<div class="form-group">
					<input name="name" type="text" class="form-control media-title">
				</div>


			<span>Added date:</span>
			<p class="media-added">10/02/2016</p>			

<!-- 			<span>Last used date:</span>
			<p class="media-used">10/02/2016</p>	 -->	

			<span>Status:</span>
			<p class="status">Active</p>

			<h3>History</h3>		
			<div class="media-history">
				
			</div>		
			</div>
			<div class="col-md-8">
	          <div id="addmediacontent" class="form-container">
	                           
	              <div class="form-group video-group clearfix">
	                <span class="file-input btn btn-block btn-upload btn-file video-1">
	                    <input name="video" type="file" multiple>
	                </span>
	                <span class="">VIDEO 16:9</span> 
	              </div>

	              <div class="form-group upload-holder images-container">
					<div class="image-container-1">
		                <span class="file-input btn btn-upload btn-file file-1">
		                    <input name="summary_image" type="file" multiple>
		                </span>
						<span class="size">260x170</span> 
					</div>
					<div class="image-container-2">
		                <span class="file-input btn btn-upload btn-file file-2">
		                    <input name="landscape" type="file" multiple>
		                </span>
		                <span class="size">100x160</span>
					</div>
					<div class="image-container-3">
		                <span class="file-input btn btn-upload btn-file file-3">
		                     <input name="portrait" type="file" multiple>
		                </span>
		                <span class="size">320x300</span>
	                </div>
	              </div>                                          
	          </div>

			</div>

	</div>
			<?php include get_template_part('templates/infoModal'); ?>

  </div><!-- /.content -->
</form>  
</div><!-- /.wrap -->
<?php } else {?>

	<?php include get_template_part('templates/sessionClosed'); ?>

<?php } ?>