<?php

namespace Admin;

class ModuloPosicao extends \Eloquent {
	
	protected $includes = array('modulo_posicaos');
	protected $table = 'modulo_posicaos';
	protected $guarded = array();
	public static $message_error = "";

	public function modulos(){
    	return $this->hasMany("Admin\Modulo");
    }
	public static function boot(){
    	ModuloPosicao::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post)
        {    
        
        });
        static::updating(function($post){
         
        });
        static::deleting(function($post){    
        	if($post->modulos()->count() > 0){
        		self::$message_error = "Possue Módulos";
        		return false;
        	}
        });
    }
	public static function rules($id){

		$rules =   array(
			'descricao' => 'required|unique:modulo_posicaos,descricao,'.$id,
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
