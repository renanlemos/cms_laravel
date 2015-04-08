<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class TableProdutoRelacionados extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('produto_relacionados', function(Blueprint $table) {
			$table->increments('id');
			$table->index('id');
			$table->integer('produto_id');
			$table->index('produto_id');
			$table->integer('produto_relacionado_id');
			$table->boolean('publicado');
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
		Schema::drop('produto_relacionados');
	}

}
