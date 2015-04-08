<?php
namespace admin;

class SiteConfigsController extends BaseController{

	protected $site_config;

	public function __construct(SiteConfig $site_config){
		$this->site_config = $site_config;
		$this->beforeFilter('csrf', array('on' => 'put|delete|post'));
	}
	public function getConfig(){
		$config = $this->site_config->find(1);

		return \Response::json($config);
	}
	public function update(){
		$input = array_except(\Input::all(), '_method');
		$config = $this->site_config->find(1);

		$validation = \Validator::make($input,SiteConfig::rules(),SiteConfig::messages());
		if($validation->passes()){
			if($config->update($input)){
				$data = array("data" => "Configuração alterada com sucesso.","status" => 1);
				return \Response::json($data);
			}else{
				$data = array("data" => "Não foi possível alterar configuração.","status" => 0);
				return \Response::json($data);
			}
		}else{
			$data = array("data" => $validation->messages(),"status" => 0);
			return \Response::json($data);
		}

	}
}



?>