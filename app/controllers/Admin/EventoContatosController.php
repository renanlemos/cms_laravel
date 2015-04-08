<?php
namespace admin;
class EventoContatosController extends BaseController {
	
	protected $evento_contato;

	public function __construct(EventoContato $evento_contato){
		$this->evento_contato = $evento_contato;
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
			$dados = $this->evento_contato->whereRaw($where)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $total = count($this->evento_contato->whereRaw($where)->get());
        }else{
        	$dados = $this->evento_contato->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
        	$total = $this->evento_contato->all()->count();
        }
     	$data = array("data" => $dados,"total" => $total);
		return \Response::json($data);
	}
	public function combo(){
		$data = $this->evento_contato->select("id","nome")->get();
    	return \Response::json($data);
	}
	public function store(){
		$input = \Input::all();
		$validation = \Validator::make($input,EventoContato::rules(0),EventoContato::messages());

		if($validation->passes()){
			if($this->evento_contato->create($input)){
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
		
		$validation = \Validator::make($input,EventoContato::rules($id),EventoContato::messages());
		if ($validation->passes()){
			$categoria = $this->evento_contato->find($id);
			
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
		$categoria = $this->evento_contato->find($input['id']);
		
		if($categoria->update(['publicado'=>$input['publicado']])){
			$data = array("data" => "Registro alterado com sucesso.","status" => 1);
		}else{
			$data = array("data" => "Erro ao Alterar.","status" => 0);
		}
		return \Response::json($data);
	}
	public function getOrdem(){
		$input = \Input::all();
		$data = $this->evento_contato->orderBy('ordem')->get();
		
		return \Response::json($data);
	}
	public function updateOrdem(){
		$input = \Input::all();
		$teste = array();

		foreach($input['itens'] as $key => $value) {
		 $item = explode('_',$value);	
		 $evento_contato = $this->evento_contato->find($item[1]);
		 $data = array("ordem" => ($key+1));
		 $evento_contato->update($data);	
		}
		return \Response::json(array('data' => "Sucesso"));
	}
	public function destroy(){
		$input = \Input::all();
		$type = $input["type"];
        $id = $input["id"];

		if($type == "single"){
			return $this->destroySingle($id,"Contato",$this->evento_contato);
		}else{
			$ids = json_decode($input["ids"]);
			return $this->destroyMultiples($ids,"Contato",$this->evento_contato);
		}
	}
}
