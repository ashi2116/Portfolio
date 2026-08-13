gsap.registerPlugin(ScrollTrigger);

/* custom cursor */
const cursor = document.getElementById('cursor');
window.addEventListener('mousemove', e=>{
  gsap.to(cursor,{x:e.clientX,y:e.clientY,duration:.15,ease:'power2.out'});
});
document.querySelectorAll('a, .project-card, .ach-card, .cert-row').forEach(el=>{
  el.addEventListener('mouseenter',()=>cursor.classList.add('big'));
  el.addEventListener('mouseleave',()=>cursor.classList.remove('big'));
});

/* hero entrance */
gsap.from(".cutout-letter",{
  y:120, opacity:0, rotate:'+=25', duration:.9, ease:"back.out(1.7)", stagger:.045
});
gsap.from(".hero-tag",{y:30,opacity:0,duration:.8,delay:.7,ease:"power3.out"});
gsap.from(".hero-scribble",{opacity:0,y:-10,duration:.8,delay:.3});
gsap.from(".doodle",{opacity:0,scale:.5,duration:.7,delay:.9,stagger:.15,ease:"back.out(2)"});

/* individual card stagger reveals (lighter touch now that sections wipe in as a whole) */
gsap.utils.toArray('.project-card').forEach((el,i)=>{
  gsap.fromTo(el,{opacity:0,y:30},{
    opacity:1, y:0, duration:.7, ease:"power2.out",
    scrollTrigger:{trigger:el, start:"top 90%"}
  });
});
gsap.utils.toArray('.ach-card').forEach((el,i)=>{
  gsap.fromTo(el,{opacity:0,y:24},{
    opacity:1, y:0, duration:.6, ease:"power2.out", delay:(i%4)*0.06,
    scrollTrigger:{trigger:el, start:"top 92%"}
  });
});
gsap.utils.toArray('.cert-row').forEach((el,i)=>{
  gsap.fromTo(el,{opacity:0,y:16},{
    opacity:1, y:0, duration:.5, ease:"power2.out", delay:i*0.05,
    scrollTrigger:{trigger:el, start:"top 94%"}
  });
});
gsap.fromTo('.photo-sticker',{opacity:0,scale:.5,rotate:20},{
  opacity:1, scale:1, rotate:-6, duration:.6, ease:"back.out(2.5)",
  scrollTrigger:{trigger:'.avatar-wrap', start:"top 90%"}
});
gsap.utils.toArray('.fs-row').forEach((el,i)=>{
  gsap.fromTo(el,{opacity:0,y:14},{
    opacity:1, y:0, duration:.5, ease:"power2.out", delay:i*0.08,
    scrollTrigger:{trigger:el, start:"top 92%"}
  });
});

/* section-to-section transition: a colorful eye winks in, no screen flash */
const wipe = document.getElementById('wipe');
const wipeEye = wipe.querySelector('.wipe-eye');
const wipeIris = document.getElementById('wipeIris');
const wipeGlow = wipe.querySelector('.wipe-glow');

gsap.utils.toArray('.section-in').forEach((sec, i)=>{
  const color = sec.dataset.wipe || '#ff3d7f';

  ScrollTrigger.create({
    trigger: sec,
    start: "top 78%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline({defaults:{ease:"power2.inOut"}});
      tl.set(wipe, {opacity:1})
        .set(wipeGlow, {background:color, opacity:0, scale:.6})
        .set(wipeIris, {fill:color})
        .set(wipeEye, {scale:0, opacity:0, rotate:-10})
        .to(wipeGlow, {opacity:.35, scale:1, duration:.35}, 0)
        .to(wipeEye, {scale:1, opacity:1, rotate:0, duration:.32, ease:"back.out(2.2)"}, 0.05)
        .to(wipeEye, {scale:0, opacity:0, duration:.22, ease:"power1.in"}, "+=.12")
        .to(wipeGlow, {opacity:0, duration:.3}, "<")
        .set(wipe, {opacity:0})
        .fromTo(sec, {opacity:0, y:40, scale:.985}, {opacity:1, y:0, scale:1, duration:.6, ease:"power3.out"}, "-=.4");
    }
  });
});

