<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class Site extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('site_configs', function(Blueprint $table) {
			$table->increments('id');
			$table->string('nome');
			$table->boolean('ativo');
			$table->text('meta_description');
			$table->text('meta_keywords');
			$table->string('meta_author');
			$table->string('email_remetente');
			$table->string('nome_remetente');
			$table->boolean('autenticacao_email');
			$table->integer('seguranca_email');
			$table->integer('porta_email');
			$table->string('usuario_email');
			$table->string('senha_email');
			$table->string('servidor_email');
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
		Schema::drop('site_configs');
	}

}
