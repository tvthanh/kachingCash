<?php 
    if($_COOKIE["usertype"] == 1){
?> 
<?php while (have_posts()) : the_post(); ?>
	<div class="wrap container" role="document">
  	<div class="row">
		<toastr></toastr>
	</div>  	
  	<div class="content row">
		  <?php get_template_part('templates/content', 'page'); ?>
	<div id="wrapper">
        <!-- Sidebar -->
        <div id="sidebar-wrapper">
            <ul class="sidebar-nav">
                <li class="sidebar-brand">
					<h2>New Campaign</h2>
					<p>Make your campaign<br>
customized to your own needs.</p>
                </li>

                <li>
                    <a href="#" data-step="1" class="active-tab">Step 1<br><span class="tab-title">Campaign Details</span></a>
                </li>
                <li class="separator"></li>                
                <li>
                    <a href="#" data-step="2">Step 2<br><span class="tab-title">Campaign Media</span></a>
                </li>
                <li class="separator"></li>                
                <li>
                    <a href="#" data-step="3">Step 3<br><span class="tab-title">Campaign Products</span></a>
                </li>
                <li class="separator"></li>                
                <li>
                    <a href="#" data-step="4">Step 4<br><span class="tab-title">Confirmation</span></a>
                </li>



				<a href="/campaigns" class="btn btn-primary exit-editor">Exit from campaign creator</a>
            </ul>

        </div>
        <!-- /#sidebar-wrapper -->

        <!-- Page Content -->
        <div id="page-content-wrapper">
            <div class="container-fluid">
            	<div id="step1" class="step current-tab">
					<?php include get_template_part('templates/step1'); ?>
	            </div>
            	<div id="step2" class="step">
					<?php include get_template_part('templates/step2'); ?>
	            </div>
            	<div id="step3" class="step">
					<?php include get_template_part('templates/step3'); ?>            	          
	            </div>	
            	<div id="step4" class="step">
					<?php include get_template_part('templates/step4'); ?>
	            </div>	                        	            
            </div>
        </div>
    </div>
        <!-- /#page-content-wrapper -->		
			<?php include get_template_part('templates/infoModal'); ?>
            <?php include get_template_part('templates/confirmation-modal'); ?>            
            <?php include get_template_part('templates/MediaLibraryModal'); ?>            
            <?php include get_template_part('templates/ProductLibraryModal'); ?>             
			<!-- Loader -->



	  </div><!-- /.content -->
	</div><!-- /.wrap -->
<?php endwhile; ?>
<?php } else {?>

	<?php include get_template_part('templates/sessionClosed'); ?>

<?php } ?>
