<?php

namespace Admin;
class EventoContato extends \Eloquent {
	
	protected $includes = array('evento_contatos');
	protected $guarded = array();
	public static $message_error = "";
	
	public function produtos(){
    	//return $this->hasMany("Admin\Produto");
    }
	public static function boot(){
    	EventoContato::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post){});
        static::updating(function($post){});
        static::deleting(function($post){});
    }
	public static function rules($id){

		$rules =   array(
			'nome' => 'required|unique:evento_contatos,nome,'.$id,
			'email' => 'required|email'
		);
		return $rules;
	}
	public static function messages(){

		$messages =   array(
			'nome.required' => '- Nome é Obrigatório.',
            'nome.unique' => '- Nome já está Cadastrado.',
			'email.required' => '- Email é Obrigatório.',
			'email.email' => '- Email inválido.'
        );
		return $messages;
	} 
}
