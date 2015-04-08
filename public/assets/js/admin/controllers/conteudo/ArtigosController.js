$app.controller('ArtigosController',function($timeout,$rootScope,$scope,$http,$window,$location,$resource,AuthService,ListDataService,CSRF_TOKEN){
	
	$scope.title = "Artigos";
    $scope.content = "artigos";
    $scope.editorDescricao= false;
    $scope.editorMiniDescricao= false;
	var comboCategoriaGrid = "";

	$scope.window = {
    	new: function(){
            $scope.dataItem = {titulo:"",apelido:"",artigo_categoria_id:"",publicado:true,destaque:false,mostrar_titulo:false,tag_titulo:"h1",mini_descricao:"",descricao:"",meta_title:"",meta_description:"",meta_keywords:"",meta_author:"",parametros:{template:"padrao.html",class:'',id:''}};
            $scope.formView = "new";
    		$scope.formAction = "create()";
    	    $scope.modal.setOptions({
    	    	title: "Adicionar Artigo"
            });
            $scope.modal.open().center();
    	},
    	edit: function(dataItem){
    		$scope.formView = "edit";
    		$scope.formAction = "update()";
    		 $scope.modal.setOptions({
    	    	title: "Editar Artigo: "+dataItem.id
            });
    		$scope.modal.open().center();
            $scope.dataItem = dataItem;
            $scope.dataItem.parametros = angular.fromJson(dataItem.parametros);
     
       	},
    	close: function(){
    		$scope.modal.close();
    	},
        ordem: function(){
            $scope.openOrdem = true;
            $scope.modal_ordem.open().center();
        },
        close_ordem: function(){
            //$scope.openOrdem = true;
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

        if(AuthService.checkCreate("artigos",true) && AuthService.checkCreate("conteudo",true)){
            var user = $resource("/admin/conteudo/artigos",{_token:CSRF_TOKEN});
        
            $scope.loaderForm = true;
            user.save($scope.dataItem,function(response){
                switch(response.status){
                    case 0:
                        return displayErrors(response.data);
                    break;
                    case 1:
                        alert(response.data);
                        $scope.dataItem = {titulo:"",apelido:"",artigo_categoria_id:"",publicado:true,destaque:false,mostrar_titulo:false,tag_titulo:"h1",mini_descricao:"",descricao:"",meta_title:"",meta_description:"",meta_keywords:"",meta_author:"",parametros:{template:"",class:'',id:''}};
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

        if(AuthService.checkUpdate("artigos",true) && AuthService.checkUpdate("conteudo",true)){
            var user = $resource("/admin/conteudo/artigos",{_token:CSRF_TOKEN},{
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
        
        if(AuthService.checkDelete("artigos",true) && AuthService.checkDelete("conteudo",true)){
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
                var user = $resource("/admin/conteudo/artigos");

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
		      read: '/admin/conteudo/artigos/grid'
		    },
		    serpageSize: 10,
		    serverPaging: true, 
		    serverFiltering: true,
            serverSorting: true,    
		    schema:{ 
		    data: function(response) {
               comboCategoriaGrid = response.artigo_categoria;
               return response.data;
            },
            total: function(response) {
                return response.total; 
            },	
	        model:{ 
	            id: "id",
	            fields:{ 
	              id: {type: "number"},
                  artigo_categoria_id: {type: "number"},
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
      		}
		  }
		},
		toolbar:[{template:"<button class='k-button' k-options='optionsTooltip' kendo-tooltip title='Adicionar' ng-disabled='access_create == false' ng-click='window.new()'><span class='k-icon k-i-plus' style='padding:0 2px 0 0;'></span></button>"},
          		{template:"<button class='k-button' k-options='optionsTooltip' kendo-tooltip title='Excluir Todos os Selecionados' ng-click='delete(\"multiple\")'><span class='k-icon k-i-close' style='padding:0 2px 0 0;'></span></button>"},
                {template:"<button class='k-button' k-options='optionsTooltip' kendo-tooltip title='Ordenação' ng-click='window.ordem()'><span class='' style='padding:0 2px 0 0;'>Ordem</span></button>"}
        ], 	        
	    columns:[
	    {title: "<input type='checkbox' ng-model='checkAll' />",width:"30px",template:"<input type='checkbox' class='itemGrid' ng-model='itensGrid' ng-value='dataItem.id' ng-checked='checkAll'/>",filterable:false,sortable:false},
	    {field: "id", title: "Id",type:"number",width:"50px"},
        {field: "titulo", title: "Titulo",type:"string"},
        {field: "apelido", title: "Apelido",type:"string"},
        {field: "artigo_categoria_id", title: "Categoria",template:function(dataItem){return ListDataService.getForeignText(comboCategoriaGrid,dataItem.artigo_categoria_id);},type:"number",filterable:{ui:artigoCategoriaFilter}},
        {field: "ordem", title: "Ordem",type:"number",width:'75px',template:"<div class='text-center'>{{dataItem.ordem}}</div>"},
        {command: [
	       {template: "<button class=\'k-button\' k-options='optionsTooltip' kendo-tooltip title='Editar' ng-disabled='access_update == false' ng-click=\'window.edit(dataItem)\'><span class='k-icon k-i-pencil' style='padding:0 2px 0 0;'></span></button>"},
	       {template: "<button  class=\'k-button\' k-options='optionsTooltip' kendo-tooltip title='Excliuir' ng-disabled='access_destroy == false' ng-click=\'delete(dataItem)\'><span class='k-icon k-i-close' style='padding:0 2px 0 0;'></span></button>"},
           {template: "<button  class=\'k-button\' k-options='optionsTooltip' kendo-tooltip title='Imagens' ng-click=\'setContent(\"fotos\",dataItem)\'><span class='icon-image-2' style='padding:0 2px 0 0;'></span></button>"}
	    ]}] 
    	}
        function artigoCategoriaFilter(element){
            element.kendoDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                dataSource:{data:angular.fromJson(comboCategoriaGrid)},
                optionLabel: "--Select Value--"
            });
        }
    }
    $scope.updateOrdem = function(){
        $(".status-ordem-modulo").addClass('btn-primary').html("<span>Alterando Ordem...</span>");
        var request = $resource('/admin/conteudo/artigos/ordem',{_token:CSRF_TOKEN},{
            update:{method:"PUT"}
        }); 
         if(AuthService.checkUpdate("artigos",true) && AuthService.checkUpdate("conteudo",true)){
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
	optionsModal = function(){
    	$scope.conf_modal = {
			title: 'Artigos',
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
        var pathArtigos = '/assets/templates/includes/templates/componentes/artigo/unico-artigo/';
        
        $scope.comboCategoria = {
            filter: 'contains',
            dataTextField: "descricao",
            dataValueField: "id",
            autoBind: false,
            dataSource:{
                transport: {
                    read: {
                        url: "/admin/conteudo/artigo-categorias/combo",
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
         $scope.comboTemplates = {
            filter: 'contains',
            dataTextField: "file",
            dataValueField: "file",
            autoBind: false,
            dataSource:{
                transport: {
                    read: {
                        url: "/admin/conteudo/artigos/filesDir?path="+pathArtigos,
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
       
    }
    $scope.loaderEditorMiniDescricao = function(){
        $timeout(function(){
            $scope.editorMiniDescricao= true;
        },1000);
    }
    $scope.loaderEditorDescricao = function(){
        $timeout(function(){
            $scope.editorDescricao= true;
        },1000);
    }
    $scope.setContent = function(content,dataItem){
        
        $scope.content = content;
        $scope.itemSelected = dataItem; 
        switch(content){
            case 'fotos':
                $scope.title = "Fotos: "+dataItem.titulo;  
            break;
            default:
                $scope.title = "Artigos";
            break;
        }
    }
	init = function(){
		AuthService.checkView("conteudo"); 
		AuthService.checkView("artigos"); 

        $scope.permissaoUpdate =  AuthService.checkUpdate("conteudo",false) == true && AuthService.checkUpdate("artigos",false) == true ? true : false;

        optionsCombo();
		optionsGrid();
        optionsModal();
	} 
	init();
});	    	
