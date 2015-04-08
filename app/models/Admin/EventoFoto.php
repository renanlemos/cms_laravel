<?php

namespace Admin;
class EventoFoto extends \Eloquent {
	
	protected $includes = array('evento_fotos');
	protected $guarded = array();

    public function fotos(){
        return $this->belongsTo("Admin\Evento","evento_id");
    }
	public static function boot(){
    	EventoFoto::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post){
        	$evento_foto = EventoFoto::where('evento_id',$post->evento_id)->get();

        	if(count($evento_foto) > 0){
                $evento_foto = EventoFoto::selectRaw('MAX(ordem) as ordem')->where('evento_id',$post->evento_id)->get();
        		$post->ordem = $evento_foto[0]->ordem+1;
        		if($post->capa){
        	 		EventoFoto::where('evento_id',$post->evento_id)->where('capa',true)->update(array('capa'=> false));
        		}
        	}else{
        		$post->ordem = 1;
        		$post->capa = 1;
        	}

        });
        static::updating(function($post){
        	if($post->capa){
        	 	EventoFoto::where('evento_id',$post->evento_id)->where('id','<>',$post->id)->where('capa',true)->update(array('capa'=> false));
        	}
        });
        static::deleting(function($post){    
        });
    }
	public static function rules($id,$input){

        $categoria_id = $input['evento_id'];
 
		$rules =   array(
			"imagem" => "required|unique_campo_categoria:evento_fotos,imagem,evento_id,$id,$categoria_id",
			"titulo" => "required",
			"alt" => "required"
		);
		return $rules;
	}
	public static function messages(){

		$messages =   array(
			'imagem.required' => '- Imagem é Obrigatório.',
			'imagem.unique_campo_categoria' => '- Imagem já está Cadastrada.',
			'titulo.required' => '- Titulo é Obrigatório.',
			'alt.required' => '- Alt é Obrigatório.',
		);
		return $messages;
	} 
}
