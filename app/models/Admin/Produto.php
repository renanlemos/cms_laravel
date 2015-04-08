<?php

namespace Admin;
class Produto extends \Eloquent {
	
	protected $includes = array('produto_caracteristicas');
	protected $guarded = array();
	public static $message_error = "";
	
	public function categoria(){
    	return $this->belongsTo("Admin\ProdutoCategoria","produto_categoria_id");
    }
    public function fotos(){
    	return $this->hasMany("Admin\ProdutoFoto");
    }
    public function caracteristicas(){
    	return $this->belongsToMany('Admin\ProdutoCaracteristica','produto_produto_caracteristicas');
	}
    public function relacionados(){
        return $this->hasMany("Admin\ProdutoRelacionado");
    }
    public function isProdutoRelacionado($id){
        $result = ProdutoRelacionado::select('id')->where('produto_relacionado_id',$id)->get();
        if(count($result) > 0){
            return true;
        }else{
            return false;
        }
    }
	public static function boot(){
    	Produto::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post)
        {   
           $post->parametros = json_encode($post->parametros); 
           $produtos = Produto::all()->take(1);
           if(count($produtos) > 0){
           		$ordem = \DB::table('produtos')->selectRaw('MAX(ordem) as ordem')->get();
           		$post->ordem = ($ordem[0]->ordem+1);
           }else{
           	 	$post->ordem = 1;
           }
     
        });
        static::created(function($post){    
            $pasta = "produto-".$post->id;
            $dir = public_path("componentes/produtos/".$pasta);
            \File::makeDirectory($dir, 0775);
        });
        static::updating(function($post){
         	
        });
        static::deleting(function($post){  
            $resp = true;   
        	if($post->fotos()->count() > 0){
                self::$message_error = "Possue Fotos";
                $resp = false;
        	}
        	if($post->caracteristicas()->count() > 0){
        		if(strlen(self::$message_error) > 0){
        			self::$message_error .= ",";
        		}else{
                    self::$message_error .= "Possue ";
                }
        		self::$message_error .= "Caracteristicas";
        		$resp = false;
        	}
            if($post->relacionados()->count() > 0){
                if(strlen(self::$message_error) > 0){
                    self::$message_error .= ",";
                }else{
                    self::$message_error .= "Possue ";
                }
                self::$message_error .= "Produtos Relacionados";
                $resp = false;
            }
            if($post->isProdutoRelacionado($post->id)){
                if(strlen(self::$message_error) > 0){
                    self::$message_error .= ",";
                }
                self::$message_error .= "Relacionado a Produtos";
                $resp = false;
            }
        	return $resp;
        });
        static::deleted(function($post){  
            $pasta = "produto-".$post->id;
            $dir = public_path("componentes/produtos/".$pasta);
            \File::deleteDirectory($dir); 
        });    
           
    }
	public static function rules($id){

		$rules =   array(
			'titulo' => 'required|unique:produtos,titulo,'.$id,
			'apelido' => 'required|unique:artigos,apelido,'.$id,
			'produto_categoria_id' => 'required',
			'valor' => 'required|numeric'
		);
		return $rules;
	}
	public static function messages(){

		$messages =   array(
			'titulo.required' => '- Título é Obrigatório.',
			'titulo.required' => '- Título já está cadastrado.',
			'apelido.required' => '- Apelido é Obrigatório.',
			'apelido.unique' => '- Apelido já está cadastrado.',
			'produto_categoria_id.required' => '- Categoria é Obrigatório.',
			'valor.required' => '- Valor é Obrigatório.',
			'valor.numeric' => '- Valor deve ser um número.'
		);
		return $messages;
	} 
}
