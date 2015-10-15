<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once('../../../wp-load.php');
require_once('../../../wp-admin/includes/file.php');
require_once('../../../wp-admin/includes/image.php');
require_once('../../../wp-admin/includes/image-edit.php');


function save_julep_image($julep_post)
{
	//print_r($_POST);
	$julep_text_info 	= json_decode(stripslashes($_POST['julep_text_info']));
	$julep_image_source	= urldecode($_POST['julep_image_source']);
	$julep_post_id 		= $_POST['julep_post_id'];
	
	if(isset($julep_text_info) && !empty($julep_text_info))
	{
		$julep_image_path 	= wp_get_attachment_image_src($julep_post_id, 'full');
		$actual_image_url 	= $julep_image_path[0];
		$julep_image_source 	= get_home_path().str_replace(get_site_url().'/', '', $julep_image_path[0]);
		$file_type_info 	= wp_check_filetype( $julep_image_source);
		$julep_metadata 		= wp_get_attachment_metadata($julep_post_id);
		
		/*$julep_file_contents = file_get_contents($julep_image_source);
		if(isset($julep_metadata['sizes']) && !empty($julep_metadata['sizes']))
		{
			$julep_mime_type = $julep_metadata['sizes']['thumbnail']['mime-type'];
			$julep_img_ext 	= str_replace('image/', '', $julep_metadata['sizes']['thumbnail']['mime-type']);
			
			$julep_content_img = "rate-bar-bg-" . $i . ".jpg";
			$imageContent = file_get_contents("http://www.lafourchette.com/p-3.3.0/default/" . $imageName);
			file_put_contents($imageName, $imageContent);
		}
		
		print_r($julep_metadata);
		exit;*/
		$imagecreatefrom = 'imagecreatefrom'.str_replace('image/', '', $file_type_info['type']);
		if(isset($file_type_info) && !empty($file_type_info))
		{
			$responses = array();
			foreach($julep_text_info as $julep_key => $julep_text_single)
			{
				header('Content-type: '.$file_type_info['type']);
				$julep_image = $imagecreatefrom($julep_image_source);
				
				$julep_font_family 		= (isset($julep_text_single[8]) 	&& $julep_text_single[8]  != '')?$julep_text_single[8] :'arial';
				$julep_font_size 		= (isset($julep_text_single[9]) 	&& $julep_text_single[9]  != '')?$julep_text_single[9] :12;
				$julep_font_weight 		= (isset($julep_text_single[10]) && $julep_text_single[10] != '')?$julep_text_single[10]:'normal';
				$julep_font_style 		= (isset($julep_text_single[11]) && $julep_text_single[11] != '')?$julep_text_single[11]:'normal';
				$julep_text_decoration 	= (isset($julep_text_single[12]) && $julep_text_single[12] != '')?$julep_text_single[12]:'none';
				$julep_text_color 	    = (isset($julep_text_single[13]) && $julep_text_single[13] != '')?$julep_text_single[13]:'#ffffff';
				$julep_rgb 				= rgb_to_array($julep_text_color);
				$julep_text_color 		= imagecolorallocate($julep_image, $julep_rgb[0], $julep_rgb[1], $julep_rgb[2]);
				
				if((strtolower($julep_font_weight) == 'bold' || $julep_font_weight == 700) && strtolower($julep_font_style) == 'italic')
				{
					$julep_ttf = 'Bold_Italic.ttf';
				}
				elseif(strtolower($julep_font_weight) == 'bold' || $julep_font_weight == 700)
				{
					$julep_ttf = 'Bold.ttf';
				}
				elseif(strtolower($julep_font_style) == 'italic')
				{
					$julep_ttf = 'Italic.ttf';
				}
				else
				{
					$julep_ttf = 'Regular.ttf';
				}
				
				$julep_font_path = 'fonts/'.strtolower($julep_font_family).'/'.$julep_ttf;	
				
				$julep_font_size = px_to_point($julep_font_size);
				
				$julep_text = str_replace('<br>', "\n", $julep_text_single[2]);
				//echo $julep_text;
				$coords = offset_to_xy_coords($julep_text_single[4], $julep_text_single[5], $julep_text_single[6], $julep_text_single[7], $julep_metadata['height'], $julep_metadata['width']);
				//print_r($coords);
				$julep_text_single[3] = css_rotaion_to_angle($julep_text_single[3]);

				$julep_response = imagettftext( $julep_image , $julep_font_size , (int)$julep_text_single[3], $coords['x'] , $coords['y'] , $julep_text_color , $julep_font_path, $julep_text );
				//print_r($julep_response);
				$image_type = str_replace('/', '', $file_type_info['type']);
				
				$image_type($julep_image, $julep_image_source);
				
				if(isset($julep_metadata['sizes']) && !empty($julep_metadata['sizes']))
				{
					$upload_path = pathinfo($julep_image_source);
					foreach($julep_metadata['sizes'] as $s_key => $size)
					{
						$image = wp_get_image_editor( $julep_image_source );
						if ( ! is_wp_error( $image ) ) {
							$image->resize( $size['width'], $size['height'], true );
							$image->save( $upload_path['dirname'].'/'.$size['file'] );
						}
					}
				}

				imagedestroy($julep_image);
				if(isset($julep_response) && !empty($julep_response))
				{
					$responses[] = $julep_response;
				}
				else
				{
					echo json_encode(array('result' => 'error', 'message' => "Error occured while saving text changes.", 'actual_image_url' => $actual_image_url));
				}
				
			}
			if(!isset($responses) || empty($responses))
			{
				echo json_encode(array('result' => 'error', 'message' => "No text saved.", 'actual_image_url' => $actual_image_url));
			}
			else
			{
				echo json_encode(array('result' => 'success', 'message' => "Changes saved.", 'actual_image_url' => $actual_image_url));
			}
		}
		else
		{
			echo json_encode(array('result' => 'error', 'message' => "No text to be saved.", 'actual_image_url' => $actual_image_url));
		}
		
	}
	else
	{
		echo json_encode(array('result' => 'error', 'message' => "No text saved.", 'actual_image_url' => $actual_image_url));
	}
	exit;
}

