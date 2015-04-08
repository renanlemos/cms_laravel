<?php
namespace admin;

class EventoHospedagensController extends BaseController {

	protected $evento_hospedagem;
	protected $evento_hospedagem_categoria;
	protected $evento_hospedagem_cidade;

	public function __construct(EventoHospedagem $evento_hospedagem,EventoHospedagemCategoria $evento_hospedagem_categoria,EventoHospedagemCidade $evento_hospedagem_cidade){
		$this->evento_hospedagem = $evento_hospedagem;
		$this->evento_hospedagem_categoria = $evento_hospedagem_categoria;
		$this->evento_hospedagem_cidade = $evento_hospedagem_cidade;
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
			$dados = $this->evento_hospedagem->whereRaw($where)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $total = count($this->evento_hospedagem->whereRaw($where)->get());
        }else{
        	$dados = $this->evento_hospedagem->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
        	$total = $this->evento_hospedagem->all()->count();
        }
     	$data = array("data" => $dados,"total" => $total,"cidades" => $this->comboCidades());
		return \Response::json($data);
	}
	public function combo(){
		$data = $this->evento_hospedagem->select("id","nome")->get();
    	return \Response::json($data);
	}
	public function comboCidades(){
		$data = $this->evento_hospedagem_cidade->select("id as value","descricao as text")->get()->toArray();
    	return $data;
	}
	public function store(){
		 
	    $input = \Input::all();
		$validation = \Validator::make($input,EventoHospedagem::rules(0),EventoHospedagem::messages());
		
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
		$validation = \Validator::make($input,EventoHospedagem::rules($id),EventoHospedagem::messages(true));

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
		$data = $this->evento_hospedagem->orderBy('ordem')->get();
		
		return \Response::json($data);
	}
	public function updateOrdem(){
		$input = \Input::all();
		$teste = array();

		foreach($input['itens'] as $key => $value) {
		 $item = explode('_',$value);	
		 $evento_hospedagem = $this->evento_hospedagem->find($item[1]);
		 $data = array("ordem" => ($key+1));
		 $evento_hospedagem->update($data);	
		}
		return \Response::json(array('data' => "Sucesso"));
	}
	public function destroy(){
		$input = \Input::all();
		$type = $input["type"];
        $id = $input["id"];

		if($type == "single"){
			return $this->destroySingle($id,"Hotel",$this->evento_hospedagem);
		}else{
			$ids = json_decode($input["ids"]);
			return $this->destroyMultiples($ids,"Hotel",$this->evento_hospedagem);
		}
	}
}
