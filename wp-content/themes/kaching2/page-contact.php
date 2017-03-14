<?php
/**
 * Template Name: Contact
 */
?>

<?php get_header(); ?>

<?php while (have_posts()) : the_post(); ?>

<div class="wrap container contact-page" role="document">
  	<div class="content row">
		<div class="col-md-8 contact-left">
			<p class="contact-page-desc">If you have any enquiries, please feel free to contact us using the following contact form or simply drop us an email - <a href="mailto:contact@kaching.one">contact@kaching.com</a></p>
			<?php echo do_shortcode( '[contact-form-7 id="120" html_class="form-horizontal" title="Contact form 1"]' ); ?>
		</div>

		<div class="col-md-3 contact-right">
			<h2 class="sub-header">Address details</h2>
			<p class="contact-page-desc">MBFC Tower 3, 17/F, 12 <br>Marina Boulevard <br>Singapore 018982</p>
		</div>
	</div>
</div>
<?php endwhile; ?>

<?php get_footer(); ?>