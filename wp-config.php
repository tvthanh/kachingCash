<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

 // ** MySQL settings - You can get this info from your web host ** //
 /** The name of the database for WordPress */
 define('DB_NAME', 'kaching_db');

 /** MySQL database username */
 define('DB_USER', 'tvthanh');

 /** MySQL database password */
 define('DB_PASSWORD', '123456');

 /** MySQL hostname */
 define('DB_HOST', '127.0.0.1:8889');

 /** Database Charset to use in creating database tables. */
 define('DB_CHARSET', 'utf8');

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
// define('DB_NAME', 'dbkaching');

/** MySQL database username */
  // define('DB_USER', 'ifm');

/** MySQL database password */
// define('DB_PASSWORD', 'Ifm2016');

/** MySQL hostname */
// define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
// define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

define( 'WP_SITEURL', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         ')=NzB^=K)M-99yrXPp;rqTu,Ept +D43U`ppqT|IPVVq|le3Zhl_u.CdNEjM0IT=');
define('SECURE_AUTH_KEY',  'lo&3$>VNwDhGIUTAJQyAc[|@|neG(0j,MjrLq9V<8Og9 W;!6}|fnOLb8f98-be_');
define('LOGGED_IN_KEY',    'p}TU>-&CVBx;[+5W&Hgr;6+9^Kb}@[~+!DE,!QtoFl@8b:Oi!$MB>w%8V.P[_j/*');
define('NONCE_KEY',        'z;|F]v?Mjy-+C_4F~J)eIgs9tuCk)8abK`Iv9^-M?P3)X+={c9bj(>Eb%?tY6!ut');
define('AUTH_SALT',        'bJziGd%LIzwM:qh4<,8i-NhbKu#hU`EqG32|<,]nPVW9[]$$Lf}5NW{3bZF5urld');
define('SECURE_AUTH_SALT', '+cO>|#,? eZ{g@cU1]!$eZ9A7I_}o!^0aF#Q<G1kiJxAPm?;Jk|%o>n$5III4p63');
define('LOGGED_IN_SALT',   'fcWG^~YxziL8%O~9>KaSLl)4+g;?hdCR|s!`de-S0`2cT2U&JHY(6?4_5|-#R!MJ');
define('NONCE_SALT',       'M4U%g7Mz1wB%%gpjm;$}K-#]l=p9}|>zC<<1Lp+t7->7iBH5~$5uu.dkDTcO8p<i');
define ( 'WPCF7_AUTOP', false );
define('WPCF7_LOAD_CSS', false);
/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

if ( file_exists( ABSPATH . 'wp-config-env.php' ) ) {
    include(ABSPATH . 'wp-config-env.php');
}

if ( ! defined( 'KACHING_CMS_API_URL' ) ) {
    define( 'KACHING_CMS_API_URL', 'http://api-dev.kachingcash.com/cms-api' );
    // define( 'KACHING_CMS_API_URL', 'http://54.179.156.207/cms-api' );
    define( 'ULAB_API_URL', 'http://search.ulab.com');
    // define( 'KACHING_CMS_API_URL', 'http://52.77.145.129/cms-api' );
    define( 'KACHING_CMS_API_URL', 'http://api-staging.kachingcash.com/cms-api' );
}

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);
define('WP_ENV', 'development');

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
    define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
