var xhReq = new XMLHttpRequest();
xhReq.open("GET", "/admin/auth/token", false);
xhReq.send(null);

$app = angular.module('CmsLaravelSite',['ngRoute','ngResource','ngAnimate','ngSanitize']);
$app.constant("CSRF_TOKEN",xhReq.responseText);
$app.constant("MODULOS",getModulos());
$app.constant("PATH_TEMPLATES",'/assets/templates/includes/templates/');

$app.config(function($routeProvider,$locationProvider,$httpProvider,PATH_TEMPLATES){
  
  $httpProvider.defaults.headers.common['X-Frame-Options'] = "*";
  $httpProvider.defaults.useXDomain = true;
  $locationProvider.hashPrefix('');
  $locationProvider.html5Mode(true); 

  $routeProvider.when('/', {
      templateUrl: PATH_TEMPLATES+'componentes/index.html',
      controller: 'ComponentesController',
      resolve: {
         linkData: function(ComponenteService) {
          return ComponenteService.getLink();
        }
      } 
  });
  $routeProvider.when('/erro/404', {
      templateUrl: PATH_TEMPLATES+'errors/404.html'
  });
  $routeProvider.when('/:apelido1', {
      templateUrl: PATH_TEMPLATES+'componentes/index.html',
      controller: 'ComponentesController',
      resolve: {
         linkData: function(ComponenteService,$route,$location) {
          return ComponenteService.getLinkApelido($route.current.params.apelido1);
        }
      }  
  });
  $routeProvider.when('/:apelido1/:apelido2', {
      templateUrl: PATH_TEMPLATES+'componentes/index.html',
      controller: 'ComponentesController',
      resolve: {
         linkData: function(ComponenteService,$route,$location) {
          return ComponenteService.getLinkApelido($route.current.params.apelido1);
        }
      }  
  });
   $routeProvider.otherwise({redirectTo: '/erro/404'});
 
});
$app.run(function($rootScope,$location,$templateCache,$http,ModuloService){

  $rootScope.$on('$viewContentLoading', function(){});
  $rootScope.$on('$viewContentLoaded', function(){
    $templateCache.removeAll();
  });
  $rootScope.isViewLoading = false;

  $rootScope.$on('$routeChangeStart',function(){
    $rootScope.isViewLoading = true;
    $rootScope.currentLink = $location.path();
  
  });
  $rootScope.$on('$routeChangeSuccess',function(){
    $rootScope.isViewLoading = false;
  });
}); 
function getModulos() {
    var m;
    $.ajax({
        async: false,
        method: "GET",
        url: '/CmsModulos/get-modulos',
        success: function(data) {
            m = data;
        }
    });
    return m;
} 
  

