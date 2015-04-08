<?php

class HomeController extends BaseController {

	protected $site;

    public function __construct(\Admin\SiteConfig $site){
    	$this->site = $site;
    } 
    public function index(){
    	return View::make('templates.padrao.index');
    }
	public function popula(){
		
		//for ($i=8; $i <= 1012; $i++) { 

		//	$pasta = "artigo-".$i;
        //    $dir = public_path("conteudo/artigos/".$pasta);
        //    \File::makeDirectory($dir, 0775);
			/*$input = array(
				'titulo' => 'Blog'.$i,
				'apelido' => 'blog'.$i,
				'artigo_categoria_id' => 4,
				'publicado' => true,
				'destaque' => false,
				'mostrar_titulo' => false,
				'tag_titulo' => 'h1',
				'mini_descricao' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
				'descricao' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
				'meta_title' => '',
				'meta_description' => '',
				'meta_keywords' => '',
				'meta_author' => '',
				'parametros' => json_encode(array("class"=>"","id"=>"")) 

			);
			$teste = '{"class":"","id":"","template":"padrao.html"}';
			$teste1 = array("class"=>"teste","id"=>"teste","template"=>"padrao.html");
			$teste1 = array("class"=>"teste","id"=>"teste","template"=>"padrao.html");
			$t = json_encode($teste1);
			$update = array(
			  "parametros" => $t
			
			);*/
			//$item = \Admin\Artigo::find($i);
			//$item->update($update);
		//}
		$hospedagem = Admin\EventoEventoHospedagem::select('nome')->rightJoin('evento_hospedagems as ev','ev.id','=','evento_evento_hospedagems.evento_hospedagem_id')->where('evento_evento_hospedagems.id',7)->get();

		echo $hospedagem[0]->nome;
	
	}

}
