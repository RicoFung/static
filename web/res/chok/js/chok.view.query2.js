$chok.view.query = {};
/* **************************************************************************************************************
 * config
 * */
$chok.view.query.config = {};
$chok.view.query.config.curPageNum = 1;//配置初始页码
$chok.view.query.config.curPageSize = 10;//配置每页行数
$chok.view.query.config.setPreFormParams = function(){};//保留上次表单参数
$chok.view.query.config.formParams = function(p){return p;};//配置表单参数
$chok.view.query.config.urlParams = function(){return {};};//配置url表单参数
$chok.view.query.config.tableColumns = [];//配置表格列//配置行菜单
$chok.view.query.config.showMultiSort = false;// 是否显示多列排序
$chok.view.query.config.sortPriority = [{"sortName":"m.id","sortOrder":"asc"}];
$chok.view.query.config.operateFormatter = function(value, row, index){
    return [
	        "<div class='btn-group btn-group-xs'>",
	        "<button type='button' class='btn btn-default dropdown-toggle tb_ctx_menu_btn' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>",
	        "<span class='caret'></span>",
	        "<span class='sr-only'>Toggle Dropdown</span>",
	        "</button>",
	        "</div>"
		    ].join('');
};
/* *
 * callback
 * */
$chok.view.query.callback = {};
//删除行回调
$chok.view.query.callback.delRows = function(){
};
//翻页回调
$chok.view.query.callback.onPageChange = function(number,size){
	$chok.view.query.config.curPageNum = number; 
	$chok.view.query.config.curPageSize = size
};
//加载成功回调
$chok.view.query.callback.onLoadSuccess = function(){
};
//加载失败回调
$chok.view.query.callback.onLoadError = function(status){
};
//编辑单元格后回调
$chok.view.query.callback.onEditableSave = function(field, row, oldValue, $el){
	var key = field.split(".")[1];
	row.m[key] = row[field];
    $.ajax({
        type: "post",
        url: "upd2",
        data: row,
        dataType: 'JSON',
        success: function (data, status) {
            if (status=="success") {
        		$.alert({title: "提示", content: $chok.checkResult(data)});
    			$("#tb_list").bootstrapTable('refresh'); // 刷新table
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
    		$.alert({title: "提示", type: "red", content: jqXHR.responseText});
        }
    });
};
//右键菜单点击事件 
$chok.view.query.callback.onContextMenuItem = function(row, $el){
	if ($el.data("item")=="upd"){
		location.href = "upd?id="+row.id+"&"+$chok.view.query.fn.getUrlParams();
	} else if ($el.data("item")=="get"){
		location.href = "get?id="+row.id+"&"+$chok.view.query.fn.getUrlParams();
	}
};
/* **************************************************************************************************************
 * init
 * */
$chok.view.query.init = {};
/* 初始化查询窗口 */
$chok.view.query.init.modalFormQuery = function(){
	$chok.view.query.config.setPreFormParams();
	$("#form_query").submit(function(e){
		e.preventDefault();
		$("#form_query_btn").click();
	});
	$("#form_query_btn").click(function(){
		$('#modal_form_query').modal('hide');
        $("#tb_list").bootstrapTable('selectPage', 1);
	});
};
/* 初始化工具栏 */
$chok.view.query.init.toolbar = function(){
	$("#bar_btn_add").click(function(){
		location.href = "add?"+$chok.view.query.fn.getUrlParams();
	});
	$("#bar_btn_del").click(function(){
		if($chok.view.query.fn.getIdSelections().length<1) {
			$.alert({title: "提示", type: "red", content: "没选择"});
			return;
		}
		$.confirm({
		    title: "提示",
		    content: "确认删除？",
		    type: "orange",
		    typeAnimated: true,
		    buttons: {
		        ok: function() {
		            $.ajax({
		                type: 'post',
		                url: 'del',
		                dataType: 'JSON',
		                data: {id: $chok.view.query.fn.getIdSelections()},
		                success: function(result){
	                		$.LoadingOverlay("hide");
	        	        	if(result.success==false){
	        	        		$.alert({title: "提示", type: "red", content: result.msg});
	        	        		return;
	        	        	}
			    	        $("#tb_list").bootstrapTable('refresh'); // 刷新table
		                },
		                error: function (jqXHR, textStatus, errorThrown) {
		            		$.alert({title: "提示", type: "red", content: jqXHR.responseText});
		                }
		            });
		        },
		        close: function () {
		        }
		    }
		});
	});
};
/* 初始化数据表 */
//自定义ajax
function ajaxRequest(params){
	$.LoadingOverlay("show");
    //访问服务器获取所需要的数据
    //比如使用$.ajax获得请求某个url获得数据
    $.ajax({
        type: 'post',
        url: 'query2',
        data: params.data,
        success: function(result){
        		$.LoadingOverlay("hide");
	        	if(result.success==false){
	        		$.alert({title: "提示", type: "red", content: result.msg});
	        		return;
	        	}
	        //表格加载数据
	        params.success({
	            total : result.total,
	            rows : result.rows
	        });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
    		$.LoadingOverlay("hide");
    		$.alert({title: "提示", type: "red", content: jqXHR.responseText});
        }  
    });
}
$chok.view.query.init.table = function(pageNum, pageSize){
	if(pageNum != null && pageNum != "") {$chok.view.query.config.curPageNum = parseInt(pageNum);}
	if(pageSize != null && pageSize != "") {$chok.view.query.config.curPageSize = parseInt(pageSize);}
	var thisColumns = $chok.view.query.fn.getColumns();
	$('#tb_list').bootstrapTable({
		height:$chok.view.fn.getGlobalHeight("table"),
		contextMenu: "#tb_ctx_menu",
		contextMenuButton: '.tb_ctx_menu_btn',
		contentType: "application/x-www-form-urlencoded",//用post，必须采用此参数
		ajax: "ajaxRequest",//自定义ajax
		sidePagination: "server",
		toolbar: "#toolbar",
        showRefresh: true,
        showToggle: true,
        showColumns: true,
        showExport: true,
        showMultiSort: $chok.view.query.config.showMultiSort,
        sortPriority: $chok.view.query.config.sortPriority,
		striped: true,
		pagination: true,
		pageList: "[5,10,20,50,100]",
		pageNumber: $chok.view.query.config.curPageNum,
		pageSize: $chok.view.query.config.curPageSize,
	    queryParams: $chok.view.query.config.formParams,
	    columns: thisColumns,
	    onPageChange: $chok.view.query.callback.onPageChange,
	    onLoadSuccess: $chok.view.query.callback.onLoadSuccess,
	    onLoadError: $chok.view.query.callback.onLoadError,
        onEditableSave: $chok.view.query.callback.onEditableSave,
        onContextMenuItem: $chok.view.query.callback.onContextMenuItem
	});
	//随窗口resize 改变 高度
	$(window).resize(function () {
		$('#tb_list').bootstrapTable('resetView', {height: $chok.view.fn.getGlobalHeight("table")});
	});
	//随导航菜单resize 改变 宽度
	$("section[class='content']").resize(function(){
		$('#tb_list').bootstrapTable('resetView');
	});
};

/* **************************************************************************************************************
 * fn
 * */
$chok.view.query.fn = {};
// 获取已选行的ID集合
$chok.view.query.fn.getIdSelections = function(){
    return $.map($("#tb_list").bootstrapTable('getSelections'), function (row) {
        return row.id
    });
};
$chok.view.query.fn.getValSelectionsByKey = function(key){
	return $.map($("#tb_list").bootstrapTable('getSelections'), function (row) {
		return row[key];
	});
};
$chok.view.query.fn.getSelections = function(){
	return $.map($("#tb_list").bootstrapTable('getSelections'), function (row) {
		return row;
	});
};
$chok.view.query.fn.getValSelectionsByKey2 = function(keys){
	return $.map($("#tb_list").bootstrapTable('getSelections'), function (row) {
		var e = {};
		for (i=0; i<keys.length; i++) {
			e[keys[i]] = row[keys[i]];
		}
		return e;
	});
};
// 获取表格列
$chok.view.query.fn.getColumns = function(){
	var columns = 
		[
	     {checkbox:true, align:'center', valign:'middle'},
	     {title:'操作', field:'operate', align:'center', valign:'middle', width:'50', events:$chok.view.query.config.operateEvents, formatter:$chok.view.query.config.operateFormatter}
		];
	return $.merge(columns,$chok.view.query.config.tableColumns);
};
// 获取url表单参数字符串
$chok.view.query.fn.getUrlParams = function(){
	var params = $chok.view.query.config.urlParams();
	params = $.extend(params, {menuId	    : $chok.view.menuId,
							   menuPermitId : $chok.view.menuPermitId,
							   menuName	    : $chok.view.menuName,
							   f_page       : $chok.view.query.config.curPageNum,
							   f_pageSize   : $chok.view.query.config.curPageSize});
	var paramsStr = "";
	$.map(params, function(value, key){
		paramsStr += key+"="+value+"&";
	});
	paramsStr = paramsStr.substr(0,paramsStr.length-1);//去除最后一个&号
	return paramsStr;
};
// 导出
$chok.view.query.fn.exp = function(url, fileName, title, headerNames, dataColumns){
	var params = $chok.view.query.config.urlParams();
	$("body").append("<form id=\"expForm\"></form>");  
    $("body").find("form[id='expForm']").attr("action", url);  
    $("body").find("form[id='expForm']").attr("method", "post");  
    $("body").find("form[id='expForm']").attr("style", "display:none");  
    $.each(params, function (k, v) {
    	k = k.replace("f_","");
        $("body").find("form[id='expForm']").append("<input type='text' name='" + k + "' value = '" + v + "'></input>");
    });
    $("body").find("form[id='expForm']").append("<input type='text' name='fileName' value = '" + fileName + "'></input>");
    $("body").find("form[id='expForm']").append("<input type='text' name='title' value = '" + title + "'></input>");
    $("body").find("form[id='expForm']").append("<input type='text' name='headerNames' value = '" + headerNames + "'></input>");
    $("body").find("form[id='expForm']").append("<input type='text' name='dataColumns' value = '" + dataColumns + "'></input>");
    $("body").find("form[id='expForm']").submit();  
};