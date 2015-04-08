<?php

namespace admin;

class ModulosController extends BaseController {

	protected $modulo;
	protected $modulo_posicao;

	public function __construct(Modulo $modulo,ModuloPosicao $modulo_posicao){
		$this->modulo = $modulo;
		$this->modulo_posicao = $modulo_posicao;
		$this->beforeFilter('csrf', array('on' => 'put|delete|post'));
	}
	public function grid(){
		$input = \Input::all();
	    $where = "tipo = '".$input['tipo']."' and ";
        $sort_campo = "id";
        $sort_dir = "desc";
        
        if(isset($input['sort'])){
        	$sort_campo = $input['sort'][0]['field'];
        	$sort_dir = $input['sort'][0]['dir'];
        } 
		if(isset($input["filter"]) and !empty($input["filter"])){
			$where .= $where.$this->filters($input["filter"]);
			$dados = $this->modulo->whereRaw($where)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $total = count($this->modulo->whereRaw($where)->get());
        }else{
        	$dados = $this->modulo->where('tipo',$input['tipo'])->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
        	$total = count($this->modulo->where('tipo',$input['tipo'])->get());
        }
     	$data = array("data" => $dados,"total" => $total,"posicaos" =>$this->comboPosicao());
		return \Response::json($data);
	}
	public function comboPosicao(){
		$data = $this->modulo_posicao->select("id as value","descricao as text")->get()->toArray();
    	return $data;
	}
	public function store(){
		 
	    $input = \Input::all();
		if(empty($input['apelido'])){
			$input['apelido'] = \AppString::formataApelido($input['titulo']);
		}
		$validation = \Validator::make($input,Modulo::rules(0,$input),Modulo::messages($input));	
		if ($validation->passes()){
			if($this->modulo->create($input)){
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
		$validation = \Validator::make($input,Modulo::rules($id,$input),Modulo::messages($input));
		$input['parametros'] = json_encode($input['parametros']);

		if ($validation->passes()){
			$empresa = $this->modulo->find($id);
			
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
			return $this->destroySingle($id,"Posição",$this->modulo);
		}else{
			$ids = json_decode($input["ids"]);
			return $this->destroyMultiples($ids,"Posição",$this->modulo);
		}
	}
	public function getModulosOrdem(){
		$input = \Input::all();
		$modulos = $this->modulo->selectRaw('id,titulo,ordem')->where('modulo_posicao_id',$input['modulo_posicao_id'])->orderBy('ordem')->get();
		
		return \Response::json($modulos);
	}
	public function updateModulosOrdem(){
		$input = \Input::all();
		$teste = array();

		foreach($input['itens'] as $key => $value) {
		 $item = explode('_',$value);	
		 $modulo = $this->modulo->find($item[1]);
		 $data = array("ordem" => ($key+1));
		 $modulo->update($data);	
		}
		return \Response::json(array('data' => "Sucesso"));
	}
}
