<?php

namespace Admin;

class ArtigoCategoria extends \Eloquent {
	
	protected $includes = array('artigo_categorias');
	protected $table = 'artigo_categorias';
	protected $guarded = array();
	public static $message_error = "";
	
	public function artigos(){
    	return $this->hasMany("Admin\Artigo");
    }
	public static function boot(){
    	ArtigoCategoria::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post)
        {    
        	$post->parametros = json_encode($post->parametros);
        });
        static::updating(function($post){
         
        });
        static::deleting(function($post){    
        	if($post->artigos()->count() > 0){
        		self::$message_error = "Possue Artigos.";
        		return false;
        	}
        });
    }
	public static function rules($id){

		$rules =   array(
			'descricao' => 'required|unique:artigo_categorias,descricao,'.$id,
		);
		return $rules;
	}
	public static function messages(){

		$messages =   array(
			'descricao.required' => '- Descrição é Obrigatório.',
			'descricao.unique' => '- Descrição ja está Cadastrado.'

		);
		return $messages;
	} 
}
