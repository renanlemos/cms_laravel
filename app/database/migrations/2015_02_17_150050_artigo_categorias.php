<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class ArtigoCategorias extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('artigo_categorias', function(Blueprint $table) {
			$table->increments('id');
			$table->string('descricao');
			$table->string('meta_title');
			$table->text('meta_description');
			$table->text('meta_keywords');
			$table->string('meta_author');
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
		Schema::drop('artigo_categorias');
	}

}
