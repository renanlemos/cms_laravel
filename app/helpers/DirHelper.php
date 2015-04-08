<?php

class DirHelper{

	public static function generateLinksToPath($path,$tipo_link){
    	$files = array_diff(scandir(public_path($path)), array('..', '.'));
		foreach($files as $key => $value){
			if(is_file(public_path($path."/".$value))){
				 switch ($tipo_link) {
        			case 'css':
        			   echo "<link href='".asset($path."/".$value)."' type='text/css' rel='stylesheet' />";
        			break;
        			case 'js':
        			    echo "<script src='".asset($path."/".$value)."' type='text/javascript'></script>";
        			break;
       			 }
			}
		}
		
	}
		
}

?>