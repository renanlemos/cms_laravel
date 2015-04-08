<?php

namespace Admin;
class ProdutoFoto extends \Eloquent {
	
	protected $includes = array('produto_fotos');
	protected $guarded = array();
	public static $message_error = "";
	
	public function produtos(){
    	return $this->belongsTo("Admin\Produto");
    }
	public static function boot(){
    	ProdutoFoto::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post){
            $data = \DB::table('produto_fotos')->where('produto_id',$post->produto_id)->get();

        	if(count($data) > 0){
        		$ordem = \DB::table('produto_fotos')->selectRaw('MAX(ordem) as ordem')->where('produto_id',$post->produto_id)->get();
           		$post->ordem = ($ordem[0]->ordem+1);

           		if($post->capa){
        	 	ProdutoFoto::where('produto_id',$post->produto_id)->where('capa',true)->update(array('capa'=> false));
        		}
        	}else{
        		$post->ordem = 1;
        		$post->capa = 1;
        	}    
        });
        static::updating(function($post){
        	if($post->capa){
        	 	ProdutoFoto::where('produto_id',$post->produto_id)->where('id','<>',$post->id)->where('capa',true)->update(array('capa'=> false));
        	}
        });
        static::deleting(function($post){    
        });
    }
	public static function rules($id,$input){

		$categoria_id = $input['produto_id'];

		$rules =   array(
			"imagem" => "required|unique_campo_categoria:produto_fotos,imagem,produto_id,$id,$categoria_id",
			'alt' => 'required',
			'titulo' => 'required',
			'produto_id' => 'required',
		);
		return $rules;
	}
	public static function messages(){

		$messages =   array(
			'imagem.required' => '- Imagem é Obrigatório.',
			'imagem.unique_campo_categoria' => '- Imagem já está Cadastrada.',
			'titulo.required' => '- Titulo é Obrigatório.',
			'alt.required' => '- Alt é Obrigatório.',
			'produto_id.required' => '- Produto Id é Obrigatório.'
		);
		return $messages;
	} 
}
