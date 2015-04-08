<?php
namespace admin;

class EventoHospedagemInclusosController extends BaseController {

	protected $evento_hospedagem_incluso;

	public function __construct(EventoHospedagemIncluso$evento_hospedagem_incluso){
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
			$dados = $this->evento_hospedagem_incluso->whereRaw($where)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $total = count($this->evento_hospedagem_incluso->whereRaw($where)->get());
        }else{
        	$dados = $this->evento_hospedagem_incluso->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
        	$total = $this->evento_hospedagem_incluso->all()->count();
        }
     	$data = array("data" => $dados,"total" => $total);
		return \Response::json($data);
	}
	public function combo(){
		$data = $this->evento_hospedagem_incluso->select("id","descricao")->get();
    	return \Response::json($data);
	}
	public function store(){
		 
	    $input = \Input::all();
		$validation = \Validator::make($input,EventoHospedagemIncluso::rules(0),EventoHospedagemIncluso::messages());
		if($validation->passes()){
			if($this->evento_hospedagem_incluso->create($input)){
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
		$validation = \Validator::make($input,EventoHospedagemIncluso::rules($id),EventoHospedagemIncluso::messages(true));
		if ($validation->passes()){
			$categoria = $this->evento_hospedagem_incluso->find($id);
			
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
		$categoria = $this->evento_hospedagem_incluso->find($input['id']);
		
		if($categoria->update(['publicado'=>$input['publicado']])){
			$data = array("data" => "Registro alterado com sucesso.","status" => 1);
		}else{
			$data = array("data" => "Erro ao Alterar.","status" => 0);
		}
		return \Response::json($data);
	}
	public function getOrdem(){
		$input = \Input::all();
		$data = $this->evento_hospedagem_incluso->orderBy('ordem')->get();
		
		return \Response::json($data);
	}
	public function updateOrdem(){
		$input = \Input::all();
		$teste = array();

		foreach($input['itens'] as $key => $value) {
		 $item = explode('_',$value);	
		 $evento_hospedagem_incluso = $this->evento_hospedagem_incluso->find($item[1]);
		 $data = array("ordem" => ($key+1));
		 $evento_hospedagem_incluso->update($data);	
		}
		return \Response::json(array('data' => "Sucesso"));
	}
	public function destroy(){
		$input = \Input::all();
		$type = $input["type"];
        $id = $input["id"];

		if($type == "single"){
			return $this->destroySingle($id,"Categoria",$this->evento_hospedagem_incluso);
		}else{
			$ids = json_decode($input["ids"]);
			return $this->destroyMultiples($ids,"Categoria",$this->evento_hospedagem_incluso);
		}
	}
}
