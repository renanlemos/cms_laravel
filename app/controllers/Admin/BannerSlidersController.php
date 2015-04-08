<?php

namespace admin;
class BannerSlidersController extends BaseController {

	protected $banner_slider;

	public function __construct(BannerSlider $banner_slider){
		$this->banner_slider = $banner_slider;
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
			$dados = $this->banner_slider->whereRaw($where)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $total = count($this->banner_slider->whereRaw($where)->get());
        }else{
        	$dados = $this->banner_slider->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
        	$total = $this->banner_slider->all()->count();
        }
     	$data = array("data" => $dados,"total" => $total);
		return \Response::json($data);
	}
	public function combo(){
		$data = $this->banner_slider->select("id","descricao")->get();
    	return \Response::json($data);
	}
	public function store(){
		 
	    $input = \Input::all();
		$validation = \Validator::make($input,BannerSlider::rules(0),BannerSlider::messages());

		if ($validation->passes()){
			if($this->banner_slider->create($input)){
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

		if(empty($senha)){
			$validation = \Validator::make($input,BannerSlider::rules($id),BannerSlider::messages());
		}else{
			$validation = \Validator::make($input,BannerSlider::rules($id),BannerSlider::messages());
		}	
		if ($validation->passes()){
			$empresa = $this->banner_slider->find($id);
			
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
			return $this->destroySingle($id,"Banner Slider",$this->banner_slider);
		}else{
			$ids = json_decode($input["ids"]);
			return $this->destroyMultiples($ids,"Banner Slider",$this->banner_slider);
		}
	}
}
