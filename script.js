const PROJECTS=[

/* Website */
  {cat:"web",
    tag:"Web Dev",
    title:"Dragon",
    desc:"A one-page portfolio with a 3D dragon guarding a glowing orb, terminal windows layered on top.",
    stack:["HTML","CSS","JavaScript","three.js"],
    img:"asset/Drago.png",
    url:"https://dhellss.github.io/Dragon/"},

  {cat:"web",
    tag:"Web Dev",
    title:"OS",
    desc:"A fake desktop OS for a portfolio — icons, draggable windows and a dock instead of a normal page.",
    stack:["HTML","CSS","JavaScript"],
    img:"asset/OS.png",
  url:"https://dhellss.github.io/OS/"},

  {cat:"web",
    tag:"Web Dev",
    title:"Terminal",
    desc:"A portfolio you navigate by actually typing commands into a working terminal.",
    stack:["HTML","CSS","JavaScript"],
    img:"asset/Terminal.png",
  url:"https://dhellss.github.io/Terminal/"},


  {cat:"web",
    tag:"Web Dev",
    title:"Readme",
    desc:"A quiet, text-first portfolio styled like a project README file.",
    stack:["HTML","CSS","JavaScript"],
    img:"asset/Readme.png",
  url:"https://dhellss.github.io/Readme/"},

  {cat:"web",
    tag:"Web Dev",
    title:"Grid",
    desc:"A dashboard-style portfolio: bordered cells laid out in a grid with a sidebar nav.",
    stack:["HTML","CSS","JavaScript"],
    img:"asset/Grid.png",
  url:"https://dhellss.github.io/Grid/"},

  {cat:"web",
    tag:"Web Dev",
    title:"Prompt",
    desc:"A minimal command-prompt portfolio that types itself out, navigated with keyboard shortcuts.",
    stack:["HTML","CSS","JavaScript"],
    img:"asset/Prompt.png",
  url:"https://dhellss.github.io/Prompt/"},


/* Game */
  {cat:"game",
    tag:"Game Dev",
    title:"ProjectBato",
    desc:"Project Bato is an underwater arcade game where players control a crocodile that eats money to survive while avoiding harmful obstacles.",
    stack:["HTML","CSS","JavaScript"],
    img:"asset/ProjectBato.png",
  url:"https://dhellss.github.io/ProjectBato/"},

  {cat:"game",
    tag:"Game Dev",
    title:"pulse",
    desc:"Rings collapse toward the centre. Hit each one the moment it crosses the lock ring..",
    stack:["HTML","CSS","JavaScript"],
    img:"asset/pulse.png",
  url:"https://dhellss.github.io/pulse/"},

    {cat:"game",
    tag:"Game Dev",
    title:"keycrack",
    desc:"Every lock holds a key of four different symbols. Guess, read the feedback, cut down what is left.",
    stack:["HTML","CSS","JavaScript"],
    img:"asset/keycrack.png",
  url:"https://dhellss.github.io/keycrack/"},

    {cat:"game",
    tag:"Game Dev",
    title:"handshake",
    desc:"A signal flashes across nine nodes. Then the whole board turns a quarter, and you repeat it.",
    stack:["HTML","CSS","JavaScript"],
    img:"asset/handshake.png",
  url:"https://dhellss.github.io/handshake/"},

    {cat:"game",
    tag:"Game Dev",
    title:"inject",
    desc:"Processes are dropping into the kernel. Type a name to kill it before it lands.",
    stack:["HTML","CSS","JavaScript"],
    img:"asset/inject.png",
  url:"https://dhellss.github.io/inject/"},

    {cat:"game",
    tag:"Game Dev",
    title:"kernel-route",
    desc:"Every node on the grid is dead except the core. Turn the links until the signal reaches all of them.",
    stack:["HTML","CSS","JavaScript"],
    img:"asset/kernel-route.png",
  url:"https://dhellss.github.io/kernel-route/"},

    {cat:"game",
    tag:"Game Dev",
    title:"patrol",
    desc:"Grab every file and reach the stairs. The cameras turn a quarter every time you move",
    stack:["HTML","CSS","JavaScript"],
    img:"asset/patrol.png",
  url:"https://dhellss.github.io/patrol/"},
/* Security */

/* Software */
];
const el=document.getElementById("projects");
function render(f){
  el.innerHTML="";
  PROJECTS.filter(p=>f==="all"||p.cat===f).forEach((p,i)=>{
    const a=document.createElement("article");a.className="proj";
    const media=p.video?`<video class="proj-media" src="${p.video}" autoplay muted loop playsinline aria-hidden="true"></video>`
      :p.img?`<img class="proj-media" src="${p.img}" alt="${p.title} preview">`
      :`<canvas data-art="${p.art}" aria-hidden="true"></canvas>`;
    a.innerHTML=`${media}<div class="proj-body"><div class="proj-top"><span class="tag">${p.tag}</span><a class="sample" href="${p.url}" target="_blank" rel="noopener">view ↗</a></div><h3>${p.title}</h3><p>${p.desc}</p><div class="stack">${p.stack.map(s=>`<span>${s}</span>`).join("")}</div></div>`;
    el.appendChild(a);
  });
  el.querySelectorAll("canvas").forEach(draw);
}
function draw(c){
  const r=c.getBoundingClientRect(),d=devicePixelRatio||1,w=r.width||500,h=150;
  c.width=w*d;c.height=h*d;const x=c.getContext("2d");x.scale(d,d);
  const A="#FFFFFF",B="#777777",G="rgba(255,255,255,.07)";
  x.strokeStyle=G;for(let i=0;i<w;i+=20){x.beginPath();x.moveTo(i,0);x.lineTo(i,h);x.stroke()}for(let j=0;j<h;j+=20){x.beginPath();x.moveTo(0,j);x.lineTo(w,j);x.stroke()}
  const t=c.dataset.art;let s=7;const rnd=()=>(s=(s*9301+49297)%233280)/233280;
  if(t==="grid"){for(let i=0;i<w;i+=20)for(let j=0;j<h;j+=20)if(rnd()>.72){x.fillStyle=rnd()>.85?B:A;x.globalAlpha=.35+rnd()*.6;x.fillRect(i+2,j+2,16,16)}x.globalAlpha=1}
  if(t==="bars"){for(let i=20;i<w-20;i+=26){const bh=20+rnd()*(h-50);x.fillStyle=i%78<26?B:A;x.globalAlpha=.8;x.fillRect(i,h-bh-12,16,bh)}x.globalAlpha=1}
  if(t==="radar"){const cx=w/2,cy=h/2;x.strokeStyle=A;x.globalAlpha=.5;for(let k=1;k<=4;k++){x.beginPath();x.arc(cx,cy,k*16,0,7);x.stroke()}x.globalAlpha=1;for(let k=0;k<9;k++){const an=rnd()*6.28,rr=16+rnd()*48;x.fillStyle=k<2?B:A;x.beginPath();x.arc(cx+Math.cos(an)*rr,cy+Math.sin(an)*rr,3.5,0,7);x.fill()}}
  if(t==="wave"){[A,B].forEach((col,n)=>{x.strokeStyle=col;x.lineWidth=2.5;x.beginPath();for(let i=0;i<=w;i+=4){const y=h/2+Math.sin(i/(28+n*12)+n)*(26+n*8);i?x.lineTo(i,y):x.moveTo(i,y)}x.stroke()})}
}
document.querySelectorAll(".filters button").forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll(".filters button").forEach(o=>o.setAttribute("aria-pressed",o===b));render(b.dataset.f)}));

