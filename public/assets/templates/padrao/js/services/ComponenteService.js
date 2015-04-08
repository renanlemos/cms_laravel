$app.service('ComponenteService',function($resource,$http,$rootScope,$http,$location){
   
   	  
  this.getLink = function(){
    return $http({method: 'GET', url: '/CmsComponentes/componentes/getLinkInicial'}).then(function (data) {
      return data.data;
    });
  }
  this.getLinkApelido = function(apelido){
    return $http({method: 'GET', url: '/CmsComponentes/componentes/getLinkApelido',params:{apelido:apelido}}).then(function (data) {
      if(data.data.length > 0){
        return data.data;
      }else{
        $location.path('erro/404');
      }  
    });
  }
  this.getComponenteTemplate = function(componente,tipo){
    switch(componente){
      case 'artigo':
        switch(tipo){
          case 'unico-artigo':
            return '<componente-unico-artigo></componente-unico-artigo>'
          break;
          case 'categoria-de-artigo':
            return '<componente-categoria-artigo></componente-categoria-artigo>'
          break;
        }
      break;
      case 'contato':
        switch(tipo){
          case 'unico-contato':
            return '<componente-unico-contato></componente-unico-contato>'
          break;
        }
      break;
    }
  }  
  this.setMetaTags = function(meta_tags){
    if(meta_tags.title.length > 0){
      $("title").html(meta_tags.title);
    }
    if(meta_tags.description.length > 0){
      $("meta[name=description]").attr('content',meta_tags.description);
    }
    if(meta_tags.keywords.length > 0){
      $("meta[name=keywords]").attr('content',meta_tags.keywords);
    }  
    if(meta_tags.author.length > 0){
      $("meta[name=author]").attr('content',meta_tags.author);
    }  
  }
}); 