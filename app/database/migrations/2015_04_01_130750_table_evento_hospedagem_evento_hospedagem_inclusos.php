<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class TableEventoHospedagemEventoHospedagemInclusos extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		/*Schema::create('evento_hospedagem_evento_hospedagem_inclusos', function(Blueprint $table) {
			$table->increments('id');
			$table->index('id');
			$table->integer('evento_hospedagem_incluso_id');
			$table->index('evento_hospedagem_incluso_id');
			$table->integer('evento_hospedagem_id');
			$table->index('evento_hospedagem_id');
			$table->boolean('publicado');
			$table->integer('ordem')->unsigned();
			$table->timestamps();
		});*/
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('evento_hospedagem_evento_hospedagem_inclusos');
	}

}
