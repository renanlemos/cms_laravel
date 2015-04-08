<?php
namespace Componentes;
class ComponenteArtigosController extends BaseController {

	protected $artigo;
	protected $artigo_categoria;

	public function __construct(\Admin\Artigo $artigo,\Admin\ArtigoCategoria $artigo_categoria){
		$this->artigo = $artigo;
		$this->artigo_categoria = $artigo_categoria;
	}
    public function getArtigo(){
    	$input = \Input::all();
		$data = $this->artigo->where('id',$input['artigo_id'])->where('publicado',true)->get();
		return \Response::json($data);
	}
	public function getArtigoApelido(){
    	$input = \Input::all();
		$data = $this->artigo->where('apelido',$input['apelido'])->where('publicado',true)->get();
		return \Response::json($data);
	}
	public function getCategoria(){
    	$input = \Input::all();
    	$categoria = $this->artigo_categoria->find($input['categoria_id']);
		$artigos = $this->artigo->where('artigo_categoria_id',$input['categoria_id'])->where('publicado',true)->orderBy('id','desc')->get();
		
		$data = array('artigos' => $artigos,'categoria' => $categoria);
		
		return \Response::json([$data]);
	}
}
?>