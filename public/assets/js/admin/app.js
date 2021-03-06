var xhReq = new XMLHttpRequest();
xhReq.open("GET", "/admin/auth/token", false);
xhReq.send(null);

$app = angular.module('CmsLaravel',['kendo.directives','ngRoute','ngResource','ngCookies','ngAnimate','ngSanitize']);
$app.constant("CSRF_TOKEN",xhReq.responseText);

$app.config(function($routeProvider,$locationProvider,$httpProvider){
  
  $httpProvider.defaults.headers.common['X-Frame-Options'] = "*";
  $httpProvider.defaults.useXDomain = true;
  $locationProvider.hashPrefix('');
  $locationProvider.html5Mode(true); 
 
  $routeProvider.when('/admin', {
      templateUrl: '/assets/js/admin/templates/home/index.html',
      controller: 'HomeController'
  });
  $routeProvider.when('/admin/site/configuracao-global', {
      templateUrl: '/assets/js/admin/templates/site/configuracao-global/index.html',
      controller: 'SiteConfigController'
  });
  $routeProvider.when('/admin/usuarios', {
      templateUrl: '/assets/js/admin/templates/usuarios/index.html',
      controller: 'UsuariosController'
  });
  $routeProvider.when('/admin/login', {
      templateUrl: '/assets/js/admin/templates/auth/index.html',
      controller: 'AuthController'
  });
  $routeProvider.when('/admin/menus', {
      templateUrl: '/assets/js/admin/templates/menus/index.html',
      controller: 'MenusController'
  });
  $routeProvider.when('/admin/conteudo/artigos', {
      templateUrl: '/assets/js/admin/templates/conteudo/artigos/index.html',
      controller: 'ArtigosController'
  });
  $routeProvider.when('/admin/conteudo/artigo-categorias', {
      templateUrl: '/assets/js/admin/templates/conteudo/categorias/index.html',
      controller: 'ArtigoCategoriasController'
  });
  $routeProvider.when('/admin/conteudo/midias', {
      templateUrl: '/assets/js/admin/templates/conteudo/midias/index.html',
      controller: 'MidiasController'
  });
  $routeProvider.when('/admin/componentes/componente-banner-slider', {
      templateUrl: '/assets/js/admin/templates/componentes/banner-sliders/index.html',
      controller: 'BannerSlidersController'
  });
  $routeProvider.when('/admin/componentes/componente-contato', {
      templateUrl: '/assets/js/admin/templates/componentes/contato/index.html',
      controller: 'ContatoController'
  });
  $routeProvider.when('/admin/componentes/componente-produtos/componente-produto-categorias', {
      templateUrl: '/assets/js/admin/templates/componentes/produtos/categorias/index.html',
      controller: 'ProdutoCategoriasController'
  });
  $routeProvider.when('/admin/componentes/componente-produtos/componente-produto-produtos', {
      templateUrl: '/assets/js/admin/templates/componentes/produtos/produtos/index.html',
      controller: 'ProdutosController'
  });
  $routeProvider.when('/admin/componentes/componente-produtos/componente-produto-caracteristicas', {
      templateUrl: '/assets/js/admin/templates/componentes/produtos/caracteristicas/index.html',
      controller: 'ProdutoCaracteristicasController'
  });
  $routeProvider.when('/admin/componentes/componente-produtos/componente-produto-caracteristica-tipos', {
      templateUrl: '/assets/js/admin/templates/componentes/produtos/tipo-de-caracteristicas/index.html',
      controller: 'ProdutoCaracteristicaTiposController'
  });
  $routeProvider.when('/admin/componentes/componente-eventos/componente-evento-eventos', {
      templateUrl: '/assets/js/admin/templates/componentes/eventos/eventos/index.html',
      controller: 'EventosController'
  });
  $routeProvider.when('/admin/componentes/componente-eventos/componente-evento-categorias', {
      templateUrl: '/assets/js/admin/templates/componentes/eventos/categorias/index.html',
      controller: 'EventoCategoriasController'
  });
  $routeProvider.when('/admin/componentes/componente-eventos/componente-evento-contatos', {
      templateUrl: '/assets/js/admin/templates/componentes/eventos/contatos/index.html',
      controller: 'EventoContatosController'
  });
  $routeProvider.when('/admin/componentes/componente-eventos/hospedagem/componente-evento-servicos', {
      templateUrl: '/assets/js/admin/templates/componentes/eventos/servicos/index.html',
      controller: 'EventoServicosController'
  });
  $routeProvider.when('/admin/componentes/componente-eventos/hospedagem/componente-evento-hospedagens', {
      templateUrl: '/assets/js/admin/templates/componentes/eventos/hospedagem/hospedagens/index.html',
      controller: 'EventoHospedagensController'
  });
  $routeProvider.when('/admin/componentes/componente-eventos/hospedagem/componente-evento-hospedagem-categorias', {
      templateUrl: '/assets/js/admin/templates/componentes/eventos/hospedagem/categorias/index.html',
      controller: 'EventoHospedagemCategoriasController'
  });
  $routeProvider.when('/admin/componentes/componente-eventos/hospedagem/componente-evento-hospedagem-cidades', {
      templateUrl: '/assets/js/admin/templates/componentes/eventos/hospedagem/cidades/index.html',
      controller: 'EventoHospedagemCidadesController'
  });
  $routeProvider.when('/admin/componentes/componente-eventos/hospedagem/componente-evento-hospedagem-inclusos', {
      templateUrl: '/assets/js/admin/templates/componentes/eventos/hospedagem/inclusos/index.html',
      controller: 'EventoHospedagemInclusosController'
  });
  $routeProvider.when('/admin/modulos/modulo-posicao', {
      templateUrl: '/assets/js/admin/templates/modulos/posicao/index.html',
      controller: 'ModuloPosicaoController'
  });
  $routeProvider.when('/admin/modulos/modulo-html', {
      templateUrl: '/assets/js/admin/templates/modulos/html/index.html',
      controller: 'ModuloHtmlController'
  });
  $routeProvider.when('/admin/modulos/modulo-banner-slider', {
      templateUrl: '/assets/js/admin/templates/modulos/banner-slider/index.html',
      controller: 'ModuloBannerSliderController'
  });
  $routeProvider.when('/admin/modulos/modulo-contato', {
      templateUrl: '/assets/js/admin/templates/modulos/contato/index.html',
      controller: 'ModuloContatoController'
  });
  $routeProvider.when('/admin/modulos/modulo-menu', {
      templateUrl: '/assets/js/admin/templates/modulos/menu/index.html',
      controller: 'ModuloMenuController'
  });
  $routeProvider.when('/admin/modulos/modulo-clima-tempo', {
      templateUrl: '/assets/js/admin/templates/modulos/clima-tempo/index.html',
      controller: 'ModuloClimaTempoController'
  });
  $routeProvider.when('/admin/modulos/modulo-produtos/modulo-produto-destaques', {
      templateUrl: '/assets/js/admin/templates/modulos/produtos/produto-em-destaques/index.html',
      controller: 'ModuloProdutoDestaquesController'
  });
  $routeProvider.when('/admin/logs', {
      templateUrl: '/assets/js/admin/templates/logs/index.html',
      controller: 'LogsController'
  });
  $routeProvider.when('/admin/erro/403', {
      templateUrl: '/assets/js/admin/templates/errors/403.html',
  });
  $routeProvider.when('/admin/erro/404', {
      templateUrl: '/assets/js/admin/templates/errors/404.html',
  });
  $routeProvider.otherwise({redirectTo: '/admin/erro/404'});
 
});
$app.run(function($rootScope,$location,$templateCache,$http,AuthService){

  $rootScope.$on('$viewContentLoading', function(){});
  $rootScope.$on('$viewContentLoaded', function(){
    $templateCache.removeAll();
  });
  $rootScope.isViewLoading = false;

  $rootScope.$on('$routeChangeStart',function(){
    AuthService.verificaLogin();
    $rootScope.isViewLoading = true;
    $rootScope.currentLink = $location.path();
  
  });
  $rootScope.$on('$routeChangeSuccess',function(){
    $rootScope.isViewLoading = false;
  });
});  
  

