//获取元素属性
function getStyle(obj,attr){
	return obj.currentStyle ? obj.currentStyle[attr]:getComputedStyle(obj)[attr];
}
//获取带有className的元素
function getByClass(oParent,className){
	var aEle=oParent.getElementsByTagName('*');
	var arr=[];
	var re=new RegExp('\\b'+className+'\\b','i');//   \b代表字符边界；‘i’代表区分大小写
	for(var i=0;i<aEle.length;i++){
		if(re.test(aEle[i].className)){
			arr.push(aEle[i]);
		}
	}
	return arr;
}

//给元素添加className
function addClass(obj,sClass){
	var aClass=obj.className.split(' ');
	if(!obj.className){
		obj.className=sClass;
		return;
	}
	for(var i=0;i<aClass.length;i++){
		if(aClass[i]==sClass) return;
	}
	obj.className+=' '+sClass;
}

//给元素移除className
function removeClass(obj,sClass){
	var aClass=obj.className.split(' ');
	if(!obj.className){
		return;
	}
	for(var i=0;i<aClass.length;i++){
		if(aClass[i]==sClass){
			aClass.splice(i,1);
			obj.className=aClass.join(' ');
			break;
		}
	}
}

 /**时间版运动框架  结合Tweens()函数  可实现各种运动  匀速,加速,减速等 **/
function startMove(obj,json,times,fx,fn){
 	var iCur={};
 	var startTime=nowTime();
 	
 	if(typeof times=='undefined'){
 		times=400;
 		fx='linear';
 	}

 	if(typeof times=='string'){
 		if(typeof fx=='function'){
 			fn=fx;
 		}
 		fx=times;
 		times=400;
 	}else if(typeof times=='function'){
 		fn=times;
 		fx='linear';
 		times=400;
 	}else if(typeof times=='number'){
 		if(typeof fx=='function'){
 			fn=fx;
 			fx='linear';
 		}else if(typeof fx=='undefined'){
 			fx='linear';
 		}
 	}

 	for(var attr in json){
 		iCur[attr]=0;
 		if(attr=='opacity'){
 			iCur[attr]=Math.round(getStyle(obj,attr)*100);
 		}else{
 			iCur[attr]=parseInt(getStyle(obj,attr));
 		}
 	}

 	clearInterval(obj.timer);
 	obj.timer=setInterval(function(){
 		var changeTime=nowTime();
 		var scale=1-Math.max(0,startTime+times-changeTime)/times;
 		for(var attr in json){
 			var value=Tween[fx](scale*times,iCur[attr],(json[attr]-iCur[attr]),times);

 			if(attr=='opacity'){
 				obj.style.filter='alpha(opacity='+value+')';
 				obj.style.opacity=value/100;
 			}else{
 				obj.style[attr]=value+'px';
 			}
 		}

 		if(scale==1){
 			clearInterval(obj.timer);
 			if(fn){
 				fn.call(obj);
 			}	
 		};

 	},30);
 	function nowTime(){
 		return (new Date()).getTime();
 	}
 }
