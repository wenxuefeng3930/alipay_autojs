var morningTime="07:18";//自己运动能量生成时间
var startTime="07:00";
var endTime="08:50";
unlock();
sleep(2000);
mainEntrence();
 
//解锁
function unlock(){
    if(!device.isScreenOn()){
    	//点亮屏幕
        device.wakeUp();
        //由于MIUI的解锁有变速检测，因此要点开时间以进入密码界面
        sleep(1000);
        swipe(500, 0, 500, 1900, 2000);
        click(100,150); 
        //输入屏幕解锁密码，其他密码请自行修改
        sleep(2000);
        click(540,1800);
        sleep(500);
       
        click(540,1800);
        sleep(500);
        
        click(240,1620);
        sleep(500);
        
        click(540,1620);
        sleep(500);    
    }
}
  
/**
 * 获取权限和设置参数
 */
function prepareThings(){
    setScreenMetrics(1080, 2340);
    //请求截图
   if(!requestScreenCapture()){
        toastLog("请求截图失败,脚本退出");
        exit();
    }
    
}
/**
 * 设置按键监听 当脚本执行时候按音量减 退出脚本
 */
function registEvent() {
    //启用按键监听
    events.observeKey();
    //监听音量上键按下
    events.onKeyDown("KEYCODE_VOLUME_DOWN", function(event){
        toastLog("脚本手动退出");
        exit();
    });
}
/**
 * 获取截图
 */
function getCaptureImg(){    
    //captureScreen("/storage/emulated/0/DCIM/Screenshots/1.png");
    //sleep(500);
    var img0 = captureScreen();
    sleep(100);
    if(img0==null || typeof(img0)=="undifined"){
        toastLog("截图失败,脚本退出");
        exit();
    }else{
       return img0;
    }
}


/**
 * 从支付宝主页进入蚂蚁森林我的主页
 */
function enterMyMainPage(){
    //五次尝试蚂蚁森林入
    var i=0;
    swipe(520,1200,520,600,500);
    sleep(500);
    swipe(520,600,520,1200,500);
    while (!textEndsWith("蚂蚁森林").exists() && !descEndsWith("蚂蚁森林").exists() && i<=5){
        sleep(1000);
        i++;   
    }  
    clickByTextDesc("蚂蚁森林",0,true,"请把蚂蚁森林入口添加到主页,脚本退出");
	
    //等待进入自己的主页,10次尝试
    sleep(3000);
    i=0;
	while (!textEndsWith("地图").exists() && !descEndsWith("地图").exists() && i<=10){
		sleep(1000);
		i++;
	}
	toastLog("第"+i+"次尝试进入自己主页");
	if(i>=10){
		toastLog("进入自己能量主页失败,脚本退出");
		exit();
	}
	
	//收自己能量
    //将能量球存在的区域都点一遍，间隔是能量球的半径
    for(var row = 640;row < 900;row+=100)
           for(var col = 140;col < 800;col+=100){
               click(col,row);
               sleep(50);
               }
    toastLog("自己能量收集完成");
    sleep(100);
}
/**
 * 进入排行榜
 */
function enterRank(){
    toastLog("进入排行榜");
    sleep(2000);
    swipe(520,1800,520,300,500);
    sleep(500);
    swipe(520,1800,520,300,500);
    toastLog("查看更多好友");
    sleep(500);
    clickByTextDesc("查看更多好友",0,true,"程序未找到排行榜入口,脚本退出");
	
	//等待排行榜主页出现
    var i=0; 
    while (!textEndsWith("好友排行榜").exists() && !descEndsWith("好友排行榜").exists() && i<=5){
        sleep(1000);
        i++;
    }
    if(i>=5){
        toastLog("进入好友排行榜失败,脚本退出");
        exit();
    }
}
/**
 * 从排行榜获取可收集好友的点击位置
 */
function  getHasEnergyfriend(type) {
    var img = getCaptureImg();
    //getCaptureImg();
    //var img = images.read("/storage/emulated/0/DCIM/Screenshots/1.png");
    var p=null;
    if(type==1){
		// 区分倒计时和可收取能量的小手
        p = images.findMultiColors(img, "#ffffff",[[0, -35, "#1da06d"],[0, 23, "#1da06d"]], {
            region: [1074,200 , 1, 2000]
        });
    }
    if(p!=null){
        toastLog("找到好友");
        return p;
    }else {
        toastLog("此页没有找到可收能量的好友");
        return null;
    }
}

/**
 * 在排行榜页面,循环查找可收集好友
 * @returns {boolean}
 */
