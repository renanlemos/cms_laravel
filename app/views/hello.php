<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<?php DirHelper::generateLinksToPath('assets/css/jquery','css'); ?>
	<?php //DirHelper::generateLinksToPath('assets/css/elfinder','css'); ?>
	<?php DirHelper::generateLinksToPath('assets/js/jquery','js'); ?>
    <?php //DirHelper::generateLinksToPath('assets/js/elfinder','js'); ?>	
    <?php DirHelper::generateLinksToPath('assets/js/ckeditor','js'); ?>


    <script>
    CKEDITOR.disableAutoInline = true;

		$( document ).ready( function() {
			$( '#teste' ).ckeditor(); // Use CKEDITOR.replace() if element is <textarea>.
			$( '#editable' ).ckeditor(); // Use CKEDITOR.inline().
		} );
    </script>

	<title>Laravel PHP Framework</title>

</head>
<body>
	<textarea id="teste"></textarea>

</body>
</html>
