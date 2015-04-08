<?php
namespace Admin;

class Log extends \Eloquent {
	protected $guarded = array();

	public static $rules = array(
		'tabela' => 'required',
		'acao' => 'required',
		'campo' => 'required',
		'valor_antigo' => 'required',
		'valor_novo' => 'required',
		'browser_nome' => 'required',
		'browser_versao' => 'required',
		'nome_usuario' => 'required',
		'usuario_id' => 'required',
		'observacoes' => 'required'
	);
}
