$app.directive('menuPrincipal',function(MenuService,$compile){
  return{
    restrict: "E",
    template: "<nav class='menu'><ul class='menu-body'></ul></div></nav>",
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
          menuHtml += "<li>";
          menuHtml += "<a href='"+v.href+"' title='"+v.title+"' class='item-parent' menu-dropdown>";
          menuHtml += v.display;
          menuHtml += "<span class='icon icon-arrow-right-2'></span>"
          menuHtml += "</a>";
          menuHtml += "<ul class='sub-itens'>";
          angular.forEach(v.itens,function(v,k){
            menuHtml += "<li>";
            menuHtml += "<a href='"+v.href+"' title='"+v.title+"' ng-class='{active:currentLink == \""+v.href+"\"}'>";
            menuHtml += v.display;
            menuHtml += "</a>";
            menuHtml += "</li>";
          });
          menuHtml += "</ul>";
          menuHtml += "</li>";  
        }
        
      });
      
      var el = angular.element(menuHtml);
      compiled = $compile(el)(scope);
      element.find('ul').html(compiled);
    }
  }
}); 
$app.directive('ngHtml',function($compile){
  return{
    restrict: 'AE',
    scope:{
      html: "=ngHtml"
    },
    link: function(scope,element,attrs,model){

      var html = angular.element(scope.html);
      var el = $compile(html)(scope);

      element.html(el);
    }
  }
});
$app.directive('mask',function($compile){
  return{
    restrict: 'AE',
    scope:{
      format: "@mask"
    },
    link: function(scope,element,attrs,model){
      element.mask(scope.format);
    }
  }
});