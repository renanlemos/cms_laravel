<?php

namespace admin;

class ModuloPosicaosController extends BaseController {

	protected $modulo_posicao;

	public function __construct(ModuloPosicao $modulo_posicao){
		$this->modulo_posicao = $modulo_posicao;
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
			$dados = $this->modulo_posicao->whereRaw($where)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $total = count($this->modulo_posicao->whereRaw($where)->get());
        }else{
        	$dados = $this->modulo_posicao->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
        	$total = $this->modulo_posicao->all()->count();
        }
     	$data = array("data" => $dados,"total" => $total);
		return \Response::json($data);
	}
	public function combo(){
		$data = $this->modulo_posicao->select("id","descricao")->get();
    	return \Response::json($data);
	}
	public function store(){
		 
	    $input = \Input::all();
		$validation = \Validator::make($input,ModuloPosicao::rules(0),ModuloPosicao::messages());

		if ($validation->passes()){
			if($this->modulo_posicao->create($input)){
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

		$validation = \Validator::make($input,ModuloPosicao::rules($id),ModuloPosicao::messages());
		if ($validation->passes()){
			$empresa = $this->modulo_posicao->find($id);
			
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
			return $this->destroySingle($id,"Posição",$this->modulo_posicao);
		}else{
			$ids = json_decode($input["ids"]);
			return $this->destroyMultiples($ids,"Posição",$this->modulo_posicao);
		}
	}
}
