<?php

namespace admin;
class BannerSliderFotosController extends BaseController {

	protected $banner_slider_fotos;

	public function __construct(BannerSliderFoto $banner_slider_fotos){
		$this->banner_slider_fotos = $banner_slider_fotos;
		$this->beforeFilter('csrf', array('on' => 'put|delete|post'));
	}
	public function grid(){
		$input = \Input::all();
		$banner_slider_id = $input['banner_slider_id'];
        $where = "banner_slider_id =".$banner_slider_id." and ";
        $sort_campo = "id";
        $sort_dir = "desc";
        
        if(isset($input['sort'])){
        	$sort_campo = $input['sort'][0]['field'];
        	$sort_dir = $input['sort'][0]['dir'];
        } 
		if(isset($input["filter"]) and !empty($input["filter"])){
			$where .= $this->filters($input["filter"]);
			$dados = $this->banner_slider_fotos->whereRaw($where)->orderBy($sort_campo,$sort_dir)->take($input['pageSize'])->skip($input['skip'])->get();
            $total = count($this->banner_slider_fotos->whereRaw($where)->get());
        }else{
        	$dados = $this->banner_slider_fotos->where('banner_slider_id',$banner_slider_id)->take($input['pageSize'])->skip($input['skip'])->orderBy($sort_campo,$sort_dir)->get();
        	$total = count($dados);
        }
     	$data = array("data" => $dados,"total" => $total);
		return \Response::json($data);
	}
	public function store(){
		 
	    $input = \Input::all();
		$validation = \Validator::make($input,BannerSliderFoto::rules(0,$input),BannerSliderFoto::messages());

		if ($validation->passes()){
			if($this->banner_slider_fotos->create($input)){
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
			$validation = \Validator::make($input,BannerSliderFoto::rules($id,$input),BannerSliderFoto::messages());
		}else{
			$validation = \Validator::make($input,BannerSliderFoto::rules($id,$input),BannerSliderFoto::messages());
		}	
		if ($validation->passes()){
			$empresa = $this->banner_slider_fotos->find($id);
			
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
			return $this->destroySingle($id,"Imagem",$this->banner_slider_fotos);
		}else{
			$ids = json_decode($input["ids"]);
			return $this->destroyMultiples($ids,"Imgaem",$this->banner_slider_fotos);
		}
	}
	public function getOrdem(){
		$input = \Input::all();
		$data = $this->banner_slider_fotos->where('banner_slider_id',$input['banner_slider_id'])->orderBy('ordem')->get();
		
		return \Response::json($data);
	}
	public function updateOrdem(){
		$input = \Input::all();
		$teste = array();

		foreach($input['itens'] as $key => $value) {
		 $item = explode('_',$value);	
		 $banner = $this->banner_slider_fotos->find($item[1]);
		 $data = array("ordem" => ($key+1));
		 $banner->update($data);	
		}
		return \Response::json(array('data' => "Sucesso"));
	}
}
