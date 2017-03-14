<?php while (have_posts()) : the_post(); ?>

	<div class="wrap container contact-page" role="document">
		
  	<div class="content row">
			<toastr></toastr>
			<div class="col-md-8 contact-left">

				<?php get_template_part('templates/page', 'header'); ?>
			  <?php get_template_part('templates/content', 'page'); ?>

				<p class="contact-page-desc">If you have any enquiries, please feel free to contact us using the following contact form or simply drop us an email - <a href="mailto:contact@kaching.one">contact@kaching.com</a></p>
				<?php echo do_shortcode( '[contact-form-7 id="120" html_class="form-horizontal" title="Contact form 1"]' ); ?>
<!-- 				<form id="contactform" data-parsley-validate method="post" class="form-horizontal" >
				  <div class="form-group">
				    <label class="col-sm-3 control-label">Full Name:</label>
				    <div class="col-sm-3">
				      <input id="fname" name="fname" type="text" class="form-control" placeholder="First Name" required="" data-parsley-required-message="Required.">
				    </div>
				    <div class="col-sm-6">
				      <input id="lname" name="lname" type="text" class="form-control" placeholder="Last Name" required="" data-parsley-required-message="Last name is required.">
				    </div>
				  </div>
				  <div class="form-group">
				    <label class="col-sm-3 control-label">Email:</label>
				    <div class="col-sm-9">
				      <input id="contactemail" name="contactemail" type="email" class="form-control" placeholder="E-mail Adress" required="" data-parsley-required-message="E-mail is required.">
				    </div>
				  </div>
				  <div class="form-group">
				    <label class="col-sm-3 control-label">Title:</label>
				    <div class="col-sm-9">
				      <input id="title" name="title" type="text" class="form-control" placeholder="Enquiry title" required="" data-parsley-required-message="Title is required.">
				    </div>
				  </div>
				  <div class="form-group">
				    <label class="col-sm-3 control-label">Message:</label>
				    <div class="col-sm-9">
				    	<textarea id="message" name="message" class="form-control" cols="30" rows="4" placeholder="How can we help you ?"  required="" data-parsley-required-message="Message is required."></textarea>
				    </div>
				  </div>
				 
				  <div class="form-group">
				    <label class="col-sm-3 control-label"></label>
				    <div class="col-sm-9">
				      <button type="submit" class="btn btn-primary" value="validate">Send</button>
				    </div>
				  </div>
				</form> -->
			</div>

			<div class="col-md-3 contact-right">
				<h2 class="sub-header">Address details</h2>
				<p class="contact-page-desc">MBFC Tower 3, 17/F, 12 <br>Marina Boulevard <br>Singapore 018982</p>
			</div>


		</div>
	</div>
<?php endwhile; ?>	