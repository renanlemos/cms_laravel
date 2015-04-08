$app.controller('ModuloHtmlController',function($scope,$resource,AuthService,CSRF_TOKEN){$scope.title="Módulo Html";$scope.window={new:function(){$scope.dataItem={titulo:"",apelido:"",posicao:"",publicado:true,conteudo:"",options:""};$scope.formView="new";$scope.formAction="create()";$scope.modal.setOptions({title:"Adicionar Módulo"});$scope.modal.open().center();},edit:function(dataItem){dataItem.senha="";$scope.formView="edit";$scope.formAction="update()";$scope.modal.setOptions({title:"Editar Módulo: "+dataItem.id});$scope.modal.open().center();$scope.dataItem=dataItem;},close:function(){$scope.modal.close();}}
$scope.executeAction=function(action){switch(action){case"create()":create();break;case"update()":update();break;}}
create=function(){if(AuthService.checkCreate("modulo-html")&&AuthService.checkCreate("modulos")){var user=$resource("/admin/usuarios",{_token:CSRF_TOKEN});$scope.loaderForm=true;user.save($scope.dataItem,function(response){switch(response.status){case 0:return displayErrors(response.data);break;case 1:alert(response.data);$scope.dataItem={nome:"",nome_usuario:"",email:"",senha:"",ativo:true,tipo:0,permissoes:getDefaultPermissoes(),cliente_id:""};$scope.grid.dataSource.read();$scope.loaderForm=false;break;case 2:alert(response.data);$scope.loaderForm=false;break;}},function(response){$scope.loaderForm=false;});}}
update=function(){if(AuthService.checkUpdate("modulo-html")&&AuthService.checkUpdate("modulos")){var user=$resource("/admin/usuarios",{_token:CSRF_TOKEN},{update:{method:"PUT"}});$scope.loaderForm=true;user.update($scope.dataItem,function(response){switch(response.status){case 0:return displayErrors(response.data);break;case 1:alert(response.data);$scope.grid.dataSource.read();$scope.loaderForm=false;break;case 2:alert(response.data);$scope.loaderForm=false;break;}},function(response){$scope.loaderForm=false;});}}
$scope.delete=function(dataItem){if(AuthService.checkDelete("modulo-html")&&AuthService.checkDelete("modulos")){if(confirm("Deseja deletar esse(s) registro(s)?")){var ids=[];var type="single";var id=dataItem.id;if(dataItem=="multiple"){if($(".itemGrid:checked").length==0){alert("Nenhum item marcado.");return false;}
$(".itemGrid:checked").map(function(key,value){ids.push(value.value);});type="multiple";id=ids[0];}
var user=$resource("/admin/usuarios");$scope.loaderForm=true;user.delete({id:id,ids:[ids],type:type,_token:CSRF_TOKEN},function(response){switch(response.status){case 2:alert(response.data);$scope.loaderForm=false;break;default:if(type=="multiple"){displayMessagesArray(response.data);}else{alert(response.data);}
$scope.grid.dataSource.read();$scope.loaderForm=false;break;}},function(response){alert("Error: "+response.data);$scope.loaderForm=false;});}}}
displayMessagesArray=function(data){var messages="";angular.forEach(data,function(value,key){messages+=value+"\n";});alert(messages);}
displayErrors=function(errors){var messages="";angular.forEach(errors,function(value,key){if(value.length>1){angular.forEach(value,function(value,key){messages+=value+"\n";});}else{messages+=value+"\n";}});alert(messages);$scope.loaderForm=false;}
optionsGrid=function(){return $scope.optionsGrid={dataSource:{type:"json",transport:{read:'/admin/modulos/grid?type=html'},serpageSize:10,serverPaging:true,serverFiltering:true,serverSorting:true,schema:{data:"data",total:"total",model:{id:"id",fields:{id:{type:"number"}}}}},sortable:true,reorderable:true,resizable:true,mobile:true,selectable:true,groupable:{messages:{empty:"Arraste uma coluna para agrupar"}},pageable:{refresh:true,pageSize:10,pageSizes:true,messages:{display:"{0} - {1} de {2} itens",empty:"Não Existem Itens para mostrar",page:"Página",of:"de {0}",itemsPerPage:"itens por Página",first:"Primeira Página",previous:"Página Anterior",next:"Próxima Página",last:"Última Página",refresh:"Atualizar",}},filterable:{extra:true,messages:{clear:"Limpar",filter:"buscar",info:"Registros que:",and:"e",or:"ou",selectValue:"Selecione",},operators:{string:{startswith:"Começa com",endswith:"Termina com",eq:"Seja igual a",neq:"Não é igual a",contains:"Contém",doesnotcontain:"Não contém",},date:{eq:"Igual a",gte:"Maior ou igual a",gt:"Maior que",lte:"Menor ou igual a",lt:"Menor que"},number:{eq:"Igual a",gte:"Maior ou igual a",gt:"Maior que",lte:"Menor ou igual a",lt:"Menor que"},enums:{eq:"Seja igual a",neq:"Não é igual a"}}},toolbar:[{template:"<button class='k-button' ng-disabled='access_create == false' ng-click='window.new()'><span class='k-icon k-i-plus' style='padding:0 2px 0 0;'></span></button>"},{template:"<button class='k-button' ng-click='delete(\"multiple\")'><span class='k-icon k-i-close' style='padding:0 2px 0 0;'></span></button>"}],columns:[{title:"<input type='checkbox' ng-model='checkAll' />",width:"30px",template:"<input type='checkbox' class='itemGrid' ng-model='itensGrid' ng-value='dataItem.id' ng-checked='checkAll'/>",filterable:false,sortable:false},{field:"id",title:"Id",type:"number",width:"50px"},{command:[{template:"<button class=\'k-button\' ng-disabled='access_update == false' ng-click=\'window.edit(dataItem)\'><span class='k-icon k-i-pencil' style='padding:0 2px 0 0;'></span></button>"},{template:"<button  class=\'k-button\' ng-disabled='access_destroy == false' ng-click=\'delete(dataItem)\'><span class='k-icon k-i-close' style='padding:0 2px 0 0;'></span></button>"}]}]}}
optionsModal=function(){$scope.conf_modal={title:'Módulo Html',width:'1000',height:'500',actions:["Minimize","Maximize","Close"],visible:false,modal:true,resizable:true,animation:{close:{duration:200},open:{duration:200}}}}
optinsCombo=function(){$scope.comboPosicao={filter:'contains',dataTextField:"nome",dataValueField:"id",dataSource:{transport:{read:{url:"/admin/modulos_posicaos/combo",async:true}}}}}
init=function(){AuthService.checkView("modulos");AuthService.checkView("modulo-html");optionsModal();optionsGrid();}
init();});$app.controller('MidiasController',function($scope,$http,$window,$location,$resource,AuthService){$scope.title="Mídias";init=function(){AuthService.checkView("midias");}
init();});$app.controller('ArtigosController',function($scope,$http,$window,$location,$resource,AuthService,CSRF_TOKEN){$scope.title="Artigos";$scope.window={new:function(){$scope.dataItem={titulo:"",conteudo:"Teste"};$scope.formView="new";$scope.formAction="create()";$scope.modal.setOptions({title:"Adicionar Artigo"});$scope.modal.open().center();},edit:function(dataItem){dataItem.senha="";$scope.formView="edit";$scope.formAction="update()";$scope.modal.setOptions({title:"Editar Artigo: "+dataItem.id});$scope.modal.open().center();$scope.dataItem=dataItem;},close:function(){$scope.modal.close();}}
$scope.executeAction=function(action){switch(action){case"create()":create();break;case"update()":update();break;}}
create=function(){if(AuthService.checkCreate("artigos")&&AuthService.checkCreate("conteudo")){var user=$resource("/admin/usuarios",{_token:CSRF_TOKEN});$scope.loaderForm=true;user.save($scope.dataItem,function(response){switch(response.status){case 0:return displayErrors(response.data);break;case 1:alert(response.data);$scope.dataItem={nome:"",nome_usuario:"",email:"",senha:"",ativo:true,tipo:0,permissoes:getDefaultPermissoes(),cliente_id:""};$scope.grid.dataSource.read();$scope.loaderForm=false;break;case 2:alert(response.data);$scope.loaderForm=false;break;}},function(response){$scope.loaderForm=false;});}}
update=function(){if(AuthService.checkUpdate("artigos")&&AuthService.checkUpdate("conteudo")){var user=$resource("/admin/usuarios",{_token:CSRF_TOKEN},{update:{method:"PUT"}});$scope.loaderForm=true;user.update($scope.dataItem,function(response){switch(response.status){case 0:return displayErrors(response.data);break;case 1:alert(response.data);$scope.grid.dataSource.read();$scope.loaderForm=false;break;case 2:alert(response.data);$scope.loaderForm=false;break;}},function(response){$scope.loaderForm=false;});}}
$scope.delete=function(dataItem){if(AuthService.checkDelete("artigos")&&AuthService.checkDelete("conteudo")){if(confirm("Deseja deletar esse(s) registro(s)?")){var ids=[];var type="single";var id=dataItem.id;if(dataItem=="multiple"){if($(".itemGrid:checked").length==0){alert("Nenhum item marcado.");return false;}
$(".itemGrid:checked").map(function(key,value){ids.push(value.value);});type="multiple";id=ids[0];}
var user=$resource("/admin/usuarios");$scope.loaderForm=true;user.delete({id:id,ids:[ids],type:type,_token:CSRF_TOKEN},function(response){switch(response.status){case 2:alert(response.data);$scope.loaderForm=false;break;default:if(type=="multiple"){displayMessagesArray(response.data);}else{alert(response.data);}
$scope.grid.dataSource.read();$scope.loaderForm=false;break;}},function(response){alert("Error: "+response.data);$scope.loaderForm=false;});}}}
displayMessagesArray=function(data){var messages="";angular.forEach(data,function(value,key){messages+=value+"\n";});alert(messages);}
displayErrors=function(errors){var messages="";angular.forEach(errors,function(value,key){if(value.length>1){angular.forEach(value,function(value,key){messages+=value+"\n";});}else{messages+=value+"\n";}});alert(messages);$scope.loaderForm=false;}
optionsGrid=function(){return $scope.optionsGrid={dataSource:{type:"json",transport:{read:'/admin/artigos/grid'},serpageSize:10,serverPaging:true,serverFiltering:true,serverSorting:true,schema:{data:"data",total:"total",model:{id:"id",fields:{id:{type:"number"}}}}},sortable:true,reorderable:true,resizable:true,mobile:true,selectable:true,groupable:{messages:{empty:"Arraste uma coluna para agrupar"}},pageable:{refresh:true,pageSize:10,pageSizes:true,messages:{display:"{0} - {1} de {2} itens",empty:"Não Existem Itens para mostrar",page:"Página",of:"de {0}",itemsPerPage:"itens por Página",first:"Primeira Página",previous:"Página Anterior",next:"Próxima Página",last:"Última Página",refresh:"Atualizar",}},filterable:{extra:true,messages:{clear:"Limpar",filter:"buscar",info:"Registros que:",and:"e",or:"ou",selectValue:"Selecione",},operators:{string:{startswith:"Começa com",endswith:"Termina com",eq:"Seja igual a",neq:"Não é igual a",contains:"Contém",doesnotcontain:"Não contém",},date:{eq:"Igual a",gte:"Maior ou igual a",gt:"Maior que",lte:"Menor ou igual a",lt:"Menor que"},number:{eq:"Igual a",gte:"Maior ou igual a",gt:"Maior que",lte:"Menor ou igual a",lt:"Menor que"},enums:{eq:"Seja igual a",neq:"Não é igual a"}}},toolbar:[{template:"<button class='k-button' ng-disabled='access_create == false' ng-click='window.new()'><span class='k-icon k-i-plus' style='padding:0 2px 0 0;'></span></button>"},{template:"<button class='k-button' ng-click='delete(\"multiple\")'><span class='k-icon k-i-close' style='padding:0 2px 0 0;'></span></button>"}],columns:[{title:"<input type='checkbox' ng-model='checkAll' />",width:"30px",template:"<input type='checkbox' class='itemGrid' ng-model='itensGrid' ng-value='dataItem.id' ng-checked='checkAll'/>",filterable:false,sortable:false},{field:"id",title:"Id",type:"number",width:"50px"},{command:[{template:"<button class=\'k-button\' ng-disabled='access_update == false' ng-click=\'window.edit(dataItem)\'><span class='k-icon k-i-pencil' style='padding:0 2px 0 0;'></span></button>"},{template:"<button  class=\'k-button\' ng-disabled='access_destroy == false' ng-click=\'delete(dataItem)\'><span class='k-icon k-i-close' style='padding:0 2px 0 0;'></span></button>"}]}]}}
optionsModal=function(){$scope.conf_modal={title:'Artigos',width:'1000',height:'500',actions:["Minimize","Maximize","Close"],visible:false,modal:true,resizable:true,animation:{close:{duration:200},open:{duration:200}}}}
optionsCombo=function(){$scope.comboCategoria={filter:'contains',dataTextField:"nome",dataValueField:"id",dataSource:{transport:{read:{url:"/admin/conteudo_categoria/combo",async:true}}}}}
init=function(){AuthService.checkView("conteudo");AuthService.checkView("artigos");optionsGrid();optionsCombo();optionsModal();}
init();});$app.controller('UsuariosController',function($scope,$http,$window,$location,$resource,MenuService,AuthService,CSRF_TOKEN){$scope.title="Usuários";$scope.window={new:function(){$scope.dataItem={nome:"",nome_usuario:"",email:"",senha:"",ativo:true,permissoes:""};$scope.dataItem.permissoes=getDefaultPermissoes();$scope.formView="new";$scope.formAction="create()";$scope.modal.setOptions({title:"Adicionar Usuário"});$scope.modal.open().center();},edit:function(dataItem){dataItem.senha="";$scope.formView="edit";$scope.formAction="update()";$scope.modal.setOptions({title:"Editar Úsuario: "+dataItem.id});$scope.modal.open().center();$scope.dataItem=dataItem;$scope.dataItem.permissoes=verificaChangePermissoes(dataItem.permissoes);},close:function(){$scope.modal.close();}}
$scope.executeAction=function(action){switch(action){case"create()":create();break;case"update()":update();break;}}
create=function(){if(AuthService.checkCreate("usuarios")){var user=$resource("/admin/usuarios",{_token:CSRF_TOKEN});$scope.loaderForm=true;user.save($scope.dataItem,function(response){switch(response.status){case 0:return displayErrors(response.data);break;case 1:alert(response.data);$scope.dataItem={nome:"",nome_usuario:"",email:"",senha:"",ativo:true,tipo:0,permissoes:getDefaultPermissoes(),cliente_id:""};$scope.grid.dataSource.read();$scope.loaderForm=false;break;case 2:alert(response.data);$scope.loaderForm=false;break;}},function(response){$scope.loaderForm=false;});}}
update=function(){if(AuthService.checkUpdate("usuarios")){var user=$resource("/admin/usuarios",{_token:CSRF_TOKEN},{update:{method:"PUT"}});$scope.loaderForm=true;user.update($scope.dataItem,function(response){switch(response.status){case 0:return displayErrors(response.data);break;case 1:alert(response.data);$scope.grid.dataSource.read();$scope.loaderForm=false;break;case 2:alert(response.data);$scope.loaderForm=false;break;}},function(response){$scope.loaderForm=false;});}}
$scope.delete=function(dataItem){if(AuthService.checkDelete("usuarios")){if(confirm("Deseja deletar esse(s) registro(s)?")){var ids=[];var type="single";var id=dataItem.id;if(dataItem=="multiple"){if($(".itemGrid:checked").length==0){alert("Nenhum item marcado.");return false;}
$(".itemGrid:checked").map(function(key,value){ids.push(value.value);});type="multiple";id=ids[0];}
var user=$resource("/admin/usuarios");$scope.loaderForm=true;user.delete({id:id,ids:[ids],type:type,_token:CSRF_TOKEN},function(response){switch(response.status){case 2:alert(response.data);$scope.loaderForm=false;break;default:if(type=="multiple"){displayMessagesArray(response.data);}else{alert(response.data);}
$scope.grid.dataSource.read();$scope.loaderForm=false;break;}},function(response){alert("Error: "+response.data);$scope.loaderForm=false;});}}}
displayMessagesArray=function(data){var messages="";angular.forEach(data,function(value,key){messages+=value+"\n";});alert(messages);}
displayErrors=function(errors){var messages="";angular.forEach(errors,function(value,key){if(value.length>1){angular.forEach(value,function(value,key){messages+=value+"\n";});}else{messages+=value+"\n";}});alert(messages);$scope.loaderForm=false;}
optionsGrid=function(){return $scope.optionsGrid={dataSource:{type:"json",transport:{read:'/admin/usuarios/grid'},serpageSize:10,serverPaging:true,serverFiltering:true,serverSorting:true,schema:{data:"data",total:"total",model:{id:"id",fields:{id:{type:"number"}}}}},sortable:true,reorderable:true,resizable:true,mobile:true,selectable:true,groupable:{messages:{empty:"Arraste uma coluna para agrupar"}},pageable:{refresh:true,pageSize:10,pageSizes:true,messages:{display:"{0} - {1} de {2} itens",empty:"Não Existem Itens para mostrar",page:"Página",of:"de {0}",itemsPerPage:"itens por Página",first:"Primeira Página",previous:"Página Anterior",next:"Próxima Página",last:"Última Página",refresh:"Atualizar",}},filterable:{extra:true,messages:{clear:"Limpar",filter:"buscar",info:"Registros que:",and:"e",or:"ou",selectValue:"Selecione",},operators:{string:{startswith:"Começa com",endswith:"Termina com",eq:"Seja igual a",neq:"Não é igual a",contains:"Contém",doesnotcontain:"Não contém",},date:{eq:"Igual a",gte:"Maior ou igual a",gt:"Maior que",lte:"Menor ou igual a",lt:"Menor que"},number:{eq:"Igual a",gte:"Maior ou igual a",gt:"Maior que",lte:"Menor ou igual a",lt:"Menor que"},enums:{eq:"Seja igual a",neq:"Não é igual a"}}},toolbar:[{template:"<button class='k-button' ng-disabled='access_create == false' ng-click='window.new()'><span class='k-icon k-i-plus' style='padding:0 2px 0 0;'></span></button>"},{template:"<button class='k-button' ng-click='delete(\"multiple\")'><span class='k-icon k-i-close' style='padding:0 2px 0 0;'></span></button>"}],columns:[{title:"<input type='checkbox' ng-model='checkAll' />",width:"30px",template:"<input type='checkbox' class='itemGrid' ng-model='itensGrid' ng-value='dataItem.id' ng-checked='checkAll'/>",filterable:false,sortable:false},{field:"id",title:"Id",type:"number",width:"50px"},{field:"nome",title:"Nome",type:"text"},{field:"nome_usuario",title:"Usuário",type:"text"},{field:"email",title:"Email",type:"text"},{command:[{template:"<button class=\'k-button\' ng-disabled='access_update == false' ng-click=\'window.edit(dataItem)\'><span class='k-icon k-i-pencil' style='padding:0 2px 0 0;'></span></button>"},{template:"<button  class=\'k-button\' ng-disabled='access_destroy == false' ng-click=\'delete(dataItem)\'><span class='k-icon k-i-close' style='padding:0 2px 0 0;'></span></button>"}]}]}}
optionsModal=function(){$scope.conf_modal={title:'Usuários',width:'800',height:'500',actions:["Minimize","Maximize","Close"],visible:false,modal:true,resizable:true,animation:{close:{duration:200},open:{duration:200}}}}
contemInPermissoes=function(apelido,permissoes){var data={resp:false,item:[]};if(data.resp==false){angular.forEach(permissoes,function(value,key){if(apelido==value.nome){data.resp=true;data.item=value;}
if(value.itemParent==true){angular.forEach(value.itens,function(value,key){if(apelido==value.nome){data.resp=true;data.item=value;}});}});}
return data;}
verificaChangePermissoes=function(permissoes){var menu=MenuService.getMenu();var permissoes=angular.fromJson(permissoes);var permissoesOut=[];angular.forEach(menu,function(value,key){var data=contemInPermissoes(value.apelido,permissoes);if(data.resp){var item=data.item;permissoesOut.push(item);}else{var item={display:value.display,nome:value.apelido,view:false,delete:false,create:false,update:false};permissoesOut.push(item);}
if(value.itemParent==true){angular.forEach(value.itens,function(value,key){var data=contemInPermissoes(value.apelido,permissoes);if(data.resp){var item=data.item;permissoesOut.push(item);}else{var item={display:value.display,nome:value.apelido,view:false,delete:false,create:false,update:false};permissoesOut.push(item);}});}});return permissoesOut;}
getDefaultPermissoes=function(){var permissoes=[];var menu=MenuService.getMenu();angular.forEach(menu,function(value,key){var item={display:value.display,nome:value.apelido,view:true,delete:true,create:true,update:true};permissoes.push(item);if(value.itemParent==true){angular.forEach(value.itens,function(value,key){var item={display:value.display,nome:value.apelido,view:true,delete:true,create:true,update:true};permissoes.push(item);});}});return permissoes;}
init=function(){AuthService.checkView("usuarios");optionsGrid();optionsModal();}
init();});$app.controller('SiteConfigController',function($scope,$resource,CSRF_TOKEN,AuthService){$scope.title="Configuração Global";$scope.update=function(){alert("teste");}
optionsCombo=function(){$scope.comboSeguranca={filter:'contains',dataTextField:"text",dataValueField:"value",dataSource:{data:[{text:"Nenhuma",value:"0"},{text:"SSL",value:"1"},{text:"TSL",value:"2"}]}}}
init=function(){AuthService.checkView("configuracao-global");optionsCombo();$scope.dataItem={nome:"",ativo:1};}
init();});$app.controller('LogsController',function($scope,$resource,AuthService,$sce){$scope.title='Logs';$scope.window={detalhe:function(dataItem){$scope.dataItem=dataItem;$scope.data_log=formatDateTime(dataItem.created_at);$scope.valor_novo=dataItem.valor_novo;$scope.valor_antigo=dataItem.valor_antigo;$scope.dataObservacoes=JSON.parse(dataItem.observacoes);$scope.observacoes=[];angular.forEach($scope.dataObservacoes,function(value,key){var i=key;var v=value.toString();if(key=="permissoes"){v=formatPermissoes(value);}
if(key!="updated_at"&&key!="created_at"){$scope.observacoes.push({index:i,valor:v});}});checkTableUsuarios(dataItem);$scope.modal.setOptions({title:"Log "+dataItem.id});$scope.modal.open().center();},close:function(){$scope.modal.close();}}
checkTableUsuarios=function(data){if(data.tabela=="usuarios"&&data.acao=="update"&&data.campo=="permissoes"){$scope.valor_antigo=formatPermissoes(data.valor_antigo);$scope.valor_novo=formatPermissoes(data.valor_novo);}}
formatDateTime=function(date){var data=date.substring(0,10).split('-');var hora=date.substring(11,19);return data[2]+"/"+data[1]+"/"+data[0]+" - "+hora;}
formatPermissoes=function(permissoes){var data=JSON.parse(permissoes);var html="";var view="";var create="";var update="";var destroy="";angular.forEach(data,function(value,key){view=value.view==true?"<span class='icon icon-checkmark'></span>":"<span class='icon icon-cancel'></span>";create=value.create==true?"<span class='icon icon-checkmark'></span>":"<span class='icon icon-cancel'></span>";update=value.update==true?"<span class='icon icon-checkmark'></span>":"<span class='icon icon-cancel'></span>";destroy=value.delete==true?"<span class='icon icon-checkmark'></span>":"<span class='icon icon-cancel'></span>";html+="<strong>"+value.display+"</strong><br>";html+=" View: "+view;html+=" Create: "+create;html+=" Update: "+update;html+=" Delete: "+destroy+"<br>";});return html;}
optionsGrid=function(){return $scope.optionsGrid={dataSource:{type:"json",transport:{read:'/admin/logs/grid'},serpageSize:10,serverPaging:true,serverFiltering:true,serverSorting:true,schema:{data:"data",total:"total",model:{id:"id",fields:{id:{type:"number"}}}}},sortable:true,reorderable:true,resizable:true,mobile:true,selectable:true,groupable:{messages:{empty:"Arraste uma coluna para agrupar"}},pageable:{refresh:true,pageSize:10,pageSizes:true,messages:{display:"{0} - {1} de {2} itens",empty:"Não Existem Itens para mostrar",page:"Página",of:"de {0}",itemsPerPage:"itens por Página",first:"Primeira Página",previous:"Página Anterior",next:"Próxima Página",last:"Última Página",refresh:"Atualizar",}},filterable:{extra:true,messages:{clear:"Limpar",filter:"buscar",info:"Registros que:",and:"e",or:"ou",selectValue:"Selecione",},operators:{string:{startswith:"Começa com",endswith:"Termina com",eq:"Seja igual a",neq:"Não é igual a",contains:"Contém",doesnotcontain:"Não contém",},date:{eq:"Igual a",gte:"Maior ou igual a",gt:"Maior que",lte:"Menor ou igual a",lt:"Menor que"},number:{eq:"Igual a",gte:"Maior ou igual a",gt:"Maior que",lte:"Menor ou igual a",lt:"Menor que"},enums:{eq:"Seja igual a",neq:"Não é igual a"}}},tolbar:[],columns:[{field:"id",title:"Id",type:"number",width:"50px"},{field:"nome_usuario",title:"Nome Usuário",type:"text"},{field:"tabela",title:"Tabela",type:"text"},{field:"acao",title:"Ação",type:"text"},{command:[{template:"<button class=\'k-button\' ng-disabled='' ng-click=\'window.detalhe(dataItem)\'><span class='icon-eye-2' style='padding:0 2px 0 0;'></span></button>"},]}]}}
optionsModal=function(){$scope.conf_modal={title:'Log',width:'800',height:'500',actions:["Minimize","Maximize","Close"],visible:false,modal:true,resizable:true,animation:{close:{duration:200},open:{duration:200}}}}
init=function(){AuthService.checkView("logs");optionsGrid();optionsModal();}
init();});$app.controller('HomeController',function($scope,$http,$window,$location,$resource,AuthService){$scope.title="Home";init=function(){AuthService.checkView("home");}
init();});$app.controller("AuthController",function($scope,$rootScope,$resource,CSRF_TOKEN,$timeout,AuthService,$location){$scope.title="Login";$scope.loaderLogin=false;$scope.displayRespLogin=false;$scope.user={nome_usuario:"",senha:""};$scope.login=function(){$scope.loaderLogin=true;var user=$resource('/admin/auth/login',{_token:CSRF_TOKEN},{post:{method:"POST"}});user.post($scope.user,function(response){if(response.status==0){$scope.loaderLogin=false;readErrors(response.data);}else{var user=response.data;AuthService.setLogin(user);AuthService.setPermissoes(user[0].permissoes);$location.path("/admin");}},function(response){$scope.respLogin="Erro no servidor.";$scope.loaderLogin=false;$scope.displayRespLogin=true;});}
$scope.logout=function(){var user=$resource('/admin/auth/logout',{_token:CSRF_TOKEN},{post:{method:"POST"}});$scope.loaderLogout=true;user.post(function(response){$(".content-right").attr("style","");$(".page-content").html("");$rootScope.loginUser=false;$rootScope.currentLink="/admin/login";$timeout(function(){$location.path('/admin/login');},500);$scope.loaderLogout=false;},function(response){alert("Erro no Servidor.");$scope.loaderLogout=false;});}
readErrors=function(messages){var data=messages;$scope.respLogin="";angular.forEach(data,function(value,key){$scope.respLogin+=value+"<br>";if(value.length>1){angular.forEach(value,function(value,key){$scope.respLogin+=value+"<br>";});}});$timeout(function(){$scope.displayRespLogin=true;},500);}});