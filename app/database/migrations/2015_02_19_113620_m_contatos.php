<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class MContatos extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('contatos', function(Blueprint $table) {
			$table->increments('id');
			$table->string('titulo');
			$table->boolean('config_global');
			$table->string('email_remetente');
			$table->string('nome_remetente');
			$table->boolean('autenticacao_email');
			$table->string('usuario_email');
			$table->string('senha_email');
			$table->string('servidor_email');
			$table->string('porta_email');
			$table->text('descricao_antes');
			$table->text('descricao_depois');
			$table->text('parametros');
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
		Schema::drop('contatos');
	}

}
