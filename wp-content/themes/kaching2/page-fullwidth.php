<?php
/**
 * Template Name: Full width
 */
?>

<?php get_header(); ?>

<div class="wrap container contact-page" role="document">
<?php while (have_posts()) : the_post(); ?>
	<?php the_content(); ?>
<?php endwhile; ?>
</div>

<?php get_footer(); ?>