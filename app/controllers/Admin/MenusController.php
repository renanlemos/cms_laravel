<?php
namespace admin;

class MenusController extends BaseController {

	protected $menu;
       
	public function __construct(Menu $menu){
		$this->menu = $menu;
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
			$dados = $this->menu->whereRaw($where)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $total = count($this->menu->whereRaw($where)->get());
        }else{
        	$dados = $this->menu->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
        	$total = $this->menu->all()->count();
        }
     	$data = array("data" => $dados,"total" => $total);
		return \Response::json($data);
	}
	public function combo(){
		$data = $this->menu->select("id","titulo")->get();
    	return \Response::json($data);
	}
	public function comboItemPai(){
		$input = \Input::all();
		$item_default = array("id" => 0,"titulo" => "Item Raiz");
		$data = \DB::table('menus')->select("id","titulo")->where("id",$input['menu_id'])->get();
    	array_unshift($data,$item_default);
    	return \Response::json($data);
	}
	public function store(){
		 
	    $input = \Input::all();
	    if(empty($input['apelido'])){
			$input['apelido'] = \AppString::formataApelido($input['titulo']);
		}
		$validation = \Validator::make($input,Menu::rules(0),Menu::messages());

		if ($validation->passes()){
			if($this->menu->create($input)){
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
		$validation = \Validator::make($input,Menu::rules($id),Menu::messages(true));
		
		if ($validation->passes()){
			$empresa = $this->menu->find($id);
			
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
			return $this->destroySingle($id,"Menu",$this->menu);
		}else{
			$ids = json_decode($input["ids"]);
			return $this->destroyMultiples($ids,"Menu",$this->menu);
		}
	}
}
