$app.service('ListDataService',function(){

    this.getForeignText = function(data,value){
        var search = false;
        var text = "";
        if(search == false){
            angular.forEach(data,function(v,k){
                if(v.value == value){
                    text = v.text;
                    search = true;
                }
            }); 
        }    
        return text;
    }
	this.moduloPosicaoGrid =  function(){
        var data = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/admin/modulo-posicaos/combo",
                    async: false
                }
            },
            schema: {
                parse: function (data) {
                    var dados = [];
                    for (var i = 0; i < data.length; i++) {
                        var item = {
                            value: data[i].id,
                            text: data[i].descricao
                           
                        };
                        dados.push(item);
                    }
                    return dados;
                }
            }
        });
        data.read();
        return data.data().toJSON();
    }
    this.artigoCategoriasGrid =  function(){
        var data = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/admin/conteudo/artigo-categorias/combo",
                    async: false
                }
            },
            schema: {
                parse: function (data) {
                    var dados = [];
                    for (var i = 0; i < data.length; i++) {
                        var item = {
                            value: data[i].id,
                            text: data[i].descricao
                           
                        };
                        dados.push(item);
                    }
                    return dados;
                }
            }
        });
        data.read();
        return data.data().toJSON();
    }
    this.menuItensItemPai =  function(id){
        var data = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/admin/menu-itens/combo-item-pai?menu_id="+id,
                    async: false
                }
            },
            schema: {
                parse: function (data) {
                    var dados = [];
                    for (var i = 0; i < data.length; i++) {
                        var item = {
                            value: data[i].id,
                            text: data[i].titulo
                           
                        };
                        dados.push(item);
                    }
                    return dados;
                }
            }
        });
        data.read();
        return data.data().toJSON();
    }
});