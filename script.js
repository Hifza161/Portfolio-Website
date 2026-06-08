/* ════════════════════════════════════════════
   HIFZA RASOOL — PORTFOLIO SCRIPTS 2026 v3
════════════════════════════════════════════ */

// Detect touch/mobile — check both hover capability AND pointer type
const isTouchDevice = () =>
  window.matchMedia('(hover:none)').matches ||
  window.matchMedia('(pointer:coarse)').matches ||
  ('ontouchstart' in window) ||
  (navigator.maxTouchPoints > 0);

// Hide cursor elements immediately on touch devices
if(isTouchDevice()){
  document.getElementById('cursorDot')?.remove();
  document.getElementById('cursorGlow')?.remove();
  document.body.style.cursor = 'auto';
}

/* ── HAMBURGER ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
function closeMenu(){
  hamburger?.classList.remove('open');
  navLinks?.classList.remove('open');
  document.body.style.overflow='';
}
if(hamburger){
  hamburger.addEventListener('click',()=>{
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });
  document.addEventListener('click', e=>{
    if(!hamburger.contains(e.target)&&!navLinks.contains(e.target)) closeMenu();
  });
}

/* ── CURSOR (desktop only) ── */
const dot = document.getElementById('cursorDot');
const glow= document.getElementById('cursorGlow');
if(dot && glow && !isTouchDevice()){
  let mx=innerWidth/2,my=innerHeight/2,gx=mx,gy=my;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';});
  document.querySelectorAll('a,button,.skill-icon-card,.project-card,.stat-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>{dot.style.cssText+=';width:13px;height:13px;background:var(--purple);box-shadow:0 0 14px var(--purple),0 0 28px var(--purple)';glow.style.width='58px';glow.style.height='58px';glow.style.borderColor='rgba(168,85,247,.5)';});
    el.addEventListener('mouseleave',()=>{dot.style.cssText+=';width:8px;height:8px;background:var(--cyan);box-shadow:0 0 10px var(--cyan),0 0 20px var(--cyan)';glow.style.width='40px';glow.style.height='40px';glow.style.borderColor='rgba(0,212,255,.4)';});
  });
  (function animC(){gx+=(mx-gx)*.12;gy+=(my-gy)*.12;glow.style.left=gx+'px';glow.style.top=gy+'px';requestAnimationFrame(animC);})();
}

/* ── PARTICLES ── */
function initParticles(canvasId){
  const canvas = document.getElementById(canvasId);
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W,H,pts=[];
  const COLS=['rgba(0,212,255,','rgba(168,85,247,'];
  function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
  resize();
  window.addEventListener('resize',resize);
  class P{
    constructor(){this.init();}
    init(){this.x=Math.random()*W;this.y=Math.random()*H;this.vx=(Math.random()-.5)*.32;this.vy=(Math.random()-.5)*.32;this.r=Math.random()*1.5+.3;this.a=Math.random()*.42+.07;this.col=COLS[Math.floor(Math.random()*2)];this.life=Math.random()*200+80;this.age=0;}
    update(){this.x+=this.vx;this.y+=this.vy;this.age++;if(this.x<0||this.x>W||this.y<0||this.y>H||this.age>this.life)this.init();}
    draw(){const f=this.age<30?this.age/30:this.age>this.life-30?(this.life-this.age)/30:1;ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fillStyle=this.col+(this.a*f)+')';ctx.fill();}
  }
  const count = window.innerWidth<600?45:90;
  for(let i=0;i<count;i++) pts.push(new P());
  (function loop(){
    ctx.clearRect(0,0,W,H);
    for(let i=0;i<pts.length;i++){
      for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<70){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(0,212,255,${.035*(1-d/70)})`;ctx.lineWidth=.5;ctx.stroke();}
      }
      pts[i].update();pts[i].draw();
    }
    requestAnimationFrame(loop);
  })();
}
initParticles('particles-canvas');
initParticles('project-particles');

/* ── SCROLL REVEAL ── */
const revEls = document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach((e,i)=>{if(e.isIntersecting) setTimeout(()=>e.target.classList.add('visible'),i*60);});
  },{threshold:.07});
  revEls.forEach(el=>obs.observe(el));
} else {
  revEls.forEach(el=>el.classList.add('visible'));
}

/* ── SKILL BARS ── */
const bars = document.querySelectorAll('.skill-bar-fill');
if('IntersectionObserver' in window){
  const bObs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.style.width=e.target.dataset.w+'%';bObs.unobserve(e.target);}});
  },{threshold:.3});
  bars.forEach(b=>bObs.observe(b));
}

/* ── NAV SCROLL ── */
const navbar = document.getElementById('navbar');
const secs   = document.querySelectorAll('section[id]');
window.addEventListener('scroll',()=>{
  navbar?.classList.toggle('scrolled',scrollY>55);
  const y=scrollY+130;
  secs.forEach(s=>{
    const a=document.querySelector(`.nav-links a[href="#${s.id}"]`);
    if(a) a.classList.toggle('active',s.offsetTop<=y&&s.offsetTop+s.offsetHeight>y);
  });
},{passive:true});

/* ── TAGLINE TYPING — runs on all devices ── */
const taglineEl = document.getElementById('taglineText');
if(taglineEl){
  const text = 'SE student · problem solver · UI/UX thinker · always learning.';
  let i = 0;
  function typeTagline(){
    if(i <= text.length){
      taglineEl.textContent = text.slice(0, i++);
      setTimeout(typeTagline, 55);
    }
  }
  const tObs = new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting){ typeTagline(); tObs.disconnect(); }
  },{threshold:.3});
  const aboutSec = document.getElementById('about');
  if(aboutSec) tObs.observe(aboutSec);
}

/* ── 3D TILT — desktop only ── */
if(!isTouchDevice()){
  document.querySelectorAll('.tilt-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const dx=(e.clientX-r.left-r.width/2)/(r.width/2);
      const dy=(e.clientY-r.top-r.height/2)/(r.height/2);
      card.style.transform=`perspective(800px) rotateX(${-dy*8}deg) rotateY(${dx*8}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave',()=>card.style.transform='perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)');
  });

  /* project cards — subtle 3D on hover */
  document.querySelectorAll('.project-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const dx=(e.clientX-r.left-r.width/2)/(r.width/2);
      const dy=(e.clientY-r.top-r.height/2)/(r.height/2);
      card.style.transform=`perspective(700px) rotateX(${-dy*6}deg) rotateY(${dx*6}deg) translateY(-8px) scale(1.02)`;
    });
    card.addEventListener('mouseleave',()=>card.style.transform='');
  });
}

