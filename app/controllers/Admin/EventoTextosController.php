<?php
namespace admin;

class EventoTextosController extends BaseController {

	protected $evento_texto;

	public function __construct(EventoTexto $evento_texto){
		$this->evento_texto = $evento_texto;
		$this->beforeFilter('csrf', array('on' => 'put|delete|post'));
	}
	public function grid(){
		$input = \Input::all();
		$evento_id = $input['evento_id'];
        $where = "evento_id = $evento_id and ";
        $sort_campo = "id";
        $sort_dir = "desc";
        
        if(isset($input['sort'])){
        	$sort_campo = $input['sort'][0]['field'];
        	$sort_dir = $input['sort'][0]['dir'];
        } 
		if(isset($input["filter"]) and !empty($input["filter"])){
			$where = $this->filters($input["filter"]);
			$dados = $this->evento_texto->whereRaw($where)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $total = count($this->evento_texto->whereRaw($where)->get());
        }else{
        	$dados = $this->evento_texto->where('evento_id',$evento_id)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
        	$total = $this->evento_texto->all()->count();
        }
     	$data = array("data" => $dados,"total" => $total);
		return \Response::json($data);
	}
	public function combo(){
		$data = $this->evento_texto->select("id","titulo")->get();
    	return \Response::json($data);
	}
	public function store(){
		 
	    $input = \Input::all();
		$validation = \Validator::make($input,EventoTexto::rules(0),EventoTexto::messages());

		if($validation->passes()){
			if($this->evento_texto->create($input)){
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
		$validation = \Validator::make($input,EventoTexto::rules($id),EventoTexto::messages(true));

		if ($validation->passes()){
			$categoria = $this->evento_texto->find($id);
			
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
		$categoria = $this->evento_texto->find($input['id']);
		
		if($categoria->update(['publicado'=>$input['publicado']])){
			$data = array("data" => "Registro alterado com sucesso.","status" => 1);
		}else{
			$data = array("data" => "Erro ao Alterar.","status" => 0);
		}
		return \Response::json($data);
	}
	public function getOrdem(){
		$input = \Input::all();
		$data = $this->evento_texto->select('id','titulo')->where('evento_id',$input['evento_id'])->orderBy('ordem')->get();
		
		return \Response::json($data);
	}
	public function updateOrdem(){
		$input = \Input::all();
		$teste = array();

		foreach($input['itens'] as $key => $value) {
		 $item = explode('_',$value);	
		 $evento_texto = $this->evento_texto->find($item[1]);
		 $data = array("ordem" => ($key+1));
		 $evento_texto->update($data);	
		}
		return \Response::json(array('data' => "Sucesso"));
	}
	public function destroy(){
		$input = \Input::all();
		$type = $input["type"];
        $id = $input["id"];

		if($type == "single"){
			return $this->destroySingle($id,"Evento",$this->evento_texto);
		}else{
			$ids = json_decode($input["ids"]);
			return $this->destroyMultiples($ids,"Evento",$this->evento_texto);
		}
	}
	public function formatDate($data){
		if(!empty($data)){
			$data = explode('/',$data);
        	return $data[2].'-'.$data[1].'-'.$data[0];
        }		
	}
}
