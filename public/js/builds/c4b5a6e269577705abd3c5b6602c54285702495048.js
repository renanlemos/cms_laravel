$app.service('ModuloService',function($resource,$http,$rootScope){this.readModulos=function(){var resquest=$resource('/CmsModulos/get-modulos');$rootScope.CmsModulos=resquest.query(function(response){return response;});}
this.getModulos=function(){return $rootScope.CmsModulos;}});$app.service('MenuService',function($resource,$http){var menuData;this.menu=function(){return itens=[{display:"HOME",href:"/",title:"Home",apelido:"home",itemParent:false},{display:"QUEM SOMOS",href:"/quem-somos",title:"Quem Somos",apelido:"quem-somos",itemParent:false},{display:"CONTATO",href:"/contato",title:"Contato",apelido:"contato",itemParent:false}];}
this.getTarifarios=function(){return $rootScope.cliente_tarifarios;}
this.getMenu=function(){return this.menu();}
this.isParent=function(id){var search=false;if(search==false){angular.forEach(this.menuData,function(v,k){if(v.item_pai==id){search=true;}});}
return search;}
this.getItensParent=function(id){var itens=[];angular.forEach(this.menuData,function(v,k){if(v.item_pai==id){itens.push(v);}});return itens;}
this.setMenuData=function(menu){this.menuData=menu;}
this.getMenuData=function(){var itens_pai=[];angular.forEach(this.menuData,function(v,k){if(v.item_pai==0){itens_pai.push(v);}});return itens_pai;}});$app.service('ComponenteService',function($resource,$http,$rootScope,$http,$location){this.getLink=function(){return $http({method:'GET',url:'/CmsComponentes/componentes/getLinkInicial'}).then(function(data){return data.data;});}
this.getLinkApelido=function(apelido){return $http({method:'GET',url:'/CmsComponentes/componentes/getLinkApelido',params:{apelido:apelido}}).then(function(data){if(data.data.length>0){return data.data;}else{$location.path('erro/404');}});}
this.getComponenteTemplate=function(componente,tipo){switch(componente){case'artigo':switch(tipo){case'unico-artigo':return'<componente-unico-artigo></componente-unico-artigo>'
break;case'categoria-de-artigo':return'<componente-categoria-artigo></componente-categoria-artigo>'
break;}
break;case'contato':switch(tipo){case'unico-contato':return'<componente-unico-contato></componente-unico-contato>'
break;}
break;}}
this.setMetaTags=function(meta_tags){if(meta_tags.title.length>0){$("title").html(meta_tags.title);}
if(meta_tags.description.length>0){$("meta[name=description]").attr('content',meta_tags.description);}
if(meta_tags.keywords.length>0){$("meta[name=keywords]").attr('content',meta_tags.keywords);}
if(meta_tags.author.length>0){$("meta[name=author]").attr('content',meta_tags.author);}}});$app.service("AuthService",function($rootScope,$resource,$location,$cookies,$timeout,$route){var permissoes="";this.verificaLogin=function(){var auth=$resource("/admin/auth/verify");auth.get(function(response){if(response.status==false){$rootScope.isLogado=false;$location.path("admin/login");}else{$rootScope.permissoes=angular.fromJson(response.data.permissoes);permissoes=angular.fromJson(response.data.permissoes);$rootScope.isLogado=true;$rootScope.nome_admin_logado=response.data.nome;$rootScope.nome_usuario_admin_logado=response.data.nome_usuario;$rootScope.id_usuario_admin_logado=response.data.id;$rootScope.email_admin_logado=response.data.email;}},function(response){});}
this.getPermissoes=function(){return $rootScope.permissoes;}
this.setPermissoes=function(data){$rootScope.permissoes=JSON.parse(data);}
this.getPermissao=function(apelido){var permissao=null;var search=false;if(search==false){angular.forEach(permissoes,function(value,key){if(apelido==value.nome){permissao=value;search=true;}});}
return permissao;}
this.checkView=function(apelido){var permissao=this.getPermissao(apelido);if(permissao==null){$location.path("admin/erro/403");return false;}
if(permissao.view==false){$location.path("admin/erro/403");}}
this.checkCreate=function(apelido){var permissao=this.getPermissao(apelido);if(permissao==null){alert("Sem permissão para criar.");return false;}
if(permissao.create==false){alert("Sem permissão para criar.");}
return permissao.create;}
this.checkUpdate=function(apelido){var permissao=this.getPermissao(apelido);if(permissao==null){alert("Sem permissão para alterar.");return false;}
if(permissao.update==false){alert("Sem permissão para alterar.");}
return permissao.update;}
this.checkDelete=function(apelido){var permissao=this.getPermissao(apelido);if(permissao==null){alert("Sem permissão para deletar.");return false;}
if(permissao.delete==false){alert("Sem permissão para deletar.");}
return permissao.delete;}
this.setLogin=function(user){$cookies.id_admin_logado=user[0].id;$cookies.nome_admin_logado=user[0].nome;$cookies.nome_usuario_admin_logado=user[0].nome_usuario;$cookies.email_admin_logado=user[0].email;}});