<?php
namespace admin;

class EventosController extends BaseController {

	protected $evento;
	protected $evento_categoria;

	public function __construct(Evento $evento,EventoCategoria $evento_categoria){
		$this->evento = $evento;
		$this->evento_categoria = $evento_categoria;
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
			$dados = $this->evento->whereRaw($where)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $total = count($this->evento->whereRaw($where)->get());
        }else{
        	$dados = $this->evento->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
        	$total = $this->evento->all()->count();
        }
     	$data = array("data" => $dados,"total" => $total,"categorias" => $this->comboCategorias());
		return \Response::json($data);
	}
	public function combo(){
		$data = $this->evento->select("id","titulo")->get();
    	return \Response::json($data);
	}
	public function comboCategorias(){
		$data = $this->evento_categoria->select("id as value","titulo as text")->get()->toArray();
    	return $data;
	}
	public function store(){
		 
	    $input = \Input::all();
	    if(empty($input['apelido'])){
			$input['apelido'] = \AppString::formataApelido($input['titulo']);
		}
		$input['data_fim'] = $this->formatDate($input['data_fim']);
		$input['data_inicio'] = $this->formatDate($input['data_inicio']);
		
		$validation = \Validator::make($input,Evento::rules(0),Evento::messages());
		if($validation->passes()){
			if($this->evento->create($input)){
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
		$input['data_fim'] = $this->formatDate($input['data_fim']);
		$input['data_inicio'] = $this->formatDate($input['data_inicio']);

		$validation = \Validator::make($input,Evento::rules($id),Evento::messages(true));

		if ($validation->passes()){
			$categoria = $this->evento->find($id);
			
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
		$categoria = $this->evento->find($input['id']);
		
		if($categoria->update(['publicado'=>$input['publicado']])){
			$data = array("data" => "Registro alterado com sucesso.","status" => 1);
		}else{
			$data = array("data" => "Erro ao Alterar.","status" => 0);
		}
		return \Response::json($data);
	}
	public function getOrdem(){
		$input = \Input::all();
		$data = $this->evento->select('id','titulo')->orderBy('ordem')->get();
		
		return \Response::json($data);
	}
	public function updateOrdem(){
		$input = \Input::all();
		$teste = array();

		foreach($input['itens'] as $key => $value) {
		 $item = explode('_',$value);	
		 $evento = $this->evento->find($item[1]);
		 $data = array("ordem" => ($key+1));
		 $evento->update($data);	
		}
		return \Response::json(array('data' => "Sucesso"));
	}
	public function destroy(){
		$input = \Input::all();
		$type = $input["type"];
        $id = $input["id"];

		if($type == "single"){
			return $this->destroySingle($id,"Evento",$this->evento);
		}else{
			$ids = json_decode($input["ids"]);
			return $this->destroyMultiples($ids,"Evento",$this->evento);
		}
	}
	public function formatDate($data){
		if(!empty($data)){
			$data = explode('/',$data);
        	return $data[2].'-'.$data[1].'-'.$data[0];
        }		
	}
}
