<?php

namespace Admin;
class EventoTexto extends \Eloquent {
	
	protected $includes = array('evento_textos');
	protected $guarded = array();
	public static $message_error = "";
	
	public function eventos(){
    	return $this->belongsTo("Admin\Evento","evento_id");
    }
	public static function boot(){
    	EventoTexto::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post){
        	$texto = EventoTexto::where('evento_id',$post->evento_id)->get();
        	if(count($texto) > 0){
        		$texto = EventoTexto::selectRaw("MAX(ordem) as ordem")->where('evento_id',$post->evento_id)->get();
        		$post->ordem = $texto[0]->ordem+1;
        	}else{
        		$post->ordem = 1;
        	}
        });
        static::updating(function($post){});
        static::deleting(function($post){    
        });
    }
	public static function rules($id){

		$rules =   array(
			"titulo" => "required",
			"descricao" => "required"
		);
		return $rules;
	}
	public static function messages(){

		$messages =   array(
			'titulo.required' => '- Título é Obrigatório.',
			'descricao.required' => '- Descrição é Obrigatório.'
		
    	);
		return $messages;
	} 
}
