<?php

$faq_pages = get_posts(array(
    'posts_per_page'   => -1,
    'offset'           => 0,
    'orderby'          => 'title',
    'order'            => 'DESC',
    'post_type'        => 'kaching_faq',
    'post_status'      => 'publish'
));

get_header();

?>

<?php if ( have_posts() ) { while ( have_posts() ) { the_post(); ?>

<div class="container docs">
    <div class="content row">
        <div class="col-md-4 docs-nav">

            <ul class="docs-sidebar-nav">
                <?php if ( count($faq_pages) > 0 ) { ?>
                <li>
                    <a href="<?php echo get_post_type_archive_link( 'kaching_faq' ); ?>">FAQ</a>
                    <ul>
                        <?php foreach ( $faq_pages as $faq_page ) { ?>
                        <li class="<?php if ( $faq_page->ID == get_the_id() ) echo 'current' ?>"><a href="<?php echo get_permalink( $faq_page ); ?>"><?php echo $faq_page->post_title; ?></a></li>
                        <?php } ?>
                    </ul>
                </li>
                <?php } ?>
                <li class=""><a href="#">Contact</a></li>
            </ul>

        </div>
        <div class="col-md-8 wrap">

            <article class="">
                <header>
                    <h1 class="entry-title"><?php the_title(); ?></h1>
                </header>
                <div class="entry-content">
                   <?php the_content(); ?>
                </div>
            </article>

        </div>
    </div>
</div>

<?php }} ?>

<?php get_footer(); ?>