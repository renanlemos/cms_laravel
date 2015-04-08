$app.controller('HomeController',function($scope,$http,$window,$location,$resource,AuthService){
	
	$scope.title = "Home";
	
	init = function(){
		AuthService.checkView("home"); 
	} 
	init();
});	    	
