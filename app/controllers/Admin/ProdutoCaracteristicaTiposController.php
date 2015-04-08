<?php
namespace admin;

class ProdutoCaracteristicaTiposController extends BaseController {

	protected $produto_caracteristica_tipo;

	public function __construct(ProdutoCaracteristicaTipo $produto_caracteristica_tipo){
		$this->produto_caracteristica_tipo = $produto_caracteristica_tipo;
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
			$dados = $this->produto_caracteristica_tipo->whereRaw($where)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $total = count($this->produto_caracteristica_tipo->whereRaw($where)->get());
        }else{
        	$dados = $this->produto_caracteristica_tipo->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
        	$total = $this->produto_caracteristica_tipo->all()->count();
        }
     	$data = array("data" => $dados,"total" => $total);
		return \Response::json($data);
	}
	public function combo(){
		$data = $this->produto_caracteristica_tipo->select("id","descricao")->get();
    	return \Response::json($data);
	}
	public function store(){
		 
	    $input = \Input::all();
		$validation = \Validator::make($input,ProdutoCaracteristicaTipo::rules(0),ProdutoCaracteristicaTipo::messages());
		if($validation->passes()){
			if($this->produto_caracteristica_tipo->create($input)){
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
		$validation = \Validator::make($input,ProdutoCaracteristicaTipo::rules($id),ProdutoCaracteristicaTipo::messages(true));

		if ($validation->passes()){
			$categoria = $this->produto_caracteristica_tipo->find($id);
			
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
		$tipo = $this->produto_caracteristica_tipo->find($input['id']);
		
		if($tipo->update(['publicado'=>$input['publicado']])){
			$data = array("data" => "Registro alterado com sucesso.","status" => 1);
		}else{
			$data = array("data" => "Erro ao Alterar.","status" => 0);
		}
		return \Response::json($data);
	}
	public function getOrdem(){
		$input = \Input::all();
		$data = $this->produto_caracteristica_tipo->orderBy('ordem')->get();
		
		return \Response::json($data);
	}
	public function updateOrdem(){
		$input = \Input::all();
		$teste = array();

		foreach($input['itens'] as $key => $value) {
		 $item = explode('_',$value);	
		 $banner = $this->produto_caracteristica_tipo->find($item[1]);
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
			return $this->destroySingle($id,"Tipo",$this->produto_caracteristica_tipo);
		}else{
			$ids = json_decode($input["ids"]);
			return $this->destroyMultiples($ids,"Tipo",$this->produto_caracteristica_tipo);
		}
	}
}
