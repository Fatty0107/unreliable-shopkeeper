/* ============ FX: particles, flashes, number tweens, ornaments, audio engine, title shell ============ */
const PAL = { night:'#1E1430', plum:'#3B2758', brass:'#D9A54E', brassHi:'#F3D083', parchment:'#F3E4C4', ink:'#2A1830', magic:'#C08CFF', ember:'#FF9A3C' };

/* ---------- easing ---------- */
const Ease = {
  outCubic: t => 1 - Math.pow(1 - t, 3),
  outBack: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  inOut: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
};
function tween(dur, apply, ease = Ease.outCubic){ const t0 = performance.now(); return new Promise(res => { const step = now => { const t = Math.min(1, (now - t0) / dur); apply(ease(t)); if(t < 1) requestAnimationFrame(step); else res(); }; requestAnimationFrame(step); }); }

/* ---------- stage coordinates ---------- */
function stageScale(){ const st = document.getElementById('stage'); return st.getBoundingClientRect().width / 1600; }
function stagePoint(el, ax = .5, ay = .5){ if(!el) return {x:800,y:450}; const st = document.getElementById('stage').getBoundingClientRect(); const r = el.getBoundingClientRect(); const s = st.width / 1600; return { x: (r.left - st.left + r.width * ax) / s, y: (r.top - st.top + r.height * ay) / s }; }