/* section titles slide in */
gsap.utils.toArray('.sec-title').forEach(el=>{
  gsap.from(el,{
    x:-60, opacity:0, duration:.9, ease:"power3.out",
    scrollTrigger:{trigger:el, start:"top 85%"}
  });
});

/* marquee infinite scroll */
gsap.to("#marquee",{xPercent:-50, duration:14, ease:"none", repeat:-1});
gsap.to("#stackTrack",{xPercent:-50, duration:26, ease:"none", repeat:-1});

/* project cards subtle parallax tilt on scroll */
gsap.utils.toArray('.project-card').forEach((card,i)=>{
  gsap.to(card,{
    rotate: i%2===0 ? 0.6 : -0.6,
    scrollTrigger:{trigger:card, start:"top bottom", end:"bottom top", scrub:1}
  });
});

/* split text into hover-reactive spans without disturbing nested tags like <em> */
function wrapCharsDeep(root){
  [...root.childNodes].forEach(node=>{
    if(node.nodeType === 3){
      const frag = document.createDocumentFragment();
      [...node.textContent].forEach(ch=>{
        if(ch === ' '){ frag.appendChild(document.createTextNode(' ')); return; }
        const span = document.createElement('span');
        span.className = 'hoverchar';
        span.textContent = ch;
        frag.appendChild(span);
      });
      node.replaceWith(frag);
    } else if(node.nodeType === 1){
      wrapCharsDeep(node);
    }
  });
}
function wrapWordsDeep(root){
  [...root.childNodes].forEach(node=>{
    if(node.nodeType === 3){
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(chunk=>{
        if(chunk === '') return;
        if(/^\s+$/.test(chunk)){ frag.appendChild(document.createTextNode(chunk)); return; }
        const span = document.createElement('span');
        span.className = 'hoverword';
        span.textContent = chunk;
        frag.appendChild(span);
      });
      node.replaceWith(frag);
    } else if(node.nodeType === 1){
      wrapWordsDeep(node);
    }
  });
}

document.querySelectorAll('.sec-title, .project-card h3, .ach-card h4').forEach(wrapCharsDeep);
document.querySelectorAll('.hero-tag, .about-text p, .project-card p, .ach-card p, .eyebrow, .big-link').forEach(wrapWordsDeep);
document.querySelectorAll('.cert-row span:first-child').forEach(wrapWordsDeep);

document.querySelectorAll('.hoverchar').forEach(el=>{
  el.addEventListener('mouseenter',()=>{
    gsap.to(el,{
      y:-9, scale:1.28, rotate:gsap.utils.random(-14,14),
      duration:.22, ease:"back.out(3)"
    });
  });
  el.addEventListener('mouseleave',()=>{
    gsap.to(el,{y:0, scale:1, rotate:0, duration:.45, ease:"elastic.out(1,.5)"});
  });
});
document.querySelectorAll('.hoverword').forEach(el=>{
  el.addEventListener('mouseenter',()=>{
    gsap.to(el,{
      y:-5, scale:1.1, rotate:gsap.utils.random(-6,6),
      duration:.25, ease:"back.out(2.5)"
    });
  });
  el.addEventListener('mouseleave',()=>{
    gsap.to(el,{y:0, scale:1, rotate:0, duration:.4, ease:"elastic.out(1,.5)"});
  });
});

/* name letters: idle float + playful hover wiggle */
document.querySelectorAll('.cutout-letter').forEach((el,i)=>{
  gsap.to(el,{
    y: gsap.utils.random(-6,6),
    rotate: `+=${gsap.utils.random(-3,3)}`,
    duration: gsap.utils.random(1.6,2.6),
    repeat:-1, yoyo:true, ease:"sine.inOut",
    delay: i*0.08
  });
  el.addEventListener('mouseenter',()=>{
    gsap.to(el,{scale:1.25, rotate:gsap.utils.random(-14,14), duration:.3, ease:"back.out(3)"});
  });
  el.addEventListener('mouseleave',()=>{
    gsap.to(el,{scale:1, duration:.4, ease:"elastic.out(1,.5)"});
  });
});

