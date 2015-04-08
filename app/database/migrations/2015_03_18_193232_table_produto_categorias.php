<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class TableProdutoCategorias extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{   
		//Schema::dropIfExists('produto_categorias');
		Schema::create('produto_categorias', function(Blueprint $table) {
			$table->increments('id');
			$table->string('titulo');
			$table->string('apelido');
			$table->boolean('publicado');
			$table->text('descricao');
			$table->string('meta_title');
			$table->string('meta_keywords');
			$table->string('meta_description');
			$table->string('meta_author');
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
		Schema::drop('produto_categorias');
	}

}
