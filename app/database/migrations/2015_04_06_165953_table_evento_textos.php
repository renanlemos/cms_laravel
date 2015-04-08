<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class TableEventoTextos extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('evento_textos', function(Blueprint $table) {
			$table->increments('id');
			$table->index('id');
			$table->string('titulo');
			$table->text('descricao');
			$table->boolean('publicado');
			$table->integer('ordem')->unsigned();
			$table->integer('evento_id');
			$table->index('evento_id');
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
		Schema::drop('evento_textos');
	}

}
