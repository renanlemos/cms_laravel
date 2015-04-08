<!doctype html>
<html ng-app="CmsLaravel">
<head>
    <title>Admin Cms Laravel</title>
    <meta charset="utf-8">
    <meta content="width=device-width,initial-scale=1.0,user-scalable=no;user-scalable=0;" name="viewport">

    <?php DirHelper::generateLinksToPath('assets/css/jquery','css'); ?>
    <?php DirHelper::generateLinksToPath('assets/css/elfinder','css'); ?>
    <?php DirHelper::generateLinksToPath('assets/css/kendo/silver','css'); ?>
    <?php DirHelper::generateLinksToPath('assets/css/bootmetro','css'); ?>
    <?php echo Minify::stylesheetDir('/assets/css/template/admin'); ?>
</head>
<?php flush(); ?>
<body ng-class="{'login':isLogado == false}">
    <template-topo ng-if="isLogado == true"></template-topo>
    <div class="clear"></div>
    <main>   
        <div class="container-fluid">
            <template-menu ng-if="isLogado == true"></template-menu>   
            <section ng-class="{'content-view':isLogado == true,'content-login':isLogado == false}">
                <div class="page-loading" ng-show="isViewLoading == true">
                    <img src="/assets/images/loading.gif" alt="Loading" />
                </div>    
                <div ng-show="isViewLoading == false">
                    <div ng-view class="">
                    </div>
                </div>    
            </section>    
        </div>
    </main>  
    <?php DirHelper::generateLinksToPath('assets/js/jquery','js'); ?>
    <?php DirHelper::generateLinksToPath('assets/js/elfinder','js'); ?>
    <?php DirHelper::generateLinksToPath('assets/js/ckeditor','js'); ?>
    <?php DirHelper::generateLinksToPath('assets/js/kendo','js'); ?>
    <?php echo Minify::javascriptDir('/assets/js/plugins'); ?>

    <?php DirHelper::generateLinksToPath('assets/js/modulos','js'); ?>
    <?php echo Minify::javascript('/assets/js/admin/app.js'); ?>
    
    <?php echo Minify::javascriptDir('/assets/js/admin/controllers'); ?>
    <?php echo Minify::javascriptDir('/assets/js/admin/filters'); ?>
    <?php echo Minify::javascriptDir('/assets/js/admin/services'); ?>
    <?php echo Minify::javascriptDir('/assets/js/admin/widgets'); ?>  
</body>
</html>