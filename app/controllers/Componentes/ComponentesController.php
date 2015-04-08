<?php
namespace Componentes;
class ComponentesController extends BaseController {

	protected $menu;
	protected $menu_item;

	public function __construct(\Admin\Menu $menu,\Admin\MenuItem $menu_item){
		$this->menu = $menu;
		$this->menu_item = $menu_item;
	}
 	public function getLinkInicial(){
		$data = $this->menu_item->where('pagina_inicial',1)->get();
		return \Response::json($data);
	}
	public function getLinkApelido(){
		$input = \Input::all();
		$data = $this->menu_item->where('apelido',$input['apelido'])->where('publicado',true)->get();
		return \Response::json($data);
	}


}
?>