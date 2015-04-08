$app.service("AuthService",function($rootScope,$resource,$location,$cookies,$timeout,$route){

  var permissoes = "";

	this.verificaLogin = function(){
      var auth = $resource("/admin/auth/verify");
      
      auth.get(function(response){
        if(response.status == false){
          
          $rootScope.isLogado = false;
          $location.path("admin/login");
        }else{
          $rootScope.permissoes = angular.fromJson(response.data.permissoes);
          permissoes = angular.fromJson(response.data.permissoes); 
          $rootScope.isLogado = true;
          $rootScope.nome_admin_logado = response.data.nome;
          $rootScope.nome_usuario_admin_logado = response.data.nome_usuario;
          $rootScope.id_usuario_admin_logado = response.data.id;
          $rootScope.email_admin_logado = response.data.email;
        }
      },function(response){

      });
  }
  this.getPermissoes = function(){
    return $rootScope.permissoes;
  } 
  this.setPermissoes = function(data){
    $rootScope.permissoes = JSON.parse(data);
  } 
  this.getPermissao = function(apelido){
    
    var permissao = null;
    var search = false;

    if(search == false){
      angular.forEach(permissoes,function(value,key){
        if(apelido == value.nome){
          permissao = value;
          search = true;
        }
      });
    }
    return permissao;
  }
  this.checkView = function(apelido){
    var permissao = this.getPermissao(apelido);

    if(permissao == null){
      $location.path("admin/erro/403");
      return false;
    }
    if(permissao.view == false){
      $location.path("admin/erro/403");
    }
  } 
  this.checkCreate = function(apelido,message){
    var permissao = this.getPermissao(apelido);

    if(permissao == null){
      if(message){
        alert("Sem permissão para criar.");
      }  
      return false;
    }
    if(permissao.create == false){
      if(message){
        alert("Sem permissão para criar.");
      }  
    }

    return  permissao.create;
  } 
  this.checkUpdate = function(apelido,message){
    var permissao = this.getPermissao(apelido);
    
    if(permissao == null){
      if(message){
        alert("Sem permissão para alterar.");
      }
      return false;
    }
    if(permissao.update == false){
      if(message){
        alert("Sem permissão para alterar.");
      }  
    }
    return permissao.update;
  }  
  this.checkDelete = function(apelido,message){
    var permissao = this.getPermissao(apelido);
    
    if(permissao == null){
      if(message){
        alert("Sem permissão para deletar.");
      }
      return false;
    }
    if(permissao.delete == false){
      if(message){
        alert("Sem permissão para deletar.");
      }  
    }
    return permissao.delete;
  } 
  this.setLogin = function(user){

      $cookies.id_admin_logado = user[0].id;
      $cookies.nome_admin_logado = user[0].nome;
      $cookies.nome_usuario_admin_logado = user[0].nome_usuario;
      $cookies.email_admin_logado = user[0].email;
  }
  
});