/* scroll-triggered text reveals across the whole page */
function revealText(selector, opts={}){
  gsap.utils.toArray(selector).forEach((el,i)=>{
    gsap.fromTo(el,
      {opacity:0, y:opts.y ?? 24},
      {
        opacity:1, y:0,
        duration:opts.duration ?? .6,
        ease:"power2.out",
        delay:(i % (opts.staggerMod ?? 1)) * (opts.stagger ?? 0),
        scrollTrigger:{trigger:el, start:opts.start ?? "top 90%"}
      }
    );
  });
}
revealText('.eyebrow', {y:14, duration:.5});
revealText('.hero-tag', {y:20});
revealText('.about-text p', {y:22, stagger:.12, staggerMod:4});
revealText('.project-card p', {y:16});
revealText('.stack', {y:14});
revealText('.project-ctas a', {y:14, stagger:.08, staggerMod:2});
gsap.utils.toArray('.browser-frame').forEach((el,i)=>{
  gsap.fromTo(el,{opacity:0,scale:.94},{
    opacity:1, scale:1, duration:.6, ease:"power2.out",
    scrollTrigger:{trigger:el, start:"top 90%"}
  });
});
revealText('.ach-card h4, .ach-card p', {y:14, stagger:.05, staggerMod:2});
revealText('.cert-row span', {y:10, stagger:.05, staggerMod:2});
revealText('.big-link', {y:20});

function magnetize(selector, strength, growTo){
  document.querySelectorAll(selector).forEach(el=>{
    el.style.willChange = "transform";
    el.addEventListener('mousemove', e=>{
      const r = el.getBoundingClientRect();
      const relX = (e.clientX - r.left - r.width/2) / (r.width/2);
      const relY = (e.clientY - r.top - r.height/2) / (r.height/2);
      gsap.to(el,{
        x: relX*strength, y: relY*strength,
        scale: growTo, duration:.35, ease:"power2.out"
      });
    });
    el.addEventListener('mouseleave', ()=>{
      gsap.to(el,{x:0, y:0, scale:1, duration:.5, ease:"elastic.out(1,.5)"});
    });
  });
}
magnetize('.ach-card', 8, 1.04);
magnetize('.project-card', 4, 1.015);
magnetize('.btn-demo, .btn-code', 6, 1.08);
magnetize('.contact-links a', 8, 1.1);
magnetize('.big-link', 10, 1.06);
magnetize('.photo-sticker', 8, 1.08);

/* mascot follows the pointer (mouse OR touch drag) with a lag/trail */
const mascotMouth = document.getElementById('mascotMouth');
const mascotG = document.getElementById('mascotG');
const mascotEl = document.getElementById('mascot');

const OFFSET_X = 20, OFFSET_Y = 26;
const xTo = gsap.quickTo(mascotEl, "x", {duration:.45, ease:"power3.out"});
const yTo = gsap.quickTo(mascotEl, "y", {duration:.6, ease:"power3.out"});

let prevX = window.innerWidth/2;
gsap.set(mascotEl,{x:prevX-OFFSET_X, y:window.innerHeight/2-OFFSET_Y});

window.addEventListener('pointermove', e=>{
  xTo(e.clientX - OFFSET_X);
  yTo(e.clientY - OFFSET_Y);
  const dx = e.clientX - prevX;
  prevX = e.clientX;
  gsap.to(mascotG,{
    rotate: gsap.utils.clamp(-18,18,dx*1.4),
    scaleX: dx < -2 ? -1 : 1,
    transformOrigin:"100px 120px",
    duration:.3, ease:"power2.out"
  });
}, {passive:true});

/* idle bob so it's alive even when the pointer is still */
gsap.to(mascotG,{y:-8, duration:1.4, repeat:-1, yoyo:true, ease:"sine.inOut"});

document.querySelectorAll('a,.project-card,.ach-card,.cert-row').forEach(el=>{
  el.addEventListener('mouseenter',()=>{
    gsap.to(mascotG,{scale:1.2, duration:.25});
    mascotMouth.setAttribute('d','M78 145 Q100 165 122 145');
  });
  el.addEventListener('mouseleave',()=>{
    gsap.to(mascotG,{scale:1, duration:.25});
    mascotMouth.setAttribute('d','M78 138 Q100 155 122 138');
  });
});