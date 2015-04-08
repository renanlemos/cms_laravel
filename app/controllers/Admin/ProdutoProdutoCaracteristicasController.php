<?php
namespace admin;

class ProdutoProdutoCaracteristicasController extends BaseController {

	protected $produto_caracteristica;
	protected $produto;
	protected $caracteristica;
	protected $tipo;

	public function __construct(ProdutoProdutoCaracteristica $produto_caracteristica,Produto $produto,ProdutoCaracteristica $caracteristica,ProdutoCaracteristicaTipo $tipo){ 
		$this->produto_caracteristica = $produto_caracteristica;
		$this->produto = $produto;
		$this->caracteristica = $caracteristica;
		$this->tipo = $tipo;
		$this->beforeFilter('csrf', array('on' => 'put|delete|post'));
	}
	public function grid(){
		$input = \Input::all();
        $w = "produto_id = ".$input['produto_id'];
        $sort_campo = "id";
        $sort_dir = "desc";
                
        if(isset($input['sort'])){
        	$sort_campo = $input['sort'][0]['field'];
        	$sort_dir = $input['sort'][0]['dir'];
        } 
		if(isset($input["filter"]) and !empty($input["filter"])){
			$where = $this->filters($input["filter"]);
			$dados = $this->produto_caracteristica->whereRaw($w.' and '.$where)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $total = count($this->produto_caracteristica->whereRaw($where)->get());
        }else{
        	$dados = $this->produto_caracteristica->whereRaw($w)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
        	$total = count($dados);
        }
     	$data = array("data" => $dados,"total" => $total,"tipos" => $this->comboTipos(),"caracteristicas" => $this->comboCaracteristicas());
		return \Response::json($data);
	}
	public function combo(){
		$data = $this->produto_caracteristica->select("id","titulo")->get();
    	return \Response::json($data);
	}
	public function comboCaracteristicas(){
		$data = $this->caracteristica->select("id as value","descricao as text")->get()->toArray();
    	return $data;
	}
	public function comboTipos(){
		$data = $this->tipo->select("id as value","descricao as text")->get()->toArray();
    	return $data;
	}
	public function filesDir(){
		$input = \Input::all();
		$files = $this->readFilesDir($input['path']);

		return \Response::json($files);
	}
	public function store(){
		 
	    $input = \Input::all();
		$validation = \Validator::make($input,ProdutoProdutoCaracteristica::rules(0),ProdutoProdutoCaracteristica::messages());
		if($validation->passes()){
			if($this->produto_caracteristica->create($input)){
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
	    $validation = \Validator::make($input,ProdutoProdutoCaracteristica::rules($id),ProdutoProdutoCaracteristica::messages(true));

		if ($validation->passes()){
			$categoria = $this->produto_caracteristica->find($id);
			
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
		$categoria = $this->produto_caracteristica->find($input['id']);
		
		if($categoria->update(['publicado'=>$input['publicado']])){
			$data = array("data" => "Registro alterado com sucesso.","status" => 1);
		}else{
			$data = array("data" => "Erro ao Alterar.","status" => 0);
		}
		return \Response::json($data);
	}
	public function getOrdem(){
		$input = \Input::all();
		$data = $this->produto_caracteristica->select('produto_produto_caracteristicas.id as id','pc.descricao as titulo')->join('produto_caracteristicas as pc','produto_produto_caracteristicas.produto_caracteristica_id','=','pc.id')->where('produto_id',$input['produto_id'])->where('produto_caracteristica_tipo_id',$input['produto_caracteristica_tipo_id'])->orderBy('ordem')->get()->unique();
		
		return \Response::json($data);
	}
	public function updateOrdem(){
		$input = \Input::all();
	
		foreach($input['itens'] as $key => $value) {
		 $item = explode('_',$value);	
		 $item = $this->produto_caracteristica->find($item[1]);
		 $data = array("ordem" => ($key+1));
		 $item->update($data);	
		}
		return \Response::json(array('data' => "Sucesso"));
	}
	public function destroy(){
		$input = \Input::all();
		$type = $input["type"];
        $id = $input["id"];

		if($type == "single"){
			return $this->destroySingle($id,"Caracteristica",$this->produto_caracteristica);
		}else{
			$ids = json_decode($input["ids"]);
			return $this->destroyMultiples($ids,"Caracteristica",$this->produto_caracteristica);
		}
	}
}