const pages=["home","projects","contact"];
const reduceMQ=matchMedia("(prefers-reduced-motion: reduce), (max-width: 600px)");
let first=true,busy=false;
function show(p){
  document.querySelectorAll("section[data-page]").forEach(s=>s.hidden=s.dataset.page!==p);
  document.querySelectorAll("[data-link]").forEach(a=>a.dataset.link===p?a.setAttribute("aria-current","page"):a.removeAttribute("aria-current"));
  if(p==="projects")render(document.querySelector('.filters [aria-pressed="true"]').dataset.f);
  window.scrollTo(0,0);
}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function scramble(node){
  const final=node.dataset.text||(node.dataset.text=node.textContent),ch="01<>/_#$%&*";let f=0;
  const iv=setInterval(()=>{f++;node.textContent=final.split("").map((c,i)=>i<f/2?c:ch[Math.random()*ch.length|0]).join("");if(f/2>=final.length){clearInterval(iv);node.textContent=final}},35);
}
const SHRED=12;
function buildShred(){
  const s=document.getElementById("tx-shred");
  if(s.childElementCount)return;
  for(let i=0;i<SHRED;i++){const c=document.createElement("i");c.style.setProperty("--i",Math.abs(i-(SHRED-1)/2));s.appendChild(c)}
}
async function toProjects(){
  busy=true;const tx=document.getElementById("tx"),t=document.getElementById("tx-t"),cmd="cd ~/projects && ls";
  buildShred();
  t.textContent="";tx.classList.remove("go");tx.hidden=false;
  for(let i=1;i<=cmd.length;i++){t.textContent=cmd.slice(0,i);await wait(28)}
  await wait(180);
  show("projects");
  document.querySelectorAll(".proj").forEach((c,i)=>{c.classList.add("in");c.style.animationDelay=(200+i*90)+"ms";c.addEventListener("animationend",()=>{c.classList.remove("in");c.style.animationDelay=""},{once:true})});
  scramble(document.querySelector('[data-page="projects"] h1'));
  tx.classList.add("go");await wait(740);tx.hidden=true;busy=false;
}
function route(){
  const p=pages.includes(location.hash.slice(1))?location.hash.slice(1):"home";
  if(p==="projects"&&!first&&!reduceMQ.matches&&!busy){toProjects()}else show(p);
  first=false;
}
addEventListener("hashchange",route);route();