/* ---------- particle system (one pooled canvas) ---------- */
const FX = {
  cv:null, cx:null, parts:[], max:600, dpr:1, motes:[], running:false,
  init(){
    const st = document.getElementById('stage');
    this.cv = document.createElement('canvas'); this.cv.id = 'fx'; st.appendChild(this.cv);
    this.cx = this.cv.getContext('2d'); this.resize();
    for(let i=0;i<22;i++) this.motes.push(this.newMote(true));
    window.addEventListener('resize', ()=>this.resize());
    const loop = () => { this.frame(); requestAnimationFrame(loop); }; requestAnimationFrame(loop);
  },
  resize(){ this.dpr = Math.min(2, (window.devicePixelRatio||1) * Math.max(.5, stageScale())); this.cv.width = 1600*this.dpr; this.cv.height = 900*this.dpr; },
  newMote(rand){ return { x: Math.random()*1600, y: rand ? Math.random()*900 : 920, vx: (Math.random()-.5)*.12, vy: -(.08+Math.random()*.18), r: .8+Math.random()*1.8, a: .15+Math.random()*.35, ph: Math.random()*6.28, c: Math.random()<.7 ? '#ffd890' : '#d8b8ff' }; },
  emit(x, y, o = {}){
    const n = o.count || 12;
    for(let i=0;i<n;i++){
      if(this.parts.length >= this.max) this.parts.shift();
      const ang = o.angle != null ? o.angle + (Math.random()-.5) * (o.spread ?? Math.PI*2) : Math.random()*Math.PI*2;
      const sp = (o.speed || 3) * (.5 + Math.random()*.8);
      const cols = o.colors || [PAL.magic, PAL.brassHi];
      this.parts.push({ x, y, vx: Math.cos(ang)*sp, vy: Math.sin(ang)*sp, g: o.gravity ?? .08, drag: o.drag ?? .985,
        life: 0, max: (o.life || 900) * (.7 + Math.random()*.6), size: (o.size || 4) * (.6 + Math.random()*.8), col: cols[Math.floor(Math.random()*cols.length)],
        type: o.type || 'spark', rot: Math.random()*6.28, vr: (Math.random()-.5)*.3, target: o.target || null, delay: o.homeDelay || 0, glow: o.glow ?? (o.type==='spark'||o.type==='star') });
    }
  },
  frame(){
    const c = this.cx, d = this.dpr; if(!c) return; c.setTransform(d,0,0,d,0,0); c.clearRect(0,0,1600,900);
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    // ambient motes: slow dust in the warm key light
    if(!reduce) this.motes.forEach((m,i)=>{ m.ph += .01; m.x += m.vx + Math.sin(m.ph)*.15; m.y += m.vy; if(m.y < -10) this.motes[i] = this.newMote(false);
      c.globalAlpha = m.a * (.6 + .4*Math.sin(m.ph*2)); c.fillStyle = m.c; c.beginPath(); c.arc(m.x, m.y, m.r, 0, 6.28); c.fill(); });
    const now = 16;
    for(let i=this.parts.length-1;i>=0;i--){
      const p = this.parts[i]; p.life += now; if(p.life >= p.max){ this.parts.splice(i,1); continue; }
      if(p.target && p.life > p.delay){ const dx = p.target.x - p.x, dy = p.target.y - p.y, dist = Math.hypot(dx,dy); if(dist < 18){ this.parts.splice(i,1); if(p.onArrive) p.onArrive(); continue; } p.vx = p.vx*.86 + dx/dist*2.4; p.vy = p.vy*.86 + dy/dist*2.4; p.max = p.life + 2000; }
      else { p.vy += p.g; p.vx *= p.drag; p.vy *= p.drag; }
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      const t = p.life / p.max, a = t < .1 ? t/.1 : 1 - Math.pow((t-.1)/.9, 2), s = p.size * (p.target ? 1 : (1 - t*.6));
      c.globalAlpha = Math.max(0, a);
      if(p.glow){ c.globalCompositeOperation = 'lighter'; }
      c.save(); c.translate(p.x, p.y); c.rotate(p.rot);
      if(p.type === 'spark'){ const g = c.createRadialGradient(0,0,0,0,0,s*2.2); g.addColorStop(0,'#fff'); g.addColorStop(.25,p.col); g.addColorStop(1,'rgba(0,0,0,0)'); c.fillStyle = g; c.beginPath(); c.arc(0,0,s*2.2,0,6.28); c.fill(); }
      else if(p.type === 'star'){ c.fillStyle = p.col; c.beginPath(); for(let k=0;k<8;k++){ const r = k%2 ? s*.35 : s*1.4; const an = k*Math.PI/4; c.lineTo(Math.cos(an)*r, Math.sin(an)*r); } c.closePath(); c.fill(); }
      else if(p.type === 'coin'){ const w = Math.abs(Math.cos(p.life/90)) * s; c.fillStyle = '#7a4a10'; c.beginPath(); c.ellipse(0,0,w+1.5,s+1.5,0,0,6.28); c.fill(); c.fillStyle = '#f7d27a'; c.beginPath(); c.ellipse(0,0,w,s,0,0,6.28); c.fill(); c.fillStyle = '#fff3c4'; c.beginPath(); c.ellipse(-w*.3,-s*.3,w*.3,s*.3,0,0,6.28); c.fill(); }
      else if(p.type === 'confetti'){ c.fillStyle = p.col; c.fillRect(-s, -s*.45, s*2, s*.9); }
      else if(p.type === 'drop'){ c.fillStyle = p.col; c.beginPath(); c.arc(0,0,s,0,6.28); c.fill(); c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.arc(-s*.3,-s*.3,s*.35,0,6.28); c.fill(); }
      else if(p.type === 'puff'){ c.fillStyle = p.col; c.globalAlpha *= .5; c.beginPath(); c.arc(0,0,s*(1+t*1.5),0,6.28); c.fill(); }
      c.restore(); c.globalCompositeOperation = 'source-over';
    }
    c.globalAlpha = 1;
  },
  /* recipes */
  splash(el, col){ const p = (el && el.x!=null) ? el : stagePoint(el, .5, .45); this.emit(p.x, p.y, {count:14, type:'drop', colors:[col, shade(col,.4), '#ffffff'], speed:4.2, angle:-Math.PI/2, spread:1.6, gravity:.22, life:700, size:4.5, glow:false}); this.emit(p.x, p.y, {count:8, type:'spark', colors:[col, PAL.magic], speed:2, life:600, size:3}); },
  burst(x, y, cols){ this.emit(x, y, {count:40, type:'spark', colors:cols||[PAL.magic,PAL.brassHi,'#fff'], speed:6, gravity:.02, life:1000, size:4}); this.emit(x, y, {count:16, type:'star', colors:[PAL.brassHi,'#fff'], speed:4, gravity:.03, life:1200, size:5}); },
  confetti(x, y){ this.emit(x, y, {count:46, type:'confetti', colors:[PAL.magic, PAL.brassHi, '#8fdc6f', '#ff9fc0'], speed:9, angle:-Math.PI/2, spread:1.4, gravity:.18, drag:.975, life:1600, size:6, glow:false}); },
  coins(fromEl, toEl, n = 10, onArrive){ const a = stagePoint(fromEl), b = stagePoint(toEl); let left = n;
    for(let i=0;i<n;i++){ this.emit(a.x + (Math.random()-.5)*40, a.y, {count:1, type:'coin', speed:5, angle:-Math.PI/2, spread:2.2, gravity:.15, life:4000, size:7, target:b, homeDelay:260 + i*40, glow:false}); const p = this.parts[this.parts.length-1]; p.onArrive = () => { if(--left === 0 && onArrive) onArrive(); SND.play('tick'); }; } },
  puff(el){ const p = stagePoint(el); this.emit(p.x, p.y, {count:10, type:'puff', colors:['#e8d8c0','#c8b090'], speed:1.6, gravity:-.02, life:600, size:7, glow:false}); },
  flash(col = PAL.magic, alpha = .55){ const f = document.getElementById('flash'); if(!f) return; f.style.background = `radial-gradient(circle at 50% 45%, ${col}, transparent 70%)`; tween(500, t => f.style.opacity = alpha*(1-t)); }
};