function enterOthers(){
    var i=1;
    var ePoint=getHasEnergyfriend(1);
	
    //确保当前操作是在排行榜界面
	//不断滑动，查找好友
    while(ePoint==null){
		//如果到了收取自己能量的时间，先收取自己能量
        if(myEnergyTime()){
            return false;
        }
		if(textEndsWith("好友排行榜").exists() || descEndsWith("好友排行榜").exists()){
			swipe(520,1800,520,300,500);
			sleep(100);
			ePoint=getHasEnergyfriend(1);
			i++;
			
			//如果检测到结尾，同时也没有可收能量的好友，那么结束收取
			if(textEndsWith("没有更多了").exists() || descEndsWith("没有更多了").exists()){
				if(ePoint == null){
					return false;
				}
			}
		
			//如果连续32次都未检测到可收集好友,无论如何停止查找(由于程序控制了在排行榜界面,且判断了结束标记,基本已经不存在这种情况了)
			if(i>32){
				toastLog("程序可能出错,连续"+i+"次未检测到可收集好友");
				exit();
			}
		}
    }
    
	//找到好友
	//进入好友页面,10次尝试
	click(ePoint.x,ePoint.y+20);
sleep(3000);
	var i=0;
	while (!textEndsWith("浇水").exists() && !descEndsWith("浇水").exists() && i<=10){
		sleep(1000);
		i++;
	}
	toastLog("第"+i+"次尝试进入好友主页");
	if(i>=10){
		toastLog("进入好友能量主页失败,脚本退出");
		exit();
	}
	
	//收能量
	for(var row = 560;row < 900;row+=100)
	   for(var col = 170;col < 900;col+=100){
		   click(col,row);
		   sleep(50);
		}
	
	//等待返回好友排行榜
	back();
	var j=0;
	if(!textEndsWith("好友排行榜").exists() && !descEndsWith("好友排行榜").exists() && j<=10){
		sleep(1000);
		j++;
	}
	if(j>=10){
		toastLog("返回排行榜失败,脚本退出");
		exit();
	}
	
	//返回排行榜成功，继续
	enterOthers();

}

function clickByTextDesc(energyType,paddingY,noFindExit,exceptionMsg){
    if(descEndsWith(energyType).exists()){
        descEndsWith(energyType).find().forEach(function(pos){
            var posb=pos.bounds();
            click(posb.centerX(),posb.centerY()-paddingY);
            //sleep(200);
        });
    }else if(textEndsWith(energyType).exists()){
        textEndsWith(energyType).find().forEach(function(pos){
            var posb=pos.bounds();
            click(posb.centerX(),posb.centerY()-paddingY);
        });
    }else{
        if(noFindExit!=null && noFindExit){
            if(exceptionMsg !=null){
                toastLog(exceptionMsg);
                exit();
            }else{
                toastLog("程序当前所处状态不合预期,脚本退出");
				exit();
            }
        }
    }
}

/**
 * 结束后返回主页面
 */
function whenComplete() {
    toastLog("结束");
    back();
    sleep(1500);
    back();
    //exit();
}

function checkTime(){
    var now =new Date();
    var hour=now.getHours();
    var minu=now.getMinutes();
    var time_a=startTime.split(":");
    var time_b=endTime.split(":");
    var timea = 60*Number(time_a[0])+Number(time_a[1]);
    var timeb = 60*Number(time_b[0])+Number(time_b[1]);
    var time  = 60*hour + minu;
    if(time>=timea && time<=timeb){
        //sleep(2000);
        return true;
    }else{
        return false;
    }   
}

function myEnergyTime(){
    var now =new Date();
    var hour=now.getHours();
    var minu=now.getMinutes();
    var mytime=morningTime.split(":");
    
    if(mytime[0]==hour && (mytime[1]==minu || mytime[1]==minu-1) ){
        return true;
    }else{
        return false;
    }   
}

function enterAntFarm(){
    var i=0;
    swipe(520,1200,520,600,500);
    sleep(500);
    swipe(520,600,520,1200,500);
    while (!textEndsWith("蚂蚁庄园").exists() &&!descEndsWith("蚂蚁庄园").exists() && i<=5){
        sleep(1000);
        i++;   
    }
    clickByTextDesc("蚂蚁庄园",0,true,"请把蚂蚁庄园入口添加到主页我的应用"); 
    sleep(7000);
   //captureScreen("/storage/emulated/0/DCIM/Screenshots/2_1.png");
   //exit();
   click(931,2150);
   sleep(2000);
   click(340,1420);
   sleep(1000);
   click(340,1900);sleep(1000);click(230,1600);sleep(1000);
   click(930,1900);sleep(1000);click(670,1600);sleep(1000);
   //captureScreen("/storage/emulated/0/DCIM/Screenshots/2_2.png");
   back();
   sleep(2000);
}

function openAlipay(){
    //launchApp("Alipay");
    
    launchApp("支付宝");
    toastLog("等待支付宝启动");
    //sleep(3000);
    var i=0;
    while (!textEndsWith("扫一扫").exists() && !descEndsWith("扫一扫").exists() && i<=5){
        sleep(2000);
        i++;
    }
	toastLog("第"+i+"次尝试进入支付宝主页");
    if(i>=5){
        toastLog("没有找到支付宝首页，程序退出");
        exit();
    }
}
    
//程序主入口
function mainEntrence(){
    //前置操作
    prepareThings();
    //注册音量下按下退出脚本监听
    registEvent();
    do{
		//打开支付宝
		openAlipay();
		//蚂蚁庄园
		if(!checkTime()){
			enterAntFarm();
		 }
		//进入蚂蚁森林主页,收集自己的能量
		enterMyMainPage();
		//进入排行榜
		enterRank();
		//进入好友主页，收好友能量
		enterOthers();
		//结束后返回主页面
		whenComplete();
    }while(checkTime());
    
    exit();
}