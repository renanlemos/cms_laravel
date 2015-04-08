$app.controller('EventoEventoHospedagensController',function($timeout,$scope,$rootScope,$resource,AuthService,ListDataService,CSRF_TOKEN){

    $scope.openOrdem = false;

    $scope.window = {
        new: function(){

            $scope.dataItem = {evento_id:$scope.evento.id,evento_hospedagem_id:"",evento_hospedagem_categoria_id:"",publicado:true};
            $scope.formView = "new";
            $scope.formAction = "create()";
            $scope.modal.setOptions({
                title: "Hotel"
            });
            $scope.modal.open().center();
        },
        edit: function(dataItem){

            $scope.formView = "edit";
            $scope.formAction = "update()";
             $scope.modal.setOptions({
                title: "Editar Hotel: "+dataItem.id
            });
            $scope.dataItem = dataItem;
            $scope.modal.open().center();
        },
        close: function(){
            $scope.modal.close();
        },
        ordem: function(){
            $scope.paramsOrdem = {evento_id: $scope.evento.id}
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
                createS();
            break;
            case "update()":
                updateS();
            break;
        }
    }
    createS = function(){
        if(AuthService.checkCreate("componente-eventos",true) && AuthService.checkCreate("componente-evento-eventos",true) && AuthService.checkCreate("componentes",true)){
            var request = $resource("/admin/componentes/eventos/evento-evento-hospedagens",{_token:CSRF_TOKEN});
        
            $scope.loaderForm = true;''
            request.save($scope.dataItem,function(response){
                switch(response.status){
                    case 0:
                        return displayErrors(response.data);
                    break;
                    case 1:
                        alert(response.data);
                        $scope.dataItem = {evento_id:$scope.evento.id,evento_hospedagem_id:"",evento_hospedagem_categoria_id:"",publicado:true};
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
    updateS = function(){

            if(AuthService.checkUpdate("componente-eventos",true) && AuthService.checkUpdate("componente-evento-eventos",true) && AuthService.checkUpdate("componentes",true)){
            var request= $resource("/admin/componentes/eventos/evento-evento-hospedagens",{_token:CSRF_TOKEN},{
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
        
        if(AuthService.checkDelete("componente-eventos",true) && AuthService.checkDelete("componente-evento-eventos",true) && AuthService.checkDelete("componentes",true)){
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
                var request= $resource("/admin/componentes/eventos/evento-evento-hospedagens");

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
    $scope.optionsGrid = function(dataItem){

        var dataHospedagemGrid = [];
        var dataCategoriaGrid = [];

        $scope.evento = dataItem;
        optionsCombo(); 
        $scope.optionsTooltip = {
            position: 'top'
        }
        
        return $scope.optionsGrid = {
            dataSource:{ 
            type: "json",
            transport:{ 
              read: '/admin/componentes/eventos/evento-evento-hospedagens/grid?evento_id='+dataItem.id
            },
            serpageSize: 10,
            serverPaging: true, 
            serverFiltering: true,
            serverSorting: true,    
            schema:{ 
              data: function(response){
                dataHospedagemGrid = response.hospedagens;
                dataCategoriaGrid = response.categorias;
                return response.data;
              },
              total: "total",   
              model:{ 
                id: "id",
                fields:{ 
                  id: {type: "number"},
                  evento_id: {type: "number"},
                  evento_hospedagem_id: {type: "number"},
                  evento_hospedagem_categoria_id: {type: "number"},
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
                {template:"<button class='k-button' k-options='optionsTooltip' kendo-tooltip title='Excluir Todos os Selecionados' ng-click='setContent(\"eventos\")'><span class='' style='padding:0 2px 0 0;'>Voltar</span></button>"},
                {template:"<button class='k-button' k-options='optionsTooltip' kendo-tooltip title='Excluir Todos os Selecionados' ng-click='window.ordem()'><span class='' style='padding:0 2px 0 0;'>Ordem</span></button>"}
        ],          
        columns:[
        {title: "<input type='checkbox' ng-model='checkAll' />",width:"30px",template:"<input type='checkbox' class='itemGrid' ng-model='itensGrid' ng-value='dataItem.id' ng-checked='checkAll'/>",filterable:false,sortable:false},
        {field: "id", title: "Id",type:"number",width:"50px"},
        {field: "evento_hospedagem_id", title: "Hotel",type:"number",template:function(dataItem){return ListDataService.getForeignText(dataHospedagemGrid,dataItem.evento_hospedagem_id);},filterable:{ui:hospedagemFilter,extra:false,operators:{number:{eq:"Seja igual a"}}}},
        {field: "evento_hospedagem_categoria_id", title: "Categoria",type:"number",template:function(dataItem){return ListDataService.getForeignText(dataCategoriaGrid,dataItem.evento_hospedagem_categoria_id);},filterable:{ui:categoriaFilter,extra:false,operators:{number:{eq:"Seja igual a"}}}},
        {field: "publicado",width:'100px',title: "Publicado",template:"<publica-in-grid campo='publicado' status='dataItem.publicado' item='dataItem' grid='grid' url='/admin/componentes/eventos/evento-evento-hospedagens/updateStatus?campo=publicado' permissao='permissaoUpdate'></publica-in-grid>",type:"boolean",
            filterable:{
                extra: false,
                operators:{string:{
                    eq: "Seja igual a",
                    neq: "Não seja igual a"
                }},
                ui:publicadoFilter
            }
        },
        {field: "ordem", title: "Ordem",type:"string",width:'80px',template:"<div class='text-center'>{{dataItem.ordem}}</div>"},
        {command: [
           {template: "<button class=\'k-button\' k-options='optionsTooltip' kendo-tooltip title='Editar'  ng-click=\'window.edit(dataItem)\'><span class='k-icon k-i-pencil' style='padding:0 2px 0 0;'></span></button>"},
           {template: "<button  class=\'k-button\' k-options='optionsTooltip' kendo-tooltip title='Excluir' ng-click=\'delete(dataItem)\'><span class='k-icon k-i-close' style='padding:0 2px 0 0;'></span></button>"},
           {template: "<button  class=\'k-button\' k-options='optionsTooltip' kendo-tooltip title='Valores' ng-click=\'setContent(\"valores\",dataItem)\'><span class='icon-cc-nc' style='padding:0 2px 0 0;'></span></button>"}
        ]}] 

            
        }
        function publicadoFilter(element){
            element.kendoDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                dataSource:{data:[{"text":"Publicado","value":true},{"text":"Despublicado","value":false}]},
                optionLabel: "--Select Value--"
            });
        }
        function hospedagemFilter(element){
            element.kendoDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                dataSource:{data:dataHospedagemGrid},
                optionLabel: "--Select Value--"
            });
        }
        function categoriaFilter(element){
            element.kendoDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                dataSource:{data:dataCategoriaGrid},
                optionLabel: "--Select Value--"
            });
        }
    }
    $scope.updateOrdem = function(){
        $(".status-ordem-modulo").addClass('btn-primary').html("<span>Alterando Ordem...</span>");
        var request = $resource('/admin/componentes/eventos/evento-evento-hospedagens/ordem',{_token:CSRF_TOKEN},{
            update:{method:"PUT"}
        }); 
        if(AuthService.checkUpdate("componente-eventos",true) && AuthService.checkUpdate("componente-evento-eventos",true) && AuthService.checkUpdate("componentes",true)){
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
            title: 'Hotéis',
            width: '500',
            height: '300',
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
            width: '500',
            height: '400',
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
    optionsCombo = function(){
       $scope.comboHospedagem = {
            filter: 'contains',
            dataTextField: "nome",
            dataValueField: "id",
            dataSource:{
                transport: {
                    read: {
                        url: '/admin/componentes/eventos/evento-hospedagem-hospedagens/combo',
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
        $scope.comboCategoria = {
            filter: 'contains',
            dataTextField: "descricao",
            dataValueField: "id",
            dataSource:{
                transport: {
                    read: {
                        url: '/admin/componentes/eventos/evento-hospedagem-categorias/combo',
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
    init = function(){
        AuthService.checkView("componentes");
        AuthService.checkView("componente-eventos");
        AuthService.checkView("componente-evento-eventos");

        $scope.permissaoUpdate =  AuthService.checkUpdate("componente-eventos",false) == true && AuthService.checkUpdate("componente-evento-eventos",false) == true && AuthService.checkUpdate("componentes",false) == true ? true : false;

        optionsModal();
        optionsGrid();
 
    }
    init();
});