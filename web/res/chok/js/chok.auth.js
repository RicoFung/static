$chok.auth = {};
$chok.auth.btn = function(menuPermitId, btnJson){
	var btnPermitArr = btnJson;
	if (!btnPermitArr) return;
	if(btnPermitArr.length>0){
		$.each($("[pbtnId^='pbtn_']"),function(i,o) {
			for(var j=0; j<btnPermitArr.length; j++) {
				if(menuPermitId==btnPermitArr[j].pid) {
					if($(o).attr('pbtnId')!=btnPermitArr[j].tc_code) {
//						if(($(o).attr('pbtnId')).indexOf(btnPermitArr[j].tc_code) == -1) {
						$(o).css({"display":"none"});
					}else{
						$(o).css({"display":""});
						break;
					}
				}else{
					$(o).css({"display":"none"});
				}
			}
		});
	}else{
		$("[pbtnId^='pbtn_']").css({"display":"none"});
	}
};