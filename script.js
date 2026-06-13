/* ════════════════════════════════════════════
   HIFZA RASOOL — PORTFOLIO SCRIPTS 2026
════════════════════════════════════════════ */

/* ── TOUCH DETECTION — runs first before anything ── */
const isTouchDevice = () =>
  window.matchMedia('(hover:none)').matches ||
  window.matchMedia('(pointer:coarse)').matches ||
  ('ontouchstart' in window) ||
  (navigator.maxTouchPoints > 0);

/* ── IMMEDIATELY kill cursor on touch/mobile ── */
(function(){
  if(isTouchDevice()){
    const d = document.getElementById('cursorDot');
    const g = document.getElementById('cursorGlow');
    if(d) d.style.cssText = 'display:none!important;opacity:0!important;visibility:hidden!important;';
    if(g) g.style.cssText = 'display:none!important;opacity:0!important;visibility:hidden!important;';
    document.documentElement.style.cursor = 'auto';
    document.body.style.cursor = 'auto';
  }
})();

/* ── HAMBURGER MENU ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

function closeMenu() {
  if (hamburger) hamburger.classList.remove('open');
  if (navLinks)  navLinks.classList.remove('open');
  document.body.style.overflow = '';
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) closeMenu();
  });
}

/* ── CURSOR — works on both desktop (mouse) and mobile (touch) ── */
const dot  = document.getElementById('cursorDot');
const glow = document.getElementById('cursorGlow');

if (dot && glow) {
  let mx = window.innerWidth/2, my = window.innerHeight/2;
  let gx = mx, gy = my;

  // Make sure cursor elements are visible on all devices
  dot.style.display  = 'block';
  glow.style.display = 'block';
  dot.style.opacity  = '1';
  glow.style.opacity = '1';

  // ── DESKTOP: mouse tracking ──
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // ── MOBILE: touch tracking ──
  document.addEventListener('touchstart', e => {
    mx = e.touches[0].clientX;
    my = e.touches[0].clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    dot.style.opacity = '1';
    glow.style.opacity = '1';
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    mx = e.touches[0].clientX;
    my = e.touches[0].clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  }, { passive: true });

  document.addEventListener('touchend', () => {
    // fade out dot after finger lifts
    setTimeout(() => {
      dot.style.opacity  = '0';
      glow.style.opacity = '0';
    }, 800);
  }, { passive: true });

  // hover effects — desktop links
  const hoverEls = document.querySelectorAll('a,button,.skill-icon-card,.project-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.width  = '14px';
      dot.style.height = '14px';
      dot.style.background = 'var(--purple)';
      dot.style.boxShadow  = '0 0 15px var(--purple),0 0 30px var(--purple)';
      glow.style.width  = '60px';
      glow.style.height = '60px';
      glow.style.borderColor = 'rgba(168,85,247,.5)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.width  = '8px';
      dot.style.height = '8px';
      dot.style.background = 'var(--cyan)';
      dot.style.boxShadow  = '0 0 10px var(--cyan),0 0 20px var(--cyan)';
      glow.style.width  = '40px';
      glow.style.height = '40px';
      glow.style.borderColor = 'rgba(0,212,255,.4)';
    });
  });

  // smooth glow lag animation
  (function animCursor() {
    gx += (mx - gx) * 0.12;
    gy += (my - gy) * 0.12;
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
    requestAnimationFrame(animCursor);
  })();
}

/* ── PARTICLES ── */
const canvas = document.getElementById('particles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, pts = [];
  const COLORS = ['rgba(0,212,255,','rgba(168,85,247,'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class P {
    constructor() { this.init(); }
    init() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random()-.5)*.35;
      this.vy = (Math.random()-.5)*.35;
      this.r  = Math.random()*1.6+.3;
      this.a  = Math.random()*.45+.08;
      this.col = COLORS[Math.floor(Math.random()*COLORS.length)];
      this.life = Math.random()*220+80;
      this.age  = 0;
    }
    update() {
      this.x += this.vx; this.y += this.vy; this.age++;
      if (this.x<0||this.x>W||this.y<0||this.y>H||this.age>this.life) this.init();
    }
    draw() {
      const t = this.age, l = this.life;
      const fade = t<30 ? t/30 : t>l-30 ? (l-t)/30 : 1;
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
      ctx.fillStyle = this.col+(this.a*fade)+')';
      ctx.fill();
    }
  }

  const count = window.innerWidth < 480 ? 20 : window.innerWidth < 768 ? 45 : 110;
  for (let i=0;i<count;i++) pts.push(new P());

  (function loop() {
    ctx.clearRect(0,0,W,H);
    for (let i=0;i<pts.length;i++) {
      for (let j=i+1;j<pts.length;j++) {
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if (d<75) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x,pts[i].y);
          ctx.lineTo(pts[j].x,pts[j].y);
          ctx.strokeStyle=`rgba(0,212,255,${.04*(1-d/75)})`;
          ctx.lineWidth=.5;ctx.stroke();
        }
      }
      pts[i].update();pts[i].draw();
    }
    requestAnimationFrame(loop);
  })();
}