function px_to_point($px)
{
	$pt = ($px * 3)/4 ;
	return $pt = round($pt, 2);	
}
function css_rotaion_to_angle($rotation)
{
	if($rotation == 0)
	{
		return 0;
	}
	else if($rotation < 0)
	{
		return abs($rotation);
	}
	else if($rotation <= 270 && $rotation > 0)
	{
		
		return 270 - $rotation + 90;
	}
	else
	{
		return $rotation;
	}
}

function rgb_to_array($color)
{
	$color = str_replace(array('rgb(', ')', ' '), '', $color);
	return $arr = explode(',', $color);
}

function hex2rgb($hex)
{
   $hex = str_replace("#", "", $hex);

   if(strlen($hex) == 3) {
      $r = hexdec(substr($hex,0,1).substr($hex,0,1));
      $g = hexdec(substr($hex,1,1).substr($hex,1,1));
      $b = hexdec(substr($hex,2,1).substr($hex,2,1));
   } else {
      $r = hexdec(substr($hex,0,2));
      $g = hexdec(substr($hex,2,2));
      $b = hexdec(substr($hex,4,2));
   }
   $rgb = array($r, $g, $b);
   //return implode(",", $rgb); // returns the rgb values separated by commas
   return $rgb; // returns an array with the rgb values
}

function offset_to_xy_coords($left, $top, $img_height, $img_widht, $actual_hieght, $actual_width)
{
	$coords = array();
	$top = (int) $top + 12;
	$left = (int) $left;

	$coords['x'] = $left;//@($left / $img_widht) * $actual_width;
	$coords['y'] = $top;//@($top / $img_height) * $actual_hieght;
	
	return $coords;
}

function get_actual_image()
{
	$julep_image_source	= urldecode($_POST['julep_image_source']);
	$julep_post_id 		= $_POST['julep_post_id'];
	
	$julep_image_path 	= wp_get_attachment_image_src($julep_post_id, 'full');
	$actual_image_url 	= $julep_image_path[0];
	echo json_encode(array('result' => 'success', 'message' => "Actual URL attached.", 'actual_image_url' => $actual_image_url));
	exit;
}

if(isset($_POST['action']) && $_POST['action'] == 'save_julep_image')
{
	save_julep_image($_POST['julep_post_id']);
}

if(isset($_POST['action']) && $_POST['action'] == 'load_actual_image')
{
	get_actual_image($_POST['julep_post_id']);
}