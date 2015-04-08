<?php

class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Eloquent::unguard();

		// $this->call('UserTableSeeder');
		$this->call('UsuariosTableSeeder');
		$this->call('Modulo_posicaosTableSeeder');
		$this->call('ModuloposicaosTableSeeder');
		$this->call('Table_produto_relacionadosTableSeeder');
	}

}
