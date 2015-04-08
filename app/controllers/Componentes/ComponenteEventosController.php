<?php
namespace Componentes;
class ComponenteEventosController extends BaseController {

	protected $evento;
	protected $evento_categoria;
	
	public function __construct(\Admin\Evento $evento,\Admin\EventoCategoria $evento_categoria){
		$this->evento = $evento;
		$this->evento_categoria = $evento_categoria;
	}
	public function getProduto(){
    	$input = \Input::all();
    	if(isset($input['apelido'])){
    		$produto = $this->produto->where('apelido',$input['apelido'])->where('publicado',true)->get();
		}else{
			$produto = $this->produto->where('id',$input['produto_id'])->where('publicado',true)->get();
		}
		$fotos = array();
		$caracteristicas = array('tipos'=>[],'caracteristicas'=>[]);
		$categoria = array();
		$produtos_relacionados = array();
		$menu_itens = array();

		if(count($produto) > 0){

			/*======== GET FOTOS =========*/
			$fotos = $this->produto_foto->where('produto_id',$produto[0]->id)->where('publicado',true)->orderBy('ordem')->get();
			
			/*======== GET CARACTERISTICAS =========*/
			$tipos = $this->produto_produto_caracteristica->select('pct.id','pct.descricao')->join('produto_caracteristica_tipos as pct','produto_produto_caracteristicas.produto_caracteristica_tipo_id','=','pct.id')->where('produto_id',$produto[0]->id)->where('pct.publicado',true)->orderBy('pct.ordem')->get()->unique();
			$c = $this->produto_produto_caracteristica->join('produto_caracteristicas as pc','produto_produto_caracteristicas.produto_caracteristica_id','=','pc.id')->where('produto_id',$produto[0]->id)->where('publicado',true)->orderBy('produto_produto_caracteristicas.ordem')->get()->unique();
			$caracteristicas = array('tipos'=>$tipos,'caracteristicas'=>$c);

			/*======== GET CATEGORIA =========*/
			$categoria = $this->produto_categoria->find($produto[0]->produto_categoria_id);

			/*======== GET PRODUTOS RELACIONADOS =========*/
			$produtos_relacionados = $this->produto_relacionado->selectRaw('p.id,p.apelido,p.titulo,p.valor,p.mini_descricao,p.produto_categoria_id,(SELECT imagem FROM produto_fotos pf WHERE pf.produto_id = p.id and capa = true) as imagem,(SELECT alt FROM produto_fotos pf WHERE pf.produto_id = p.id and capa = true) as alt')->join('produtos as p','produto_relacionados.produto_relacionado_id','=','p.id')->where('p.publicado',true)->where('produto_relacionados.publicado',true)->where('produto_id',$produto[0]->id)->orderBy('produto_relacionados.ordem')->get();
		    if(count($produtos_relacionados) > 0){
		    	$menu_itens = $this->menu_item->select('apelido','parametros')->where('componente','produto')->where('tipo','categoria-de-produto')->where('publicado',true)->get();
		    }

		}
		$response = array('produto' => $produto,'fotos' => $fotos,'caracteristicas'=>$caracteristicas,'categoria' => $categoria,'produtos_relacionados' => $produtos_relacionados,'menu_itens' => $menu_itens);
		return \Response::json($response);
	}
	public function getCategoria(){
    	$input = \Input::all();
    	$eventos = array();
    	$categoria = array();

    	$categoria = $this->evento_categoria->where('id',$input['id'])->where('publicado',true)->get();
    	$selectP = "id,titulo,subtitulo,apelido,local,data_fim,data_inicio,";
    	$selectP .= "(SELECT imagem FROM evento_fotos WHERE evento_id = eventos.id and capa = true) as capa,";
    	$selectP .= "(SELECT alt FROM evento_fotos WHERE evento_id = eventos.id and capa = true) as alt_capa";
    	
    	if($input["status"] == 3){
    		$eventos = $this->evento->selectRaw($selectP)->where('evento_categoria_id',$input['id'])->where('publicado',true)->get();
    	}else{
    		$eventos = $this->evento->selectRaw($selectP)->where('evento_categoria_id',$input['id'])->where('publicado',true)->where('status',$input['status'])->get();
    	}
    	

		$response = array('eventos' => $eventos,'categoria' => $categoria);
		
		return \Response::json($response);
	}
}
?>