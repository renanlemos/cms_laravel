$app.filter('substring', function() {
    return function(item,intervalo) {
        var contador = item.length;
        var i = intervalo.split('-');
        var intervalo1 = parseInt(i[0]);
        var intervalo2 = parseInt(i[1]);
        var contador_intervalo = intervalo2 - intervalo1;

        if(contador > contador_intervalo){
        	return item.substring(intervalo1,intervalo2)+"...";
        }else{
        	return item;
        } 
        
    }
});
$app.filter('to_trusted',function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
 });
