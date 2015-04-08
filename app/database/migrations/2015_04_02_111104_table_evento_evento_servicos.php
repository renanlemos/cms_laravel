<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class TableEventoEventoServicos extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('evento_evento_servicos', function(Blueprint $table) {
			$table->increments('id');
			$table->index('id');
			$table->integer('evento_id');
			$table->index('evento_id');
			$table->integer('evento_servico_id');
			$table->index('evento_servico_id');
			$table->boolean('publicado');
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
		Schema::drop('evento_evento_servicos');
	}

}
