<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class ArtigoFotos extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('artigo_fotos', function(Blueprint $table) {
			$table->increments('id');
			$table->index('id');
			$table->string('imagem');
			$table->string('alt');
			$table->boolean('capa');
			$table->boolean('publicado');
			$table->string('titulo');
			$table->text('legenda');
			$table->integer('ordem')->unsigned();
			$table->integer('artigo_id');
			$table->index('artigo_id');
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
		Schema::drop('fotos');
	}

}