/* ---------- animated counters ---------- */
const shownVals = {};
function countTo(el, key, to){ if(!el) return; const from = shownVals[key] ?? to; shownVals[key] = to; if(from === to){ el.textContent = to; return; }
  const pill = el.closest('.pill'); if(pill){ pill.classList.remove('bump'); void pill.offsetWidth; pill.classList.add('bump'); if(to > from) pill.classList.add('up'); else pill.classList.remove('up'); }
  tween(600, t => el.textContent = Math.round(from + (to-from)*t)); }

/* ---------- frame ornaments (filigree corners) ---------- */
function decorate(root = document){
  root.querySelectorAll('.panel:not(.bare), .paper.framed, .mbox.paper, .mbox.panel').forEach(p => {
    if(p.querySelector(':scope > .orn')) return;
    ['tl','tr','bl','br'].forEach(k => { const i = document.createElement('i'); i.className = 'orn ' + k; i.setAttribute('aria-hidden','true'); p.appendChild(i); });
  });
}

/* ---------- audio engine: master → music / sfx / ambient ---------- */
const SND = {
  ctx:null, master:null, bus:{}, started:false, musicTimer:null,
  init(){
    if(this.ctx) return; try{ this.ctx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ return; }
    const c = this.ctx; this.master = c.createGain(); this.master.connect(c.destination);
    ['music','sfx','amb'].forEach(k => { const g = c.createGain(); g.connect(this.master); this.bus[k] = g; });
    this.apply();
  },
  apply(){ if(!this.ctx || !S) return; const st = S.settings; const on = st.sound !== false; const now = this.ctx.currentTime;
    this.master.gain.setTargetAtTime(on ? 1 : 0, now, .05);
    this.bus.music.gain.setTargetAtTime((st.music ?? .55) * .9, now, .05);
    this.bus.sfx.gain.setTargetAtTime(st.sfx ?? .8, now, .05);
    this.bus.amb.gain.setTargetAtTime(st.amb ?? .5, now, .05); },
  start(){ this.init(); if(!this.ctx) return; if(this.ctx.state === 'suspended') this.ctx.resume(); if(this.started) return; this.started = true; this.ambience(); this.music(); },
  env(g, t0, a, peak, d){ g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(peak, t0 + a); g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + d); },
  tone(f, t0, d, type, vol, f2, bus = 'sfx', a = .005){ const c = this.ctx, o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.setValueAtTime(f, t0); if(f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + d); this.env(g, t0, a, vol, d); o.connect(g).connect(this.bus[bus]); o.start(t0); o.stop(t0 + a + d + .05); },
  noise(t0, d, vol, filt = 'bandpass', freq = 1200, q = 1, bus = 'sfx'){ const c = this.ctx; const len = Math.floor(c.sampleRate * (d + .05)); const b = c.createBuffer(1, len, c.sampleRate); const ch = b.getChannelData(0); for(let i=0;i<len;i++) ch[i] = Math.random()*2-1;
    const s = c.createBufferSource(); s.buffer = b; const f = c.createBiquadFilter(); f.type = filt; f.frequency.value = freq; f.Q.value = q; const g = c.createGain(); this.env(g, t0, .005, vol, d); s.connect(f).connect(g).connect(this.bus[bus]); s.start(t0); s.stop(t0 + d + .05); return f; },
  play(type){ if(!S || S.settings.sound === false) return; this.init(); if(!this.ctx) return; const c = this.ctx; if(c.state === 'suspended') c.resume(); const t = c.currentTime; const v = 1 + (Math.random()-.5)*.16;
    switch(type){
      case 'click': this.noise(t, .025, .18, 'highpass', 2400); this.tone(1400*v, t, .03, 'triangle', .04); break;
      case 'tick': this.tone(2200*v, t, .04, 'square', .025); break;
      case 'add': this.tone(620*v, t, .16, 'sine', .22, 170); this.noise(t+.02, .12, .08, 'lowpass', 900); break;
      case 'bubble': for(let i=0;i<10;i++) this.tone(180+Math.random()*420, t+i*.1, .14, 'sine', .12, 80+Math.random()*60); this.noise(t, 1.1, .05, 'lowpass', 500); break;
      case 'whoosh': { const f = this.noise(t, .6, .14, 'bandpass', 300, 2); f.frequency.exponentialRampToValueAtTime(3000, t + .55); } break;
      case 'coin': this.tone(988*v, t, .09, 'square', .045); this.tone(1319*v, t+.07, .3, 'square', .045); break;
      case 'chime': this.tone(784, t, .7, 'sine', .12); this.tone(1175, t+.1, .8, 'sine', .09); this.tone(1568, t+.2, 1, 'sine', .07); break;
      case 'sting': [523,659,784,1047].forEach((f,i)=>{ this.tone(f, t+i*.11, .5, 'triangle', .12); this.tone(f*2, t+i*.11, .35, 'sine', .04); }); break;
      case 'oops': this.tone(420, t, .45, 'sawtooth', .05, 110); this.tone(300, t+.12, .4, 'triangle', .06, 90); break;
      case 'page': this.noise(t, .14, .12, 'bandpass', 3200, .8); break;
      case 'sparkle': [1568,1976,2349,3136].forEach((f,i)=>this.tone(f, t+i*.06, .3, 'sine', .05)); break;
      case 'thud': this.tone(140, t, .18, 'sine', .25, 60); this.noise(t, .08, .1, 'lowpass', 400); break;
      case 'bell': this.tone(1046, t, 1.2, 'sine', .1); this.tone(1569, t, .9, 'sine', .05); this.tone(2093, t+.01, .6, 'sine', .03); break;
    } },
  ambience(){ const c = this.ctx; const len = c.sampleRate * 6; const b = c.createBuffer(1, len, c.sampleRate); const d = b.getChannelData(0); let last = 0;
    for(let i=0;i<len;i++){ const w = Math.random()*2-1; last = (last + .02*w)/1.02; d[i] = last*3.2; }
    for(let i=0;i<2400;i++){ const k=i/2400; d[i]*=k; d[len-1-i]*=k; }
    const s = c.createBufferSource(); s.buffer = b; s.loop = true; const f = c.createBiquadFilter(); f.type='lowpass'; f.frequency.value = 520; const g = c.createGain(); g.gain.value = .32; s.connect(f).connect(g).connect(this.bus.amb); s.start();
    const plop = () => { if(this.ctx){ const t = c.currentTime; this.tone(160+Math.random()*180, t, .16, 'sine', .07, 70, 'amb'); if(Math.random()<.4) this.noise(t+.05, .04, .03, 'highpass', 3000, 1, 'amb'); } setTimeout(plop, 1500 + Math.random()*3500); }; setTimeout(plop, 1200);
  },
  /* generative music-box waltz: Dm – Bb – F – C, 3/4 at 84 bpm */
  music(){ const c = this.ctx; const beat = 60/84; const prog = [[62,65,69],[58,62,65],[53,57,60],[60,64,67],[62,65,69],[55,58,62],[57,61,64],[57,61,64]];
    const mf = m => 440*Math.pow(2,(m-69)/12); let bar = 0, next = c.currentTime + .3;
    const pluck = (f, t, vol, dur=1.1) => { this.tone(f, t, dur, 'triangle', vol, null, 'music', .004); this.tone(f*2, t, dur*.5, 'sine', vol*.35, null, 'music', .004); };
    const sched = () => { while(next < c.currentTime + .6){ const ch = prog[bar % prog.length];
        this.tone(mf(ch[0]-24), next, beat*2.6, 'sine', .07, null, 'music', .02);
        const pattern = [0,1,2,1,2,1]; pattern.forEach((k,i)=>{ const oct = (bar%4===3 && i>3) ? 24 : 12; pluck(mf(ch[k]+oct), next + i*beat/2, i===0?.05:.035); });
        if(bar % 2 === 1){ const hi = ch[Math.floor(Math.random()*3)] + 24; this.tone(mf(hi), next + beat*2.5, 1.4, 'sine', .025, null, 'music', .01); }
        // soft pad
        ch.forEach(m => { const o = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter(); o.type='sawtooth'; o.frequency.value = mf(m); f.type='lowpass'; f.frequency.value = 700; g.gain.setValueAtTime(.0001,next); g.gain.linearRampToValueAtTime(.008,next+beat); g.gain.linearRampToValueAtTime(.0001,next+beat*3); o.connect(f).connect(g).connect(this.bus.music); o.start(next); o.stop(next+beat*3+.1); });
        next += beat*3; bar++; }
      this.musicTimer = setTimeout(sched, 200); };
    sched(); }
};

