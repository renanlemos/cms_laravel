$app.controller('SiteConfigController',function($scope,$resource,CSRF_TOKEN,AuthService){

	$scope.title = "Configuração Global";

	$scope.save = function(){
		if(AuthService.checkUpdate("configuracao-global",true)){
            $scope.loaderForm = true;

			var request= $resource("/admin/site-configs",{_token:CSRF_TOKEN},{
        		update: {method:"PUT"}
        	});

        	$scope.loaderForm = true;
        	request.update($scope.dataItem,function(response){
                switch(response.status){
                    case 0:
                        return displayErrors(response.data);
                    break;
                    case 1:
                        alert(response.data);
                        $scope.loaderForm = false;
                    break;
                    case 2:
                        alert(response.data);
                        $scope.loaderForm = false;
                    break;
                }
        
        		
        	},function(response){
        		$scope.loaderForm = false;
        	});
		}
	}
    displayMessagesArray = function(data){
        var messages = "";

        angular.forEach(data,function(value,key){
            messages += value+"\n";
        });
        alert(messages);
    }
    displayErrors = function(errors){
        var messages = "";

        angular.forEach(errors,function(value,key){
            if(value.length > 1){
                angular.forEach(value,function(value,key){
                  messages += value+"\n";
                });    
            }else{
                messages += value+"\n";
            }
            
        });
        alert(messages);
        $scope.loaderForm = false;
    }
	optionsCombo = function(){
		$scope.comboSeguranca = {
			filter: 'contains',
            dataTextField: "text",
            dataValueField: "value",
            dataBind: false,
            dataSource:{
                data: [{text: "SSL",value:1},{text: "TSL",value:2}]
            }
		}
	}
	getConfig = function(){
		var request = $resource('/admin/site-configs/get');

		request.get(function(response){
			$scope.dataItem = response;
            $scope.dataItem.parametros = angular.fromJson($scope.dataItem.parametros);
		})
	}
	init = function(){
		AuthService.checkView("configuracao-global"); 
		optionsCombo();

		getConfig();
	}
	init();
});