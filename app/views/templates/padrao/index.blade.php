<!doctype html>
<html ng-app="CmsLaravelSite">
<head>
    {{ SiteHelper::config(); }}
    {{ SiteHelper::head(); }}
    <?php DirHelper::generateLinksToPath('assets/css/jquery','css'); ?>
    <?php DirHelper::generateLinksToPath('assets/templates/padrao/css/bootmetro','css'); ?>
    <?php echo Minify::stylesheetDir('/assets/templates/padrao/css/template'); ?>
    <?php echo Minify::stylesheetDir('/assets/templates/includes/css/plugins'); ?>
    <?php echo Minify::stylesheetDir('/assets/templates/includes/css/componentes'); ?>
    <?php echo Minify::stylesheetDir('/assets/templates/includes/css/modulos'); ?>  
</head>
<?php flush(); ?>
<body>
   <header>
       <div id="header-topo"></div> 
       <div class="container">
            <div class="row-fluid">
                <div class="span2">
                    <modulo posicao="LOGO" class="logo"></modulo>
                </div>    
                <div class="span10"> 
                    <modulo posicao="MENU_PRINCIPAL"></modulo>
                </div> 
            </div>       
       </div>
   </header> 
   <main> 
       <div class="page-loading" ng-show="isViewLoading == true">
            <div class='container'>
                <img src="/assets/images/loading.gif" alt="Loading" />
            </div>    
        </div>    
        <div ng-show="isViewLoading == false">
            <div class='container'>
                <div ng-view></div>
            </div>    
        </div> 
    </main>
    <section class='passeios-em-destaque'>
        <div class='container'>
            <modulo posicao='PASSEIOS_DESTAQUES'></modulo>
        </div>    
    </section>  
    <section class='produtos-em-destaque'>
        <div class='container'>
            <modulo posicao='PRODUTOS_DESTAQUES'></modulo>
        </div>    
    </section>    
    <footer>
        <div class="container">
            <div class="row-fluid">
                <div class="span3">
                    <modulo posicao="FOOTER1"></modulo>
                </div> 
                <div class="span3">
                    <modulo posicao="FOOTER2"></modulo>
                </div> 
                <div class="span3">
                    <modulo posicao="FOOTER3"></modulo>
                </div> 
                <div class="span3">
                    <modulo posicao="FOOTER4"></modulo>
                    <modulo posicao="TEMPO"></modulo>
                </div>    
            </div> 
        </div>       
    </footer> 
    <?php DirHelper::generateLinksToPath('assets/js/jquery','js'); ?>
    <?php DirHelper::generateLinksToPath('assets/templates/includes/js/plugins','js'); ?>
    <?php DirHelper::generateLinksToPath('assets/templates/padrao/js/modulos','js'); ?>
    <?php echo Minify::javascript('/assets/templates/padrao/js/app.js'); ?>
    <?php echo Minify::javascriptDir('/assets/templates/includes/js/controllers'); ?>
    <?php echo Minify::javascriptDir('/assets/templates/includes/js/filters'); ?>
    <?php echo Minify::javascriptDir('/assets/templates/includes/js/services'); ?>
    <?php echo Minify::javascriptDir('/assets/templates/includes/js/widgets'); ?>
    
    {{ SiteHelper::analytics(); }}  
</body>
</html>