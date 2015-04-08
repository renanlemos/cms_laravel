<?php
namespace admin;

class ArtigoFotosController extends BaseController {

	protected $artigo_fotos;

	public function __construct(ArtigoFoto $artigo_fotos){
		$this->artigo_fotos = $artigo_fotos;
		$this->beforeFilter('csrf', array('on' => 'put|delete|post'));
	}
	public function grid(){
		$input = \Input::all();
		$artigo_id = $input['artigo_id'];
        $where = "artigo_id =".$artigo_id." and ";
        $sort_campo = "id";
        $sort_dir = "desc";
        
        if(isset($input['sort'])){
        	$sort_campo = $input['sort'][0]['field'];
        	$sort_dir = $input['sort'][0]['dir'];
        } 
		if(isset($input["filter"]) and !empty($input["filter"])){
			$where .= $this->filters($input["filter"]);
			$dados = $this->artigo_fotos->whereRaw($where)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $total = count($this->artigo_fotos->whereRaw($where)->get());
        }else{
        	$dados = $this->artigo_fotos->where('artigo_id',$artigo_id)->take($input['pageSize'])->skip($input['skip'])->orderBy($sort_campo,$sort_dir)->get();
        	$total = count($dados);
        }
     	$data = array("data" => $dados,"total" => $total);
		return \Response::json($data);
	}
	public function store(){
		 
	    $input = \Input::all();
		$validation = \Validator::make($input,ArtigoFoto::rules(0),ArtigoFoto::messages());
		
		if($validation->passes()){
			if($this->artigo_fotos->create($input)){
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
		$validation = \Validator::make($input,ArtigoFoto::rules($id),ArtigoFoto::messages(true));

		if ($validation->passes()){
			$categoria = $this->artigo_fotos->find($id);
			
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
		$artigo_fotos = $this->artigo_fotos->find($input['id']);
		$data_update = ['publicado' => $input['publicado']];
		if($input['campo'] == 'capa'){
			$data_update = [$input['campo'] => $input['capa'],'artigo_id' => $input['artigo_id']];
		}

		if($artigo_fotos->update($data_update)){
			$data = array("data" => "Registro alterado com sucesso.","status" => 1);
		}else{
			$data = array("data" => "Erro ao Alterar.","status" => 0);
		}
		return \Response::json($data);
	}
	public function getOrdem(){
		$input = \Input::all();
		$data = $this->artigo_fotos->where('artigo_id',$input['artigo_id'])->orderBy('ordem')->get();
		
		return \Response::json($data);
	}
	public function updateOrdem(){
		$input = \Input::all();

		foreach($input['itens'] as $key => $value) {
			$item = explode('_',$value);	
			$item = $this->artigo_fotos->find($item[1]);
			$data = array("ordem" => ($key+1));
			$item->update($data);	
		}
		return \Response::json(array('data' => "Sucesso"));
	}
	public function destroy(){
		$input = \Input::all();
		$type = $input["type"];
        $id = $input["id"];

		if($type == "single"){
			return $this->destroySingle($id,"Foto",$this->artigo_fotos);
		}else{
			$ids = json_decode($input["ids"]);
			return $this->destroyMultiples($ids,"Foto",$this->artigo_fotos);
		}
	}
}
