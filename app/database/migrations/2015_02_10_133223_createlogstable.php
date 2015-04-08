<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateLogsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('logs', function(Blueprint $table) {
			$table->increments('id');
			$table->string('tabela');
			$table->string('acao');
			$table->string('campo');
			$table->text('valor_antigo');
			$table->text('valor_novo');
			$table->string('browser_nome');
			$table->string('browser_versao');
			$table->string('nome_usuario');
			$table->integer('usuario_id')->unsigned();
			$table->text('observacoes');
			$table->index('usuario_id');
			$table->timestamps();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('logs');
	}

}
