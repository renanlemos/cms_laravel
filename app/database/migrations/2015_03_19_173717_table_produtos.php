<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class TableProdutos extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('produtos', function(Blueprint $table) {
			$table->increments('id');
			$table->index('id');
			$table->string('titulo');
			$table->string('apelido');
			$table->double('valor',2,10);
			$table->boolean('publicado');
			$table->boolean('destaque');
			$table->text('mini_descricao');
			$table->text('descricao');
			$table->string('meta_title');
			$table->text('meta_description');
			$table->text('meta_keywords');
			$table->string('meta_author');
			$table->integer('produto_categoria_id');
			$table->index('produto_categoria_id');
			$table->text('parametros');
			$table->integer('ordem');
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
		Schema::drop('produtos');
	}

}
