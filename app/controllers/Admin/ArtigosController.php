<?php
namespace admin;

class ArtigosController extends BaseController {

	protected $artigo;
	protected $artigo_categoria;

	public function __construct(Artigo $artigo,ArtigoCategoria $artigo_categoria){
		$this->artigo = $artigo;
		$this->artigo_categoria = $artigo_categoria;
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
			$dados = $this->artigo->whereRaw($where)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $total = count($this->artigo->whereRaw($where)->get());
        }else{
        	$dados = $this->artigo->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
        	$total = $this->artigo->all()->count();
        }
     	$data = array("data" => $dados,"total" => $total,"artigo_categoria"=>$this->comboCategoria());
		return \Response::json($data);
	}
	public function filesDir(){
		$input = \Input::all();
		$files = $this->readFilesDir($input['path']);

		return \Response::json($files);
	}
	public function comboCategoria(){
		$data = $this->artigo_categoria->select("id as value","descricao as text")->get()->toArray();
    	return $data;
	}
	public function combo(){
		$data = $this->artigo->select("id","titulo")->get();
    	return \Response::json($data);
	}
	public function store(){
		 
	    $input = \Input::all();
	    if(empty($input['apelido'])){
			$input['apelido'] = \AppString::formataApelido($input['titulo']);
		}
		$validation = \Validator::make($input,Artigo::rules(0),Artigo::messages());

		if ($validation->passes()){
			if($this->artigo->create($input)){
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
		$validation = \Validator::make($input,Artigo::rules($id),Artigo::messages(true));
		$input['parametros'] = json_encode($input['parametros']);

		if ($validation->passes()){
			$empresa = $this->artigo->find($id);
			
			if($empresa->update($input)){
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
	public function getOrdem(){
		$input = \Input::all();
		$data = $this->artigo->select('id','titulo')->orderBy('ordem')->get();
		
		return \Response::json($data);
	}
	public function updateOrdem(){
		$input = \Input::all();
		$teste = array();

		foreach($input['itens'] as $key => $value) {
		 $item = explode('_',$value);	
		 $banner = $this->artigo->find($item[1]);
		 $data = array("ordem" => ($key+1));
		 $banner->update($data);	
		}
		return \Response::json(array('data' => "Sucesso"));
	}
	public function destroy(){
		$input = \Input::all();
		$type = $input["type"];
        $id = $input["id"];

		if($type == "single"){
			return $this->destroySingle($id,"Artigo",$this->artigo);
		}else{
			$ids = json_decode($input["ids"]);
			return $this->destroyMultiples($ids,"Artigo",$this->artigo);
		}
	}
}
