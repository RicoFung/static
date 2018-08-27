(function($){
    /******************************************** 
     * JQuery 实例化
     * ******************************************/
    $.fn.ListSelectField = function(cfg) {
    	return new ListSelectField($(this), cfg);
    };
    
    /******************************************** 
     * 定义类
     * ******************************************/
	function ListSelectField($el, cfg) {
		// 返回值
		var result = [];
		var resultIds = [];
		var resultNames = [];
		// 默认设置
		var def = {
    		id: "",
    		title: "列表选择器",
    	    url: "",
    	    check: true,
    	    multi: true,
    	    rowType: "map", // object | map
    	    queryParams: function(p) {return p;},
    	    pageList: "[10,20,50,100]",
    	    pageNumber: 1,
    	    pageSize: 10,
    	    columns: [
    	    	{title:'ID', field:'m.id', align:'center', valign:'middle', sortable:false},
    	    	{title:'名称', field:'m.name', align:'center', valign:'middle', sortable:false}
    	    ],
    	    callback: {
    	    	onConfirm: function(data) {}
    	    }
		};
		// 覆盖设置
		var opt = $.extend(def, cfg);
		
    	// WIN默认设置
    	var win_cfg = {
    		id: opt.id,
    		title: opt.title,
    	    url: opt.url,
    	    check: opt.check,
    	    multi: opt.multi,
    	    rowType: opt.rowType,
    	    resultKey: opt.resultKey,
    	    queryParams: opt.queryParams,
    	    columns: opt.columns,
    	    pageList: opt.pageList,
    	    pageNumber: opt.pageNumber,
    	    pageSize: opt.pageSize,
    	    callback: {
    	    	onLoadSuccess: function() {},
        	    onLoadError: function(status) {},
        	    onConfirm: function(data) {
        	    	// 
        	    	result = data;
    				resultIds.length = 0;
    				resultNames.length = 0;
    				$.each(data, function(k, v) {
    					resultIds.push(v.id);
    					resultNames.push(v.name);
    				});
    				// 赋值至对应input hidden中
    				$("#f_"+$el.attr("id")).val(resultIds);
    				$el.val(resultNames);
    				// 调用ListSelectField回调函数
    				opt.callback.onConfirm(data);
        	    }
    	    }
        };
        // 初始化弹窗
        var win = PrivateFn.initListSelectModal($el, win_cfg);
        // 附加隐藏域以存储表单值
        $el.after("<input type=\"text\" id=\"f_"+$el.attr("id")+"\" name=\"f_"+$el.attr("id")+"\" value=\"\" style=\"display:none\"/>");
        // 获取焦点时显示
    	$el.attr({"readonly":true}).css({"background-color":"white"}).focus(function(){
    		win.reload();
    		win.show();
    	});
    	//== 开放外部接口 =====================================//
		this.getSelections = function(resultKey) {return PublicFn.getSelections(win, resultKey);};
		//===================================================//
	}
    
    /******************************************** 
     * Public 方法集定义
     * ******************************************/
    var PublicFn = {
    	/**
    	 * getSelections
    	 */
    	getSelections: function(win, resultKey) {
    		return win.getSelections(resultKey);
    	}
    };
    
    /******************************************** 
     * Private 方法集定义
     * ******************************************/
    var PrivateFn = {
    	/**
    	 * initListSelectModal
    	 */
    	initListSelectModal: function($el, cfg) {
    		return $el.ListSelectModal(cfg);
    	}
    };
})(jQuery);
