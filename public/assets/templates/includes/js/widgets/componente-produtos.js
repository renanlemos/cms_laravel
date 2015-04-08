$app.directive('componenteUnicoProduto',function($resource,$compile,$http,PATH_TEMPLATES,$routeParams,ComponenteService){
	return{
		restrict:'AE',
		scope:true,
		controller: 'ComponenteProdutosController',
		link: function(scope,element,attr,model){
			var data = scope.linkData[0];
			var parametros = angular.fromJson(data.parametros);
			var request = $resource("/CmsComponentes/componente-produtos/getProduto",{produto_id:parametros.produto_id});
		
			request.get(function(response){
				scope.produto = response.produto[0];
				scope.fotos = response.fotos;
				scope.caracteristicas = response.caracteristicas;
				scope.categoria = response.categoria;
				scope.produto_parametros = angular.fromJson(scope.produto.parametros);
				scope.categoria_parametros = angular.fromJson(scope.categoria.parametros);
				scope.produtos_relacionados = response.produtos_relacionados;
				scope.menu_itens = response.menu_itens;
				var meta_tags = {title:scope.produto.meta_title,description:scope.produto.meta_description,keywords:scope.produto.meta_keywords,author:scope.produto.meta_author};
				ComponenteService.setMetaTags(meta_tags);
			 
				var templateUrl = PATH_TEMPLATES+'componentes/produto/produto/'+parametros.template;
				var html = "<div ng-include src=\"'"+templateUrl+"'\" />";
				var el = angular.element(html);
				var compile = $compile(el)(scope);
				element.html(compile);
			});
			
		}
	}
});
$app.directive('componenteCategoriaProduto',function($location,$resource,$compile,$http,PATH_TEMPLATES,$routeParams,ComponenteService){
	return{
		restrict:'AE',
		scope:true,
		controller: 'ComponenteProdutosController',
		link: function(scope,element,attr,model){
			scope.artigos = "";
			var data = scope.linkData[0];
			var parametros = angular.fromJson(data.parametros);
			var request = $resource("/CmsComponentes/componente-produtos/getCategoria",{categoria_id:parametros.produto_categoria_id});
			var request_produto = $resource("/CmsComponentes/componente-produtos/getProduto",{apelido:$routeParams.apelido2});

			if($routeParams.apelido2 != undefined){
				request_produto.get(function(response){
					if(response.produto.length > 0){
						
						scope.produto = response.produto[0];
						scope.fotos = response.fotos;
						scope.caracteristicas = response.caracteristicas;
						scope.categoria = response.categoria;
						scope.voltar = $routeParams.apelido1; 
						scope.produto_parametros = angular.fromJson(scope.produto.parametros);
						scope.categoria_parametros = angular.fromJson(scope.categoria.parametros);
						scope.produtos_relacionados = response.produtos_relacionados;
						scope.menu_itens = response.menu_itens;

						var meta_tags = {title:scope.produto.meta_title,description:scope.produto.meta_description,keywords:scope.produto.meta_keywords,author:scope.produto.meta_author};
						ComponenteService.setMetaTags(meta_tags);

						var templateUrl = PATH_TEMPLATES+'componentes/produto/produto/'+scope.categoria_parametros.template;
						var html = "<div ng-include src=\"'"+templateUrl+"'\" />";
						var el = angular.element(html);
						var compile = $compile(el)(scope);
						element.html(compile);
					
					}else{
						$location.path('erro/404');
					}	
				});
			}else{
				request.query(function(response){

					scope.produtos = angular.fromJson(response[0].produtos);
					scope.categoria = response[0].categoria;
			
					if(scope.categoria.length == 0){
						element.html("<p>Categoria despublicada no momento.</p>");
					}else if(scope.produtos.length == 0){
						element.html("<p>Nenhum produto cadastrado pra essa categoria.</p>");
					}else{
						scope.categoria_parametros = angular.fromJson(scope.categoria[0].parametros); 
						
						var templateUrl = PATH_TEMPLATES+'componentes/produto/categoria-de-produto/'+scope.categoria_parametros.template;
						var html = "<div ng-include src=\"'"+templateUrl+"'\" />";
						var el = angular.element(html);
						var compile = $compile(el)(scope);
						element.html(compile);
					}
				 
				},function(response){
					element.html("<p>Erro ao carregar produtos.</p>");
				});
				
			}
		}
	}
});