<?php
namespace Modulos;
class ModulosController extends BaseController {

	protected $modulo;
	protected $modulo_posicao;

	public function __construct(\Admin\Modulo $modulo,\Admin\ModuloPosicao $modulo_posicao){
		$this->modulo = $modulo;
		$this->modulo_posicao = $modulo_posicao;
	}
    public function getModulo(){
    	$input = \Input::all();
		$data = \DB::table('modulo_posicaos')->rightJoin('modulos', 'modulo_posicaos.id', '=', 'modulos.modulo_posicao_id')->where('modulo_posicaos.descricao',$input['posicao'])->where('publicado',true)->orderBy('modulos.ordem')->get();
		return \Response::json($data);
	}
	public function getModulos(){
		$data = $this->modulo_posicao->join('modulos', 'modulo_posicaos.id', '=', 'modulos.modulo_posicao_id')->where('modulos.publicado',true)->orderBy('modulos.ordem')->get();
		return \Response::json($data);
	}

}
?>