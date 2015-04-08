$app.directive('ordemModulo', function($resource,$rootScope) {
  return {
    restrict: "E",
    scope:{
      modulo_posicao_id: "=id"
    },
    template: "<div class='row-fluid status-ordem-modulo'></div><div class='content-ordem-modulo'><ul class='nav nav-ordem-modulo' sortable-ordem-modulo='itensSortable'><li ng-repeat='o in ordemItens' id='item_{{o.id}}'>{{$index+1}} - {{o.titulo}}</li></ul></div>",
    link: function(scope, element, attrs, modelCtrl) {

      var request = $resource('/admin/modulos/getModulosOrdem');
      
      element.find(".status-ordem-modulo").addClass('btn-primary').html("<span>Carregando Módulos...</span>");
      request.query({modulo_posicao_id:scope.modulo_posicao_id},function(response){
        scope.ordemItens = response;
        element.find(".status-ordem-modulo").addClass('btn-success').removeClass('btn-danger btn-primary').html("<span>"+response.length+" módulos Carregados.</span>");
       
      },function(error){
        element.find(".status-ordem-modulo").addClass('btn-danger').removeClass('btn-success btn-primary').html("<span>Erro Carregar Módulos.</span>");
      });

    }
  }
});
$app.directive('sortableOrdemModulo',function($rootScope){
  return{
    restrict: 'A',
    link: function(scope,element,attrs,model){
      element.sortable({
        cursor: 'move',
        items: 'li',
        update: function(){
          $rootScope.itensOrdemModuloSortable = element.sortable('toArray');
          $rootScope.$apply();
        }
      });
      element.disableSelection();
      
      
    }
  }
});
$app.directive('sortableModuloProdutos',function($rootScope){
  return{
    restrict: 'A',
    scope: true,
    link: function(scope,element,attrs,model){
      element.sortable({
        cursor: 'move',
        items: 'li',
        update: function(){
          var data = element.sortable('toArray');
          var produtos = scope.dataItem.parametros.produtos;
          var itens = [];
          
          angular.forEach(data,function(value,key){
            var id = value.split('_');
            var produto = getItem(id[1]);
            itens.push(produto);
          });
          function getItem(id){
            var item = [];
            angular.forEach(produtos,function(v,k){
              if(item.length == 0){
                if(v.id == id){
                  item = v;
                }
              }
            });
            return item;
          }
          scope.dataItem.parametros.produtos = itens;
          scope.$apply();
        }
      });
      element.disableSelection();
      
      
    }
  }
});