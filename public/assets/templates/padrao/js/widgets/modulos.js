$app.directive('modulo',function($resource,$compile,$rootScope,MODULOS){
	return{
		restrict:"E",
		link:function(scope,element,attrs,model){

			var request = $resource('/CmsModulos/get-modulos-posicao');
			var data = {posicao:attrs.posicao};
			var modulos_all = MODULOS;
	  		var modulos = searchModulos(modulos_all,attrs.posicao);
		
			if(modulos.length > 0){
				angular.forEach(modulos,function(v,k){
					scope.modulo = v;
					var m = getModulo(v);
					var el = angular.element(m);
					var compile = $compile(el)(scope);
					element.append(compile);
				});
			}
            function searchModulos(data,posicao){
            	var modulos = [];
            	angular.forEach(data,function(v,k){
             		if(v.descricao == posicao){
            			modulos.push(v);
            		}
            	});

            	return modulos;
            }
			function getModulo(modulo){
				switch(modulo.tipo){
					case 'html':
					   return "<modulo-html></modulo-html>";
					break;
					case 'banner-slider':
					   return "<modulo-banner-slider></modulo-banner-slider>";
					break;
					case 'contato':
					   return "<modulo-contato></modulo-contato>";
					break;
					case 'menu':
					   return "<modulo-menu></modulo-menu>";
					break;
				}
			}
		}
	}
	
});
$app.directive('moduloContato',function($compile,$resource){
	return{
		restrict: "E",
		scope: true,
		link: function(scope,element,attrs,model){
			
			var data = scope.modulo;
			var titulo = data.titulo;
			var mostrar_titulo = data.mostrar_titulo;
			var tag_titulo = data.tag_titulo;
			var parametros = angular.fromJson(data.parametros);
			
				
			var el = angular.element("<h1>TESTE</h1 >");
      		var compiled = $compile(el)(scope);
      		element.html(compiled);
		}
	}
});

