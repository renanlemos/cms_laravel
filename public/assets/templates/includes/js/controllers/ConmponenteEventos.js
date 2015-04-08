$app.controller('ComponenteEventosController',function($timeout,$scope,$location,$resource,$filter,$compile){
	
	
    pagination = function(){
    	$scope.search = {titulo:""};
    	$scope.filtered = [];
    	$scope.repeat = [];
    	$scope.currentPage = 1;

		$scope.range = function() {
		    var rangeSize = 3;
		    var ret = [];
		    var start;
		    start = $scope.currentPage;
	
		    if(start > $scope.pageCount()-rangeSize) {
		      start = $scope.pageCount()-rangeSize+1;
		    }
		    for (var i=start; i < start+rangeSize; i++) {
		      if(i > 0){	
		      	ret.push(i);
		      }	
		    }
		    return ret;
		};
    	$scope.prevPage = function() {
		    if ($scope.currentPage > 1) {
		      $scope.currentPage--;
		    }
  		};
		$scope.prevPageDisabled = function() {
    		return $scope.currentPage === 1 ? "disabled" : "";
  		};
		$scope.pageCount = function(){
			return Math.ceil($scope.filtered.length/$scope.categoria_parametros.paginacao_itens_por_pagina);
		}	
	  	$scope.nextPage = function() {
	    	if ($scope.currentPage < $scope.pageCount()) {
	      		$scope.currentPage++;
	    	}
	  	};
		$scope.nextPageDisabled = function() {
	    	return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
	  	};
		$scope.setPage = function(n) {
	    	$scope.currentPage = n;
	  	};
	  	$scope.firstPage = function(){
	  		$scope.currentPage = 1;
	  	}
	  	$scope.lastPage = function(){
	  		$scope.currentPage = $scope.pageCount();
	  	}
	    $scope.$watch(function () {
	    	$scope.filtered = $scope.$eval("eventos | filter:search");
    		if(($scope.categoria_parametros.paginacao)&&($scope.categoria_parametros.formulario_busca)){
    			$scope.repeat = $scope.$eval("filtered | startFrom:(currentPage-1)*categoria_parametros.paginacao_itens_por_pagina | limitTo: categoria_parametros.paginacao_itens_por_pagina");
    		}else if($scope.categoria_parametros.formulario_busca){
    			$scope.repeat = $scope.$eval("filtered");
    		}else if($scope.categoria_parametros.paginacao){
    			$scope.repeat = $scope.$eval("eventos | startFrom:(currentPage-1)*categoria_parametros.paginacao_itens_por_pagina | limitTo: categoria_parametros.paginacao_itens_por_pagina");
    		}else{
    			$scope.repeat = $scope.$eval("eventos");
    		}
		});
	}
	$scope.getApeldidoCategoriaProduto = function(categoria_id){
		var menu_itens = $scope.menu_itens;
		var apelido = "";
		var search = false;
		angular.forEach(menu_itens,function(v,k){
			if(search == false){
				var parametros = angular.fromJson(v.parametros);
				if(categoria_id == parametros.produto_categoria_id){
					apelido = '/'+v.apelido;
					search = true;
				}
			}	
		});
		return apelido;
	}
   	init = function(){
 		$scope.eventos = [];
 		$scope.menu_itens = [];
		$scope.categoria_parametros = [];
		pagination();
	}
	init();
});	    	