/* ---------- title screen (game shell) ---------- */
function showTitle(){
  let t = document.getElementById('title'); if(!t){ t = document.createElement('div'); t.id = 'title'; document.getElementById('stage').appendChild(t); }
  const hasSave = !!(S && (S.day > 1 || S.experiments.length || S.sales.length));
  t.innerHTML = `<div class="t-scrim"></div>
   <div class="t-float">${['#c08cff','#ff9fc0','#8fdc6f','#f3d083','#7fd8f0'].map((c,i)=>`<span style="--i:${i}">${bottleArt(['round','vial','oddity','flat','dropper'][i], c, 70+i%2*18, {sparkle:true})}</span>`).join('')}</div>
   <div class="t-logo">
     <div class="t-eyebrow">Gloambridge · Bellwether Lane</div>
     <h1><span class="t-the">The</span><span class="t-main">Unreliable</span><span class="t-main t-2">Shopkeeper</span></h1>
     <div class="t-sub">a magical apothecary of questionable reliability</div>
   </div>
   <div class="t-menu">
     <button class="btn gold big" data-act="titlePlay">${icon('shop',22)}${hasSave?`Continue · Day ${S.day}`:'Open the shop'}</button>
     ${hasSave?`<button class="btn big" data-act="titleNew">${icon('refresh',20)}New shop</button>`:''}
     <div class="flowrow" style="justify-content:center"><button class="btn" data-act="settings">${icon('gear',18)}Settings</button><button class="btn" data-act="titleHow">${icon('question',18)}How to play</button></div>
   </div>
   <div class="t-prompt">Click anything to light the candles</div>`;
  t.classList.add('show'); document.body.classList.add('on-title');
}
function hideTitle(){ const t = document.getElementById('title'); if(!t) return; t.classList.add('leaving'); document.body.classList.remove('on-title'); setTimeout(()=>{ t.classList.remove('show','leaving'); }, 450); }

