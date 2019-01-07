/**
 * $chok.menu 菜单类
 */
$chok.menu={
	// 生成菜单
	init : function(json){
		var navMenuTreeHtml = new treeMenu(json).init();
		$(".sidebar-menu").remove();
		$(".sidebar-form").after(navMenuTreeHtml);
	}
};
/**
 * treeMenu 用于生成HTML菜单元素
 */
function treeMenu(a){
    this.tree=a||[];
    this.groups={};
};
// 扩展原型方法
treeMenu.prototype={
   	/*
     * 初始化
	 */
    init:function(){
        this.group();
        var k;
        for(var groupKey in this.groups){
        	if (groupKey!=null){
        		k = groupKey;
        		break;
        	} 
        }  
        return this.getDom(k,this.groups[k]);
    },
    /*
     * 按pid为key分类存放菜单数组，如：Object {0: Array[3], 3: Array[1]}
     */
    group:function(){
        for(var i=0;i<this.tree.length;i++){
            if(this.groups[this.tree[i].pid]){
                this.groups[this.tree[i].pid].push(this.tree[i]);
            }else{
                this.groups[this.tree[i].pid]=[];
                this.groups[this.tree[i].pid].push(this.tree[i]);
            }
        }
    },
    /*
     * 递归遍历生成菜单元素
     * k : this.groups对象的key值(以pid为key)
     * a : this.groups对象的value值(数组类型)
    */
    getDom:function(k,a){
        if(!a){return ""}
        var html = "\n<ul class=\"sidebar-menu\">\n";
        html += "<li class=\"active\" menuId=\"0\"><a href=\""+$ctx+"/index.jsp?menuId=0&menuName=HOMEPAGE\"><i class=\"fa fa-home\"></i><span>HOMEPAGE</span></a>";
        if(k>0) html = "\n<ul class=\"treeview-menu\" style=\"display:none\">\n";
        for(var i=0;i<a.length;i++){
        	if(this.groups[a[i].id] && this.groups[a[i].id].length > 0){ // 有子节点
        		if(a[i].pid == 0){// 1级菜单
        			if(a[i].tcUrl == "")
						html += "<li class=\"treeview\" menuId=\""+a[i].id+"\"><a href=\"javascript:void(0)\"><i class=\"fa fa-cog\"></i><span>"+a[i].tcName+"</span><span class=\"pull-right-container\"><i class=\"fa fa-angle-left pull-right\"></i></span></a>";
					else
						html += "<li class=\"treeview\" menuId=\""+a[i].id+"\"><a href=\""+$ctx+""+a[i].tcUrl+"?menuId="+a[i].id+"&menuName="+a[i].tcName+"&menuPermitId="+a[i].tcAuthorityId+"\"><i class=\"fa fa-cog\"></i><span>"+a[i].tcName+"</span><span class=\"pull-right-container\"><i class=\"fa fa-angle-left pull-right\"></i></span></a>";
        		}else{// 非1级菜单
        			if(a[i].tcUrl == "")
						html += "<li class=\"treeview\" menuId=\""+a[i].id+"\"><a href=\"javascript:void(0)\"><i class=\"fa fa-circle-o\"></i><span>"+a[i].tcName+"</span><span class=\"pull-right-container\"><i class=\"fa fa-angle-left pull-right\"></i></span></a>";
					else
						html += "<li class=\"treeview\" menuId=\""+a[i].id+"\"><a href=\""+$ctx+""+a[i].tcUrl+"?menuId="+a[i].id+"&menuName="+a[i].tcName+"&menuPermitId="+a[i].tcAuthorityId+"\"><i class=\"fa fa-circle-o\"></i><span>"+a[i].tcName+"</span><span class=\"pull-right-container\"><i class=\"fa fa-angle-left pull-right\"></i></span></a>";
        		}
        	}else{// 没有子节点
        		if(a[i].pid == 0){// 1级菜单
        			if(a[i].tcUrl == "")
        				html += "<li menuId=\""+a[i].id+"\"><a href=\"javascript:void(0)\"><i class=\"fa fa-list\"></i><span>"+a[i].tcName+"</span></a>";
       				else
        				html += "<li menuId=\""+a[i].id+"\"\><a href=\""+$ctx+""+a[i].tcUrl+"?menuId="+a[i].id+"&menuName="+a[i].tcName+"&menuPermitId="+a[i].tcAuthorityId+"\"><i class=\"fa fa-list\"></i><span>"+a[i].tcName+"</span></a>";
        		}else{ // 非1级菜单
        			if(a[i].tcUrl == "")
        				html += "<li menuId=\""+a[i].id+"\"><a href=\"javascript:void(0)\"><i class=\"fa fa-circle-o\"></i><span>"+a[i].tcName+"</span></a>";
       				else
        				html += "<li menuId=\""+a[i].id+"\"><a href=\""+$ctx+""+a[i].tcUrl+"?menuId="+a[i].id+"&menuName="+a[i].tcName+"&menuPermitId="+a[i].tcAuthorityId+"\"><i class=\"fa fa-circle-o\"></i><span>"+a[i].tcName+"</span></a>";
        		}
        	}
            html += this.getDom(a[i].id,this.groups[a[i].id]);
            html += "</li>\n";
        };
        html += '</ul>\n';
        return html;
    }
};