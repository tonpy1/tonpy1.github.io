const canvas=document.getElementById("game"),ctx=canvas.getContext("2d"),TILE=40;
let gameRunning=false,currentLevel=1,completedLevels=new Set([1]),particles=[],startTime=0,gooseDelay=0;
const stepLimits=[30,40,50,60,70,80,90];

const levels=[
[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],[1,0,1,2,1,0,1,2,1,0,1,2,1,0,1],[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],[1,0,1,0,0,0,1,0,0,0,1,0,0,0,1],[1,0,1,1,1,1,1,1,1,1,1,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,3,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],[1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],[1,2,1,0,0,0,1,0,0,0,1,2,0,0,1],[1,0,1,1,1,1,1,1,1,0,1,1,1,0,1],[1,0,5,0,0,0,0,0,1,0,0,0,0,0,1],[1,0,1,1,1,0,1,1,1,1,1,1,1,0,1],[1,0,0,0,1,0,0,0,0,0,0,0,2,3,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],[1,0,1,1,1,0,1,0,1,1,1,1,1,0,1],[1,0,1,2,1,0,1,0,1,2,0,0,1,0,1],[1,0,1,0,1,0,1,0,1,1,1,0,0,0,1],[1,0,1,0,0,0,0,0,1,0,0,0,1,0,1],[1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],[1,2,0,0,0,0,1,0,0,0,0,0,0,3,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,4,0,0,0,0,4,0,0,0,1],[1,0,1,1,1,4,1,0,1,4,1,0,1,0,1],[1,0,1,2,1,4,1,0,1,2,1,0,1,0,1],[1,0,1,0,0,4,0,0,1,0,0,0,1,0,1],[1,0,1,0,1,1,1,4,1,0,1,4,1,0,1],[1,0,1,0,1,2,1,4,1,0,1,4,1,0,1],[1,0,0,0,0,4,0,0,0,0,0,0,2,3,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,0,1,1,1,1,1,0,1,1,1,0,1],[1,0,1,2,0,0,0,0,0,0,0,2,1,0,1],[1,0,1,1,1,1,1,1,1,1,1,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,1,1,1,1,1,1,1,1,0,1],[1,2,0,0,0,0,0,0,0,0,0,0,2,3,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],[1,0,1,2,1,0,1,2,1,0,1,2,1,0,1],[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],[1,0,1,0,0,0,1,0,0,0,1,0,0,0,1],[1,0,1,1,1,1,1,1,1,1,1,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,3,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],[1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],[1,2,1,0,0,0,1,0,0,0,1,2,0,0,1],[1,0,1,1,1,1,1,1,1,0,1,1,1,0,1],[1,0,5,0,0,0,0,0,1,0,0,0,0,0,1],[1,0,1,1,1,0,1,1,1,1,1,1,1,0,1],[1,0,0,0,1,0,0,0,0,0,0,0,2,3,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]
];

let map=[],player={x:1,y:1},goose={x:12,y:7},keys=0,steps=0,lastMove=0;

/* ===== 存档 ===== */
const SaveKey="escape_goose_save";
function saveGame(){localStorage.setItem(SaveKey,JSON.stringify({level:currentLevel,completed:[...completedLevels],steps,time:Math.floor((Date.now()-startTime)/1000)}));}
function loadGame(){const d=JSON.parse(localStorage.getItem(SaveKey)||"{}");currentLevel=d.level||1;completedLevels=new Set(d.completed||[1]);steps=d.steps||0;}
function clearSave(){localStorage.removeItem(SaveKey);}

/* ===== 粒子 ===== */
class Particle{constructor(x,y,c,t){this.x=x;this.y=y;this.c=c;this.t=t;this.s=Math.random()*4+2;this.vx=Math.random()*6-3;this.vy=Math.random()*6-3;this.l=1;this.d=0.015;}update(){this.x+=this.vx;this.y+=this.vy;this.l-=this.d;}}
function createParticles(x,y,c,n=10){for(let i=0;i<n;i++)particles.push(new Particle(x,y,c));}

