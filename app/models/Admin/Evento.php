<?php

namespace Admin;
class Evento extends \Eloquent {
	
	protected $includes = array('eventos');
	protected $guarded = array();
	public static $message_error = "";
	
	public function servicos(){
    	return $this->belongsToMany("Admin\EventoServico","evento_evento_servicos");
    }
    public function fotos(){
    	return $this->hasMany("Admin\EventoFoto");
    }
    public function textos(){
        return $this->hasMany("Admin\EventoTexto");
    }
	public static function boot(){
    	Evento::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post){
        	$evento = Evento::selectRaw('MAX(ordem) as ordem')->get();

        	if(count($evento) > 0){
        		$post->ordem = $evento[0]->ordem+1;
        	}else{
        		$post->ordem = 1;
        	}

        });
        static::created(function($post){    
            $pasta = "evento-".$post->id;
            $dir = public_path("componentes/eventos/imagens/".$pasta);
            \File::makeDirectory($dir, 0775);
        });
        static::updating(function($post){});
        static::deleting(function($post){  
        	$resp = true;  
        	if($post->servicos()->count() > 0){
        		self::$message_error = "Possue Serviços.";
        		$resp = false;
        	}
        	if($post->fotos()->count() > 0){
        		if(strlen(self::$message_error) > 0){
                    self::$message_error .= ",";
                }else{
                    self::$message_error .= "Possue ";
                }
                self::$message_error .= "Fotos";
        		$resp = false;
        	}
            if($post->textos()->count() > 0){
                if(strlen(self::$message_error) > 0){
                    self::$message_error .= ",";
                }else{
                    self::$message_error .= "Possue ";
                }
                self::$message_error .= "Textos";
                $resp = false;
            }
        	return $resp; 
        });
        static::deleted(function($post){  
            $pasta = "evento-".$post->id;
            $dir = public_path("componentes/eventos/imagens/".$pasta);
            \File::deleteDirectory($dir); 
        });  
    }
	public static function rules($id){

		$rules =   array(
			'titulo' => 'required|unique:eventos,titulo,'.$id,
			'apelido' => 'required|unique:eventos,apelido,'.$id,
			'subtitulo' => 'required',
			'local' => 'required',
			'data_inicio' => 'required|date',
			'data_fim' => 'required|date',
			'evento_categoria_id' => 'required',
			'evento_contato_id' => 'required',
		);
		return $rules;
	}
	public static function messages(){

		$messages =   array(
			'titulo.required' => '- Título é Obrigatório.',
			'titulo.unique' => '- Título ja está Cadastrado.',
			'apelido.required' => '- Apelido é Obrigatório.',
			'apelido.unique' => '- Apelido ja está Cadastrado.',
			'subtitulo.required' => '- Subtitulo é Obrigatório',
			'local.required' => '- Local é Obrigatório',
			'data_inicio.required' => '- Data Inicio é Obrigatório',
			'data_inicio.date' => '- Data Inicio é Inválida',
			'data_fim.required' => '- Data Fim é Obrigatório',
			'data_fim.date' => '- Data Fim é Inválida',
			'evento_categoria_id.required' => '- Categoria é Obrigatório',
			'evento_contato_id.required' => '- Contato é Obrigatório',
		);
		return $messages;
	} 
}
