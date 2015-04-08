<?php

namespace Admin;
class EventoHospedagemValor extends \Eloquent {
	
	protected $includes = array('evento_hospedagem_valors');
	protected $guarded = array();
	public static $message_error = "";
	
	public function hospedagens(){
    	return $this->belongsTo("Admin\EventoEventoHospedagem","evento_evento_hospedagem_id");
    }
	public static function boot(){
    	EventoHospedagemValor::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post){
        	$valor =  EventoHospedagemValor::selectRaw('MAX(ordem) as ordem')->where('evento_evento_hospedagem_id',$post->evento_evento_hospedagem_id)->get();
        	if(count($valor) > 0){
        		$post->ordem = $valor[0]->ordem+1;
        	}else{
        		$post->ordem = 1;
        	}
        });
        static::updating(function($post){});
        static::deleting(function($post){});
    }
	public static function rules($id,$input){

		$categoria_id = $input['evento_evento_hospedagem_id'];

		$rules =   array(
			"descricao" => "required|unique_campo_categoria:evento_hospedagem_valors,descricao,evento_evento_hospedagem_id,$id,$categoria_id",
			"valor" => "required"
		);
		return $rules;
	}
	public static function messages(){

		$messages =   array(
			'descricao.required' => '- Descrição é Obrigatório.',
			'descricao.unique_campo_categoria' => '- Descrição já está Cadastrado.',
			'valor.required' => '- Valor é Obrigatório.'
        );
		return $messages;
	} 
}
