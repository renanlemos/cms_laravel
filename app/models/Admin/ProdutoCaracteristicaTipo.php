<?php

namespace Admin;
class ProdutoCaracteristicaTipo extends \Eloquent {
	
	protected $includes = array('produto_caracteristica_tipos');
	protected $guarded = array();
	public static $message_error = "";
	
	public function caracteristicas(){
    	return $this->hasMany("Admin\ProdutoProdutoCaracteristica");
    }
	public static function boot(){
    	ProdutoCaracteristicaTipo::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post){
        	$data = ProdutoCaracteristicaTipo::all()->take(1);
        	if(count($data) > 0){
       			$ordem = \DB::table('produto_caracteristica_tipos')->selectRaw('MAX(ordem) as ordem')->get();
           		$post->ordem = ($ordem[0]->ordem+1);
        	}else{
        		$post->ordem = 1;
        	}    
        });
        static::updating(function($post){
         	
        });
        static::deleting(function($post){    
        	if($post->caracteristicas()->count() > 0){
        		self::$message_error .= " Possue Caracteristicas";
        	    return false;
        	}
        });
    }
	public static function rules($id){

		$rules =   array(
			'descricao' => 'required|unique:produto_caracteristica_tipos,descricao,'.$id,
		);
		return $rules;
	}
	public static function messages(){

		$messages =   array(
			'descricao.required' => '- Descrição é Obrigatório.',
			'descricao.unique' => '- Descrição já está Cadastrada.'
		);
		return $messages;
	} 
}