const toast=document.getElementById("toast");let tt;
function say(m){toast.textContent=m;toast.hidden=false;clearTimeout(tt);tt=setTimeout(()=>toast.hidden=true,1800)}
document.querySelectorAll("[data-copy]").forEach(b=>b.addEventListener("click",async()=>{
  try{await navigator.clipboard.writeText(b.dataset.copy);say("Copied")}catch(e){say("Couldn't copy — select the text instead")}}));

/* footer signature pop-up */
(function(){
  const sig=document.getElementById("sig");let i=0;
  sig.innerHTML=sig.textContent.split(" ").map(w=>`<span class="w">${[...w].map(c=>`<span class="ch" style="--i:${i++}">${c}</span>`).join("")}</span>`).join("");
  sig.setAttribute("aria-label","malupet na hacker");
  if(!("IntersectionObserver" in window))return;
  sig.classList.add("armed");
  new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){sig.classList.remove("play");void sig.offsetWidth;sig.classList.add("play")}
    else sig.classList.remove("play");
  }),{threshold:.6}).observe(sig);
})();

/* 3D computer */
(function(){
  document.querySelectorAll(".box").forEach(b=>{
    const w=+b.dataset.w,h=+b.dataset.h,d=+b.dataset.d,tpl=b.querySelector("template");
    b.style.transform=`translate3d(0,${b.dataset.y}px,${b.dataset.z}px)`;
    const F={front:[w,h,`translateZ(${d/2}px)`],back:[w,h,`rotateY(180deg) translateZ(${d/2}px)`],right:[d,h,`rotateY(90deg) translateZ(${w/2}px)`],left:[d,h,`rotateY(-90deg) translateZ(${w/2}px)`],top:[w,d,`rotateX(90deg) translateZ(${h/2}px)`],bottom:[w,d,`rotateX(-90deg) translateZ(${h/2}px)`]};
    for(const k in F){const [fw,fh,t]=F[k],f=document.createElement("div");f.className="face f-"+k;f.style.cssText=`width:${fw}px;height:${fh}px;margin:${-fh/2}px 0 0 ${-fw/2}px;transform:${t}`;
      if(k==="front"&&tpl)f.appendChild(tpl.content.cloneNode(true));b.appendChild(f)}
    if(tpl)tpl.remove();
  });
  const stage=document.getElementById("pc-stage"),pc=document.getElementById("pc"),out=document.getElementById("scr-out"),inp=document.getElementById("scr-in");
  const still=()=>reduceMQ.matches;
  let rx=-14,ry=-28,tx=-14,ty=-28,ex=0,ey=0,typing=0;
  function loop(){rx+=(tx-rx)*.08;ry+=(ty-ry)*.08;pc.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg)`;
    pc.querySelectorAll(".eye i").forEach(i=>i.style.transform=`translate(${ex*3}px,${ey*3}px)`);requestAnimationFrame(loop)}
  if(!still())loop();
  stage.addEventListener("pointermove",e=>{if(still()||zooming)return;const r=stage.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;
    ty=-28+px*70;tx=-14-py*30;ex=px*2;ey=py*2});
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  async function type(txt){const id=++typing;inp.textContent="";
    if(still()){inp.textContent=txt;return true}
    for(const c of txt){if(id!==typing)return false;inp.textContent+=c;await wait(45)}return id===typing}
  function print(lines){lines.forEach(([t,ok])=>{const d=document.createElement("div");d.textContent=t;if(ok)d.className="ok";out.appendChild(d)});while(out.children.length>4)out.firstChild.remove()}
  stage.addEventListener("pointerenter",async()=>{if(zooming)return;pc.classList.add("awake");if(!still()){pc.classList.remove("hop");void pc.offsetWidth;pc.classList.add("hop")}
    await type("hi! wanna build something?")});
  stage.addEventListener("pointerleave",()=>{if(zooming)return;pc.classList.remove("awake");typing++;inp.textContent="";tx=-14;ty=-28;ex=ey=0});
  const CMDS=[["sudo make coffee","[ok] brewing... done"],["whoami","malupet na hacker"],["./hack --ethically","[ok] access granted"],["ping dhellmar","reply: let's talk!"],["git push --force","[ok] no fear"],["cat interests.txt","code, security, games, ui/ux"]];
  let n=0;
  const kb=pc.querySelector(".kb"),flt=pc.parentElement;let zooming=false;
  function heart(e){const h=document.createElement("span");h.className="heart";h.textContent="<3";const rr=stage.getBoundingClientRect();h.style.left=(e.clientX-rr.left)+"px";h.style.top=(e.clientY-rr.top-10)+"px";stage.appendChild(h);setTimeout(()=>h.remove(),1000)}
  async function runCmd(e){
    const [c,r]=CMDS[n++%CMDS.length];
    if(!still()){kb.classList.add("press");setTimeout(()=>kb.classList.remove("press"),120);pc.classList.remove("hop");void pc.offsetWidth;pc.classList.add("hop");heart(e)}
    if(await type(c)){print([["~/ dhellskiee : "+c],[r,1]]);inp.textContent=""}
  }
  async function zoomHome(){
    if(still()){location.hash="home";return}
    zooming=true;typing++;
    tx=0;ty=0;ex=0;ey=0;                        // face the viewer
    const id=++typing;inp.textContent="";
    for(const c of "cd ~/home"){if(id!==typing)break;inp.textContent+=c;await wait(35)}
    await wait(260);
    const scr=pc.querySelector(".screen"),r=scr.getBoundingClientRect();
    const z=document.createElement("div");z.className="zoom";
    z.innerHTML='<div class="t"><span class="p">~/ dhellskiee :</span> cd ~/home</div><div class="line"></div>';
    Object.assign(z.style,{left:r.left+"px",top:r.top+"px",width:r.width+"px",height:r.height+"px",borderRadius:"14px"});
    document.body.appendChild(z);
    const ease="cubic-bezier(.75,0,.2,1)";
    flt.animate([{transform:"scale(1)"},{transform:"scale(2.6)"}],{duration:750,easing:ease,fill:"forwards"});
    await z.animate([{left:r.left+"px",top:r.top+"px",width:r.width+"px",height:r.height+"px",borderRadius:"14px"},
                     {left:"0px",top:"0px",width:innerWidth+"px",height:innerHeight+"px",borderRadius:"0px"}],{duration:750,easing:ease,fill:"forwards"}).finished;
    await wait(220);
    location.hash="home";                         // swap page under the screen
    const main=document.querySelector("main");
    const t=z.querySelector(".t"),ln=z.querySelector(".line");
    t.animate([{opacity:1},{opacity:0}],{duration:150,fill:"forwards"});
    ln.animate([{opacity:0},{opacity:1}],{duration:120,delay:260,fill:"forwards"});
    main.animate([{transform:"scale(1.06)",filter:"blur(4px)"},{transform:"none",filter:"blur(0)"}],{duration:900,easing:"cubic-bezier(.2,.7,.2,1)"});
    await z.animate([{clipPath:"inset(0 0 0 0)"},{clipPath:"inset(calc(50% - 1px) 0 calc(50% - 1px) 0)"}],{duration:420,easing:"cubic-bezier(.7,0,.3,1)",delay:120,fill:"forwards"}).finished;
    await z.animate([{clipPath:"inset(calc(50% - 1px) 0 calc(50% - 1px) 0)",opacity:1},{clipPath:"inset(calc(50% - 1px) 50% calc(50% - 1px) 50%)",opacity:0}],{duration:280,easing:"ease-in",fill:"forwards"}).finished;
    z.remove();
    flt.getAnimations().forEach(a=>a.cancel());
    inp.textContent="";pc.classList.remove("awake");tx=-14;ty=-28;zooming=false;
  }
  stage.addEventListener("click",e=>{
    if(zooming)return;
    if(e.target.closest(".screen"))zoomHome();
    else if(e.target.closest(".kb"))runCmd(e);
    else if(!still()){pc.classList.remove("hop");void pc.offsetWidth;pc.classList.add("hop")}
  });
  setInterval(()=>{if(still()||pc.classList.contains("awake"))return;pc.classList.add("blink");setTimeout(()=>pc.classList.remove("blink"),140)},3200);
  
})();
addEventListener("resize",()=>{if(!document.querySelector('[data-page="projects"]').hidden)el.querySelectorAll("canvas").forEach(draw)});
