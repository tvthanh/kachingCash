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

<div class="container docs">
    <div class="content row">
        <div class="col-md-4 docs-nav">

            <ul class="docs-sidebar-nav">
                <?php if ( count($faq_pages) > 0 ) { ?>
                <li>
                    <a href="<?php echo get_post_type_archive_link( 'kaching_faq' ); ?>">FAQ</a>
                    <ul>
                        <?php foreach ( $faq_pages as $faq_page ) { ?>
                        <li><a href="<?php echo get_permalink( $faq_page ); ?>"><?php echo $faq_page->post_title; ?></a></li>
                        <?php } ?>
                    </ul>
                </li>
                <?php } ?>
                <li class=""><a href="#">Contact</a></li>
            </ul>

        </div>
        <div class="col-md-8 wrap">

            <?php if ( have_posts() ) { while ( have_posts() ) { the_post(); ?>
                <h2><a href=""><?php the_title(); ?></a></h2>
            <?php }} ?>

        </div>
    </div>
</div>


<?php get_footer(); ?>