<?php

namespace Admin;
class ProdutoCaracteristica extends \Eloquent {
	
	protected $includes = array('produto_caracteristicas');
	protected $guarded = array();
	public static $message_error = "";
	
    public function produtos(){
    	return $this->belongsToMany('Admin\Produto','produto_produto_caracteristicas');
	}
	public static function boot(){
    	ProdutoCaracteristica::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post)
        {    
        });
        static::updating(function($post){
         	
        });
        static::deleting(function($post){    
        	if($post->produtos()->count() > 0){
        		self::$message_error .= " Possue Produtos";
        		return false;
        	}
        });
    }
	public static function rules($id){

		$rules =   array(
			'descricao' => 'required',
			'imagem' => 'required',
		);
		return $rules;
	}
	public static function messages(){

		$messages =   array(
			'titulo.required' => '- Descrição é Obrigatório.',
			'imagem.required' => '- Imagem é Obrigatório.'
		);
		return $messages;
	} 
}
