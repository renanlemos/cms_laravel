$app.controller('ModuloBannerSliderController',function($timeout,$scope,$rootScope,$resource,AuthService,ListDataService,CSRF_TOKEN){

	$scope.title = "Módulo Banner Slider";
    $scope.editorDescricao = false;
    var comboPosicaoGrid = "";

    $scope.window = {
    	new: function(){
            var comboBanner = $('#comboBanner').data('kendoComboBox');

            $scope.dataItem = {titulo:"",apelido:"",tipo:"banner-slider",modulo_posicao_id:"",publicado:true,mostrar_titulo:0,tag_titulo:"h1",conteudo:"",parametros:{banner_id:"",efeito:"fade",timeout:4000,speed:1000,pause:0,prev:0,next:0,paginacao:0,class:"",id:""},ordem:""};
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

        if(AuthService.checkCreate("modulo-banner-slider",true) && AuthService.checkCreate("modulos",true)){
          	var request = $resource("/admin/modulos",{_token:CSRF_TOKEN});
        
        	$scope.loaderForm = true;''
        	request.save($scope.dataItem,function(response){
                switch(response.status){
                    case 0:
                        return displayErrors(response.data);
                    break;
                    case 1:
                        alert(response.data);
                        $scope.dataItem = {titulo:"",apelido:"",tipo:"banner-slider",modulo_posicao_id:"",publicado:true,mostrar_titulo:0,tag_titulo:"h1",conteudo:"",parametros:{banner_id:"",efeito:"fade",timeout:4000,speed:1000,pause:0,prev:0,next:0,paginacao:0,class:"",id:""},ordem:""};
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

        if(AuthService.checkUpdate("modulo-banner-slider",true) && AuthService.checkUpdate("modulos",true)){
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
        
        if(AuthService.checkDelete("modulo-banner-slider",true) && AuthService.checkDelete("modulos",true)){
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
		      read: '/admin/modulos/grid?tipo=banner-slider'
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
        $scope.comboBanner = {
            filter: 'contains',
            dataTextField: "descricao",
            dataValueField: "id",
            dataSource:{
                transport: {
                    read: {
                        url: "/admin/componentes/banner-sliders/combo",
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
        $scope.optionsEfeito = {
            filter: 'contains',
            dataTextField: "v",
            dataValueField: "v",
            autoBind: false,
            dataSource:{
                data: [{v:"blindX"},{v:"blindY"},{v:"blindZ"},{v:"cover"},{v:"curtainX"},{v:"curtainY"},{v:"fade"},{v:"fadeZoom"},{v:"growX"},{v:"growY"},{v:"none"},{v:"scrollUp"},{v:"scrollDown"},{v:"scrollLeft"},{v:"scrollRight"},{v:"scrollHorz"},{v:"scrollVert"},{v:"shuffle"},{v:"slideX"},{v:"slideY"},{v:"toss"},{v:"turnUp"},{v:"turnDown"},{v:"turnLeft"},{v:"turnRight"},{v:"uncover"},{v:"wipe"},{v:"zoom"}]
            }
        }
        $scope.optionsTimeout = {
            filter: 'contains',
            dataTextField: "t",
            dataValueField: "v",
            autoBind: false,
            dataSource:{
                data: [{v:1000,t:"1 Segundo"},{v:2000,t:"2 Segundos"},{v:3000,t:"3 Segundos"},{v:4000,t:"4 Segundos"},{v:5000,t:"5 Segundos"},{v:6000,t:"6 Segundos"},{v:7000,t:"7 Segundos"},{v:8000,t:"8 Segundos"},{v:9000,t:"9 Segundos"},{v:10000,t:"10 Segundos"}]
            }
        }
        $scope.optionsSpeed = {
            filter: 'contains',
            dataTextField: "t",
            dataValueField: "v",
            autoBind: false,
            dataSource:{
                data: [{v:1000,t:"1 Segundo"},{v:2000,t:"2 Segundos"},{v:3000,t:"3 Segundos"},{v:4000,t:"4 Segundos"},{v:5000,t:"5 Segundos"},{v:6000,t:"6 Segundos"},{v:7000,t:"7 Segundos"},{v:8000,t:"8 Segundos"},{v:9000,t:"9 Segundos"},{v:10000,t:"10 Segundos"}]
            }
        }
        $scope.optionsPause = {
            filter: 'contains',
            dataTextField: "t",
            dataValueField: "v",
            autoBind: false,
            dataSource:{
                data: [{v:1,t:"Sim"},{v:0,t:"Não"}]
            }
        }
        $scope.optionsPrev = {
            filter: 'contains',
            dataTextField: "t",
            dataValueField: "v",
            autoBind: false,
            dataSource:{
                data: [{v:1,t:"Sim"},{v:0,t:"Não"}]
            }
        }
        $scope.optionsNext = {
            filter: 'contains',
            dataTextField: "t",
            dataValueField: "v",
            autoBind: false,
            dataSource:{
                data: [{v:1,t:"Sim"},{v:0,t:"Não"}]
            }
        }
        $scope.optionsPaginacao = {
            filter: 'contains',
            dataTextField: "t",
            dataValueField: "v",
            autoBind: false,
            dataSource:{
                data: [{v:1,t:"Sim"},{v:0,t:"Não"}]
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
		AuthService.checkView("modulo-banner-slider");

        $scope.openOrdem = false;
        $rootScope.itensOrdemModuloSortable = "";
        optionsCombo();
        optionsModal();
        optionsGrid();
        
	}
	init();
});