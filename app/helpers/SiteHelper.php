<?php

class SiteHelper{

	private static $config = "";
    public static $metas = "";

    public function __construct(){
    }
    public static function config(){
    	self::$config = Admin\SiteConfig::where('id',1)->get();
    }
	public  static function head(){
		
		$head = '<title>'.self::$config[0]->nome.'</title>';
		$head .= '<meta charset="utf-8">';
		$head .= '<meta http-equiv="content-language" content="pt-br">';
    	$head .= '<meta content="width=device-width,initial-scale=1.0,user-scalable=no;user-scalable=0;" name="viewport">';
		$head .= '<meta content="'.self::$config[0]->meta_description.'" name="description">';
		$head .= '<meta content="'.self::$config[0]->meta_keywords.'" name="keywords">';
		$head .= '<meta content="'.self::$config[0]->meta_author.'" name="author">';

		echo $head;
	}
	public static function analytics(){
		$parametros = json_decode(self::$config[0]->parametros);
		$codigo = "";
		if($parametros->mostrar_google_analytics){
			$codigo = $parametros->codigo_google_analytics;
		}
		echo $codigo;
	}
}
?>