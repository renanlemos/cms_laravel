<?php
namespace admin;

class EventoEventoServicosController extends BaseController {

	protected $evento_servico;
	protected $servico;

	public function __construct(EventoEventoServico $evento_servico,EventoServico $servico){
		$this->evento_servico = $evento_servico;
		$this->servico = $servico;
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
			$dados = $this->evento_servico->whereRaw($where)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $total = count($this->evento_servico->whereRaw($where)->get());
        }else{
        	$dados = $this->evento_servico->where('evento_id',$evento_id)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
        	$total = count($dados);
        }
     	$data = array("data" => $dados,"total" => $total,"servicos" => $this->comboServicos());
		return \Response::json($data);
	}
	public function comboServicos(){
		$data = $this->servico->select('id as value','descricao as text')->get()->toArray();
		return $data;
	}
	public function store(){
		 
	    $input = \Input::all();
	 	$validation = \Validator::make($input,EventoEventoServico::rules(0,$input),EventoEventoServico::messages());
		if($validation->passes()){
			if($this->evento_servico->create($input)){
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
		$validation = \Validator::make($input,EventoEventoServico::rules($id,$input),EventoEventoServico::messages(true));

		if ($validation->passes()){
			$evento_servico = $this->evento_servico->find($id);
			
			if($evento_servico->update($input)){
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
		$categoria = $this->evento_servico->find($input['id']);
		
		if($categoria->update(['publicado'=>$input['publicado']])){
			$data = array("data" => "Registro alterado com sucesso.","status" => 1);
		}else{
			$data = array("data" => "Erro ao Alterar.","status" => 0);
		}
		return \Response::json($data);
	}
	public function getOrdem(){
		$input = \Input::all();
		$data = $this->evento_servico->selectRaw('id,(SELECT descricao FROM evento_servicos WHERE id = evento_servico_id) as titulo')->where('evento_id',$input['evento_id'])->orderBy('ordem')->get();
		
		return \Response::json($data);
	}
	public function updateOrdem(){
		$input = \Input::all();
		$teste = array();

		foreach($input['itens'] as $key => $value) {
		 $item = explode('_',$value);	
		 $evento_servico = $this->evento_servico->find($item[1]);
		 $data = array("ordem" => ($key+1));
		 $evento_servico->update($data);	
		}
		return \Response::json(array('data' => "Sucesso"));
	}
	public function destroy(){
		$input = \Input::all();
		$type = $input["type"];
        $id = $input["id"];

		if($type == "single"){
			return $this->destroySingle($id,"Serviço",$this->evento_servico);
		}else{
			$ids = json_decode($input["ids"]);
			return $this->destroyMultiples($ids,"Serviço",$this->evento_servico);
		}
	}
}
