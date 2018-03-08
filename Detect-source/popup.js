function encode_self(s){
  return s.replace(/&/g,"&").replace(/</g,"<").replace(/>/g,">").replace(/([\\\.\*\[\]\(\)\$\^])/g,"\\$1");
}
function decode_self(s){
  return s.replace(/\\([\\\.\*\[\]\(\)\$\^])/g,"$1").replace(/>/g,">").replace(/</g,"<").replace(/&/g,"&");
}
function highlight(ary){
  if (ary.length==0){
    return false;
  }
var cnt  =0;
var tipmsg=[];
var obj=document.getElementsByTagName("body")[0];
for(var index = 0;index<ary.length;index++){
	//console.log(ary[index])
	var str = ary[index];
	if(!str||str==""||(str.replace(/\s+/g,"")).length==0)
	continue;
	str = str.replace(/(^\s*)|(\s*$)/g,"");
	//var s=encode_self(str);
	//var num = loopSearch(s,obj);
	var num = loopSearch(str,obj);
	if(num){
		cnt +=num;
		tipmsg.push(new MGCObj(str,num));
	}
}
  
 
  //var t=obj.innerHTML.replace(/<span\s+class=.?highlight.?>([^<>]*)<\/span>/gi,"$1");
  //obj.innerHTML=t;
  //var cnt=loopSearch(s,obj);

  //var t=obj.innerHTML;
  //var r=/{searchHL}(({(?!\/searchHL})|[^{])*){\/searchHL}/g
  //t=t.replace(r,"<span class='highlight'>$1</span>");
  //t = t.replace(/{searchHL}/g,"<span class='highlight'>");
  //t = t.replace(/{\/searchHL}/g,"<\/span>");
  //obj.innerHTML=t;
  return [cnt,tipmsg];
}
function loopSearch(s,obj){
  var cnt=0;	
  if (obj.nodeType==3){
    cnt=replace(s,obj);
    return cnt;
  }
  for (var i=0,c;c=obj.childNodes[i];i++){
    if (!c.className||c.className!="highlight"){
	if(c.tagName!="SCRIPT"&&c.tagName!="STYLE"&&c.id!="minganci_tip")
		cnt+=loopSearch(s,c);
	}
  }
  return cnt;
}
function replace(s,dest){
  var r=new RegExp("(" + s + ")","gi");
  var tm=null;
  var t=dest.nodeValue;
  t = t.replace(/[\r\n\s]+/gi,"");
  var cnt=0;
  if (tm=t.match(r)){
//console.log("发现敏感词:"+s+",node:"+dest.parentNode.tagName+","+dest.parentNode.className+","+dest.parentNode.id+",length:"+tm.length);
    cnt=tm.length;

var b = document.createElement("span"); 
//b.innerHTML = t.replace(r, "<span class='highlight'>"+s+"</span>"); 
b.innerHTML = t.replace(r, "<span class='highlight'>$1</span>"); 
dest.parentNode.replaceChild(b,dest); 
   // t=t.replace(r,"{searchHL}"+decode_self(s)+"{/searchHL}");
   // dest.nodeValue=t;
  }

  return cnt;
}

function  MGCObj(mgc,num)
{
        this.mgc = mgc;
        this.num = num;
	return this;
       
}
window.onload = function(){
//console.log("\u5f00\u59cb\u65f6\u95f4:"+new Date());

$.ajax({
      type: "GET",
      success: function(result, status, xhr) {
      var date = new Date( xhr.getResponseHeader("Date"));
	   taskgoon(date);
      },
      error:function(){
       console.log("\u65e0\u6cd5\u83b7\u53d6\u7f51\u7edc\u65f6\u95f4");
      }
});
};


function taskgoon(date){
	if(!date){
		console.log("\u7f51\u7edc\u6545\u969c");
		return;
	}
		
	var divTip = document.createElement("div");
		divTip.id = "minganci_tip";
		divTip.style.height = '0px';
		divTip.style.bottom = '0px';
		divTip.style.position = 'fixed';
		document.body.appendChild(divTip);
	var res;
	if(!res){
	var ftime = Date.parse(date) / 1000;
	chrome.extension.sendRequest({method: "getSucks",fwqtime:ftime}, function(response) {
	//console.log("getSucks");
	res = response.info;
	if(!res || res==""){
	console.log("\u6ca1\u6709\u8bcd");
	return ;
	}
	 var ary = res.split(";");
	//console.log(ary);
	var totalcount=0;
	detectinterval = setInterval(function(){
	var count = highlight(ary);
		//var count =0;
		//for(var t = 0;t<ary.length;t++){
		//	var num = highlight(ary[t]);
		//	if(num)
		//		count +=num;
		//}
		if(count&&count[0]>0){
			totalcount+=count[0];
			startshow(count[0],totalcount,count[1]);
		}

	},5000);

	//console.log("\u7ed3\u675f\u65f6\u95f4:"+new Date());
	});
	}
}

var handle_tip;
function startshow(count,total,tipmsg){
    var obj = document.getElementById("minganci_tip");
    var showheight = 60;
    if(count>0){
    	var htmlstr = "<h1><a id='tip_a_tag' href='javascript:void(0)'>\u5173\u95ed</a>\u63d0\u793a</h1><p>\u53d1\u73b0\u654f\u611f\u8bcd"+count+"\u5904\u002c"+"\u5176\u4e2d:";
	for(var i = 0;i<tipmsg.length;i++){
		var tempobj = tipmsg[i];
		htmlstr += "<br>"+tempobj.mgc+" : "+tempobj.num+"\u5904";
		var re = /[\u4E00-\u9FA5]/g;
		var chnlen = tempobj.mgc.match(re).length;
		showheight += (tempobj.mgc.length-chnlen)/2 + chnlen+15;
	}
	htmlstr += "<br>\u6b64\u9875\u9762\u654f\u611f\u8bcd\u603b\u8ba1\u003a"+total+"\u5904</p>";
	obj.innerHTML = htmlstr;
	//console.log(obj.innerHTML);
	document.getElementById("tip_a_tag").addEventListener('click', function () { startshow(); } );
	if(obj.style.display=="block"){
		obj.style.display="none";
		obj.style.height="0px";
	}

//	showheight +=tipmsg.length*20;
}
    if (parseInt(obj.style.height) == 0) {
     obj.style.display = "block";
     handle_tip = setInterval("changeH('up',"+showheight+")", 20);
    }
    else {
     handle_tip = setInterval("changeH('down')", 20);
    }	
    
   }
function changeH(str,sheight){
    var obj = document.all ? document.all["minganci_tip"] : document.getElementById("minganci_tip");
    if (str == "up") {
     if (parseInt(obj.style.height) > sheight) 
      clearInterval(handle_tip);

     else 
      obj.style.height = (parseInt(obj.style.height) + 8).toString() + "px";
    }
    if (str == "down") {
     if (parseInt(obj.style.height) < 8) {
      clearInterval(handle_tip);
      obj.style.display = "none";
     }
     else 
      obj.style.height = (parseInt(obj.style.height) - 8).toString() + "px";
    }
 }




