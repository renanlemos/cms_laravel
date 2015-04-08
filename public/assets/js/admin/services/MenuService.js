$app.service('MenuService',function($resource,$http,$compile){
	  
   this.menu = function(){
      return itens = [{display:"HOME",href:"/admin",title:"Home",apelido:"home",itemParent:false},
                      {display:"SITE",href:"#",title:"Site",apelido:"site",itemParent:true,
                      itens:[{display:"Configuração Global",href:"/admin/site/configuracao-global",title:"Configuração Global",apelido:"configuracao-global"}]},
                      {display:"USUÁRIOS",href:"/admin/usuarios",title:"Usuários",apelido:"usuarios",itemParent:false},
                      {display:"MENUS",href:"/admin/menus",title:"Menus",apelido:"menus",itemParent:false},
                      {display:"CONTEÚDO",href:"#",title:"Conteúdo",apelido:"conteudo",itemParent:true,
                      itens:[{display:"Artigos",href:"/admin/conteudo/artigos",title:"Artigos",apelido:"artigos",itemParent:false},
                      {display:"Categorias",href:"/admin/conteudo/artigo-categorias",title:"Categorias",apelido:"artigo-categorias",itemParent:false},
                      {display:"Mídias",href:"/admin/conteudo/midias",title:"Mídias",apelido:"midias",itemParent:false}]},
                      {display:"COMPONENTES",title:"Componentes",href:"#",apelido:"componentes",itemParent:true,
                      itens:[{display:"Banner Slider",href:"/admin/componentes/componente-banner-slider",title:"Banner Slider",apelido:"componente-banner-slider",itemParent:false},
                      {display:"Contato",href:"/admin/componentes/componente-contato",title:"Contato",apelido:"componente-contato",itemParent:false},
                      {display:"GEREN. PRODUTOS",title:"Produtos",href:"#",apelido:"componente-produtos",itemParent:true,itens:[
                      {display:"Categorias",title:"Categorias",href:"/admin/componentes/componente-produtos/componente-produto-categorias",apelido:"componente-produto-categorias",itemParent:false},
                      {display:"Produtos",title:"Gerenciador de Produtos",href:"/admin/componentes/componente-produtos/componente-produto-produtos",apelido:"componente-produto-produtos",itemParent:false},
                      {display:"Características",title:"Produtos Características",href:"/admin/componentes/componente-produtos/componente-produto-caracteristicas",apelido:"componente-produto-caracteristicas",itemParent:false},
                      {display:"Tipos de Características",title:"Tipos Características",href:"/admin/componentes/componente-produtos/componente-produto-caracteristica-tipos",apelido:"componente-produto-caracteristica-tipos",itemParent:false}]},
                      {display:"GEREN. EVENTOS",title:"Gerenciador de Eventos",href:"#",apelido:"componente-eventos",itemParent:true,itens:[
                      {display:"Eventos",title:"Eventos",href:"/admin/componentes/componente-eventos/componente-evento-eventos",apelido:"componente-evento-eventos",itemParent:false},
                      {display:"Categorias",title:"Categorias de Eventos",href:"/admin/componentes/componente-eventos/componente-evento-categorias",apelido:"componente-evento-categorias",itemParent:false},
                      {display:"Contatos",title:"Contatos de Eventos",href:"/admin/componentes/componente-eventos/componente-evento-contatos",apelido:"componente-evento-contatos",itemParent:false},
                      {display:"Serviços",title:"Serviços",href:"/admin/componentes/componente-eventos/hospedagem/componente-evento-servicos",apelido:"componente-evento-servicos",itemParent:false},
                      {display:"HOSPEDAGEM",title:"Hospedagem",href:"#",apelido:"hospedagem",itemParent:true,itens:[
                      {display:"Hotéis",title:"Hotéis",href:"/admin/componentes/componente-eventos/hospedagem/componente-evento-hospedagens",apelido:"componente-evento-hospedagens",itemParent:false},
                      {display:"Categorias",title:"Categorias",href:"/admin/componentes/componente-eventos/hospedagem/componente-evento-hospedagem-categorias",apelido:"componente-evento-hospedagem-categorias",itemParent:false},
                      {display:"Cidades",title:"Cidades",href:"/admin/componentes/componente-eventos/hospedagem/componente-evento-hospedagem-cidades",apelido:"componente-evento-hospedagem-cidades",itemParent:false},
                      {display:"Inclusos",title:"Inclusos",href:"/admin/componentes/componente-eventos/hospedagem/componente-evento-hospedagem-inclusos",apelido:"componente-evento-hospedagem-inclusos",itemParent:false}]}]}]},
                      {display:"MÓDULOS",title:"Módulos",href:"#",apelido:"modulos",itemParent:true,
                      itens:[{display:"Posição",href:"/admin/modulos/modulo-posicao",title:"Módulo Posição",apelido:"modulo-posicao",itemParent:false},
                      {display:"Html",href:"/admin/modulos/modulo-html",title:"Html",apelido:"modulo-html",itemParent:false},
                      {display:"Banner Slider",href:"/admin/modulos/modulo-banner-slider",title:"Banner Slider",apelido:"modulo-banner-slider",itemParent:false},
                      {display:"Contato",href:"/admin/modulos/modulo-contato",title:"Contato",apelido:"modulo-contato",itemParent:false},
                      {display:"Menu",href:"/admin/modulos/modulo-menu",title:"Menu",apelido:"modulo-menu",itemParent:false},
                      {display:"Clima Tempo",href:"/admin/modulos/modulo-clima-tempo",title:"Clima Tempo",apelido:"modulo-clima-tempo",itemParent:false},
                      {display:"PRODUTOS",href:"#",title:"Produtos",apelido:"modulo-produtos",itemParent:true,
                      itens:[{display:"Produtos em Destaques",href:"/admin/modulos/modulo-produtos/modulo-produto-destaques",title:"Produto em Destaque",apelido:"modulo-produto-destaques",itemParent:false}]}]},
                      {display:"LOGS",title:"Logs",href:"/admin/logs",apelido:"logs",itemParent:false}];
   }
   this.getTarifarios = function(){
      return $rootScope.cliente_tarifarios;
   }
   this.getMenu = function(){
   	  return this.menu();
   }
   this.updateClienteTarifarios = function(){
      var c = $resource('/tarifarios/tarifarios-cliente-logado');
      
      c.query(function(response){
        $cookies.cliente_tarifarios = angular.toJson(response);
      },function(response){
        alert("Erro ao carregar tarifários.");
      });
   }
  this.parametrosUnicoArtigo = function(){
    var parametros = [{label:"Artigo",input:"<input type='text' ng-model='dataItem.parametros.artigo_id' kendo-combo-box k-options='comboArtigos' class='span12'/>"}];
    
    return getParametrosHtml(parametros);
  }
  this.parametrosCategoriaArtigo = function(){
    var parametros = [{label:"Categoria",input:"<input type='text' ng-model='dataItem.parametros.categoria_id' kendo-combo-box k-options='comboCategoriaArtigos' class='span12'/>"}];
    
    return getParametrosHtml(parametros);
  }
  this.parametrosUnicoContato = function(){
    var parametros = [{label:"Contato",input:"<input type='text' ng-model='dataItem.parametros.contato_id' kendo-combo-box k-options='comboContatos' class='span12'/>"}];
    
    return getParametrosHtml(parametros);
  }
  this.parametrosUnicoProduto = function(){
    var parametros = [{label:"Produto",input:"<input type='text' ng-model='dataItem.parametros.produto_id' kendo-combo-box k-options='comboProdutos' class='span12'/>"},
                      {label:"Template",input:"<input type='text' ng-model='dataItem.parametros.template' kendo-combo-box k-options='comboTemplateProduto' class='span12'/>"}];
    
    return getParametrosHtml(parametros);
  }
  this.parametrosCategoriaProduto = function(){
    var parametros = [{label:"Categoria",input:"<input type='text' ng-model='dataItem.parametros.produto_categoria_id' kendo-combo-box k-options='comboCategoriaProduto' class='span12'/>"}];
    
    return getParametrosHtml(parametros);
  }
  this.parametrosUnicoEvento = function(){
    var parametros = [{label:"Evento",input:"<input type='text' ng-model='dataItem.parametros.produto_categoria_id' kendo-combo-box k-options='comboCategoriaProduto' class='span12'/>"}];
    
    return getParametrosHtml(parametros);
  }
  this.parametrosCategoriaEvento = function(){
    var parametros = [{label:"Categoria de Evento",input:"<input type='text' ng-model='dataItem.parametros.evento_categoria_id' kendo-combo-box k-options='comboCategoriaEvento' class='span12'/>"},
                      {label:"Listar Eventos:",input:"<input type='text' ng-model='dataItem.parametros.evento_status' kendo-combo-box k-options='comboEventosStatus' class='span12'/>"}];
    
    return getParametrosHtml(parametros);
  }
  getParametrosHtml = function(parametros){
    var html = "";
    angular.forEach(parametros,function(v,k){
      html += "<div class='row-fluid'>";
      html += "<label>"+v.label+"</label>";
      html += v.input;
      html += "</div>";
    });
    return html; 
  }
  

}); 