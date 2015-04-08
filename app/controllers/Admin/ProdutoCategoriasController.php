<?php
namespace admin;

class ProdutoCategoriasController extends BaseController {

	protected $produto_categoria;

	public function __construct(ProdutoCategoria $produto_categoria){
		$this->produto_categoria = $produto_categoria;
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
			$dados = $this->produto_categoria->whereRaw($where)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $total = count($this->produto_categoria->whereRaw($where)->get());
        }else{
        	$dados = $this->produto_categoria->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
        	$total = $this->produto_categoria->all()->count();
        }
     	$data = array("data" => $dados,"total" => $total);
		return \Response::json($data);
	}
	public function combo(){
		$data = $this->produto_categoria->select("id","titulo")->get();
    	return \Response::json($data);
	}
	public function filesDir(){
		$input = \Input::all();
		$files = $this->readFilesDir($input['path']);

		return \Response::json($files);
	}
	public function store(){
		 
	    $input = \Input::all();
	    if(empty($input['apelido'])){
			$input['apelido'] = \AppString::formataApelido($input['titulo']);
		}
		$validation = \Validator::make($input,ProdutoCategoria::rules(0),ProdutoCategoria::messages());
		if($validation->passes()){
			if($this->produto_categoria->create($input)){
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
		$validation = \Validator::make($input,ProdutoCategoria::rules($id),ProdutoCategoria::messages(true));
		$input['parametros'] = json_encode($input['parametros']);

		if ($validation->passes()){
			$categoria = $this->produto_categoria->find($id);
			
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
		$categoria = $this->produto_categoria->find($input['id']);
		
		if($categoria->update(['publicado'=>$input['publicado']])){
			$data = array("data" => "Registro alterado com sucesso.","status" => 1);
		}else{
			$data = array("data" => "Erro ao Alterar.","status" => 0);
		}
		return \Response::json($data);
	}
	public function destroy(){
		$input = \Input::all();
		$type = $input["type"];
        $id = $input["id"];

		if($type == "single"){
			return $this->destroySingle($id,"Categoria",$this->produto_categoria);
		}else{
			$ids = json_decode($input["ids"]);
			return $this->destroyMultiples($ids,"Categoria",$this->produto_categoria);
		}
	}
}
