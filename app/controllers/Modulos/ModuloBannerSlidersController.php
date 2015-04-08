<?php
namespace Modulos;
class ModuloBannerSlidersController extends BaseController {


	public function __construct(){

	}
    public function getFotos(){
    	$input = \Input::all();
		$data = \DB::table('banner_slider_fotos')->where('banner_slider_id',$input['banner_id'])->where('publicado',true)->orderBy('ordem')->get();
		return \Response::json($data);
	}

}
?>