/* ===== A* ===== */
class Node{constructor(x,y,p){this.x=x;this.y=y;this.p=p;this.g=0;this.h=0;this.f=0;}}
function aStar(s,g){const o=[],c=new Set();o.push(new Node(s.x,s.y));while(o.length){let cur=o.reduce((a,b)=>a.f<b.f?a:b);if(cur.x===g.x&&cur.y===g.y){const p=[];let t=cur;while(t){p.push({x:t.x,y:t.y});t=t.p;}return p.reverse();}o.splice(o.indexOf(cur),1);c.add(`${cur.x},${cur.y}`);[{x:0,y:-1},{x:0,y:1},{x:-1,y:0},{x:1,y:0}].forEach(d=>{const nx=cur.x+d.x,ny=cur.y+d.y;if(nx<0||ny<0||ny>=map.length||nx>=map[0].length||map[ny][nx]===1||c.has(`${nx},${ny}`))return;const n=new Node(nx,ny,cur);n.g=cur.g+1;n.h=Math.abs(nx-g.x)+Math.abs(ny-g.y);n.f=n.g+n.h;o.find(e=>e.x===nx&&e.y===ny)?n.g<o.find(e=>e.x===nx&&e.y===ny).g&&(o.find(e=>e.x===nx&&e.y===ny).g=n.g,o.find(e=>e.x===nx&&e.y===ny).f=n.g+n.h,o.find(e=>e.x===nx&&e.y===ny).p=cur):o.push(n);});}return [];}

