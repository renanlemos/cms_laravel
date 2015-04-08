$app.directive('moduloHtml',function($compile,$rootScope){
	return{
		restrict: "E",
		replace: true,
		scope:true,
		link: function(scope,element,attrs,model){
			var html = "";
			var data = scope.modulo;
			var conteudo = data.conteudo;
			var titulo = data.titulo;
			var mostrar_titulo = data.mostrar_titulo;
			var tag_titulo = data.tag_titulo;
			var parametros = angular.fromJson(data.parametros);
			
			html += "<div class='modulo-html "+parametros.class+"' id='"+parametros.id+"'>";
			if(mostrar_titulo == true){
				html += "<"+tag_titulo+">"+titulo+"</"+tag_titulo+">";
			}
			html += conteudo;
			html += "</div>";

			var el = angular.element(html);
      		var compile = $compile(el)(scope);
      		element.html(compile);
		}
	}
});