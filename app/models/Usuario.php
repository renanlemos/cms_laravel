<?php

class Usuario extends Eloquent {
	
	protected $includes = array('usuarios');
	protected $table = 'usuarios';
	protected $guarded = array();

	public static function boot(){
    	Usuario::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post)
        {    
        	$senha = md5($post->senha);
        	$permissoes = json_encode($post->permissoes);
        	$post->senha = $senha;
        	$post->permissoes = $permissoes;
        });

        static::updating(function($post){
          $post_original = $post->getOriginal();	
          $permissoes = json_encode($post->permissoes);
          $senha = $post->senha;
          $post->permissoes = $permissoes;
          if(empty($senha)){
          	$post->senha = $post_original["senha"];
          }else{
           	$post->senha = md5($senha);;
          }
        });
    }
	public static function rules($id,$senha){

		$rules =   array(
			'nome' => 'required|unique:usuarios,nome,'.$id,
			'nome_usuario' => 'required|unique:usuarios,nome_usuario,'.$id,
			'email' => 'required|email:unique,email,'.$id,
			'ativo' => 'required',
			'permissoes' => 'required'
		);
		if($senha){
			$arraySenha = array('senha' => 'required|min:8|caracter_and_numeric');	
			$rules = array_merge($rules,$arraySenha);
		}
		return $rules;
	}
	public static function messages($senha){

		$messages =   array(
			'nome.required' => '- Nome é Obrigatório.',
			'nome.unique' => '- Nome ja está Cadastrado.',
			'nome_usuario.required' => '- Nome Usuário é Obrigatório.',
			'nome_usuario.unique' => '- Nome Usuário ja está Cadastrado.',
			'email.required' => '- Email é Obrigatório.',
			'email.email' => '- Email é Inválido.',
			'email.unique' => '- Email ja está Cadastrado.',
			'ativo.required' => '- Ativo é Obrigatório.'
		);
		if($senha){
			$arraySenha = array('senha.required' => '- Senha é Obrigatório.',
								'senha.min' => '- Senha deve ter no mínimo 8 caracteres.',
								'senha.caracter_and_numeric' => '- Senha deve conter números e letras.');
			$messages = array_merge($messages,$arraySenha);
		}
		return $messages;
	} 
}
