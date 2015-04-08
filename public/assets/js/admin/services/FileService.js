$app.service('FileService',function($rootScope,$http,CSRF_TOKEN,$timeout){

	var files = [];
	$rootScope.filesService = [];
	$rootScope.fileRespService = "";
	$rootScope.fileImagesService = [];
	var path = "";

	this.setPath = function(path){
		this.path = path;
	}
	this.getPath = function(path){
		return this.path;
	}
	this.getFiles = function(){
		return files;
	}
	this.setFile = function(file){
		valid(file);
		if($rootScope.fileRespService.length == 0){
			$rootScope.filesService.push(file);
			$rootScope.$apply();
		}
			
	}
	this.uploadFiles = function(options){
		var uploaded = false;
		if($rootScope.filesService.length > 0){
        	$rootScope.fileRespService = "- Enviando arquivos...";
            var fd = new FormData();
           	
           	angular.forEach($rootScope.filesService,function(value,key){
           		fd.append('file-'+key,$rootScope.filesService[key]);
           	})
          	fd.append("qnt_files",$rootScope.filesService.length);
            fd.append("path",this.path);
            fd.append("_token",CSRF_TOKEN);
           
            $http.post("/admin/files/uploads",fd,{
                withCredentials: true,
                headers: {'Content-Type': undefined },
                transformRequest: angular.identity
            }).success(function(response){
            	$rootScope.fileRespService = "";
                angular.forEach(response,function(v,k){
                	$rootScope.fileRespService += v.file+": "+v.data+"<br>";
                	if(v.status == 1){
                		uploaded = true;
                		$rootScope.filesService.splice($rootScope.filesService[v.index],1);
                	}
                });
                if(uploaded == true && options.refreshCombo == true){
                	var combo = $(options.id).data("kendoComboBox");
        			combo.dataSource.read();
        			$rootScope.fileImagesService = combo.dataSource.data();
                }
                
            }).error(function(){
                $rootScope.fileRespService = "- Ocorreu um erro no Servidor";
            });
        }else{
            $rootScope.fileRespService = "- Nenhum arquivo selecionado";
        }
	}
	this.deleteFile = function(index){
		$rootScope.filesService.splice($rootScope.filesService[index],1);
		$rootScope.$apply();
	}
	valid = function(file){
		$rootScope.fileRespService = "";

		if(file.type != 'image/png' && file.type != 'image/jpeg'){
			$rootScope.fileRespService = "- A imagem deve ser PNG ou JPG."
		}else if(contemFile(file)){
			$rootScope.fileRespService = "- Esse nome de arquivo já foi selecionado."
		}
		$rootScope.$apply();
	}
	contemFile = function(file){
		var search = false;

		if(search == false && $rootScope.filesService.length > 0){
			angular.forEach($rootScope.filesService,function(v,k){
				if(file.name == v.name){
					search = true;
				}
			});
		}	
		return search;
	}
});