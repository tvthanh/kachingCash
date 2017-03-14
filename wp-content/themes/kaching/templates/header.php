<header class="banner" role="banner">
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <!-- Brand and toggle get grouped for better mobile display -->
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="<?php
              // usertype = 1 : advertiser
              // usertype = 2 : developer
              // usertype = 3 : business partner
              if ( $_COOKIE["usertype"] == 1 ) {
                echo esc_url( trailingslashit( home_url('campaigns/') ));
              } elseif ( $_COOKIE["usertype"] == 2 ){
                echo esc_url( trailingslashit( home_url('api-keys') ));
              } else {
                echo esc_url( trailingslashit( home_url() ));
              };
          ?>">
          <!-- <img src="<?php bloginfo('template_url'); ?>/assets/images/logo-wow.png" alt="<?php bloginfo('name'); ?>"> -->
            <img id="logo" src="<?php bloginfo('template_url'); ?>/assets/images/logo.png" alt="">
        </a>
      </div>

      <!-- Collect the nav links, forms, and other content for toggling -->
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <?php
        if (has_nav_menu('primary_navigation')) :
          wp_nav_menu(['theme_location' => 'primary_navigation', 'menu_class' => 'nav navbar-nav']);
        endif;
        ?>
        <?php
            if(isset($_COOKIE["username"])){
        ?>
          <ul class="nav navbar-nav navbar-right">
            <li class="dropdown dropdown-inverse">
              <a id="name" href="#" class="dropdown-toggle username" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><?php echo $_COOKIE["username"]; ?><span class="wicon-down"></span></a>
              <ul class="dropdown-menu">
                <li><a href="<?= esc_url(home_url('/')); ?>settings">Settings</a></li>
                <!-- <li role="separator" class="divider"></li> -->
                <li><a id="signout" href="home">Sign out</a></li>
              </ul>
            </li>
          </ul>
        <?php
          } else {
        ?>
          <ul class="nav navbar-nav navbar-right">
            <li class="signinup">
              <a role="button" type="button" data-toggle="modal" data-target="#myModal">Sign In</a>
              <!-- <span class="hidden-xs hidden-sm">|</span> -->
              <br class="hidden-md hidden-semi hidden-lg"><br class="hidden-md hidden-semi hidden-lg">
              <a role="button" type="button" data-toggle="modal" data-target="#myModal2">Sign Up</a>
            </li>
          </ul>
        <?php
          }
        ?>
      </div><!-- /.navbar-collapse -->
    </div><!-- /.container -->
  </nav>
</header>
    <?php include get_template_part('templates/sign-in-modal'); ?>
    <?php include get_template_part('templates/sign-up-modal'); ?>
    <?php include get_template_part('templates/register-success-modal'); ?>
    <?php include get_template_part('templates/reset-pass-modal'); ?>
    <?php include get_template_part('templates/pass-success-modal'); ?>
    <?php include get_template_part('templates/info-modal'); ?>