$chok.view = {};
$chok.view.menuId = 0;
$chok.view.menuPermitId = 0;
$chok.view.menuName = "首页";
$chok.view.fn = {};
//获取url表单参数字符串
$chok.view.fn.getUrlParams = function(queryParams){
	queryParams = queryParams.slice(1,queryParams.length-1);
	var paramsStr = "";
	var queryParamArr = queryParams.split(",");
	for(var i=0; i<queryParamArr.length; i++) {
		var a = queryParamArr[i].split("=");
		var k = a[0].trim();
		var v = a[1].trim();
		paramsStr += k+"="+v+"&";
	}
	paramsStr = paramsStr.substr(0,paramsStr.length-1);//去除最后一个&号
	return paramsStr;
};
// 选中侧栏菜单
$chok.view.fn.selectSidebarMenu = function(menuId,menuPermitId,menuName){
	$chok.view.menuId = menuId;
	$chok.view.menuPermitId = menuPermitId;
	$chok.view.menuName = menuName;
	// set current menu
	$(".sidebar-menu li").each(function(){
		$(this).removeClass("active");
		if($(this).attr("menuId")==menuId){
			//
	 		$(this).siblings(".treeview").children(".treeview-menu").removeClass("menu-open").css({"display":"none"});
			//
			$(this).addClass("active");
			$(this).parents(".treeview").addClass("active");
			$(this).parents(".treeview-menu").addClass("menu-open").css({"display":""});
		}
	});
	// set left title
//	$(".content-header h1").html(menuName);
	// set right title
//	$(".content-header ol li[class='active']").html(menuName);
	$chok.view.fn.customize();
};
// 计算全局高度(表格/树)
$chok.view.fn.getGlobalHeight = function(type) {
	if (type=='table') {
		var minH = 300;
		var newH = $(window).height() - 250;
	   	return newH<minH?minH:newH;
	}
	else if (type=='tree') {
		return $(window).height() - 35;
	}
};
// 用户自定义
$chok.view.fn.customize = function(){};