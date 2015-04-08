$app.directive('fancybox',function(){
	return{
		restrict: 'AE',
		link: function(scope,element,attrs,model){
			//if(scope.$last){
				element.fancybox({
					href: (attrs.href || attrs.src),
					titlePosition: 'inside',
					openEffect:'elastic'
				});
			//}	
		}
	}
});
$app.directive('fancyboxGaleriaRepeat',function($timeout){
	return{
		restrict: 'AE',
		link: function(scope,element,attrs,model){
			element.addClass('fancybox');
			if(scope.$last){
				$('.fancybox').fancybox();
				$('.fancybox').on('click',function(){
					return false;
				})
			}
		}
	}
});
