$app.directive('componenteUnicoContato',function($resource,$compile,$http,PATH_TEMPLATES){
	return{
		restrict:'AE',
		scope:true,
		controller: 'ComponenteContatosController',
		link: function(scope,element,attr,model){
			var data = scope.linkData[0];
			var parametros = angular.fromJson(data.parametros);
			var request = $resource('/CmsComponentes/componente-contatos/getContato',{contato:parametros.contato_id});

			request.query(function(response){
			 
			 scope.contato = response[0];
			 scope.contato_form.contato_id = scope.contato.id;
			 scope.contato_form.config_global = scope.contato.config_global;

			 var templateUrl = PATH_TEMPLATES+'componentes/contato/unico-contato.html';
			 var html = "<div ng-include src=\"'"+templateUrl+"'\" />";
			 var el = angular.element(html);
			 var compile = $compile(el)(scope);
			 element.html(compile);
			
			});	
		}
	}
});