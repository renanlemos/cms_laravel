<?php

namespace Admin;
class EventoHospedagemCidade extends \Eloquent {
	
	protected $includes = array('evento_hospedagem_cidades');
	protected $guarded = array();
	public static $message_error = "";
	
	public function hospedagens(){
    	return $this->hasMany("Admin\EventoHospedagem");
    }
	public static function boot(){
    	EventoHospedagemCidade::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post){});
        static::updating(function($post){});
        static::deleting(function($post){    
        	if($post->hospedagens()->count() > 0){
        		self::$message_error = "Possue Hotéis.";
        		return false;
        	}
        });
    }
	public static function rules($id){

		$rules =   array(
			'descricao' => 'required|unique:evento_hospedagem_cidades,descricao,'.$id,
		);
		return $rules;
	}
	public static function messages(){

		$messages =   array(
			'descricao.required' => '- Descrição é Obrigatório.',
			'descricao.unique' => '- Descrição já está Cadastrado.'
        );
		return $messages;
	} 
}
