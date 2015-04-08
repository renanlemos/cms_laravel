$app.directive('menuAdmin',function(MenuService,$compile){
  return{
    restrict: "E",
    template: "<ul class='menu-body'></ul>",
    link: function(scope,element,attrs,model){

      var menu = MenuService.getMenu();
      var menuHtml = "";

      angular.forEach(menu,function(v,k){
        if(v.itemParent == false){
          menuHtml += "<li>";
          menuHtml += "<a href='"+v.href+"' title='"+v.title+"' ng-class='{active:currentLink == \""+v.href+"\"}'>";
          menuHtml += v.display;
          menuHtml += "</a>";
          menuHtml += "</li>";
        }else{
          menuHtml += readItensParent(v);
        }
        
      });
      
      var el = angular.element(menuHtml);
      compiled = $compile(el)(scope);
      element.find('ul').html(compiled);
    }
  }
  function readItensParent(v){
      var menuHtml = "";
      
      menuHtml += "<li>";
      menuHtml += "<a href='"+v.href+"' title='"+v.title+"' class='item-parent' menu-dropdown>";
      menuHtml += v.display;
      menuHtml += "<span class='icon icon-arrow-right-2'></span>"
      menuHtml += "</a>";
      menuHtml += "<ul class='sub-itens'>";
        angular.forEach(v.itens,function(v,k){
          if(v.itemParent){
            menuHtml += readItensParent(v);
          }else{
            menuHtml += "<li>";
            menuHtml += "<a href='"+v.href+"' title='"+v.title+"' ng-class='{active:currentLink == \""+v.href+"\"}'>";
            menuHtml += v.display;
            menuHtml += "</a>";
            menuHtml += "</li>";
          }  
        });
      menuHtml += "</ul>";
      menuHtml += "</li>";  

      return menuHtml; 
    }
}); 
$app.directive('menuDropdown', function() {
   return {
       link: function(scope, element, attrs) {
          element.on('click',function(){
            var subItem = element.parent().find('.sub-itens').first();
            var subItemAll = element.parent().find('.sub-itens');
            var icon = element.find('.icon');
            var iconAll = element.parent().find('.icon');

            if(subItem.hasClass('show')){
              subItem.removeClass('show');
              subItem.addClass('hide');
              icon.addClass('icon-arrow-left-2');
              icon.removeClass('icon-arrow-down');
              iconAll.removeClass('icon-arrow-down');
              iconAll.addClass('icon-arrow-left-2');
              subItemAll.hide("slide",{},200); 
              subItem.hide("slide",{},200);   
            }else{
              subItem.addClass('show');
              subItem.removeClass('hide');
              icon.removeClass('icon-arrow-left-2');
              icon.addClass('icon-arrow-down');
              subItem.show("slide",{},200);   
            }
                
          });
       }
    }   
});
$app.directive('menuToogle', function($timeout) {
   return {
       scope:{
        type: "@menuToogle"
       },
       link: function(scope, element, attrs) {
          element.on('click',function(){
            var contentMenu = $('.content-menu');
            var contentView = $('.content-view');
            var menu = $('.menu');              

            if(element.hasClass('menu-show')){
              element.addClass('menu-hide');
              element.removeClass('menu-show');
              
              if(scope.type == "mobile"){
                contentMenu.hide('slide',{},150); 
              }else{
                menu.hide('slideUp'); 
                $timeout(function(){
                  contentMenu.animate({
                    "width": "50px"
                  },100);  
                  contentView.animate({
                    "margin-left":"50px"
                  },100);
                },200);   
              }  
            }else{
              element.removeClass('menu-hide');
              element.addClass('menu-show');

              if(scope.type == "mobile"){
                contentMenu.show('slide',{},150); 
              }else{
                contentView.animate({
                    "margin-left":"200px"
                },100);
                contentMenu.animate({
                    "width": "200px"
                },100);
                $timeout(function(){
                  menu.show('slideUp');     
                },200);  
              }  
            }
            
          });
       }
    }   
});
$app.directive("dropdownUser",function(){
    return{
        link:function(scope,element,attrs,model){

            var dropdown = element.find(".item");

            $(dropdown).on("click",execute);

            function execute(){
                var item = $(dropdown).parent().find("ul");
                var arrow = $(dropdown).find(".arrow");

                if($(item).hasClass("dropdown-show")){
                    $(item).removeClass("dropdown-show").hide("explode");
                    $(arrow).removeClass("icon-arrow-down-7");
                    $(arrow).addClass("icon-arrow-right-8");
                }else{
                    $(item).addClass("dropdown-show").show("fade");
                    $(arrow).addClass("icon-arrow-down-7");
                    $(arrow).removeClass("icon-arrow-right-8");
                }
            }
        }
    }
});
$app.directive('templateTopo',function(){
  return{
    restrict: "E",
    templateUrl: '/assets/js/admin/templates/layout/topo.html',
    link: function(scope, element, attrs,model) {
      
    }  
  }
});
$app.directive('templateMenu',function(){
  return{
    restrict: "E",
    templateUrl: '/assets/js/admin/templates/layout/menu.html',
    link: function(scope, element, attrs,model) {
      
    }  
  }
});
$app.directive('breadcrumbs',function($rootScope,MenuService,$compile){
  return{
    restrict: "E",
    link: function(scope, element, attrs,model) {
      scope.breadcrumbs = [{nome:"HOME",link:"/admin"}];

      var menu = MenuService.getMenu();
      var link = $rootScope.currentLink;
      
      var array_link = link.split('/'); 
      array_link.splice(0,1);
      var breadcrumbs = "<nav class='breadcrumbs'><ul>"; 
      
      if(array_link.length > 1){
        breadcrumbs += getItens(array_link,menu);
      }else{
        breadcrumbs += getInicial();
      }
      
      breadcrumbs += "</ul></nav>"

      var el = angular.element(breadcrumbs);
      compiled = $compile(el)(scope);
      element.html(compiled); 

      function getItens(array_link,menu){
        var breadcrumbs = getInicial();
        
        for (var i = 1;i < array_link.length;i++) {
          breadcrumbs += getSeparator();
          
          var item = searchItem(array_link[i],menu);
          
          breadcrumbs += "<li>";
          breadcrumbs += "<a href='"+item.href+"' ng-class=\"{'active':currentLink == '"+item.href+"' }\">"+item.nome+"</a>";
          breadcrumbs += "</li>"; 
        }

        return breadcrumbs;
      }
      function searchItem(apelido,menu){
        var search = true;
        var item = {nome: "",href:""};
        
        if(search == true){
          angular.forEach(menu,function(value,key){
            if(value.itemParent == true && value.apelido == apelido){
              item.nome = value.display;
              item.href = value.href;
              search = false;
            }else if(value.itemParent == true && value.apelido != apelido){
              var  i = searchItem(apelido,value.itens);

              if(i.nome.length > 0){
                item.nome = i.nome;
                item.href = i.href;

                search = false;
              }
              
                         
            }else if(value.apelido == apelido){
              item.nome = value.display;
              item.href = value.href;
              search = false;
            }
          });
        }
        return item;
      }
      function getSeparator(){
        var separator = "<li><span class='separator'>/</span></li>";
   
        return separator;
      }
      function getInicial(){
        var breadcrumbs = "";
        breadcrumbs += "<li>";
        breadcrumbs += "<a href='/admin' ng-class=\"{'active':currentLink == '/admin' }\">HOME</a>";
        breadcrumbs += "</li>"; 

        return breadcrumbs;
      }

    }  
  }
});
$app.directive('elfinder',function(CSRF_TOKEN){
  return{
    restrict:"E",
    link: function(scope,element,attrs,model){
      var data = {};

    
      element.elfinder({
        toolbar : [
        ['back', 'forward'],
        ['reload'],
        ['home', 'up'],
        ['mkdir', 'mkfile', 'upload'],
        ['open', 'download', 'getfile'],
        ['info'],
        ['quicklook'],
        ['copy', 'cut', 'paste'],
        ['rm'],
        ['duplicate', 'rename', 'edit', 'resize'],
        ['extract', 'archive'],
        ['search'],
        ['view'],
        ['help']
        ],
        url : '/admin/elfinder/connector?_token='+CSRF_TOKEN, 
        lang: 'pt_BR'
      }).elfinder('instance');
    }
  }
});
$app.directive('ckeditor', function(CSRF_TOKEN,$rootScope) {
   return {
      require: '?ngModel',
      link: function($scope, element, attrs,ngModel) {

        $rootScope.ckeditorStatus = "<p class='ckeditor-status'>Carregando Editor<span class='icon-refresh'></span></p>";
                
        var ck = CKEDITOR.replace(element[0],
        {
          //toolbar: [ [ "Source", "Preview",  "Templates" ], [ "Bold", "Italic", "Underline", "Strike" ],[ 'list', 'indent', 'blocks', 'align' ],['PasteText','PasteFromWord'], ['Undo','Redo'], [ "NumberedList", "BulletedList"], [ "Link", "Unlink"], [ "Image", "Flash"] ],  
          filebrowserBrowseUrl: "/admin/elfinder/show?_token="+CSRF_TOKEN,
          filebrowserImageBrowseUrl: "/admin/elfinder/show?_token="+CSRF_TOKEN,
          filebrowserFlashBrowseUrl: "/admin/elfinder/show?_token="+CSRF_TOKEN,
          filebrowserImageUploadUrl: "/admin/elfinder/show?_token="+CSRF_TOKEN,
          filebrowserFlashUploadUrl: "/admin/elfinder/show?_token="+CSRF_TOKEN,
          filebrowserImageWindowWidth: "980",
          filebrowserImageWindowHeight: "490",
          filebrowserWindowWidth: "980",
          filebrowserWindowHeight: "500"
      });
      ck.on('instanceReady', function () {
          $rootScope.$apply(function(){
            $rootScope.ckeditorStatus = "";
          });
      });  
      ck.on('pasteState', function () {
          $scope.$apply(function () {
            ngModel.$setViewValue(ck.getData());
          });
      });
      ngModel.$render = function (value) {
        ck.setData(ngModel.$modelValue);
      };
    }
  };
});
$app.directive('publicaInGrid',function($resource,$compile,CSRF_TOKEN,$timeout){
  return{
    restrict:"AE",
    scope:{
      status: '=',
      url: '@',
      item: '=',
      permissao: '=',
      grid: '=',
      campo: "@"
    },
    link:function(scope,element,attrs,model){

      var html = "";
      var status = "";
      if(scope.status){
        status = false;        
        html = "<div class='publica-in-grid'><span class='icon-thumbs-up' ng-click='changePublicado()'></span></div>";
      }else{
        status = true;
        html = "<div class='publica-in-grid'><span class='icon-thumbs-down' ng-click='changePublicado()'></span></div>";
      }
      setView(html);
      scope.changePublicado = function(){
        if(scope.permissao){
          var request = $resource(scope.url,{_token:CSRF_TOKEN,campo:scope.campo},{
            update: {method: 'PUT'}
          });
          element.find('.publica-in-grid').html('Processando...');
          var status = scope.status == true ? false : true;
          if(scope.campo == 'publicado'){
            scope.item.publicado = status;
          }else if(scope.campo == 'destaque'){
            scope.item.destaque = status;
          }else{
            scope.item.capa = status;
          }
          request.update(scope.item,function(response){
            if(response.status){
              var icon = status == true ? 'icon-thumbs-up' : 'icon-thumbs-down'; 
              var html = "<div class='publica-in-grid'><span class='"+icon+"' ng-click='changePublicado()'></span></div>";
              if(scope.campo == 'capa'){
                scope.grid.dataSource.read();
              }
              setView(html);
            }else{
              element.find('.publica-in-grid').html('Erro ao alterar.');
              $timeout(function(){
                scope.grid.dataSource.read();
              },1000);
            }
          },function(response){
            element.find('.publica-in-grid').html('Erro ao Processar.');
            $timeout(function(){
              scope.grid.dataSource.read();
            },1000);
          });
        }else{
          alert("Sem permissão para alterar.");
        }  
        
      }
      function setView(html){
        var el = angular.element(html);
        var compile = $compile(el)(scope);
        element.html(compile);
      }
    }
  }
});