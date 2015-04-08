<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class TableEventoEventoHospedagems extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('evento_evento_hospedagems', function(Blueprint $table) {
			$table->increments('id');
			$table->index('id');
			$table->integer('evento_id');
			$table->index('evento_id');
			$table->integer('evento_hospedagem_id');
			$table->index('evento_hospedagem_id');
			$table->integer('evento_hospedagem_categoria_id');
			$table->index('evento_hospedagem_categoria_id');
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
		Schema::drop('evento_evento_hospedagems');
	}

}
