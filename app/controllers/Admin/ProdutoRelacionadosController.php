<?php
namespace admin;

class ProdutoRelacionadosController extends BaseController {

	protected $produto_relacionado;
	protected $produto;

	public function __construct(ProdutoRelacionado $produto_relacionado,Produto $produto){ 
		$this->produto_relacionado = $produto_relacionado;
		$this->produto = $produto;
		$this->beforeFilter('csrf', array('on' => 'put|delete|post'));
	}
	public function grid(){
		$input = \Input::all();
        $w = "produto_id = ".$input['produto_id'];
        $sort_campo = "id";
        $sort_dir = "desc";
                
        if(isset($input['sort'])){
        	$sort_campo = $input['sort'][0]['field'];
        	$sort_dir = $input['sort'][0]['dir'];
        } 
		if(isset($input["filter"]) and !empty($input["filter"])){
			$where = $this->filters($input["filter"]);
			$dados = $this->produto_relacionado->whereRaw($w.' and '.$where)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $total = count($this->produto_relacionado->whereRaw($where)->get());
        }else{
        	$dados = $this->produto_relacionado->whereRaw($w)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
        	$total = count($dados);
        }
     	$data = array("data" => $dados,"total" => $total,"produtos" => $this->comboProdutos());
		return \Response::json($data);
	}
	public function combo(){
		$data = $this->produto_relacionado->select("id","titulo")->get();
    	return \Response::json($data);
	}
	public function comboProdutos(){
		$data = $this->produto->select("id as value","titulo as text")->get()->toArray();
    	return $data;
	}
	public function store(){
		 
	    $input = \Input::all();
		$validation = \Validator::make($input,ProdutoRelacionado::rules(0,$input['produto_id'],$input['produto_relacionado_id']),ProdutoRelacionado::messages());
		if($validation->passes()){
			if($this->produto_relacionado->create($input)){
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
	    $validation = \Validator::make($input,ProdutoRelacionado::rules($id,$input['produto_id'],$input['produto_relacionado_id']),ProdutoRelacionado::messages(true));

		if ($validation->passes()){
			$categoria = $this->produto_relacionado->find($id);
			
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
		$categoria = $this->produto_relacionado->find($input['id']);
		
		if($categoria->update(['publicado'=>$input['publicado']])){
			$data = array("data" => "Registro alterado com sucesso.","status" => 1);
		}else{
			$data = array("data" => "Erro ao Alterar.","status" => 0);
		}
		return \Response::json($data);
	}
	public function getOrdem(){
		$input = \Input::all();
		$data = $this->produto_relacionado->selectRaw("id,(SELECT titulo FROM produtos WHERE id = produto_relacionados.produto_relacionado_id) as titulo")->where('produto_id',$input['produto_id'])->orderBy('ordem')->get();
		
		return \Response::json($data);
	}
	public function updateOrdem(){
		$input = \Input::all();
	
		foreach($input['itens'] as $key => $value) {
		 $item = explode('_',$value);	
		 $item = $this->produto_relacionado->find($item[1]);
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
			return $this->destroySingle($id,"Caracteristica",$this->produto_relacionado);
		}else{
			$ids = json_decode($input["ids"]);
			return $this->destroyMultiples($ids,"Caracteristica",$this->produto_relacionado);
		}
	}
}
