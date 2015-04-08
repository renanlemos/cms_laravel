<?php
namespace admin;

class MenuItensController extends BaseController {

	protected $menu_item;
	protected $array_data = array();
   	protected $count_children = 0;
   	protected $linha_children = 0;

	public function __construct(MenuItem $menu_item){
		$this->menu_item = $menu_item;
		$this->beforeFilter('csrf', array('on' => 'put|delete|post'));
	}
	public function grid(){
		$input = \Input::all();
        $where = "";
        $sort_campo = "ordem";
        $sort_dir = "asc";
        
        if(isset($input['sort'])){
        	$sort_campo = $input['sort'][0]['field'];
        	$sort_dir = $input['sort'][0]['dir'];
        } 
		if(isset($input["filter"]) and !empty($input["filter"])){
			$where = $this->filters($input["filter"]);
			$dados = $this->menu_item->whereRaw('menu_id = '.$input['menu_id'].' and item_pai = 0 and '.$where)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $dados = $this->getChildrens($dados);
            $total = count($this->menu_item->whereRaw('menu_id = '.$input['menu_id'].' and '.$where)->get());
        }else{
        	$dados = $this->menu_item->where('menu_id',$input['menu_id'])->where('item_pai',0)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
        	$dados = $this->getChildrens($dados);
        	$total = count($this->menu_item->where('menu_id',$input['menu_id'])->where('item_pai',0)->get());
        	
        }
     	$data = array("data" => $dados,"total" => $total,'combo_item_pai' => $this->comboItemPaiGrid($input['menu_id']));
		return \Response::json($data);
	}
	public function getChildrens($dados){
		foreach ($dados as $key => $value){
			array_push($this->array_data,$value);
			$items = $this->menu_item->where('item_pai',$value->id)->get();
        	if(count($items) > 0){
        		$this->count_children = 0;
        		$this->linha_children = 0;
        		$this->readChildrens($items,$value->id);
        	}
        }
        return $this->array_data;
	}
	public function readChildrens($dados,$id){
		$this->count_children++;
		$this->linha_children++;
		if(count($dados) > 0){
			foreach ($dados as $key => $value){
				$separator = "";	
	        	for ($i=0; $i < $this->linha_children; $i++) { 
	        		$separator .= '<span class="icon-arrow-right-2"></span>'; 
	       		}
	       		$value->titulo = $separator.$value->titulo;
	       		array_push($this->array_data,$value);
	   			$items = $this->menu_item->where('item_pai',$value->id)->get();
	       			   			
	   			if(count($items) > 0){
	   				$this->readChildrens($items,$value->id);
	   				$this->linha_children = 1;
	   			}	       	    
	       	    	
	       	}

		}    
	}
	public function getItensChildrens($dados,$id){
		$array_data = array();
		foreach ($dados as $key => $value){
			if($value->item_pai == $id){
				array_push($array_data,$value);
			}
		}	
		return $array_data;
	}
	public function comboItemPaiGrid($menu_id){
		$input = \Input::all();
		$data = $this->menu_item->select("id as value","titulo as text")->where('menu_id',$menu_id)->get()->toArray();
    	$item_default = array('value'=>0,'text'=>'Item Raiz');
    	array_unshift($data,$item_default); 
    	return $data;

	}
	public function comboItemPai(){
		$input = \Input::all();
		$data = $this->menu_item->select("id","titulo")->where('menu_id',$input['menu_id'])->get()->toArray();
    	$item_default = array('id'=>0,'titulo'=>'Item Raiz');
    	array_unshift($data,$item_default); 
    	return \Response::json($data);

	}
	public function store(){
		 
	    $input = \Input::all();
	    if(empty($input['apelido'])){
			$input['apelido'] = \AppString::formataApelido($input['titulo']);
		}
		$validation = \Validator::make($input,MenuItem::rules(0,$input),MenuItem::messages($input));

		if ($validation->passes()){
			if($this->menu_item->create($input)){
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
		$validation = \Validator::make($input,MenuItem::rules($id,$input),MenuItem::messages($input));
		$input['parametros'] = json_encode($input['parametros']);
		
		if ($validation->passes()){
			$empresa = $this->menu_item->find($id);
			
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
			return $this->destroySingle($id,"Item",$this->menu_item);
		}else{
			$ids = json_decode($input["ids"]);
			return $this->destroyMultiples($ids,"Item",$this->menu_item);
		}
	}
	public function updateOrdem(){
		$input = \Input::all();
		$teste = array();

		foreach($input['itens'] as $key => $value) {
		 $item = explode('_',$value);	
		 $menu_item = $this->menu_item->find($item[1]);
		 $data = array("ordem" => ($key+1));
		 $menu_item->update($data);	
		}
		return \Response::json(array('data' => "Sucesso"));
	}
	public function ordem(){
		$input  =\Input::all();
		$data = $this->menu_item->select('id','titulo')->where('menu_id',$input['menu_id'])->where('item_pai',$input['item_pai'])->orderBy('ordem')->get();
		return \Response::json($data);
	}
	public function updatePaginaInicial(){
		$input = \Input::all();
		$item = $this->menu_item->find($input['id']);
		if($item->update(['pagina_inicial' => true])){
			return \Response::json(array('data' => "Sucesso","status" =>1));
		}else{
			return \Response::json(array('data' => "Error","status" =>0));
		}
	}
}
