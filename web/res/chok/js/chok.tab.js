/**
 * Dynamic tabs
 */
$chok.tab = {
	counter : 1,
	openTabs : [0],
	init : function(){
		var _this = this;
		$("#tabs").tabs();
		$("#tabs").on("click", "span.ui-icon-close", function() {
			var panelId = $(this).closest("li").remove().attr("aria-controls");
			var menuId = panelId.split('_')[1];
			for(var i=0; i<_this.openTabs.length; i++){
				if(menuId==_this.openTabs[i]){
					_this.openTabs.splice(i,1);
					break;
				}
			}
			$("#"+panelId).remove();
			$("#tabs").tabs( "refresh" );
			_this.counter--;
		});
	},
	add : function(_menuId,_url, _title){
		if(!this.isExisted(_menuId)){
			var tabHeader = "<li><a href=\"#tab_"+_menuId+"\">"+_title+"</a> <span class=\"ui-icon ui-icon-close\" onclick=\"\">Remove Tab</span></li>";
			var tabBody = "<div id=\"tab_"+_menuId+"\" class=\"scroll-wrapper\"><iframe src=\""+_url+"\" width=\"100%\" frameborder=\"0\" scrolling=\"auto\"></iframe></div>";
			$("#tabs ul").append(tabHeader);
			$("#tabs").append(tabBody);
			$("#tabs").tabs("refresh");
			$("#tabs").tabs({"active":this.counter});
			this.openTabs.push(_menuId);
			this.counter++;
			//var active = $( "#tabs" ).tabs( "option", "active" );
		}
	},
	isExisted : function(_menuId){
		var v = false;
		for(var i=0; i<this.openTabs.length; i++){
			if(_menuId==this.openTabs[i]){
				$("#tabs").tabs({"active":i});
				v = true;
				break;
			}
		}
		return v;
	}
};
