//全局变量
var oFixed_left=document.getElementById('fixed_left');
var oFixed_right=document.getElementById('fixed_right');
var oMain=document.getElementById('main');
var aRightList=getByClass(oMain,'module_mc_right');
var oConnector=document.getElementById('connector');

// 初始化页面
initial();
function initial(){
	var oHead=document.getElementById('head');
	var aMenu=getByClass(oHead,'menu');
	var oSpan=document.getElementById('span');
	var oNav_list=getByClass(oSpan,'nav_list')[0];
	var oBanner=document.getElementById('banner');
	var oBanner_mid=getByClass(oBanner,'banner_mid')[0];
	for(var i=0;i<aMenu.length;i++){
		aMenu[i].onmouseover=function(){
			var oDrop_menu=getByClass(this,'drop_menu')[0];
			var oEm=this.getElementsByTagName('em')[0];
			this.style.backgroundColor='#fff';
			oDrop_menu.style.display='block';
			addClass(oEm,'em_hover');
		}
		aMenu[i].onmouseout=function(){
			var oDrop_menu=getByClass(this,'drop_menu')[0];
			var oEm=this.getElementsByTagName('em')[0];
			this.style.backgroundColor='transparent';
			oDrop_menu.style.display='none';
			removeClass(oEm,'em_hover');
		}
		oSpan.onmouseover=function(){
			oNav_list.style.display='block';
		}
		oSpan.onmouseout=function(){
			oNav_list.style.display='none';
		}
		oBanner.onmouseover=function(){
			oBanner_mid.style.display='block';
		}
		oBanner.onmouseout=function(){
			oBanner_mid.style.display='none';
		}
		//判断当前滚动条的位置
		scroll_display();
	}
}
//滚动至特定位置，显示搜索栏和两边的导航栏
function scroll_display(){
	var oSearch_fixed=document.getElementById('search_fixed');
	var scrollTop=document.body.scrollTop||document.documentElement.scrollTop;
	if(scrollTop>=199){
			oSearch_fixed.style.display='block';
		}else{
			oSearch_fixed.style.display='none';
		}
		if(scrollTop>=600){
			oFixed_left.style.position='fixed';
			oFixed_left.style.top=92+'px';
			oFixed_right.style.position='fixed';
			oFixed_right.style.top=92+'px';
		}else{
			oFixed_left.style.position='absolute';
			oFixed_left.style.top=-257+'px';
			oFixed_right.style.position='absolute';
			oFixed_right.style.top=-257+'px';
		}
} 
//滚轮滚动触发事件
window.onscroll=scroll_display;
//首页大图片轮播效果
tabBanner();
function tabBanner(){
	var oShow_pic=document.getElementById('show_pic');
	var aImgArr=oShow_pic.getElementsByTagName('li');  //获取图片数组
	var oBanner=document.getElementById('banner');
	var oBanner_nav=getByClass(oBanner,'banner_nav')[0];  //获取图片序列号数组
	var aIndexArr=oBanner_nav.getElementsByTagName('li');
	var timer=null;
	var curIndex=0;
//图片自动轮播函数
	function autoChange(){
		clearInterval(timer);
		timer=setInterval(function(){
			if(curIndex<aImgArr.length-1){
				curIndex++;
			}else{
				curIndex=0;
			}
			changeTo(curIndex);
		},3000);
	}
	autoChange();
	addEvent();
//添加事件函数
	function addEvent(){
		var oNext=document.getElementById('next');
		var oPrev=document.getElementById('prev');
		for(var i=0;i<aIndexArr.length;i++){
			(function(_i){                            //闭包函数可以直接调用i;
				aIndexArr[_i].onmouseover=function(){
					clearInterval(timer);
					changeTo(_i);
					curIndex=_i;
					autoChange();
				}
			})(i);
		}
		oNext.onclick=function(){
			clearInterval(timer);
			if(curIndex<aImgArr.length-1){
				curIndex++;
			}else{
				curIndex=0;
			}
			changeTo(curIndex);
			autoChange();
		}
		oPrev.onclick=function(){
			clearInterval(timer);
			if(curIndex==0){
				curIndex=aImgArr.length-1;
			}else{
				curIndex--;
			}
			changeTo(curIndex);
			autoChange();
		}
	}
//变换处理函数
	function changeTo(num){
		var curImg=getByClass(oShow_pic,'show')[0];
		var _curIndex=getByClass(oBanner_nav,'indexOn')[0];
		startMove(curImg,{'opacity':0},'easeIn');          //淡出当前图片
		removeClass(curImg,'show');
		addClass(aImgArr[num],'show');
		startMove(aImgArr[num],{'opacity':100},'easeOut');  //淡入目标图片
		removeClass(_curIndex,'indexOn');
		addClass(aIndexArr[num],'indexOn');
	};		
}

//回到顶部函数
toTop();
function toTop(){
	var aLi=document.getElementById('fixed_right').getElementsByTagName('li');
	var oTop_btn=aLi[aLi.length-1];
	var timer2=null;
	var isClick=true;
	//给window绑定scroll事件，监听滚动条滚动事件
	bindEvent(window,'scroll',function(){
		if(!isClick){
			clearInterval(timer2);
		}
		isClick=false;
	});

	oTop_btn.onclick=function(){
		clearInterval(timer2);
		timer2=setInterval(function(){
			var top=document.body.scrollTop||document.documentElement.scrollTop;
			var speed=Math.floor(-top/10);
			document.body.scrollTop=document.documentElement.scrollTop=top+speed;
			isClick=true;
			if(top==0){
				clearInterval(timer2);
			}

		},30);
	};
}

/*
  	1.左边导航定位相同的内容位置
	2.当内容滚动到相应位置，左边导航对应位置变色
 */
