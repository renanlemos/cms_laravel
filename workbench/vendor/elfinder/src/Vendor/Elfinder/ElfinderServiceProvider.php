<?php namespace Vendor\Elfinder;

use Illuminate\Support\ServiceProvider;

class ElfinderServiceProvider extends ServiceProvider {

	/**
	 * Indicates if loading of the provider is deferred.
	 *
	 * @var bool
	 */
	protected $defer = false;

	/**
	 * Bootstrap the application events.
	 *
	 * @return void
	 */
	public function boot()
	{
		$this->package('vendor/elfinder');

	}

	/**
	 * Register the service provider.
	 *
	 * @return void
	 */
	public function register()
	{
		$this->app['FileManager'] = $this->app->share(function($app){
			return new FileManager;
		});
		$this->app['elFinder'] = $this->app->share(function($app){
			return new elFinder;
		});
		$this->app['elFinderConnector'] = $this->app->share(function($app){
			return new elFinderConnector;
		});
		$this->app['elFinderVolumeDriver'] = $this->app->share(function($app){
			return new elFinderVolumeDriver;
		});
		$this->app['elFinderVolumeLocalFileSystem'] = $this->app->share(function($app){
			return new elFinderVolumeLocalFileSystem;
		});
	}

	/**
	 * Get the services provided by the provider.
	 *
	 * @return array
	 */
	public function provides()
	{
		return array();
	}

}
