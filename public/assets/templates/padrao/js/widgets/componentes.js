$app.directive('componente',function($resource,$compile,ComponenteService){
	return{
		restrict:'AE',
		scope:true,
		link: function(scope,element,attr,model){
			var link = scope.linkData[0];
			var meta_tags = {title:link.meta_title,description:link.meta_description,keywords:link.meta_keywords,author:link.meta_author};
			
			scope.link = angular.fromJson(link);
			scope.link_parametros = angular.fromJson(link.parametros);

			ComponenteService.setMetaTags(meta_tags);
			var componenteTemplate = ComponenteService.getComponenteTemplate(link.componente,link.tipo);
			
			var el = angular.element(componenteTemplate);
			var compile = $compile(el)(scope);
			element.html(compile);
		}
	}
});