/* ===== 游戏流程 ===== */
function initLevelSelect(){const c=document.getElementById("levelButtons");c.innerHTML="";for(let i=1;i<=7;i++){const b=document.createElement("button");b.className="level-btn";b.textContent=`第 ${i} 关`;if(completedLevels.has(i))b.classList.add("completed");if(i===currentLevel)b.classList.add("current");if(i===1||completedLevels.has(i-1))b.onclick=()=>startGame(i);else{b.style.opacity=".5";b.style.cursor="not-allowed";b.onclick=()=>alert("请先完成前一关！");}c.appendChild(b);}}
function startGame(lv){loadGame();currentLevel=lv;map=JSON.parse(JSON.stringify(levels[lv-1]));player={x:1,y:1};goose={x:12,y:7};keys=0;steps=0;gooseDelay=0;startTime=Date.now();gameRunning=true;particles=[];document.getElementById("menu").classList.add("hidden");document.getElementById("gameArea").classList.remove("hidden");document.getElementById("gameOver").style.display="none";document.getElementById("levelDisplay").textContent=lv;updateUI();requestAnimationFrame(gameLoop);}
function gameLoop(){if(!gameRunning)return;update();draw();requestAnimationFrame(gameLoop);}
function update(){const now=Date.now();document.getElementById("time").textContent=`${Math.floor((now-startTime)/1000)}s`;let sp=400;if(currentLevel>=6)sp=300;if(currentLevel>=7)sp=250;if(now-lastMove>sp+gooseDelay){moveGoose();lastMove=now;}if(player.x===goose.x&&player.y===goose.y){createParticles(player.x*TILE+TILE/2,player.y*TILE+TILE/2,"#ff0000",20);gameOver(false);}if(map[player.y][player.x]===2){map[player.y][player.x]=0;keys++;createParticles(player.x*TILE+TILE/2,player.y*TILE+TILE/2,"#FFD700",15);updateUI();}if(currentLevel>=4&&map[player.y][player.x]===4){map[player.y][player.x]=0;gooseDelay+=200;createParticles(player.x*TILE+TILE/2,player.y*TILE+TILE/2,"#8B4513",10);}if(map[player.y][player.x]===5){map[player.y][player.x]=0;gooseDelay-=100;createParticles(player.x*TILE+TILE/2,player.y*TILE+TILE/2,"#00BFFF",10);}if(map[player.y][player.x]===3&&keys>=3){completedLevels.add(currentLevel);saveGame();createParticles(player.x*TILE+TILE/2,player.y*TILE+TILE/2,"#27ae60",30);gameOver(true);}}
function moveGoose(){const p=aStar(goose,player);if(p.length>1){goose.x=p[1].x;goose.y=p[1].y;}}
function draw(){ctx.clearRect(0,0,canvas.width,canvas.height);for(let y=0;y<map.length;y++)for(let x=0;x<map[y].length;x++){const px=x*TILE,py=y*TILE;if(map[y][x]===1){ctx.fillStyle="#2a2a4e";ctx.fillRect(px,py,TILE,TILE);}if(map[y][x]===2){ctx.fillStyle="#FFD700";ctx.beginPath();ctx.arc(px+20,py+20,10,0,Math.PI*2);ctx.fill();}if(map[y][x]===3){ctx.fillStyle="#27ae60";ctx.fillRect(px+8,py+8,TILE-16,TILE-16);}if(map[y][x]===4){ctx.fillStyle="#8B4513";ctx.beginPath();ctx.arc(px+20,py+20,12,0,Math.PI*2);ctx.fill();}if(map[y][x]===5){ctx.fillStyle="#00BFFF";ctx.beginPath();ctx.arc(px+20,py+20,12,0,Math.PI*2);ctx.fill();}}particles=particles.filter(p=>{p.update();ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,p.s,0,Math.PI*2);ctx.fill();return p.l>0;});ctx.fillStyle="#3498db";ctx.beginPath();ctx.arc(player.x*TILE+20,player.y*TILE+20,18,0,Math.PI*2);ctx.fill();ctx.fillStyle="#e74c3c";ctx.beginPath();ctx.arc(goose.x*TILE+20,goose.y*TILE+20,18,0,Math.PI*2);ctx.fill();}
document.addEventListener("keydown",e=>{if(!gameRunning)return;let nx=player.x,ny=player.y;switch(e.key.toLowerCase()){case'w':ny--;break;case's':ny++;break;case'a':nx--;break;case'd':nx++;break;}if(map[ny]&&map[ny][nx]!==1){player.x=nx;player.y=ny;steps++;updateUI();}});
function updateUI(){document.getElementById("keyCount").textContent=`${keys}/3`;document.getElementById("steps").textContent=steps;}
function gameOver(win){gameRunning=false;const t=document.getElementById("gameOverTitle"),m=document.getElementById("gameOverMsg"),s=document.getElementById("stars"),n=document.getElementById("nextBtn");if(win){t.textContent="🎉 通关成功！";const tm=Math.floor((Date.now()-startTime)/1000),st=steps>stepLimits[currentLevel-1]?2:3;if(steps>stepLimits[currentLevel-1]*1.5)st=1;s.innerHTML="★".repeat(st)+"☆".repeat(3-st);m.innerHTML=`第 ${currentLevel} 关<br>步数：${steps}<br>时间：${tm}s`;n.style.display=currentLevel<7?"inline-block":"none";n.textContent=`➡️ 第 ${currentLevel+1} 关`;}else{t.textContent="💀 游戏结束";m.innerHTML=`你被大鹅抓住了！<br>步数：${steps}`;s.innerHTML="";n.style.display="none";}document.getElementById("gameOver").style.display="flex";}
function restartGame(){startGame(currentLevel);}
function nextLevel(){if(currentLevel<7)startGame(currentLevel+1);}
function backToMenu(){gameRunning=false;document.getElementById("menu").classList.remove("hidden");document.getElementById("gameArea").classList.add("hidden");document.getElementById("gameOver").style.display="none";initLevelSelect();}
function openSettings(){document.getElementById("settings").style.display="flex";}
function closeSettings(){document.getElementById("settings").style.display="none";}

/* ===== 初始化 ===== */
initLevelSelect();
for(let i=0;i<50;i++){const p=document.createElement("div");p.style.cssText=`position:absolute;width:${Math.random()*4}px;height:${Math.random()*4}px;background:hsl(${Math.random()*60+200},70%,50%);left:${Math.random()*100}vw;top:${Math.random()*100}vh;border-radius:50%;opacity:${Math.random()*0.5+0.1};animation:float ${Math.random()*10+10}s linear infinite;`;document.getElementById("particles").appendChild(p);}
const style=document.createElement("style");style.textContent=`@keyframes float{0%{transform:translateY(0)}50%{transform:translateY(-20px)}100%{transform:translateY(0)}}`;document.head.appendChild(style);