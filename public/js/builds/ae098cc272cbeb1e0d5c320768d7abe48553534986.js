$app.controller('QuemSomosController',function($scope,$http,$window,$location,$resource){$scope.title="Quem Somos";init=function(){}
init();});$app.controller('HomeController',function($scope,$http,$window,$location,$resource){$scope.title="Home";init=function(){}
init();});$app.controller('ContatoController',function($scope,$resource){$scope.title="Contato";init=function(){}});$app.controller('ComponentesController',function($scope,$location,$resource,$routeParams,linkData){init=function(){$scope.linkData=linkData;}
init();});$app.controller('ComponenteContatosController',function($scope,$location,$resource,PATH_TEMPLATES){$scope.sendEmail=function(){var request=$resource('/CmsComponentes/componente-contatos/sendEmail',{},{post:{method:'POST'}});$scope.loaderForm=true;request.post($scope.contato_form,function(response){switch(response.status){case 0:var errors=displayErrors(response.data);clearClassError();addClassError(errors.keys);alert(errors.messages);break;case 1:clearInputs();clearClassError();alert(response.data);break;case 3:alert('Erro ao enviar Email.\nErro:'+response.data);break;}
$scope.loaderForm=false;},function(response){clearClassError();alert("Não foi possível enviar a mensagem.");$scope.loaderForm=false;});}
clearInputs=function(){$('.unico-contato form input').val("");$('.unico-contato form textarea').val("");}
clearClassError=function(){var inputs=$('.unico-contato form').find('.error');angular.forEach(inputs,function(v,k){$(v).removeClass('error');});}
addClassError=function(errors){angular.forEach(errors,function(v,k){var input='#contato_form_'+v;$(input).addClass('error');});}
displayErrors=function(errors){var messages="";var keys=[];angular.forEach(errors,function(value,key){keys.push(key);if(value.length>1){angular.forEach(value,function(value,key){messages+=value+"\n";});}else{messages+=value+"\n";}});return{messages:messages,keys:keys};}
init=function(){$scope.contato_form={nome:"",email:"",telefone:"",assunto:"",mensagem:"",contato_id:"",config_global:""},$scope.image_loader=PATH_TEMPLATES+"componentes/contato/images/loader.gif";$scope.loaderForm=false;}
init();});$app.controller('ComponenteArtigosController',function($timeout,$scope,$location,$resource,$filter,filterFilter){pagination=function(){$scope.search={titulo:""};$scope.filtered=[];$scope.itemsPerPage=5;$scope.currentPage=1;$scope.range=function(){var rangeSize=3;var ret=[];var start;start=$scope.currentPage;if(start>$scope.pageCount()-rangeSize){start=$scope.pageCount()-rangeSize+1;}
for(var i=start;i<start+rangeSize;i++){if(i>0){ret.push(i);}}
return ret;};$scope.prevPage=function(){if($scope.currentPage>1){$scope.currentPage--;}};$scope.prevPageDisabled=function(){return $scope.currentPage===1?"disabled":"";};$scope.pageCount=function(){return Math.ceil($scope.filtered.length/$scope.itemsPerPage);}
$scope.nextPage=function(){if($scope.currentPage<$scope.pageCount()){$scope.currentPage++;}};$scope.nextPageDisabled=function(){return $scope.currentPage===$scope.pageCount()?"disabled":"";};$scope.setPage=function(n){$scope.currentPage=n;};$scope.firstPage=function(){$scope.currentPage=1;}
$scope.lastPage=function(){$scope.currentPage=$scope.pageCount();}
$scope.$watch(function(){$scope.filtered=$scope.$eval("artigos | filter:search");});}
init=function(){$scope.artigos=[];pagination();}
init();});