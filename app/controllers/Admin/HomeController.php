<?php 

namespace admin;

class HomeController extends BaseController{

	public function index(){
		return \View::make('admin.home.index');
	}
}


?>