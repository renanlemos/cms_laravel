<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class TableEventoContatos extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('evento_contatos', function(Blueprint $table) {
			$table->increments('id');
			$table->index('id');
			$table->string('nome');
			$table->string('email');
			$table->string('telefone');
			$table->string('ramal');
			$table->text('descricao');
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
		Schema::drop('evento_contatos');
	}

}
