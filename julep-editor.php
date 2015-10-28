<?php
/*
  Plugin Name: Julep Editor
  Plugin URI: http://getjulep.com
  Description: Julep Image Text Editor.
  Version: 1.0
  Author: Slocum Studio <discover@slocumstudio.com>
  Author URI: https://slocumstudio.com
 */
if(!class_exists('wp_julep_editor'))
{
    class wp_julep_editor
    {
		public $plugin_url;
		
        /**
        * Construct
        */
        public function __construct()
        {
			//$this->julep_editor_files_enqueue();
			add_action( 'wp_enqueue_styles','julep_editor_enqueue_scripts' );
			add_action( 'wp_enqueue_scripts','julep_editor_enqueue_scripts' );
        }

        /**
        * Activate the plugin
        */
        public static function activate()
        {	
            add_option( 'julep_editor_activation', 'active' );
        }
        
        /**
        * Deactivate the plugin
        */     
        static function deactivate()
        {
            delete_option( 'julep_editor_activation');
        } 
		
        /**
        * Include Default styles
        */  
        public function julep_editor_enqueue_style()
        {
			wp_enqueue_style( 'julep_css', plugins_url( 'css/julep.css' , __FILE__ ));
			wp_enqueue_style( 'wp-color-picker' );
        }
		
		/**
        * Include Default Scripts
        */  
        public function julep_editor_enqueue_scripts()
        {
			wp_enqueue_script('jquery-ui-core');  
			wp_enqueue_script('jquery');
			wp_enqueue_script('jquery-ui-resizable');
			wp_enqueue_script('jquery-ui-draggable');
			wp_enqueue_script('jquery-ui-selectable');
			wp_enqueue_script( 'wp-color-picker' ); 
			
			wp_enqueue_script('jquery.ui.rotatable', plugins_url( 'js/jquery.ui.rotatable.js' , __FILE__ ), '', '', true );
			wp_enqueue_script('qunit', 'http://code.jquery.com/qunit/qunit-1.12.0.js', '', '', true );
			
			wp_enqueue_script('julep_functions', plugins_url( 'js/julep_functions.js' , __FILE__ ), '', '', true );
			
			wp_localize_script('qunit', 'WPURLS', array( 'SERVER' => get_option('siteurl') ));
			
        }
		
    } // End Class
}

if(class_exists('wp_julep_editor'))
{
	$wp_julep_editor = new wp_julep_editor();
	register_activation_hook( __FILE__, array( 'wp_julep_editor', 'activate' ));
	register_deactivation_hook(__FILE__, array('wp_julep_editor', 'deactivate'));
}