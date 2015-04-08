$app.directive('ordemModulo',function($resource,$rootScope){return{restrict:"E",scope:{modulo_posicao_id:"=id"},template:"<div class='row-fluid status-ordem-modulo'></div><div class='content-ordem-modulo'><ul class='nav nav-ordem-modulo' sortable-ordem-modulo='itensSortable'><li ng-repeat='o in ordemItens' id='item_{{o.id}}'>{{$index+1}} - {{o.titulo}}</li></ul></div>",link:function(scope,element,attrs,modelCtrl){var request=$resource('/admin/modulos/getModulosOrdem');element.find(".status-ordem-modulo").addClass('btn-primary').html("<span>Carregando Módulos...</span>");request.query({modulo_posicao_id:scope.modulo_posicao_id},function(response){scope.ordemItens=response;element.find(".status-ordem-modulo").addClass('btn-success').removeClass('btn-danger btn-primary').html("<span>"+response.length+" módulos Carregados.</span>");},function(error){element.find(".status-ordem-modulo").addClass('btn-danger').removeClass('btn-success btn-primary').html("<span>Erro Carregar Módulos.</span>");});}}});$app.directive('sortableOrdemModulo',function($rootScope){return{restrict:'A',link:function(scope,element,attrs,model){element.sortable({cursor:'move',items:'li',update:function(){$rootScope.itensOrdemModuloSortable=element.sortable('toArray');$rootScope.$apply();}});element.disableSelection();}}});$app.directive("maskInput",function(){return{restrict:'A',scope:{format:"@format"},link:function(scope,elem,attrs,model){elem.mask(scope.format);}}});$app.directive("ngBindHtmlCustom",function(){return{restrict:'A',scope:{value_html:"@ngBindHtmlCustom"},link:function(scope,elem,attrs,model){elem.html(scope.value_html);}}});$app.directive('uppercase',function(){return{require:'ngModel',link:function(scope,element,attrs,modelCtrl){var uppercase=function(inputValue){uppercase=inputValue.toUpperCase();uppercase=uppercase.replace(new RegExp(/[~{}'~:;^`'´".,?ª!@#¨&]/g),"");uppercase=uppercase.replace(new RegExp(/[ÁÃÂÀÂ]/g),"A");uppercase=uppercase.replace(new RegExp(/[ÍÌÎ]/g),"I");uppercase=uppercase.replace(new RegExp(/[ÉÈÊ]/g),"E")
uppercase=uppercase.replace(new RegExp(/[ÒÓÕÔ]/g),"O")
uppercase=uppercase.replace(new RegExp(/[ÚÙÛ]/g),"U")
if(uppercase!==inputValue){modelCtrl.$setViewValue(uppercase);modelCtrl.$render();}
return uppercase;}
modelCtrl.$parsers.push(uppercase);uppercase(scope[attrs.ngModel]);}};});$app.directive('lowercase',function(){return{require:'ngModel',link:function(scope,element,attrs,modelCtrl){var lowercase=function(inputValue){lowercase=inputValue.toLowerCase();lowercase=lowercase.replace(new RegExp(/[$'~:;^`'´".,?(){}ª!@#¨&_]/g),"");lowercase=lowercase.replace(new RegExp(/[áãâà]/g),"a");lowercase=lowercase.replace(new RegExp(/[íìî]/g),"i");lowercase=lowercase.replace(new RegExp(/[éèê]/g),"e")
lowercase=lowercase.replace(new RegExp(/[òóôõ]/g),"O")
lowercase=lowercase.replace(new RegExp(/[úùû]/g),"u")
if(lowercase!==inputValue){modelCtrl.$setViewValue(lowercase);modelCtrl.$render();}
return lowercase;}
modelCtrl.$parsers.push(lowercase);lowercase(scope[attrs.ngModel]);}};});$app.directive('menuAdmin',function(MenuService,$compile){return{restrict:"E",template:"<ul class='menu-body'></ul>",link:function(scope,element,attrs,model){var menu=MenuService.getMenu();var menuHtml="";angular.forEach(menu,function(v,k){if(v.itemParent==false){menuHtml+="<li>";menuHtml+="<a href='"+v.href+"' title='"+v.title+"' ng-class='{active:currentLink == \""+v.href+"\"}'>";menuHtml+=v.display;menuHtml+="</a>";menuHtml+="</li>";}else{menuHtml+="<li>";menuHtml+="<a href='"+v.href+"' title='"+v.title+"' class='item-parent' menu-dropdown>";menuHtml+=v.display;menuHtml+="<span class='icon icon-arrow-right-2'></span>"
menuHtml+="</a>";menuHtml+="<ul class='sub-itens'>";angular.forEach(v.itens,function(v,k){menuHtml+="<li>";menuHtml+="<a href='"+v.href+"' title='"+v.title+"' ng-class='{active:currentLink == \""+v.href+"\"}'>";menuHtml+=v.display;menuHtml+="</a>";menuHtml+="</li>";});menuHtml+="</ul>";menuHtml+="</li>";}});var el=angular.element(menuHtml);compiled=$compile(el)(scope);element.find('ul').html(compiled);}}});$app.directive('menuDropdown',function(){return{link:function(scope,element,attrs){element.on('click',function(){var subItens=element.parent().find('.sub-itens');var icon=element.find('.icon');if(subItens.hasClass('show')){subItens.removeClass('show');subItens.addClass('hide');icon.addClass('icon-arrow-left-2');icon.removeClass('icon-arrow-down');subItens.hide("slide",{},200);}else{subItens.addClass('show');subItens.removeClass('hide');icon.removeClass('icon-arrow-left-2');icon.addClass('icon-arrow-down');subItens.show("slide",{},200);}});}}});$app.directive('menuToogle',function($timeout){return{scope:{type:"@menuToogle"},link:function(scope,element,attrs){element.on('click',function(){var contentMenu=$('.content-menu');var contentView=$('.content-view');var menu=$('.menu');if(element.hasClass('menu-show')){element.addClass('menu-hide');element.removeClass('menu-show');if(scope.type=="mobile"){contentMenu.hide('slide',{},150);}else{menu.hide('slideUp');$timeout(function(){contentMenu.animate({"width":"50px"},100);contentView.animate({"margin-left":"50px"},100);},200);}}else{element.removeClass('menu-hide');element.addClass('menu-show');if(scope.type=="mobile"){contentMenu.show('slide',{},150);}else{contentView.animate({"margin-left":"200px"},100);contentMenu.animate({"width":"200px"},100);$timeout(function(){menu.show('slideUp');},200);}}});}}});$app.directive("dropdownUser",function(){return{link:function(scope,element,attrs,model){var dropdown=element.find(".item");$(dropdown).on("click",execute);function execute(){var item=$(dropdown).parent().find("ul");var arrow=$(dropdown).find(".arrow");if($(item).hasClass("dropdown-show")){$(item).removeClass("dropdown-show").hide("explode");$(arrow).removeClass("icon-arrow-down-7");$(arrow).addClass("icon-arrow-right-8");}else{$(item).addClass("dropdown-show").show("fade");$(arrow).addClass("icon-arrow-down-7");$(arrow).removeClass("icon-arrow-right-8");}}}}});$app.directive('templateTopo',function(){return{restrict:"E",templateUrl:'/assets/js/admin/templates/layout/topo.html',link:function(scope,element,attrs,model){}}});$app.directive('templateMenu',function(){return{restrict:"E",templateUrl:'/assets/js/admin/templates/layout/menu.html',link:function(scope,element,attrs,model){}}});$app.directive('breadcrumbs',function($rootScope,MenuService,$compile){return{restrict:"E",link:function(scope,element,attrs,model){scope.breadcrumbs=[{nome:"HOME",link:"/admin"}];var menu=MenuService.getMenu();var link=$rootScope.currentLink;var array_link=link.split('/');array_link.splice(0,1);var breadcrumbs="<nav class='breadcrumbs'><ul>";if(array_link.length>1){breadcrumbs+=getItens(array_link,menu);}else{breadcrumbs+=getInicial();}
breadcrumbs+="</ul></nav>"
var el=angular.element(breadcrumbs);compiled=$compile(el)(scope);element.html(compiled);function getItens(array_link,menu){var breadcrumbs=getInicial();for(var i=1;i<array_link.length;i++){breadcrumbs+=getSeparator();var item=searchItem(array_link[i],menu);breadcrumbs+="<li>";breadcrumbs+="<a href='"+item.href+"' ng-class=\"{'active':currentLink == '"+item.href+"' }\">"+item.nome+"</a>";breadcrumbs+="</li>";}
return breadcrumbs;}
function searchItem(apelido,menu){var search=true;var item={nome:"",href:""};if(search==true){angular.forEach(menu,function(value,key){if(value.itemParent==true&&value.apelido==apelido){item.nome=value.display;item.href=value.href;search=false;}else if(value.itemParent==true&&value.apelido!=apelido){var i=searchItem(apelido,value.itens);if(i.nome.length>0){item.nome=i.nome;item.href=i.href;search=false;}}else if(value.apelido==apelido){item.nome=value.display;item.href=value.href;search=false;}});}
return item;}
function getSeparator(){var separator="<li><span class='separator'>/</span></li>";return separator;}
function getInicial(){var breadcrumbs="";breadcrumbs+="<li>";breadcrumbs+="<a href='/admin' ng-class=\"{'active':currentLink == '/admin' }\">HOME</a>";breadcrumbs+="</li>";return breadcrumbs;}}}});$app.directive('elfinder',function(CSRF_TOKEN){return{restrict:"E",link:function(scope,element,attrs,model){var data={};element.elfinder({toolbar:[['back','forward'],['reload'],['home','up'],['mkdir','mkfile','upload'],['open','download','getfile'],['info'],['quicklook'],['copy','cut','paste'],['rm'],['duplicate','rename','edit','resize'],['extract','archive'],['search'],['view'],['help']],url:'/admin/elfinder/connector?_token='+CSRF_TOKEN,lang:'pt_BR'}).elfinder('instance');}}});$app.directive('ckeditor',function(CSRF_TOKEN){return{require:'?ngModel',link:function($scope,element,attrs,ngModel){var ck=CKEDITOR.replace(element[0],{filebrowserBrowseUrl:"/admin/elfinder/show?_token="+CSRF_TOKEN,filebrowserImageBrowseUrl:"/admin/elfinder/show?_token="+CSRF_TOKEN,filebrowserFlashBrowseUrl:"/admin/elfinder/show?_token="+CSRF_TOKEN,filebrowserImageUploadUrl:"/admin/elfinder/show?_token="+CSRF_TOKEN,filebrowserFlashUploadUrl:"/admin/elfinder/show?_token="+CSRF_TOKEN,filebrowserImageWindowWidth:"980",filebrowserImageWindowHeight:"490",filebrowserWindowWidth:"980",filebrowserWindowHeight:"500"});ck.on('pasteState',function(){$scope.$apply(function(){ngModel.$setViewValue(ck.getData());});});ngModel.$render=function(value){ck.setData(ngModel.$modelValue);};}};});