<?php 
    if(isset($_COOKIE["username"])){
?> 
<?php while (have_posts()) : the_post(); ?>
  <div class="wrap container" role="document">
  	<div class="row">
		<toastr></toastr>
	</div>  
  	<div class="content report">

  		<?php get_template_part('templates/page', 'header'); ?>

  		<?php get_template_part('templates/content', 'page'); ?>
  		<div class="row">
  			<div class="selectwrap">
              <select id="keystatus" class="form-control" data-parsley-id="30">
                <option value="true">TEST</option>
                <option value="false">PRODUCTION</option>
              </select>
              <select id="keystatus" class="form-control" data-parsley-id="30">
                <option value="true">TEST</option>
                <option value="false">PRODUCTION</option>
              </select>
              <select id="keystatus" class="form-control" data-parsley-id="30">
                <option value="true">TEST</option>
                <option value="false">PRODUCTION</option>
              </select>   
              <select id="keystatus" class="form-control" data-parsley-id="30">
                <option value="true">TEST</option>
                <option value="false">PRODUCTION</option>
              </select>                                            
              <select id="keystatus" class="form-control" data-parsley-id="30">
                <option value="true">TEST</option>
                <option value="false">PRODUCTION</option>
              </select>                 
            </div>
  		</div>
		<div class="row">	
			<canvas class="chart" id="myChart" style="width:100%"></canvas>
		</div>
		<div class="row">
			<div class="col-md-4">
				<h4>Viewers age</h4>
				<div class="col-md-3">12-18</div>
				<div class="col-md-9">	
					<div class="progress">
					  <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="70"
					  aria-valuemin="0" aria-valuemax="100" style="width:70%">
					    1.521
					  </div>
					</div>
				</div>					
				<div class="col-md-3">19-24</div>
				<div class="col-md-9">	
					<div class="progress">
					  <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="70"
					  aria-valuemin="0" aria-valuemax="100" style="width:60%">
					    1.254
					  </div>
					</div>
				</div>	
				<div class="col-md-3">25-34</div>
				<div class="col-md-9">	
					<div class="progress">
					  <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="70"
					  aria-valuemin="0" aria-valuemax="100" style="width:50%">
					    1.031
					  </div>
					</div>
				</div>	
				<div class="col-md-3">35-44</div>
				<div class="col-md-9">	
					<div class="progress">
					  <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="70"
					  aria-valuemin="0" aria-valuemax="100" style="width:30%">
					    1.521
					  </div>
					</div>
				</div>	
				<div class="col-md-3">45+</div>
				<div class="col-md-9">	
					<div class="progress">
					  <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="70"
					  aria-valuemin="0" aria-valuemax="100" style="width:10%">
					    1.521
					  </div>
					</div>
				</div>																												

			</div>
			<div class="col-md-4">
				<h4>Location</h4>
				<div class="col-md-3">12-18</div>
				<div class="col-md-9">	
					<div class="progress">
					  <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="70"
					  aria-valuemin="0" aria-valuemax="100" style="width:70%">
					    1.521
					  </div>
					</div>
				</div>					
				<div class="col-md-3">19-24</div>
				<div class="col-md-9">	
					<div class="progress">
					  <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="70"
					  aria-valuemin="0" aria-valuemax="100" style="width:60%">
					    1.254
					  </div>
					</div>
				</div>	
				<div class="col-md-3">25-34</div>
				<div class="col-md-9">	
					<div class="progress">
					  <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="70"
					  aria-valuemin="0" aria-valuemax="100" style="width:50%">
					    1.031
					  </div>
					</div>
				</div>	
				<div class="col-md-3">35-44</div>
				<div class="col-md-9">	
					<div class="progress">
					  <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="70"
					  aria-valuemin="0" aria-valuemax="100" style="width:30%">
					    1.521
					  </div>
					</div>
				</div>	
				<div class="col-md-3">45+</div>
				<div class="col-md-9">	
					<div class="progress">
					  <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="70"
					  aria-valuemin="0" aria-valuemax="100" style="width:10%">
					    1.521
					  </div>
					</div>
				</div>									
			</div>
			<div class="col-md-4">
				<h4>Gender</h4>
				<div class="col-md-3">Male</div>
				<div class="col-md-9">	
					<div class="progress">
					  <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="70"
					  aria-valuemin="0" aria-valuemax="100" style="width:70%">
					    1.521
					  </div>
					</div>
				</div>					
				<div class="col-md-3">Female</div>
				<div class="col-md-9">	
					<div class="progress">
					  <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="70"
					  aria-valuemin="0" aria-valuemax="100" style="width:30%">
					    1.254
					  </div>
					</div>
				</div>	

			</div>
		</div>


			<?php include get_template_part('templates/details-modal'); ?>			
			<?php include get_template_part('templates/confirmation-modal'); ?>
			<?php include get_template_part('templates/newkeymodal'); ?>			

<!--               <div class="loader">
                <svg class="circular" viewBox="25 25 50 50">
                  <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
                </svg>
                <p class="text-center">Loading...</p>
              </div> -->


	  </div><!-- /.content -->

	</div><!-- /.wrap -->

<?php endwhile; ?>
<?php } else {?>

	<?php include get_template_part('templates/sessionClosed'); ?>

<?php } ?>