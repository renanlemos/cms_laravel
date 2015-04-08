<?php

namespace Admin;
class EventoHospedagemIncluso extends \Eloquent {
	
	protected $includes = array('evento_hospedagem_incluso');
	protected $guarded = array();
	public static $message_error = "";
	
	public function hospedagens(){
    	return $this->belongsToMany("Admin\EventoHospedagem","evento_hospedagem_evento_hospedagem_inclusos");
    }
	public static function boot(){
    	EventoHospedagemIncluso::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post){   
        });
        static::updating(function($post){
        });
        static::deleting(function($post){    
        	if($post->hospedagens()->count() > 0){
        		self::$message_error = "Possue Hotéis.";
        		return false;
        	}
        });
    }
	public static function rules($id){

		$rules =   array(
			'descricao' => 'required|unique:evento_hospedagem_inclusos,descricao,'.$id,
			'imagem' => 'required',
		);
		return $rules;
	}
	public static function messages(){

		$messages =   array(
			'descricao.required' => '- Descrição é Obrigatório.',
			'descricao.unique' => '- Descrição ja está Cadastrado.',
			'imagem.required' => '- Icone é Obrigatório.'
        );
		return $messages;
	} 
}
