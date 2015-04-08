$app.controller('QuemSomosController',function($scope,$http,$window,$location,$resource){$scope.title="Quem Somos";init=function(){}
init();});$app.controller('HomeController',function($scope,$http,$window,$location,$resource){$scope.title="Home";init=function(){}
init();});$app.controller('ContatoController',function($scope,$resource){$scope.title="Contato";init=function(){}});$app.controller('ComponentesController',function($scope,$location,$resource,$routeParams,linkData){init=function(){$scope.apelido=$routeParams.apelido;$scope.linkData=linkData;}
init();});