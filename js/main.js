var canv,cont;

var $M=Math;
var $C=console;
var $D=document;

var cnt;
var goal;
var level;
var stage;
var keyPrs;
var stagePx;
var goalPos;
var baseZero;
var subMemory;
var stageDatas;
var sizeOfGird;
var goalPosStack;
var ball={x:0,y:0};
var memory={x:0,y:0};


window.onload=()=>{
	canv=$D.getElementById('game');
	cont=canv.getContext('2d');
	
	canv.width=640;
	canv.height=640;
	canv.style.backgroundColor='#3A3A3A';

	init();

	level=0;
	drawStage(level,true);

	$D.addEventListener('keydown',e=>{
	
		$CD=e.keyCode;

		memory.x=ball.x;
		memory.y=ball.y;

		if($CD==37&&!getPosData(ball.x-1,ball.y)&&getCanPresser(0))keyPrs[0]=true;
		if($CD==39&&!getPosData(ball.x+1,ball.y)&&getCanPresser(1))keyPrs[1]=true;
		if($CD==40&&!getPosData(ball.x,ball.y+1)&&getCanPresser(2))keyPrs[2]=true;
		if($CD==38&&!getPosData(ball.x,ball.y-1)&&getCanPresser(3))keyPrs[3]=true;
	});

	setInterval(()=>{
		if(goal){
			if(cnt<32){
				cont.globalAlpha-=0.1;
				cnt++;
			}else if(level+1<stageDatas.length){
				cnt=0;
				level++;
				goal=false;
				cont.globalAlpha=1;
				drawStage(level,true);
			}
		}
		
		if(keyPrs[0]){
			if(!getPosData(ball.x-1,ball.y)){
				ball.x--;
			}else{
				if(getPosData(ball.x-1,ball.y)>1){
					goal=true;
				}else{
					keyPrs[0]=false;
					if(ball.x==0)ball.x=memory.x;
				}
			}
		}

		if(keyPrs[1]){
			if(!getPosData(ball.x+1,ball.y)){
				ball.x++;
			}else{
				if(getPosData(ball.x+1,ball.y)>1){
					goal=true;
				}else{
					keyPrs[1]=false;
					if(ball.x==width-1)ball.x=memory.x;
				}
			}
		}

		if(keyPrs[2]){
			if(!getPosData(ball.x,ball.y+1)){
				ball.y++;
			}else{
				if(getPosData(ball.x,ball.y+1)>1){
					goal=true;
				}else{
					keyPrs[2]=false;
					if(ball.y==height)ball.y=memory.y;
				}
			}
		}

		if(keyPrs[3]){
			if(!getPosData(ball.x,ball.y-1)){
				ball.y--;
			}else{
				if(getPosData(ball.x,ball.y-1)>1){
					goal=true;
				}else{
					keyPrs[3]=false;
					if(ball.y==0)ball.y=memory.y;
				}
			}
		}

		drawStage(level,false); // Reflesh screen
	},30);
}

// Setup data base

function init(){
	stageDatas=[
		[1,16,0,0,0],
		[16,1,0,0,0,0x40,2],
		[8,0x1800,0,4,0,0,16,0x2000,0,0,0,0x200,8,0x400]
	];
	stageSizeData=[[5,5],[7,7],[14,14]];
	ballPosData=[[4,4],[2,2],[5,3]];
	goalPos=[[1,3],[1,3],[13,2]];
	stagePx=[64,64,40];

	sizeOfGird=64;
	goal=false;
	cnt=0;

	right=false;
	left=false;
	down=false;
	on=false;

	cont.globalAlpha=1;

	keyPrs=[false,false,false,false];
}

function getPosData(gx,gy){
	if(goalPosStack[0]==gx&&goalPosStack[1]==gy)return 2;
	if(stage[gy]==void(0)||gx<0||baseZero.length-1<gx)return 1;
	return ~~((baseZero+stage[gy].toString(2)).slice(-1*baseZero.length)).substr(gx,1);
}

function getCanPresser(id){
	let $ST=0;
	for(i=0;i<4;i++){
		$ST+=keyPrs[i]&&i!==id;
	}
	return !$ST;
}

// Draw screen methods

function drawBall(x,y,w,h,size,bold,color){
	x=(320-w/2*size)+size/2+x*size;
	y=(320-h/2*size)+size/2+y*size;
	drawDot(cont,x,y,bold,color);
}

function drawStage(id,init){

	let $ST=loadStage(id)

	stage=$ST[0];

	width=$ST[1][0];
	height=$ST[1][1];

	if(init)ball.x=$ST[2][0];
	if(init)ball.y=$ST[2][1];
	if(init)keyPrs=[false,false,false,false];

	sizeOfGird=$ST[3];
	goalPosStack=$ST[4];

	baseZero='';
	for(i=0;i<width;i++){
		baseZero+='0';
	}

	cont.clearRect(0,0,canv.width,canv.height);
	drawGrid(cont,320,320,sizeOfGird,width,height,3,'#BBB');
	for(stix=0;stix<stage.length;stix++){
		let $RG=(baseZero+stage[stix].toString(2)).slice(-1*width);
		for(frlf=0;frlf<$RG.length;frlf++){
			if(~~$RG.substr(frlf,1)){
				drawFillBox(cont,
				(320-(width/2*sizeOfGird))+frlf*sizeOfGird+(sizeOfGird/2),
				(320-(height/2*sizeOfGird))+stix*sizeOfGird+(sizeOfGird/2),
				sizeOfGird,'#BBB');

			}

		}
	}
	drawBall(goalPosStack[0],goalPosStack[1],width,height,sizeOfGird,sizeOfGird/3.2,'#F3BF33');
	drawBall(ball.x,ball.y,width,height,sizeOfGird,sizeOfGird/3.2,'#BBB');
}



function loadStage(id){return [stageDatas[id],stageSizeData[id],ballPosData[id],stagePx[id],goalPos[id]]}