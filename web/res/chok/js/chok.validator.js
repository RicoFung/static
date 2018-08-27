$chok.validator = {
	/**
	 * prop
	 * 定义规则算法 
	 */
	rules:{
		/**
		 * prop
		 * 各种规则算法实现
		 */
		fn:{
			required:function(v){
				return v.length>0;
			},
			minLength:function(v,l){
				return v.length>=l;
			},
			maxLength:function(v,l){
				return v.length<=l;
			},
			number:function(v){
				var r = /^(\-|\+)?\d+(\.\d+)?$/;
				return r.test(v);
			},
			integer:function(v){
				var r = /^-?\d+$/;
				return r.test(v);
			},
			email:function(v){
				var r = /^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i;
				return r.test(v);
			},
			idno:function(v){
			},
			url:function(v){
				var strRegex = "^((https|http|ftp|rtsp|mms)?://)" 
							 + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@ 
							 + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184 
							 + "|" // 允许IP和DOMAIN（域名）
							 + "([0-9a-z_!~*'()-]+\.)*" // 域名- www. 
							 + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名 
							 + "[a-z]{2,6})" // first level domain- .com or .museum 
							 + "(:[0-9]{1,4})?" // 端口- :80 
							 + "((/?)|" // a slash isn't required if there is no file name 
							 + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
				var r=new RegExp(strRegex); 
				return r.test(v);
			}
		},
		/**
		 * prop
		 *  定义规则提示信息 
		 */
		msgs:{
			"required":"必填",
			"minLength":"字符串长度不足，最小{0}个字符",
			"maxLength":"字符串长度过大，最大{0}个字符",
			"number":"输入类型必须为数字",
			"integer":"输入类型必须为整数",
			"email":"email邮箱格式不合法",
			"idno":"身份证号格式不合法",
			"url":"url格式不合法"
		},
	},
	/**
	 * fn
	 * 添加提示
	 */
	addMsg:function(ruleName, $e){
		$e.parent().addClass("has-error");
		var msg = $chok.validator.rules.msgs[ruleName];
		if(typeof($e.attr("validate-msg"))!="undefined") msg = $e.attr("validate-msg");
		msg = msg.replace("{0}", $e.attr("validate-rule-"+ruleName));
		if($e.next(".control-label").length>0){
			$e.next(".control-label").text(msg);
		}
		else{
			$e.after("<label class=\"control-label\">"+msg+"</label>");
		}
	},
	/**
	 * fn
	 * 获取提示
	 */
	getMsg:function(ruleName, ruleValue, cusMsg){
		var msg = $chok.validator.rules.msgs[ruleName];
		if(typeof(cusMsg)!="undefined" && cusMsg!=null) msg = cusMsg;
		if(typeof(ruleValue)!="undefined" && ruleValue!=null) msg = msg.replace("{0}", ruleValue);
		return msg;
	},
	/**
	 * fn
	 * 移除提示
	 */
	removeMsg:function($e){
		$e.parent().removeClass("has-error");
		$e.next(".control-label").remove();
	},
	
	/**
	 * fn
	 * 执行验证
	 */
	check:function(){
		var v = true;
		var a = [];
		//遍历验证每个被标记为“validate”的表单元素
		$("[validate]").each(function(i){
			// 验证-必填
			if(typeof($(this).attr("validate-rule-required"))!="undefined"){
				var ruleName = "required";
				var inputValue = $(this).val();
				if(!$chok.validator.rules.fn[ruleName](inputValue)){
					$chok.validator.addMsg(ruleName,$(this));
					a[i] = false;
					return;
				}else{
					$chok.validator.removeMsg($(this));
					a[i] = true;
				}
			}
			// 验证-输入类型
			if(typeof($(this).attr("validate-rule-inputType"))!="undefined" && $(this).val().length>0){
				var ruleName = $(this).attr("validate-rule-inputType");
				var inputValue = $(this).val();
				if(!$chok.validator.rules.fn[ruleName](inputValue)){
					$chok.validator.addMsg(ruleName,$(this));
					a[i] = false;
					return;
				}else{
					$chok.validator.removeMsg($(this));
					a[i] = true;
				}
			}
			// 验证-最小长度
			if(typeof($(this).attr("validate-rule-minLength"))!="undefined" && $(this).val().length>0){
				var ruleName = "minLength";
				var inputValue = $(this).val();
				var ruleValue = $(this).attr("validate-rule-minLength");
				if(!$chok.validator.rules.fn[ruleName](inputValue, ruleValue)){
					$chok.validator.addMsg(ruleName,$(this));
					a[i] = false;
					return;
				}else{
					$chok.validator.removeMsg($(this));
					a[i] = true;
				}
			}
			// 验证-最大长度
			if(typeof($(this).attr("validate-rule-maxLength"))!="undefined" && $(this).val().length>0){
				var ruleName = "maxLength";
				var inputValue = $(this).val();
				var ruleValue = $(this).attr("validate-rule-maxLength");
				if(!$chok.validator.rules.fn[ruleName](inputValue, ruleValue)){
					$chok.validator.addMsg(ruleName,$(this));
					a[i] = false;
					return;
				}else{
					$chok.validator.removeMsg($(this));
					a[i] = true;
				}
			}
		});
		if(a.indexOf(false)!=-1) v=false;
		return v;
	},

	/**
	 * fn
	 * 执行验证单元格
	 */
	checkEditable:function(ruleName, ruleValue, inputValue, cusMsg){
		if(ruleName=='required' || ruleName=='number' || ruleName=='integer' || ruleName=='email' || ruleName=='idno' || ruleName=='url'){
			if(!$chok.validator.rules.fn[ruleName](inputValue)) return $chok.validator.getMsg(ruleName, null, cusMsg);
		}else if(ruleName=='minLength' || ruleName=='maxLength'){
			if(!$chok.validator.rules.fn[ruleName](inputValue, ruleValue)) return $chok.validator.getMsg(ruleName, ruleValue, cusMsg);
		}
		return '';
	}
};
