<?php

namespace Admin;

class SiteConfig extends \Eloquent {
	
	protected $includes = array('site_configs');
	protected $table = 'site_configs';
	protected $guarded = array();

	public static function boot(){
    	SiteConfig::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post)
        {    
      
        });
        static::updating(function($post){
      		if(empty($post->porta_email)){
      			$post->porta_email  = 587;
      		}
      		$post->parametros = json_encode($post->parametros);
        });
    }
	public static function rules(){

		$rules =   array(
			'nome' => 'required'

		);
		return $rules;
	}
	public static function messages(){

		$messages =   array(
			'nome.required' => '- Nome é Obrigatório.',
		);
		return $messages;
	} 
}
