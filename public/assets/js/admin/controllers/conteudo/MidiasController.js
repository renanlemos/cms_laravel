$app.controller('MidiasController',function($scope,$http,$window,$location,$resource,AuthService){
	
	$scope.title = "Mídias";
	
	init = function(){
		AuthService.checkView("midias"); 
	} 
	init();
});	    	
