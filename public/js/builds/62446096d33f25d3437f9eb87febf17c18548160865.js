$app.directive('bannerSliderCycle',function(){return{restrict:'A',scope:{parametros:"=parametros"},link:function(scope,element,attrs,model){var options=angular.fromJson(scope.parametros);var img=$(element).parent().find('.cycle-image-first');element.cycle({fx:options.efeito,easing:'easeOutBack',loader:"wait",slides:'.itemCycle',pager:parseInt(options.paginacao)==1?$(element).parent().find("#pager"):null,prev:parseInt(options.prev)==1?$(element).parent().find("#prev"):null,next:parseInt(options.next)==1?$(element).parent().find("#next"):null,timeout:options.timeout,speed:options.speed,pause:parseInt(options.pause),containerResize:0,width:'100%',fit:1,after:function(){},pagerAnchorBuilder:function(idx,slide){if(parseInt(options.paginacao)==1){var src=$(slide).find('img').attr('src');return'<li><a href="#"><img src="'+src+'" width="50" height="50" /></a></li>';}}});$(img).load(function(){element.css({'height':$(this).height()+"px",});});$(window).resize(function(){var img=$(element).parent().find('.cycle-image-first');element.css({'height':img.height()+"px",});});}}});$app.directive('modulo',function($resource,$compile,$rootScope,MODULOS){return{restrict:"E",link:function(scope,element,attrs,model){var request=$resource('/CmsModulos/get-modulos-posicao');var data={posicao:attrs.posicao};var modulos_all=MODULOS;var modulos=searchModulos(modulos_all,attrs.posicao);if(modulos.length>0){angular.forEach(modulos,function(v,k){scope.modulo=v;var m=getModulo(v);var el=angular.element(m);var compile=$compile(el)(scope);element.append(compile);});}
function searchModulos(data,posicao){var modulos=[];angular.forEach(data,function(v,k){if(v.descricao==posicao){modulos.push(v);}});return modulos;}
function getModulo(modulo){switch(modulo.tipo){case'html':return"<modulo-html></modulo-html>";break;case'banner-slider':return"<modulo-banner-slider></modulo-banner-slider>";break;case'contato':return"<modulo-contato></modulo-contato>";break;case'menu':return"<modulo-menu></modulo-menu>";break;case'clima-tempo':return"<modulo-clima-tempo></modulo-clima-tempo>";break;case'produto-em-destaque':return"<modulo-produto-destaque></modulo-produto-destaque>";break;}}}}});$app.directive('moduloContato',function($compile,$resource){return{restrict:"E",scope:true,link:function(scope,element,attrs,model){var data=scope.modulo;var titulo=data.titulo;var mostrar_titulo=data.mostrar_titulo;var tag_titulo=data.tag_titulo;var parametros=angular.fromJson(data.parametros);var el=angular.element("<h1>TESTE</h1 >");var compiled=$compile(el)(scope);element.html(compiled);}}});$app.directive('moduloProdutoDestaque',function($compile,$resource,PATH_TEMPLATES){return{restrict:"E",replace:true,scope:true,controller:'ComponenteProdutosController',link:function(scope,element,attrs,model){var html="";var modulo=scope.modulo;scope.mostrar_titulo=modulo.mostrar_titulo;scope.parametros=angular.fromJson(modulo.parametros);scope.modulo_titulo="<"+modulo.tag_titulo+">"+modulo.titulo+"</"+modulo.tag_titulo+">";scope.parametros=angular.fromJson(modulo.parametros);var request=$resource('/CmsModulos/modulo-produtos/getProduto',{tipo:scope.parametros.tipo,categoria_id:scope.parametros.categoria_id,produtos:[getIdsProdutos(scope.parametros.produtos)]});request.get(function(response){scope.produtos=response.produtos;scope.menu_itens=response.menu_itens;var templateUrl=PATH_TEMPLATES+'modulos/produtos/produto-em-destaques/'+scope.parametros.template;var html="<div ng-include src=\"'"+templateUrl+"'\" />";var el=angular.element(html);var compile=$compile(el)(scope);element.html(compile);},function(response){var content=response.data.error.message;var code=response.status;});function getIdsProdutos(produtos){var ids=[];if(produtos.length>0){angular.forEach(produtos,function(v,k){ids.push(v.id);});}
return ids;}}}});$app.directive('moduloMenu',function($compile,$resource,$rootScope){return{restrict:"E",scope:true,link:function(scope,element,attrs,model){var data=scope.modulo;var titulo=data.titulo;var mostrar_titulo=data.mostrar_titulo;var tag_titulo=data.tag_titulo;var parametros=angular.fromJson(data.parametros);var html="";html+="<div class='modulo-menu "+parametros.class+"' id='"+parametros.id+"'>";if(mostrar_titulo==true){html+="<"+tag_titulo+">"+titulo+"</"+tag_titulo+">";}
html+="<modulo-menu-"+parametros.menu_template+" parametros='modulo.parametros'></modulo-menu-"+parametros.menu_template+">";html+="</div>";var el=angular.element(html);var compiled=$compile(el)(scope);element.html(compiled);}}});$app.directive('moduloMenuPadrao',function($compile,$location,$rootScope,$resource,MenuService){return{restrict:"AE",scope:true,template:"<nav class='modulo-menu-padrao'><ul></ul></nav>",link:function(scope,element,attrs,model){var parametros=angular.fromJson(scope.modulo.parametros);var request=$resource('/CmsModulos/menus/getMenu');request.query({menu_id:parametros.menu_id},function(response){MenuService.setMenuData(response);var menu_itens=MenuService.getMenuData(response);var menuHtml="";var href="";angular.forEach(menu_itens,function(v,k){var apelido=v.apelido[0]=='/'?v.apelido:"/"+v.apelido;href=v.pagina_inicial==true?'/':apelido;var parametros=angular.fromJson(v.parametros);if(MenuService.isParent(v.id)){menuHtml+=readItensParent(v);}else{menuHtml+="<li>";menuHtml+="<a href='"+href+"' title='"+v.titulo+"' ng-class='{active:currentLink == \""+href+"\"}' >";if(parametros.mostrar_icone_menu){menuHtml+="<span class='icone'><img src='/menus/icones/"+parametros.icone+"'></span>";}
if(parametros.mostrar_titulo_menu){menuHtml+=v.titulo;}
menuHtml+="</a>";menuHtml+="</li>";}});var el=angular.element(menuHtml);var compiled=$compile(el)(scope);element.find('ul').html(compiled);},function(response){element.html("Erro ao carregar menu.");});function readItensParent(item){var apelido=item.apelido[0]=='/'?item.apelido:"/"+item.apelido;var href=item.pagina_inicial==true?'/':apelido;var menuHtml="";var parametros=angular.fromJson(item.parametros);menuHtml+="<li class='item-parent'>";menuHtml+="<a href='"+href+"' title='"+item.titulo+"' class='item-parent' menu-dropdown-padrao>";if(parametros.mostrar_icone_menu){menuHtml+="<span class='icone'><img src='/menus/icones/"+parametros.icone+"'></span>";}
if(parametros.mostrar_titulo_menu){menuHtml+=item.titulo;}
menuHtml+="</a>";menuHtml+="<ul class='sub-itens'>";angular.forEach(MenuService.getItensParent(item.id),function(v,k){var apelido=v.apelido[0]=='/'?v.apelido:"/"+v.apelido;var href=v.pagina_inicial==true?'/':apelido;var parametros=angular.fromJson(v.parametros);if(MenuService.isParent(v.id)){menuHtml+=readItensParent(v);}else{menuHtml+="<li>";menuHtml+="<a href='"+href+"' title='"+v.titulo+"' ng-class='{active:currentLink == \""+href+"\"}'>";if(parametros.mostrar_icone_menu){menuHtml+="<span class='icone'><img src='/menus/icones/"+parametros.icone+"'></span>";}
if(parametros.mostrar_titulo_menu){menuHtml+=v.titulo;}
menuHtml+="</a>";menuHtml+="</li>";}});menuHtml+="</ul>";menuHtml+="</li>";return menuHtml;}}}});$app.directive('menuDropdownPadrao',function($rootScope){return{restrict:'AE',link:function(scope,element,attrs,model){element.on('click',dropdown);$rootScope.$on('$routeChangeStart',function(){var item=element.parent();var sub_itens_all=item.find('.sub-itens');sub_itens_all.addClass('hide');sub_itens_all.removeClass('show');sub_itens_all.hide(100);});function dropdown(){var item=element.parent();var sub_itens=item.find('.sub-itens').first();var sub_itens_all=item.find('.sub-itens');if(sub_itens.hasClass('show')){sub_itens.hide(100);sub_itens_all.hide(100);sub_itens_all.removeClass('show');sub_itens.addClass('hide');sub_itens.removeClass('show');}else{sub_itens.show(100);sub_itens.addClass('show');sub_itens.removeClass('hide');}
return false;}}}});$app.directive('moduloHtml',function($compile,$rootScope){return{restrict:"E",replace:true,scope:true,link:function(scope,element,attrs,model){var html="";var data=scope.modulo;var conteudo=data.conteudo;var titulo=data.titulo;var mostrar_titulo=data.mostrar_titulo;var tag_titulo=data.tag_titulo;var parametros=angular.fromJson(data.parametros);html+="<div class='modulo-html "+parametros.class+"' id='"+parametros.id+"'>";if(mostrar_titulo==true){html+="<"+tag_titulo+">"+titulo+"</"+tag_titulo+">";}
html+=conteudo;html+="</div>";var el=angular.element(html);var compile=$compile(el)(scope);element.html(compile);}}});$app.directive('moduloClimaTempo',function($compile,$http,$resource,PATH_TEMPLATES){return{restrict:"E",replace:true,scope:true,link:function(scope,element,attrs,model){var modulo=scope.modulo;scope.mostrar_titulo=modulo.mostrar_titulo;scope.parametros=angular.fromJson(modulo.parametros);scope.modulo_titulo="<"+modulo.tag_titulo+">"+modulo.titulo+"</"+modulo.tag_titulo+">";var request=$resource('/CmsModulos/clima-tempo/getTempo',{latitude:scope.parametros.latitude,longitude:scope.parametros.longitude});request.get(function(response){scope.tempo=response.data;var templateUrl=PATH_TEMPLATES+'modulos/clima-tempo/'+scope.parametros.template;var html="<div ng-include src=\"'"+templateUrl+"'\" />";var el=angular.element(html);var compile=$compile(el)(scope);element.html(compile);},function(response){var content=response.data.error.message;var code=response.status;});}}});$app.directive('moduloBannerSlider',function($resource,$compile,$http,$q){return{restrict:"E",scope:true,link:function(scope,element,attrs,model){var html="";var data=scope.modulo;var titulo=data.titulo;var mostrar_titulo=data.mostrar_titulo;var tag_titulo=data.tag_titulo;var parametros=angular.fromJson(data.parametros);var request=$resource('/CmsModulos/banner-sliders/get-fotos',{banner_id:parametros.banner_id});if(mostrar_titulo==true){html+="<"+tag_titulo+">"+titulo+"</"+tag_titulo+">";}
request.query(function(response){scope.modulo=data;var banner=response;var li="";var image_first="";var altura_inicial="";html+="<section class='"+parametros.class+" banner-slider-cycle' id='"+parametros.id+"'>";html+="<nav banner-slider-cycle parametros='modulo.parametros' class='cycle'>";angular.forEach(banner,function(v,k){var image="/componentes/banner-slider/banner-"+v.banner_slider_id+"/"+v.imagem;if(k==0){image_first="<img src='"+image+"' style='display:none;' class='cycle-image-first'/>"}
if(v.url.length>0){html+="<div class='itemCycle'>";html+="<a href='"+v.url+"' target='"+v.url_target+"'>";html+="<img src='"+image+"'>";if(v.legenda.length>0){html+="<div class='cycle-legenda'><div class='body'>";html+=v.legenda;html+="</div></div>";}
html+="</a>";html+="</div>";}else{html+="<div class='itemCycle'>";html+="<img src='"+image+"'>";if(v.legenda.length>0){html+="<div class='cycle-legenda'><div class='body'>";html+=v.legenda;html+="</div></div>";}
html+="</div>";}
li+="<li><a href='#'><img src='"+image+"' width='50px' /></a></li>";});html+="</nav>";if(parseInt(parametros.next)==1||parseInt(parametros.prev)==1){html+="<div class='clear'></div>";}
if(parseInt(parametros.prev)==1){html+="<div id='prev' class='cycle-prev'><span class='icon-arrow-left-2'></span></div>";}
if(parseInt(parametros.next)==1){html+="<div id='next' class='cycle-next'><span class='icon-arrow-right-2'></span></div>";}
var navs="";if(parseInt(parametros.paginacao)){navs+="<div class='cycle-pager'>";navs+="<ul id='pager'>";navs+="</ul>";navs+="</div>";}
navs+=image_first;navs+="</section>";var el=angular.element(html+navs);compiled=$compile(el)(scope);element.html(compiled).show('fade');},function(response){});}}});$app.directive('fancybox',function(){return{restrict:'AE',link:function(scope,element,attrs,model){element.fancybox({href:(attrs.href||attrs.src),titlePosition:'inside',openEffect:'elastic'});}}});$app.directive('fancyboxGaleriaRepeat',function($timeout){return{restrict:'AE',link:function(scope,element,attrs,model){element.addClass('fancybox');if(scope.$last){$('.fancybox').fancybox();$('.fancybox').on('click',function(){return false;})}}}});$app.directive('menuPrincipal',function(MenuService,$compile){return{restrict:"E",template:"<nav class='menu'><ul class='menu-body'></ul></div></nav>",link:function(scope,element,attrs,model){var menu=MenuService.getMenu();var menuHtml="";angular.forEach(menu,function(v,k){if(v.itemParent==false){menuHtml+="<li>";menuHtml+="<a href='"+v.href+"' title='"+v.title+"' ng-class='{active:currentLink == \""+v.href+"\"}'>";menuHtml+=v.display;menuHtml+="</a>";menuHtml+="</li>";}else{menuHtml+="<li>";menuHtml+="<a href='"+v.href+"' title='"+v.title+"' class='item-parent' menu-dropdown>";menuHtml+=v.display;menuHtml+="<span class='icon icon-arrow-right-2'></span>"
menuHtml+="</a>";menuHtml+="<ul class='sub-itens'>";angular.forEach(v.itens,function(v,k){menuHtml+="<li>";menuHtml+="<a href='"+v.href+"' title='"+v.title+"' ng-class='{active:currentLink == \""+v.href+"\"}'>";menuHtml+=v.display;menuHtml+="</a>";menuHtml+="</li>";});menuHtml+="</ul>";menuHtml+="</li>";}});var el=angular.element(menuHtml);compiled=$compile(el)(scope);element.find('ul').html(compiled);}}});$app.directive('ngHtml',function($compile){return{restrict:'AE',scope:{html:"=ngHtml"},link:function(scope,element,attrs,model){var html=angular.element(scope.html);var el=$compile(html)(scope);element.html(el);}}});$app.directive('mask',function($compile){return{restrict:'AE',scope:{format:"@mask"},link:function(scope,element,attrs,model){element.mask(scope.format);}}});$app.directive('componente',function($resource,$compile,ComponenteService){return{restrict:'AE',scope:true,link:function(scope,element,attr,model){var link=scope.linkData[0];var meta_tags={title:link.meta_title,description:link.meta_description,keywords:link.meta_keywords,author:link.meta_author};scope.link=angular.fromJson(link);scope.link_parametros=angular.fromJson(link.parametros);ComponenteService.setMetaTags(meta_tags);var componenteTemplate=ComponenteService.getComponenteTemplate(link.componente,link.tipo);var el=angular.element(componenteTemplate);var compile=$compile(el)(scope);element.html(compile);}}});$app.directive('componenteUnicoProduto',function($resource,$compile,$http,PATH_TEMPLATES,$routeParams,ComponenteService){return{restrict:'AE',scope:true,controller:'ComponenteProdutosController',link:function(scope,element,attr,model){var data=scope.linkData[0];var parametros=angular.fromJson(data.parametros);var request=$resource("/CmsComponentes/componente-produtos/getProduto",{produto_id:parametros.produto_id});request.get(function(response){scope.produto=response.produto[0];scope.fotos=response.fotos;scope.caracteristicas=response.caracteristicas;scope.categoria=response.categoria;scope.produto_parametros=angular.fromJson(scope.produto.parametros);scope.categoria_parametros=angular.fromJson(scope.categoria.parametros);scope.produtos_relacionados=response.produtos_relacionados;scope.menu_itens=response.menu_itens;var meta_tags={title:scope.produto.meta_title,description:scope.produto.meta_description,keywords:scope.produto.meta_keywords,author:scope.produto.meta_author};ComponenteService.setMetaTags(meta_tags);var templateUrl=PATH_TEMPLATES+'componentes/produto/produto/'+parametros.template;var html="<div ng-include src=\"'"+templateUrl+"'\" />";var el=angular.element(html);var compile=$compile(el)(scope);element.html(compile);});}}});$app.directive('componenteCategoriaProduto',function($location,$resource,$compile,$http,PATH_TEMPLATES,$routeParams,ComponenteService){return{restrict:'AE',scope:true,controller:'ComponenteProdutosController',link:function(scope,element,attr,model){scope.artigos="";var data=scope.linkData[0];var parametros=angular.fromJson(data.parametros);var request=$resource("/CmsComponentes/componente-produtos/getCategoria",{categoria_id:parametros.produto_categoria_id});var request_produto=$resource("/CmsComponentes/componente-produtos/getProduto",{apelido:$routeParams.apelido2});if($routeParams.apelido2!=undefined){request_produto.get(function(response){if(response.produto.length>0){scope.produto=response.produto[0];scope.fotos=response.fotos;scope.caracteristicas=response.caracteristicas;scope.categoria=response.categoria;scope.voltar=$routeParams.apelido1;scope.produto_parametros=angular.fromJson(scope.produto.parametros);scope.categoria_parametros=angular.fromJson(scope.categoria.parametros);scope.produtos_relacionados=response.produtos_relacionados;scope.menu_itens=response.menu_itens;var meta_tags={title:scope.produto.meta_title,description:scope.produto.meta_description,keywords:scope.produto.meta_keywords,author:scope.produto.meta_author};ComponenteService.setMetaTags(meta_tags);var templateUrl=PATH_TEMPLATES+'componentes/produto/produto/'+scope.categoria_parametros.template;var html="<div ng-include src=\"'"+templateUrl+"'\" />";var el=angular.element(html);var compile=$compile(el)(scope);element.html(compile);}else{$location.path('erro/404');}});}else{request.query(function(response){scope.produtos=angular.fromJson(response[0].produtos);scope.categoria=response[0].categoria;if(scope.categoria.length==0){element.html("<p>Categoria despublicada no momento.</p>");}else if(scope.produtos.length==0){element.html("<p>Nenhum produto cadastrado pra essa categoria.</p>");}else{scope.categoria_parametros=angular.fromJson(scope.categoria[0].parametros);var templateUrl=PATH_TEMPLATES+'componentes/produto/categoria-de-produto/'+scope.categoria_parametros.template;var html="<div ng-include src=\"'"+templateUrl+"'\" />";var el=angular.element(html);var compile=$compile(el)(scope);element.html(compile);}},function(response){element.html("<p>Erro ao carregar produtos.</p>");});}}}});$app.directive('componenteUnicoContato',function($resource,$compile,$http,PATH_TEMPLATES){return{restrict:'AE',scope:true,controller:'ComponenteContatosController',link:function(scope,element,attr,model){var data=scope.linkData[0];var parametros=angular.fromJson(data.parametros);var request=$resource('/CmsComponentes/componente-contatos/getContato',{contato:parametros.contato_id});request.query(function(response){scope.contato=response[0];scope.contato_form.contato_id=scope.contato.id;scope.contato_form.config_global=scope.contato.config_global;var templateUrl=PATH_TEMPLATES+'componentes/contato/unico-contato.html';var html="<div ng-include src=\"'"+templateUrl+"'\" />";var el=angular.element(html);var compile=$compile(el)(scope);element.html(compile);});}}});$app.directive('componenteUnicoArtigo',function($resource,$compile,$http,PATH_TEMPLATES){return{restrict:'AE',scope:true,controller:'ComponenteArtigosController',link:function(scope,element,attr,model){var data=scope.linkData[0];var parametros=angular.fromJson(data.parametros);var request=$resource("/CmsComponentes/componente-artigos/getArtigo",{artigo_id:parametros.artigo_id});request.query(function(response){scope.artigo=response[0];scope.artigo_titulo="<"+scope.artigo.tag_titulo+">"+scope.artigo.titulo+"</"+scope.artigo.tag_titulo+">";scope.artigo_parametros=angular.fromJson(response[0].parametros);var template="";if(scope.artigo_parametros.template==undefined){template='padrao.html'}else{template=scope.artigo_parametros.template;}
var templateUrl=PATH_TEMPLATES+'componentes/artigo/unico-artigo/'+template;var html="<div ng-include src=\"'"+templateUrl+"'\" />";var el=angular.element(html);var compile=$compile(el)(scope);element.html(compile);});}}});$app.directive('componenteCategoriaArtigo',function($location,$resource,$compile,$http,PATH_TEMPLATES,$routeParams,ComponenteService){return{restrict:'AE',scope:true,controller:'ComponenteArtigosController',link:function(scope,element,attr,model){scope.artigos="";var data=scope.linkData[0];var parametros=angular.fromJson(data.parametros);var request=$resource("/CmsComponentes/componente-artigos/getCategoria",{categoria_id:parametros.categoria_id});var request_artigo=$resource("/CmsComponentes/componente-artigos/getArtigoApelido",{apelido:$routeParams.apelido2});if($routeParams.apelido2!=undefined){request_artigo.query(function(response){if(response.length>0){var length_template=parametros.categoria_template.length-5;var meta_tags={title:response[0].meta_title,description:response[0].meta_description,keywords:response[0].meta_keywords,author:response[0].meta_author};ComponenteService.setMetaTags(meta_tags);scope.artigo=response[0];scope.voltar=$routeParams.apelido1;scope.artigo_parametros=angular.fromJson(response[0].parametros);scope.categoria_template='template-'+parametros.categoria_template.substr(0,length_template)+"-detalhe";var template=parametros.categoria_template.substr(0,length_template)+".html";var templateUrl=PATH_TEMPLATES+'componentes/artigo/categoria-de-artigo/detalhe/'+template;var html="<div ng-include src=\"'"+templateUrl+"'\" />";var el=angular.element(html);var compile=$compile(el)(scope);element.html(compile);}else{$location.path('erro/404');}});}else{request.query(function(response){var length_template=parametros.categoria_template.length-5;scope.artigos=response[0].artigos;scope.categoria=response[0].categoria;scope.categoria_parametros=angular.fromJson(scope.categoria.parametros);scope.categoria_template='template-'+parametros.categoria_template.substr(0,length_template);var templateUrl=PATH_TEMPLATES+'componentes/artigo/categoria-de-artigo/categoria/'+scope.categoria_parametros.template_categoria;var html="<div ng-include src=\"'"+templateUrl+"'\" />";var el=angular.element(html);var compile=$compile(el)(scope);element.html(compile);});}}}});