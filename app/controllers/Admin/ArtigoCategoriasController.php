<?php
namespace admin;

class ArtigoCategoriasController extends BaseController {

	protected $artigo_categoria;

	public function __construct(ArtigoCategoria $artigo_categoria){
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
			$dados = $this->artigo_categoria->whereRaw($where)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $total = count($this->artigo_categoria->whereRaw($where)->get());
        }else{
        	$dados = $this->artigo_categoria->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
        	$total = $this->artigo_categoria->all()->count();
        }
     	$data = array("data" => $dados,"total" => $total);
		return \Response::json($data);
	}
	public function combo(){
		$data = $this->artigo_categoria->select("id","descricao")->get();
    	return \Response::json($data);
	}
	public function filesDir(){
		
		$input = \Input::all();
		$files = $this->readFilesDir($input['path']);

		return \Response::json($files);

	}
	public function store(){
		 
	    $input = \Input::all();
		$validation = \Validator::make($input,ArtigoCategoria::rules(0),ArtigoCategoria::messages());
		$input['parametros'] = json_encode($input['parametros']);

		if ($validation->passes()){
			if($this->artigo_categoria->create($input)){
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

		$validation = \Validator::make($input,ArtigoCategoria::rules($id),ArtigoCategoria::messages(true));
		
		if ($validation->passes()){
			$empresa = $this->artigo_categoria->find($id);
			
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
	public function destroy(){
		$input = \Input::all();
		$type = $input["type"];
        $id = $input["id"];

		if($type == "single"){
			return $this->destroySingle($id,"Categoria",$this->artigo_categoria);
		}else{
			$ids = json_decode($input["ids"]);
			return $this->destroyMultiples($ids,"Categoria",$this->artigo_categoria);
		}
	}
}