/* ── ABOUT TITLE CYCLING ── */
const aboutTitleEl = document.getElementById('aboutTitle');
if (aboutTitleEl) {
  const titles = [
    'Passionate about building things that matter.',
    'Turning ideas into working software.',
    'Designing for people. Building for impact.',
    'Creative challenges. Real-world solutions.'
  ];
  let ai=0, ac=0, adel=false;
  function typeAbout() {
    const t = titles[ai];
    if (!adel) {
      aboutTitleEl.textContent = t.slice(0,++ac);
      if (ac===t.length){ adel=true; setTimeout(typeAbout,2400); return; }
    } else {
      aboutTitleEl.textContent = t.slice(0,--ac);
      if (ac===0){ adel=false; ai=(ai+1)%titles.length; }
    }
    setTimeout(typeAbout, adel ? 35 : 70);
  }
  const aboutObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { typeAbout(); aboutObs.disconnect(); }
  },{threshold:.3});
  const aboutSec = document.getElementById('about');
  if (aboutSec) aboutObs.observe(aboutSec);
}

/* ── TAGLINE TYPING — all devices ── */
const taglineEl = document.getElementById('taglineText');
if (taglineEl) {
  const text = 'SE student · Android developer · UI/UX thinker · problem solver.';
  let i = 0;
  function typeTagline() {
    if (i <= text.length) {
      taglineEl.textContent = text.slice(0, i++);
      setTimeout(typeTagline, 55);
    }
  }
  const tObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { typeTagline(); tObs.disconnect(); }
  }, { threshold: .3 });
  const aboutSec2 = document.getElementById('about');
  if (aboutSec2) tObs.observe(aboutSec2);
}

/* ── TYPING ANIMATION ── */
const typingEl = document.getElementById('typingText');
if (typingEl) {
  const phrases = [
    'Software Engineering Student',
    'Aspiring Developer',
    'UI/UX Enthusiast',
    'Problem Solver',
    'Creative Builder'
  ];
  let pi=0,ci=0,del=false;
  function type() {
    const ph = phrases[pi];
    if (!del) {
      typingEl.textContent = ph.slice(0,++ci);
      if (ci===ph.length) { del=true; setTimeout(type,2000); return; }
    } else {
      typingEl.textContent = ph.slice(0,--ci);
      if (ci===0) { del=false; pi=(pi+1)%phrases.length; }
    }
    setTimeout(type, del?40:80);
  }
  type();
}

/* ── SCROLL REVEAL ── */
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e,i) => {
      if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i*70);
    });
  },{threshold:.07});
  reveals.forEach(el => obs.observe(el));
} else {
  reveals.forEach(el => el.classList.add('visible'));
}

/* ── SKILL BARS ── */
const bars = document.querySelectorAll('.skill-bar-fill');
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.w + '%';
      barObs.unobserve(e.target);
    }
  });
},{threshold:.35});
bars.forEach(b => barObs.observe(b));

/* ── NAV: ACTIVE + SCROLLED ── */
const secs = document.querySelectorAll('section[id]');
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
  const y = window.scrollY + 140;
  secs.forEach(s => {
    const a = document.querySelector(`.nav-links a[href="#${s.id}"]`);
    if (!a) return;
    a.classList.toggle('active', s.offsetTop<=y && s.offsetTop+s.offsetHeight>y);
  });
},{passive:true});

/* ── 3D TILT (desktop only) ── */
if (!isTouchDevice()) {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width/2)  / (r.width/2);
      const dy = (e.clientY - r.top  - r.height/2) / (r.height/2);
      card.style.transform = `perspective(800px) rotateX(${-dy*9}deg) rotateY(${dx*9}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });
}

/* ── HORIZONTAL SCROLL removed — now using alternating vertical layout ── */

/* helper exposed to onclick= attributes */
window.closeMenu = closeMenu;
/* ── VIEW ALL PROJECTS toggle ── */
function toggleMoreProjects(){
  const wrap   = document.getElementById('moreProjects');
  const btn    = document.getElementById('btnViewAll');
  const btnTxt = document.getElementById('btnViewAllText');
  const btnIco = document.getElementById('btnViewAllIcon');
  if(!wrap) return;

  const isOpen = wrap.classList.contains('open');

  if(!isOpen){
    wrap.classList.add('open');
    btn.classList.add('open');
    btnTxt.textContent = 'Show Less';
    // animate reveal-more items in staggered
    wrap.querySelectorAll('.reveal-more').forEach((el,i)=>{
      setTimeout(()=>el.classList.add('visible'), i*120);
    });
  } else {
    wrap.classList.remove('open');
    btn.classList.remove('open');
    btnTxt.textContent = 'View All Projects';
    wrap.querySelectorAll('.reveal-more').forEach(el=>el.classList.remove('visible'));
    // scroll back up to button smoothly
    btn.scrollIntoView({behavior:'smooth', block:'center'});
  }
}
window.toggleMoreProjects = toggleMoreProjects;

/* ── EVENTOHUB VIDEO ── */
const vid = document.getElementById('eventoVideo');
const placeholder = document.getElementById('videoPlaceholder');
if(vid && placeholder){
  // Try to play video — show it when ready, hide placeholder
  function showVideo(){
    vid.style.display = 'block';
    placeholder.style.display = 'none';
    vid.play().catch(()=>{});
  }

  // Already have data
  if(vid.readyState >= 2){
    showVideo();
  } else {
    vid.addEventListener('canplay', showVideo, {once:true});
    vid.addEventListener('loadeddata', showVideo, {once:true});
  }

  // On error — keep placeholder visible
  vid.addEventListener('error', ()=>{
    vid.style.display = 'none';
    placeholder.style.display = 'flex';
    placeholder.querySelector('.vp-badge').textContent = 'Coming Soon';
    placeholder.querySelector('.vp-sub').textContent = 'App preview video\nwill appear here';
  });

  // Force load
  vid.load();
}
