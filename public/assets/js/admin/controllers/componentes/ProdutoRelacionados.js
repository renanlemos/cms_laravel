$app.controller("ProdutoRelacionadosController",function($scope,$rootScope,$resource,AuthService,FileService,CSRF_TOKEN,ListDataService){
    
    $scope.openOrdem = false;
    $scope.files = [];

    $scope.window = {
        new: function(){
            $scope.dataItem = {produto_id:$scope.produto.id,produto_relacionado_id:"",publicado:true};
            $scope.formView = "new";
            $scope.formAction = "create()";
            $scope.modal.setOptions({
                title: "Adicionar Produto"
            });
            $scope.modal.open().center();
        },
        edit: function(dataItem){
            $scope.formView = "edit";
            $scope.formAction = "update()";
             $scope.modal.setOptions({
                title: "Editar Produto: "+dataItem.id
            });
            $scope.modal.open().center();
            $scope.dataItem = dataItem;
     
        },
        close: function(){
            $scope.modal.close();
        },
        ordem: function(dataItem){
            $scope.paramsOrdem = {produto_id:$scope.produto.id};
            $scope.openOrdem = true;
            $scope.modal_ordem.open().center();
        },
        close_ordem: function(){
            $scope.modal_ordem.close();
        }   
    }
    $scope.executeAction = function(action){
        switch(action){
            case "create()":
                createR();
            break;
            case "update()":
                updateR();
            break;
        }
    }
    createR = function(){
        if(AuthService.checkCreate("componente-produto-produtos",true) && AuthService.checkCreate("componente-produtos",true) && AuthService.checkCreate("componentes",true)){
            var user = $resource("/admin/componentes/produtos/produto-relacionados",{_token:CSRF_TOKEN});
        
            $scope.loaderForm = true;
            user.save($scope.dataItem,function(response){
                switch(response.status){
                    case 0:
                        return displayErrors(response.data);
                    break;
                    case 1:
                        alert(response.data);
                        $scope.dataItem = {produto_id:$scope.produto.id,produto_relacionado_id:"",publicado:true};
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
    updateR = function(){

        if(AuthService.checkCreate("componente-produto-produtos",true) && AuthService.checkUpdate("componente-produtos",true) && AuthService.checkUpdate("componentes",true)){
            var request = $resource("/admin/componentes/produtos/produto-relacionados",{_token:CSRF_TOKEN},{
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
        
        if(AuthService.checkCreate("componente-produto-produtos",true) && AuthService.checkDelete("componente-produtos",true) && AuthService.checkDelete("componentes",true)){
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
                var user = $resource("/admin/componentes/produtos/produto-relacionados");

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
    $scope.optionsGrid = function(dataItem){
        var comboProdutoGrid = [];
        $scope.produto = dataItem;
        optionsCombo(dataItem);

        $scope.optionsTooltip = {
            position: 'top'
        }

        return{
            dataSource:{ 
            type: "json",
            transport:{ 
              read: '/admin/componentes/produtos/produto-relacionados/grid?produto_id='+dataItem.id
            },
            serpageSize: 10,
            serverPaging: true, 
            serverFiltering: true,
            serverSorting: true,    
            schema:{ 
              data:function(response){
                comboProdutoGrid = response.produtos;
                return response.data;
              },
              total: function(response){
                return response.total;
              },   
              model:{ 
                id: "id",
                fields:{ 
                  id: {type: "number"},
                  produto_id: {type: "number"},
                  produto_relacionado_id: {type: "number"},
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
              neq: "Não é igual a"
            },
            enums: {
              eq: "Seja igual a",
              neq: "Não é igual a"
            }
          }
        },
        toolbar:[{template:"<button class='k-button' k-options='optionsTooltip' kendo-tooltip title='Adicionar' ng-click='window.new()'><span class='k-icon k-i-plus' style='padding:0 2px 0 0;'></span></button>"},
                {template:"<button class='k-button' k-options='optionsTooltip' kendo-tooltip title='Excluir Todos os Selecionados' ng-click='delete(\"multiple\")'><span class='k-icon k-i-close' style='padding:0 2px 0 0;'></span></button>"},
                {template:"<button class='k-button' k-options='optionsTooltip' kendo-tooltip title='Voltar para Produtos' ng-click='$parent.setContent(\"produtos\")'>Voltar</button>"},
                {template:"<button class='k-button' k-options='optionsTooltip' kendo-tooltip title='Ordenação' ng-click='window.ordem()'><span class='' style='padding:0 2px 0 0;'>Ordem</span></button>"}
        ],          
        columns:[
        {title: "<input type='checkbox' ng-model='checkAll' />",width:"30px",template:"<input type='checkbox' class='itemGrid' ng-model='itensGrid' ng-value='dataItem.id' ng-checked='checkAll'/>",filterable:false,sortable:false},
        {field: "id", title: "Id",type:"number",width:"50px"},
        {field: "produto_relacionado_id", title: "Produto Relacionado",type:"number",template:function(dataItem){return ListDataService.getForeignText(comboProdutoGrid,dataItem.produto_relacionado_id);},filterable:{ui:produtoFilter,extra:false}},
        {field: "publicado",width: '100px',title: "Publicado",template:"<publica-in-grid campo='publicado' status='dataItem.publicado' item='dataItem' grid='grid' url='/admin/componentes/produtos/produto-relacionados/updateStatus' permissao='permissaoUpdate'></publica-in-grid>",type:"boolean",filterable:{ui:publicadoFilter,extra:false,operators:{string:{eq:'Seja igual a',neq:'Não seja igual a'}}}},
        {field: "ordem",width: '80px',title: "Ordem",type:"number",template:'<div class="text-center">{{dataItem.ordem}}</div>'},
        {command: [
           {template: "<button class=\'k-button\' k-options='optionsTooltip' kendo-tooltip title='Editar' ng-click=\'window.edit(dataItem)\'><span class='k-icon k-i-pencil' style='padding:0 2px 0 0;'></span></button>"},
           {template: "<button  class=\'k-button\' k-options='optionsTooltip' kendo-tooltip title='Deletar'  ng-click=\'delete(dataItem)\'><span class='k-icon k-i-close' style='padding:0 2px 0 0;'></span></button>"}
        ]}] 
        }
        function produtoFilter(element){
            element.kendoDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                dataSource:{data:angular.fromJson(comboProdutoGrid)},
                optionLabel: "--Select Value--"
            });
        }
        function publicadoFilter(element){
            element.kendoDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                dataSource:[{'value':true,'text':'Publicado'},{'value':false,'text':'Despublicado'}],
                optionLabel: "--Select Value--"
            });
        }
    }
    $scope.updateOrdem = function(){
        $(".status-ordem-modulo").addClass('btn-primary').html("<span>Alterando Ordem...</span>");
        var request = $resource('/admin/componentes/produtos/produto-relacionados/ordem',{_token:CSRF_TOKEN},{
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
    optionsModal = function(){
        $scope.conf_modal = {
            title: 'Produto Relacionado',
            width: '700',
            height: '400',
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
    optionsCombo = function(dataItem){
        $scope.comboProdutos = {
            filter: 'contains',
            dataTextField: "text",
            dataValueField: "value",
            dataSource:{
                transport: {
                    read: {
                        url: "/admin/componentes/produtos/combo?produto_id="+dataItem.id,
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
    init = function(){
       optionsModal();
       $scope.permissaoUpdate =  AuthService.checkUpdate("componente-produtos",false) == true && AuthService.checkUpdate("componente-produto-produtos",false) == true && AuthService.checkUpdate("componentes",false) == true ? true : false;

    } 
    init();
});         
