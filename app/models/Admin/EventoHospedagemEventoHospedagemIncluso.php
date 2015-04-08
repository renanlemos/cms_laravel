<?php

namespace Admin;
class EventoHospedagemEventoHospedagemIncluso extends \Eloquent {
	
	protected $includes = array('evento_hospedagem_evento_hospedagem_inclusos');
	protected $guarded = array();
	public static $message_error = "";
	
	public function hoteis(){
    	//return $this->hasMany("Admin\Produto");
    }
	public static function boot(){
    	EventoHospedagemEventoHospedagemIncluso::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post){ 
        	$data = EventoHospedagemEventoHospedagemIncluso::selectRaw('MAX(ordem) as ordem')->where('evento_hospedagem_id',$post->evento_hospedagem_id)->take(1)->get();

        	if(count($data) > 0){
        		$post->ordem = $data[0]->ordem+1;
        	}else{
        		$post->ordem = 1;
        	}  

        });
        static::updating(function($post){
        });
        static::deleting(function($post){    
        	//if($post->produtos()->count() > 0){
        	//	self::$message_error = "Possue Produtos.";
        	//	return false;
        	//}
        });
    }
	public static function rules($id,$input){

		$evento_hospedagem_id = $input['evento_hospedagem_id'];
		$evento_hospedagem_incluso_id = $input['evento_hospedagem_incluso_id'];

		$rules =   array(
			"evento_hospedagem_incluso_id" => "required|unique_incluso_hospedagem:$id,$evento_hospedagem_id,$evento_hospedagem_incluso_id",
			"evento_hospedagem_id' => 'required",
		);
		return $rules;
	}
	public static function messages(){

		$messages =   array(
			'evento_hospedagem_incluso_id.required' => '- Incluso é Obrigatório.',
			'evento_hospedagem_incluso_id.unique_incluso_hospedagem' => '- Este incluso já está Cadastrado.',
			'evento_hospedagem_id.required' => '- Hotel é Obrigatório.'
		);
		return $messages;
	} 
}
