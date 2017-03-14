<div id="alerts-container"></div>

<header class="home-banner" kaching-header>

    <nav class="navbar navbar-main navbar-main-home clearfix">
        <div class="navbar-main-container">

            <a class="logo-link btn-move" href="<?php echo trailingslashit( home_url() ); ?>" ng-click="logoClick()" prevent-default>
                <img class="logo" src="<?php bloginfo('template_url'); ?>/assets/images/ic_kaching.png" alt="">
            </a>

            <span panel-nav logged-in="loggedIn"></span>

            <?php
            if (has_nav_menu('main_navigation')) {
                wp_nav_menu([
                    'theme_location' => 'main_navigation',
                    'menu_class' => 'site-nav',
                    'container' => false
                ]);
            }
            ?>

            <span user-nav-bar logged-in="loggedIn" is-homepage="true"></span>

        </div>
    </nav>

    <div class="container vcenter">
        <div class="title text-center">
            <h1 class="wow fadeInUp">Reach the customers in <br/>a few simple steps.</h1>
            <p class="wow fadeInUp" data-wow-delay="0.6s">You are one step from reaching new customers for your business.<br/>Don't miss your chance and start today.
            </p>
        </div>
    </div>

</header>
