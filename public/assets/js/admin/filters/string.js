$app.filter('substring', function() {
    return function(item) {
        var contador = item.length;

        if(contador > 100){
        	return item.substring(0,100)+"...";
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
$app.filter('limpa_titulo',function(){
    return function(string) {
        //var s = string.replace("</span>", "");

        return string;
    };
 });
