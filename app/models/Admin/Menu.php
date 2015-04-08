<?php

namespace Admin;

class Menu extends \Eloquent {
	
	protected $includes = array('menus');
	protected $table = 'menus';
	protected $guarded = array();
	public static $message_error = ""; 
	
	public function menu_itens(){
    	return $this->hasMany("Admin\MenuItem");
    }
	public static function boot(){
    	Menu::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post)
        {    
        });
        static::updating(function($post){
        });
        static::deleting(function($post){    
        	if($post->menu_itens()->count() > 0){
        		self::$message_error = "Possue sub itens.";
        		return false;
        	}
        });
    }
	public static function rules($id){

		$rules =   array(
			'titulo' => 'required|unique:menus,titulo,'.$id,
			'apelido' => 'required|unique:menus,apelido,'.$id,
		);
		return $rules;
	}
	public static function messages(){

		$messages =   array(
			'titulo.required' => '- Titulo é Obrigatório.',
			'titulo.unique' => '- Titulo ja está Cadastrado.',
			'apelido.required' => '- Apelido é Obrigatório.',
			'apelido.unique' => '- Apelido ja está Cadastrado.'
		);
		return $messages;
	} 
}
