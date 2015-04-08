<?php

namespace Admin;

class Artigo extends \Eloquent {
	
	protected $includes = array('artigos');
	protected $table = 'artigos';
	protected $guarded = array();
	public static $message_error = "";

	public function artigo_categorias(){
    	return $this->belongsTo("Admin\ArtigoCategoria","artigo_categoria_id");
    }
    public function fotos(){
    	return $this->hasMany("Admin\ArtigoFoto");
    }
	public static function boot(){
    	Artigo::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post)
        {    
        	$post->parametros = json_encode($post->parametros);
        });
        static::created(function($post){    
            $pasta = "artigo-".$post->id;
            $dir = public_path("conteudo/artigos/".$pasta);
            \File::makeDirectory($dir, 0775);
        });
        static::updating(function($post){
         
        });
        static::deleting(function($post){   
        	if($post->fotos()->count() > 0){
        		self::$message_error = "Possue Fotos.";
        		return false;
        	}
        });
        static::deleted(function($post){  
            $pasta = "artigo-".$post->id;
            $dir = public_path("conteudo/artigos/".$pasta);
            \File::deleteDirectory($dir); 
        });  
    }
	public static function rules($id){

		$rules =   array(
			'titulo' => 'required|unique:artigos,titulo,'.$id,
			'apelido' => 'required|unique:artigos,apelido,'.$id,
			'artigo_categoria_id' => 'required|integer'

		);
		return $rules;
	}
	public static function messages(){

		$messages =   array(
			'titulo.required' => '- Titulo é Obrigatório.',
			'titulo.unique' => '- Titulo ja está Cadastrado.',
			'apelido.required' => '- Apelido é Obrigatório.',
			'apelido.unique' => '- Apelido ja está Cadastrado.',
			'artigo_categoria_id.required' => '- Categoria é Obrigatório.',
			'artigo_categoria_id.integer' => '- Categoria deve ser inteiro.'

		);
		return $messages;
	} 
}