toLocate();
function toLocate(){
	var aCatalog=document.getElementById('fixed_left_list').getElementsByTagName('li');
	var aModule_wrap=getByClass(oMain,'module_wrap');
	var last=aModule_wrap[0];
	var arrH=[];
	for(var i=0;i<aCatalog.length;i++){
		(function(_i){
			aCatalog[_i].onclick=function(){
				last.style.backgroundColor='#fff';
				this.style.backgroundColor='#ccc';
				last=this;
				var h=getPos(aModule_wrap[_i]).top-77;
				document.body.scrollTop=document.documentElement.scrollTop=h;
			}
			
		})(i);
	}
	bindEvent(window,'scroll',function(){
		var sTop=document.body.scrollTop||document.documentElement.scrollTop;
		for(var i=0;i<aModule_wrap.length;i++){
			if(sTop>(getPos(aModule_wrap[i]).top-200)){
				for(var j=0;j<aCatalog.length;j++){
					aCatalog[j].style.backgroundColor='#fff';
				}	
				aCatalog[i].style.backgroundColor='#ccc';
			}else if(sTop<(getPos(aModule_wrap[0]).top-200)){
				aCatalog[0].style.backgroundColor='#fff';
			}
		}
	});

}

//限时抢购倒计时函数
countDown();
function countDown(){
	
	var iNew=new Date(2017,3,17,17,35,00);
	var oTime=document.getElementById('time');
	var aDd=getByClass(oTime,'timer');
	var count=null;
	clearInterval(count);
	count=setInterval(function(){
		var iNow=new Date();
		var t=Math.floor((iNew-iNow)/1000);          //毫秒转成秒
		t=t<0?0:t;
		var D=Math.floor(t/86400);                   //剩余天
		var h=Math.floor(t%86400/3600);              //剩余小时
		var m=Math.floor(t%86400%3600/60);           //剩余分钟 
		var s=Math.floor(t%60);                      //剩余秒
		aDd[0].innerHTML=addZero(D);
		aDd[1].innerHTML=addZero(h);
		aDd[2].innerHTML=addZero(m);
		aDd[3].innerHTML=addZero(s);
		if(t==0){
			clearInterval(count);
		}
	},1000);
}

//数值由1位的变成2位
function addZero(n){
	return n<10 ? '0'+n:''+n; 
}

//图片变大函数
toBigImg('limit_list','module_limit_img',21,21);
toBigImg('daily_list','module_daily_img',25,28);
function toBigImg(id,iclass,left,top){                                         
	var oId=document.getElementById(id);
	var aImg=getByClass(oId,iclass);
	for(var i=0;i<aImg.length;i++){
		(function(_i){
			aImg[_i].onmouseover=function(){
				startMove(this,{'width':188,'height':188,'left':(left-14),'top':(top-14)},500);
			}
			aImg[_i].onmouseout=function(){
				startMove(this,{'width':160,'height':160,'left':left,'top':top},500);
			}
		})(i);
	}
	
}

//最新热卖商品切换函数

for(var i=0;i<aRightList.length;i++){
	changeList(aRightList[i]);
}
function changeList(obj){
	var oUl=obj.getElementsByTagName('ul')[0];
	var aLi_ul=oUl.getElementsByTagName('li');
	var oOl=obj.getElementsByTagName('ol')[0];
	var aLi_ol=oOl.getElementsByTagName('li');
	var num=0;
	var timer3=null;
	clearInterval(timer3);
	timer3=setInterval(changes,2400);
	function changes(){
		for(var j=0;j<aLi_ol.length;j++){
			aLi_ol[j].className='';
		}
		startMove(aLi_ul[num],{'opacity':0},function(){
			removeClass(aLi_ul[0],'init');	
		});
		num++;
		num%=aLi_ul.length;
		aLi_ol[num].className='hover';
		startMove(aLi_ul[num],{'opacity':100});
		
	}
	for(var i=0;i<aLi_ul.length;i++){
		aLi_ul[i].onmouseover=function(){
			clearInterval(timer3);
		}
		aLi_ul[i].onmouseout=function(){
			timer3=setInterval(changes,2400);
		}
	}
	for(var j=0;j<aLi_ol.length;j++){
		(function(_j){
			aLi_ol[_j].onmouseover=function(){
				clearInterval(timer3);
				aLi_ol[num].className='';
				startMove(aLi_ul[num],{'opacity':0});
				num=_j;
				aLi_ol[num].className='hover';
				startMove(aLi_ul[num],{'opacity':100})
			};
			aLi_ol[_j].onmouseout=function(){
				timer3=setInterval(changes,2400)
			};
		})(j);
	}

}

//加载图片函数
loadImg(oConnector);
function loadImg(obj){
	var aImg=obj.getElementsByTagName('img');
	var arrImg=[];
	
	for(var i=0;i<aImg.length;i++){
		if(aImg[i].getAttribute('_src')){
			arrImg.push(aImg[i]);
		}
	}
	for(var j=0;j<arrImg.length;j++){        //给每一个图片一个自定义属性
		arrImg[j].attr=true;
	}
	toImg();
	bindEvent(window,'scroll',function(){
		toImg();
	})
	function toImg(){
		var scroll=document.documentElement.scrollTop||document.body.scrollTop;  
		var clientHeight=document.documentElement.clientHeight;
		for(var i=0;i<arrImg.length;i++){
			if(getPos(arrImg[i]).top<clientHeight+scroll && arrImg[i].attr){       //判断图片的位置与页面的高度
				arrImg[i].src=arrImg[i].getAttribute('_src');
				arrImg[i].attr=false;
			}
		}
	};
}