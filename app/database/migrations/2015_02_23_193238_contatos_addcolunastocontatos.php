<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class ContatosAddColunasToContatos extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('contatos', function(Blueprint $table) {
			$table->string('meta_title')->default("");
			$table->text('meta_keywords')->default("");
			$table->text('meta_description')->default("");
			$table->string('meta_author')->default("");
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('contatos');
	}

}
