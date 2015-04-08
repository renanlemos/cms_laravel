<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class TableEventoFotos extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('evento_fotos', function(Blueprint $table) {
			$table->increments('id');
			$table->index('id');
			$table->string('imagem');
			$table->string('titulo');
			$table->string('alt');
			$table->text('legenda');
			$table->boolean('publicado');
			$table->boolean('capa');
			$table->integer('ordem');
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
		Schema::drop('evento_fotos');
	}

}