//tween.js
var Tween = {
        linear: function (t, b, c, d){  //匀速
            return c*t/d + b;
         },
         easeIn: function(t, b, c, d){  //加速曲线
             return c*(t/=d)*t + b;
         },
         easeOut: function(t, b, c, d){  //减速曲线
             return -c *(t/=d)*(t-2) + b;
         },
         easeBoth: function(t, b, c, d){  //加速减速曲线
             if ((t/=d/2) < 1) {
                 return c/2*t*t + b;
             }
             return -c/2 * ((--t)*(t-2) - 1) + b;
         },
         easeInStrong: function(t, b, c, d){  //加加速曲线
             return c*(t/=d)*t*t*t + b;
         },
         easeOutStrong: function(t, b, c, d){  //减减速曲线
             return -c * ((t=t/d-1)*t*t*t - 1) + b;
         },
         easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
             if ((t/=d/2) < 1) {
                 return c/2*t*t*t*t + b;
             }
             return -c/2 * ((t-=2)*t*t*t - 2) + b;
         },
         elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
             if (t === 0) { 
                 return b; 
             }
             if ( (t /= d) == 1 ) {
                 return b+c; 
             }
             if (!p) {
                 p=d*0.3; 
             }
             if (!a || a < Math.abs(c)) {
                 a = c; 
                 var s = p/4;
             } else {
                 var s = p/(2*Math.PI) * Math.asin (c/a);
             }
             return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
         },
         elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
             if (t === 0) {
                 return b;
             }
             if ( (t /= d) == 1 ) {
                 return b+c;
             }
             if (!p) {
                 p=d*0.3;
             }
             if (!a || a < Math.abs(c)) {
                 a = c;
                 var s = p / 4;
             } else {
                 var s = p/(2*Math.PI) * Math.asin (c/a);
             }
             return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
         },    
         elasticBoth: function(t, b, c, d, a, p){
             if (t === 0) {
                 return b;
             }
             if ( (t /= d/2) == 2 ) {
                 return b+c;
             }
             if (!p) {
                 p = d*(0.3*1.5);
             }
             if ( !a || a < Math.abs(c) ) {
                 a = c; 
                 var s = p/4;
             }
             else {
                 var s = p/(2*Math.PI) * Math.asin (c/a);
             }
             if (t < 1) {
                 return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
                         Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
             }
             return a*Math.pow(2,-10*(t-=1)) * 
                     Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
         },
         backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
             if (typeof s == 'undefined') {
                s = 1.70158;
             }
             return c*(t/=d)*t*((s+1)*t - s) + b;
         },
         backOut: function(t, b, c, d, s){
             if (typeof s == 'undefined') {
                 s = 3.70158;  //回缩的距离
             }
             return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
         }, 
         backBoth: function(t, b, c, d, s){
             if (typeof s == 'undefined') {
                 s = 1.70158; 
             }
             if ((t /= d/2 ) < 1) {
                 return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
             }
             return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
         },
         bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
             return c - Tween['bounceOut'](d-t, 0, c, d) + b;
         },       
         bounceOut: function(t, b, c, d){
             if ((t/=d) < (1/2.75)) {
                 return c*(7.5625*t*t) + b;
             } else if (t < (2/2.75)) {
                 return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
             } else if (t < (2.5/2.75)) {
                 return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
             }
             return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
         },      
         bounceBoth: function(t, b, c, d){
             if (t < d/2) {
                 return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
             }
             return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
         }
}
//获取当前元素的下一个元素节点
function getNextElement(node){
	if(node.nextSibling.nodeType==1){  //判断下一个节点类型为1，则是“元素”节点
		return node.nextSibling;
	}
	if(node.nextSibling.nodeType==3){  //判断下一个节点类型3，则是“文本”节点，回调函数自身
		return getNextElement(node.nextSibling);
	}
	return null;
}

//返回当前元素距离页面的位置
function getPos(obj){
	var pos={'left':0,'top':0};
	while(obj){
		pos.left+=obj.offsetLeft;
		pos.top+=obj.offsetTop;	
		obj=obj.offsetParent;
	}
	return pos;
}

//绑定事件监听函数兼容
function bindEvent(obj,eventName,fn){
	if(obj.attachEvent){
		obj.attachEvent('on'+eventName,fn);
	}else if(obj.addEventListener){
		obj.addEventListener(eventName,fn,false);
	}else{
		obj['on'+eventName]=fn;
	}
}

//删除事件监听函数
function removeEvent(obj,eventName,fn){
	if(obj.detachEvent){
		obj.detachEvent('on'+eventName,fn);
	}else if(obj.removeEventListener){
		obj.removeEventListener(eventName,fn,false);
	}else{
		delete obj['on'+eventName];
	}
}



