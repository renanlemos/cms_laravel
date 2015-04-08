(function(f,define){define(["jquery","angular","kendo"],f)})(function($,angular,kendo){"use strict";var _UID_=kendo.attr("uid");var module=angular.module('kendo.directives',[]);var parse,timeout,compile=function compile(){return compile},log;function immediately(f){var save_timeout=timeout;timeout=function(f){return f()};try{return f()}finally{timeout=save_timeout}}var OPTIONS_NOW;var factories={dataSource:(function(){var types={TreeView:'HierarchicalDataSource',Scheduler:'SchedulerDataSource',PanelBar:'$PLAIN',};var toDataSource=function(dataSource,type){if(type=='$PLAIN')return dataSource;return kendo.data[type].create(dataSource)};return function(scope,element,attrs,role){var type=types[role]||'DataSource';var ds=toDataSource(scope.$eval(attrs.kDataSource),type);element.data('$kendoDataSource',ds);scope.$watch(attrs.kDataSource,function(mew,old){if(mew!==old){var ds=toDataSource(mew,type);element.data('$kendoDataSource',ds);var widget=kendoWidgetInstance(element);if(widget&&typeof widget.setDataSource=="function"){widget.setDataSource(ds)}}});return ds}}()),widget:(function(){var ignoredAttributes={kDataSource:true,kOptions:true,kRebind:true,kNgModel:true,};return function(scope,element,attrs,widget){var role=widget.replace(/^kendo/,'');var options=angular.extend({},scope.$eval(attrs.kOptions));$.each(attrs,function(name,value){if(!ignoredAttributes[name]){var match=name.match(/^k(On)?([A-Z].*)/);if(match){var optionName=match[2].charAt(0).toLowerCase()+match[2].slice(1);if(match[1]){options[optionName]=value}else{options[optionName]=angular.copy(scope.$eval(value));if(options[optionName]===undefined&&value.match(/^\w*$/)){log.warn(widget+'\'s '+name+' attribute resolved to undefined. Maybe you meant to use a string literal like: \''+value+'\'?')}}}}});options.dataSource=element.inheritedData('$kendoDataSource')||options.dataSource;if(attrs.kDataSource){options.dataSource=factories.dataSource(scope,element,attrs,role)}options.$angular=true;var ctor=$(element)[widget];if(!ctor){console.error("Could not find: "+widget);return null}var object=ctor.call(element,OPTIONS_NOW=options).data(widget);exposeWidget(object,scope,attrs,widget);scope.$emit("kendoWidgetCreated",object);return object}}())};function exposeWidget(widget,scope,attrs,kendoWidget){if(attrs[kendoWidget]){var set=parse(attrs[kendoWidget]).assign;if(set){set(scope,widget)}else{throw new Error(kendoWidget+' attribute used but expression in it is not assignable: '+attrs[kendoWidget]);}}}module.factory('directiveFactory',['$timeout','$parse','$compile','$log',function($timeout,$parse,$compile,$log){timeout=$timeout;parse=$parse;compile=$compile;log=$log;var KENDO_COUNT=0;var create=function(role){return{restrict:"ACE",require:["?ngModel","^?form"],scope:false,link:function(scope,element,attrs,controllers){var ngModel=controllers[0];var ngForm=controllers[1];$(element)[0].removeAttribute("data-"+role.replace(/([A-Z])/g,"-$1"));++KENDO_COUNT;timeout(function(){if(attrs.kRebind){var originalElement=$(element)[0].cloneNode(true);scope.$watch(attrs.kRebind,function(newValue,oldValue){if(newValue!==oldValue){try{var _wrapper=$(widget.wrapper)[0];var _element=$(widget.element)[0];if(widget){widget.destroy();widget=null}if(_wrapper&&_element){_wrapper.parentNode.replaceChild(_element,_wrapper);var clone=originalElement.cloneNode(true);$(element).replaceWith(clone);element=$(clone)}widget=factories.widget(scope,element,attrs,role);setupBindings()}catch(ex){console.error(ex);console.error(ex.stack)}}},true)}var widget=factories.widget(scope,element,attrs,role);setupBindings();var prev_destroy=null;function setupBindings(){var isFormField=/^(input|select|textarea)$/i.test(element[0].tagName);function value(){return isFormField?element.val():widget.value()}if(prev_destroy){prev_destroy()}prev_destroy=scope.$on("$destroy",function(){if(widget){widget.destroy();widget=null}});OUT:if(ngModel){if(!widget.value){break OUT}ngModel.$render=function(){widget.value(ngModel.$viewValue)};var haveChangeOnElement;if(isFormField){element.on("change",function(){haveChangeOnElement=true})}var onChange=function(pristine){return function(){haveChangeOnElement=false;timeout(function(){if(haveChangeOnElement)return;if(pristine&&ngForm){var formPristine=ngForm.$pristine}ngModel.$setViewValue(value());if(pristine){ngModel.$setPristine();if(formPristine){ngForm.$setPristine()}}})}};bindBefore(widget,"change",onChange(false));bindBefore(widget,"dataBound",onChange(true));var currentVal=value();if(currentVal!=ngModel.$viewValue){if(!ngModel.$isEmpty(ngModel.$viewValue)){widget.value(ngModel.$viewValue)}else if(currentVal!=null&&currentVal!=""&&currentVal!=ngModel.$viewValue){ngModel.$setViewValue(currentVal)}}ngModel.$setPristine()}OUT:if(attrs.kNgModel){if(typeof widget.value!="function"){log.warn("k-ng-model specified on a widget that does not have the value() method: "+(widget.options.name));break OUT}var getter=parse(attrs.kNgModel);var setter=getter.assign;var isEmpty=widget.value()==null||widget.value()=="";if(getter(scope)!==widget.value()&&!isEmpty){setter(scope,widget.value())}else if(isEmpty){widget.value(getter(scope));widget.trigger("change")}scope.$watch(attrs.kNgModel,function(newValue,oldValue){if(newValue===oldValue)return;widget.value(newValue)});widget.bind("change",function(){setter(scope,widget.value())})}}(function(){if(!(window.MutationObserver&&widget.wrapper)){return}var prevClassList=[].slice.call($(element)[0].classList);var mo=new MutationObserver(function(changes,mo){suspend();if(!widget)return;changes.forEach(function(chg){var w=$(widget.wrapper)[0];switch(chg.attributeName){case"class":var currClassList=[].slice.call(chg.target.classList);currClassList.forEach(function(cls){if(prevClassList.indexOf(cls)<0){w.classList.add(cls)}});prevClassList.forEach(function(cls){if(currClassList.indexOf(cls)<0){w.classList.remove(cls)}});prevClassList=currClassList;break;case"disabled":if(typeof widget.enable=="function"){widget.enable(!$(chg.target).attr("disabled"))}break;case"readonly":if(typeof widget.readonly=="function"){widget.readonly(!!$(chg.target).attr("readonly"))}break}});resume()});function suspend(){mo.disconnect()}function resume(){mo.observe($(element)[0],{attributes:true})}resume();bindBefore(widget,"destroy",suspend)})();--KENDO_COUNT;if(KENDO_COUNT==0){scope.$emit("kendoRendered")}})}}};return{create:create}}]);(function(){function createDirectives(prefix){return function(namespace){angular.forEach(namespace,function(value,key){if(key.match(/^[A-Z]/)&&key!=='Widget'){var widget="kendo"+prefix+key;module.directive(widget,["directiveFactory",function(directiveFactory){return directiveFactory.create(widget)}])}})}}angular.forEach([kendo.ui,kendo.dataviz&&kendo.dataviz.ui],createDirectives(""));angular.forEach([kendo.mobile&&kendo.mobile.ui],createDirectives("Mobile"))})();function kendoWidgetInstance(el){el=$(el);return kendo.widgetInstance(el,kendo.ui)||kendo.widgetInstance(el,kendo.mobile.ui)||kendo.widgetInstance(el,kendo.dataviz.ui)}function bindBefore(widget,name,handler,one){widget.bind.call(widget,name,handler,one);var a=widget._events[name];a.unshift(a.pop())}function digest(scope){if(!/^\$(digest|apply)$/.test(scope.$root.$$phase)){scope.$digest()}}function destroyScope(scope,el){scope.$destroy();if(el){$(el).removeData("$scope").removeData("$isolateScope").removeData("$isolateScopeNoTemplate").removeClass("ng-scope")}}function defadvice(klass,methodName,func){if($.isArray(klass)){return angular.forEach(klass,function(klass){defadvice(klass,methodName,func)})}if(typeof klass=="string"){var a=klass.split(".");var x=kendo;while(x&&a.length>0)x=x[a.shift()];if(!x){return}klass=x}var origMethod=klass.prototype[methodName];klass.prototype[methodName]=function(){var self=this,args=arguments;return func.apply({self:self,next:function(){return origMethod.apply(self,arguments.length>0?arguments:args)}},args)}}var BEFORE="$angular_beforeCreate";var AFTER="$angular_afterCreate";defadvice("ui.Widget","init",function(element,options){if(!options&&OPTIONS_NOW)options=OPTIONS_NOW;OPTIONS_NOW=null;var self=this.self;if(options&&options.$angular){self.$angular_beforeCreate(element,options);this.next();self.$angular_afterCreate()}else{this.next()}});defadvice("ui.Widget",BEFORE,function(element,options){var self=this.self;if(options&&!$.isArray(options)){var scope=angular.element(element).scope();for(var i=self.events.length;--i>=0;){var event=self.events[i];var handler=options[event];if(handler&&typeof handler=="string")options[event]=self.$angular_makeEventHandler(event,scope,handler)}}});defadvice("ui.Widget",AFTER,function(){});defadvice("ui.Widget","$angular_makeEventHandler",function(event,scope,handler){handler=parse(handler);return function(e){if(/^\$(apply|digest)$/.test(scope.$root.$$phase)){handler(scope,{kendoEvent:e})}else{scope.$apply(function(){handler(scope,{kendoEvent:e})})}}});defadvice(["ui.Grid","ui.ListView"],"$angular_makeEventHandler",function(event,scope,handler){if(event!="change")return this.next();handler=parse(handler);return function(ev){var widget=ev.sender;var options=widget.options;var dataSource=widget.dataSource;var cell,multiple,locals={kendoEvent:ev},elems,items,columns,colIdx;if(angular.isString(options.selectable)){cell=options.selectable.indexOf('cell')!==-1;multiple=options.selectable.indexOf('multiple')!==-1}elems=locals.selected=this.select();items=locals.data=[];columns=locals.columns=[];for(var i=0;i<elems.length;i++){var item=cell?elems[i].parentNode:elems[i];var itemUid=$(item).attr(_UID_);var dataItem=dataSource.getByUid(itemUid);if(cell){if(angular.element.inArray(dataItem,items)<0){items.push(dataItem)}colIdx=angular.element(elems[i]).index();if(angular.element.inArray(colIdx,columns)<0){columns.push(colIdx)}}else{items.push(dataItem)}}if(!multiple){locals.data=items[0];locals.selected=elems[0]}scope.$apply(function(){handler(scope,locals)})}});defadvice(["ui.PanelBar","ui.TabStrip","ui.Splitter"],AFTER,function(){this.next();var self=this.self;var scope=angular.element(self.element).scope();if(scope)bindBefore(self,"contentLoad",function(ev){var contentElement=ev.contentElement||ev.pane;compile(ev.contentElement)(scope);digest(scope)})});defadvice("ui.Draggable","_start",function(){this.next();var self=this.self;if(self.hint){var scope=angular.element(self.currentTarget).scope();if(scope){compile(self.hint)(scope);digest(scope)}}});defadvice("ui.Grid",BEFORE,function(element,options){this.next();if(options.columns)angular.forEach(options.columns,function(col){if(col.field&&!col.template&&!col.format&&!col.values){col.template="<span ng-bind='dataItem."+col.field+"'>#: "+col.field+"#</span>"}})});defadvice(["ui.Grid","ui.ListView","mobile.ui.ListView","ui.TreeView"],BEFORE,function(element,options){this.next();var scope=angular.element(element).scope();if(!scope)return;var self=this.self;var role=self.options.name;var prev_dataBound=options.dataBound;options.dataBound=function(ev){var widget=ev.sender;var dataSource=widget.dataSource;var dirty=false;widget.items().each(function(){var elementToCompile=role=="TreeView"?$(this).find(".k-in").first():$(this);if(!elementToCompile.hasClass("ng-scope")){var itemUid=$(this).attr(_UID_);var item=dataSource.getByUid(itemUid);var itemScope=scope.$new();itemScope.dataItem=item;compile(elementToCompile)(itemScope);dirty=true}});try{if(prev_dataBound)return prev_dataBound.apply(this,arguments)}finally{if(dirty)digest(scope)}}});defadvice("ui.DropDownList",BEFORE,function(element,options){this.next();var scope=angular.element(element).scope();if(!scope)return;var self=this.self;var prev_dataBound=options.dataBound;options.dataBound=function(ev){var widget=ev.sender;widget.ul.find("li").each(function(idx){var itemScope=scope.$new();itemScope.dataItem=widget.dataItem(idx);compile(this)(itemScope)});try{if(prev_dataBound)return prev_dataBound.apply(this,arguments)}finally{digest(scope)}};var prev_dataBinding=options.dataBinding;options.dataBinding=function(ev){var widget=ev.sender;widget.ul.find("li").each(function(){var itemScope=angular.element(this).scope();if(itemScope&&itemScope!==scope){destroyScope(itemScope)}});if(prev_dataBinding)return prev_dataBinding.apply(this,arguments)}});defadvice("ui.DropDownList","_textAccessor",function(text){var self=this.self;var scope=angular.element(self.element).scope();if(scope&&text!==undefined){var itemScope=angular.element(self.span).scope();if(itemScope&&itemScope!==scope){destroyScope(itemScope)}}var ret=this.next();if(scope&&text!==undefined){var itemScope=scope.$new();itemScope.dataItem=text;compile(self.span)(itemScope);digest(itemScope)}return ret});defadvice(["ui.AutoComplete","ui.ComboBox"],BEFORE,function(element,options){this.next();var scope=angular.element(element).scope();if(!scope)return;var self=this.self;var prev_dataBound=options.dataBound;options.dataBound=function(ev){var widget=ev.sender;var dataSource=widget.dataSource;var dirty=false;$(widget.items()).each(function(){var el=$(this);if(!el.hasClass("ng-scope")){var item=widget.dataItem(el.index());var itemScope=scope.$new();itemScope.dataItem=item;compile(el)(itemScope);dirty=true}});try{if(prev_dataBound)return prev_dataBound.apply(this,arguments)}finally{if(dirty)digest(scope)}}});defadvice(["ui.AutoComplete","ui.ComboBox"],AFTER,function(){this.next();this.self.bind("dataBinding",function(ev){$(ev.sender.items()).each(function(){var scope=angular.element(this).scope();if(scope){destroyScope(scope,this)}})})});defadvice(["ui.Grid","ui.ListView","mobile.ui.ListView"],AFTER,function(){this.next();var self=this.self;var scope=angular.element(self.element).scope();if(!scope)return;self.bind("itemChange",function(ev){var dataSource=ev.sender.dataSource;var itemElement=ev.item[0];var item=ev.item;if($.isArray(item))item=item[0];item=$(item);var itemScope=angular.element(item).scope();if(!itemScope||itemScope===scope){itemScope=scope.$new()}itemScope.dataItem=dataSource.getByUid(item.attr(_UID_));compile(itemElement)(itemScope);digest(itemScope)});self.bind("dataBinding",function(ev){ev.sender.items().each(function(){var el=$(this);if(el.attr(_UID_)){var rowScope=angular.element(this).scope();if(rowScope&&rowScope!==scope){destroyScope(rowScope,el)}}})})});defadvice("ui.Grid","_toolbar",function(){this.next();var self=this.self;var scope=angular.element(self.element).scope();if(scope){compile(self.wrapper.find(".k-grid-toolbar").first())(scope);digest(scope)}});defadvice("ui.Grid","_thead",function(){this.next();var self=this.self;var scope=angular.element(self.element).scope();if(scope){compile(self.thead)(scope);digest(scope)}});defadvice("ui.editor.Toolbar","render",function(){this.next();var self=this.self;var scope=angular.element(self.element).scope();if(scope){compile(self.element)(scope);digest(scope)}});defadvice("ui.Grid",AFTER,function(){this.next();var self=this.self;var scope=angular.element(self.element).scope();if(scope){if(self.options.detailTemplate)bindBefore(self,"detailInit",function(ev){var detailScope=scope.$new();detailScope.dataItem=ev.data;compile(ev.detailCell)(detailScope);digest(detailScope)})}});defadvice("ui.Grid","cancelRow",function(){var self=this.self;var scope=angular.element(self.element).scope();var cont=self._editContainer;if(cont){var model=self._modelForContainer(cont);var uid=model.uid;var prevScope=angular.element(cont).scope();if(prevScope!==scope){destroyScope(prevScope,cont)}}this.next();if(uid){var row=self.items().filter("["+_UID_+"="+uid+"]");var rowScope=scope.$new();rowScope.dataItem=model;compile(row)(rowScope);digest(scope)}});defadvice("ui.Editable","refresh",function(){this.next();var self=this.self;var model=self.options.model;var scope=angular.element(self.element).scope();if(!scope||!model)return;if(self.$angular_scope){destroyScope(self.$angular_scope,self.element)}scope=self.$angular_scope=scope.$new();scope.dataItem=model;immediately(function(){compile(self.element)(scope);digest(scope)});self.element.find(":kendoFocusable").eq(0).focus()});defadvice("ui.Editable","destroy",function(){var self=this.self;if(self.$angular_scope){destroyScope(self.$angular_scope,self.element);self.$angular_scope=null}this.next()});defadvice("ui.Window","content",function(){this.next();var self=this.self;var scope=angular.element(self.element).scope();if(scope){compile(self.element)(scope);digest(scope)}});defadvice("mobile.ui.ListView","destroy",function(){var self=this.self;if(self._itemBinder&&self._itemBinder.dataSource){this.self._itemBinder._unbindDataSource()}this.next()})},typeof define=='function'&&define.amd?define:function(_,f){f(jQuery,angular,kendo)});