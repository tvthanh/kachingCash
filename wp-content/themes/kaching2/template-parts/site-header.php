<div id="alerts-container"></div>

<header kaching-header ng-if="!isPanelPage">
    <nav class="navbar navbar-main clearfix">
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

            <span user-nav-bar logged-in="loggedIn" is-homepage="false"></span>

        </div>
    </nav>
</header>
