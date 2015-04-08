<?php
/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/
Route::get('/',"HomeController@index");
Route::get('popula',"HomeController@popula");

Route::group(array('prefix' => 'CmsModulos','namespace'=> 'Modulos'), function(){
  Route::get('/get-modulos-posicao',"ModulosController@getModulo");
  Route::get('/get-modulos',"ModulosController@getModulos");
  Route::get('/banner-sliders/get-fotos',"ModuloBannerSlidersController@getFotos");
  Route::get('/menus/getMenu',"ModuloMenusController@getMenu");
  Route::get('/clima-tempo/getTempo',"ModuloClimaTempoController@getTempo");
  Route::get('/modulo-produtos/getProduto',"ModuloProdutosController@getProduto");
});
Route::group(array('prefix' => 'CmsComponentes','namespace'=> 'Componentes'), function(){
  Route::get('/componentes/getLinkInicial',"ComponentesController@getLinkInicial");
  Route::get('/componentes/getLinkApelido',"ComponentesController@getLinkApelido");
  Route::get('/componente-artigos/getArtigo',"ComponenteArtigosController@getArtigo");
  Route::get('/componente-artigos/getArtigoApelido',"ComponenteArtigosController@getArtigoApelido");
  Route::get('/componente-artigos/getCategoria',"ComponenteArtigosController@getCategoria");
  Route::get('/componente-contatos/getContato',"ComponenteContatosController@getContato");
  Route::post('/componente-contatos/sendEmail',"ComponenteContatosController@sendEmail");
  
  Route::get('/componente-produtos/getCategoria',"ComponenteProdutosController@getCategoria");
  Route::get('/componente-produtos/getProdutoApelido',"ComponenteProdutosController@getProdutoApelido");
  Route::get('/componente-produtos/getProduto',"ComponenteProdutosController@getProduto");

  Route::get('/componente-eventos/getCategoria',"ComponenteEventosController@getCategoria");
});

// Validação CSRF
//Route::when('/admin/*','csrf', array('post','put','delete'));

