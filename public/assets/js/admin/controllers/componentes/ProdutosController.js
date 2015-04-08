$app.controller('ProdutosController',function($timeout,$scope,$rootScope,$resource,AuthService,ListDataService,CSRF_TOKEN){

	$scope.title = "Produtos";
    $scope.content = "produtos";
    $scope.editorDescricao = false;
    $scope.openOrdem = false;

    $scope.window = {
    	new: function(){
            $scope.openModal = true;
            $scope.dataItem = {titulo:"",apelido:"",publicado:true,destaque:false,valor:0.00,mini_descricao:"",descricao:"",meta_title:"",meta_description:"",meta_keywords:"",meta_author:"",produto_categoria_id:"",parametros:{class:"",id:""}};
            $scope.formView = "new";
    		$scope.formAction = "create()";
    	    $scope.modal.setOptions({
    	    	title: "Produto"
            });
            $scope.modal.open().center();
            $scope.openModal = true;
        },
    	edit: function(dataItem){

    		$scope.formView = "edit";
    		$scope.formAction = "update()";
    		 $scope.modal.setOptions({
    	    	title: "Editar Produto: "+dataItem.id
            });
            $scope.dataItem = dataItem;
            $scope.dataItem.parametros = angular.fromJson(dataItem.parametros);
    		$scope.modal.open().center();
        },
       	close: function(){
    		$scope.modal.close();
    	},
        caracteristica: function(dataItem){
            $scope.dataItem = dataItem;
            $scope.modal_caracteristica.open().center();
        },
        close_caracteristica: function(){
            $scope.modal_caracteristica.close();
        },
        relacionados: function(dataItem){
            $scope.dataItem = dataItem;
            $scope.modal_relacionados.open().center();
        },
        close_relacionados: function(){
           $scope.modal_relacionados.close(); 
        },
        ordem: function(){
            $scope.openOrdem = true;
            $scope.modal_ordem.open().center();
        },
        close_ordem: function(){
            $scope.openOrdem = false;
            $scope.modal_ordem.close();
        }
    }
    $scope.executeAction = function(action){
    	switch(action){
    		case "create()":
                createProduto();
    		break;
    		case "update()":
    		    updateProduto();
    		break;
    	}
    }
    createProduto = function(){
        if(AuthService.checkCreate("componente-produtos",true) && AuthService.checkCreate("componente-produto-produtos",true) && AuthService.checkCreate("componentes",true)){
          	var request = $resource("/admin/componentes/produtos",{_token:CSRF_TOKEN});
        
        	$scope.loaderForm = true;''
        	request.save($scope.dataItem,function(response){
                switch(response.status){
                    case 0:
                        $scope.loaderForm = false;
                        return displayErrors(response.data);
                    break;
                    case 1:
                        alert(response.data);
                        $scope.dataItem = {titulo:"",apelido:"",publicado:true,destaque:false,valor:0.00,mini_descricao:"",descricao:"",meta_title:"",meta_description:"",meta_keywords:"",meta_author:"",produto_categoria_id:"",parametros:{class:"",id:""}};
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
    updateProduto = function(){

        if(AuthService.checkUpdate("componente-produtos",true) && AuthService.checkUpdate("componente-produto-produtos",true) && AuthService.checkUpdate("componentes",true)){
        	var request= $resource("/admin/componentes/produtos",{_token:CSRF_TOKEN},{
        		update: {method:"PUT"}
        	});

        	$scope.loaderForm = true;
        	request.update($scope.dataItem,function(response){
                switch(response.status){
                    case 0:
                        $scope.loaderForm = false;
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
        
        if(AuthService.checkDelete("componente-produtos",true) && AuthService.checkDelete("componente-produto-produtos",true) && AuthService.checkDelete("componentes",true)){
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
            	var request= $resource("/admin/componentes/produtos");

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
    $scope.updateOrdem = function(){
        $(".status-ordem-modulo").addClass('btn-primary').html("<span>Alterando Ordem...</span>");
        var request = $resource('/admin/componentes/produtos/ordem',{_token:CSRF_TOKEN},{
            update:{method:"PUT"}
        }); 
         if(AuthService.checkCreate("componente-produto-produtos",true) && AuthService.checkUpdate("componente-produtos",true) && AuthService.checkUpdate("componentes",true)){
            if($rootScope.itensOrdemSortable == ""){
                $(".status-ordem-modulo").removeClass('primary bt-danger').addClass('btn-success').html("<span>Ordem atualizada</span>");
            }else{
                $(".status-ordem-modulo").removeClass('btn-success bt-danger').addClass('btn-primary').html("<span>Alterando Ordem</span>");
                request.update({itens:$rootScope.itensOrdemSortable},function(response){
                    $(".status-ordem-modulo").removeClass('primary bt-danger').addClass('btn-success').html("<span>Ordem atualizada</span>");
                    $scope.grid.dataSource.read();
                },function(response){
                    alert('error');
                })
            }
        }    
    }
    optionsGrid = function(){
        var comboCategoriaGrid = [];
        $scope.optionsTooltip = {
            position: 'top'
        }

        return $scope.optionsGrid = {
    		dataSource:{ 
		    type: "json",
		    transport:{ 
		      read: '/admin/componentes/produtos/grid'
		    },
		    serpageSize: 10,
		    serverPaging: true, 
		    serverFiltering: true,
            serverSorting: true,    
		    schema:{ 
		      data:function(response){
                comboCategoriaGrid = response.categorias;
                return response.data;
              },
		      total: function(response){
                return response.total;
              },	
	          model:{ 
	            id: "id",
	            fields:{ 
	              id: {type: "number"},
	              ordem: {type: "number"}
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
      		},
            boolean:{
              eq: "Seja igual a",
              neq: "Não é igual a" 
            }
		  }
		},
		toolbar:[{template:"<button class='k-button' k-options='optionsTooltip' kendo-tooltip title='Adicionar' ng-disabled='access_create == false' ng-click='window.new()'><span class='k-icon k-i-plus' style='padding:0 2px 0 0;'></span></button>"},
          		{template:"<button class='k-button' k-options='optionsTooltip' kendo-tooltip title='Excluir Todos os Selecionados' ng-click='delete(\"multiple\")'><span class='k-icon k-i-close' style='padding:0 2px 0 0;'></span></button>"},
                {template:"<button class='k-button' k-options='optionsTooltip' kendo-tooltip title='Ordenação' ng-click='window.ordem()'>Ordem</button>"}
        ], 	        
	    columns:[
	    {title: "<input type='checkbox' ng-model='checkAll' />",width:"30px",template:"<input type='checkbox' class='itemGrid' ng-model='itensGrid' ng-value='dataItem.id' ng-checked='checkAll'/>",filterable:false,sortable:false},
	    {field: "id", title: "Id",type:"number",width:"50px"},
        {field: "titulo", title: "Titulo",type:"string"},
        {field: "apelido", title: "Apelido",type:"string"},
        {field: "produto_categoria_id", title: "Categoria",width:'100px',type:"number",template:function(dataItem){return ListDataService.getForeignText(comboCategoriaGrid,dataItem.produto_categoria_id);},filterable:{ui:categoriaFilter,extra:false,operators:{string:{eq:"Seja igual a"}}}},
        {field: "publicado",width:'100px',title: "Publicado",template:"<publica-in-grid campo='publicado' status='dataItem.publicado' item='dataItem' grid='grid' url='/admin/componentes/produtos/updateStatus?campo=publicado' permissao='permissaoUpdate'></publica-in-grid>",type:"boolean",
            filterable:{
                extra: false,
                operators:{string:{
                    eq: "Seja igual a",
                    neq: "Não seja igual a"
                }},
                ui:publicadoFilter
            }
        },
        {field: "destaque",width:'100px',title:"Destaque",template:"<publica-in-grid campo='destaque' status='dataItem.destaque' item='dataItem' grid='grid' url='/admin/componentes/produtos/updateStatus?campo=destaque' permissao='permissaoUpdate'></publica-in-grid>",type:"boolean",
            filterable:{
                extra: false,
                operators:{string:{
                    eq: "Seja igual a",
                    neq: "Não seja igual a"
                }},
                ui:destaqueFilter
            }
        },
        {field: "ordem", title: "Ordem",type:"number",width:'80px',template:'<div class="text-center">{{dataItem.ordem}}</div>'},
        {command: [
	       {template: "<button class=\'k-button\' k-options='optionsTooltip' kendo-tooltip title='Editar' ng-click=\'window.edit(dataItem)\'><span class='k-icon k-i-pencil' style='padding:0 2px 0 0;'></span></button>"},
	       {template: "<button  class=\'k-button\' k-options='optionsTooltip' kendo-tooltip title='Excluir' ng-click=\'delete(dataItem)\'><span class='k-icon k-i-close' style='padding:0 2px 0 0;'></span></button>"},
           {template: "<button  class=\'k-button\' k-options='optionsTooltip' kendo-tooltip title='Imagens' ng-click=\'setContent(\"fotos\",dataItem)\'><span class='icon-image-2' style='padding:0 2px 0 0;'></span></button>"},
           {template: "<button  class=\'k-button\' k-options='optionsTooltip' kendo-tooltip title='Características' ng-click=\'setContent(\"caracteristicas\",dataItem)\'><span class='icon-book' style='padding:0 2px 0 0;'></span></button>"},
           {template: "<button  class=\'k-button\' k-options='optionsTooltip' kendo-tooltip title='Produtos Relacionados' ng-click=\'setContent(\"relacionados\",dataItem)\'><span class='icon-cabinet' style='padding:0 2px 0 0;'></span></button>"}]}] 
    	}
        function publicadoFilter(element){
            element.kendoDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                dataSource:{data:[{"text":"Publicado","value":true},{"text":"Despublicado","value":false}]},
                optionLabel: "--Select Value--"
            });
        }
        function destaqueFilter(element){
            element.kendoDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                dataSource:{data:[{"text":"Destaque","value":true},{"text":"Sem Destaque","value":false}]},
                optionLabel: "--Select Value--"
            });
        }
        function categoriaFilter(element){
            element.kendoDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                dataSource:{data:angular.fromJson(comboCategoriaGrid)},
                optionLabel: "--Select Value--"
            });
        }
    }
    optionsModal = function(){
    	$scope.conf_modal = {
			title: 'Categorias',
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
        $scope.conf_modal_caracteristica = {
            title: 'Características',
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
        $scope.conf_modal_relacionados = {
            title: 'Produtos Relacionados',
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
            title: 'Ordem Produtos',
            width: '500',
            height: '550',
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
            },
            close: function(){
                $scope.openOrdem = false;
            }
        }
    }
    optionsCombo = function(){
      
        $scope.comboCategoria = {
            filter: 'contains',
            dataTextField: "titulo",
            dataValueField: "id",
            dataSource:{
                transport: {
                    read: {
                        url: '/admin/componentes/produtos/produto-categorias/combo',
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
    }
    $scope.loaderEditorDescricao = function(){
        $timeout(function(){
            $scope.editorDescricao = true;
        },500);
    }
    $scope.setContent = function(content,dataItem){
        
        $scope.content = content;
        $scope.itemSelected = dataItem; 
        switch(content){
            case 'fotos':
                $scope.title = "Fotos: "+dataItem.titulo;  
            break;
            case 'caracteristicas':
                $scope.title = "Características: "+dataItem.titulo;  
            break;
            case 'relacionados':
                $scope.title = "Produtos Relacionados: "+dataItem.titulo;  
            break;
            default:
                $scope.title = "Produtos";
            break;
        }
    }
    optionsNumeric = function(){
        $scope.numericOptions = {
            min: 0,
            decimals:2,
            format: "n2"
        } 
    }
    init = function(){
		AuthService.checkView("componentes");
		AuthService.checkView("componente-produtos");
        AuthService.checkView("componente-produto-produtos");

        $scope.permissaoUpdate =  AuthService.checkUpdate("componente-produtos",false) == true && AuthService.checkUpdate("componente-produto-produtos",false) == true && AuthService.checkUpdate("componentes",false) == true ? true : false;

        optionsModal();
        optionsGrid();
        optionsNumeric();
        optionsCombo();
    }
	init();
});