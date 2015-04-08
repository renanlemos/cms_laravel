$app.directive('componenteCategoriaEvento',function($location,$resource,$compile,$http,PATH_TEMPLATES,$routeParams,ComponenteService){
	return{
		restrict:'AE',
		scope:true,
		controller: 'ComponenteEventosController',
		link: function(scope,element,attr,model){
			scope.artigos = "";
			var data = scope.linkData[0];
			var parametros = angular.fromJson(data.parametros);
			var request = $resource("/CmsComponentes/componente-eventos/getCategoria",{id:parametros.evento_categoria_id,status:parametros.evento_status});
			var request_produto = $resource("/CmsComponentes/componente-produtos/getProduto",{apelido:$routeParams.apelido2});

			if($routeParams.apelido2 != undefined){
				getProduto();
			}else{
				getCategoria();
			}
			function getProduto(){
				element.html('<p>Detalhes</p>');
			}
			function getCategoria(){
				request.get(function(response){

					scope.apelido1 = $routeParams.apelido1;
					scope.eventos = response.eventos;
					scope.categoria = response.categoria[0];

					scope.categoria_parametros = angular.fromJson(scope.categoria.parametros);

					if(scope.eventos.length > 0){
						var templateUrl = PATH_TEMPLATES+'componentes/evento/categoria-de-evento/'+scope.categoria_parametros.template;
						var html = "<div ng-include src=\"'"+templateUrl+"'\" />";
						var el = angular.element(html);
						var compile = $compile(el)(scope);
						element.html(compile);
					}else{
						element.html("<p>Nenhum evento cadastrado.</p>");
					}	

				},function(){
					element.html("<p>Erro ao carregar eventos.</p>");
				});
			}	
			
		}
	}
});