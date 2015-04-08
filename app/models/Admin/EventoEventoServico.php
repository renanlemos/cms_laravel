<?php

namespace Admin;
class EventoEventoServico extends \Eloquent {
	
	protected $includes = array('evento_evento_servicos');
	protected $guarded = array();
	public static $message_error = "";
	
	public function produtos(){
    	//return $this->hasMany("Admin\Produto");
    }
	public static function boot(){
    	EventoEventoServico::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post){
        	$evento_servico = EventoEventoServico::selectRaw('MAX(ordem) as ordem')->where('evento_id',$post->evento_id)->get();

        	if(count($evento_servico) > 0){
        		$post->ordem = $evento_servico[0]->ordem+1;
        	}else{
        		$post->ordem = 1;
        	}
        });
        static::updating(function($post){});
        static::deleting(function($post){    
        	//if($post->produtos()->count() > 0){
        	//	self::$message_error = "Possue Produtos.";
        	//	return false;
        	//}
        });
    }
	public static function rules($id,$input){

		$evento_id = $input['evento_id'];
		$evento_servico_id = $input['evento_servico_id'];

		$rules =   array(
			"evento_id" => "required",
			"evento_servico_id" => "required|unique_servico_evento:$id,$evento_id,$evento_servico_id"
		);
		return $rules;
	}
	public static function messages(){

		$messages =   array(
			'evento_id.required' => '- Evento é Obrigatório.',
			'evento_servico_id.required' => '- Serviço é Obrigatório.',
			'evento_servico_id.unique_servico_evento' => '- Serviço já está Cadastrado.'

		);
		return $messages;
	} 
}
