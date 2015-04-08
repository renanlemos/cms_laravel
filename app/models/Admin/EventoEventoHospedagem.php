<?php

namespace Admin;
class EventoEventoHospedagem extends \Eloquent {
	
	protected $includes = array('evento_evento_hospedagems');
	protected $guarded = array();
	public static $message_error = "";
	
	public function servicos(){
    	return $this->belongsToMany("Admin\EventoServico","evento_evento_servicos");
    }
    public function valores(){
    	return $this->hasMany("Admin\EventoHospedagemValor");
    }
	public static function boot(){
    	EventoEventoHospedagem::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post){
        	$evento = EventoEventoHospedagem::selectRaw('MAX(ordem) as ordem')->where('evento_id',$post->evento_id)->get();

        	if(count($evento) > 0){
        		$post->ordem = $evento[0]->ordem+1;
        	}else{
        		$post->ordem = 1;
        	}

        });
        static::updating(function($post){});
        static::deleting(function($post){  
        	if($post->valores()->count() > 0){
        		self::$message_error = "Possue Valores";
        		return false;
        	}
        });
    }
	public static function rules($id,$input){

        $evento_id = $input['evento_id'];
        $evento_hospedagem_id = $input['evento_hospedagem_id'];
        $evento_hospedagem_categoria_id = $input['evento_hospedagem_categoria_id'];

		$rules =   array(
			"evento_id" => "required",
			"evento_hospedagem_id" => "required|unique_hospedagem_categoria:$id,$evento_id,$evento_hospedagem_id,$evento_hospedagem_categoria_id",
			"evento_hospedagem_categoria_id" => "required"
		);
		return $rules;
	}
	public static function messages(){

		$messages =   array(
			'evento_id.required' => '- Evento é Obrigatório.',
			'evento_hospedagem_id.required' => '- Hospedagem é Obrigatório.',
			'evento_hospedagem_categoria_id.required' => '- Categoria é Obrigatório.',
            "evento_hospedagem_id.unique_hospedagem_categoria" => "- Este Hotel e Categoria já estão Cadastrados."

		);
		return $messages;
	} 
}
