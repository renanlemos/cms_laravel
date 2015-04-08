<?php
namespace admin;

class EventoEventoHospedagensController extends BaseController {

	protected $evento_hospedagem;
	protected $hospedagem;
	protected $hospedagem_categoria;

	public function __construct(EventoEventoHospedagem $evento_hospedagem,EventoHospedagem $hospedagem,EventoHospedagemCategoria $hospedagem_categoria){
		$this->evento_hospedagem = $evento_hospedagem;
		$this->hospedagem = $hospedagem;
		$this->hospedagem_categoria = $hospedagem_categoria;
		$this->beforeFilter('csrf', array('on' => 'put|delete|post'));
	}
	public function grid(){
		$input = \Input::all();
		$evento_id = $input['evento_id'];
        $where = "evento_id = $evento_id ";
        $sort_campo = "id";
        $sort_dir = "desc";
        
        if(isset($input['sort'])){
        	$sort_campo = $input['sort'][0]['field'];
        	$sort_dir = $input['sort'][0]['dir'];
        } 
		if(isset($input["filter"]) and !empty($input["filter"])){
			$where = $this->filters($input["filter"]);
			$dados = $this->evento_hospedagem->whereRaw($where)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $total = count($this->evento_hospedagem->whereRaw($where)->get());
        }else{
        	$dados = $this->evento_hospedagem->where('evento_id',$evento_id)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
        	$total = count($dados);
        }
     	$data = array("data" => $dados,"total" => $total,"hospedagens" => $this->comboHospedagens(),"categorias"=> $this->comboCategorias());
		return \Response::json($data);
	}
	public function combo(){
		$data = $this->evento_hospedagem->select("id","titulo")->get();
    	return \Response::json($data);
	}
	public function comboHospedagens(){
		$data = $this->hospedagem->select("id as value","nome as text")->get()->toArray();
    	return $data;
	}
	public function comboCategorias(){
		$data = $this->hospedagem_categoria->select("id as value","descricao as text")->get()->toArray();
    	return $data;
	}
	public function store(){
		 
	    $input = \Input::all();
		$validation = \Validator::make($input,EventoEventoHospedagem::rules(0,$input),EventoEventoHospedagem::messages());
		
		if($validation->passes()){
			if($this->evento_hospedagem->create($input)){
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
		$validation = \Validator::make($input,EventoEventoHospedagem::rules($id,$input),EventoEventoHospedagem::messages(true));

		if ($validation->passes()){
			$categoria = $this->evento_hospedagem->find($id);
			
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
		$categoria = $this->evento_hospedagem->find($input['id']);
		
		if($categoria->update(['publicado'=>$input['publicado']])){
			$data = array("data" => "Registro alterado com sucesso.","status" => 1);
		}else{
			$data = array("data" => "Erro ao Alterar.","status" => 0);
		}
		return \Response::json($data);
	}
	public function getOrdem(){
		$input = \Input::all();
		$dados = array();
		$data = $this->evento_hospedagem->selectRaw("id,CONCAT((SELECT nome FROM evento_hospedagems WHERE id = evento_hospedagem_id),' - ',(SELECT descricao FROM evento_hospedagem_categorias WHERE id = evento_hospedagem_categoria_id)) as titulo")->where('evento_id',$input['evento_id'])->orderBy('ordem')->get()->toArray();
		
		return \Response::json($data);
	}
	public function updateOrdem(){
		$input = \Input::all();

		foreach($input['itens'] as $key => $value) {
			$item = explode('_',$value);	
			$evento_hospedagem_hospedagem = $this->evento_hospedagem->find($item[1]);
			$data = array("ordem" => ($key+1));
			$evento_hospedagem_hospedagem->update($data);	
		}
		return \Response::json(array('data' => "Sucesso"));
	}
	public function destroy(){
		$input = \Input::all();
		$type = $input["type"];
        $id = $input["id"];

		if($type == "single"){
			return $this->destroySingle($id,"Evento",$this->evento_hospedagem);
		}else{
			$ids = json_decode($input["ids"]);
			return $this->destroyMultiples($ids,"Evento",$this->evento_hospedagem);
		}
	}

}
