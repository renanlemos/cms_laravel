<?php

namespace Admin;

class Contato extends \Eloquent {
	
	protected $includes = array('contatos');
	protected $table = 'contatos';
	protected $guarded = array();

	public static function boot(){
    	Contato::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post)
        {    
        	$post->parametros = json_encode($post->parametros);
        });
        static::updating(function($post){
         	$post->parametros = json_encode($post->parametros);
        });
        static::deleting(function($post){    
        });
    }
	public static function rules($id,$input){

		$rules =   array(
			'titulo' => 'required|unique:contatos,titulo,'.$id,
			'config_global' => 'required',
		);
		if($input['config_global'] == 0){
			$r = array('email_remetente' => 'required|email',
					   'nome_remetente' => 'required');
			$rules = array_merge($rules,$r);
		}
		if($input['config_global'] == 0 and $input['autenticacao_email'] == 1){
			$r = array('usuario_email' => 'required',
					   'senha_email' => 'required');
			$rules = array_merge($rules,$r);
		}
		return $rules;
	}
	public static function messages($input){

		$messages =   array(
			'titulo.required' => '- Titulo é Obrigatório.',
			'titulo.unique' => '- Titulo ja está Cadastrado.',
			'conig_global.required' => '- Usar Configuração Global é Obrigatório.'
		);
		if($input['config_global'] == 0){
			$m = array('email_remetente.required' => '- Email Remetente é Obrigatório.',
					   'email_remetente.email' => '- Email Remetente é Inválido.',
					   'nome_remetente.required' => '- Nome Remetente é Obrigatório.', );
			$messages = array_merge($messages,$m);
		}
		if($input['config_global'] == 0 and $input['autenticacao_email'] == 1){
			$m = array('usuario_email.required' => '- Usuário é Obrigatório.',
					   'senha_email.required' => '- Senha é Obrigatória.');
			$messages = array_merge($messages,$m);
		}
		return $messages;
	} 
	public function rulesSendEmail(){

		$rules =   array(
			'nome' => 'required',
			'email' => 'required|email',
			'assunto' => 'required',
			'mensagem' => 'required'
		);
		return $rules;
	}
	public static function messagesSendEmail(){

		$messages =   array(
			'nome.required' => '- Nome é Obrigatório.',
			'email.required' => '- Email é Obrigatório.',
			'email.email' => '- Email é inválido.',
			'assunto.required' => '- Assunto é Obrigatório.',
			'mensagem.required' => '- Mensagem é Obrigatório.'
		);
		return $messages;
	} 
}
