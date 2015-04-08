<?php

namespace Admin;
class EventoServico extends \Eloquent {
	
	protected $includes = array('evento_servicos');
	protected $guarded = array();
	public static $message_error = "";
	
	public function eventos(){
    	return $this->belongsToMany("Admin\Evento","evento_evento_servicos");
    }
	public static function boot(){
    	EventoCategoria::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post){});
        static::updating(function($post){});
        static::deleting(function($post){    
        	if($post->eventos()->count() > 0){
        		self::$message_error = "Possue Eventos.";
        		return false;
        	}
        });
    }
	public static function rules($id){

		$rules =   array(
			'descricao' => 'required|unique:evento_servicos,descricao,'.$id,
		);
		return $rules;
	}
	public static function messages(){

		$messages =   array(
			'descricao.required' => '- Descrição é Obrigatório.',
			'descricao.unique' => '- Descrição ja está Cadastrada.',
    	);
		return $messages;
	} 
}
