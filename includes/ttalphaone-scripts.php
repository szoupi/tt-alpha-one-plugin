<?php
// add scripts
function ttalphaone_add_scripts(){
    // add main CSS
    wp_enqueue_style('ttalphaone-main-style', plugins_url().  '/tt-alpha-one/css/style.css');

    //add main JS
    wp_enqueue_script('ttalphaone-main-script', plugins_url().  '/tt-alpha-one/js/main.js');
}


// hook the function
add_action('wp_enqueue_scripts', 'ttalphaone_add_scripts');
