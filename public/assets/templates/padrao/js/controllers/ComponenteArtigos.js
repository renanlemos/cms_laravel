$app.controller('ComponenteArtigosController',function($timeout,$scope,$location,$resource,$filter,filterFilter){
	
	
    pagination = function(){
    	$scope.search = {titulo:""};
    	$scope.filtered = [];
    	$scope.itemsPerPage = 5;
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
			return Math.ceil($scope.filtered.length/$scope.itemsPerPage);
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
		});

    }
 	init = function(){
		$scope.artigos = [];
		pagination();
	}
	init();
});	    	
