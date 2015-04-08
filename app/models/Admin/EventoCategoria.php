<?php

namespace Admin;
class EventoCategoria extends \Eloquent {
	
	protected $includes = array('evento_categorias');
	protected $guarded = array();
	public static $message_error = "";
	
	public function produtos(){
    	//return $this->hasMany("Admin\Produto");
    }
	public static function boot(){
    	EventoCategoria::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post)
        {   
            $data = EventoCategoria::take(1)->get();

        	if(count($data) > 0){
        		$ordem = EventoCategoria::selectRaw('MAX(ordem) as ordem')->get();
           		$post->ordem = ($ordem[0]->ordem+1);
        	}else{
        		$post->ordem = 1;
        	} 
        	$post->parametros = json_encode($post->parametros);
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
	public static function rules($id){

		$rules =   array(
			'titulo' => 'required|unique:produto_categorias,titulo,'.$id,
			'apelido' => 'required|unique:produto_categorias,apelido,'.$id,
		);
		return $rules;
	}
	public static function messages(){

		$messages =   array(
			'titulo.required' => '- Título é Obrigatório.',
			'titulo.unique' => '- Título ja está Cadastrado.',
			'apelido.required' => '- Apelido é Obrigatório.',
			'apelido.unique' => '- Apelido ja está Cadastrado.'

		);
		return $messages;
	} 
}
