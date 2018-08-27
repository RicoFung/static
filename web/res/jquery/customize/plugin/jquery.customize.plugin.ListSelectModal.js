(function($){
    /******************************************** 
     * JQuery 实例化
     * ******************************************/
    $.fn.ListSelectModal = function(cfg) {
    	return new ListSelectModal($(this), cfg);
    };
    
    /******************************************** 
     * 定义类
     * ******************************************/
	function ListSelectModal($el, cfg) {
    	// 默认设置
    	var def = {
    		id: "",
    		title: "列表选择器",
    	    url: "",
    	    check: true,
    	    multi: true,
    	    rowType: "map", // object | map
    	    queryParams: function(p){return p;},
    	    pageList: "[10,20,50,100]",
    	    pageNumber: 1,
    	    pageSize: 10,
    	    columns: [
    	    	{title:'ID', field:'m.id', align:'center', valign:'middle', sortable:false},
    	    	{title:'名称', field:'m.name', align:'center', valign:'middle', sortable:false}
    	    ],
    	    callback: {
				onLoadSuccess: function(){},
				onLoadError: function(status){},
				onConfirm: function(data){}
    	    }
        };
    	// 覆盖设置
        var opt = $.extend(def, cfg);
        // 画窗口
        PrivateFn.drawModal($el, opt);
    	//== 开放外部接口 =====================================//
		this.reload = function() {
			PublicFn.reload(opt);
		};
		this.show = function() {
			PublicFn.show(opt);
		};
		this.hide = function() {
			PublicFn.hide(opt);
		};
		this.getSelections = function(resultKey) {
			return PublicFn.getSelections(opt, resultKey);
		};
		//===================================================//
	}
    
    /******************************************** 
     * Public 方法集定义
     * ******************************************/
    var PublicFn = {
    	/**
    	 * reload
    	 */
    	reload: function(cfg) {
			$("#tb_"+cfg.id).bootstrapTable('selectPage', 1);
    	},
    	/**
    	 * show
    	 */
    	show: function(cfg) {
    		$('#'+cfg.id).modal('show');
    	},
    	/**
    	 * hide
    	 */
    	hide: function(cfg) {
    		$('#'+cfg.id).modal('hide');
    	},
    	/**
    	 * getSelections
    	 */
    	getSelections: function(cfg, resultKey) {
    		var selections = $.map($("#tb_"+cfg.id).bootstrapTable('getSelections'), function (row) {
		    	if (resultKey == "obj" || resultKey==null) {
		    		if (cfg.rowType=="map") {
		    			return row.m;
		    		} else {
		    			return row;
		    		}
		    	} else {
		    		if (cfg.rowType=="map") {
		    			return row.m[resultKey];
		    		} else {
		    			return row[resultKey];
		    		}
		    	}
		    });
    		return selections;
    	}
    };
    
    /******************************************** 
     * Private 方法集定义
     * ******************************************/
    var PrivateFn = {
    	/**
    	 * drawModal
    	 */
    	drawModal: function($el, cfg) {
        	if($("#"+cfg.id).length>0) return;
        	// 拼接HTML
        	var modal = 
        	"<div class=\"modal fade\" id=\""+cfg.id+"\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modal_label\" aria-hidden=\"true\">"+
    	    	"<div class=\"modal-dialog\">" +
    				"<div class=\"modal-content\">" +
    					"<div class=\"modal-header\">" +
    						"<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>" +
    						"<h4 class=\"modal-title\" style=\"display:inline;\">"+cfg.title+"</h4>&nbsp;&nbsp;&nbsp;&nbsp;" +
    					"</div>" +
    					"<div class=\"modal-body\">" +
    						"<table id=\"tb_"+cfg.id+"\"></table>"+
    					"</div>" +
    					"<div class=\"modal-footer\">" +
    						"<button type=\"button\" class=\"btn btn-default\" id=\"btn_close_"+cfg.id+"\"><i class=\"glyphicon glyphicon-remove\"></i></button>" +
    						"<button type=\"button\" class=\"btn btn-primary\" id=\"btn_ok_"+cfg.id+"\"><i class=\"glyphicon glyphicon-ok\"></i></button>" + 
    					"</div>"+
    				"</div>"+
    			"</div>";+
        	"</div>";
        	$("body").append(modal);
            // Click Ok Button
        	$("#btn_ok_"+cfg.id).click(function(){
        		// 回调数据
        		var rows;
        		if (cfg.rowType=="map") {
        			rows = $.map($("#tb_"+cfg.id).bootstrapTable('getSelections'), function (row) {
        				return row.m
        			});
        		} else {
        			rows = $.map($("#tb_"+cfg.id).bootstrapTable('getSelections'), function (row) {
        				return row
        			});
        		}
        		cfg.callback.onConfirm(rows);
        		$("#"+cfg.id).modal('hide');// 关闭窗口
        	});
        	// Click Close Button
        	$("#btn_close_"+cfg.id).click(function(){
        		$("#"+cfg.id).modal('hide');// 关闭窗口
        	});
        	// 画表格
        	PrivateFn.drawTable(cfg);
    	},
    	/**
    	 * drawTable
    	 */
    	drawTable: function(cfg) {
        	var columns = [];
        	if (cfg.check) {
        		if (cfg.multi) {
        			columns = [{checkbox:true, align:'center', valign:'middle'}];
        		} else {
        			columns = [{radio:true, align:'center', valign:'middle'}];
        		}
        	}
        	$.merge(columns, cfg.columns);
    		$('#tb_'+cfg.id).bootstrapTable({
    			ajax: function(params) {
    				$.ajax({
    					type: 'post',
    					url: cfg.url,
    					data: params.data,
    					success: function(result){
    						if(result.success==false){
    							alert(result.msg);
    							return;
    						}
    						//表格加载数据
    						params.success({
    							total: result.total,
    							rows: result.rows
    						});
    					}
    				});
    			},
    			contentType: "application/x-www-form-urlencoded",//用post，必须采用此参数
    			height: 300,
    			sidePagination: "server",
    			toolbar: "#toolbar_"+cfg.id,
    			search: true,
    	        showRefresh: true,
    	        showToggle: true,
    	        showColumns: true,
    			striped: true,
    			pagination: true,
    			pageList: cfg.pageList,
    			pageNumber: cfg.pageNumber,
    			pageSize: cfg.pageSize,
        		queryParams: cfg.queryParams,
    		    columns: columns,
    		    onLoadSuccess: cfg.callback.onLoadSuccess,
    		    onLoadError: cfg.callback.onLoadError
    		});
    	}
    };
})(jQuery);
