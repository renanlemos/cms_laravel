<?php
namespace admin;

class EventoHospedagemCidadesController extends BaseController {

	protected $evento_hospedagem_cidades;

	public function __construct(EventoHospedagemCidade $evento_hospedagem_cidades){
		$this->evento_hospedagem_cidades = $evento_hospedagem_cidades;
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
			$dados = $this->evento_hospedagem_cidades->whereRaw($where)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $total = count($this->evento_hospedagem_cidades->whereRaw($where)->get());
        }else{
        	$dados = $this->evento_hospedagem_cidades->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
        	$total = $this->evento_hospedagem_cidades->all()->count();
        }
     	$data = array("data" => $dados,"total" => $total);
		return \Response::json($data);
	}
	public function combo(){
		$data = $this->evento_hospedagem_cidades->select("id","descricao")->get();
    	return \Response::json($data);
	}
	public function store(){
		 
	    $input = \Input::all();
		$validation = \Validator::make($input,EventoHospedagemCidade::rules(0),EventoHospedagemCidade::messages());
		if($validation->passes()){
			if($this->evento_hospedagem_cidades->create($input)){
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
		$validation = \Validator::make($input,EventoHospedagemCidade::rules($id),EventoHospedagemCidade::messages(true));
		if ($validation->passes()){
			$categoria = $this->evento_hospedagem_cidades->find($id);
			
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
			return $this->destroySingle($id,"Cidade",$this->evento_hospedagem_cidades);
		}else{
			$ids = json_decode($input["ids"]);
			return $this->destroyMultiples($ids,"Cidade",$this->evento_hospedagem_cidades);
		}
	}
}
