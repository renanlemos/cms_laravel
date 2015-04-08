<?php
namespace admin;

class ProdutosController extends BaseController {

	protected $produto;
	protected $produto_categoria;

	public function __construct(Produto $produto,ProdutoCategoria $produto_categoria){
		$this->produto = $produto;
		$this->produto_categoria = $produto_categoria;
		$this->beforeFilter('csrf', array('on' => 'put|delete|post'));
	}
	public function grid(){
		$input = \Input::all();
        $where = "";
        $sort_campo = "id";
        $sort_dir = "desc";
        
        if(isset($input['sort'])){
        	$sort_campo = $input['sort'][0]['field'];
        	$sort_dir = $input['sort'][0]['dir'];
        } 
		if(isset($input["filter"]) and !empty($input["filter"])){
			$where = $this->filters($input["filter"]);
			$dados = $this->produto->whereRaw($where)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $total = count($this->produto->whereRaw($where)->get());
        }else{
        	$dados = $this->produto->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
        	$total = $this->produto->all()->count();
        }
     	$data = array("data" => $dados,"total" => $total,"categorias"=>$this->comboCategorias());
		return \Response::json($data);
	}
	public function combo(){
		$input = \Input::all();
		$data = $this->produto->select('id as value','titulo as text')->where('id','<>',$input['produto_id'])->get();
		return \Response::json($data);
	}
	public function comboAll(){
		$input = \Input::all();
		$data = $this->produto->select('id as value','titulo as text')->get();
		return \Response::json($data);
	}
	public function comboCategorias(){
		$data = $this->produto_categoria->select("id as value","titulo as text")->get()->toArray();
    	return $data;
	}
	public function store(){
		 
	    $input = \Input::all();
	    if(empty($input['apelido'])){
			$input['apelido'] = \AppString::formataApelido($input['titulo']);
		}
		$validation = \Validator::make($input,Produto::rules(0),Produto::messages());
		if($validation->passes()){
			if($this->produto->create($input)){
				$data = array("data" => "Registro criado com sucesso.","status" => 1);
			}else{
				$data = array("data" => "Erro ao cadastrar.","status" => 1);
			}
			return \Response::json($data);
		}else{
			$data = array("data" => $validation->messages(),"status" => 0);

			return \Response::json($data);	
		}
			
	}
	public function update(){
		$input = array_except(\Input::all(), '_method');
		$id = $input["id"];
		if(empty($input['apelido'])){
			$input['apelido'] = \AppString::formataApelido($input['titulo']);
		}
		$validation = \Validator::make($input,Produto::rules($id),Produto::messages(true));
		$input['parametros'] = json_encode($input['parametros']);

		if ($validation->passes()){
			$categoria = $this->produto->find($id);
			
			if($categoria->update($input)){
				$data = array("data" => "Registro alterado com sucesso.","status" => 1);
				return \Response::json($data);
			}else{
				$data = array("data" => "Não foi realizar o cadastro.","status" => 0);
				return \Response::json($data);
			}
		}else{
			$data = array("data" => $validation->messages(),"status" => 0);
			return \Response::json($data);
		}
	}
	public function updateStatus(){
		$input = \Input::all();
		$produto = $this->produto->find($input['id']);
		$data_update = [$input['campo']=>$input['publicado']];
		if($input['campo'] == 'destaque'){
			$data_update = [$input['campo']=>$input['destaque']];
		}
		if($produto->update($data_update)){
			$data = array("data" => "Registro alterado com sucesso.","status" => 1);
		}else{
			$data = array("data" => "Erro ao Alterar.","status" => 0);
		}
		return \Response::json($data);
	}
	public function getOrdem(){
		$input = \Input::all();
		$data = $this->produto->select('id','titulo')->orderBy('ordem')->get();
		
		return \Response::json($data);
	}
	public function updateOrdem(){
		$input = \Input::all();
		$teste = array();

		foreach($input['itens'] as $key => $value) {
		 $item = explode('_',$value);	
		 $banner = $this->produto->find($item[1]);
		 $data = array("ordem" => ($key+1));
		 $banner->update($data);	
		}
		return \Response::json(array('data' => "Sucesso"));
	}
	public function destroy(){
		$input = \Input::all();
		$type = $input["type"];
        $id = $input["id"];

		if($type == "single"){
			return $this->destroySingle($id,"Produto",$this->produto);
		}else{
			$ids = json_decode($input["ids"]);
			return $this->destroyMultiples($ids,"Produto",$this->produto);
		}
	}
}
