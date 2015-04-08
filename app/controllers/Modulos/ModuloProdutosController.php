<?php
namespace Modulos;
class ModuloProdutosController extends BaseController {

	protected $produto;
	protected $produto_categoria;
	protected $menu_item;

	public function __construct(\Admin\Produto $produto,\Admin\ProdutoCategoria $produto_categoria,\Admin\MenuItem $menu_item){
		$this->produto = $produto;
		$this->produto_categoria = $produto_categoria;
		$this->menu_item = $menu_item;
	}
    public function getProduto(){
    	$input = \Input::all();
		$data = array();
		$produtos = array();
		$menu_itens = array();
		$selectP = "id,titulo,valor,apelido,parametros,mini_descricao,produto_categoria_id,";
    	$selectP .= "(SELECT imagem FROM produto_fotos WHERE produto_id = produtos.id and capa = true) as capa,";
    	$selectP .= "(SELECT alt FROM produto_fotos WHERE produto_id = produtos.id and capa = true) as alt_capa";
		if($input['tipo'] == 'categoria'){
			$produtos = $this->produto->selectRaw($selectP)->where('produto_categoria_id',$input['categoria_id'])->where('publicado',true)->where('destaque',true)->orderBy('ordem')->get();
		}else{
			$produtos_ids = json_decode($input['produtos']);
			foreach ($produtos_ids as $key => $value) {
				$produto = $this->produto->selectRaw($selectP)->where('publicado',true)->where('id',$value)->get();
				array_push($produtos,$produto[0]);
			}
			
		}
		if(count($produtos) > 0){
			$menu_itens = $this->menu_item->select('apelido','parametros')->where('componente','produto')->where('tipo','categoria-de-produto')->where('publicado',true)->get();
		}
		$response = array('produtos' => $produtos,'menu_itens' => $menu_itens);
		return \Response::json($response);
	}

}
?>