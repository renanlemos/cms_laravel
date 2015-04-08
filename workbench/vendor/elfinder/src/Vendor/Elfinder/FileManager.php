<?php 
namespace Vendor\Elfinder;
use Illuminate\Support\Facades\Facade;

class FileManager{

	public static function hello(){
		echo elFinderVolumeLocalFileSystem::connector();
	}
	public static function connector(){
		$opts = array(
			//'debug' => true,
			'roots' => array(
				array(
					'driver'        => 'LocalFileSystem',   
					//'path'          => __DIR__ . '/../../../../public/images',// path to files (REQUIRED)
					'path' => public_path('images'),
					'URL'           => '/images',
					'imgLib'     => 'gd',
            		'tmbPath'    => 'thumbnails',            // URL to files (REQUIRED)
					//'accessControl' => 'access'             // disable and hide dot starting files (OPTIONAL)
				)
			)
		);
		$connector = new elFinderConnector(new elFinder($opts));
		$connector->run();
    }
}

?>