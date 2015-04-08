$app.directive('moduloClimaTempo',function($compile,$http,$resource,PATH_TEMPLATES){
	return{
		restrict: "E",
		replace: true,
		scope:true,
		link: function(scope,element,attrs,model){
			var modulo = scope.modulo;
			scope.mostrar_titulo = modulo.mostrar_titulo;
			scope.parametros = angular.fromJson(modulo.parametros);
			scope.modulo_titulo = "<"+modulo.tag_titulo+">"+modulo.titulo+"</"+modulo.tag_titulo+">";
			var request = $resource('/CmsModulos/clima-tempo/getTempo',{latitude:scope.parametros.latitude,longitude:scope.parametros.longitude});

			request.get(function(response){
				scope.tempo = response.data;
				var templateUrl = PATH_TEMPLATES+'modulos/clima-tempo/'+scope.parametros.template;
				var html = "<div ng-include src=\"'"+templateUrl+"'\" />";
				var el = angular.element(html);
				var compile = $compile(el)(scope);

				element.html(compile);
			},function(response){
				var content = response.data.error.message;
				var code = response.status;
			});
			
		}
	}
});