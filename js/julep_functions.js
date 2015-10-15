var SERVER = WPURLS.SERVER;
var ButtonLoaded = false;
jQuery(function(){
		jQuery(document).on('click', '.edit-attachment', function () {
			jQuery( document ).ajaxComplete(function( event, xhr, settings ) {
			  if ( settings.url === ajaxurl ) {
				  if(!ButtonLoaded){
					ButtonLoaded = true;
					jQuery('.imgedit-menu').find('.clear').before('<div id="julep-image-text-editor" onclick="bind_julep_editor();" class="imgedit julep-editor-button" title="">Text</div>');
				  }
			  }
			});
		});
		jQuery(document).on('click', '.media-modal-icon', function(){
			ButtonLoaded = false;
		});
		jQuery(document).on('click', '.imgedit-submit :input', function(){
			ButtonLoaded = false;
		});
});

var julep_save_url = SERVER+'/wp-content/plugins/julep-editor/julep_ajax.php';


function bind_julep_editor()
{
	if(jQuery('.imgedit-undo').hasClass('disabled') && jQuery('.imgedit-crop').hasClass('disabled'))
	{
		if(jQuery('.imgedit-crop-wrap').length > 0 )
		{
			var julep_post_id	= jQuery('.imgedit-crop-wrap').attr('id');
			julep_post_id 		= julep_post_id.replace('imgedit-crop-', '');
			var wp_image_src 	= encodeURIComponent(jQuery('.imgedit-crop-wrap').find('img').attr('src'));
		}
		else if(jQuery("img[id^='image-preview-']").length > 0)
		{
			var julep_post_id	= jQuery("img[id^='image-preview-']").attr('id');
			julep_post_id 		= julep_post_id.replace('image-preview-', '');
			var wp_image_src 	= encodeURIComponent(jQuery("img[id^='image-preview-']").attr('src'));
		}
		
		if(jQuery('.imgedit-crop-wrap').find('#julep-editor-container').length < 1 )
		{
				jQuery('#julep-image-text-editor').after('<span class="julep_spinner spinner is-active" style="float:left !important;"></span>');
				
				var load_src = load_actual_image(julep_post_id, wp_image_src);
				
				//jQuery("#image-preview-"+julep_post_id).on('load', function() {
					//var julep_interval = setInterval(function (){
						//if(jQuery("#image-preview-"+julep_post_id).attr('src') == load_src){
						
							
							/*jQuery('.julep_text').on('keypress', function(event) {
								console.log(456);
								event.preventDefault();
								//jQuery(this).draggable( "destroy" );
							});*/
							
							/*jQuery('.julep_text').draggable().click(function() { 
								jQuery(this).draggable({
									disabled: true
								}); 
								}) .blur(function() { 
									jQuery(this).draggable({
										disabled: false
									}); 
								});*/
							
							//clearInterval(julep_interval);
						//}
							
					//}, 500);
				//});
		}
	}
	else
	{
		alert('You have changes in image. Please save those changes first.');
	}
}

