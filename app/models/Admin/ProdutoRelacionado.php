<?php

namespace Admin;
class ProdutoRelacionado extends \Eloquent {
	
	protected $includes = array('produto_relacionados');
	protected $guarded = array();
	public static $message_error = "";
	
	public function produtos(){
		return $this->belongsTo("Admin\Produto","produto_id");
    }
    public static function boot(){
    	ProdutoRelacionado::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post){    
        	$data = \DB::table('produto_relacionados')->where('produto_id',$post->produto_id)->get();

        	if(count($data) > 0){
        		$ordem = \DB::table('produto_relacionados')->selectRaw('MAX(ordem) as ordem')->where('produto_id',$post->produto_id)->get();
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
	public static function rules($id,$produto_id,$produto_relacionado_id){

		$rules =   array(
			"produto_id" => "required",
			"produto_relacionado_id" => "required|unique_produto_relacionado:$id,$produto_id,$produto_relacionado_id"
		);
		return $rules;
	}
	public static function messages(){

		$messages =   array(
			'produto_id.required' => '- Produto é Obrigatório.',
			'produto_relacionado_id.required' => '- Produto é Obrigatório.',
			'produto_relacionado_id.unique_produto_relacionado' => '- Esse produto já está cadastrado.'
		);
		return $messages;
	} 
}
