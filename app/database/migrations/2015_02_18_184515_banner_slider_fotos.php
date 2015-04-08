<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class BannerSliderFotos extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('banner_slider_fotos', function(Blueprint $table) {
			$table->increments('id');
			$table->string('titulo');
			$table->string('alt');
			$table->string('legenda');
			$table->string('imagem');
			$table->boolean('publicado');
			$table->integer('ordem');
			$table->integer('banner_slider_id');
			$table->index('banner_slider_id');
			$table->string('url');
			$table->string('url_target');
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
		Schema::drop('banner_slider_fotos');
	}

}
