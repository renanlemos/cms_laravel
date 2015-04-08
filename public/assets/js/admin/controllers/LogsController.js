$app.controller('LogsController',function($scope,$resource,AuthService,$sce){

    $scope.title = 'Logs';
    var comboTabelasGrid  = "";
    var comboUsuariosGrid  = "";

    $scope.window = {
    	detalhe: function(dataItem){
    		$scope.dataItem = dataItem;
    		$scope.data_log = dataItem.created_at;
    		$scope.valor_novo = dataItem.valor_novo;
    		$scope.valor_antigo = dataItem.valor_antigo;
    		$scope.dataObservacoes = JSON.parse(dataItem.observacoes); 
    		$scope.observacoes = [];
    		angular.forEach($scope.dataObservacoes,function(value,key){

    			var i = key;
    			var v = value.toString();
    			if(key == "permissoes"){
    				v = formatPermissoes(value);
    			}
    			if(key != "updated_at" && key != "created_at"){
    				$scope.observacoes.push({index:i,valor:v});
    			}
	   			
    		});
    		checkTableUsuarios(dataItem);

    		$scope.modal.setOptions({
    	    	title: "Log "+dataItem.id
            });
    		$scope.modal.open().center();
    	},
    	close: function(){
    		$scope.modal.close();
    	}
    }
    checkTableUsuarios = function(data){
    	
    	if(data.tabela == "usuarios" && data.acao == "update" && data.campo == "permissoes"){
    		$scope.valor_antigo = formatPermissoes(data.valor_antigo);
    		$scope.valor_novo = formatPermissoes(data.valor_novo);
    	}
    }
    formatDateTime = function(date){
    	var data = date.substring(0,10).split('-');
        var hora = date.substring(11,19);

    	return data[2]+"/"+data[1]+"/"+data[0]+" - "+hora;
    }
    formatPermissoes = function(permissoes){
    	var data = JSON.parse(permissoes);
    	var html = "";
    	var view = "";
    	var create = "";
    	var update = "";
    	var destroy = "";

    	angular.forEach(data,function(value,key){

    		view = value.view == true ? "<span class='icon icon-checkmark'></span>" : "<span class='icon icon-cancel'></span>";
      	    create = value.create == true ? "<span class='icon icon-checkmark'></span>" : "<span class='icon icon-cancel'></span>";
      	    update = value.update == true ? "<span class='icon icon-checkmark'></span>" : "<span class='icon icon-cancel'></span>";
      	    destroy = value.delete == true ? "<span class='icon icon-checkmark'></span>" : "<span class='icon icon-cancel'></span>";
      	    
      	    html += "<strong>"+value.display+"</strong><br>";
    	    html += " View: "+view;
    	    html += " Create: "+create;
    	    html += " Update: "+update;
    	    html += " Delete: "+destroy+"<br>";

    	});
    	return html;
    }
    optionsGrid = function(){
    	return $scope.optionsGrid = {
    		dataSource:{ 
		    type: "json",
		    transport:{ 
		      read: '/admin/logs/grid'
		    },
		    serpageSize: 10,
		    serverPaging: true, 
		    serverFiltering: true,
            serverSorting: true,    
		    schema:{ 
		      data:function(response){
		      	comboTabelasGrid = response.tabelas;
		      	comboUsuariosGrid = response.usuarios;
		      	return response.data;
		      },
		      total:function(response){
		      	return response.total;
		      },	
	          model:{ 
	            id: "id",
	            fields:{ 
	              id: {type: "number"},
	              created_at: {type: "date"}
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
		tolbar:[],     
	    columns:[
	    {field: "id", title: "Id",type:"number",width:"50px"},
	    {field: "nome_usuario", title: "Nome Usuário",type:"text",filterable:{ui:usuariosFilter}},
	    {field: "tabela", title: "Tabela",type:"text",filterable:{ui:tabelasFilter}},
	    {field: "acao", title: "Ação",type:"text"},
	    {field: "created_at", title: "Data",type:"date",format:"{0:dd-MM-yyyy HH:mm:ss}",filterable:{ui: DateTimePicker}},
	    {command: [
	       {template: "<button class=\'k-button\' ng-disabled='' ng-click=\'window.detalhe(dataItem)\'><span class='icon-eye-2' style='padding:0 2px 0 0;'></span></button>"},
	    ]}] 
    	}
    	function tabelasFilter(element){
            element.kendoDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                dataSource:{data:angular.fromJson(comboTabelasGrid)},
                optionLabel: "--Select Value--"
            });
        }
        function usuariosFilter(element){
            element.kendoDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                dataSource:{data:angular.fromJson(comboUsuariosGrid)},
                optionLabel: "--Select Value--"
            });
        }
        function DateTimePicker(element){
			element.kendoDateTimePicker({
				culture: "pt-BR",
				format: "dd-MM-yyyy HH:mm:ss"
			})
		}
    } 
    optionsModal = function(){
    	$scope.conf_modal = {
			title: 'Log',
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
	init = function(){
		AuthService.checkView("logs"); 

		optionsGrid();
		optionsModal();
	}
	init();
});