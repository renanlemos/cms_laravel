<?php

namespace Admin;
class Auth{
	protected $guarded = array();
    
	public static function rules(){

		$rules =   array(
			'nome_usuario' => 'required',
			'senha' => 'required'
	
		);
		return $rules;
	}
	public static function messages(){

		$messages =   array(
			'nome_usuario.required' => '- Usuário é Obrigatório.',
			'senha.required' => '- Senha é Obrigatória.'
	
		);
		return $messages;
	}  
}