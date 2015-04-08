<?php

namespace Admin;

class BannerSlider extends \Eloquent {
	
	protected $includes = array('banner_sliders');
	protected $table = 'banner_sliders';
	protected $guarded = array();
    public static $message_error = "";

    public function banner_fotos(){
    	return $this->hasMany("Admin\BannerSliderFoto");
    }
	public static function boot(){
    	BannerSlider::observe(new \LogObserver);
        parent::boot();

        static::created(function($post){    
        	$pasta = "banner-".$post->id;
        	$dir = public_path("componentes/banner-slider/".$pasta);
        	\File::makeDirectory($dir, 0775);
        });
        static::updating(function($post){

        });
        static::deleting(function($post){
        	if($post->banner_fotos()->count() > 0){
                self::$message_error = "Possue Fotos";
        		return false;
        	}else{
        		$pasta = "banner-".$post->id;
	        	$dir = public_path("componentes/banner-slider/".$pasta);
	        	\File::deleteDirectory($dir);	
        	}
        	
        });

    }
	public static function rules($id){

		$rules =   array(
			'descricao' => 'required|unique:banner_sliders,descricao,'.$id,
		);
		return $rules;
	}
	public static function messages(){

		$messages =   array(
			'descricao.required' => '- Descrição é Obrigatório.',
			'descricao.unique' => '- Descrição ja está Cadastrado.'

		);
		return $messages;
	} 
}