jQuery.fn.selectText = function()
{
    var doc = document;
    var element = this[0];
    if (doc.body.createTextRange) {
        var range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
		var selection = window.getSelection();        
        var range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function getCumulativeOffset(obj)
{
	var coord = new Array(); 
    var left, top;
    left = top = 0;
    if (obj.offsetParent) {
        do {
            left += obj.offsetLeft;
            top  += obj.offsetTop;
        } while (obj = obj.offsetParent);
    }
	coord[0] = left;
	coord[1] = top;
	return coord;
}

function get_coordinates(target, relative_to)
{
	var coord = new Array(); 
	var cont = jQuery('#'+target);
	var offset = cont.offset();
	coord[0] = offset.left;
	coord[1] = jQuery('#'+relative_to).height()- offset.top;
	return coord;
}

function getContentDiagonal()
{
	var contentWidth = jQuery(".julep_text").width();
	var contentHeight = jQuery(".julep_text").height();
	return contentWidth * contentWidth + contentHeight * contentHeight;
} 

function get_params(function_name_string)
{
	var regExp = /\(([^)]+)\)/;
	var matches = regExp.exec(function_name_string);
	return matches[1];
}

function bind_julep_close(julep_post_id, wp_image_src)
{
	jQuery('#julep_text_close').on('click', function(){
		unbind_julep_editor(julep_post_id, wp_image_src);
	});
}

function add_julep_text_tools()
{
	var julep_image_width = jQuery('.imgedit-crop-wrap').find('img').width();
	var julep_cont_len = jQuery('.imgedit-crop-wrap').find('#julep-editor-container').length + 1;
	jQuery('.imgedit-crop-wrap').find('img').wrapAll( "<div id='julep-editor-container' class='ui-widget-content' style='width:"+julep_image_width+"px;'>");
	jQuery('#julep-editor-container').append("<div contenteditable='true' class='julep_text ui-widget-content' id='julep_text-'"+julep_cont_len+" style='position:absolute;'>Write your text here ..<div class='drag_handler'></div></div>"); //<div class='julep_rotator julep_text-1'></div>
	
	jQuery('#julep_text-'+julep_cont_len).focus();
	
	if(jQuery('#julep-font-family-cont').length < 1)
	{ 
		var fonts_tools = '<div id="julep-font-family-cont" class=""><select id="julep-font-family"><option value="">Select font family</option><option value="arialregular" style="font-family:arialregular !important;">Arial</option><option value="helvetica" style="font-family:helvetica !important;">Helvetica</option><option value="verdana" style="font-family:verdana !important;">Verdana</option><option value="Courier Condensed" style="font-family:Courier Condensed !important;">Courier Condensed</option><option value="arvoregular" style="font-family:arvoregular !important;">Arvo</option><option value="droid_serifregular" style="font-family:droid_serifregular !important;">Droid Serif</option><option value="latoregular" style="font-family:latoregular !important;">Lato</option><option value="merriweatherregular" style="font-family:merriweatherregular !important;">Merri Weather</option><option value="open_sansregular" style="font-family:open_sansregular !important;">Open Sans</option><option value="playfair_displayregular" style="font-family:playfair_displayregular !important;">Playfair Display</option><option value="pt_sansregular" style="font-family:pt_sansregular !important;">PT Sans Web</option><option value="pt_serifregular" style="font-family:pt_serifregular !important;">PT Sarif Web</option></select></div>';
				
		fonts_tools +='<div id="julep-font-size-cont" class=""><input type="text" id="julep-font-size" name="julep-font-size" style="width:60px !important" placeholder="Font Size" />px</div>';
		
		fonts_tools +='<div id="julep-font-weight-cont" class="julep-text-tools">B</div>';
		fonts_tools +='<div id="julep-font-italic-cont" class="julep-text-tools">I</div>';
		//fonts_tools +='<div id="julep-font-underline-cont" class="imgedit julep-text-tools">U</div>';
		//fonts_tools +='<div id="julep-font-color_cont" class="imgedit julep-text-tools"><input type text id="julep-font-color" name="julep-font-color" /></div>';
		jQuery('#julep-editor-container').after('<div id="julep-text-tools-container"></div>');
		jQuery("#julep-text-tools-container").append('<div id="julep-font-color_cont" class=""><input type text id="julep-font-color" name="julep-font-color" /></div>');
		jQuery('#julep-text-tools-container').append(fonts_tools);
		jQuery('#julep-text-tools-container').append('<div id="julep_text_close" class="julep-text-tools"></div>');
	}
}

function julep_draggable()
{
	jQuery(".julep_text").draggable({ 
			containment: "parent",
			handle: ".drag_handler",
			drag: function( event, ui ) {
				julep_height = jQuery(this).outerHeight() ;
				jQuery(this).css('width', '');
				jQuery(this).css('height', '');
			},
		});
}

function bind_unbind()
{
	jQuery(".julep_text").on('keyup', function() {
		var contentHeight = jQuery(".julep_text").height();
		if(typeof(jQuery(this).resizable( "instance" )) != 'undefined'){
			jQuery(this).rotatable('destroy');
			jQuery(this).resizable( "destroy" );
			jQuery(this).draggable( "destroy" );
			jQuery(this).css( "height", 'auto' );
		}
		jQuery(this).css( "height", contentHeight );
		jQuery(this).rotatable();
		julep_resizable();
		julep_draggable();
		
	});
	
}

function enable_wp_options()
{
	//console.log('enable_wp_options');
	//jQuery('.imgedit-crop').removeClass('disabled');
	jQuery('.imgedit-rleft').removeClass('disabled');
	jQuery('.imgedit-rright').removeClass('disabled');	
	jQuery('.imgedit-flipv').removeClass('disabled');
	jQuery('.imgedit-fliph').removeClass('disabled');
	//jQuery('.imgedit-undo').removeClass('disabled');
	//jQuery('.imgedit-redo').removeClass('disabled');
	
	//jQuery('.edit-media-header').find('.dashicons').show();
}

function disable_wp_options()
{
	//console.log('disable_wp_options');
	//jQuery('.imgedit-crop').addClass('disabled');
	jQuery('.imgedit-rleft').addClass('disabled');
	jQuery('.imgedit-rright').addClass('disabled');	
	jQuery('.imgedit-flipv').addClass('disabled');
	jQuery('.imgedit-fliph').addClass('disabled');
	//jQuery('.imgedit-undo').addClass('disabled');
	//jQuery('.imgedit-redo').addClass('disabled');
	//jQuery('.edit-media-header').find('.dashicons').hide();
}

function unbind_julep_editor(julep_post_id, wp_image_src)
{
	if(confirm('Do you want to discard the text changes ?'))
	{
		jQuery('.julep_text').rotatable('destroy');
		jQuery('.julep_text').resizable( "destroy" );
		jQuery('.julep_text').draggable( "destroy" );
		jQuery(".julep_text").remove();
		jQuery('#julep-text-tools-container').remove();
		jQuery('#image-preview-'+julep_post_id).unwrap();
		enable_wp_options();
		
		jQuery(".imgedit-submit-btn").attr('disabled', 'disabled');
		var default_save = jQuery(".imgedit-submit-btn").attr('onclick');
		var default_params = get_params(default_save);
		jQuery(".imgedit-submit-btn").removeAttr('onclick');
		jQuery(".imgedit-submit-btn").attr('onclick', 'imageEdit.save('+default_params+')');
		jQuery("#image-preview-"+julep_post_id).attr("src", decodeURIComponent(wp_image_src)+"?julep="+new Date().getTime());
	}
}

(function($) {
    $.fn.textfill = function(maxFontSize) {
        maxFontSize = parseInt(maxFontSize, 10);
        return this.each(function(){
            var ourText = $(".ui-resizable", this),
                parent = ourText.parent(),
                maxHeight = parent.height(),
                maxWidth = parent.width(),
                fontSize = parseInt(ourText.css("fontSize"), 10),
                multiplier = maxWidth/ourText.width(),
                newSize = (fontSize*(multiplier-0.1));
            ourText.css(
                "fontSize", 
                (maxFontSize > 0 && newSize > maxFontSize) ? 
                    maxFontSize : 
                    newSize
            );
        });
    };
})(jQuery);
	
var initDiagonal = null;
var initFontSize = null;
var myDiagonal = 0 ;
function julep_resizable()
{
		jQuery(".julep_text").resizable({
			containment: "parent",
			cancel: ".drag_handler",
			create: function(event, ui) {
				if(!initDiagonal)
					initDiagonal = getContentDiagonal();
				if(!initFontSize){
				initFontSize = jQuery(this).css("font-size");
				initFontSize = initFontSize.replace('px', '');
				}
				
			},
			resize: function(e, ui) {
				//jQuery('.julep_text').textfill();
				
				var newDiagonal = getContentDiagonal();
				var ratio = newDiagonal / initDiagonal;
				
				/*if(parseInt(myDiagonal) > parseInt(newDiagonal))
				{
					console.log(1);
					var julep_font_txt_size = parseInt(initFontSize) + (ratio * 1.2);
				}
				else
				{
					console.log(2);*/
					var julep_font_txt_size = parseInt(initFontSize) + (ratio * 1.2);
				//}
				var julep_length = jQuery('.julep_text').text().length
				//console.log(julep_length+' --- '+ratio+ ' --- ' +initFontSize+ ' --- ' +julep_font_txt_size);
				jQuery(this).css("font-size", julep_font_txt_size+'px');
				
				//jQuery(this).css("line-height", julep_font_txt_size+'px');
				jQuery(this).css("line-height", 'normal');
				var rot_top = jQuery(this).find('.ui-rotatable-handle').css('top');
				rot_top = rot_top.replace('px', '');
				//console.log(jQuery(this).height())
				jQuery(this).find('.ui-rotatable-handle').css('top', jQuery(this).height() + 2);
				
				myDiagonal = newDiagonal;
			}
		});
		//console.log('Initial Diagonal '+ initDiagonal);
		/*jQuery( ".julep_text" ).on( "resizecreate", function( event, ui ) {
		initDiagonal = getContentDiagonal();
				initFontSize = jQuery(this).css("font-size");
				initFontSize = initFontSize.replace('px', '');
				console.log('3f-'+initFontSize);	
		} );*/
}

function get_rotation(id)
{
	var el = document.getElementById(id);
	var st = window.getComputedStyle(el, null);
	var tr = st.getPropertyValue("-webkit-transform") ||
			 st.getPropertyValue("-moz-transform") ||
			 st.getPropertyValue("-ms-transform") ||
			 st.getPropertyValue("-o-transform") ||
			 st.getPropertyValue("transform") ||
			 "FAIL";

	// With rotate(30deg)...
	// matrix(0.866025, 0.5, -0.5, 0.866025, 0px, 0px)

	//console.log('Matrix: ' + tr);
	
	if(typeof(tr) != 'Undefined' && tr != 'none')
	{	
		// rotation matrix - http://en.wikipedia.org/wiki/Rotation_matrix
		
		var values = tr.split('(')[1].split(')')[0].split(',');
		var a = values[0];
		var b = values[1];
		var c = values[2];
		var d = values[3];
		
		var scale = Math.sqrt(a*a + b*b);
		
		//console.log('Scale: ' + scale);
		// arc sin, convert from radians to degrees, round
		var sin = b/scale;
		// next line works for 30deg but not 130deg (returns 50);
		// var angle = Math.round(Math.asin(sin) * (180/Math.PI));
		var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
	}
	else
	{
		var angle = 0;
	}
	return angle;
//	console.log('Rotate: ' + angle + 'deg');
}

function load_actual_image(julep_post_id, wp_image_src)
{
	if(jQuery('.imgedit-crop-wrap').length > 0 )
	{
		var julep_image_source = encodeURIComponent(jQuery('.imgedit-crop-wrap').find('img').attr('src'));
	}
	else
	{
		var julep_image_source = encodeURIComponent(jQuery('#image-preview-'+julep_post_id).find('img').attr('src'));
		
	}
	jQuery.ajax({
				type: 'POST',
				url: julep_save_url,
				data: "action=load_actual_image&julep_image_source="+julep_image_source+'&julep_post_id='+julep_post_id,
				cache: false,
				dataType: 'json',
				success: function(response){
					//console.log(response);
					if(response.result == 'error')
					{
						return true;
					}
					else
					{
						var new_src = response.actual_image_url+"?julep="+new Date().getTime();
						jQuery("#image-preview-"+julep_post_id).attr("src", new_src);
						jQuery("#image-preview-"+julep_post_id).attr("onload", 'julep_loading('+julep_post_id+', "'+julep_image_source+'");');
						return new_src;
					}
				}
			});
}

function julep_loading(julep_post_id, wp_image_src)
{
	
	add_julep_text_tools();
							
	julep_draggable();
	
	//jQuery(".julep_text").selectable();
	/*jQuery(".julep_text").on("focus", function () {
		jQuery(this).selectText();
	});*/
	

	julep_resizable();


	// Add Color Picker to all inputs that have 'color-field' class
	jQuery(function() {
		jQuery('#julep-font-color').wpColorPicker({
			defaultColor: '#000',
			change: function(event, ui) {
				//console.log(ui.color.toString());
				jQuery(".julep_text").css('color', ui.color.toString());
			}
		});
	});
	
	jQuery('#julep-font-family').on('change', function(){
		jQuery(".julep_text").css('font-family', jQuery('#julep-font-family option:selected').val());
	});
	
	jQuery('#julep-font-size').on('keyup', function(){
		jQuery(".julep_text").css('font-size', jQuery('#julep-font-size').val()+'px');
	});
	
	jQuery('#julep-font-weight-cont').on('click', function(){
		if(jQuery(".julep_text").css('font-weight') != 'bold' && jQuery(".julep_text").css('font-weight') != '700')
			jQuery(".julep_text").css('font-weight', 'bold');
		else
			jQuery(".julep_text").css('font-weight', '');
	});
	
	jQuery('#julep-font-italic-cont').on('click', function(){
		if(jQuery(".julep_text").css('font-style') != 'italic')
			jQuery(".julep_text").css('font-style', 'italic');
		else
			jQuery(".julep_text").css('font-style', 'normal');
	});
	
	jQuery('#julep-font-underline-cont').on('click', function(){
		if(jQuery(".julep_text").css('text-decoration') != 'underline')
			jQuery(".julep_text").css('text-decoration', 'underline');
		else
			jQuery(".julep_text").css('text-decoration', 'none');
	});
	
	jQuery(".imgedit-submit-btn").removeAttr('disabled');
	var default_save = jQuery(".imgedit-submit-btn").attr('onclick');
	var default_params = get_params(default_save);
	jQuery(".imgedit-submit-btn").removeAttr('onclick');
	jQuery(".imgedit-submit-btn").attr('onclick', 'check_julep_mode('+default_params+')');
	
	jQuery('.julep_text').rotatable();
	
	bind_unbind();
	disable_wp_options();
	bind_julep_close(julep_post_id, wp_image_src);
	jQuery(".julep_spinner").remove();
	
	jQuery('.julep_text').on('click', function(event) {
		if(typeof(jQuery(this).resizable( "instance" )) != 'undefined'){
			jQuery(this).draggable( "destroy" );
			jQuery(this).resizable( "destroy" );
			jQuery(this).rotatable( "destroy" );
			/*var _julep_text = jQuery(this).text();
			jQuery(this).html('<textarea id="_julep_text">'+_julep_text+'</textarea>');*/
		}
	});
	
	jQuery('.julep_text').on('mouseout', function(event) {
		/*var _julep_text_val = jQuery('#_julep_text').val();
		jQuery(this).html(_julep_text_val);*/
		julep_draggable();
		julep_resizable();
		jQuery(this).rotatable();
		
	});
	
	jQuery('.julep_text').on('keydown', function(event){
	 if(event.keyCode == 37 || event.keyCode == 39)
	 {
	   event.stopPropagation();
	 }
	});
}
function check_julep_mode(julep_post_id, save_id)
{
	if(jQuery('.imgedit-crop-wrap').find('#julep-editor-container').length > 0 )
	{
		var julep_text_info = new Array();
		var julep_image_source = encodeURIComponent(jQuery('.imgedit-crop-wrap').find('img').attr('src'));
		jQuery('.julep_text').each(function( julep_text_index, julep_text_value ){
			var julep_text_id = jQuery(this).attr('id');
			julep_text_info[julep_text_index] = get_coordinates(julep_text_id, 'julep-editor-container');
			//julep_text_info[julep_text_index] = getCumulativeOffset(jQuery(this));
			
			/*var julep_text_data = jQuery(this).html();
			
			julep_text_data = julep_text_data.replace('/<br\s*[\/]?>/gi', "\n")
			
			
			julep_text_data = julep_text_data.replace(/(<([^>]+)>)/ig,"");*/
			
			
			
			jQuery(this).find('div').remove().end();
			var julep_text_data = jQuery(this).html();
    		julep_text_data = julep_text_data.replace('/<br[^>]*>/gi', "\n");	
			
			
			
			
			
			julep_text_info[julep_text_index][2] = julep_text_data;
			
			
			julep_text_info[julep_text_index][3] = get_rotation(julep_text_id);
			
			julep_text_info[julep_text_index][4] = jQuery(this).css('left');
			julep_text_info[julep_text_index][5] =  jQuery(this).css('top');
			julep_text_info[julep_text_index][6] = jQuery('#julep-editor-container').find('img').height();
			julep_text_info[julep_text_index][7] = jQuery('#julep-editor-container').find('img').width();
			julep_text_info[julep_text_index][8] = jQuery(this).css('font-family');
			julep_text_info[julep_text_index][9] = jQuery(this).css('font-size');
			julep_text_info[julep_text_index][10] = jQuery(this).css('font-weight');
			julep_text_info[julep_text_index][11] = jQuery(this).css('font-style');
			julep_text_info[julep_text_index][12] = jQuery(this).css('text-decoration');
			julep_text_info[julep_text_index][13] = jQuery(this).css('color');
			
		});
		//julep_text_info = [[51, 158, "Sample Text"], [51, 158, "Sample Text"], [51, 158, "Sample Text"]]
		//console.log(julep_text_info);
		//if(confirm('Do you want to save the text changes ?'))
//		{
			jQuery.ajax({
				type: 'POST',
				url: julep_save_url,
				data: "action=save_julep_image&julep_text_info="+JSON.stringify(julep_text_info)+"&julep_image_source="+julep_image_source+'&julep_post_id='+julep_post_id,
				cache: false,
				dataType: 'json',
				success: function(response){
					//console.log(response);
					if(response.result == 'error')
					{
						jQuery('#imgedit-response-' + julep_post_id).html('<div class="error"><p>' + response.message + '</p></div>');
						imageEdit.close(julep_post_id);
						
					}
					else
					{
						//console.log( decodeURIComponent(SERVER+julep_image_source+"&julep="+new Date().getTime()));
						imageEdit.close(julep_post_id);
						jQuery(".details-image").attr("src", response.actual_image_url+"?julep="+new Date().getTime());
						jQuery('li[data-id="'+julep_post_id+'"]').find('img').attr("src", jQuery('li[data-id="'+julep_post_id+'"]').find('img').attr("src")+"?julep="+new Date().getTime());
						jQuery('.imgedit-size-preview').attr("src", jQuery('.imgedit-size-preview').attr("src")+"?julep="+new Date().getTime());
						//imageEdit.refreshEditor(julep_post_id, );
					}
				}
			});
		//}
	}
}