(function($){
	/* 定义下拉框 */
	function DropDownSelect($el, cfg) {
    	// 默认设置
    	var def = {
    	    url:null,
    	    fk:null,
    	    cascadeid:null,
    		k:"name",
    		v:"id",
    		callback:{
    			afterload:function(){}
    		}
        };
    	// 覆盖设置
        var opt = $.extend(def,cfg); 
        
        // 附加隐藏域以代替Select值
        $el.after("<input type=\"hidden\" id=\"f_"+$el.attr("id")+"\" name=\"f_"+$el.attr("id")+"\" value=\"\" />");
        
    	// 加载<option></option>
        loadOptionItems($el, opt, null);
    	
    	// 每次change, 更新隐藏域值
    	$el.change(function(){
    		$("#f_"+$(this).attr("id")).val($(this).val());
    	});
    	
    	// 获取级联元素id
    	var _cascadeid = $el.attr("cascadeid");
    	if (typeof(_cascadeid)!="undefined") opt.cascadeid = _cascadeid;
    	// 监听级联元素change事件，reload下拉列表
    	if (opt.cascadeid!=null){
    		// 父Select每次change, 刷新option数据
    		$("#"+opt.cascadeid).change(function(){
    			var pk = $(this).val();
    			loadOptionItems($el, opt, pk); // 加载<option></option>
    		});
    	}
    	// 监听表单reset事件，reload下拉列表为默认值
    	$("button[type='reset']").on('click', function() {
			$el.val(""); // 重置 <select> value
			$("#f_"+$el.attr("id")).val("");  // 重置 <input type='hidden'> value
    		loadOptionItems($el, opt, null); // 加载<option></option>
    	});
    	
    	/******************************************** 
    	 * Public Fn
    	 * ******************************************/
		this.reload = function() {
	    	// 监听级联元素change事件，reload下拉列表
			var pk = null;
	    	if (opt.cascadeid!=null) pk = $("#"+opt.cascadeid).val();
	    	loadOptionItems($el, opt, pk); // 加载<option></option>
		};
	}
	
    /* 实例化下拉框 */
    $.fn.DropDownSelect = function(cfg) {
    	return new DropDownSelect($(this), cfg);
    };
    
    /******************************************** 
     * Private Fn
     * 加载<option></option>
     * ******************************************/
    function loadOptionItems($el, opt, pk) {
    	// 级联参数
    	var param = {};
    	if(opt.fk!=null) param[opt.fk] = pk;
    	// ajax 加载
    	$.ajax({
    		url: opt.url,
    		data:param,
    		success: function(result,status,xhr) {
    			// 重新渲染 option
    	    	$el.empty();
    	    	$el.append("<option value=\"\">All</option>");
    	    	for(var i=0; i<result.length; i++){
    	    		$el.append("<option value=\""+result[i][opt.v]+"\">"+result[i][opt.k]+"</option>");
    	    	}
    	    	// 通过隐藏域更新值
    	    	var $el_hidden =  $("#f_"+$el.attr("id"));
    	    	$el.find("option").each(function(){
    	    		if($(this).val()==$el_hidden.val()){
    	    			$el.val($el_hidden.val());
    	    		}
    	    	});
    	    	// 更新隐藏域值
    	    	$el_hidden.val($el.val());
    	    	// Callback Fn
    	    	opt.callback.afterload($el);
    		},
    		error: function(xhr,status,error) {
    		}
    	});
    }
})(jQuery);
