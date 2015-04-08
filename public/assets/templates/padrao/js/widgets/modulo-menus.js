$app.directive('moduloMenu',function($compile,$resource,$rootScope){
	return{
		restrict: "E",
		scope: true,
		link: function(scope,element,attrs,model){
			
			var data = scope.modulo;
			var titulo = data.titulo;
			var mostrar_titulo = data.mostrar_titulo;
			var tag_titulo = data.tag_titulo;
			var parametros = angular.fromJson(data.parametros);
			
			var html = "";
			html += "<div class='modulo-menu "+parametros.class+"' id='"+parametros.id+"'>";
			if(mostrar_titulo == true){
				html += "<"+tag_titulo+">"+titulo+"</"+tag_titulo+">";
			}
			html += "<modulo-menu-"+parametros.menu_template+" parametros='modulo.parametros'></modulo-menu-"+parametros.menu_template+">";
			html += "</div>";
			
			var el = angular.element(html);
      		var compiled = $compile(el)(scope);
      		element.html(compiled);
		}
	}
});
$app.directive('moduloMenuPadrao',function($compile,$location,$rootScope,$resource,MenuService){
	return{
		restrict: "AE",
		scope:true,
		template: "<nav class='modulo-menu-padrao'><ul></ul></nav>",
		link: function(scope,element,attrs,model){
			
			var parametros = angular.fromJson(scope.modulo.parametros);
			var request = $resource('/CmsModulos/menus/getMenu');
			
			request.query({menu_id:parametros.menu_id},function(response){
	
				MenuService.setMenuData(response);
				var menu_itens = MenuService.getMenuData(response);
				var menuHtml = "";
				var href = "";
				
				angular.forEach(menu_itens,function(v,k){
					var apelido = v.apelido[0] == '/'? v.apelido : "/"+v.apelido; 
					href = v.pagina_inicial == true ? '/' : apelido;
					
					if(MenuService.isParent(v.id)){
						menuHtml += readItensParent(v);
					}else{
						menuHtml += "<li>";
					    menuHtml += "<a href='"+href+"' title='"+v.titulo+"' ng-class='{active:currentLink == \""+href+"\"}' >";
					    menuHtml += v.titulo;
					    menuHtml += "</a>";
					    menuHtml += "</li>";
					}    
				});
				var el = angular.element(menuHtml);
		      	var compiled = $compile(el)(scope);
		      	element.find('ul').html(compiled);
			},function(response){
				element.html("Erro ao carregar menu.");
			});
			function readItensParent(item){
				var apelido = item.apelido[0] == '/'? item.apelido : "/"+item.apelido; 
				var href = item.pagina_inicial == true ? '/' : apelido;
				var menuHtml = "";

				menuHtml += "<li class='item-parent'>";
				menuHtml += "<a href='"+href+"' title='"+item.titulo+"' class='item-parent' menu-dropdown-padrao>";
				menuHtml += item.titulo;
				menuHtml += "</a>";
				menuHtml += "<ul class='sub-itens'>";
				angular.forEach(MenuService.getItensParent(item.id),function(v,k){
				  	var apelido = v.apelido[0] == '/'? v.apelido : "/"+v.apelido; 
					var href = v.pagina_inicial == true ? '/' : apelido;
					if(MenuService.isParent(v.id)){
						menuHtml += readItensParent(v);
					}else{
					    menuHtml += "<li>";
					    menuHtml += "<a href='"+href+"' title='"+v.titulo+"' ng-class='{active:currentLink == \""+href+"\"}'>";
					    menuHtml += v.titulo;
					    menuHtml += "</a>";
					    menuHtml += "</li>";
					}    
				});
				menuHtml += "</ul>";
				menuHtml += "</li>";

			    return menuHtml; 
			}	
		
		}
	}
});
$app.directive('menuDropdownPadrao',function($rootScope){
	return{
		restrict: 'AE',
		link: function(scope,element,attrs,model){
			
			element.on('click',dropdown);
			
			$rootScope.$on('$routeChangeStart',function(){
    			var item = element.parent();
				var sub_itens_all = item.find('.sub-itens');
				sub_itens_all.addClass('hide');
				sub_itens_all.removeClass('show');
				sub_itens_all.hide(100);
    		});
			function dropdown(){
				var item = element.parent();
				var sub_itens = item.find('.sub-itens').first();
				var sub_itens_all = item.find('.sub-itens');

				if(sub_itens.hasClass('show')){
					sub_itens.hide(100);
					sub_itens_all.hide(100);
					sub_itens_all.removeClass('show');
					sub_itens.addClass('hide');
					sub_itens.removeClass('show');
				}else{
					sub_itens.show(100);
					sub_itens.addClass('show');
					sub_itens.removeClass('hide');
				}
				return false;
			}
		}
	}
});