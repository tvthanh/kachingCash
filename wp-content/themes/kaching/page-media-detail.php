<?php 
    if($_COOKIE["usertype"] == 1){
?> 
<div class="wrap container" role="document">
	<div class="row">
	<toastr></toastr>
</div>  	
	<div class="content">

	  <?php get_template_part('templates/page', 'header'); ?>
	  <?php get_template_part('templates/content', 'page'); ?>

	  <a href="" type="button" class="btn btn-default btn-tab-action pull-100-left edit">Edit</a>	
	  <button type="button" class="btn btn-primary btn-tab-action btn-del">Remove</button>	    
	<div class="row">
		<div class="col-md-4">
			<h3>Media details</h3>

			<span>Name:</span>
			<p class="media-title"></p>

			<span>Added date:</span>
			<p class="media-added">10/02/2016</p>			

<!-- 			<span>Last used date:</span>
			<p class="media-used">10/02/2016</p>	 -->	

			<span>Status:</span>
			<p class="status">Active</p>

			<h3>History</h3>		
			<div class="media-history">
				
			</div>
<!-- 			<p>The Martian Campaign</p>
			<span class="date-create">10/02/2016</span>

			<p>The Martian</p>
			<span class="date">10/02/2016</span>	 -->		
		</div>
		<div class="col-md-8">
			<video class="videoSrc" type="video/mp4" controls>

			</video>
			<span class="size">Video 16:9</span>
			<div class="images-container">
				<div class="image-container-1"></div>
				<div class="image-container-2"></div>
				<div class="image-container-3"></div>
			</div>

		</div>
	</div>

		<?php include get_template_part('templates/confirmation-modal'); ?>
  </div><!-- /.content -->
</div><!-- /.wrap -->
<?php } else {?>

	<?php include get_template_part('templates/sessionClosed'); ?>

<?php } ?>