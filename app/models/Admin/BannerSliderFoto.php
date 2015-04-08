<?php

namespace Admin;

class BannerSliderFoto extends \Eloquent {
	
	protected $includes = array('banner_slider_fotoss');
	protected $table = 'banner_slider_fotos';
	protected $guarded = array();
    
    public function banners(){
       return $this->belongsTo("Admin\BannerSlider","banner_slider_id");
    }
	public static function boot(){
    	BannerSliderFoto::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post){    
        	$data = \DB::table('banner_slider_fotos')->where('banner_slider_id',$post->banner_slider_id)->get();

        	if(count($data) > 0){
        		$ordem = \DB::table('banner_slider_fotos')->selectRaw('MAX(ordem) as ordem')->where('banner_slider_id',$post->modulo_posicao_id)->get();
           		$post->ordem = ($ordem[0]->ordem+1);
        	}else{
        		$post->ordem = 1;
        	}
        });
        static::updating(function($post){

        });
        static::deleting(function($post){
        	
        });
    }
	public static function rules($id,$input){

		$categoria_id = $input['banner_slider_id'];

		$rules =   array(
			"imagem" => "required|unique_campo_categoria:banner_slider_fotos,imagem,banner_slider_id,$id,$categoria_id",
			"titulo" => "required",
			"alt" => "required",
			"banner_slider_id" => "required|integer"
		);
		return $rules;
	}
	public static function messages(){

		$messages =   array(
			'imagem.required' => '- Imagem é Obrigatória.',
			'imagem.unique_campo_categoria' => '- Imagem já está Cadastrada.',
			'titulo.required' => '- Título é Obrigatório.',
			'alt.required' => '- Alt é Obrigatório.',
			'banner_slider_id.required' => '- Banner Id é Obrigatório.'
		);
		return $messages;
	} 
}
