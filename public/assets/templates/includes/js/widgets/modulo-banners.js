$app.directive('moduloBannerSlider',function($resource,$compile,$http,$q){
	return{
		restrict: "E",
		scope: true,
		link: function(scope,element,attrs,model){
			var html = "";
			var data = scope.modulo;
			var titulo = data.titulo;
			var mostrar_titulo = data.mostrar_titulo;
			var tag_titulo = data.tag_titulo;
			var parametros = angular.fromJson(data.parametros);
			var request = $resource('/CmsModulos/banner-sliders/get-fotos',{banner_id:parametros.banner_id});
		
			if(mostrar_titulo == true){
				html += "<"+tag_titulo+">"+titulo+"</"+tag_titulo+">";
			}
			request.query(function(response){
				scope.modulo = data;

				var banner = response;
				var li = "";
				var image_first = "";
				var altura_inicial = ""; 
				html += "<section class='"+parametros.class+" banner-slider-cycle' id='"+parametros.id+"'>";
				html += "<nav banner-slider-cycle parametros='modulo.parametros' class='cycle'>";
				angular.forEach(banner,function(v,k){
					var image = "/componentes/banner-slider/banner-"+v.banner_slider_id+"/"+v.imagem;
					if(k == 0){
						image_first = "<img src='"+image+"' style='display:none;' class='cycle-image-first'/>"
					}	
					if(v.url.length > 0){
						html += "<div class='itemCycle'>"; 
						html += "<a href='"+v.url+"' target='"+v.url_target+"'>";
						html += "<img src='"+image+"'>";
						if(v.legenda.length > 0){
						   html += "<div class='cycle-legenda'><div class='body'>";
						   html += v.legenda;
						   html += "</div></div>";
						}
						html += "</a>";
						html += "</div>";
					}else{
						html += "<div class='itemCycle'>"; 
						html += "<img src='"+image+"'>";
						if(v.legenda.length > 0){
						   html += "<div class='cycle-legenda'><div class='body'>";
						   html += v.legenda;
						   html += "</div></div>";
						}
						html += "</div>";
					}

					li += "<li><a href='#'><img src='"+image+"' width='50px' /></a></li>";
				});
				html += "</nav>";
				if(parseInt(parametros.next) == 1 || parseInt(parametros.prev) == 1){
					html += "<div class='clear'></div>";
				}
				if(parseInt(parametros.prev) == 1){
					html += "<div id='prev' class='cycle-prev'><span class='icon-arrow-left-2'></span></div>";		
				}
				if(parseInt(parametros.next) == 1){
					html += "<div id='next' class='cycle-next'><span class='icon-arrow-right-2'></span></div>";		
				}
				var navs = "";
				if(parseInt(parametros.paginacao)){
					navs += "<div class='cycle-pager'>";
					navs += "<ul id='pager'>";
					navs += "</ul>";	
					navs += "</div>";
				}	
				navs += image_first;
				navs += "</section>";

				var el = angular.element(html+navs);
      			compiled = $compile(el)(scope);
      			element.html(compiled).show('fade');
			},function(response){

			});
			
		}
	}
});