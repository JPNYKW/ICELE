// canvasとcontextの変数
var canv,cont;

// 何度も使用する長いオブジェクトは省略した変数に格納する(Mathは今回は未使用)
var $M=Math;
var $C=console;
var $D=document;

// ゲームで使う変数
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


window.onload=()=>{ // ページがロードされたら実行する
	canv=$D.getElementById('game'); // canvas取得
	cont=canv.getContext('2d'); // canvasからcontextを取得
	
	canv.width=600; // サイズ設定
	canv.height=600;
	canv.style.backgroundColor='#3A3A3A'; // canvas範囲の背景色

	init(); // 初期設定

	level=0;
	drawStage(level,true); // ステージの描画

	$D.addEventListener('keydown',e=>{ // キーボードイベントの感知
	
		$CD=e.keyCode;　// 押されたキーのコード(キーコード)を取得

		if(keyPrs.indexOf(true)<0)memory.x=ball.x; // 座標記憶
		if(keyPrs.indexOf(true)<0)memory.y=ball.y;

		// 上下左右それぞれに対応した動き
		if($CD==37&&!getPosData(ball.x-1,ball.y)&&getCanPresser(0))keyPrs[0]=true;
		if($CD==39&&!getPosData(ball.x+1,ball.y)&&getCanPresser(1))keyPrs[1]=true;
		if($CD==40&&!getPosData(ball.x,ball.y+1)&&getCanPresser(2))keyPrs[2]=true;
		if($CD==38&&!getPosData(ball.x,ball.y-1)&&getCanPresser(3))keyPrs[3]=true;
	});

	setInterval(()=>{ // 30msで更新
		if(goal){ // ゴール時
			if(cnt<32){ // 32はタイミング調整
				cont.globalAlpha-=0.1; // contextの透明度
				cnt++;
			}else if(level+1<stageDatas.length){
				cnt=0;
				level++;
				goal=false;
				cont.globalAlpha=1;
				drawStage(level,true); // レベルアップ(次のステージ)
			}
		}
		
		if(keyPrs[0]){ // 左が押されているときの処理
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

		if(keyPrs[1]){ // 右が押されているときの処理
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

		if(keyPrs[2]){ // 下が押されているときの処理
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

		if(keyPrs[3]){　// 上が押されているときの処理
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
		drawStage(level,false); // ステージの再描画
	},30);
}

// 初期化関数の設定

function init(){
	stageDatas=[ // ステージのデータ(2次元配列)
		[1,16,0,0,0], // ステージ1
		[16,1,0,0,0,0x40,2], // ステージ2
		[8,0x1800,0,4,0,0,16,0x2000,0,0,0,0x200,8,0x400] // ステージ3
	];
	stageSizeData=[[5,5],[7,7],[14,14]]; // ステージのサイズ(2次元配列)
	ballPosData=[[4,4],[2,2],[5,3]]; // ボール開始座標(2次元配列)
	goalPos=[[1,3],[1,3],[13,2]]; // ゴール位置座標(2次元配列)
	stagePx=[54,54,30]; // グリッド(正方形)の1辺(px)

	sizeOfGird=64;
	goal=false;
	cnt=0;

	cont.globalAlpha=1; // context透明度リセット
	keyPrs=[false,false,false,false]; // キーボード感知配列リセット
}

function getPosData(gx,gy){ // 座標のデータ(壁の有無)を返す関数
	if(goalPosStack[0]==gx&&goalPosStack[1]==gy)return 2; // ゴールの感知
	if(stage[gy]==void(0)||gx<0||baseZero.length-1<gx)return 1; // void(0)は常にundefinedを返す 画面外の感知
	return ~~((baseZero+stage[gy].toString(2)).slice(-1*baseZero.length)).substr(gx,1); // 壁の感知
}

function getCanPresser(id){ // キーボード多重押し判定
	let $ST=0;
	for(i=0;i<4;i++){
		$ST+=keyPrs[i]&&i!==id;
	}
	return !$ST; // 押されているキーの数をboolにして返す true/false
}

// 画面描画に関する関数

function drawBall(x,y,w,h,size,bold,color){ // ボールの描画
	x=(canv.width/2-w/2*size)+size/2+x*size;
	y=(canv.width/2-h/2*size)+size/2+y*size;
	drawDot(cont,x,y,bold,color);
}

function drawStage(id,init){ // ステージの描画

	let $ST=loadStage(id); // ステージの読み込み

	stage=$ST[0]; // ステージ本体

	width=$ST[1][0]; // 横幅
	height=$ST[1][1]; // 縦幅

	if(init)ball.x=$ST[2][0]; // ボールのセット
	if(init)ball.y=$ST[2][1];
	if(init)keyPrs=[false,false,false,false]; // キーのリセット

	sizeOfGird=$ST[3]; // 正方形のpx
	goalPosStack=$ST[4]; // ゴールの座標

	baseZero=''; // ステージ描画時に2進数に変換する際の上bit埋め用の0文字列
	for(i=0;i<width;i++){
		baseZero+='0';
	}

	cont.clearRect(0,0,canv.width,canv.height); // contextのクリア(画面クリア)
	drawGrid(cont,canv.width/2,canv.width/2,sizeOfGird,width,height,3,'#BBB'); // グリッドの描画
	for(stix=0;stix<stage.length;stix++){
		let $RG=(baseZero+stage[stix].toString(2)).slice(-1*width); // 2進数に変換した値を頭埋めして文字列化する
		for(frlf=0;frlf<$RG.length;frlf++){ // 文字列化した物をもとに描画
			if(~~$RG.substr(frlf,1)){ // 壁の描画
				drawFillBox(cont,
				(canv.width/2-(width/2*sizeOfGird))+frlf*sizeOfGird+(sizeOfGird/2),
				(canv.width/2-(height/2*sizeOfGird))+stix*sizeOfGird+(sizeOfGird/2),
				sizeOfGird,'#BBB');
			}
		}
	}
	drawBall(goalPosStack[0],goalPosStack[1],width,height,sizeOfGird,sizeOfGird/3.2,'#F3BF33'); // ゴールの描画
	drawBall(ball.x,ball.y,width,height,sizeOfGird,sizeOfGird/3.2,'#BBB'); // プレイヤーの描画
}

// ステージのデータを複数配列に格納して返す関数
function loadStage(id){return [stageDatas[id],stageSizeData[id],ballPosData[id],stagePx[id],goalPos[id]]}
