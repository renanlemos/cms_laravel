$app.controller("AuthController",function($scope,$rootScope,$resource,CSRF_TOKEN,$timeout,AuthService,$location){

	$scope.title = "Login";
    $scope.loaderLogin = false;
    $scope.displayRespLogin = false;
    $scope.user = {nome_usuario:"",senha:""};

	$scope.login = function(){
		$scope.loaderLogin = true;
		var user = $resource('/admin/auth/login',{_token:CSRF_TOKEN},{post:{method:"POST"}});

		user.post($scope.user,function(response){
	
            if(response.status == 0){
            	$scope.loaderLogin = false;
            	readErrors(response.data);
            }else{
            	var user = response.data;
            	AuthService.setLogin(user);
              	AuthService.setPermissoes(user[0].permissoes);
            	$location.path("/admin");
            }
        },function(response){
			$scope.respLogin = "Erro no servidor.";
			$scope.loaderLogin = false;
			$scope.displayRespLogin = true;
		});
	}
	$scope.logout = function(){
		var user = $resource('/admin/auth/logout',{_token:CSRF_TOKEN},{post:{method:"POST"}});
		$scope.loaderLogout = true;

		user.post(function(response){
			
			$(".content-right").attr("style","");
			$(".page-content").html("");
    		$rootScope.loginUser = false;
			$rootScope.currentLink = "/admin/login";	

			$timeout(function(){
				$location.path('/admin/login');
			},500);
			
			$scope.loaderLogout = false;
		},function(response){
			alert("Erro no Servidor.");
			$scope.loaderLogout = false;
		});
	}
	readErrors = function(messages){
		var data = messages;
		$scope.respLogin = "";
		angular.forEach(data,function(value,key){
			$scope.respLogin += value+"<br>"; 
			if(value.length > 1){
				angular.forEach(value,function(value,key){
					$scope.respLogin += value+"<br>"; 
				});	
			}
		});
		$timeout(function(){
			$scope.displayRespLogin = true;
		},500);
	}
});