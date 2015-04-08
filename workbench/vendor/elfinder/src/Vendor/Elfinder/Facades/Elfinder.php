<?php

namespace Vendor\Elfinder\Facades;
use Illuminate\Support\Facades\Facade;

class Elfinder extends Facade{

	protected static function getFacadeAccessor(){
		return 'elfinder';
	}
}

?>