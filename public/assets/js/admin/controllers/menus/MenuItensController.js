$app.controller('MenuItensController',function($scope,$rootScope,$resource,ListDataService,FileService,AuthService,MenuService,CSRF_TOKEN,$compile,$timeout){

	$scope.title = "Menus";
    $scope.paramsOrdem = "";
    $scope.openOrdem = false;
    $scope.displayGridMenuItens = false;
    var comboItemPai = "";

	$scope.window = {
    	new: function(){
            var combo = $("#comboImagem").data("kendoComboBox");
            $rootScope.fileImagesService = combo.dataSource.data();

            $scope.dataItem = {tipo_descricao:"",tipo:"",componente:"",titulo:"",apelido:"",publicado:true,pagina_inicial:false,item_pai:0,menu_id:$scope.menuSelecionado.id,meta_title:"",meta_description:"",meta_keywords:"",meta_author:"",parametros:{class:"",mostrar_cabecalho:false,subtitulo:"",icone:'',mostrar_icone_menu:false,mostrar_titulo_menu:true}};
            $scope.formView = "new";
    		$scope.formAction = "create()";
    	    $scope.modal_item.setOptions({
    	    	title: "Adicionar Item de Menu"
            });
            setParametrosHtml("");
            $scope.modal_item.open().center();
            refreshComboItemPai(); 
        },
    	edit: function(dataItem){
            var combo = $("#comboImagem").data("kendoComboBox");
            $rootScope.fileImagesService = combo.dataSource.data();

            $scope.dataItem = dataItem;
            $scope.getTipoMenu(dataItem.componente,dataItem.tipo,dataItem.tipo_descricao,'edit');
            $scope.dataItem.parametros = angular.fromJson(dataItem.parametros);
            formataTitulo(dataItem.titulo);
    		$scope.formView = "edit";
    		$scope.formAction = "update()";
    		$scope.modal_item.setOptions({
    	    	title: "Editar Item de Menu: "+dataItem.id
            });
    		$scope.modal_item.open().center();
            refreshComboItemPai();
     
       	},
        tipo: function(){
            $scope.modal_item_tipo.open().center();
        },
        ordem: function(dataItem){
            $scope.data = $scope.grid.dataSource.data();
            $scope.paramsOrdem = dataItem;
            $scope.dataItem = dataItem;
            $scope.openOrdem = true;
            $scope.modal_ordem.open().center();
        },
        close_ordem: function(){
            $scope.openOrdem = false;
            $rootScope.itensOrdemSortable = "";
            $scope.modal_ordem.close();
        },
        close_tipo: function(){
            $scope.modal_item_tipo.close();
        },
    	close: function(){
    		$scope.modal_item.close();
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
        if(AuthService.checkCreate("menus",true)){
            var request = $resource("/admin/menu-itens",{_token:CSRF_TOKEN});
        
            $scope.loaderForm = true;
            request.save($scope.dataItem,function(response){
                switch(response.status){
                    case 0:
                        return displayErrors(response.data);
                    break;
                    case 1:
                        alert(response.data);
                        $scope.dataItem = {tipo_descricao:"",tipo:"",componente:"",titulo:"",apelido:"",publicado:true,pagina_inicial:false,item_pai:0,menu_id:$scope.menuSelecionado.id,meta_title:"",meta_description:"",meta_keywords:"",meta_author:"",parametros:{class:"",mostrar_cabecalho:false,subtitulo:"",icone:'',mostrar_icone_menu:false,mostrar_titulo_menu:true}};
                        $scope.grid.refresh();
                        $scope.grid.dataSource.read();
                        refreshComboItemPai(); 
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

        if(AuthService.checkUpdate("menus",true)){
            var request = $resource("/admin/menu-itens",{_token:CSRF_TOKEN},{
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
        
        if(AuthService.checkDelete("menus",true)){
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
                var request = $resource("/admin/menu-itens");

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
                            $scope.grid.refresh();
                            $scope.grid.dataSource.read();
                            refreshComboItemPai();
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
	$scope.optionsGrid = function(dataItem){
        $scope.menuSelecionado = dataItem;
        optionsCombo(dataItem);
        
        $scope.optionsTooltip = {
            position: 'top'
        }

        return $scope.optionsGrid = {
    		dataSource:{ 
		    type: "json",
		    transport:{ 
		      read: '/admin/menu-itens/grid?menu_id='+dataItem.id
   		    },
		    serpageSize: 10,
		    serverPaging: true, 
		    serverFiltering: true,
            serverSorting: true,    
		    schema:{ 
            data: function(response) {
               comboItemPai = response.combo_item_pai;
               return response.data;
            },
            total: function(response) {
                return response.total; 
            },
            model:{ 
	            id: "id",
	            fields:{ 
	              id: {field: "id",type: "number"},
                  item_pai: {field:"item_pai",type:"number"}
	            },
                itemPaiTitulo: function() {
                  return ListDataService.getForeignText(comboItemPai,this.get("item_pai"));  
                }
	          },

	        }
        },
        sortable: true,
		reorderable: true,
	    resizable:true,
	    mobile:true,
	    selectable:true, 
        autoBind: true,
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
		toolbar:[{template:"<button class='k-button' kendo-tooltip k-options='optionsTooltip' title='Adicionar' ng-click='window.new()'><span class='k-icon k-i-plus' style='padding:0 2px 0 0;'></span></button>"},
          		{template:"<button class='k-button' kendo-tooltip k-options='optionsTooltip' title='Excluir Todos os Selecionados' ng-click='delete(\"multiple\")'><span class='k-icon k-i-close' style='padding:0 2px 0 0;'></span></button>"},
                {template:"<button class='k-button' kendo-tooltip k-options='optionsTooltip' title='Voltar para Menus' ng-click='$parent.setContent(\"menus\")'>Voltar</button>"}
        ], 	        
	    columns:[
	    {title: "<input type='checkbox' ng-model='checkAll' />",width:"30px",template:"<input type='checkbox' class='itemGrid' ng-model='itensGrid' ng-value='dataItem.id' ng-checked='checkAll'/>",filterable:false,sortable:false},
	    {field: "id", title: "Id",type:"number",width:"50px"},
        {field: "titulo", title: "Titulo",type:"string",template:"<div ng-bind-html-custom='{{dataItem.titulo}}' />"},
        {field: "apelido", title: "Apelido",type:"string"},
        {field: "pagina_inicial",template:"<div style='text-align:center;' ng-pagina-inicial='dataItem'></div>",title: "Página Inicial",type:"string"},
        {field: "item_pai",template:function(dataItem){return ListDataService.getForeignText(comboItemPai,dataItem.item_pai);},title: "Item Pai",type:"number",filterable:false},
        {field: "ordem", title: "Ordem",type:"number"},
        {command: [
	       {template: "<button class=\'k-button\' kendo-tooltip k-options='optionsTooltip' title='Editar' ng-click=\'window.edit(dataItem)\'><span class='k-icon k-i-pencil' style='padding:0 2px 0 0;'></span></button>"},
	       {template: "<button  class=\'k-button\' kendo-tooltip k-options='optionsTooltip' title='Deletar' ng-click=\'delete(dataItem)\'><span class='k-icon k-i-close' style='padding:0 2px 0 0;'></span></button>"},
           {template: "<button  class=\'k-button\' kendo-tooltip k-options='optionsTooltip' title='Ordenação' ng-click=\'window.ordem(dataItem)\'><span class='icon-menu' style='padding:0 2px 0 0;'></span></button>"}
	    ]}],
    	}
   
        function itemPaiFilter(element){
            element.kendoDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                dataSource:{data:angular.fromJson(comboItemPai)},
                optionLabel: "--Select Value--"
            });
        }
    }
    
	optionsModal = function(){
    	$scope.conf_modal_item = {
			title: 'Item de Menu',
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
        $scope.conf_modal_item_tipo = {
            title: 'Tipo de Menu',
            width: '500',
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
            title: 'Ordem',
            width: '400',
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
            }
        }
    }
    optionsCombo = function(dataItem){
        $scope.comboItemPai = {
            filter: 'contains',
            dataTextField: "titulo",
            dataValueField: "id",
            dataSource:{
                transport: {
                    read: {
                        url: "/admin/menu-itens/combo-item-pai?menu_id="+dataItem.id,
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
        $scope.comboImagem = {
            filter: 'contains',
            dataTextField: "text",
            dataValueField: "value",
            dataSource:{
                transport: {
                    read: {
                        url: "/admin/files/read_dir?pasta=menus/icones",
                        async: false
                    }
                }
            },
            template:"<img src='/menus/icones/#=value#' width='20px;'>",
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
    $scope.getTipoMenu = function(componente,tipo,descricao,acao){
        if(acao == 'create'){
            $scope.dataItem.componente = componente;
            $scope.dataItem.tipo_descricao = descricao;
            $scope.dataItem.tipo = tipo;
        } 
        switch(tipo){
            case 'unico-artigo':
                if(acao == 'create'){
                    $scope.dataItem.parametros.artigo_id = "";
                }    
                setParametrosHtml(MenuService.parametrosUnicoArtigo());
                optionsUnicoArtigo(); 

            break;
            case 'categoria-de-artigo':
                if(acao == 'create'){
                    $scope.dataItem.parametros.categoria_id = "";
                    $scope.dataItem.parametros.categoria_template = "";
                }    
                setParametrosHtml(MenuService.parametrosCategoriaArtigo());
                optionsCategoriaArtigo(); 
            break;
            case 'unico-contato':
                if(acao == 'create'){
                    $scope.dataItem.parametros.contato_id = "";
                } 
                setParametrosHtml(MenuService.parametrosUnicoContato());
                optionsUnicoContato(); 
            break;
            case 'unico-produto':
                if(acao == 'create'){
                    $scope.dataItem.parametros.produto_id = "";
                    $scope.dataItem.parametros.template = "";
                } 
                setParametrosHtml(MenuService.parametrosUnicoProduto());
                optionsUnicoProduto(); 
            break;
            case 'categoria-de-produto':
                if(acao == 'create'){
                    $scope.dataItem.parametros.produto_categoria_id = "";
                } 
                setParametrosHtml(MenuService.parametrosCategoriaProduto());
                optionsCategoriaProduto(); 
            break;
            case 'unico-evento':
                if(acao == 'create'){
                    $scope.dataItem.parametros.evento_id = "";
                    $scope.dataItem.parametros.template = "";
                } 
                setParametrosHtml(MenuService.parametrosUnicoEvento());
                optionsUnicoProduto(); 
            break;
            case 'categoria-de-evento':
                if(acao == 'create'){
                    $scope.dataItem.parametros.evento_categoria_id = "";
                    $scope.dataItem.parametros.evento_status = "";
                } 
                setParametrosHtml(MenuService.parametrosCategoriaEvento());
                optionsCategoriaEvento(); 
            break;
        }
       
    }
    $scope.updateOrdem = function(){
        
        if(AuthService.checkUpdate("menus")){
            var request = $resource("/admin/menu-itens/updateOrdem",{_token:CSRF_TOKEN},{
                update: {method:"PUT"}
            });
            var data = {itens:$rootScope.itensOrdemSortable} 
            
            $(".status-ordem-modulo").addClass('btn-primary').html("<span>Alterando Ordem...</span>");
            var request = $resource('/admin/menu-itens/updateOrdem',{_token:CSRF_TOKEN},{
                update:{method:"PUT"}
            }); 
            if($rootScope.itensOrdemSortable == ""){
                $(".status-ordem-modulo").removeClass('primary bt-danger').addClass('btn-success').html("<span>Ordem atualizada</span>");
            }else{
                $(".status-ordem-modulo").removeClass('btn-success bt-danger').addClass('btn-primary').html("<span>Alterando Ordem</span>");
                request.update(data,function(response){
                    $(".status-ordem-modulo").removeClass('primary bt-danger').addClass('btn-success').html("<span>Ordem atualizada</span>");
                    $scope.grid.dataSource.read();
                },function(response){
                    alert('error');
                })
            }
        }    
    }
    setParametrosHtml = function(parametros){
        var el = angular.element(parametros);
        var compiled = $compile(el)($scope);
        $('.parametros-configuracao').html(compiled);
    }
    optionsUnicoArtigo = function(){
        $scope.comboArtigos = {
            filter: 'contains',
            dataTextField: "titulo",
            dataValueField: "id",
            dataSource:{
                transport: {
                    read: {
                        url: "/admin/conteudo/artigos/combo",
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
    optionsCategoriaArtigo = function(){
        $scope.comboCategoriaArtigos = {
            filter: 'contains',
            dataTextField: "descricao",
            dataValueField: "id",
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
        $scope.comboCategoriaArtigoTemplate = {
            filter: 'contains',
            dataTextField: "text",
            dataValueField: "value",
            dataSource:{
               data:[{text:'Padrão',value:'padrao.html'}]
            }
        }
    }
    optionsUnicoContato = function(){
        $scope.comboContatos = {
            filter: 'contains',
            dataTextField: "titulo",
            dataValueField: "id",
            dataSource:{
                transport: {
                    read: {
                        url: "/admin/componentes/contatos/combo",
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
    optionsCategoriaProduto = function(){
        $scope.comboCategoriaProduto = {
            filter: 'contains',
            dataTextField: "titulo",
            dataValueField: "id",
            dataSource:{
                transport: {
                    read: {
                        url: "/admin/componentes/produtos/produto-categorias/combo",
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
    optionsUnicoProduto = function(){
        $scope.comboProdutos = {
            filter: 'contains',
            dataTextField: "text",
            dataValueField: "value",
            dataSource:{
                transport: {
                    read: {
                        url: "/admin/componentes/produtos/comboAll",
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
         var pathTemplates = '/assets/templates/includes/templates/componentes/produto/produto';
        $scope.comboTemplateProduto = {
            filter: 'contains',
            dataTextField: "text",
            dataValueField: "value",
            dataSource:{
                transport: {
                    read: {
                        url: "/admin/files/read_dir?pasta="+pathTemplates,
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
                    this.value("padrao.html");
                }
            }
        }
    }
    optionsCategoriaEvento = function(){
        $scope.comboCategoriaEvento = {
            filter: 'contains',
            dataTextField: "titulo",
            dataValueField: "id",
            dataSource:{
                transport: {
                    read: {
                        url: "/admin/componentes/eventos/evento-categorias/combo",
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
        $scope.comboEventosStatus = {
            filter: 'contains',
            dataTextField: "text",
            dataValueField: "value",
            dataSource:{
               data:[{text:'Em andamento',value:'1'},{text:'Encerrados',value:'0'},{text:'Todos',value:'3'}]
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
    refreshComboItemPai = function(){
        var combo = $("#comboItemPai").data('kendoComboBox');
        combo.dataSource.read();
    }
    formataTitulo = function(titulo){
        var span = titulo.match(/(<span class="icon-arrow-right-2">)([\s\S]*?)(<\/span>)/g);
        var string = "";    
        angular.forEach(span,function(v,k){
            string += v;
        });
        $scope.dataItem.titulo = $scope.dataItem.titulo.replace(string,"");
    }
    $scope.changeFiles = function(file){
        FileService.setFile(file[0]);
    }
    $scope.uploadFiles = function(file){
        var path = 'menus/icones';
        
        FileService.setPath(path);
        FileService.uploadFiles({refreshCombo:true,id: '#comboImagem'});
    }
    $scope.deleteFile = function(index){
        FileService.set
        FileService.deleteFile(index);

    }
	init = function(){
        AuthService.checkView("menus"); 
        optionsGrid();
		optionsModal();
    } 
	init();
});