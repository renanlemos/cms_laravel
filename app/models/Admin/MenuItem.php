<?php

namespace Admin;

class MenuItem extends \Eloquent {
	
	protected $includes = array('menu_itens');
	protected $table = 'menu_itens';
	protected $guarded = array();
    public static $message_error = ""; 

	public function menu(){
    	return $this->belongsTo("Admin\Menu","menu_id");
    }
	public static function boot(){
    	MenuItem::observe(new \LogObserver);
        parent::boot();

        static::creating(function($post)
        {    
            $post->parametros = json_encode($post->parametros);
        	$post->apelido = \AppString::formataApelido($post->apelido);
        	$tipo = "";
        	if($post->item_pai == 0){
        		$data = \DB::table('menu_itens')->where('menu_id',$post->menu_id)->get();	
        		$tipo = 1;
        	}else{
        		$data = \DB::table('menu_itens')->where('menu_id',$post->menu_id)->where('item_pai',$post->item_pai)->get();
        		$tipo = 2;
        	}
           	if(count($data) > 0){
           		if($tipo == 1){
        			$ordem = \DB::table('menu_itens')->selectRaw('MAX(ordem) as ordem')->where('menu_id',$post->menu_id)->get();
           		}else{
           			$ordem = \DB::table('menu_itens')->selectRaw('MAX(ordem) as ordem')->where('menu_id',$post->menu_id)->where('item_pai',$post->item_pai)->get();
           		}
           		$post->ordem = ($ordem[0]->ordem+1);
        	}else{
        		$post->ordem = 1;
        	}
            $menu_itens_all = Menu::rightJoin('menu_itens', 'menus.id', '=', 'menu_itens.menu_id');
            if(count($menu_itens_all->get()) == 0){
                $post->pagina_inicial = true;
            }else{
                if($post->pagina_inicial){
                    MenuItem::whereRaw('id > 0')->update(['pagina_inicial' => false]);
                }
            }
        });
        static::updating(function($post){
         	$post->apelido = \AppString::formataApelido($post->apelido);

            $menu_itens_all = Menu::rightJoin('menu_itens', 'menus.id', '=', 'menu_itens.menu_id');
            $menu_pagina_inicial = MenuItem::where('pagina_inicial',true)->whereRaw('id != '.$post->id)->get();

            if(count($menu_itens_all->get()) == 1){
                $post->pagina_inicial = true;
            }else{
                if(($post->pagina_inicial) && count($menu_pagina_inicial) > 0){
                    MenuItem::where('id',$menu_pagina_inicial[0]->id)->update(['pagina_inicial' => false]);
                    //$post->pagina_inicial = true;
                }
            }
        });
        static::deleting(function($post){ 
            $data = \DB::table('menu_itens')->where('item_pai',$post->id)->get();  
            if(count($data) > 0){
                self::$message_error = "Possue sub itens.";
        		return false;
        	}
            if($post->pagina_inicial){
                self::$message_error = "Pagina Inicial não pode ser deletada.";
                return false;
            }
        });
    }
    public static function rules($id,$post){

		$rules =   array(
			'titulo' => 'required',
			'apelido' => 'required|unique:menu_itens,apelido,'.$id,
			'item_pai' => 'required',
            'tipo' => 'required'
 
		);
        switch($post['tipo']){
            case 'unico-produto':
                $rules_more = array('parametros.produto_id' => 'required','parametros.template' => 'required');
                $rules = array_merge($rules,$rules_more);
            break;
            case 'categoria-de-produto':
                $rules_more = array('parametros.produto_categoria_id' => 'required');
                $rules = array_merge($rules,$rules_more);
            break;
            case 'unico-contato':
                $rules_more = array('parametros.contato_id' => 'required');
                $rules = array_merge($rules,$rules_more);
            break;
            case 'unico-artigo':
                $rules_more = array('parametros.artigo_id' => 'required');
                $rules = array_merge($rules,$rules_more);
            break;
            case 'categoria-de-artigo':
                $rules_more = array('parametros.categoria_id' => 'required');
                $rules = array_merge($rules,$rules_more);
            break;
            case 'categoria-de-evento':
                $rules_more = array('parametros.evento_categoria_id' => 'required','parametros.evento_status' => 'required');
                $rules = array_merge($rules,$rules_more);
            break;
        }
		return $rules;
	}
	public static function messages($input){

		$messages =   array(
			'titulo.required' => '- Titulo é Obrigatório.',
			'titulo.unique' => '- Titulo ja está Cadastrado.',
			'apelido.required' => '- Apelido é Obrigatório.',
			'apelido.unique' => '- Apelido ja está Cadastrado.',
			'item_pai.required' => '- Item Pai é Obrigatório.',
			'tipo.required' => '- Tipo Item é Obrigatório.',
            'parametros.produto_id.required' => '- Produto é Obrigatório.',
            'parametros.template.required' => '- Template é Obrigatório.',
            'parametros.produto_categoria_id.required' => '- Categoria é Obrigatório',
            'parametros.contato_id.required' => '- Contato é Obrigatório',
            'parametros.artigo_id.required' => '- Artigo é Obrigatório',
            'parametros.categoria_id.required' => '- Categoria é Obrigatório',
            'parametros.evento_categoria_id.required' => '- Categoria é Obrigatório',
            'parametros.evento_status.required' => '- Listar Eventos é Obrigatório'

		);
		return $messages;
	} 
}
