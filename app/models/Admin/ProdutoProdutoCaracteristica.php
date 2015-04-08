<?php

namespace Admin;
class ProdutoProdutoCaracteristica extends \Eloquent {
	
	protected $includes = array('produto_produto_caracteristica');
	protected $guarded = array();
	public static $message_error = "";
	
	public function caracteristica_tipos(){
		return $this->belongsTo("Admin\ProdutoCaracteristicaTipo","produto_caracteristica_tipo_id");
    }
    public static function boot(){
    	ProdutoProdutoCaracteristica::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post){    
        	$data = \DB::table('produto_produto_caracteristicas')->where('produto_id',$post->produto_id)->where('produto_caracteristica_tipo_id',$post->produto_caracteristica_tipo_id)->get();

        	if(count($data) > 0){
        		$ordem = \DB::table('produto_produto_caracteristicas')->selectRaw('MAX(ordem) as ordem')->where('produto_id',$post->produto_id)->where('produto_caracteristica_tipo_id',$post->produto_caracteristica_tipo_id)->get();
           		$post->ordem = ($ordem[0]->ordem+1);
           	}else{
        		$post->ordem = 1;
        	}   
        });
        static::updating(function($post){
         	
        });
        static::deleting(function($post){    
        });
    }
	public static function rules($id){

		$rules =   array(
			'produto_id' => 'required',
			'produto_caracteristica_id' => 'required',
			'produto_caracteristica_tipo_id' => 'required',
		);
		return $rules;
	}
	public static function messages(){

		$messages =   array(
			'produto_id.required' => '- Produto é Obrigatório.',
			'produto_caracteristica_id.required' => '- Característica é Obrigatória.',
			'produto_caracteristica_tipo_id.required' => '- Tipo é Obrigatório.'
		);
		return $messages;
	} 
}
