$app.directive('moduloProdutoDestaque',function($compile,$resource,PATH_TEMPLATES){
	return{
		restrict: "E",
		replace: true,
		scope:true,
		controller: 'ComponenteProdutosController',
		link: function(scope,element,attrs,model){
			var html = "";
			var modulo = scope.modulo;
			scope.mostrar_titulo = modulo.mostrar_titulo;
			scope.parametros = angular.fromJson(modulo.parametros);
			scope.modulo_titulo = "<"+modulo.tag_titulo+">"+modulo.titulo+"</"+modulo.tag_titulo+">";
			scope.parametros = angular.fromJson(modulo.parametros);
			var request = $resource('/CmsModulos/modulo-produtos/getProduto',{tipo:scope.parametros.tipo,categoria_id:scope.parametros.categoria_id,produtos:[getIdsProdutos(scope.parametros.produtos)]});
					
			request.get(function(response){

				scope.produtos = response.produtos;
				scope.menu_itens = response.menu_itens;

				var templateUrl = PATH_TEMPLATES+'modulos/produtos/produto-em-destaques/'+scope.parametros.template;
				var html = "<div ng-include src=\"'"+templateUrl+"'\" />";
				var el = angular.element(html);
				var compile = $compile(el)(scope);
				
				element.html(compile);
			},function(response){
				var content = response.data.error.message;
				var code = response.status;
			});
			
			function getIdsProdutos(produtos){
				var ids = [];
				if(produtos.length > 0){
					angular.forEach(produtos,function(v,k){
						ids.push(v.id);
					});
				}	
				return ids;
			}

		}
	}
});