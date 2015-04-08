$app.directive('componenteUnicoArtigo',function($resource,$compile,$http,PATH_TEMPLATES){
	return{
		restrict:'AE',
		scope:true,
		controller: 'ComponenteArtigosController',
		link: function(scope,element,attr,model){
			var data = scope.linkData[0];
			var parametros = angular.fromJson(data.parametros);
			var request = $resource("/CmsComponentes/componente-artigos/getArtigo",{artigo_id:parametros.artigo_id});
			
			request.query(function(response){
			 scope.artigo = response[0];
			 scope.artigo_titulo = "<"+scope.artigo.tag_titulo+">"+scope.artigo.titulo+"</"+scope.artigo.tag_titulo+">";
			 scope.artigo_parametros = angular.fromJson(response[0].parametros);

			 var templateUrl = PATH_TEMPLATES+'componentes/artigo/unico-artigo/unico-artigo.html';
			 var html = "<div ng-include src=\"'"+templateUrl+"'\" />";
			 var el = angular.element(html);
			 var compile = $compile(el)(scope);
			 element.html(compile);
			});
			
		}
	}
});
$app.directive('componenteCategoriaArtigo',function($location,$resource,$compile,$http,PATH_TEMPLATES,$routeParams,ComponenteService){
	return{
		restrict:'AE',
		scope:true,
		controller: 'ComponenteArtigosController',
		link: function(scope,element,attr,model){
			scope.artigos = "";
			var data = scope.linkData[0];
			var parametros = angular.fromJson(data.parametros);
			var request = $resource("/CmsComponentes/componente-artigos/getCategoria",{categoria_id:parametros.categoria_id});
			var request_artigo = $resource("/CmsComponentes/componente-artigos/getArtigoApelido",{apelido:$routeParams.apelido2});
			
			if($routeParams.apelido2 != undefined){
				request_artigo.query(function(response){
					if(response.length > 0){
						
						var length_template = parametros.categoria_template.length - 5;
						var meta_tags = {title:response[0].meta_title,description:response[0].meta_description,keywords:response[0].meta_keywords,author:response[0].meta_author};
						ComponenteService.setMetaTags(meta_tags);

						scope.artigo = response[0];
						scope.voltar = $routeParams.apelido1; 
						scope.artigo_parametros = angular.fromJson(response[0].parametros);
						scope.categoria_template = 'template-'+parametros.categoria_template.substr(0,length_template)+"-detalhe";

						var template = parametros.categoria_template.substr(0,length_template)+"-detalhe.html";

						var templateUrl = PATH_TEMPLATES+'componentes/artigo/categoria-de-artigo/'+template;
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
				 var length_template = parametros.categoria_template.length - 5;
				 scope.artigos = response;
				 scope.categoria_template = 'template-'+parametros.categoria_template.substr(0,length_template);
				 
				 var templateUrl = PATH_TEMPLATES+'componentes/artigo/categoria-de-artigo/'+parametros.categoria_template;
				 var html = "<div ng-include src=\"'"+templateUrl+"'\" />";
				 var el = angular.element(html);
				 var compile = $compile(el)(scope);
				 element.html(compile);
				});
				
			}
		}
	}
});