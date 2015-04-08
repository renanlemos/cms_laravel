<!doctype html>
<html lang="pt-br">
<head>
	<meta charset="UTF-8">
	<?php DirHelper::generateLinksToPath('assets/css/jquery','css'); ?>
	<?php DirHelper::generateLinksToPath('assets/css/elfinder','css'); ?>
	<?php DirHelper::generateLinksToPath('assets/js/jquery','js'); ?>
    <?php DirHelper::generateLinksToPath('assets/js/elfinder','js'); ?>	
    <script>
	$(document).ready( function() {
		var xhReq = new XMLHttpRequest();
		xhReq.open("GET", "/admin/auth/token", false);
		xhReq.send(null);
		var token = xhReq.responseText;

		function getUrlParam(paramName) {
	        var reParam = new RegExp('(?:[\?&]|&amp;)' + paramName + '=([^&]+)', 'i') ;
	        var match = window.location.search.match(reParam) ;

	        return (match && match.length > 1) ? match[1] : '' ;
      	}
      	var funcNum = getUrlParam('CKEditorFuncNum');
		
		$("#elfinder").elfinder({
	        toolbar : [
	        ['back', 'forward'],
	        ['reload'],
	        ['home', 'up'],
	        ['mkdir', 'mkfile', 'upload'],
	        ['open', 'download', 'getfile'],
	        ['info'],
	        ['quicklook'],
	        ['copy', 'cut', 'paste'],
	        ['rm'],
	        ['duplicate', 'rename', 'edit', 'resize'],
	        ['extract', 'archive'],
	        ['search'],
	        ['view'],
	        ['help']
	        ],
	        url : '/admin/elfinder/connector?_token='+token, 
	        lang: 'pt_BR',
	        getFileCallback : function(file) {
          		window.opener.CKEDITOR.tools.callFunction(funcNum, file.url);
          		window.close();
        	}
        }).elfinder('instance');
	});
    </script>

	<title>Cms Laravel - Elfinder</title>

</head>
<body>
	<div id="elfinder"></div>
</body>
</html>