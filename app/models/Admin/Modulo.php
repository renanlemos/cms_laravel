<?php

namespace Admin;

class Modulo extends \Eloquent {
	
	protected $includes = array('modulos');
	protected $table = 'modulos';
	protected $guarded = array();
    
    public function modulo_posicao(){
    	return $this->belongsTo("Admin\ModuloPosicao","modulo_posicao_id");
    }
	public static function boot(){
    	Modulo::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post)
        {    
        	$post->parametros = json_encode($post->parametros);
           	$data = \DB::table('modulos')->where('modulo_posicao_id',$post->modulo_posicao_id)->get();

        	if(count($data) > 0){
        		$ordem = \DB::table('modulos')->selectRaw('MAX(ordem) as ordem')->where('modulo_posicao_id',$post->modulo_posicao_id)->get();
           		$post->ordem = ($ordem[0]->ordem+1);
        	}else{
        		$post->ordem = 1;
        	}
        	
        });
        static::updating(function($post){
            
        });
    }
	public static function rules($id,$input){

		$rules =   array(
			'titulo' => 'required|unique:modulos,titulo,'.$id,
			'apelido' => 'required|unique:modulos,apelido,'.$id,
			'modulo_posicao_id' => 'required|integer',
			'publicado' => 'required',
			'mostrar_titulo' => 'required'
		);
		switch ($input['tipo']) {
			case 'clima-tempo':
				$rules_more =  array('parametros.cidade' => 'required','parametros.latitude' => 'required','parametros.longitude' => 'required','parametros.template' => 'required');
				$rules = array_merge($rules,$rules_more);
			break;
			case 'menu':
				$rules_more =  array('parametros.menu_id' => 'required','parametros.menu_template' => 'required');
				$rules = array_merge($rules,$rules_more);
			break;
			case 'contato':
				$rules_more =  array('parametros.contato_id' => 'required');
				$rules = array_merge($rules,$rules_more);
			break;
			case 'banner-slider':
				$rules_more =  array('parametros.banner_id' => 'required');
				$rules = array_merge($rules,$rules_more);
			break;
			case 'produto-em-destaque':
				$rules_more =  array('parametros.template' => 'required','parametros.tipo' => 'required');
				if($input['parametros']['tipo'] == 'categoria'){
					$rule = array('parametros.categoria_id'=>'required');
					$rules_more = array_merge($rules_more,$rule);
				}else{
					$rule = array('parametros.produtos'=>'required');
					$rules_more = array_merge($rules_more,$rule);
				}
				$rules = array_merge($rules,$rules_more);
			break;
		}
		return $rules;
	}
	public static function messages($input){

		$messages =   array(
			'titulo.required' => '- Título é Obrigatório.',
			'titulo.unique' => '- Título ja está Cadastrado.',
			'apelido.required' => '- Apelido é Obrigatório.',
			'apelido.unique' => '- Apelido ja está Cadastrado.',
			'modulo_posicao_id.required' => '- Posição é Obrigatório.',
			'modulo_posicao_id.unique' => '- Posição deve ser inteiro.',
			'publicado.required' => '- Publicado é Obrigatório.',
			'mostrar_titulo.required' => '- Mostrar Título é Obrigatório.'
		);
		switch ($input['tipo']) {
			case 'clima-tempo':
				$messages_more =  array('parametros.cidade.required' => '- Cidade é Obrigatório','parametros.latitude.required' => '- Latitude é Obrigatório','parametros.longitude.required' => '- Lonitude é Obrigatório','parametros.template.required' => '- Template é Obrigatório');
				$messages = array_merge($messages,$messages_more);
			break;
			case 'menu':
				$messages_more =  array('parametros.menu_id.required' => '- Menu é Obrigatório','parametros.menu_template.required' => ' - Template é Obrigatório');
				$messages = array_merge($messages,$messages_more);
			break;
			case 'contato':
				$messages_more =  array('parametros.contato_id.required' => '- Contato é Obrigatório');
				$messages = array_merge($messages,$messages_more);
			break;
			case 'banner-slider':
				$messages_more =  array('parametros.banner_id.required' => '- Banner é Obrigatório');
				$messages = array_merge($messages,$messages_more);
			break;
			case 'produto-em-destaque':
				$messages_more =  array('parametros.template.required' => '- Template é Obrigatório','parametros.tipo.required' => '- Tipo é Obrigatório','parametros.categoria_id.required' => '- Categoria é Obrigatório','parametros.produtos.required' => '- Produtos é Obrigatório');
				$messages = array_merge($messages,$messages_more);
			break;
		}
		return $messages;
	} 
}
