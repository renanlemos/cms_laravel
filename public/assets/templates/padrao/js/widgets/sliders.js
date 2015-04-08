$app.directive('bannerSliderCycle',function(){
	return{
		restrict: 'A',
		scope:{
			parametros: "=parametros"
		},
		link: function(scope,element,attrs,model){
			//alert(scope.parametros);
			var options = angular.fromJson(scope.parametros);
			var img = $(element).parent().find('.cycle-image-first');

			element.cycle({
				fx: options.efeito,
				easing: 'easeOutBack', 
				loader: "wait",
				slides: '.itemCycle',
				pager: parseInt(options.paginacao) == 1 ? $(element).parent().find("#pager") : null,
				prev: parseInt(options.prev) == 1 ? $(element).parent().find("#prev") : null,
                next: parseInt(options.next) == 1 ? $(element).parent().find("#next") : null,
				timeout: options.timeout,
				speed: options.speed,
				pause: parseInt(options.pause),
				containerResize: 0,
				width: '100%',
				fit: 1,
				after: function(){
					
				},
				pagerAnchorBuilder: function(idx, slide) {
	   				if(parseInt(options.paginacao) == 1){
	    				var src = $(slide).find('img').attr('src');
						return '<li><a href="#"><img src="' + src+ '" width="50" height="50" /></a></li>'; 
    				}
    			} 
			});
			$(img).load(function() {
				element.css({
                    'height': $(this).height()+"px",	
                });
			});
			$(window).resize(function(){
                var img = $(element).parent().find('.cycle-image-first');
                element.css({
	                'height': img.height()+"px",	
	            });
	             
            });   
       		
		}
	}
});
