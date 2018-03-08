var arr = new Array("0x43","0x53","0x6d","0x4d","0x69");
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    if (request.method == "getSucks" && request.fwqtime){
	var re ="";
	var sqm = localStorage.getItem(Base64.encode(arr[2]));
	var time = 0;
	if(sqm){
		sqm = Base64.decode(getRStr(sqm));
		time = checkTime(sqm,request.fwqtime);
	}
	if(time>0){
		var str = localStorage.getItem(Base64.encode(arr[1]));
		var flag;
		if(str){
			flag = Base64.decode(getRStr(str));
		}
		if(flag=="\u5f00\u542f"){
			var test = localStorage.getItem(Base64.encode(arr[0]));
			if(test){
			re = Base64.decode(test.substring(0,1)+test.substring(4,test.length));
			}
		}
	}
      sendResponse({info: re});
}
    else
      sendResponse({});
  });

function getRStr(str){
	return str.substring(0,1)+str.substring(4,str.length);
}

function checkTime(val,timestamp){
	var my = localStorage.getItem(Base64.encode(arr[3]));
	var vi = localStorage.getItem(Base64.encode(arr[4]));
	my = Base64.decode(getRStr(my));
	vi = Base64.decode(getRStr(vi)); 

	var res = CryptoJS.AES.decrypt(val.replace(),my,{iv: vi,mode:CryptoJS.mode.CBC}).toString(CryptoJS.enc.Utf8);
	console.log(res);
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