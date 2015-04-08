<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class MMenuItens extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('menu_itens', function(Blueprint $table) {
			$table->increments('id');
			$table->string('titulo');
			$table->string('apelido');
			$table->boolean('publicado');
			$table->boolean('pagina_inicial');
			$table->integer('item_pai')->unsigned();
			$table->string('componente');
			$table->string('tipo');
			$table->string('tipo_descricao');
			$table->integer('menu_id');
			$table->index('menu_id');
			$table->text('parametros');
			$table->string('meta_title');
			$table->text('meta_keywords');
			$table->text('meta_description');
			$table->string('meta_author');
			$table->integer('ordem')->unsigned();
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
		Schema::drop('menu_itens');
	}

}
