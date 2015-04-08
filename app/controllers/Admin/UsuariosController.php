<?php

namespace admin;
class UsuariosController extends BaseController {

	protected $usuario;

	public function __construct(Usuario $usuario){
		$this->usuario = $usuario;
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
			$dados = $this->usuario->whereRaw($where)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $total = count($this->usuario->whereRaw($where)->get());
        }else{
        	$dados = $this->usuario->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
        	$total = $this->usuario->all()->count();
        }
     	$data = array("data" => $dados,"total" => $total);
		return \Response::json($data);
	}
	public function store(){
		 
	    $input = \Input::all();
		$validation = \Validator::make($input,Usuario::rules(0,true),Usuario::messages(true));

		if ($validation->passes()){
			if($this->usuario->create($input)){
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
		$senha = $input["senha"];
		$id = $input["id"];

		if(empty($senha)){
			$validation = \Validator::make($input,Usuario::rules($id,false),Usuario::messages(false));
		}else{
			$validation = \Validator::make($input,Usuario::rules($id,true),Usuario::messages(true));
		}	
		if ($validation->passes()){
			$empresa = $this->usuario->find($id);
			
			if($empresa->update($input)){
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
			return $this->destroySingle($id,"Usuário",$this->usuario);
		}else{
			$ids = json_decode($input["ids"]);
			return $this->destroyMultiples($ids,"Usuário",$this->usuario);
		}
	}
}
