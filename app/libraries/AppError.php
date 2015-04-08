<?php 

class AppError{

	public static function isAdmin(){
		$url = explode("/",$_SERVER['REQUEST_URI']);

	    if($url[1] == "admin"){
        	return true;
        }else{
        	return false;
        }
        
	}
}


?>