Route::group(array('prefix' => 'admin','namespace' => 'Admin'), function()
{  
  Route::get('/',"HomeController@index"); 

  Route::get('/login',"HomeController@index"); 
  Route::get('/auth/verify',"AuthController@verify"); 
  Route::get('/auth/token',"AuthController@token"); 
  Route::post('/auth/login',"AuthController@login"); 
  Route::post('/auth/logout',"AuthController@logout"); 

  Route::get('site/configuracao-global','HomeController@index');
  Route::put('site-configs','SiteConfigsController@update');
  Route::get('site-configs/get','SiteConfigsController@getConfig');

  Route::get('usuarios',"HomeController@index");  
  Route::get('usuarios/grid',"UsuariosController@grid");  
  Route::post('usuarios',"UsuariosController@store");  
  Route::put('usuarios',"UsuariosController@update");  
  Route::delete('usuarios',"UsuariosController@destroy");

  Route::get('menus',"HomeController@index");  
  Route::get('menus/grid','MenusController@grid');
  Route::get('menus/combo','MenusController@combo');
  Route::post('menus','MenusController@store');
  Route::put('menus','MenusController@update');
  Route::delete('menus','MenusController@destroy'); 

  Route::get('menu-itens',"HomeController@index");  
  Route::get('menu-itens/grid','MenuItensController@grid');
  Route::get('menu-itens/combo-item-pai','MenuItensController@comboItemPai');
  Route::post('menu-itens','MenuItensController@store');
  Route::put('menu-itens','MenuItensController@update');
  Route::put('menu-itens/updateOrdem','MenuItensController@updateOrdem');
  Route::put('menu-itens/updatePaginaInicial','MenuItensController@updatePaginaInicial');
  Route::get('menu-itens/ordem','MenuItensController@ordem');
  Route::delete('menu-itens','MenuItensController@destroy'); 

  Route::get('conteudo/artigos','HomeController@index');
  Route::get('conteudo/artigos/grid','ArtigosController@grid');
  Route::get('conteudo/artigos/filesDir','ArtigosController@filesDir');
  Route::get('conteudo/artigos/combo','ArtigosController@combo');
  Route::post('conteudo/artigos','ArtigosController@store');
  Route::put('conteudo/artigos','ArtigosController@update');
  Route::delete('conteudo/artigos','ArtigosController@destroy'); 
  Route::get('conteudo/artigos/ordem','ArtigosController@getOrdem'); 
  Route::put('conteudo/artigos/ordem','ArtigosController@updateOrdem'); 

  Route::get('conteudo/artigos/artigo-fotos/grid','ArtigoFotosController@grid');
  Route::post('conteudo/artigos/artigo-fotos','ArtigoFotosController@store');
  Route::put('conteudo/artigos/artigo-fotos','ArtigoFotosController@update');
  Route::delete('conteudo/artigos/artigo-fotos','ArtigoFotosController@destroy'); 
  Route::put('/conteudo/artigos/artigo-fotos/updateStatus','ArtigoFotosController@updateStatus');
  Route::get('conteudo/artigos/artigo-fotos/ordem','ArtigoFotosController@getOrdem'); 
  Route::put('conteudo/artigos/artigo-fotos/ordem','ArtigoFotosController@updateOrdem'); 

  Route::get('conteudo/artigos/artigo-categorias','HomeController@index');
  Route::get('conteudo/artigos/artigo-categorias/filesDir','ArtigoCategoriasController@filesDir');
  Route::get('conteudo/artigos/artigo-categorias/grid','ArtigoCategoriasController@grid');
  Route::get('conteudo/artigos/artigo-categorias/combo','ArtigoCategoriasController@combo');
  Route::post('conteudo/artigos/artigo-categorias','ArtigoCategoriasController@store');
  Route::put('conteudo/artigos/artigo-categorias','ArtigoCategoriasController@update');
  Route::delete('conteudo/artigos/artigo-categorias','ArtigoCategoriasController@destroy'); 

  Route::get('conteudo/midias','HomeController@index');

  Route::get('componentes/componente-banner-slider','HomeController@index');
  Route::get('componentes/banner-sliders/grid','BannerSlidersController@grid');
  Route::get('componentes/banner-sliders/combo','BannerSlidersController@combo');
  Route::post('componentes/banner-sliders','BannerSlidersController@store');
  Route::put('componentes/banner-sliders','BannerSlidersController@update');
  Route::delete('componentes/banner-sliders','BannerSlidersController@destroy'); 

  Route::get('componentes/banner-slider-fotos/grid','BannerSliderFotosController@grid');
  Route::post('componentes/banner-slider-fotos','BannerSliderFotosController@store');
  Route::put('componentes/banner-slider-fotos','BannerSliderFotosController@update');
  Route::delete('componentes/banner-slider-fotos','BannerSliderFotosController@destroy');
  Route::get('componentes/banner-slider-fotos/ordem','BannerSliderFotosController@getOrdem');
  Route::put('componentes/banner-slider-fotos/ordem','BannerSliderFotosController@updateOrdem');

  Route::get('componentes/componente-contato','HomeController@index');
  Route::get('componentes/contatos/grid','ContatosController@grid');
  Route::get('componentes/contatos/combo','ContatosController@combo');
  Route::post('componentes/contatos','ContatosController@store');
  Route::put('componentes/contatos','ContatosController@update');
  Route::delete('componentes/contatos','ContatosController@destroy'); 

  Route::get('/componentes/componente-produtos/componente-produto-produtos','HomeController@index');
  Route::get('/componentes/produtos/grid','ProdutosController@grid');
  Route::get('/componentes/produtos/combo','ProdutosController@combo');
  Route::get('/componentes/produtos/comboAll','ProdutosController@comboAll');
  Route::post('/componentes/produtos','ProdutosController@store');
  Route::put('/componentes/produtos','ProdutosController@update');
  Route::put('/componentes/produtos/updateStatus','ProdutosController@updateStatus');
  Route::delete('/componentes/produtos','ProdutosController@destroy'); 
  Route::get('/componentes/produtos/ordem','ProdutosController@getOrdem'); 
  Route::put('/componentes/produtos/ordem','ProdutosController@updateOrdem'); 

  Route::get('/componentes/componente-produtos/componente-produto-categorias','HomeController@index');
  Route::get('/componentes/produtos/produto-categorias/grid','ProdutoCategoriasController@grid');
  Route::get('/componentes/produtos/produto-categorias/filesDir','ProdutoCategoriasController@filesDir');
  Route::get('/componentes/produtos/produto-categorias/combo','ProdutoCategoriasController@combo');
  Route::post('/componentes/produtos/produto-categorias','ProdutoCategoriasController@store');
  Route::put('/componentes/produtos/produto-categorias','ProdutoCategoriasController@update');
  Route::put('/componentes/produtos/produto-categorias/updateStatus','ProdutoCategoriasController@updateStatus');
  Route::delete('/componentes/produtos/produto-categorias','ProdutoCategoriasController@destroy'); 

  Route::get('/componentes/componente-produtos/componente-produto-caracteristicas','HomeController@index');
  Route::get('/componentes/produtos/produto-caracteristicas/grid','ProdutoCaracteristicasController@grid');
  Route::get('/componentes/produtos/produto-caracteristicas/combo','ProdutoCaracteristicasController@combo');
  Route::post('/componentes/produtos/produto-caracteristicas','ProdutoCaracteristicasController@store');
  Route::put('/componentes/produtos/produto-caracteristicas','ProdutoCaracteristicasController@update');
  Route::delete('/componentes/produtos/produto-caracteristicas','ProdutoCaracteristicasController@destroy'); 

  Route::get('/componentes/produtos/produto-fotos/grid','ProdutoFotosController@grid');
  Route::post('/componentes/produtos/produto-fotos','ProdutoFotosController@store');
  Route::put('/componentes/produtos/produto-fotos','ProdutoFotosController@update');
  Route::put('/componentes/produtos/produto-fotos/updateStatus','ProdutoFotosController@updateStatus');
  Route::delete('/componentes/produtos/produto-fotos','ProdutoFotosController@destroy'); 
  Route::get('componentes/produtos/produto-fotos/ordem','ProdutoFotosController@getOrdem');
  Route::put('componentes/produtos/produto-fotos/ordem','ProdutoFotosController@updateOrdem');
  
  Route::get('/componentes/componente-produtos/componente-produto-caracteristica-tipos','HomeController@index');
  Route::get('/componentes/produtos/produto-caracteristica-tipos/grid','ProdutoCaracteristicaTiposController@grid');
  Route::get('/componentes/produtos/produto-caracteristica-tipos/combo','ProdutoCaracteristicaTiposController@combo');
  Route::post('/componentes/produtos/produto-caracteristica-tipos','ProdutoCaracteristicaTiposController@store');
  Route::put('/componentes/produtos/produto-caracteristica-tipos','ProdutoCaracteristicaTiposController@update');
  Route::put('/componentes/produtos/produto-caracteristica-tipos/updateStatus','ProdutoCaracteristicaTiposController@updateStatus');
  Route::delete('/componentes/produtos/produto-caracteristica-tipos','ProdutoCaracteristicaTiposController@destroy'); 
  Route::get('componentes/produtos/produto-caracteristica-tipos/ordem','ProdutoCaracteristicaTiposController@getOrdem');
  Route::put('componentes/produtos/produto-caracteristica-tipos/ordem','ProdutoCaracteristicaTiposController@updateOrdem');

  Route::get('/componentes/produtos/produto-produto-caracteristicas/grid','ProdutoProdutoCaracteristicasController@grid');
  Route::post('/componentes/produtos/produto-produto-caracteristicas','ProdutoProdutoCaracteristicasController@store');
  Route::put('/componentes/produtos/produto-produto-caracteristicas','ProdutoProdutoCaracteristicasController@update');
  Route::put('/componentes/produtos/produto-produto-caracteristicas/updateStatus','ProdutoProdutoCaracteristicasController@updateStatus');
  Route::delete('/componentes/produtos/produto-produto-caracteristicas','ProdutoProdutoCaracteristicasController@destroy'); 
  Route::get('componentes/produtos/produto-produto-caracteristicas/ordem','ProdutoProdutoCaracteristicasController@getOrdem');
  Route::put('componentes/produtos/produto-produto-caracteristicas/ordem','ProdutoProdutoCaracteristicasController@updateOrdem');

  Route::get('/componentes/produtos/produto-relacionados/grid','ProdutoRelacionadosController@grid');
  Route::post('/componentes/produtos/produto-relacionados','ProdutoRelacionadosController@store');
  Route::put('/componentes/produtos/produto-relacionados','ProdutoRelacionadosController@update');
  Route::put('/componentes/produtos/produto-relacionados/updateStatus','ProdutoRelacionadosController@updateStatus');
  Route::delete('/componentes/produtos/produto-relacionados','ProdutoRelacionadosController@destroy'); 
  Route::get('componentes/produtos/produto-relacionados/ordem','ProdutoRelacionadosController@getOrdem');
  Route::put('componentes/produtos/produto-relacionados/ordem','ProdutoRelacionadosController@updateOrdem');
  
  Route::get('/componentes/componente-eventos/componente-evento-eventos','HomeController@index');
  Route::get('/componentes/eventos/eventos/grid','EventosController@grid');
  Route::post('/componentes/eventos/eventos','EventosController@store');
  Route::put('/componentes/eventos/eventos','EventosController@update');
  Route::put('/componentes/eventos/eventos/updateStatus','EventosController@updateStatus');
  Route::get('/componentes/eventos/eventos/ordem','EventosController@getOrdem');
  Route::put('/componentes/eventos/eventos/ordem','EventosController@updateOrdem');
  Route::delete('/componentes/eventos/eventos','EventosController@destroy'); 


  Route::get('/componentes/componente-eventos/componente-evento-categorias','HomeController@index');
  Route::get('/componentes/eventos/evento-categorias/grid','EventoCategoriasController@grid');
  Route::get('/componentes/eventos/evento-categorias/combo','EventoCategoriasController@combo');
  Route::post('/componentes/eventos/evento-categorias','EventoCategoriasController@store');
  Route::put('/componentes/eventos/evento-categorias','EventoCategoriasController@update');
  Route::put('/componentes/eventos/evento-categorias/updateStatus','EventoCategoriasController@updateStatus');
  Route::delete('/componentes/eventos/evento-categorias','EventoCategoriasController@destroy'); 
  Route::get('componentes/eventos/evento-categorias/ordem','EventoCategoriasController@getOrdem');
  Route::put('componentes/eventos/evento-categorias/ordem','EventoCategoriasController@updateOrdem');

  Route::get('/componentes/componente-eventos/componente-evento-contatos','HomeController@index');
  Route::get('/componentes/eventos/evento-contatos/grid','EventoContatosController@grid');
  Route::get('/componentes/eventos/evento-contatos/combo','EventoContatosController@combo');
  Route::post('/componentes/eventos/evento-contatos','EventoContatosController@store');
  Route::put('/componentes/eventos/evento-contatos','EventoContatosController@update');
  Route::delete('/componentes/eventos/evento-contatos','EventoContatosController@destroy'); 
  
  Route::get('/componentes/componente-eventos/hospedagem/componente-evento-servicos','HomeController@index');
  Route::get('/componentes/eventos/evento-servicos/grid','EventoServicosController@grid');
  Route::get('/componentes/eventos/evento-servicos/combo','EventoServicosController@combo');
  Route::post('/componentes/eventos/evento-servicos','EventoServicosController@store');
  Route::put('/componentes/eventos/evento-servicos','EventoServicosController@update');
  Route::delete('/componentes/eventos/evento-servicos','EventoServicosController@destroy'); 

  Route::get('/componentes/componente-eventos/hospedagem/componente-evento-hospedagem-categorias','HomeController@index');
  Route::get('/componentes/eventos/evento-hospedagem-categorias/grid','EventoHospedagemCategoriasController@grid');
  Route::get('/componentes/eventos/evento-hospedagem-categorias/combo','EventoHospedagemCategoriasController@combo');
  Route::post('/componentes/eventos/evento-hospedagem-categorias','EventoHospedagemCategoriasController@store');
  Route::put('/componentes/eventos/evento-hospedagem-categorias','EventoHospedagemCategoriasController@update');
  Route::delete('/componentes/eventos/evento-hospedagem-categorias','EventoHospedagemCategoriasController@destroy'); 

  Route::get('/componentes/componente-eventos/hospedagem/componente-evento-hospedagem-cidades','HomeController@index');
  Route::get('/componentes/eventos/evento-hospedagem-cidades/grid','EventoHospedagemCidadesController@grid');
  Route::get('/componentes/eventos/evento-hospedagem-cidades/combo','EventoHospedagemCidadesController@combo');
  Route::post('/componentes/eventos/evento-hospedagem-cidades','EventoHospedagemCidadesController@store');
  Route::put('/componentes/eventos/evento-hospedagem-cidades','EventoHospedagemCidadesController@update');
  Route::delete('/componentes/eventos/evento-hospedagem-cidades','EventoHospedagemCidadesController@destroy'); 

  Route::get('/componentes/componente-eventos/hospedagem/componente-evento-hospedagem-inclusos','HomeController@index');
  Route::get('/componentes/eventos/evento-hospedagem-inclusos/grid','EventoHospedagemInclusosController@grid');
  Route::get('/componentes/eventos/evento-hospedagem-inclusos/combo','EventoHospedagemInclusosController@combo');
  Route::post('/componentes/eventos/evento-hospedagem-inclusos','EventoHospedagemInclusosController@store');
  Route::put('/componentes/eventos/evento-hospedagem-inclusos','EventoHospedagemInclusosController@update');
  Route::delete('/componentes/eventos/evento-hospedagem-inclusos','EventoHospedagemInclusosController@destroy'); 

  Route::get('/componentes/componente-eventos/hospedagem/componente-evento-hospedagens','HomeController@index');
  Route::get('/componentes/eventos/evento-hospedagem-hospedagens/grid','EventoHospedagensController@grid');
  Route::get('/componentes/eventos/evento-hospedagem-hospedagens/combo','EventoHospedagensController@combo');
  Route::post('/componentes/eventos/evento-hospedagem-hospedagens','EventoHospedagensController@store');
  Route::put('/componentes/eventos/evento-hospedagem-hospedagens','EventoHospedagensController@update');
  Route::delete('/componentes/eventos/evento-hospedagem-hospedagens','EventoHospedagensController@destroy'); 

  Route::get('/componentes/eventos/evento-hospedagem-hospedagens-inclusos/grid','EventoHospedagemEventoHospedagemInclusosController@grid');
  Route::post('/componentes/eventos/evento-hospedagem-hospedagens-inclusos','EventoHospedagemEventoHospedagemInclusosController@store');
  Route::put('/componentes/eventos/evento-hospedagem-hospedagens-inclusos','EventoHospedagemEventoHospedagemInclusosController@update');
  Route::put('/componentes/eventos/evento-hospedagem-hospedagens-inclusos/updateStatus','EventoHospedagemEventoHospedagemInclusosController@updateStatus');
  Route::get('/componentes/eventos/evento-hospedagem-hospedagens-inclusos/ordem','EventoHospedagemEventoHospedagemInclusosController@getOrdem');
  Route::put('/componentes/eventos/evento-hospedagem-hospedagens-inclusos/ordem','EventoHospedagemEventoHospedagemInclusosController@updateOrdem');
  Route::delete('/componentes/eventos/evento-hospedagem-hospedagens-inclusos','EventoHospedagemEventoHospedagemInclusosController@destroy'); 
  
  Route::get('/componentes/eventos/evento-evento-servicos/grid','EventoEventoServicosController@grid');
  Route::post('/componentes/eventos/evento-evento-servicos','EventoEventoServicosController@store');
  Route::put('/componentes/eventos/evento-evento-servicos','EventoEventoServicosController@update');
  Route::put('/componentes/eventos/evento-evento-servicos/updateStatus','EventoEventoServicosController@updateStatus');
  Route::get('/componentes/eventos/evento-evento-servicos/ordem','EventoEventoServicosController@getOrdem');
  Route::put('/componentes/eventos/evento-evento-servicos/ordem','EventoEventoServicosController@updateOrdem');
  Route::delete('/componentes/eventos/evento-evento-servicos','EventoEventoServicosController@destroy'); 
  
  Route::get('/componentes/eventos/evento-fotos/grid','EventoFotosController@grid');
  Route::post('/componentes/eventos/evento-fotos','EventoFotosController@store');
  Route::put('/componentes/eventos/evento-fotos','EventoFotosController@update');
  Route::put('/componentes/eventos/evento-fotos/updateStatus','EventoFotosController@updateStatus');
  Route::get('/componentes/eventos/evento-fotos/ordem','EventoFotosController@getOrdem');
  Route::put('/componentes/eventos/evento-fotos/ordem','EventoFotosController@updateOrdem');
  Route::delete('/componentes/eventos/evento-fotos','EventoFotosController@destroy'); 
  
  Route::get('/componentes/eventos/evento-evento-hospedagens/grid','EventoEventoHospedagensController@grid');
  Route::post('/componentes/eventos/evento-evento-hospedagens','EventoEventoHospedagensController@store');
  Route::put('/componentes/eventos/evento-evento-hospedagens','EventoEventoHospedagensController@update');
  Route::put('/componentes/eventos/evento-evento-hospedagens/updateStatus','EventoEventoHospedagensController@updateStatus');
  Route::get('/componentes/eventos/evento-evento-hospedagens/ordem','EventoEventoHospedagensController@getOrdem');
  Route::put('/componentes/eventos/evento-evento-hospedagens/ordem','EventoEventoHospedagensController@updateOrdem');
  Route::delete('/componentes/eventos/evento-evento-hospedagens','EventoEventoHospedagensController@destroy'); 

  Route::get('/componentes/eventos/evento-hospedagem-valors/grid','EventoHospedagemValorsController@grid');
  Route::post('/componentes/eventos/evento-hospedagem-valors','EventoHospedagemValorsController@store');
  Route::put('/componentes/eventos/evento-hospedagem-valors','EventoHospedagemValorsController@update');
  Route::put('/componentes/eventos/evento-hospedagem-valors/updateStatus','EventoHospedagemValorsController@updateStatus');
  Route::get('/componentes/eventos/evento-hospedagem-valors/ordem','EventoHospedagemValorsController@getOrdem');
  Route::put('/componentes/eventos/evento-hospedagem-valors/ordem','EventoHospedagemValorsController@updateOrdem');
  Route::delete('/componentes/eventos/evento-hospedagem-valors','EventoHospedagemValorsController@destroy'); 

  Route::get('/componentes/eventos/evento-textos/grid','EventoTextosController@grid');
  Route::post('/componentes/eventos/evento-textos','EventoTextosController@store');
  Route::put('/componentes/eventos/evento-textos','EventoTextosController@update');
  Route::put('/componentes/eventos/evento-textos/updateStatus','EventoTextosController@updateStatus');
  Route::get('/componentes/eventos/evento-textos/ordem','EventoTextosController@getOrdem');
  Route::put('/componentes/eventos/evento-textos/ordem','EventoTextosController@updateOrdem');
  Route::delete('/componentes/eventos/evento-textos','EventoTextosController@destroy'); 

  Route::get('modulos/modulo-posicao',"HomeController@index");  
  Route::get('modulo-posicaos/grid',"ModuloPosicaosController@grid"); 
  Route::get('modulo-posicaos/combo',"ModuloPosicaosController@combo");  
  Route::post('modulo-posicaos',"ModuloPosicaosController@store");  
  Route::put('modulo-posicaos',"ModuloPosicaosController@update");  
  Route::delete('modulo-posicaos',"ModuloPosicaosController@destroy");
  
  Route::get('/modulos/modulo-produtos/modulo-produto-destaques','HomeController@index');
  Route::get('/modulos/modulo-html','HomeController@index');
  Route::get('/modulos/modulo-menu','HomeController@index');
  Route::get('/modulos/modulo-banner-slider','HomeController@index');
  Route::get('/modulos/modulo-contato',"HomeController@index"); 
  Route::get('/modulos/modulo-clima-tempo',"HomeController@index"); 
  Route::get('modulos/grid',"ModulosController@grid"); 
  Route::get('modulos/getModulosOrdem',"ModulosController@getModulosOrdem");
  Route::put('modulos/updateModulosOrdem',"ModulosController@updateModulosOrdem");
  Route::post('modulos',"ModulosController@store");  
  Route::put('modulos',"ModulosController@update");  
  Route::delete('modulos',"ModulosController@destroy");

  Route::get('logs','HomeController@index');
  Route::get('logs/grid','LogsController@grid');
  Route::get('logs/teste','LogsController@teste');

  Route::get('elfinder/show','ElfinderController@show');
  Route::any('elfinder/connector','ElfinderController@connector');

  Route::post('files/uploads','FilesController@uploads');
  Route::delete('files/delete','FilesController@delete');
  Route::get('files/read_dir','FilesController@read_dir');

  Route::get('/erro/403','HomeController@index');
  Route::get('/erro/404','HomeController@index');
  Route::get('/erro/500','HomeController@index');
});
//Route::when('/*','checkStatusSite');

/**
   * Errors Routes
   *
*/
if (Config::get('app.debug') == false) {
    App::error(function(Exception $exception){   
        switch ($exception->getStatusCode()) {
         case 404:
                if(AppError::isAdmin()){
                    return Redirect::to('/admin/erro/404');
                }else{
                    return View::make('templates.padrao.index');
                }
         break;
         case 500:
            return View::make('errors.500');
         break;
         default:
                return View::make('errors.default',array("code" => $exception->getStatusCode()));
            break;
      }
      return false;
    });
}else{
  App::missing(function($exception){
    if(($exception->getStatusCode() == 404)and(AppError::isAdmin() == false)){ 
      return View::make('templates.padrao.index');
    }  
  });
}



