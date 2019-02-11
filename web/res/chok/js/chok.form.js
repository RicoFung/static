$chok.form = {};
$chok.form.callback = function(){};
$chok.result = {type:"", msg:""};
$chok.checkResult = function(responseText){
	$chok.result = {type:"", msg:""};
	if (typeof responseText =="object") { // 返回值为json格式
		$chok.result = {type:"", msg:responseText.msg};
	} else { // 返回值非json格式
		try {
			var _msg = "", _arr = (responseText + "").split(":");
			if (_arr.length > 1) {
				_msg = _arr[1];
			} else { 
				switch(_arr[0]) {
					case "0": _msg = "操作失败！";break;
					case "1": _msg = "操作成功！";break;
					default: _msg = (!isNaN(_arr[0]))?"":_arr[0];
				}
			}
			$chok.result = {type:_arr[0], msg:_msg};
		}
		catch(e){$chok.result = {type:"", msg:""};}
	}
	return $chok.result.msg;
};
$(function(){
	$('input:text:first').focus(); //把焦点放在第一个文本框
	$('input').keypress(function (e) { //这里给function一个事件参数命名为e，叫event也行，随意的，e就是IE窗口发生的事件。
	    var key = e.which; //e.which是按键的值
	    if (key == 13) {
	    	$("#dataFormSave").click();
	    }
	});
	$("#dataFormSave").click(function () {
		$.LoadingOverlay("show");
		if(!$chok.validator.check()) {
    		$.LoadingOverlay("hide");
			$.alert({title: "提示", type: "red", content: "表单信息不完整！"});
			return;
		}
        var options = {
            url: $("#dataForm").attr("action"),
            type: 'post',
//            dataType: 'text',
            data: $("#dataForm").serialize(),
            enctype: $("#dataForm").attr("enctype"),
            success: function (data) {
    			$.LoadingOverlay("hide");
    			$chok.checkResult(data);
    			$.alert({title: "提示", type: $chok.result.type=="1"?"green":"red", content: $chok.result.msg});
                $chok.form.callback();
            },
            error: function(jqXHR, textStatus, errorThrown){
        		$.LoadingOverlay("hide");
        		$.alert({title: "提示", type: "red", content: jqXHR.status + "<br/>" + jqXHR.responseText});
            } 
        };
        $("#dataForm").ajaxSubmit(options);
        return false;
    });
	$("#dataForm").submit(function(e){
		e.preventDefault();try{$("#dataFormSave").click();}catch(e){}
	});
	$("#form_del").submit(function(e){
		e.preventDefault();
		$.LoadingOverlay("show");
        var options = {
            url: $("#form_del").attr("action"),
            type: 'post',
//            dataType: 'text',
            data: $("#form_del").serialize(),
            success: function (data) {
    			$.LoadingOverlay("hide");
    			$.alert({title: "提示", content: $chok.checkResult(data)});
                $chok.form.callback();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
        		$.LoadingOverlay("hide");
        		$.alert({title: "提示", content: XMLHttpRequest.readyState + XMLHttpRequest.status + XMLHttpRequest.responseText});
            } 
        };
        $.ajax(options);
        return false;
	});
	// oauth 登出
	$("#user-dropdown-menu [menuId='logout']").click(function(){
		$("#oauthLogoutForm").submit();
	});
});
