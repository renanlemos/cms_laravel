$app.service('MenuService',function($resource,$http){
	
  var menuData;

  this.menu = function(){
    return itens = [{display:"HOME",href:"/",title:"Home",apelido:"home",itemParent:false},
                      {display: "QUEM SOMOS",href:"/quem-somos",title:"Quem Somos",apelido:"quem-somos",itemParent:false},
                      {display: "CONTATO",href:"/contato",title:"Contato",apelido:"contato",itemParent:false}];
  }
  this.getTarifarios = function(){
    return $rootScope.cliente_tarifarios;
  }
  this.getMenu = function(){
    return this.menu();
  }
  /*this.contemItemPai = function(data,id){
    var search = false;
    var sub_itens = [];
    var resp = false;
    
    angular.forEach(data,function(v,k){
      if(v.item_pai == id){
        sub_itens.push(v); 
      }
    });
    if(sub_itens.length > 0){resp = true;};

    return {status:resp,sub_itens:sub_itens};
  }*/
  this.isParent = function(id){
    var search = false;
  
    if(search == false){
      angular.forEach(this.menuData,function(v,k){
        if(v.item_pai == id){
          search = true;
         }
      });
    }  
    return search;
  }
  this.getItensParent = function(id){
    var itens = [];
    angular.forEach(this.menuData,function(v,k){
      if(v.item_pai == id){
        itens.push(v);
      }
    }); 
    return itens;
  }
  this.setMenuData = function(menu){
      this.menuData = menu;
  }
  this.getMenuData = function(){
    
    var itens_pai = [];
    angular.forEach(this.menuData,function(v,k){
      if(v.item_pai == 0){
        itens_pai.push(v);
      }
    }); 
    return itens_pai;
  }

}); 