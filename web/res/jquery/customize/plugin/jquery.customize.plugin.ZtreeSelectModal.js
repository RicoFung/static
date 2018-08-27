(function($){
	// 默认树setting
	var default_tree_setting = {
		check: 
		{
			enable: true,
			chkStyle: "radio",
			radioType: "all"
		},
		async: 
		{
			enable: true,
			url:""
		},
		data: 
		{
			key: 
			{
				name:"tc_name"
			},
			simpleData: 
			{
				idKey:"id",
				pIdKey:"pid",
				enable: true
			}
		},
		callback: {
			onClick: function(e, treeId, treeNode) {
				var zTree = $.fn.zTree.getZTreeObj(treeId);
				zTree.checkNode(treeNode, !treeNode.checked, null, true);
				return false;
			}
		}
	};
    /* 树形选择弹窗 */
    $.fn.ZtreeSelectModal=function(config){
    	this.addClass("modal fade");
    	this.attr({"tabindex":"-1", "role":"dialog", "aria-labelledby":"modal_label", "aria-hidden":"true"});
    	this.append("<div class=\"modal-dialog\">" +
							"<div class=\"modal-content\">" +
							"<div class=\"modal-header\">" +
								"<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>" +
								"<h4 class=\"modal-title\" id=\"modal_label\" style=\"display:inline;\">"+config.title+"</h4>&nbsp;&nbsp;&nbsp;&nbsp;" +
								"<input type=\"checkbox\" id=\""+this.attr("id")+"_ckb_expandAll\"/><label for=\""+this.attr("id")+"_ckb_expandAll\">&nbsp;展开</label>" +
							"</div>" +
							"<div class=\"modal-body\" style=\"max-height:300px;overflow:auto;\">" +
								"<ul id=\""+config.treeid+"\" class=\"ztree\"></ul>" +
							"</div>" +
							"<div class=\"modal-footer\">" +
								"<button type=\"button\" class=\"btn btn-default\" id=\""+this.attr("id")+"_btn_refresh\"><i class=\"glyphicon glyphicon-refresh\"></i></button>" +
								"<button type=\"button\" class=\"btn btn-primary\" id=\""+this.attr("id")+"_btn_ok\"><i class=\"glyphicon glyphicon-ok\"></i></button>" + 
							"</div>"+
						"</div>"+
					"</div>");
    	// 每次弹窗重新初始化树
    	$(this).on('shown.bs.modal', function () {
        	var setting = $.extend({}, default_tree_setting, config.setting);
        	$.fn.zTree.init($("#"+config.treeid), setting);
		});
    	// 全部展开/折叠
        $("#"+this.attr("id")+"_ckb_expandAll").click(function(){
        	var zTree = $.fn.zTree.getZTreeObj(config.treeid);
            if($(this).prop("checked")==true){
            	zTree.expandAll(true);
            }else{
            	zTree.expandAll(false);
            }
        });
        // ok按钮回调
        var _this = this;
    	$("#"+this.attr("id")+"_btn_ok").click(function(){
    		config.callback.onConfirm(_this, returnValue(config.treeid));
    		_this.modal("hide");
    	});
    	// refresh按钮回调
    	$("#"+this.attr("id")+"_btn_refresh").click(function(){
    		var zTree = $.fn.zTree.getZTreeObj(config.treeid);
    		zTree.reAsyncChildNodes(null, "refresh");
    	});
		return this;
    };
    /* 返回值 */
	function returnValue(treeid){
		var zTree = $.fn.zTree.getZTreeObj(treeid);
		var nodes = zTree.getCheckedNodes(true);
		var v_name = "";
		var v_id = "";
		for (var i=0, l=nodes.length; i<l; i++) {
			var pNode = nodes[i].getParentNode();
			var tNode = nodes[i];
			var pNodeTcName = pNode?pNode.tc_name:"";
			var tNodeTcName = tNode.tc_name+"["+tNode.id+"]";
			v_name += pNodeTcName+" > "+tNodeTcName+ ",";
			v_id = tNode.id;
		}
		if (v_name.length > 0 ) v_name = v_name.substring(0, v_name.length-1);
		return {vId:v_id, vName:v_name};
	}
})(jQuery);
