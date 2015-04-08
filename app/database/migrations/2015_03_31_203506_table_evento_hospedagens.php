<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class TableEventoHospedagens extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('evento_hospedagems', function(Blueprint $table) {
			$table->increments('id');
			$table->index('id');
			$table->string('nome');
			$table->integer('evento_hospedagem_cidade_id');
			$table->index('evento_hospedagem_cidade_id');
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
		Schema::drop('evento_hospedagens');
	}

}
