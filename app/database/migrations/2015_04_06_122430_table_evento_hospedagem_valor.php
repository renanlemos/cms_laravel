<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class TableEventoHospedagemValor extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('evento_hospedagem_valors', function(Blueprint $table) {
			$table->increments('id');
			$table->index('id');
			$table->string('descricao');
			$table->decimal('valor');
			$table->boolean('publicado');
			$table->integer('ordem')->unsigned();
			$table->integer('evento_evento_hospedagem_id');
			$table->index('evento_evento_hospedagem_id');
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
		Schema::drop('evento_hospedagem_valor');
	}

}