/* ---------- foliage framing the stage (vines over the frames, like the shop itself) ---------- */
function leafCluster(flip){ const L=(x,y,r,s,c)=>`<path d="M0 0c10-14 30-16 40-2-12 12-30 12-40 2z" transform="translate(${x} ${y}) rotate(${r}) scale(${s})" fill="${c}" stroke="#1a2a14" stroke-width="2"/><path d="M2 0c12-4 24-4 34-1" transform="translate(${x} ${y}) rotate(${r}) scale(${s})" stroke="#1a3a14" stroke-width="1.2" fill="none" opacity=".6"/>`;
  return `<svg width="220" height="160" viewBox="0 0 220 160" style="transform:${flip}"><path d="M0 150C40 120 60 80 110 60S190 20 220 0" stroke="#3a2a14" stroke-width="5" fill="none"/>${[[20,138,-40,1.1,'#4f8f3a'],[46,112,-70,1,'#6fbf5a'],[70,92,-20,1.2,'#5aa046'],[98,70,-60,.9,'#8fd06a'],[124,58,-10,1.1,'#4f8f3a'],[150,44,-55,1,'#6fbf5a'],[178,26,-15,.9,'#5aa046'],[200,12,-50,.8,'#8fd06a'],[60,120,20,.9,'#3f7a34'],[112,74,30,.8,'#6fbf5a']].map(a=>L(...a)).join('')}</svg>`; }
function addFoliage(){ const st=document.getElementById('stage'); [['left:-28px;bottom:-30px',''],['right:-28px;bottom:-30px','scaleX(-1)']].forEach(([pos,fl])=>{ const d=document.createElement('div'); d.className='leaves'; d.style.cssText=pos; d.innerHTML=leafCluster(fl); st.appendChild(d); }); }
