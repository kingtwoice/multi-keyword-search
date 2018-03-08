aa = new Array("0x43","0x53","0x6d","0x4d","0x69");
window.onload=function(){
localStorage.setItem(Base64.encode(aa[3]),"UF3a2F1cm9uS2luZw==");
localStorage.setItem(Base64.encode(aa[4]),"M3UFTU5MzU3MjQ4NjE3OTMwMA==");
var drag = document.getElementById('drag');
drag.addEventListener('drop', dropHandler, false);
drag.addEventListener('dragover', dragOverHandler, false);
if(window.localStorage){
	var btn = document.getElementById("btn");
	btn.addEventListener("click",check);
	var test = localStorage.getItem(Base64.encode(aa[1]));
	if(test){
		test = test.substring(0,1)+test.substring(4,test.length);
		var val =  Base64.decode(test);
		btn.innerHTML = val == "\u5f00\u542f" ? "\u5173\u95ed":"\u5f00\u542f";
	}else{
		btn.innerHTML = "\u5f00\u542f";
	}

	var btn_save = document.getElementById("btn_save");
	var sqm_input = document.getElementById(String.fromCharCode(aa[2]));
	btn_save.addEventListener("click",checkSqm);
	var sqm = localStorage.getItem(Base64.encode(aa[2]));
	if(sqm){
		sqm = getRStr(sqm);
		sqm_input.value =  Base64.decode(sqm);
		btn_save.innerHTML = "\u4fee\u6539";
		setReadOnly(sqm_input,1);
		validateSqm(sqm_input.value);
	}else{
		setReadOnly(sqm_input,0);
		btn_save.innerHTML = "\u4fdd\u5b58";
	}
}
else{
 alert("\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u004c\u006f\u0063\u0061\u006c\u0053\u0074\u006f\u0072\u0061\u0067\u0065\u002c\u8bf7\u5347\u7ea7\u6216\u66f4\u6362\u0063\u0068\u0072\u006f\u006d\u0065\u6d4f\u89c8\u5668");
}
}
function checkSqm(){
var a = document.getElementById("btn_save");
var sqm_input = document.getElementById(String.fromCharCode(aa[2]));
var v = a.innerHTML;
 if(v=="\u4fee\u6539"){
	setReadOnly(sqm_input,0);
	a.innerHTML = "\u4fdd\u5b58";
}else{
	setReadOnly(sqm_input,1);
	saveData(2,sqm_input.value);
	a.innerHTML = "\u4fee\u6539";
	validateSqm(sqm_input.value);
}
}

function validateSqm(sqm){
	var showtime = document.getElementById(String.fromCharCode("0x54"));
	$.ajax({
        type          : 'get',
        async         : true,
        url           : 'https://sapi.k780.com/?app=life.time&appkey=28897&sign=a56ba49eb22cffee0f04b04877552420&format=json&jsoncallback=data',
        dataType      : 'jsonp',
        jsonp         : 'callback',
        jsonpCallback : 'data',
        success       : function(data){
            if(data.success!='1'){
                return;
            }
            var timestamp = data.result.timestamp;
			if(!timestamp)
				timestamp = Date.parse(new Date(data.result.datetime_1)) / 1000;
			
			var time = checkTime(sqm,timestamp);
			
			if(time<=0){
				showtime.innerHTML = time ==0 ? "\u6388\u6743\u7801\u8fc7\u671f":"\u6388\u6743\u7801\u65e0\u6548";
			}else{
				showtime.innerHTML = time+"\u5929";
			}
			
        },
        error:function(){
			showtime.innerHTML = "Network Fault";
            console('\u83b7\u53d6\u004e\u004f\u0057\u0041\u0050\u0049\u65f6\u95f4\u5931\u8d25');
        }
    });
}

function checkTime(val,timestamp){
	var my = localStorage.getItem(Base64.encode(aa[3]));
	var vi = localStorage.getItem(Base64.encode(aa[4]));
	my = Base64.decode(getRStr(my));
	vi = Base64.decode(getRStr(vi)); 

	var res = CryptoJS.AES.decrypt(val.replace(),my,{iv: vi,mode:CryptoJS.mode.CBC}).toString(CryptoJS.enc.Utf8);
	if(res.length!=10)
	return -1;
	var test = res.replace(/\d{10}/,"");
	if(test.length>0)
	return -1;
	var len = res - timestamp;
	if(len <=0)
	return 0;
	len =  Math.ceil(len/86400);
	return len;
}

function setReadOnly(obj,flag){
	obj.readOnly = flag==0?false:true;
}
function getRStr(str){
	return str.substring(0,1)+str.substring(4,str.length);
}
function saveData(flag,data){
var rnd="";
for(var t=0;t<3;t++)
rnd += String.fromCharCode(Math.floor(Math.random()*25)+65);
var inf = Base64.encode(data);
inf = inf.substring(0,1)+rnd+inf.substring(1,inf.length);
localStorage.setItem(Base64.encode(aa[flag]),inf);
}

function check(){
var a = document.getElementById("btn");
var v = a.innerHTML;
 if(v=="\u5f00\u542f"){
	a.innerHTML = "\u5173\u95ed";
}else{
	a.innerHTML = "\u5f00\u542f";
}
	saveData(1,v);
}


function dropHandler(e) {
    e.stopPropagation();
    e.preventDefault();

    var file = e.dataTransfer.files[0];
    var reader = new FileReader();
        reader.onload = (function(file) {
            return function(e) {
		var strs = this.result.replace(new RegExp("\r\n","gm"),"");
		console.log(strs);
		var rnd="";
		for(var t=0;t<3;t++)
		rnd += String.fromCharCode(Math.floor(Math.random()*25)+65);
		var inf = Base64.encode(strs);
		inf = inf.substring(0,1)+rnd+inf.substring(1,inf.length);
		localStorage.setItem(Base64.encode(aa[0]),inf);
            };
        })();
 
 	reader.readAsText(file);
}
function dragOverHandler(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dragEffect = 'copy';
}



