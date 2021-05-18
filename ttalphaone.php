<?php
/**
 * @package tt_alpha_one
 */
/*
Plugin Name: Alpha One
Plugin URI: https://threethemes.com/
Description: My first plugin.
Version: 1.0.
Author: ThreeThemes
Author URI: https://threethemes.com/
License: GPLv2 or later
Text Domain: tt-alpha-one
*/

/*
This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

Copyright 2021- ThreeThemes, Inc.
*/

// If this file is called directly, abort.
if (!defined('WPINC')) {
	die;
}

// load custom scripts file
require_once(plugin_dir_path(__FILE__). '/includes/ttalphaone-scripts.php');


// load Class file
require_once(plugin_dir_path(__FILE__). '/includes/ttalphaone-class.php');



// register TTalphaone_Widget widget
// so as to be visible in apperance > widgets
function register_ttalphaone_widget() {
    register_widget( 'TTalphaone_Widget' ); //the name of the class
}
add_action( 'widgets_init', 'register_ttalphaone_widget' );