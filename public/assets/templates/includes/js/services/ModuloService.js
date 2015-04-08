$app.service('ModuloService',function($resource,$http,$rootScope){
	  
  this.readModulos = function(){
    var resquest = $resource('/CmsModulos/get-modulos');
    $rootScope.CmsModulos = resquest.query(function(response){return response;});
   }
   this.getModulos = function(){
    return $rootScope.CmsModulos;
  }

}); 