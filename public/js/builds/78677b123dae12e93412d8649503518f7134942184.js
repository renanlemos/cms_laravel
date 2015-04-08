$app.controller('ComponenteEventosController',function($timeout,$scope,$location,$resource,$filter,$compile){pagination=function(){$scope.search={titulo:""};$scope.filtered=[];$scope.repeat=[];$scope.currentPage=1;$scope.range=function(){var rangeSize=3;var ret=[];var start;start=$scope.currentPage;if(start>$scope.pageCount()-rangeSize){start=$scope.pageCount()-rangeSize+1;}
for(var i=start;i<start+rangeSize;i++){if(i>0){ret.push(i);}}
return ret;};$scope.prevPage=function(){if($scope.currentPage>1){$scope.currentPage--;}};$scope.prevPageDisabled=function(){return $scope.currentPage===1?"disabled":"";};$scope.pageCount=function(){return Math.ceil($scope.filtered.length/$scope.categoria_parametros.paginacao_itens_por_pagina);}
$scope.nextPage=function(){if($scope.currentPage<$scope.pageCount()){$scope.currentPage++;}};$scope.nextPageDisabled=function(){return $scope.currentPage===$scope.pageCount()?"disabled":"";};$scope.setPage=function(n){$scope.currentPage=n;};$scope.firstPage=function(){$scope.currentPage=1;}
$scope.lastPage=function(){$scope.currentPage=$scope.pageCount();}
$scope.$watch(function(){$scope.filtered=$scope.$eval("eventos | filter:search");if(($scope.categoria_parametros.paginacao)&&($scope.categoria_parametros.formulario_busca)){$scope.repeat=$scope.$eval("filtered | startFrom:(currentPage-1)*categoria_parametros.paginacao_itens_por_pagina | limitTo: categoria_parametros.paginacao_itens_por_pagina");}else if($scope.categoria_parametros.formulario_busca){$scope.repeat=$scope.$eval("filtered");}else if($scope.categoria_parametros.paginacao){$scope.repeat=$scope.$eval("eventos | startFrom:(currentPage-1)*categoria_parametros.paginacao_itens_por_pagina | limitTo: categoria_parametros.paginacao_itens_por_pagina");}else{$scope.repeat=$scope.$eval("eventos");}});}
$scope.getApeldidoCategoriaProduto=function(categoria_id){var menu_itens=$scope.menu_itens;var apelido="";var search=false;angular.forEach(menu_itens,function(v,k){if(search==false){var parametros=angular.fromJson(v.parametros);if(categoria_id==parametros.produto_categoria_id){apelido='/'+v.apelido;search=true;}}});return apelido;}
init=function(){$scope.eventos=[];$scope.menu_itens=[];$scope.categoria_parametros=[];pagination();}
init();});$app.controller('ComponentesController',function($scope,$location,$resource,$routeParams,linkData){init=function(){$scope.linkData=linkData;}
init();});$app.controller('ComponenteContatosController',function($scope,$location,$resource,PATH_TEMPLATES){$scope.sendEmail=function(){var request=$resource('/CmsComponentes/componente-contatos/sendEmail',{},{post:{method:'POST'}});$scope.loaderForm=true;request.post($scope.contato_form,function(response){switch(response.status){case 0:var errors=displayErrors(response.data);clearClassError();addClassError(errors.keys);alert(errors.messages);break;case 1:clearInputs();clearClassError();alert(response.data);break;case 3:alert('Erro ao enviar Email.\nErro:'+response.data);break;}
$scope.loaderForm=false;},function(response){clearClassError();alert("Não foi possível enviar a mensagem.");$scope.loaderForm=false;});}
clearInputs=function(){$('.unico-contato form input').val("");$('.unico-contato form textarea').val("");}
clearClassError=function(){var inputs=$('.unico-contato form').find('.error');angular.forEach(inputs,function(v,k){$(v).removeClass('error');});}
addClassError=function(errors){angular.forEach(errors,function(v,k){var input='#contato_form_'+v;$(input).addClass('error');});}
displayErrors=function(errors){var messages="";var keys=[];angular.forEach(errors,function(value,key){keys.push(key);if(value.length>1){angular.forEach(value,function(value,key){messages+=value+"\n";});}else{messages+=value+"\n";}});return{messages:messages,keys:keys};}
init=function(){$scope.contato_form={nome:"",email:"",telefone:"",assunto:"",mensagem:"",contato_id:"",config_global:""},$scope.image_loader=PATH_TEMPLATES+"componentes/contato/images/loader.gif";$scope.loaderForm=false;}
init();});$app.controller('ComponenteArtigosController',function($timeout,$scope,$location,$resource,$filter,$compile){pagination=function(){$scope.search={titulo:""};$scope.filtered=[];$scope.repeat=[];$scope.currentPage=1;$scope.range=function(){var rangeSize=3;var ret=[];var start;start=$scope.currentPage;if(start>$scope.pageCount()-rangeSize){start=$scope.pageCount()-rangeSize+1;}
for(var i=start;i<start+rangeSize;i++){if(i>0){ret.push(i);}}
return ret;};$scope.prevPage=function(){if($scope.currentPage>1){$scope.currentPage--;}};$scope.prevPageDisabled=function(){return $scope.currentPage===1?"disabled":"";};$scope.pageCount=function(){return Math.ceil($scope.filtered.length/$scope.categoria_parametros.paginacao_itens_pagina);}
$scope.nextPage=function(){if($scope.currentPage<$scope.pageCount()){$scope.currentPage++;}};$scope.nextPageDisabled=function(){return $scope.currentPage===$scope.pageCount()?"disabled":"";};$scope.setPage=function(n){$scope.currentPage=n;};$scope.firstPage=function(){$scope.currentPage=1;}
$scope.lastPage=function(){$scope.currentPage=$scope.pageCount();}
$scope.$watch(function(){$scope.filtered=$scope.$eval("artigos | filter:search");if(($scope.categoria_parametros.paginacao)&&($scope.categoria_parametros.formulario_busca)){$scope.repeat=$scope.$eval("filtered | startFrom:(currentPage-1)*categoria_parametros.paginacao_itens_pagina | limitTo: categoria_parametros.paginacao_itens_pagina");}else if($scope.categoria_parametros.formulario_busca){$scope.repeat=$scope.$eval("filtered");}else if($scope.categoria_parametros.paginacao){$scope.repeat=$scope.$eval("artigos | startFrom:(currentPage-1)*categoria_parametros.paginacao_itens_pagina | limitTo: categoria_parametros.paginacao_itens_pagina");}else{$scope.repeat=$scope.$eval("artigos");}});}
init=function(){$scope.artigos=[];$scope.categoria_parametros=[];pagination();}
init();});$app.controller('ComponenteProdutosController',function($timeout,$scope,$location,$resource,$filter,$compile){pagination=function(){$scope.search={titulo:""};$scope.filtered=[];$scope.repeat=[];$scope.currentPage=1;$scope.range=function(){var rangeSize=3;var ret=[];var start;start=$scope.currentPage;if(start>$scope.pageCount()-rangeSize){start=$scope.pageCount()-rangeSize+1;}
for(var i=start;i<start+rangeSize;i++){if(i>0){ret.push(i);}}
return ret;};$scope.prevPage=function(){if($scope.currentPage>1){$scope.currentPage--;}};$scope.prevPageDisabled=function(){return $scope.currentPage===1?"disabled":"";};$scope.pageCount=function(){return Math.ceil($scope.filtered.length/$scope.categoria_parametros.paginacao_itens_por_pagina);}
$scope.nextPage=function(){if($scope.currentPage<$scope.pageCount()){$scope.currentPage++;}};$scope.nextPageDisabled=function(){return $scope.currentPage===$scope.pageCount()?"disabled":"";};$scope.setPage=function(n){$scope.currentPage=n;};$scope.firstPage=function(){$scope.currentPage=1;}
$scope.lastPage=function(){$scope.currentPage=$scope.pageCount();}
$scope.$watch(function(){$scope.filtered=$scope.$eval("produtos | filter:search");if(($scope.categoria_parametros.paginacao)&&($scope.categoria_parametros.formulario_busca)){$scope.repeat=$scope.$eval("filtered | startFrom:(currentPage-1)*categoria_parametros.paginacao_itens_por_pagina | limitTo: categoria_parametros.paginacao_itens_por_pagina");}else if($scope.categoria_parametros.formulario_busca){$scope.repeat=$scope.$eval("filtered");}else if($scope.categoria_parametros.paginacao){$scope.repeat=$scope.$eval("produtos | startFrom:(currentPage-1)*categoria_parametros.paginacao_itens_por_pagina | limitTo: categoria_parametros.paginacao_itens_por_pagina");}else{$scope.repeat=$scope.$eval("produtos");}});}
$scope.getApeldidoCategoriaProduto=function(categoria_id){var menu_itens=$scope.menu_itens;var apelido="";var search=false;angular.forEach(menu_itens,function(v,k){if(search==false){var parametros=angular.fromJson(v.parametros);if(categoria_id==parametros.produto_categoria_id){apelido='/'+v.apelido;search=true;}}});return apelido;}
init=function(){$scope.produtos=[];$scope.menu_itens=[];$scope.categoria_parametros=[];pagination();}
init();});