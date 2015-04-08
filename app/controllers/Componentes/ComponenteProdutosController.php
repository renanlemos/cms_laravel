<?php
namespace Componentes;
class ComponenteProdutosController extends BaseController {

	protected $produto;
	protected $produto_foto;
	protected $produto_categoria;
	protected $produto_relacionado;
	protected $produto_caracteristica_tipo;
	protected $produto_produto_caracteristica;
	protected $menu_item;

	public function __construct(\Admin\Produto $produto,\Admin\ProdutoCategoria $produto_categoria,\Admin\ProdutoFoto $produto_foto,\Admin\ProdutoProdutoCaracteristica $produto_produto_caracteristica,\Admin\ProdutoCaracteristicaTipo $produto_caracteristica_tipo,\Admin\ProdutoRelacionado $produto_relacionado,\Admin\MenuItem $menu_item){
		$this->produto = $produto;
		$this->produto_produto_caracteristica = $produto_produto_caracteristica;
		$this->produto_foto = $produto_foto;
		$this->produto_categoria = $produto_categoria;
		$this->produto_caracteristica_tipo = $produto_caracteristica_tipo;
		$this->produto_relacionado = $produto_relacionado;
		$this->menu_item = $menu_item;
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
    	$produtos = [];
    	$categoria = $this->produto_categoria->where('id',$input['categoria_id'])->where('publicado',true)->get();
    	$selectP = "id,titulo,valor,apelido,parametros,mini_descricao,";
    	$selectP .= "(SELECT imagem FROM produto_fotos WHERE produto_id = produtos.id and capa = true) as capa,";
    	$selectP .= "(SELECT alt FROM produto_fotos WHERE produto_id = produtos.id and capa = true) as alt_capa";
    	if(count($categoria) > 0){
			$produtos = $this->produto->selectRaw($selectP)->where('produto_categoria_id',$input['categoria_id'])->where('publicado',true)->orderBy('ordem')->get();
		}	
		$data = array('produtos' => $produtos,'categoria' => $categoria);
		
		return \Response::json([$data]);
	}
}
?>