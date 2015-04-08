$app.directive("maskInput",function(){
	return{
		restrict: 'A',
		scope:{
			format: "@format"
		},
		link: function(scope,elem,attrs,model){
			elem.mask(scope.format);
		}
	}
});
$app.directive("ngBindHtmlCustom",function(){
	return{
		restrict: 'A',
		scope:{
			value_html: "@ngBindHtmlCustom"
		},
		link: function(scope,elem,attrs,model){
			elem.html(scope.value_html);
		}
	}
});
$app.directive('uppercase', function() {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var uppercase = function(inputValue) {
           uppercase = inputValue.toUpperCase();
           uppercase = uppercase.replace(new RegExp(/[~{}'~:;^`'´".,?ª!@#¨&]/g),"");
           uppercase = uppercase.replace(new RegExp(/[ÁÃÂÀÂ]/g),"A");
           uppercase = uppercase.replace(new RegExp(/[ÍÌÎ]/g),"I");
           uppercase = uppercase.replace(new RegExp(/[ÉÈÊ]/g),"E")
           uppercase = uppercase.replace(new RegExp(/[ÒÓÕÔ]/g),"O") 
           uppercase = uppercase.replace(new RegExp(/[ÚÙÛ]/g),"U") 

           if(uppercase !== inputValue) {
              modelCtrl.$setViewValue(uppercase);
              modelCtrl.$render();
            }         
            return uppercase;
         }
         modelCtrl.$parsers.push(uppercase);
         uppercase(scope[attrs.ngModel]); 
     }
};
});
$app.directive('lowercase', function() {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var lowercase = function(inputValue) {
           lowercase = inputValue.toLowerCase();
           lowercase = lowercase.replace(new RegExp(/[$'~:;^`'´".,?(){}ª!@#¨&_]/g),"");
           lowercase = lowercase.replace(new RegExp(/[áãâà]/g),"a");
           lowercase = lowercase.replace(new RegExp(/[íìî]/g),"i");
           lowercase = lowercase.replace(new RegExp(/[éèê]/g),"e")
           lowercase = lowercase.replace(new RegExp(/[òóôõ]/g),"O") 
           lowercase = lowercase.replace(new RegExp(/[úùû]/g),"u") 

           if(lowercase !== inputValue) {
              modelCtrl.$setViewValue(lowercase);
              modelCtrl.$render();
            }         
            return lowercase;
         }
         modelCtrl.$parsers.push(lowercase);
         lowercase(scope[attrs.ngModel]); 
     }
};
});
$app.directive("ngHtmlWithScope",function($compile){
  return{
    restrict: 'A',
    scope:{
      html: "@ngHtmlWithScope"
    },
    //controller: 'MenuItensController',
    link: function(scope,element,attrs,model){
  
      scope.$watch('html',function(){
        var el = angular.element(scope.html);
        var compiled = $compile(el)(scope);
        element.html(compiled);
      });
    }
  }
});