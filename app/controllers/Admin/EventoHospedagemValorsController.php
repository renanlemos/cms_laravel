<?php
namespace admin;

class EventoHospedagemValorsController extends BaseController {

	protected $hospedagem_valor;

	public function __construct(EventoHospedagemValor $hospedagem_valor){
		$this->hospedagem_valor = $hospedagem_valor;
		$this->beforeFilter('csrf', array('on' => 'put|delete|post'));
	}
	public function grid(){
		$input = \Input::all();
		$evento_evento_hospedagem_id = $input['evento_evento_hospedagem_id'];
        $where = "evento_evento_hospedagem_id = $evento_evento_hospedagem_id and ";
        $sort_campo = "id";
        $sort_dir = "desc";
        
        if(isset($input['sort'])){
        	$sort_campo = $input['sort'][0]['field'];
        	$sort_dir = $input['sort'][0]['dir'];
        } 
		if(isset($input["filter"]) and !empty($input["filter"])){
			$where = $this->filters($input["filter"]);
			$dados = $this->hospedagem_valor->whereRaw($where)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $total = count($this->hospedagem_valor->whereRaw($where)->get());
        }else{
        	$dados = $this->hospedagem_valor->where('evento_evento_hospedagem_id',$evento_evento_hospedagem_id)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
        	$total = count($dados);
        }
     	$data = array("data" => $dados,"total" => $total);
		return \Response::json($data);
	}
	public function combo(){
		$data = $this->hospedagem_valor->select("id","titulo")->get();
    	return \Response::json($data);
	}
	public function store(){
		 
	    $input = \Input::all();
		
		$validation = \Validator::make($input,EventoHospedagemValor::rules(0,$input),EventoHospedagemValor::messages());
		if($validation->passes()){
			if($this->hospedagem_valor->create($input)){
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
		$validation = \Validator::make($input,EventoHospedagemValor::rules($id,$input),EventoHospedagemValor::messages(true));

		if ($validation->passes()){
			$categoria = $this->hospedagem_valor->find($id);
			
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
		$hospedagem_valor = $this->hospedagem_valor->find($input['id']);
		$data_update = ['publicado'=>$input['publicado']];
		if($input['campo'] == 'capa'){
			$data_update = ['capa'=>$input['capa']];
		}

		if($hospedagem_valor->update($data_update)){
			$data = array("data" => "Registro alterado com sucesso.","status" => 1);
		}else{
			$data = array("data" => "Erro ao Alterar.","status" => 0);
		}
		return \Response::json($data);
	}
	public function getOrdem(){
		$input = \Input::all();
		$data = $this->hospedagem_valor->select('id','descricao')->where('evento_evento_hospedagem_id',$input['evento_evento_hospedagem_id'])->orderBy('ordem')->get();
		
		return \Response::json($data);
	}
	public function updateOrdem(){
		$input = \Input::all();
		$teste = array();

		foreach($input['itens'] as $key => $value) {
		 $item = explode('_',$value);	
		 $hospedagem_valor = $this->hospedagem_valor->find($item[1]);
		 $data = array("ordem" => ($key+1));
		 $hospedagem_valor->update($data);	
		}
		return \Response::json(array('data' => "Sucesso"));
	}
	public function destroy(){
		$input = \Input::all();
		$type = $input["type"];
        $id = $input["id"];

		if($type == "single"){
			return $this->destroySingle($id,"Valor",$this->hospedagem_valor);
		}else{
			$ids = json_decode($input["ids"]);
			return $this->destroyMultiples($ids,"Valor",$this->hospedagem_valor);
		}
	}

}
