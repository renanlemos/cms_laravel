$app.controller('ModuloClimaTempoController',function($timeout,$scope,$rootScope,$resource,AuthService,ListDataService,CSRF_TOKEN){

	$scope.title = "Módulo Clima Tempo";
    $scope.editorDescricao = false;
    var comboPosicaoGrid = "";

    $scope.window = {
    	new: function(){

            $scope.dataItem = {titulo:"",apelido:"",tipo:"clima-tempo",modulo_posicao_id:"",publicado:true,mostrar_titulo:0,tag_titulo:"h1",conteudo:"",parametros:{latitude:"",longitude:"",template:"",cidade:"",class:"",id:""},ordem:""};
            $scope.mostrar_titulo = "";
            $scope.formView = "new";
    		$scope.formAction = "create()";
    	    $scope.modal.setOptions({
    	    	title: "Adicionar Módulo"
            });
            $scope.modal.open().center();

            
    	},
    	edit: function(dataItem){

    		$scope.formView = "edit";
    		$scope.formAction = "update()";
    		 $scope.modal.setOptions({
    	    	title: "Editar Módulo: "+dataItem.id
            });
    		$scope.modal.open().center();
            $scope.dataItem = dataItem;
    
            $scope.dataItem.parametros = angular.fromJson(dataItem.parametros);
            if(dataItem.mostrar_titulo == true){$scope.dataItem.mostrar_titulo =1;}
            if(dataItem.mostrar_titulo == false){$scope.dataItem.mostrar_titulo =0;}
    	},
        ordem: function(dataItem){
            $scope.dataItem = dataItem;
            $scope.modal_ordem.open().center();
        },
    	close: function(){
    		$scope.modal.close();
    	},
        close_ordem: function(){
            $scope.modal_ordem.close();
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

        if(AuthService.checkCreate("modulo-clima-tempo",true) && AuthService.checkCreate("modulos",true)){
          	var request = $resource("/admin/modulos",{_token:CSRF_TOKEN});
        
        	$scope.loaderForm = true;''
        	request.save($scope.dataItem,function(response){
                switch(response.status){
                    case 0:
                        return displayErrors(response.data);
                    break;
                    case 1:
                        alert(response.data);
                        $scope.dataItem = {titulo:"",apelido:"",tipo:"clima-tempo",modulo_posicao_id:"",publicado:true,mostrar_titulo:0,tag_titulo:"h1",conteudo:"",parametros:{latitude:"",longitude:"",template:"",cidade:"",class:"",id:""},ordem:""};
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

        if(AuthService.checkUpdate("modulo-clima-tempo",true) && AuthService.checkUpdate("modulos",true)){
        	var request= $resource("/admin/modulos",{_token:CSRF_TOKEN},{
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
        
        if(AuthService.checkDelete("modulo-clima-tempo",true) && AuthService.checkDelete("modulos",true)){
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
            	var request= $resource("/admin/modulos");

            	$scope.loaderForm = true;
            	request.delete({id:id,ids:[ids],type:type,_token:CSRF_TOKEN},function(response){
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
		      read: '/admin/modulos/grid?tipo=clima-tempo'
		    },
		    serpageSize: 10,
		    serverPaging: true, 
		    serverFiltering: true,
            serverSorting: true,    
		    schema:{ 
		      data:function(response){
                comboPosicaoGrid = response.posicaos;
                return response.data;
              },
		      total: function(response){
                return response.total;
              },	
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
		toolbar:[{template:"<button class='k-button' k-options='optionsTooltip' kendo-tooltip title='Adicionar' ng-click='window.new()'><span class='k-icon k-i-plus' style='padding:0 2px 0 0;'></span></button>"},
          		{template:"<button class='k-button' k-options='optionsTooltip' kendo-tooltip title='Excluir Todos os Selecionados' ng-click='delete(\"multiple\")'><span class='k-icon k-i-close' style='padding:0 2px 0 0;'></span></button>"}
        ], 	        
	    columns:[
	    {title: "<input type='checkbox' ng-model='checkAll' />",width:"30px",template:"<input type='checkbox' class='itemGrid' ng-model='itensGrid' ng-value='dataItem.id' ng-checked='checkAll'/>",filterable:false,sortable:false},
	    {field: "id", title: "Id",type:"number",width:"50px"},
        {field: "titulo", title: "Titulo",type:"string"},
        {field: "apelido", title: "Apelido",type:"string"},
        {field: "ordem", title: "Ordem",type:"number",width:"100px"},
        {field: "modulo_posicao_id",template:function(dataItem){return ListDataService.getForeignText(comboPosicaoGrid,dataItem.modulo_posicao_id);},title: "Posição",type:"number",filterable:{ui:posicaoFilter}},
        {command: [
	       {template: "<button class=\'k-button\' k-options='optionsTooltip' kendo-tooltip title='Editar' ng-click=\'window.edit(dataItem)\'><span class='k-icon k-i-pencil' style='padding:0 2px 0 0;'></span></button>"},
	       {template: "<button  class=\'k-button\' k-options='optionsTooltip' kendo-tooltip title='Excluir' ng-click=\'delete(dataItem)\'><span class='k-icon k-i-close' style='padding:0 2px 0 0;'></span></button>"},
            {template:"<button class='k-button' k-options='optionsTooltip' kendo-tooltip title='Ordenação' ng-click='window.ordem(dataItem)'><span class='icon-menu' style='padding:0 2px 0 0;'></span></button>"}
           ]}] 
    	}
        function posicaoFilter(element){
            element.kendoDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                dataSource:{data:angular.fromJson(comboPosicaoGrid)},
                optionLabel: "--Select Value--"
            });
        }
    }
    optionsModal = function(){
    	$scope.conf_modal = {
			title: 'Módulo Html',
			width: '1000',
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
        $scope.conf_modal_ordem = {
            title: 'Ordenação',
            width: '500',
            height: '500',
            actions: ["Minimize", "Maximize"],
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
            },
            open: function(){
                $scope.openOrdem = true;
            },
            close: function(){
                $scope.openOrdem = false;
            }

        }
    }
    optionsCombo = function(){
        
        $scope.comboPosicao = {
            filter: 'contains',
            dataTextField: "descricao",
            dataValueField: "id",
            dataSource:{
                transport: {
                    read: {
                        url: "/admin/modulo-posicaos/combo",
                        async: false
                    }
                }
            },
            change: function(e){
                var data = this.dataSource.data();
                var input = this.value();
                var search = false;

                angular.forEach(data,function(v,key){
                    if(v.id == input){
                        search = true;
                    }
                });
                if(search == false){
                    this.value("");
                }
            }
        }
        $scope.comboMostrarTitulo = {
            filter: 'contains',
            dataTextField: "text",
            dataValueField: "value",
            autoBind: false,
            dataSource:{
                data: [{text:"Não",value:false},{text:"Sim",value:true}]
            }
        }
        $scope.comboTagTitulo = {
            filter: 'contains',
            dataTextField: "v",
            dataValueField: "v",
            autoBind: false,
            dataSource:{
                data: [{v:"h1"},{v:"h2"},{v:"h3"},{v:"h4"},{v:"h5"},{v:"h6"}]
            }
        }
        var pasta = "/assets/templates/includes/templates/modulos/clima-tempo/";
        $scope.comboTemplate = {
            filter: 'contains',
            dataTextField: "text",
            dataValueField: "value",
            dataSource:{
                transport: {
                    read: {
                        url: "/admin/files/read_dir?pasta="+pasta,
                        async: false
                    }
                }
            },
            change: function(e){
                var data = this.dataSource.data();
                var input = this.value();
                var search = false;

                angular.forEach(data,function(v,key){
                    if(v.value == input){
                        search = true;
                    }
                });
                if(search == false){
                    this.value("");
                }
            }
        }
    }
    $scope.updateOrdemModulo = function(){
       var request = $resource('/admin/modulos/updateModulosOrdem',{_token:CSRF_TOKEN},{
            update: {method:"PUT"}
        });
       if($rootScope.itensOrdemModuloSortable == ""){
            $(".status-ordem-modulo").removeClass('primary bt-danger').addClass('btn-success').html("<span>Ordem atualizada</span>");
       }else{
            $(".status-ordem-modulo").removeClass('btn-success bt-danger').addClass('btn-primary').html("<span>Alterando Ordem</span>");
            request.update({itens:$rootScope.itensOrdemModuloSortable},function(response){
                $(".status-ordem-modulo").removeClass('primary bt-danger').addClass('btn-success').html("<span>Ordem atualizada</span>");
                $scope.grid.dataSource.read();
            },function(response){
                alert('error');
            })
       }
    }
    $scope.refreshComboPosicao = function(){
        var comboPosicao = $("#comboPosicao").data("kendoComboBox"); 
        comboPosicao.dataSource.read();
    }
    $scope.loaderEditorDescricao = function(){
        $timeout(function(){
            $scope.editorDescricao= true;
        },1000);
    }
	init = function(){
		AuthService.checkView("modulos");
		AuthService.checkView("modulo-clima-tempo");

        $scope.openOrdem = false;
        $rootScope.itensOrdemModuloSortable = "";
        optionsCombo();
        optionsModal();
        optionsGrid();
        
	}
	init();
});