/* ── HORIZONTAL SCROLL — mouse drag + touch + arrows ── */
const track = document.getElementById('projectsTrack');
const aL    = document.getElementById('arrowLeft');
const aR    = document.getElementById('arrowRight');
if(track){
  const amt = 340;
  aL?.addEventListener('click',()=>track.scrollBy({left:-amt,behavior:'smooth'}));
  aR?.addEventListener('click',()=>track.scrollBy({left:amt,behavior:'smooth'}));

  let down=false,startX,sL;
  track.addEventListener('mousedown',e=>{down=true;track.classList.add('grabbing');startX=e.pageX-track.offsetLeft;sL=track.scrollLeft;});
  ['mouseleave','mouseup'].forEach(ev=>track.addEventListener(ev,()=>{down=false;track.classList.remove('grabbing');}));
  track.addEventListener('mousemove',e=>{if(!down)return;e.preventDefault();track.scrollLeft=sL-(e.pageX-track.offsetLeft-startX)*1.4;});

  let tx=0,scrolling=false;
  track.addEventListener('touchstart',e=>{tx=e.touches[0].clientX;scrolling=true;},{passive:true});
  track.addEventListener('touchmove',e=>{
    if(!scrolling)return;
    const diff=tx-e.touches[0].clientX;
    track.scrollLeft+=diff*.6;
    tx=e.touches[0].clientX;
  },{passive:true});
  track.addEventListener('touchend',()=>scrolling=false,{passive:true});
}

/* ── PROJECT PAGE: content section reveal ── */
document.querySelectorAll('.content-section').forEach((el,i)=>{
  el.style.opacity='0';el.style.transform='translateY(28px)';el.style.transition='opacity .6s ease, transform .6s ease';
  setTimeout(()=>{el.style.opacity='1';el.style.transform='translateY(0)';}, 300+i*120);
});

/* ── PROJECT PAGE: preview images 3D tilt ── */
if(!isTouchDevice()){
  document.querySelectorAll('.preview-img').forEach(img=>{
    img.addEventListener('mousemove',e=>{
      const r=img.getBoundingClientRect();
      const dx=(e.clientX-r.left-r.width/2)/(r.width/2);
      const dy=(e.clientY-r.top-r.height/2)/(r.height/2);
      img.style.transform=`perspective(600px) rotateX(${-dy*5}deg) rotateY(${dx*5}deg) scale(1.04)`;
    });
    img.addEventListener('mouseleave',()=>img.style.transform='');
  });
}

/* expose for onclick */
window.closeMenu = closeMenu;