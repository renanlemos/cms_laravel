$app.controller('UsuariosController',function($scope,$http,$window,$location,$resource,MenuService,AuthService,CSRF_TOKEN){
	
	$scope.title = "Usuários";
	var permissoes = [];
    var permissoesOut = []; 
	var contemInPermissoesResp = "";

    $scope.window = {
    	new: function(){
            $scope.dataItem = {nome:"",nome_usuario:"",email:"",senha:"",ativo:true,permissoes:""};
            $scope.dataItem.permissoes = getDefaultPermissoes();
            $scope.formView = "new";
    		$scope.formAction = "create()";
    	    $scope.modal.setOptions({
    	    	title: "Adicionar Usuário"
            });
            $scope.modal.open().center();
    	},
    	edit: function(dataItem){

            dataItem.senha = "";
    		$scope.formView = "edit";
    		$scope.formAction = "update()";
    		 $scope.modal.setOptions({
    	    	title: "Editar Úsuario: "+dataItem.id
            });
    		$scope.modal.open().center();
            $scope.dataItem = dataItem;
            $scope.dataItem.permissoes = verificaChangePermissoes(dataItem.permissoes);
    	},
    	close: function(){
    		$scope.modal.close();
    	} 	
    }
    $scope.executeAction = function(action){
    	switch(action){
    		case "create()":
    			create();
    		break;
    		case "update()":
    		    update();
    		break;
    	}
    }
    create = function(){

        if(AuthService.checkCreate("usuarios",true)){
          	var user = $resource("/admin/usuarios",{_token:CSRF_TOKEN});
        
        	$scope.loaderForm = true;
        	user.save($scope.dataItem,function(response){
                switch(response.status){
                    case 0:
                        return displayErrors(response.data);
                    break;
                    case 1:
                        alert(response.data);
                        $scope.dataItem = {nome:"",nome_usuario:"",email:"",senha:"",ativo:true,tipo:0,permissoes:getDefaultPermissoes(),cliente_id:""};
                        $scope.grid.dataSource.read();
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
    update = function(){

        if(AuthService.checkUpdate("usuarios",true)){
        	var user = $resource("/admin/usuarios",{_token:CSRF_TOKEN},{
        		update: {method:"PUT"}
        	});

        	$scope.loaderForm = true;
        	user.update($scope.dataItem,function(response){
                switch(response.status){
                    case 0:
                        return displayErrors(response.data);
                    break;
                    case 1:
                        alert(response.data);
                        $scope.grid.dataSource.read();
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
    $scope.delete = function(dataItem){
        
        if(AuthService.checkDelete("usuarios",true)){
            if(confirm("Deseja deletar esse(s) registro(s)?")){
            	var ids = [];
            	var type = "single";
            	var id = dataItem.id;
            	if(dataItem == "multiple"){
            	
            		if($(".itemGrid:checked").length == 0){alert("Nenhum item marcado.");return false;}
            		
            		$(".itemGrid:checked").map(function(key,value){
            	    	ids.push(value.value);
            		});	
            		type = "multiple";
            		id = ids[0];
            	}
            	var user = $resource("/admin/usuarios");

            	$scope.loaderForm = true;
            	user.delete({id:id,ids:[ids],type:type,_token:CSRF_TOKEN},function(response){
                    switch(response.status){
                        case 2:
                            alert(response.data);
                            $scope.loaderForm = false;
                        break;
                        default:
                            if(type == "multiple"){
                                displayMessagesArray(response.data);
                            }else{
                                alert(response.data);
                            }
                            $scope.grid.dataSource.read();
                            $scope.loaderForm = false;
                        break;
                    }
            		
            	},function(response){
                    alert("Error: "+response.data);
            		$scope.loaderForm = false;
            	});
            }
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
    optionsGrid = function(){
        $scope.optionsTooltip = {
            position: 'top'
        }

        return $scope.optionsGrid = {
    		dataSource:{ 
		    type: "json",
		    transport:{ 
		      read: '/admin/usuarios/grid'
		    },
		    serpageSize: 10,
		    serverPaging: true, 
		    serverFiltering: true,
            serverSorting: true,    
		    schema:{ 
		      data:"data",
		      total: "total",	
	          model:{ 
	            id: "id",
	            fields:{ 
	              id: {type: "number"}
	              
	            }
	          }
	        }
        },
        sortable: true,
		reorderable: true,
	    resizable:true,
	    mobile:true,
	    selectable:true, 
		groupable: {messages: {empty: "Arraste uma coluna para agrupar"}},
		pageable:{
		  refresh: true,
		  pageSize: 10,
	      pageSizes: true, 
		    messages:{ 
		      display: "{0} - {1} de {2} itens",
		      empty: "Não Existem Itens para mostrar",
			  page: "Página",
			  of: "de {0}",
			  itemsPerPage: "itens por Página",
			  first: "Primeira Página",
			  previous: "Página Anterior",
			  next: "Próxima Página",
			  last: "Última Página",
			  refresh: "Atualizar",
			}
	    },
	    filterable:{ 
	      extra: true,
	      messages:{ 
	        clear: "Limpar",
	        filter: "buscar",
	        info: "Registros que:",
	        and: "e",
	        or: "ou",
	        selectValue: "Selecione",
	       }, 
	      operators:{ 
	        string:{ 
	          startswith: "Começa com",
	          endswith: "Termina com",
	          eq: "Seja igual a",
	          neq: "Não é igual a",
	          contains: "Contém",
	          doesnotcontain:"Não contém",
	        },   	
	        date:{ 
	          eq: "Igual a",
	          gte: "Maior ou igual a",
    	      gt: "Maior que",
			  lte: "Menor ou igual a",
			  lt: "Menor que"
			},   
			number: {
	          eq: "Igual a",
	          gte: "Maior ou igual a",
			  gt: "Maior que",
			  lte: "Menor ou igual a",
			  lt: "Menor que"
	        },
	        enums: {
			  eq: "Seja igual a",
	          neq: "Não é igual a"
      		}
		  }
		},
		toolbar:[{template:"<button class='k-button' k-options='optionsTooltip' kendo-tooltip title='Adicionar' ng-disabled='access_create == false' ng-click='window.new()'><span class='k-icon k-i-plus' style='padding:0 2px 0 0;'></span></button>"},
          		{template:"<button class='k-button' k-options='optionsTooltip' kendo-tooltip title='Excluir Todos os Selecionados' ng-click='delete(\"multiple\")'><span class='k-icon k-i-close' style='padding:0 2px 0 0;'></span></button>"}
        ], 	        
	    columns:[
	    {title: "<input type='checkbox' ng-model='checkAll' />",width:"30px",template:"<input type='checkbox' class='itemGrid' ng-model='itensGrid' ng-value='dataItem.id' ng-checked='checkAll'/>",filterable:false,sortable:false},
	    {field: "id", title: "Id",type:"number",width:"50px"},
	    {field: "nome", title: "Nome",type:"text"},
        {field: "nome_usuario", title: "Usuário",type:"text"},
	    {field: "email", title: "Email",type:"text"},
        {command: [
	       {template: "<button class=\'k-button\' k-options='optionsTooltip' kendo-tooltip title='Editar' ng-disabled='access_update == false' ng-click=\'window.edit(dataItem)\'><span class='k-icon k-i-pencil' style='padding:0 2px 0 0;'></span></button>"},
	       {template: "<button  class=\'k-button\' k-options='optionsTooltip' kendo-tooltip title='Excluir' ng-disabled='access_destroy == false' ng-click=\'delete(dataItem)\'><span class='k-icon k-i-close' style='padding:0 2px 0 0;'></span></button>"}
	    ]}] 
    	}
    }
    optionsModal = function(){
    	$scope.conf_modal = {
			title: 'Usuários',
			width: '800',
			height: '500',
			actions: ["Minimize", "Maximize", "Close"],
			visible: false,
			modal: true,
			resizable: true,
			animation: {
			    close: {
			      duration: 200
			    },
			    open:{
			    	duration: 200
			    }
  			}
		}
    }
    verificaChangePermissoes = function(permissoes){
        var menu = MenuService.getMenu();
        var permissoes = angular.fromJson(permissoes);
          
        angular.forEach(menu,function(value,key){
            //alert(value.itemParent);
            if(value.itemParent == true){
                readChildrensChangePermissoes(value,permissoes);
            }else{
                var data = contemInPermissoes(value.apelido,permissoes);
                if(data.resp){
                    var item = data.item;
                    permissoesOut.push(item);
                }else{
                    var item = {display:value.display,nome:value.apelido,view:false,delete:false,create:false,update:false};
                    permissoesOut.push(item);
                }
            }
            
        });
        return permissoesOut;

    } 
    readChildrensChangePermissoes = function(value,permissoes){
        //alert(value.apelido);
        var data = contemInPermissoes(value.apelido,permissoes);
        if(data.resp){
            var item = data.item;
            permissoesOut.push(item);
        }else{
            var item = {display:value.display,nome:value.apelido,view:false,delete:false,create:false,update:false};
            permissoesOut.push(item);
        }
        angular.forEach(value.itens,function(value,key){
            if(value.itemParent == true){
                readChildrensChangePermissoes(value,permissoes);
            }else{
                var data = contemInPermissoes(value.apelido,permissoes);
                if(data.resp){
                    var item = data.item;
                    permissoesOut.push(item);
                }else{
                    var item = {display:value.display,nome:value.apelido,view:false,delete:false,create:false,update:false};
                    permissoesOut.push(item);
                }
            }    
        });
        
    }
    contemInPermissoes = function(apelido,permissoes){
      
        contemInPermissoesResp = {resp:false,item:[]};
        angular.forEach(permissoes,function(value,key){
            if(contemInPermissoesResp.resp  == false){
                if(apelido == value.nome){
                    contemInPermissoesResp.resp = true;
                    contemInPermissoesResp.item = value;
                } 
            }        
        });
           
        return contemInPermissoesResp;
    }
    readChildrensContemInPermissoes = function(){
        var item = {display:value.display,nome:value.apelido,view:true,delete:true,create:true,update:true};
        permissoes.push(item);

        angular.forEach(value.itens,function(value,key){
            if(value.itemParent == true){
                readChildrens(value);
            }else{
                var item = {display:value.display,nome:value.apelido,view:true,delete:true,create:true,update:true};
                permissoes.push(item);
            }    
        });
    }
    getDefaultPermissoes = function(){
        var menu = MenuService.getMenu();
    
        angular.forEach(menu,function(value,key){
            
            if(value.itemParent == true){
                readChildrens(value);
            }else{
                var item = {display:value.display,nome:value.apelido,view:true,delete:true,create:true,update:true};
                permissoes.push(item);
            }
          
        });
        return permissoes;
    }
    readChildrens = function(value){

        var item = {display:value.display,nome:value.apelido,view:true,delete:true,create:true,update:true};
        permissoes.push(item);

        angular.forEach(value.itens,function(value,key){
            if(value.itemParent == true){
                readChildrens(value);
            }else{
                var item = {display:value.display,nome:value.apelido,view:true,delete:true,create:true,update:true};
                permissoes.push(item);
            }    
        });
        
    }
	init = function(){
       AuthService.checkView("usuarios"); 
       
	   optionsGrid();
	   optionsModal();
    
    }
	init();

});	    	
