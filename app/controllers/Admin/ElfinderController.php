<?php
namespace admin;

class ElfinderController extends BaseController{

	public function __construct(){
		$this->beforeFilter('csrf', array('on' => 'get|post|put|delete'));
	}
	public function connector(){
		return \FileManager::connector();
	}
	public function show(){
		return \View::make('admin.elfinder.index');
	}

}

?>