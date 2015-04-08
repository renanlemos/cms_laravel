<?php
namespace admin;

class EventoHospedagemEventoHospedagemInclusosController extends BaseController {

	protected $e_h_e_h_inclusos;
	protected $evento_hospedagem_incluso;

	public function __construct(EventoHospedagemEventoHospedagemIncluso $e_h_e_h_inclusos,EventoHospedagemIncluso $evento_hospedagem_incluso){
		$this->e_h_e_h_inclusos = $e_h_e_h_inclusos;
		$this->evento_hospedagem_incluso = $evento_hospedagem_incluso;
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
			$dados = $this->e_h_e_h_inclusos->whereRaw($where)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $total = count($this->e_h_e_h_inclusos->whereRaw($where)->get());
        }else{
        	$dados = $this->e_h_e_h_inclusos->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
        	$total = $this->e_h_e_h_inclusos->all()->count();
        }
     	$data = array("data" => $dados,"total" => $total,"inclusos" => $this->comboInclusos());
		return \Response::json($data);
	}
	public function combo(){
		$data = $this->e_h_e_h_inclusos->select("id","titulo")->get();
    	return \Response::json($data);
	}
	public function comboInclusos(){
		$data = $this->evento_hospedagem_incluso->select("id as value","descricao as text")->get()->toArray();
    	return $data;
	}
	public function store(){
		 
	    $input = \Input::all();
		$validation = \Validator::make($input,EventoHospedagemEventoHospedagemIncluso::rules(0,$input),EventoHospedagemEventoHospedagemIncluso::messages());
		
		if($validation->passes()){
			if($this->e_h_e_h_inclusos->create($input)){
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
		$validation = \Validator::make($input,EventoHospedagemEventoHospedagemIncluso::rules($id,$input),EventoHospedagemEventoHospedagemIncluso::messages(true));

		if ($validation->passes()){
			$categoria = $this->e_h_e_h_inclusos->find($id);
			
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
		$item = $this->e_h_e_h_inclusos->find($input['id']);
		
		if($item->update(['publicado'=>$input['publicado']])){
			$data = array("data" => "Registro alterado com sucesso.","status" => 1);
		}else{
			$data = array("data" => "Erro ao Alterar.","status" => 0);
		}
		return \Response::json($data);
	}
	public function getOrdem(){
		$input = \Input::all();
		$data = $this->e_h_e_h_inclusos->selectRaw("id,(SELECT descricao FROM evento_hospedagem_inclusos WHERE id = evento_hospedagem_incluso_id) as titulo")->where('evento_hospedagem_id',$input['evento_hospedagem_id'])->orderBy('ordem')->get();
		
		return \Response::json($data);
	}
	public function updateOrdem(){
		$input = \Input::all();

		foreach($input['itens'] as $key => $value) {
		 $item = explode('_',$value);	
		 $e_h_e_h_inclusos = $this->e_h_e_h_inclusos->find($item[1]);
		 $data = array("ordem" => ($key+1));
		 $e_h_e_h_inclusos->update($data);	
		}
		return \Response::json(array('data' => "Sucesso"));
	}
	public function destroy(){
		$input = \Input::all();
		$type = $input["type"];
        $id = $input["id"];

		if($type == "single"){
			return $this->destroySingle($id,"Incluso",$this->e_h_e_h_inclusos);
		}else{
			$ids = json_decode($input["ids"]);
			return $this->destroyMultiples($ids,"Incluso",$this->e_h_e_h_inclusos);
		}
	}
}
