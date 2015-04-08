<?php
namespace Modulos;
class ModuloMenusController extends BaseController {

	protected $menu;
	protected $menu_item;
    protected $array_data = array();
    protected $count_children = 0;
    protected $itens;

	public function __construct(\Admin\Menu $menu,\Admin\MenuItem $menu_item){
		$this->menu = $menu;
		$this->menu_item = $menu_item;
	}
    public function getMenu(){
    	$input = \Input::all();
		$data = $this->menu_item->where('menu_id',$input['menu_id'])->where('publicado',1)->orderBy('item_pai')->orderBy('ordem')->get();
		return \Response::json($data);
	    
	}
	public function getChildrens(){
		foreach ($this->itens as $k => $value){
			$items = $this->menu_item->select('id','titulo','item_pai')->where('item_pai',$value->id)->where('publicado',true)->get();
			
			if(count($items) > 0){
				$a = array();
        		foreach ($items as $key => $value) {
        		    array_push($a,$value);
        			$i = $this->menu_item->select('id','titulo','item_pai')->where('item_pai',$value->id)->where('publicado',true)->get();
        		    if(count($i) > 0){
        		    	$b = array();
	        		    foreach ($i as $key2 => $value){
	        		    	array_push($b,$value);
	        		    }	
	        		    $array_itens = array("sub_itens" => $b);
						$i[$k]  = array_merge(get_object_vars($i[$k]),$array_itens);	
	        		}    
        		}
        		$array_itens = array("sub_itens" => $a);
				$this->itens[$k] = array_merge(get_object_vars($this->itens[$k]),$array_itens);	
        		//$this->readChildrens($items,$value->id);
        	}
        }
	}
	public function readChildrens($dados,$id){
		
		
		
		if(count($dados) > 0){
			foreach ($dados as $key => $value){
				$items = $this->menu_item->where('item_pai',$value->id)->where('publicado',true)->get();
	       		$array_itens = array("sub_itens" => $items);
				$this->itens[$key] = array_merge(get_object_vars($this->itens[$key]),$array_itens);
	   			$this->itens[$key] = array_merge(get_object_vars($this->itens[$key]),$array_itens);

				if(count($items) > 1){
	   				//$this->readChildrens($items,$value->id);
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
}
?>