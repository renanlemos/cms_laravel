$app.controller('ComponenteArtigosController',function($timeout,$scope,$location,$resource,$filter,$compile){
	
	
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
			return Math.ceil($scope.filtered.length/$scope.categoria_parametros.paginacao_itens_pagina);
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
	    	$scope.filtered = $scope.$eval("artigos | filter:search");
    		if(($scope.categoria_parametros.paginacao)&&($scope.categoria_parametros.formulario_busca)){
    			$scope.repeat = $scope.$eval("filtered | startFrom:(currentPage-1)*categoria_parametros.paginacao_itens_pagina | limitTo: categoria_parametros.paginacao_itens_pagina");
    		}else if($scope.categoria_parametros.formulario_busca){
    			$scope.repeat = $scope.$eval("filtered");
    		}else if($scope.categoria_parametros.paginacao){
    			$scope.repeat = $scope.$eval("artigos | startFrom:(currentPage-1)*categoria_parametros.paginacao_itens_pagina | limitTo: categoria_parametros.paginacao_itens_pagina");
    		}else{
    			$scope.repeat = $scope.$eval("artigos");
    		}
    		
		});

    }
   	init = function(){
 						
		$scope.artigos = [];
		$scope.categoria_parametros = [];
		pagination();
	}
	init();
});	    	
