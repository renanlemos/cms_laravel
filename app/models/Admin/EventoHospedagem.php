<?php

namespace Admin;
class EventoHospedagem extends \Eloquent {
	
	protected $includes = array('evento_hospedagens');
	protected $guarded = array();
	public static $message_error = "";
	
    public function  cidade(){
    	return $this->belongsTo("Admin\ProdutoHospedagemCidade","evento_hospedagem_cidade_id");
    }
    public function inclusos(){
    	return $this->belongsToMany("Admin\EventoHospedagemIncluso","evento_hospedagem_evento_hospedagem_inclusos");
    }
    public function eventos(){
    	return $this->belongsToMany("Admin\Evento","evento_evento_hospedagems");
    }
	public static function boot(){
    	EventoHospedagem::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post){});
        static::updating(function($post){});
        static::deleting(function($post){

        	$resp = true;
        	if($post->inclusos()->count() > 0){
        		self::$message_error .= " Possue Inclusos";
        		$resp =  false;
        	}
        	if($post->eventos()->count() > 0){
        		if(strlen(self::$message_error) > 0){
        			self::$message_error .= ",";
        		}else{
        			self::$message_error .= "Possue ";
        		}
        		self::$message_error .= "Eventos";
        		$resp = false;
        	}
        	return $resp;
        });
    }
	public static function rules($id){

		$rules =   array(
			'nome' => 'required|unique:evento_hospedagems,nome,'.$id,
			'evento_hospedagem_cidade_id' => 'required'
		);
		return $rules;
	}
	public static function messages(){

		$messages =   array(
			'nome.required' => '- Nome é Obrigatório.',
            'nome.unique' => '- Nome já está Cadastrado.',
			'evento_hospedagem_cidade_id.required' => '- Cidade é Obrigatório.'
        );
		return $messages;
	} 
}
