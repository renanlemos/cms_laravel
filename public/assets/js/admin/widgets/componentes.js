$app.directive('fileImagesService', function($resource,$rootScope,FileService,CSRF_TOKEN,$timeout) {
  var templateHtml = "";
  templateHtml += "<div class='row-fluid status-file-uploads-images btn-primary'><div class='body'></div></div><div class='content-file-images-service'>";
  templateHtml += "<div class='row-fluid'><div ng-repeat='i in images' class='item'><img src='{{path}}{{i.value}}' />";
  templateHtml += "<div class='row-fluid'><button type='button' class='btn btn-danger delete' ng-click='deleteFileService(path,i.value,$index)'><span class='icon icon-remove'></span></button></div>";
  templateHtml += "</div></div></div>"; 
  
  return {
    restrict: "E",
    scope:{
      path: "@path",
      images: "=images",
      combo_id: "@combo", 
      refreshCombo: "@refreshCombo"
    },
    template: templateHtml,
    link: function(scope,element,attrs,modelCtrl) {
      var status = element.find('.status-file-uploads-images');
      var options = {refresh:scope.refreshCombo,combo_id: scope.combo_id};

      scope.deleteFileService = function(pasta,file,index){
        status.show('fade').find('.body').html('- Deletando arquivo.');
        var path = pasta+file;
        var resquest = $resource('/admin/files/delete',{_token:CSRF_TOKEN,path:path});
        resquest.delete(function(response){
          status.show('fade').find('.body').html(response.data);
          if(response.status == 1){
             $rootScope.fileImagesService.splice($rootScope.fileImagesService.indexOf($rootScope.fileImagesService[index]),1);
             if(options.refresh == 'true'){
              var combo = $(options.combo_id).data('kendoComboBox');
              combo.dataSource.read(); 
              $timeout(function(){
                status.hide('fade').find('.body').html('');
              },3000)
              
            }
          }
        },function(response){
          status.show('fade').find('.body').html('- Erro no servidor.');
        });
      }
    }
  }
});
$app.directive('modificaOrdem', function($resource,$rootScope,$compile) {
  return {
    restrict: "E",
    scope:{
      route: "@route",
      params: "=params",
      campo: "@campo",
      path_imagem: "@pathImagem"
    },
    link: function(scope, element, attrs, modelCtrl) {

      var template = "";
      if(scope.campo == 'imagem'){
         template = "<div class='row-fluid status-ordem-modulo'></div><div class='content-ordem-modulo'><ul class='nav nav-ordem-modulo' sortable-ordem='itensSortable'><li ng-repeat='o in ordemItens' id='item_{{o.id}}'>{{$index+1}} - <img src='{{path_imagem}}{{o."+scope.campo+"}}' width='50px'/></li></ul></div>";
      }else{
        template = "<div class='row-fluid status-ordem-modulo'></div><div class='content-ordem-modulo'><ul class='nav nav-ordem-modulo' sortable-ordem='itensSortable'><li ng-repeat='o in ordemItens' id='item_{{o.id}}'>{{$index+1}} - {{o."+scope.campo+"}}</li></ul></div>";
      }
      var el = angular.element(template);
      var compile = $compile(el)(scope);
      element.html(compile);

      scope.$on('updateOrdemItens',function(event,data){updateOrdem(event,data)});

      var updateOrdem = function(event,data){
        var itens = data;
        var produtos = scope.ordemItens;
        var new_itens = [];
        angular.forEach(itens,function(v,k){
          var id = v.split('_');
          id = id[1];
          angular.forEach(produtos,function(v,k){
            if(v.id == id){
              new_itens.push(v);
              return false;
            }
          });
        });
        scope.ordemItens = new_itens;
        scope.$apply();
      }

      function getOrdem(){
        var request = $resource(scope.route,scope.params);
      
        element.find(".status-ordem-modulo").addClass('btn-primary').html("<span>Carregando...</span>");
        request.query(function(response){
          scope.ordemItens = response;
          element.find(".status-ordem-modulo").addClass('btn-success').removeClass('btn-danger btn-primary').html("<span>"+response.length+" registros Carregados.</span>");
         
        },function(error){
          element.find(".status-ordem-modulo").addClass('btn-danger').removeClass('btn-success btn-primary').html("<span>Erro Carregar Registros.</span>");
        });
      }
      getOrdem();

    }
  }
});
$app.directive('sortableOrdem',function($rootScope){
  return{
    restrict: 'A',
    link: function(scope,element,attrs,model){
      element.sortable({
        cursor: 'move',
        items: 'li',
        update: function(){
          var data = element.sortable('toArray');
          $rootScope.itensOrdemSortable = element.sortable('toArray');
          scope.$emit('updateOrdemItens',data);
          $rootScope.$apply();
        }
      });
      element.disableSelection();
      
      
    }
  }
});
$app.directive('sortableOrdemFilters',function($rootScope){
  return{
    restrict: 'A',
    link: function(scope,element,attrs,model){
      element.sortable({
        cursor: 'move',
        items: 'li',
        update: function(){
          var data = element.sortable('toArray');
          $rootScope.itensOrdemSortable = element.sortable('toArray');
          $rootScope.$apply();
          scope.$emit('updateOrdemProdutos',data);
        },
        start: function(){
 
        }
      });
      element.disableSelection();
      
      
    }
  }
});
$app.directive('modificaOrdemFilters', function($resource,$rootScope,$compile) {
  return {
    restrict: "E",
    scope:{
      route: "@route",
      params: "=params",
      campo: "@campo",
      path_imagem: "@pathImagem"
    },
    link: function(scope, element, attrs, modelCtrl) {
       
      scope.filterOrdem = {titulo:''};

      var template = "";
      if(scope.campo == 'imagem'){
        template = "<div class='row-fluid status-ordem-modulo'></div><div class='content-ordem-modulo'><ul class='nav nav-ordem-modulo' sortable-ordem='itensSortable'><li ng-repeat='o in ordemItens' id='item_{{o.id}}'>{{$index+1}} - <img src='{{path_imagem}}{{o."+scope.campo+"}}' width='50px'/></li></ul></div>";
      }else{
        template = "<div class='row-fluid status-ordem-modulo'></div><div class='content-ordem-modulo'><form><input type='text' placeholder='Digite um Título' ng-model='filterOrdem.titulo' /></form><ul class='nav nav-ordem-modulo' sortable-ordem-filters='itensSortable'><li ng-repeat='o in ordemItens | filter:filterOrdem track by o.id' id='item_{{o.id}}' class='repeat-move' ng-mousedown='updateFilter()' >{{$index+1}} - {{o."+scope.campo+"}}</li></ul></div>";
      }
      var el = angular.element(template);
      var compile = $compile(el)(scope);
      element.html(compile);

      scope.$on('updateOrdemProdutos',function(event,data){updateOrdem(event,data)});
      scope.$on('updateFilterProdutos',function(event){updateFilter()});

      scope.setFilter = function(){
        scope.filterOrdem = {titulo:scope.titulo};
        scope.$apply();
      }
      scope.updateFilter = function(){
        scope.filterOrdem = {titulo:''};
        scope.$apply();
      }
      var updateOrdem = function(event,data){
        var itens = data;
        var produtos = scope.ordemItens;
        var new_itens = [];
        angular.forEach(itens,function(v,k){
          var id = v.split('_');
          id = id[1];
          angular.forEach(produtos,function(v,k){
            if(v.id == id){
              new_itens.push(v);
              return false;
            }
          });
        });
        scope.ordemItens = new_itens;
        scope.$apply();
      }
      
      function getOrdem(){
        var request = $resource(scope.route,scope.params);
      
        element.find(".status-ordem-modulo").addClass('btn-primary').html("<span>Carregando...</span>");
        request.query(function(response){
          scope.ordemItens = response;
          element.find(".status-ordem-modulo").addClass('btn-success').removeClass('btn-danger btn-primary').html("<span>"+response.length+" registros Carregados.</span>");
         
        },function(error){
          element.find(".status-ordem-modulo").addClass('btn-danger').removeClass('btn-success btn-primary').html("<span>Erro Carregar Registros.</span>");
        });
      }
      getOrdem();

    }
  }
});
$app.directive('ngPaginaInicial',function($compile,$resource,CSRF_TOKEN){
  return{
    restrict: 'A',
    scope:{
      dataItem: "=ngPaginaInicial"
    },
    link: function(scope,element,attrs,model){
      var html = "";
      var request = $resource('/admin/menu-itens/updatePaginaInicial',{_token:CSRF_TOKEN,id:scope.dataItem.id},{
        update:{method:'PUT'}
      });

      if(scope.dataItem.pagina_inicial){
        html = "<span class='icon-home-2' style='font-size:20px;'></span>";
      }else{
        html = "<span ng-click='updatePaginaInicial()' class='icon-blocked' style='font-size:20px;cursor:pointer;'></span>";
      }
      var el = angular.element(html);
      var compile = $compile(el)(scope);
      element.html(compile); 

      scope.updatePaginaInicial = function(){
        element.html('Processando..');
        request.update(function(response){
          if(response.status == 1){
            var grid = $('#menuItensGrid').data('kendoGrid');
            grid.dataSource.read();
          }else{
            alert(response.data);
          }
        },function(response){
          alert('error');
        });

      }       
    }
  }
});