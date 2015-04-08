<?php
namespace admin;

class ProdutoCaracteristicasController extends BaseController {

	protected $produto_caracteristica;

	public function __construct(ProdutoCaracteristica $produto_caracteristica){
		$this->produto_caracteristica = $produto_caracteristica;
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
			$dados = $this->produto_caracteristica->whereRaw($where)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $total = count($this->produto_caracteristica->whereRaw($where)->get());
        }else{
        	$dados = $this->produto_caracteristica->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
        	$total = $this->produto_caracteristica->all()->count();
        }
     	$data = array("data" => $dados,"total" => $total);
		return \Response::json($data);
	}
	public function combo(){
		$data = $this->produto_caracteristica->select("id","descricao")->get();
    	return \Response::json($data);
	}
	public function filesDir(){
		$input = \Input::all();
		$files = $this->readFilesDir($input['path']);

		return \Response::json($files);
	}
	public function store(){
		 
	    $input = \Input::all();
		$validation = \Validator::make($input,ProdutoCaracteristica::rules(0),ProdutoCaracteristica::messages());
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
		$validation = \Validator::make($input,ProdutoCaracteristica::rules($id),ProdutoCaracteristica::messages(true));

		if($validation->passes()){
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
