<?php

namespace Admin;
class ArtigoFoto extends \Eloquent {
	
	protected $includes = array('artigo_fotos');
	protected $guarded = array();
	public static $message_error = "";
	
	public function artigos(){
    	return $this->belongsTo("Admin\Artigo","artigo_id");
    }
	public static function boot(){
    	ArtigoFoto::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post){
            $data = \DB::table('artigo_fotos')->where('artigo_id',$post->artigo_id)->get();

        	if(count($data) > 0){
        		$ordem = ArtigoFoto::selectRaw('MAX(ordem) as ordem')->where('artigo_id',$post->artigo_id)->get();
           		$post->ordem = ($ordem[0]->ordem+1);

           		if($post->capa){
        	 	ArtigoFoto::where('artigo_id',$post->artigo_id)->where('capa',true)->update(array('capa'=> false));
        		}
        	}else{
        		$post->ordem = 1;
        		$post->capa = 1;
        	}    
        });
        static::updating(function($post){
        	if($post->capa){
        	 	ArtigoFoto::where('artigo_id',$post->artigo_id)->where('id','<>',$post->id)->where('capa',true)->update(array('capa'=> false));
        	}
        });
        static::deleting(function($post){    
        });
    }
	public static function rules($id){

		$rules =   array(
			//'imagem' => 'required|unique:produto_fotos,imagem,'.$id,
			'imagem' => 'required',
			'alt' => 'required',
			'titulo' => 'required',
			'artigo_id' => 'required',
		);
		return $rules;
	}
	public static function messages(){

		$messages =   array(
			'imagem.required' => '- Imagem é Obrigatório.',
			'titulo.required' => '- Titulo é Obrigatório.',
			'alt.required' => '- Alt é Obrigatório.',
			'artigo_id.required' => '- Artigo Id é Obrigatório.'
		);
		return $messages;
	} 
}
