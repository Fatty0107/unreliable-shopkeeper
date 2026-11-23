/* ============ UI: screens, interactions, modals ============ */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const first = n => n.replace(/^(The |Sir |Lord |Mrs\. |Count |Old )/,'').split(' ')[0];

/* ---------- toasts ---------- */
function toast(msg, hand=false, ic='sparkle'){ const t=document.createElement('div'); t.className='toast'+(hand?' hand':''); t.innerHTML=icon(ic,18)+`<span>${msg}</span>`; $('#toasts').appendChild(t); setTimeout(()=>t.remove(),3700); }
function coinFly(amount, fromEl){ const to=$('#pillCrowns'); if(fromEl && to) FX.coins(fromEl, to, Math.min(14, 4+Math.round(amount/6))); const p=stagePoint(to||fromEl,.5,1.7); const d=document.createElement('div'); d.className='coinfly'; d.style.left=(p.x-20)+'px'; d.style.top=(p.y)+'px'; d.textContent=(amount>=0?'+':'')+amount; $('#stage').appendChild(d); setTimeout(()=>d.remove(),1400); }

/* ---------- helpers ---------- */
const stars = n => '★'.repeat(n)+'<span style="opacity:.3">'+'★'.repeat(3-n)+'</span>';
function behChip(b, kind=''){ const B=BEH[b]; const solid = kind==='main'; return `<span class="chip ${solid?'solid':''}" style="color:${B.c};${solid?`background:${B.c};`:''}" title="${esc(B.fx)}">${bglyph(b,13)}${b}${kind==='main'?' · main':kind==='sec'?' · second':''}</span>`; }
function behChipDark(b, kind){ const B=BEH[b]; const c=shade(B.c,-0.45); return `<span class="chip" style="color:${c};background:${B.c}55">${bglyph(b,13)}${b}${kind==='main'?' · main':kind==='sec'?' · second':''}</span>`; }
function known(id){ return S.known[id]||[]; }
function inMix(id){ return S.brew.mix[id]||0; }
function avail(id){ return (S.inv[id]||0) - inMix(id); }
function hearts(n){ let s='<div class="hearts">'; for(let i=0;i<5;i++) s+=`<span class="${i<n?'':'off'}">${icon('heart',13)}</span>`; return s+'</div>'; }
function purse(b){ return b<=30?'Light purse':b<=45?'Comfortable purse':b<=60?'Well-heeled':'Deep pockets'; }
function curCust(){ return S.queue.find(q=>q.id===S.selCust); }
function getPotion(uid){ return S.stock.find(p=>p.uid===uid); }

/* ---------- master render ---------- */
let lastScreen=null;
function render(){ renderTop(); const v=$('#view');
  ({shop:renderShop,brew:renderBrew,ingredients:renderIngredients,recipes:renderRecipes,market:renderMarket,ledger:renderLedger})[S.screen](v);
  if(lastScreen!==S.screen){ v.classList.remove('enter'); void v.offsetWidth; v.classList.add('enter'); lastScreen=S.screen; clearTimeout(render._t); render._t=setTimeout(()=>v.classList.remove('enter'),650); }
  else v.classList.remove('enter');
  S3D.sync(); decorate(v); countTo($('[data-count="crowns"]'),'crowns',S.crowns); countTo($('[data-count="rep"]'),'rep',S.rep); countTo($('[data-count="notes"]'),'notes',S.notes);
  save();
}
function renderTop(){
  const n=S.queue.length, d=S.queue.filter(x=>x.done).length, waiting=n-d;
  const tabs=[['shop','Shop','shop'],['brew','Brew','flask'],['ingredients','Ingredients','leaf'],['recipes','Recipes','book'],['market','Market','cart'],['ledger','Ledger','chart']];
  $('#top').innerHTML = `
   <div class="crest" title="The Unreliable Shopkeeper · The Crooked Cork">${icon('moon',30)}</div>
   <nav id="nav" aria-label="Screens">${tabs.map(([k,l,ic])=>`<button class="${S.screen===k?'on':''}" data-act="go" data-to="${k}">${icon(ic,18)}${l}${k==='shop'&&waiting?`<span class="badge">${waiting}</span>`:''}</button>`).join('')}</nav>
   <div class="daybar" title="Each customer served moves the day along">
     ${icon('sun',22)}<span class="hand" style="font-size:24px;color:var(--brass2);white-space:nowrap">Day ${S.day}</span>
     <div class="segs">${S.queue.map(q=>`<i class="${q.done?'on':''}"></i>`).join('')}</div>
     <span class="lbl">${timeLabel()}</span>${icon('moon',20)}
   </div>
   <button class="btn gold" style="flex:none;height:48px" data-act="closeShop" title="Close the shop for the night">${icon('moon',17)}Close shop</button>
   <div class="pill" id="pillCrowns" title="Crowns"><span class="cn">${icon('coin',18)}</span><b data-count="crowns">${shownVals.crowns ?? S.crowns}</b></div>
   <div class="pill" title="Shop reputation"><span class="cn rep">${icon('star',17)}</span><b data-count="rep">${shownVals.rep ?? S.rep}</b></div>
   <div class="pill" title="Research notes: spend to study ingredients"><span class="cn note">${icon('scroll',17)}</span><b data-count="notes">${shownVals.notes ?? S.notes}</b></div>
   <button class="btn round" data-act="sound" aria-label="Toggle sound">${icon(S.settings.sound?'sound':'mute',20)}</button>
   <button class="btn round" data-act="menu" aria-label="Settings and menu">${icon('gear',20)}</button>`;
}

/* ================= SHOP ================= */
function renderShop(v){
  v.innerHTML = `<div class="grid3" style="grid-template-columns:290px 1fr 380px">
    <section class="panel rail">${railHTML()}</section>
    <section class="panel room ${S3D.ok?'room3d':''}" id="room">${roomHTML()}</section>
    <section class="panel side">${sideHTML()}</section></div>`;
}
function railHTML(){
  const items = S.queue.map(q=>{ const r=custReq(q); const castC = q.kind==='cast'?S.cast[q.key]:null;
    const res = q.result; let tag='';
    if(res){ tag = res.declined?`<span class="res-tag" style="color:var(--muted)">Declined</span>`:`<span class="res-tag" style="color:${OUTCOME[res.ev.outcome].col}">${OUTCOME[res.ev.outcome].label} · ${res.price}c</span>`; }
    const pk = q.key; const expr = res&&!res.declined ? OUTCOME[res.ev.outcome].expr : 'neutral';
    return `<button class="cust ${S.selCust===q.id?'sel':''} ${q.done?'done':''}" data-act="selCust" data-id="${q.id}">
      <div class="por">${portrait(pk,expr,62)}</div>
      <div style="min-width:0;flex:1"><div class="nm">${esc(custName(q))}</div><div class="tp">${esc(r.topic)}</div>
      ${castC?hearts(clamp(Math.round(castC.rapport),0,5)):`<div class="tp" style="color:var(--brass2)">Walk-in guest</div>`}${tag}</div>
      ${!q.done?`<span class="bubble">${icon(q.asked?'check':'chat',15)}</span>`:''}</button>`;}).join('');
  return `<h2 class="ptitle">${icon('chat',20)}Today's Customers</h2>
    <div class="custs">${items || '<div class="empty">The street is quiet.</div>'}</div>
    <div class="mallow">${catArt(76, true)}<p>${mallowHint()}</p></div>`;
}
function mallowHint(){
  const q=curCust();
  if(!S.stock.length) return 'Mallow is sitting on the cauldron lid. Pointedly. Perhaps brew something?';
  if(q && !q.done && !q.asked) return `Mallow\'s ears twitch toward ${first(custName(q))}. There\'s more to hear. Try asking.`;
  if(q && !q.done && q.asked) return 'Mallow paws at the shelf. Does anything there match what they actually need?';
  const tips=['Mallow knocked a quirky bottle off the shelf. It is now floating. Mallow is pleased.','A brew is murky when nothing in it agrees. Mallow recommends pairs.','Mallow naps longer near the bench. Customers chat longer there too.','Mallow hisses at bottles priced far above their worth.'];
  return tips[S.day%tips.length];
}
function roomHTML(){
  if(S3D.ok){ const st=shopStats(); return `<div class="roomtools">
    <span class="stat">${icon('bottle',16)}Display <b>${st.display}</b></span><span class="stat">${icon('sparkle',16)}Charm <b>${st.charm}</b></span><span class="stat">${icon('heart',16)}Comfort <b>${st.comfort}</b></span><span class="stat">${icon('shop',16)}Traffic <b>${st.traffic}</b></span>
    <span style="flex:1"></span><button class="btn ${S.editMode?'gold':''}" data-act="toggleEdit">${icon(S.editMode?'check':'hammer',18)}${S.editMode?'Done arranging':'Arrange shop'}</button></div>` + (S.editMode? buildHTML() : dialogHTML()); }
  const sc=1.15, ox=348, oy=192, WH=176;
  const P=(x,y)=>isoPt(x,y,ox,oy);
  const pts=a=>a.map(p=>p.join(',')).join(' ');
  const A=P(0,0),B=P(GRID_W,0),C=P(GRID_W,GRID_H),D=P(0,GRID_H);
  const up=(p,h)=>[p[0],p[1]-h];
  let s=`<defs>
    <linearGradient id="wallR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3360"/><stop offset="1" stop-color="#6a4a6a"/></linearGradient>
    <linearGradient id="wallL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2850"/><stop offset="1" stop-color="#5a3f5a"/></linearGradient>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3a8a"/><stop offset=".7" stop-color="#7a5ab8"/><stop offset="1" stop-color="#e8a0c0"/></linearGradient>
    <radialGradient id="warm" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".45"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient>
    <linearGradient id="shaftG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b8c8ff" stop-opacity=".34"/><stop offset="1" stop-color="#b8c8ff" stop-opacity="0"/></linearGradient>
    <radialGradient id="lampG" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffc870" stop-opacity=".55"/><stop offset=".5" stop-color="#ff9a3c" stop-opacity=".18"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/></radialGradient>
    <radialGradient id="magicG" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#c08cff" stop-opacity=".55"/><stop offset="1" stop-color="#c08cff" stop-opacity="0"/></radialGradient>
    <linearGradient id="moonWash" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a7cff" stop-opacity=".16"/><stop offset=".6" stop-color="#6a7cff" stop-opacity="0"/></linearGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
    <pattern id="stone" width="40" height="22" patternUnits="userSpaceOnUse"><rect width="40" height="22" fill="none"/><path d="M0 11h40M20 0v11M0 22h40M10 11v11M30 11v11" stroke="#2a1830" stroke-opacity=".22" stroke-width="1.5"/></pattern>
  </defs><g transform="scale(${sc})">`;
  // walls
  s+=`<polygon points="${pts([A,B,up(B,WH),up(A,WH)])}" fill="url(#wallR)" stroke="${OL}" stroke-width="2"/>`;
  s+=`<polygon points="${pts([A,B,up(B,WH),up(A,WH)])}" fill="url(#stone)" />`;
  s+=`<polygon points="${pts([A,D,up(D,WH),up(A,WH)])}" fill="url(#wallL)" stroke="${OL}" stroke-width="2"/>`;
  // wainscot
  const wain=(p1,p2,h,c)=>`<polygon points="${pts([p1,p2,up(p2,h),up(p1,h)])}" fill="${c}" stroke="${OL}" stroke-width="1.5"/>`;
  s+=wain(A,B,46,'#6a3f2a')+wain(A,D,46,'#5a3424');
  for(let i=1;i<GRID_W;i++){ const p=P(i,0); s+=`<path d="M${p[0]} ${p[1]}v-46" stroke="${OL}" stroke-opacity=".35" stroke-width="1.5"/>`; }
  for(let i=1;i<GRID_H;i++){ const p=P(0,i); s+=`<path d="M${p[0]} ${p[1]}v-46" stroke="${OL}" stroke-opacity=".35" stroke-width="1.5"/>`; }
  // timber beams
  [0,3.3,6.6,GRID_W].forEach(t=>{ const p=P(t,0); s+=`<path d="M${p[0]} ${p[1]}v${-WH}" stroke="#4a2a1a" stroke-width="9"/><path d="M${p[0]} ${p[1]}v${-WH}" stroke="#7a4a2a" stroke-width="5"/>`; });
  [0,4,GRID_H].forEach(t=>{ const p=P(0,t); s+=`<path d="M${p[0]} ${p[1]}v${-WH}" stroke="#3a2014" stroke-width="9"/><path d="M${p[0]} ${p[1]}v${-WH}" stroke="#6a3a20" stroke-width="5"/>`; });
  s+=`<polygon points="${pts([up(A,WH),up(B,WH),up(B,WH-14),up(A,WH-14)])}" fill="#7a4a2a" stroke="${OL}" stroke-width="1.5"/><polygon points="${pts([up(A,WH),up(D,WH),up(D,WH-14),up(A,WH-14)])}" fill="#5a3420" stroke="${OL}" stroke-width="1.5"/>`;
  // arched windows on right wall
  const win=(t1,t2,b,tp)=>{ const p1=P(t1,0),p2=P(t2,0); const bl=up(p1,b),br=up(p2,b),tl=up(p1,tp),tr=up(p2,tp); const mid=[(tl[0]+tr[0])/2,(tl[1]+tr[1])/2-30];
    const path=`M${bl.join(' ')}L${br.join(' ')}L${tr.join(' ')}Q${mid[0]} ${mid[1]-6} ${tl.join(' ')}Z`;
    const mx=[(bl[0]+br[0])/2,(bl[1]+br[1])/2]; const mt=[(tl[0]+tr[0])/2,(tl[1]+tr[1])/2-24];
    return `<path d="${path}" fill="url(#sky)" stroke="#3a2014" stroke-width="7"/><path d="${path}" fill="none" stroke="#c8a04a" stroke-width="2"/>
     <circle cx="${mt[0]+10}" cy="${mt[1]+26}" r="9" fill="#fff6d8" opacity=".9"/><circle cx="${mt[0]+14}" cy="${mt[1]+23}" r="8" fill="#5a4a9a" opacity=".9"/>
     ${[[.2,.3],[.7,.2],[.5,.55],[.3,.7]].map(([a,b2])=>`<circle cx="${tl[0]+(tr[0]-tl[0])*a}" cy="${tl[1]+(bl[1]-tl[1])*b2+ (tr[1]-tl[1])*a}" r="1.4" fill="#fff"/>`).join('')}
     <path d="M${mx[0]} ${mx[1]}L${mt[0]} ${mt[1]}M${(bl[0]+tl[0])/2} ${(bl[1]+tl[1])/2}L${(br[0]+tr[0])/2} ${(br[1]+tr[1])/2}" stroke="#3a2014" stroke-width="4"/>
     <polygon points="${pts([bl,br,[br[0]+6,br[1]+8],[bl[0]+6,bl[1]+8]])}" fill="#8f5a34" stroke="${OL}" stroke-width="1.5"/>`; };
  s+=win(3.9,5.9,64,150)+win(7.1,8.9,64,150);
  // shelf with jars on left wall
  const sh1=P(0,1.2), sh2=P(0,3.6);
  s+=`<path d="M${sh1[0]} ${sh1[1]-110}L${sh2[0]} ${sh2[1]-110}" stroke="#4a2a1a" stroke-width="7"/>`;
  for(let i=0;i<6;i++){ const t=1.4+i*0.38; const p=P(0,t); const c=['#e86aa0','#6ad0f0','#f5c84a','#7fd66a','#b88af0','#f08a5a'][i]; s+=`<rect x="${p[0]-6}" y="${p[1]-132}" width="12" height="18" rx="3" fill="${c}" stroke="${OL}" stroke-width="1.2"/><rect x="${p[0]-4}" y="${p[1]-136}" width="8" height="5" fill="#b8865a" stroke="${OL}" stroke-width="1"/>`; }
  // banner on left wall
  const bn=P(0,5.2); s+=`<path d="M${bn[0]-14} ${bn[1]-150}h28v60l-14-10-14 10z" fill="#5a2a8a" stroke="${OL}" stroke-width="2" transform="skewY(-26.5) translate(0 ${bn[0]*0.5})"/>`;
  // door on left wall at the entrance tile
  const d1=P(0,DOOR.y+0.1), d2=P(0,DOOR.y+0.9);
  const dtop=[(d1[0]+d2[0])/2,(d1[1]+d2[1])/2-128];
  s+=`<path d="M${d1[0]} ${d1[1]}L${d1[0]} ${d1[1]-96}Q${dtop[0]} ${dtop[1]-6} ${d2[0]} ${d2[1]-96}L${d2[0]} ${d2[1]}Z" fill="#2a1a2a" stroke="#3a2014" stroke-width="6"/>
     <path d="M${d1[0]+4} ${d1[1]-4}L${d1[0]+4} ${d1[1]-92}Q${dtop[0]} ${dtop[1]} ${d2[0]-4} ${d2[1]-96}L${d2[0]-4} ${d2[1]-4}Z" fill="#8f5a34" stroke="${OL}" stroke-width="1.5"/>
     <circle cx="${d2[0]+12}" cy="${d2[1]-48}" r="3" fill="#e8c06a" stroke="${OL}"/>`;
  // hanging vines
  for(let i=0;i<9;i++){ const p=up(P(i*1.1+0.4,0),WH-10); s+=`<path d="M${p[0]} ${p[1]}q${(i%2?6:-6)} 18 0 ${30+(i%3)*12}" stroke="#3f7a34" stroke-width="3" fill="none"/>${[10,22,34].map(dy=>`<ellipse cx="${p[0]+(dy%20?4:-4)}" cy="${p[1]+dy}" rx="5" ry="3" fill="#6fbf5a" stroke="${OL}" stroke-width="1"/>`).join('')}`; }
  // floor edge (diorama)
  s+=`<polygon points="${pts([D,C,[C[0],C[1]+20],[D[0],D[1]+20]])}" fill="#4a2a1a" stroke="${OL}" stroke-width="2"/><polygon points="${pts([C,B,[B[0],B[1]+20],[C[0],C[1]+20]])}" fill="#3a2014" stroke="${OL}" stroke-width="2"/>`;
  // floor tiles
  for(let y=0;y<GRID_H;y++) for(let x=0;x<GRID_W;x++){ const a=P(x,y),b=P(x+1,y),c=P(x+1,y+1),d=P(x,y+1); const alt=(x+y)%2; s+=`<polygon class="${S.editMode?'tile':''}" data-x="${x}" data-y="${y}" points="${pts([a,b,c,d])}" fill="${alt?'#b88a5a':'#c89a68'}" stroke="#8f6a42" stroke-width="1"/>`; }
  // warm glow
  s+=`<ellipse cx="${P(5,3)[0]}" cy="${P(5,3)[1]}" rx="260" ry="130" fill="url(#warm)" pointer-events="none"/>`;
  // moonlight shafts from the two arched windows onto the floor
  [[3.9,5.9],[7.1,8.9]].forEach(([t1,t2])=>{ const w1=up(P(t1,0),150), w2=up(P(t2,0),150), f1=P(t1-1.2,4.6), f2=P(t2-1.2,4.6);
    s+=`<polygon class="shaft" points="${pts([w1,w2,f2,f1])}" fill="url(#shaftG)" pointer-events="none"/>`; });
  // soft contact shadows under furniture
  S.layout.forEach(it=>{ if(FURN[it.type].flat) return; const [w,h]=fdims(it); const c=P(it.x+w/2,it.y+h/2); s+=`<ellipse cx="${c[0]}" cy="${c[1]+3}" rx="${(w+h)*17}" ry="${(w+h)*8.5}" fill="#1a0a20" opacity=".28" filter="url(#soft)" pointer-events="none"/>`; });
  // door mat
  const dm=[P(0,DOOR.y),P(1,DOOR.y),P(1,DOOR.y+1),P(0,DOOR.y+1)]; s+=`<polygon points="${pts(dm.map(p=>[(p[0]-dm[0][0])*.8+dm[0][0]+4,(p[1]-dm[0][1])*.8+dm[0][1]+2]))}" fill="#7a3a3a" stroke="${OL}" stroke-width="1.2" pointer-events="none"/>`;
  // items + people sorted by depth
  const drawables = S.layout.map(it=>{ const [w,h]=fdims(it); return {d: FURN[it.type].flat? -1 : it.x+it.y+w+h-1, svg: furnitureSVG(it,ox,oy,{selected:S.editMode&&S.editSel===it.id, cauldronCol: S.stock[0]?S.stock[0].col:'#b86af0'})}; });
  if(!S.editMode){
    const waiting = S.queue.filter(q=>!q.done && q.id!==S.selCust);
    const cur = curCust();
    const spots=[[4.6,3.7],[1.4,6.4],[2.4,6.9],[1.3,5.2],[3.2,7.2]];
    const ppl=[]; if(cur && !cur.done) ppl.push([cur,spots[0],1]); waiting.slice(0,4).forEach((q,i)=>ppl.push([q,spots[i+1],0.8]));
    ppl.forEach(([q,[x,y],k],i)=>{ const p=P(x,y); const cid='cc'+i; const r=24*k; const col=PORTRAITS[q.key].clothes;
      drawables.push({d:x+y+0.5, svg:`<g class="person" data-act="selCust" data-id="${q.id}" style="cursor:pointer">
        <ellipse cx="${p[0]}" cy="${p[1]}" rx="${r*1.1}" ry="${r*.45}" fill="#000" opacity=".28"/>
        <path d="M${p[0]-r*.9} ${p[1]-2}q${r*.9} ${-r*2.6} ${r*1.8} 0z" fill="${col}" stroke="${OL}" stroke-width="2"/>
        <clipPath id="${cid}"><circle cx="${p[0]}" cy="${p[1]-r*2.3}" r="${r}"/></clipPath>
        <g clip-path="url(#${cid})">${portrait(q.key,'neutral',r*2).replace('<svg ',`<svg x="${p[0]-r}" y="${p[1]-r*3.3}" `)}</g>
        <circle cx="${p[0]}" cy="${p[1]-r*2.3}" r="${r}" fill="none" stroke="${k===1?'#f3d083':OL}" stroke-width="${k===1?3:2}"/>
        ${k===1?`<g transform="translate(${p[0]+r*.7} ${p[1]-r*3.6})"><circle r="13" fill="#f5ead2" stroke="${OL}" stroke-width="2"/><g transform="translate(-8 -8)" color="#2a1830">${icon('chat',16).replace('<svg ','<svg x="0" y="0" ')}</g></g>`:''}
      </g>`});
    });
  }
  drawables.sort((a,b)=>a.d-b.d).forEach(o=>s+=o.svg);
  // light sources: candles, lanterns, the cauldron
  S.layout.forEach(it=>{ const [w,h]=fdims(it); const c=P(it.x+w/2,it.y+h/2);
    if(it.type==='candles') s+=`<ellipse class="glow" cx="${c[0]}" cy="${c[1]-34}" rx="90" ry="70" fill="url(#lampG)" pointer-events="none"/>`;
    if(it.type==='lantern') s+=`<ellipse class="glow" cx="${c[0]+12}" cy="${c[1]-30}" rx="80" ry="64" fill="url(#lampG)" pointer-events="none" style="animation-delay:-1.1s"/>`;
    if(it.type==='cauldron') s+=`<ellipse class="glow" cx="${c[0]}" cy="${c[1]-30}" rx="110" ry="80" fill="url(#magicG)" pointer-events="none" style="animation-delay:-.6s"/><ellipse class="glow" cx="${c[0]}" cy="${c[1]+4}" rx="70" ry="30" fill="url(#lampG)" pointer-events="none"/>`;
    if(it.type==='window') s+=`<ellipse class="glow" cx="${c[0]}" cy="${c[1]-30}" rx="70" ry="50" fill="url(#magicG)" pointer-events="none" style="animation-delay:-2s"/>`; });
  s+=`<rect x="-200" y="-200" width="1200" height="1100" fill="url(#moonWash)" pointer-events="none"/>`;
  s+=`<g id="ghost" class="ghost"></g></g>`;
  const st=shopStats();
  const tools = `<div class="roomtools">
    <span class="stat">${icon('bottle',16)}Display <b>${st.display}</b></span>
    <span class="stat">${icon('sparkle',16)}Charm <b>${st.charm}</b></span>
    <span class="stat">${icon('heart',16)}Comfort <b>${st.comfort}</b></span>
    <span class="stat">${icon('shop',16)}Traffic <b>${st.traffic}</b></span>
    <span style="flex:1"></span>
    <button class="btn ${S.editMode?'gold':''}" data-act="toggleEdit">${icon(S.editMode?'check':'hammer',18)}${S.editMode?'Done arranging':'Arrange shop'}</button></div>`;
  return tools + `<svg class="iso" viewBox="0 0 874 798" preserveAspectRatio="xMidYMin meet" id="isoSvg">${s}</svg>` + (S.editMode? buildHTML() : dialogHTML());
}
function dialogHTML(){
  const q=curCust();
  if(!q){ const allDone = S.queue.length && S.queue.every(x=>x.done);
    return `<div class="dialog paper"><div class="bigpor" style="display:grid;place-items:center;background:#3a2a54">${catArt(130,true)}</div><div style="flex:1;display:flex;flex-direction:column">
      <div class="who"><b>The shop is quiet</b></div><p class="say">${allDone?'Everyone has been served. Close the shop when you\'re ready; tomorrow\'s Gazette will report what your potions did out there.':'Pick a customer on the left to hear what they need.'}</p>
      <div class="acts">${allDone?`<button class="btn gold" data-act="closeShop">${icon('moon',18)}Close shop for the night</button>`:''}<button class="btn" data-act="go" data-to="brew">${icon('flask',18)}Experiment at the cauldron</button></div></div></div>`; }
  const r=custReq(q); const nm=custName(q);
  if(q.done){ const res=q.result;
    if(res.declined) return `<div class="dialog paper"><div class="bigpor">${portrait(q.key,'sad',150)}</div><div style="flex:1;display:flex;flex-direction:column"><div class="who"><b>${esc(nm)}</b><span>${esc(custRole(q))}</span></div><p class="say">"Ah well. Maybe another time." ${q.kind==='cast'?`<br><span class="muted" style="color:#6a5a7a">${first(nm)} will come back another day.</span>`:''}</p><div class="acts">${nextBtn()}</div></div></div>`;
    const O=OUTCOME[res.ev.outcome];
    return `<div class="dialog paper"><div class="bigpor">${portrait(q.key,O.expr,150)}</div><div style="flex:1;display:flex;flex-direction:column">
      <div class="who"><b>${esc(nm)}</b><span>${esc(custRole(q))}</span><span class="res-tag" style="background:${O.col};color:#2a1830">${O.label}</span></div>
      <p class="say">${esc(res.reaction)}</p>
      <div class="flowrow" style="font-size:14px;font-weight:800;color:#5a4a6a">${bottleArt(res.bottle,res.col,34)}<span class="hand" style="font-size:22px;color:#2a1830">${esc(res.potion)}</span> · sold for ${res.price} crowns · ${Math.round(res.ev.match*100)}% fit${res.ev.violated?' · <span style="color:#a8323a">boundary crossed</span>':''}</div>
      <div class="acts"><span class="muted" style="color:#6a5a7a;font-weight:800;font-size:13px;align-self:center">${icon('news',15)} Tomorrow's Gazette will report how it went.</span><span style="flex:1"></span>${nextBtn()}</div></div></div>`;
  }
  const potion = S.selPotion && getPotion(S.selPotion);
  const hag = q.haggle;
  let acts;
  if(hag && hag.counter!=null){ acts = `<span class="talk" style="font-size:19px;color:#2a1830;align-self:center">"${hag.counter} crowns? That's what I can manage."</span><button class="btn green" data-act="acceptCounter">${icon('check',18)}Accept ${hag.counter}</button><button class="btn ghost" data-act="cancelHaggle" style="color:#2a1830">Keep thinking</button>`; }
  else acts = `${!q.asked?`<button class="btn" data-act="ask">${icon('question',18)}Ask a question</button>`:''}
    <button class="btn" data-act="brewFor">${icon('flask',18)}Brew for ${esc(first(nm))}</button>
    <button class="btn green" data-act="offer" ${potion&&potion.qty>0?'':'disabled'}>${icon('hand',18)}${potion?`Offer ${esc(potion.name)}`:'Pick a potion to offer'}</button>
    <span style="flex:1"></span><button class="btn ghost sm" data-act="decline" style="color:#5a4a6a">Politely decline</button>`;
  return `<div class="dialog paper"><div class="bigpor">${portrait(q.key,q.asked?'think':'neutral',150)}</div><div style="flex:1;display:flex;flex-direction:column;min-width:0">
    <div class="who"><b>${esc(nm)}</b><span>${esc(custRole(q))}</span></div>
    <p class="say">${q.kind==='cast'&&CAST[q.key].note?'':'"'}${esc(r.say)}${q.kind==='cast'&&CAST[q.key].note?'':'"'}</p>
    ${q.asked?`<div class="clue">${icon('eye',15)} ${esc(r.clue)}</div>`:''}
    <div class="flowrow" style="margin-bottom:8px"><span class="bound">${icon('x',13)}Boundary: ${esc(r.boundSay)}</span><span class="needchip">${icon('coin',13)}${purse(r.budget)}</span>${q.haggle&&q.haggle.refused?`<span class="bound">${icon('coin',13)}"Too rich for me."</span>`:''}</div>
    <div class="acts">${acts}</div></div></div>`;
}
function nextBtn(){ const nx=S.queue.find(x=>!x.done); return nx?`<button class="btn gold" data-act="selCust" data-id="${nx.id}">${icon('arrowR',18)}Next: ${esc(first(custName(nx)))}</button>`:`<button class="btn gold" data-act="closeShop">${icon('moon',18)}Close shop</button>`; }

function sideHTML(){
  const total=S.stock.reduce((a,p)=>a+p.qty,0);
  const list = S.stock.map(p=>`<button class="pcard ${S.selPotion===p.uid?'sel':''}" data-act="selPotion" data-uid="${p.uid}" title="${esc(p.name)}"><span class="q">×${p.qty}</span>${bottleArt(p.bottle,p.col,52,{sparkle:p.formula})}<span class="stars">${stars(p.stars)}</span><span class="nm">${esc(p.name)}</span></button>`).join('');
  const p = S.selPotion && getPotion(S.selPotion);
  return `<h2 class="ptitle">${icon('bottle',20)}Shelf Stock <span class="muted" style="font-family:var(--f-body);font-size:13px;margin-left:auto">${total} bottles</span></h2>
   ${S.stock.length?`<div class="stocklist">${list}</div>`:`<div class="empty" style="min-height:120px">Your shelves are bare.<br>Brew something at the cauldron.</div>`}
   <div class="paper detail">${p?potionDetail(p):`<div class="empty" style="color:#7a6a5a;flex:1">Select a bottle to read its label, check what it really does, and set a price.</div>`}</div>`;
}
function potionDetail(p){
  const q=curCust(); const forCust = q && !q.done;
  const price=priceFor(p); const r = forCust?custReq(q):null;
  const others=p.expressed.filter(b=>b!==p.main&&b!==p.sec);
  return `<div class="head">${bottleArt(p.bottle,p.col,84,{sparkle:p.formula})}<div><h3>${esc(p.name)}</h3><div style="color:#b8862a;font-size:16px">${stars(p.stars)}</div><div style="font-size:12px;font-weight:800;color:#7a6a5a">${p.formula?'Known formula':'Experimental brew'} · ${p.qty} in stock</div></div></div>
   <p class="fx">${esc(p.fx)}</p>
   <div class="flowrow">${behChipDark(p.main,'main')}${p.sec?behChipDark(p.sec,'sec'):''}${others.map(b=>behChipDark(b)).join('')}</div>
   ${(p.quirkObjs||[]).map(qq=>`<div class="quirk"><b>Quirk: ${esc(qq.name)}</b>Drinker is ${esc(qq.fx)}.</div>`).join('')}
   ${p.sides.length?`<div class="side-eff">${icon('scroll',14)} Label notes: ${p.sides.map(s=>esc(s.replace(/\.$/,''))).join('; ')}.</div>`:''}
   <div class="statbars"><span>Stability</span><div class="bar"><i style="width:${p.stab}%;background:${p.stab>60?'#6fbf5a':p.stab>35?'#e8b84a':'#e86a5a'}"></i></div></div>
   <div class="price"><div class="row"><span style="font-weight:900;font-size:13px;color:#5a4a6a">PRICE</span><input type="range" id="priceRange" min="1" max="${Math.max(10,Math.round(p.value*2.5))}" value="${price}" data-uid="${p.uid}" aria-label="Price in crowns"><span class="val" id="priceVal">${price}c</span></div>
    <div style="font-size:12px;font-weight:800;color:#7a6a5a">Suggested ${p.value}c · ${forCust?`${esc(first(custName(q)))} has a ${purse(r.budget).toLowerCase()}`:'Walk-ins buy displayed stock at closing'}</div></div>
   <div class="flowrow">${forCust?`<button class="btn green" style="flex:1;font-size:17px;padding:12px" data-act="offer">${icon('check',20)}Offer to ${esc(first(custName(q)))}</button>`:''}<button class="btn ghost sm" style="color:#7a4a3a" data-act="pour" data-uid="${p.uid}">${icon('trash',14)}Pour away</button></div>`;
}

/* ---- build mode ---- */
function buildHTML(){
  const cat = Object.keys(FURN).filter(k=>!FURN[k].fixed);
  const cards = cat.map(k=>{ const F=FURN[k]; const stored=S.storage[k]||0; const it={id:'pv',type:k,x:0,y:0,rot:0}; const [w,h]=[F.w,F.h];
    const ox=32*h+4, oy=F.ht+6; const vw=32*(w+h)+8, vh=16*(w+h)+F.ht+12;
    return `<button class="fcard ${S.placing&&!S.placing.moveId&&S.placing.type===k?'on':''}" data-act="pickFurn" data-type="${k}" title="${esc(F.desc)}">
      <svg width="64" height="46" viewBox="0 0 ${vw} ${vh}">${furnitureSVG(it,ox,oy,{})}</svg><span class="fn">${F.n}</span><span class="fc">${stored?`${stored} stored`:`${icon('coin',12)}${F.cost}`}</span></button>`; }).join('');
  const sel = S.editSel && S.layout.find(l=>l.id===S.editSel);
  const why = S.placing ? `Placing <b>${FURN[S.placing.type].n}</b>. Click a floor tile. Green means it fits.` : sel ? `<b>${FURN[sel.type].n}</b>: ${FURN[sel.type].desc}` : 'Pick furniture below, or click something in the shop to move it.';
  return `<div class="build panel"><div class="minimap">${minimap()}</div>
    <div class="furngrid">${cards}</div>
    <div class="edittools"><div class="why">${why}</div>
      <div class="flowrow"><button class="btn sm" data-act="rotateFurn" ${S.placing||sel?'':'disabled'}>${icon('rotate',15)}Rotate</button>
      <button class="btn sm" data-act="moveFurn" ${sel&&!FURN[sel.type].fixed?'':'disabled'}>${icon('move',15)}Move</button>
      <button class="btn sm red" data-act="storeFurn" ${sel&&!FURN[sel.type].fixed?'':'disabled'}>${icon('trash',15)}Store</button></div>
      <div class="flowrow"><button class="btn sm" data-act="undo" ${S.undo.length?'':'disabled'}>${icon('undo',15)}Undo</button><button class="btn sm ghost" data-act="cancelPlace" ${S.placing?'':'disabled'}>Cancel</button><button class="btn sm green" data-act="toggleEdit">${icon('check',15)}Done</button></div></div></div>`;
}
function minimap(){
  const cw=18.8, ch=18.8; let s=`<svg viewBox="0 0 ${GRID_W*cw} ${GRID_H*ch}" width="100%" height="150">`;
  for(let y=0;y<GRID_H;y++)for(let x=0;x<GRID_W;x++) s+=`<rect x="${x*cw}" y="${y*ch}" width="${cw}" height="${ch}" fill="none" stroke="#c8b08a" stroke-width=".6"/>`;
  S.layout.forEach(it=>{ const [w,h]=fdims(it); const F=FURN[it.type]; s+=`<rect x="${it.x*cw+1}" y="${it.y*ch+1}" width="${w*cw-2}" height="${h*ch-2}" rx="3" fill="${F.flat?F.col+'80':F.col}" stroke="#2a1830" stroke-width="${S.editSel===it.id?2.5:1}"/>`; });
  s+=`<rect x="${DOOR.x*cw+2}" y="${DOOR.y*ch+2}" width="${cw-4}" height="${ch-4}" fill="none" stroke="#c8504a" stroke-width="2" stroke-dasharray="3 2"/><text x="${DOOR.x*cw+cw+3}" y="${DOOR.y*ch+13}" font-size="10" font-weight="800" fill="#a8323a">door</text>`;
  return s+'</svg>';
}
function ghostAt(x,y){
  if(!S.placing) return;
  const it={id:'ghost',type:S.placing.type,x,y,rot:S.placing.rot};
  if(S3D.ok){ S3D.ghost(it.type,x,y,it.rot,canPlace(S.layout,it,S.placing.moveId).ok); return; }
  const g=$('#ghost'); if(!g) return;
  const ok=canPlace(S.layout,it,S.placing.moveId).ok; const [w,h]=fdims(it); const ox=348, oy=192;
  const A=isoPt(x,y,ox,oy),B=isoPt(x+w,y,ox,oy),C=isoPt(x+w,y+h,ox,oy),D=isoPt(x,y+h,ox,oy);
  g.innerHTML = `<polygon points="${[A,B,C,D].map(p=>p.join(',')).join(' ')}" fill="${ok?'#8fdc6f':'#ff8a80'}" fill-opacity=".45" stroke="${ok?'#8fdc6f':'#ff8a80'}" stroke-width="3"/>`+furnitureSVG(it,ox,oy,{});
}

/* ================= BREW ================= */
function renderBrew(v){
  v.innerHTML = `<div class="grid3" style="grid-template-columns:360px minmax(0,1fr) 390px;grid-template-rows:minmax(0,1fr) 236px">
   <section class="panel lib" style="grid-row:1/3">${libHTML()}</section>
   <section class="panel ${S3D.ok?'bare':''}" style="padding:0" id="cauldronPanel">${cauldronHTML()}</section>
   <section style="display:flex;flex-direction:column;gap:14px;min-height:0">${briefHTML()}</section>
   <section class="paper notebook" style="grid-column:2/4">${notebookHTML()}</section></div>`;
}
let libFilter = {q:'', mode:'all', beh:''};
function libHTML(){
  const knownBeh = [...new Set(Object.values(S.known).flat())].sort();
  return `<h2 class="ptitle">${icon('leaf',20)}Ingredients</h2>
   <label class="search">${icon('search',18)}<input id="libSearch" placeholder="Search ingredients or behaviours" value="${esc(libFilter.q)}" aria-label="Search ingredients"></label>
   <div class="filters">${[['all','All'],['owned','In stock'],['rare','Rare']].map(([k,l])=>`<button class="${libFilter.mode===k?'on':''}" data-act="libMode" data-mode="${k}">${l}</button>`).join('')}
    ${knownBeh.length?`<select id="behSel" aria-label="Filter by behaviour" style="background:rgba(0,0,0,.3);color:var(--text);border:1.5px solid rgba(243,208,131,.3);border-radius:999px;padding:3px 8px;font-weight:800;font-size:11.5px;font-family:var(--f-body)"><option value="">Any behaviour</option>${knownBeh.map(b=>`<option ${libFilter.beh===b?'selected':''} value="${b}">${b}</option>`).join('')}</select>`:''}</div>
   <div class="inggrid" id="ingGrid">${ingCards()}</div>
   <div class="inginfo" id="ingInfo">${ingInfo(S.lastIng)}</div>`;
}
function ingCards(){
  const q=libFilter.q.toLowerCase();
  return ING.filter(i=>{ if(libFilter.mode==='owned' && !(S.inv[i.id]>0)) return false; if(libFilter.mode==='rare' && !['R','V'].includes(i.r)) return false;
    if(libFilter.beh && !known(i.id).includes(libFilter.beh)) return false;
    if(q && !(i.n.toLowerCase().includes(q) || known(i.id).some(b=>b.toLowerCase().includes(q)) || i.src.toLowerCase().includes(q))) return false; return true; })
   .map(i=>`<button class="icard ${avail(i.id)>0?'':'out'}" data-act="addIng" data-id="${i.id}" data-hover-ing="${i.id}" aria-label="Add ${esc(i.n)}"><span class="rd" style="background:${RARITY[i.r].c}"></span><span class="cnt">${avail(i.id)}</span>${ingArt(i.id,46)}<span class="nm">${esc(i.n)}</span></button>`).join('') || '<div class="empty" style="grid-column:1/-1">Nothing matches.</div>';
}
function ingInfo(id){ const i=INGM[id]; const k=known(id);
  return `${ingArt(id,68)}<div style="min-width:0"><h4>${esc(i.n)}</h4><p>${esc(i.react)}</p><div class="flowrow">${i.b.map(b=>k.includes(b)?behChip(b):`<span class="chip unknown">???</span>`).join('')}<span class="chip" style="color:${RARITY[i.r].c}">${RARITY[i.r].n}</span></div></div>`; }

const RUNES_FN=()=>`<div class="runes"><svg viewBox="0 0 300 300" aria-hidden="true"><circle cx="150" cy="150" r="140" fill="none" stroke="#f3d083" stroke-width="2" stroke-dasharray="2 6"/><circle cx="150" cy="150" r="126" fill="none" stroke="#c08cff" stroke-width="1.5"/><circle cx="150" cy="150" r="104" fill="none" stroke="#f3d083" stroke-width="1" opacity=".6"/>${Array.from({length:12},(_,i)=>{const a=i*Math.PI/6, x=150+Math.cos(a)*115, y=150+Math.sin(a)*115; return `<path d="M${x} ${y-6}l3 6-3 6-3-6z" fill="#f3d083" transform="rotate(${i*30} ${x} ${y})"/>`;}).join('')}<path d="M150 24L259 213H41z" fill="none" stroke="#c08cff" stroke-width="1" opacity=".6"/><path d="M150 276L41 87h218z" fill="none" stroke="#c08cff" stroke-width="1" opacity=".6"/></svg></div>`;
function cauldronHTML(){
  const RUNES=S3D.ok?'':RUNES_FN();
  const ids = S.brew.order.filter(id=>S.brew.mix[id]>0);
  const pv = preview(S.brew.mix);
  const col = ids.length? mixHex(ids.map(i=>INGM[i].p[0]), ids.map(i=>S.brew.mix[i])) : '#6a4a9a';
  const units = ids.reduce((a,i)=>a+S.brew.mix[i],0);
  const show = ids.slice(0,11); const more = ids.length-show.length;
  const n=show.length; const cx=310, cy=200;
  const tokens = show.map((id,i)=>{ let ang;
      if(n<=7) ang = Math.PI*(1.05 + (n===1?0.45:(0.9*i/(n-1)))) ; else ang = -Math.PI/2 + i*(2*Math.PI/n);
      const rx = n<=7?255:262, ry = n<=7?170:178; const x=cx+Math.cos(ang)*rx, y=cy+Math.sin(ang)*ry + (n<=7?40:10);
      return `<div class="token ${S.brew.justAdded===id?'pop':''}" style="left:${x}px;top:${y}px" data-hover-ing="${id}"><div class="tk">${ingArt(id,52)}<button class="x" data-act="rmIng" data-id="${id}" aria-label="Remove ${esc(INGM[id].n)}">${icon('x',12)}</button></div>
        <div class="qty"><button data-act="decIng" data-id="${id}" aria-label="Less">${icon('minus',12)}</button><span>${S.brew.mix[id]}</span><button data-act="addIng" data-id="${id}" aria-label="More">${icon('plus',12)}</button></div></div>`; }).join('');
  S.brew.justAdded=null;
  const caul = `<svg class="cauldron" width="340" height="300" viewBox="0 0 340 300" aria-hidden="true">
    <defs><radialGradient id="liq" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="${shade(col,0.45)}"/><stop offset="1" stop-color="${col}"/></radialGradient>
    <radialGradient id="fire" cx="50%" cy="60%" r="60%"><stop offset="0" stop-color="#fff0a0"/><stop offset=".5" stop-color="#ff9a3a"/><stop offset="1" stop-color="#ff5a2a" stop-opacity="0"/></radialGradient>
    <linearGradient id="iron" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a2238"/><stop offset=".45" stop-color="#4a3f5f"/><stop offset="1" stop-color="#1f1a2a"/></linearGradient></defs>
    <ellipse cx="170" cy="272" rx="120" ry="22" fill="url(#fire)" class="flick"/>
    ${S.brew.heat!=='cold'?[0,1,2,3,4].map(i=>`<path d="M${110+i*30} 280c-10-14 0-26 6-${30+(i%2)*12} 6 ${14+(i%2)*10} 16 22 6 ${30+(i%2)*12}z" fill="${['#ffb84a','#ff7a3a','#ffd06a'][i%3]}" class="flick" opacity="${S.brew.heat==='flare'?1:S.brew.heat==='boil'?.95:.75}" transform="scale(1 ${S.brew.heat==='gentle'?.6:S.brew.heat==='simmer'?.8:1.1})" transform-origin="170 280"/>`).join(''):`<path d="M120 276h100" stroke="#9ed8f2" stroke-width="5" stroke-dasharray="6 8" stroke-linecap="round"/>`}
    <path d="M40 98c-14 80 20 162 130 162s144-82 130-162z" fill="url(#iron)" stroke="${OL}" stroke-width="4"/>
    <path d="M60 130c0 60 30 100 110 106" stroke="#fff" stroke-opacity=".12" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M150 170c-14-10-10-30 10-32-10 8-6 22 10 26-6 4-14 8-20 6z" fill="#e8c06a"/>
    ${[[110,160],[230,176],[200,214],[96,206]].map(([x,y])=>`<path d="M${x} ${y-7}l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#e8c06a"/>`).join('')}
    <path d="M30 108c-14 0-20 14-10 22M310 108c14 0 20 14 10 22" stroke="${OL}" stroke-width="7" fill="none"/>
    <ellipse cx="170" cy="98" rx="134" ry="34" fill="#3f3354" stroke="${OL}" stroke-width="4"/>
    <ellipse cx="170" cy="100" rx="116" ry="25" fill="url(#liq)"/>
    ${ids.length?[[120,96],[200,104],[160,92],[236,96],[96,104]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${4+i%3*2}" fill="#fff" opacity=".45" class="bub ${i%2?'b2':''}"/>`).join(''):''}
    <path d="M${150} 70c-16-20 14-28 0-56M${196} 66c-12-16 12-22 0-44" stroke="${shade(col,0.3)}" stroke-width="10" fill="none" opacity="${ids.length?.35:.12}" stroke-linecap="round" class="steam"/>
  </svg>`;
  return `<div class="cauldron-wrap" style="height:100%">
    <div class="murmur ${pv.tone}">${esc(pv.text)}</div>
    <div class="cauldron-stage" id="cstage">${S3D.ok?'<div class="cauldron ph"></div>':RUNES+caul}${tokens}${more>0?`<button class="overflow-chip" data-act="viewAll">+${more} more additions · view all</button>`:''}
      ${!ids.length?`<div class="talk" style="position:absolute;left:0;right:0;top:24px;text-align:center;font-size:20px;color:var(--muted)">Click ingredients on the left to drop them in.<br>Add as many as you like.</div>`:''}</div>
    <div class="controls">
      <div><div class="lab">${icon('sun',14)}Heat</div><div class="seg" role="group" aria-label="Heat">${HEATS.map(h=>`<button class="${S.brew.heat===h.id?'on':''}" data-act="heat" data-v="${h.id}" title="${h.n}">${h.s}</button>`).join('')}</div></div>
      <div class="brewside"><button class="btn round" data-act="clearBrew" title="Empty the cauldron" aria-label="Empty the cauldron">${icon('refresh',20)}</button>
        <button class="brewbtn" data-act="brew" ${ids.length?'':'disabled'}><span>${icon('flask',34)}Brew</span></button>
        <button class="btn round" data-act="pinch" title="Mallow's random pinch" aria-label="Add a random ingredient">${icon('dice',20)}</button></div>
      <div><div class="lab">${icon('refresh',14)}Stir</div><div class="seg" role="group" aria-label="Stir">${STIRS.map(h=>`<button class="${S.brew.stir===h.id?'on':''}" data-act="stir" data-v="${h.id}" title="${h.n}">${h.s}</button>`).join('')}</div></div>
    </div>
    <div class="muted" style="font-size:12.5px;font-weight:800">${units} unit${units===1?'':'s'} · makes ${ids.length?clamp(1+Math.floor(units/2),1,5):0} bottle${units>1?'s':''} · ${ids.length} ingredient${ids.length===1?'':'s'}</div>
  </div>`;
}
function briefHTML(){
  const q = S.brewFor && S.queue.find(x=>x.id===S.brewFor && !x.done);
  let card;
  if(q){ const r=custReq(q);
    card = `<div class="paper brief" style="position:relative"><div class="eyebrow" style="color:#7a6a5a">Brewing for</div>
      <div class="top"><div class="por">${portrait(q.key,q.asked?'think':'neutral',92)}</div><div><b class="n">${esc(custName(q))}</b><q>${esc(r.say.length>150?r.say.slice(0,148)+'…':r.say)}</q></div></div>
      ${q.asked?`<div class="clue talk" style="font-size:16px;color:#5a3f8a;background:rgba(122,90,184,.12);border-left:4px solid #7a5ab8;padding:5px 10px;border-radius:6px">${esc(r.clue)}</div>`:`<button class="btn sm" data-act="ask" style="align-self:flex-start">${icon('question',14)}Ask a question first</button>`}
      <div class="flowrow"><span class="bound">${icon('x',13)}${esc(r.boundSay)}</span><span class="needchip">${icon('coin',13)}${purse(r.budget)}</span></div></div>`;
  } else card = `<div class="paper brief"><div class="eyebrow" style="color:#7a6a5a">Free experiment</div><div class="top"><div class="por" style="display:grid;place-items:center;background:#3a2a54">${icon('book',40)}</div><div><b class="n">Marigold's note</b><q>A recipe is a conversation, dear. If the mixture stops surprising you, perhaps you have stopped listening.</q></div></div>
    <div class="talk" style="font-size:15px;color:#5a4a6a">Ingredients that share a behaviour make it the potion's main effect. Clashing behaviours turn into quirks.</div></div>`;
  return card + `<div class="panel" style="padding:14px;flex:1;min-height:0;display:flex;flex-direction:column"><h2 class="ptitle" style="font-size:19px">${icon('bottle',18)}Shelf <span class="muted" style="font-family:var(--f-body);font-size:12px;margin-left:auto">${S.stock.length} kinds</span></h2>
    <div class="shelfrow">${S.stock.length?S.stock.map(p=>`<button class="pcard" data-act="toShelf" data-uid="${p.uid}" title="${esc(p.name)}"><span class="q">×${p.qty}</span>${bottleArt(p.bottle,p.col,48)}<span class="stars">${stars(p.stars)}</span><span class="nm" style="font-size:15px">${esc(p.name)}</span></button>`).join(''):'<div class="empty" style="width:100%">Nothing bottled yet.</div>'}</div></div>`;
}
function notebookHTML(){
  const ex = S.experiments.slice(0,5);
  const rum = FORMULAS.filter(f=>!S.formulas[f.id]).sort((a,b)=>(siblings(b).some(g=>S.formulas[g.id])?1:0)-(siblings(a).some(g=>S.formulas[g.id])?1:0) || ((hashStr(a.id+S.day)%7)-(hashStr(b.id+S.day)%7))).slice(0,4);
  const exRows = ex.map((e,i)=>`<button class="exrow" style="background:none;border-left:0;border-right:0;border-top:0;width:100%;text-align:left" data-act="loadExp" data-i="${i}" title="Load this recipe into the cauldron">${Object.keys(e.mix).map((id,j)=>`${j?'<span class="plus">+</span>':''}${ingArt(id,28)}`).join('')}<span class="plus">→</span>${bottleArt(e.bottle,e.col,30)}<span class="nm">${esc(e.name)}</span><span style="font-family:var(--f-body);font-size:11px;font-weight:800;color:#8f6a3a">${e.heat}/${e.stir}</span></button>`).join('');
  return `<div class="pg"><h4>${icon('book',18)}Experiment log</h4>${exRows||'<div class="talk" style="color:#7a6a5a;font-size:17px">Nothing tried yet. Every brew is recorded here; click one to load it again.</div>'}</div>
   <div class="pg"><h4>${icon('scroll',18)}Marigold's rumours <span style="margin-left:auto;font-family:var(--f-body);font-size:12px;color:#8f6a3a">${Object.keys(S.formulas).length}/${FORMULAS.length} formulae</span></h4>${rum.map(f=>`<div class="rumour">${esc(f.hint)}</div>`).join('')}</div>`;
}

/* ================= INGREDIENT DATABASE ================= */
let dbQ='';
function renderIngredients(v){
  const kTot = ING.reduce((a,i)=>a+known(i.id).length,0);
  v.innerHTML = `<div class="grid3" style="grid-template-columns:1fr 540px">
   <section class="panel" style="padding:16px;display:flex;flex-direction:column;gap:12px;min-height:0">
     <div class="flowrow"><h2 class="ptitle">${icon('leaf',20)}Ingredient Database</h2><span class="muted" style="font-weight:800;font-size:13px">${kTot} of ${ING.length*3} hidden behaviours discovered</span><span style="flex:1"></span>
     <label class="search" style="width:320px">${icon('search',18)}<input id="dbSearch" placeholder="Search by name or behaviour" value="${esc(dbQ)}" aria-label="Search the database"></label></div>
     <div class="dbgrid" id="dbGrid">${dbCards()}</div></section>
   <section class="paper" style="padding:22px 26px;overflow:auto;display:flex;flex-direction:column;gap:12px">${dbDetail(S.ingSel)}</section></div>`;
}
function dbCards(){ const q=dbQ.toLowerCase();
  return ING.filter(i=>!q||i.n.toLowerCase().includes(q)||known(i.id).some(b=>b.toLowerCase().includes(q))).map(i=>{ const k=known(i.id);
   return `<button class="dbcard ${S.ingSel===i.id?'sel':''}" data-act="selIng" data-id="${i.id}">${ingArt(i.id,62)}<span class="nm">${esc(i.n)}</span>
    <div class="dots" title="${k.length}/3 behaviours known">${i.b.map(b=>k.includes(b)?`<i style="background:${BEH[b].c};border-color:${BEH[b].c}"></i>`:'<i></i>').join('')}</div>
    <span style="font-size:11px;font-weight:800;color:${RARITY[i.r].c}">${RARITY[i.r].n} · owned ${S.inv[i.id]||0}</span></button>`; }).join(''); }
function dbDetail(id){ const i=INGM[id]; const k=known(id);
  const inF = FORMULAS.filter(f=>f.core.includes(id) && S.formulas[f.id]);
  const used = S.experiments.filter(e=>e.mix[id]).length;
  return `<div style="display:flex;gap:18px;align-items:center"><div class="bigart">${ingArt(id,160)}</div><div>
    <div class="eyebrow" style="color:${shade(RARITY[i.r].c,-0.4)}">${RARITY[i.r].n} · ${i.cost} crowns</div>
    <h2 class="hand" style="font-size:52px;margin:0;line-height:.9;color:#2a1830">${esc(i.n)}</h2>
    <p class="talk" style="font-size:18px;margin:6px 0;color:#4a3a5a">${esc(i.src)}</p>
    <div style="font-size:13px;font-weight:800;color:#7a6a5a">Owned: ${S.inv[id]||0} · Used in ${used} experiment${used===1?'':'s'}</div></div></div>
   <div><div class="eyebrow" style="color:#7a6a5a;margin-bottom:6px">Observed reaction</div><div class="margin">${esc(i.react)}</div></div>
   <div><div class="eyebrow" style="color:#7a6a5a;margin-bottom:8px">Hidden behaviours</div>
    ${i.b.map(b=>k.includes(b)?`<div style="display:flex;gap:10px;align-items:center;padding:7px 0;border-bottom:1.5px dashed rgba(143,106,58,.35)">${behChipDark(b)}<span class="talk" style="font-size:17px;color:#3a2a4a">${esc(cap(BEH[b].fx))}.</span></div>`:
      `<div style="display:flex;gap:10px;align-items:center;padding:7px 0;border-bottom:1.5px dashed rgba(143,106,58,.35)"><span class="chip unknown" style="color:#8f7a9a">${icon('question',13)}???</span><span class="talk" style="font-size:17px;color:#8f7a9a;flex:1">Undiscovered. Brew with it, or study it.</span></div>`).join('')}
    ${k.length<3?`<button class="btn gold" style="margin-top:10px" data-act="study" data-id="${id}" ${S.notes>0?'':'disabled'}>${icon('scroll',16)}Study it (1 research note)</button>`:''}</div>
   ${inF.length?`<div><div class="eyebrow" style="color:#7a6a5a;margin-bottom:6px">In known formulae</div><div class="flowrow">${inF.map(f=>`<span class="hand" style="font-size:22px;color:#4a2a7a;padding:2px 10px;border:1.5px solid #b88af0;border-radius:10px">${esc(f.n)}</span>`).join('')}</div></div>`:''}
   <div class="flowrow" style="margin-top:auto"><button class="btn" data-act="go" data-to="market">${icon('cart',16)}Buy more at the market</button><button class="btn" data-act="quickAdd" data-id="${id}" ${(S.inv[id]||0)>0?'':'disabled'}>${icon('flask',16)}Add to cauldron</button></div>`;
}

/* ================= RECIPE BOOK ================= */
function renderRecipes(v){
  const kn = FORMULAS.filter(f=>S.formulas[f.id]); const rum = FORMULAS.filter(f=>!S.formulas[f.id]);
  const tab = S.bookTab;
  let list='', detail='';
  if(tab==='known'){ list = kn.map(f=>`<button class="bentry ${S.bookSel===f.id?'sel':''}" data-act="bookSel" data-id="${f.id}">${bottleArt(f.bottle,f.col,40)}<div><span class="nm">${esc(S.formulas[f.id].custom||f.n)}</span><small>${BEH[f.main].adj} · ${f.heat||f.stir?esc(techLabel(f)):'first brewed day '+S.formulas[f.id].day}</small></div></button>`).join('') || `<div class="margin">No formulae yet. Rumours hint at what Marigold knew. Try combining their ingredients.</div>`;
    const f = FORMM[S.bookSel] && S.formulas[S.bookSel] ? FORMM[S.bookSel] : kn[0];
    if(f) detail = formulaPage(f); }
  if(tab==='exp'){ list = S.experiments.slice(0,40).map((e,i)=>`<button class="bentry ${S.bookSel==='e'+i?'sel':''}" data-act="bookSel" data-id="e${i}">${bottleArt(e.bottle,e.col,40)}<div><span class="nm">${esc(e.name)}</span><small>Day ${e.day} · ${Object.keys(e.mix).length} ingredients · ${e.quirks.length?'quirky':e.murky?'murky':'stable-ish'}</small></div></button>`).join('') || `<div class="margin">Your experiments will be written here, mistakes and all. The Guild likes honest records.</div>`;
    const idx = S.bookSel && S.bookSel[0]==='e' ? +S.bookSel.slice(1) : 0; const e=S.experiments[idx]; if(e) detail = expPage(e, idx); }
  if(tab==='rum'){ list = rum.map(f=>`<button class="bentry ${S.bookSel===f.id?'sel':''}" data-act="bookSel" data-id="${f.id}"><div style="width:40px;height:40px;display:grid;place-items:center;border:2px dashed #8f6a3a;border-radius:10px;font-family:var(--f-hand);font-size:26px;color:#8f6a3a">?</div><div><span class="nm">${siblings(f).some(g=>S.formulas[g.id])?'A variation…':'An unnamed rumour'}</span><small>${f.heat||f.stir?'needs a particular fire':f.core.length+' ingredients, by the look of it'}</small></div></button>`).join('') || `<div class="margin">You've found every formula Marigold knew. She'd be insufferably proud.</div>`;
    const f = FORMM[S.bookSel] && !S.formulas[S.bookSel] ? FORMM[S.bookSel] : rum[0]; if(f) detail = rumourPage(f); }
  v.innerHTML = `<div class="book"><div class="page"><h2>Marigold's Recipe Journal</h2>
     <div class="btabs">${[['known',`Known formulae (${kn.length}/${FORMULAS.length})`],['exp',`Experiments (${S.experiments.length})`],['rum',`Rumours (${rum.length})`]].map(([k,l])=>`<button class="${tab===k?'on':''}" data-act="bookTab" data-tab="${k}">${l}</button>`).join('')}</div>
     <div style="display:flex;flex-direction:column">${list}</div></div>
   <div class="page">${detail||'<div class="margin" style="margin-top:40px">Pick an entry on the left.</div>'}</div></div>`;
}
function recipeLine(mix, bottle, col){ return `<div class="recipeLine">${Object.entries(mix).map(([id,q],j)=>`${j?'<span class="op">+</span>':''}<span class="ingmini">${ingArt(id,48)}${esc(INGM[id].n)}${q>1?` ×${q}`:''}</span>`).join('')}<span class="op">→</span>${bottleArt(bottle,col,56)}</div>`; }
function formulaPage(f){ const rec=S.formulas[f.id];
  return `<div style="display:flex;gap:16px;align-items:center">${bottleArt(f.bottle,f.col,120,{sparkle:true})}<div><div class="eyebrow" style="color:#7a6a5a">Known formula · ${BEH[f.main].adj} / ${BEH[f.sec].adj}</div><h2 class="hand" style="font-family:var(--f-hand);font-size:48px;line-height:.9;color:#2a1830">${esc(rec.custom||f.n)}</h2>${rec.custom?`<small style="font-weight:800;color:#7a6a5a">Marigold called it ${esc(f.n)}</small>`:''}</div></div>
   ${recipeLine(Object.fromEntries(f.core.map(c=>[c,1])), f.bottle, f.col)}
   <div class="tech">${icon('sun',15)}<b>Technique</b> ${esc(techLabel(f))}</div>
   <p class="talk" style="font-size:20px;margin:0">${esc(f.fx)}</p>
   <div class="flowrow">${behChipDark(f.main,'main')}${behChipDark(f.sec,'sec')}</div>
   ${siblings(f).length>1?`<div class="variants"><div class="eyebrow" style="color:#7a6a5a">Same pot, different fire</div>${siblings(f).filter(g=>g!==f).map(g=>S.formulas[g.id]?`<button class="vrow" data-act="bookSel" data-id="${g.id}">${bottleArt(g.bottle,g.col,30)}<span class="hand">${esc(S.formulas[g.id].custom||g.n)}</span><small>${esc(techLabel(g))}</small></button>`:`<div class="vrow unk"><span class="q">?</span><span class="hand">Something ${BEH[g.main].adj.toLowerCase()}…</span><small>try a different fire or spoon</small></div>`).join('')}</div>`:''}
   <div class="side-eff">${icon('scroll',14)} Disclosed side effect: ${esc(f.side)}</div>
   
   <div class="talk" style="color:#7a6a5a">First brewed on day ${rec.day}${rec.for?` for ${esc(rec.for)}`:''}.</div>
   <div><button class="btn gold" data-act="brewFormula" data-id="${f.id}">${icon('flask',16)}Load into cauldron</button></div>`; }
function expPage(e, i){ return `<div style="display:flex;gap:16px;align-items:center">${bottleArt(e.bottle,e.col,110)}<div><div class="eyebrow" style="color:#7a6a5a">Experiment · Day ${e.day} · ${e.heat} heat, ${e.stir} stir</div><h2 class="hand" style="font-family:var(--f-hand);font-size:44px;line-height:.9;color:#2a1830">${esc(e.name)}</h2><div style="color:#b8862a">${stars(e.stars)}</div></div></div>
   ${recipeLine(e.mix, e.bottle, e.col)}
   <p class="talk" style="font-size:19px;margin:0">${esc(e.fx)}</p>
   <div class="flowrow">${behChipDark(e.main,'main')}${e.sec?behChipDark(e.sec,'sec'):''}${e.expressed.filter(b=>b!==e.main&&b!==e.sec).map(b=>behChipDark(b)).join('')}</div>
   ${e.quirkObjs.map(q=>`<div class="quirk"><b>Quirk: ${esc(q.name)}</b>${esc(cap(q.fx))}.</div>`).join('')}
   <div><button class="btn gold" data-act="loadExp" data-i="${i}">${icon('flask',16)}Load into cauldron</button></div>`; }
function rumourPage(f){ const sibKnown=siblings(f).some(g=>S.formulas[g.id]);
  return `<div class="eyebrow" style="color:#7a6a5a">Rumour${sibKnown?' · a variation on something you know':''}</div><h2 class="hand" style="font-family:var(--f-hand);font-size:44px;color:#2a1830;line-height:.9">Something ${BEH[f.main].adj.toLowerCase()}…</h2>
   <div class="margin" style="font-size:26px">${esc(f.hint)}</div>
   <div class="recipeLine">${f.core.map((c,j)=>`${j?'<span class="op">+</span>':''}<span class="ingmini">${sibKnown?ingArt(c,48)+esc(INGM[c].n):'<span style="width:48px;height:48px;border:2px dashed #8f6a3a;border-radius:12px;display:grid;place-items:center;font-size:24px;color:#8f6a3a">?</span>???'}</span>`).join('')}<span class="op">→</span><span style="opacity:.35;filter:grayscale(1)">${bottleArt(f.bottle,f.col,56)}</span></div>
   <div class="tech">${icon('sun',15)}<b>Technique</b> ${f.heat||f.stir?'A particular fire and spoon. The note above is your clue.':'Any fire, any stir'}</div>
   <p class="talk" style="font-size:18px;color:#5a4a6a">${sibKnown?'You already know these ingredients. Change the heat and the stirring, and the same pot becomes something else.':'When the right ingredients share a pot, the cauldron recognises the formula, whatever else you add.'}</p>
   ${sibKnown?`<div><button class="btn gold" data-act="brewFormula" data-id="${siblings(f).find(g=>S.formulas[g.id]).id}">${icon('flask',16)}Load the ingredients</button></div>`:''}`; }

/* ================= MARKET ================= */
const NESSA_TIPS = ['Cold infusions keep a brew calm. Quirks hate the cold.','A rolling boil makes everything louder, quirks included.','Stir counter-clockwise if the second thing in the pot is the one you want.','If nothing in the pot shares a behaviour, you get murk. Find pairs.','A quick flare can shake loose something hidden in an ingredient. Unpredictably.','The same three ingredients can make three different potions. Change the fire. Change the spoon.','Counter-clockwise undoes things, dear. Try it on a recipe you already know.','Alternate your stirring to settle a fussy brew.','Mushrooms that grow under bridges tend to be quiet things.','Customers say one thing and need another. Ask them a question before you brew.'];
function unlocked(i){ if(i.r==='R') return S.rep>=30||S.day>=3; if(i.r==='V') return S.rep>=50||S.day>=5; return true; }
function renderMarket(v){
  v.innerHTML = `<div class="grid3" style="grid-template-columns:380px 1fr">
   <section class="panel" style="padding:20px;display:flex;flex-direction:column;gap:14px;align-items:center;text-align:center">
     <h2 class="ptitle">${icon('cart',20)}Nettle &amp; Stem</h2>
     <div style="width:200px;height:200px;border-radius:24px;overflow:hidden;border:3px solid #2a1830;box-shadow:0 0 0 2.5px var(--brass)">${portrait('nessa','happy',200)}</div>
     <div><div class="hand" style="font-size:38px;color:var(--cream);line-height:1">Nessa Nettle</div><div class="muted" style="font-weight:800;font-size:13px">Hedge witch &amp; greenhouse keeper</div></div>
     <div class="paper talk" style="padding:14px 16px;font-size:19px;line-height:1.25;text-align:left">"${esc(NESSA_TIPS[(S.day+S.experiments.length)%NESSA_TIPS.length])}"</div>
     <div class="muted" style="font-size:13px;font-weight:700;line-height:1.4">Rare stock unlocks at reputation 30 or day 3.<br>Very rare at reputation 50 or day 5.</div>
     <div class="pill" style="margin-top:auto"><span class="cn">${icon('coin',18)}</span><div><small>Your purse</small>${S.crowns}</div></div>
   </section>
   <section class="panel" style="padding:16px;display:flex;flex-direction:column;gap:12px;min-height:0"><h2 class="ptitle">${icon('leaf',20)}Today's stall</h2>
    <div class="mgrid">${ING.map(i=>{ const ok=unlocked(i); return `<div class="mcard ${ok?'':'locked'}">${ingArt(i.id,56)}<div style="flex:1;min-width:0"><div class="nm">${esc(i.n)}</div><div style="font-size:11.5px;font-weight:800;color:${RARITY[i.r].c}">${RARITY[i.r].n} · owned ${S.inv[i.id]||0}</div>
      <div class="flowrow" style="margin-top:5px">${ok?`<button class="btn sm gold" data-act="buy" data-id="${i.id}" data-n="1" ${S.crowns>=i.cost?'':'disabled'}>${icon('coin',13)}${i.cost}</button><button class="btn sm" data-act="buy" data-id="${i.id}" data-n="5" ${S.crowns>=i.cost*5?'':'disabled'}>×5 · ${i.cost*5}</button>`:`<span class="chip" style="color:var(--muted)">${icon('lock',12)}Locked</span>`}</div></div></div>`; }).join('')}</div></section></div>`;
}

/* ================= LEDGER ================= */
function renderLedger(v){
  const custSales = S.sales.filter(s=>s.who!=='Walk-in');
  const rev = S.sales.reduce((a,s)=>a+s.price,0);
  const days = [...S.dayStats]; const todayRev = S.sales.filter(s=>s.day===S.day).reduce((a,s)=>a+s.price,0);
  days.push({day:S.day, revenue:todayRev, live:true});
  const maxR = Math.max(40,...days.map(d=>d.revenue));
  const W=420,H=200, bw = Math.min(46,(W-40)/days.length-10);
  const ticks=[0,.5,1].map(t=>Math.round(maxR*t));
  const bars = days.map((d,i)=>{ const x=40+i*((W-40)/days.length)+((W-40)/days.length-bw)/2; const h=(d.revenue/maxR)*(H-44); return `<rect x="${x}" y="${H-20-h}" width="${bw}" height="${h}" rx="6" fill="${d.live?'#f3d083':'#b98af5'}" opacity="${d.live?.95:.9}"/><text x="${x+bw/2}" y="${H-5}" text-anchor="middle" font-size="11" fill="#b4a3cf">D${d.day}</text>${d.revenue?`<text x="${x+bw/2}" y="${H-26-h}" text-anchor="middle" font-size="11" fill="#f1e8ff">${d.revenue}</text>`:''}`; }).join('');
  const chart1 = `<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%">${ticks.map(t=>{ const y=H-20-(t/maxR)*(H-44); return `<line x1="36" x2="${W}" y1="${y}" y2="${y}" stroke="#fff" stroke-opacity=".08"/><text x="30" y="${y+4}" text-anchor="end" font-size="10" fill="#b4a3cf">${t}</text>`; }).join('')}${bars}</svg>`;
  // outcomes donut
  const oc = {delight:0,good:0,meh:0,baffled:0,oops:0}; custSales.forEach(s=>{ if(oc[s.outcome]!=null) oc[s.outcome]++; });
  const tot = Object.values(oc).reduce((a,b)=>a+b,0); let acc=0; const R=62, C=2*Math.PI*R;
  const ocCol = {delight:'#8fdc6f',good:'#c8e68a',meh:'#f3d083',baffled:'#f0a07a',oops:'#ff8a80'};
  const arcs = tot? Object.entries(oc).filter(([k,v])=>v).map(([k,v])=>{ const len=v/tot*C; const s=`<circle r="${R}" cx="80" cy="80" fill="none" stroke="${ocCol[k]}" stroke-width="22" stroke-dasharray="${len-2} ${C-len+2}" stroke-dashoffset="${-acc}" transform="rotate(-90 80 80)"/>`; acc+=len; return s; }).join('') : `<circle r="${R}" cx="80" cy="80" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width="22"/>`;
  const donut = `<div style="display:flex;gap:14px;align-items:center"><svg width="160" height="160" viewBox="0 0 160 160">${arcs}<text x="80" y="78" text-anchor="middle" font-size="30" fill="#f1e8ff" font-weight="900">${tot}</text><text x="80" y="98" text-anchor="middle" font-size="11" fill="#b4a3cf">orders</text></svg>
    <div style="display:flex;flex-direction:column;gap:6px">${Object.entries(oc).map(([k,v])=>`<div style="display:flex;gap:8px;align-items:center;font-size:13px;font-weight:800"><i style="width:12px;height:12px;border-radius:3px;background:${ocCol[k]}"></i>${OUTCOME[k].label}<b style="margin-left:auto;padding-left:12px;color:var(--brass2)">${v}</b></div>`).join('')}</div></div>`;
  // best sellers
  const by={}; S.sales.forEach(s=>{ by[s.name]=(by[s.name]||0)+s.price; }); const best=Object.entries(by).sort((a,b)=>b[1]-a[1]).slice(0,5); const bmax=Math.max(1,...best.map(b=>b[1]));
  const bestHTML = best.length? best.map(([n,v])=>`<div style="margin-bottom:9px"><div style="display:flex;justify-content:space-between;font-size:13px;font-weight:800"><span class="hand" style="font-size:19px">${esc(n)}</span><span style="color:var(--brass2)">${v}c</span></div><div class="bar" style="background:rgba(255,255,255,.08);border-color:transparent"><i style="width:${v/bmax*100}%;background:linear-gradient(90deg,#b98af5,#f3d083)"></i></div></div>`).join('') : '<div class="empty">No sales yet.</div>';
  const rel = Object.keys(CAST).map(k=>{ const c=S.cast[k]; const met = c.stage>0 || c.memories.length; return `<div class="relrow"><div class="por">${met?portrait(k,'neutral',44):`<div style="width:44px;height:44px;background:#2a1e3c;display:grid;place-items:center;color:var(--muted)">?</div>`}</div><div style="flex:1;min-width:0"><div class="nm">${met?esc(CAST[k].n):'Not yet met'}</div><div class="muted" style="font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${met?esc(c.memories[c.memories.length-1]||CAST[k].role):'…'}</div></div>${met?hearts(clamp(Math.round(c.rapport),0,5)):''}<span class="muted" style="font-size:11px;font-weight:900;width:52px;text-align:right">${met?`${c.stage}/${CAST[k].stages.length}`:''}</span></div>`; }).join('');
  const gz = [...S.gazette].reverse().slice(0,14).map(g=>`<div class="gzmini"><small>Gloambridge Gazette · Day ${g.day+1}</small>${esc(g.head)}</div>`).join('') || '<div class="empty">The Gazette hasn\'t mentioned you. Yet.</div>';
  v.innerHTML = `<div class="ledger">
    <div style="grid-column:1/4;display:grid;grid-template-columns:repeat(5,1fr);gap:14px">
      ${[['coin','Crowns',S.crowns],['star','Reputation',S.rep],['bottle','Potions sold',S.sales.length],['book','Formulae found',`${Object.keys(S.formulas).length}/${FORMULAS.length}`],['coin','Lifetime revenue',rev]].map(([ic,l,v2])=>`<div class="panel kpitile"><span class="pill" style="height:44px;padding:0 6px;border-radius:50%"><span class="cn ${ic==='star'?'rep':ic==='book'?'note':''}">${icon(ic,18)}</span></span><div><b>${v2}</b><span>${l}</span></div></div>`).join('')}</div>
    <div class="panel chartbox"><h2 class="ptitle" style="font-size:19px">${icon('chart',18)}Revenue by day</h2><div style="flex:1;min-height:0">${chart1}</div></div>
    <div class="panel chartbox"><h2 class="ptitle" style="font-size:19px">${icon('heart',18)}Customer outcomes</h2>${donut}</div>
    <div class="panel chartbox"><h2 class="ptitle" style="font-size:19px">${icon('bottle',18)}Best sellers</h2><div style="overflow:auto">${bestHTML}</div></div>
    <div class="panel chartbox"><h2 class="ptitle" style="font-size:19px">${icon('heart',18)}Regulars</h2><div style="overflow:auto">${rel}</div></div>
    <div class="panel chartbox" style="grid-column:2/4"><h2 class="ptitle" style="font-size:19px">${icon('news',18)}Consequences, as reported</h2><div style="overflow:auto;column-count:2;column-gap:14px">${gz}</div></div>
  </div>`;
}

/* ================= MODALS ================= */
function modal(html){ const m=$('#modal'); m.innerHTML=html; m.classList.add('show'); decorate(m); }
function closeModal(){ const m=$('#modal'); m.classList.remove('show'); m.innerHTML=''; }

function showIntro(){
  modal(`<div class="mbox paper" style="width:780px;padding:30px 36px;transform:rotate(-.4deg)">
    <div class="eyebrow" style="color:#8f6a3a">A letter, found under the cauldron</div>
    <h2 class="hand" style="font-size:54px;margin:4px 0 6px;color:#2a1830;line-height:.9">Dearest whoever-you-are,</h2>
    <p class="hand" style="font-size:27px;line-height:1.15;color:#3a2a5a;margin:0 0 10px">The Crooked Cork is yours now. I never did write down what half the ingredients do. Neither will you, at first. That is the fun of it. Customers will tell you what they want. Listen for what they need. And do try not to make anyone invisible by accident. Again. <br><span style="float:right">— Aunt Marigold</span></p>
    <div style="clear:both;display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:18px 0 8px">
     ${[['chat','Listen','Customers ask for one thing. Ask a question to hear what they actually need, and note their boundary.'],['flask','Brew anything','Drop in any number of ingredients. Shared hidden behaviours become effects; clashing ones become quirks.'],['coin','Price it','Set a fair price. Gouging costs reputation; walk-ins buy shelf stock at closing.'],['news','Read the Gazette','Each morning the town paper reports what your potions actually did out there.']].map(([ic,t,d])=>`<div style="padding:12px;border-radius:12px;background:rgba(42,24,48,.06);border:1.5px solid rgba(143,106,58,.4)"><div style="color:#7a4ad0">${icon(ic,24)}</div><b style="display:block;margin:4px 0;font-size:15px">${t}</b><span style="font-size:13px;color:#5a4a6a;line-height:1.3;display:block">${d}</span></div>`).join('')}</div>
    <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:12px"><button class="btn green" style="font-size:18px;padding:12px 22px" data-act="startGame">${icon('shop',20)}Open the shop</button></div></div>`);
}

function showResult(res, info){
  const forQ = S.brewFor && S.queue.find(x=>x.id===S.brewFor && !x.done);
  const others = res.expressed.filter(b=>b!==res.main&&b!==res.sec);
  const disc = info.newRev.map(([id,b])=>`<span class="d">${ingArt(id,20)}${esc(INGM[id].n)} → ${b}</span>`).join('');
  const badge = info.newFormula?'<span class="newbadge">New formula!</span>':info.newQuirk?'<span class="newbadge" style="background:#b8509a">New quirk!</span>':info.newExp?'<span class="newbadge" style="background:#4f8f6a">New experiment</span>':'<span class="newbadge" style="background:#8f7a5a">Brewed before</span>';
  const canName = info.newFormula || info.newExp;
  modal(`<div class="mbox paper result" style="--rc:${res.col}">
    <div class="stagebg"><div class="rays"></div>${bottleArt(res.bottle,res.col,200,{sparkle:!!res.formula})}<div style="position:absolute;bottom:16px;left:0;right:0;text-align:center;font-weight:900;color:#fff;text-shadow:0 2px 4px #000;font-size:15px">×${res.bottles} bottles · worth ~${res.value}c each</div></div>
    <div class="body">${badge}
      ${canName?`<label class="eyebrow" for="nameIn" style="color:#8f6a3a">Name your brew</label><input id="nameIn" class="namein" value="${esc(res.name)}" maxlength="36">`:`<h2>${esc(res.name)}</h2>`}
      <div style="color:#b8862a;font-size:20px">${stars(res.stars)} <span style="font-size:13px;font-weight:800;color:#7a6a5a">${res.formula?'Recognised formula':res.murky?'Murky: nothing agreed':'Emergent effect'}</span></div>
      <p class="talk" style="font-size:20px;margin:0;color:#2a1830;line-height:1.25">${esc(res.fx)}</p>
      <div class="flowrow">${behChipDark(res.main,'main')}${res.sec?behChipDark(res.sec,'sec'):''}${others.map(b=>behChipDark(b)).join('')}</div>
      ${res.quirkObjs.map(q=>`<div class="quirk"><b>Quirk: ${esc(q.name)}</b>${esc(q.a)} and ${esc(q.b)} refused to cancel out. The drinker will be ${esc(q.fx)}.</div>`).join('')}
      ${res.wild?`<div class="side-eff">${icon('sparkle',14)} The quick flare shook loose ${res.wild}.</div>`:''}
      ${res.sides.length?`<div class="side-eff">${icon('scroll',14)} Label notes: ${res.sides.map(s=>esc(s.replace(/\.$/,''))).join('; ')}.</div>`:''}
      <div class="statbars"><span>Stability</span><div class="bar"><i style="width:${res.stab}%;background:${res.stab>60?'#6fbf5a':res.stab>35?'#e8b84a':'#e86a5a'}"></i></div></div>
      ${disc?`<div class="disc">Learned: ${disc}</div>`:''}
      ${info.notes?`<div class="disc"><span class="d" style="background:rgba(63,174,154,.2);border-color:#3fae9a;color:#0f3a32">${icon('scroll',14)}+${info.notes} research note${info.notes>1?'s':''}</span></div>`:''}
      <div class="flowrow" style="margin-top:auto;padding-top:8px">
       ${forQ?`<button class="btn green" data-act="resultOffer" data-uid="${info.uid}">${icon('hand',18)}Take it to ${esc(first(custName(forQ)))}</button>`:''}
       <button class="btn gold" data-act="resultKeep">${icon('bottle',18)}Put on the shelf</button>
       <button class="btn ghost sm" style="color:#7a4a3a" data-act="resultPour" data-uid="${info.uid}">${icon('trash',14)}Pour away</button></div>
    </div></div>`);
}

function showGazette(stories, day){
  if(!stories.length) stories=[{head:'Quiet day in Gloambridge. Nothing exploded, floated, or forgot itself.',quote:'"Suspicious," said a local goose.',who:null,tone:'odd'}];
  modal(`<div class="mbox gazette">
   <div class="mast"><div style="border:0;margin:0;padding:0"><span>Est. 1342</span><span>Price: one (1) acorn</span></div><h2>The Gloambridge Gazette</h2><div><span>Day ${day} edition</span><span>Weather: ${['drizzle, faintly purple','clear, suspiciously','foggy, with opinions','windy toward the bakery'][day%4]}</span><span>${stories.length} report${stories.length>1?'s':''} from the Crooked Cork</span></div></div>
   <div class="cols">${stories.map(s=>`<div class="story">${s.who?`<div class="sp">${portrait(s.who,s.tone==='good'?'happy':s.tone==='bad'?'shock':'think',58)}</div>`:''}<div><div class="tag" style="color:${s.tone==='good'?'#3a6a1a':s.tone==='bad'?'#a8323a':'#6a3a8a'}">${s.tone==='good'?'Local success':s.tone==='bad'?'Incident report':'Odd news'}${s.potion?` · ${esc(s.potion)}`:''}</div><h3>${esc(s.head)}</h3>${s.quote?`<p>"${esc(s.quote.replace(/^"|"$/g,''))}"</p>`:''}</div></div>`).join('')}</div>
   <div style="display:flex;justify-content:flex-end;margin-top:6px"><button class="btn gold" data-act="closeGazette">${icon('shop',18)}Open the shop</button></div></div>`);
}

function showSummary(sum){
  modal(`<div class="mbox paper summary"><div class="eyebrow" style="color:#8f6a3a">Closing time · Day ${S.day}</div><h2 class="hand" style="font-size:50px;margin:0;color:#2a1830;line-height:.9">The day's ledger</h2>
   <div class="kpis">${[['Orders',sum.orders+'c'],['Walk-in sales',sum.walk+'c'],['Upkeep','−'+UPKEEP+'c'],['Reputation',`${S.rep}`]].map(([l,v])=>`<div class="kpi"><b>${v}</b><span>${l}</span></div>`).join('')}</div>
   <p class="talk" style="font-size:19px;color:#3a2a4a;margin:4px 0 10px">${sum.walkN} curious walk-in${sum.walkN===1?'':'s'} browsed your display; ${sum.walkSold.length} bought something${sum.walkSold.length?`: ${sum.walkSold.map(s=>esc(s.name)).slice(0,4).join(', ')}${sum.walkSold.length>4?'…':''}`:'.'}</p>
   ${sum.left?`<p class="talk" style="font-size:17px;color:#8f4a3a;margin:0 0 10px">${sum.left} customer${sum.left>1?'s':''} left without being served.</p>`:''}
   <div class="margin" style="font-size:22px">${S.day>=7&&!S.weekDone?'This is the end of your first week. Tomorrow\'s Gazette will have a few things to say.':'Mallow curls up on the warm shelf. The cauldron ticks as it cools.'}</div>
   <div style="display:flex;justify-content:flex-end;margin-top:14px"><button class="btn gold" data-act="sleep">${icon('moon',18)}Sleep until morning</button></div></div>`);
}

function showWeekEnd(){
  const met = Object.keys(CAST).filter(k=>S.cast[k].stage>0);
  const finished = Object.keys(CAST).filter(k=>S.cast[k].stage>=CAST[k].stages.length);
  const good = S.sales.filter(s=>s.outcome==='delight'||s.outcome==='good').length, oops = S.sales.filter(s=>s.outcome==='oops').length;
  const title = S.rep>=60?'The Beloved Apothecary':S.rep>=35?'The Charmingly Unreliable':oops>good?'The Notorious Crooked Cork':'A Shop Finding Its Feet';
  modal(`<div class="mbox paper summary" style="width:820px"><div class="eyebrow" style="color:#8f6a3a">One week in Gloambridge</div><h2 class="hand" style="font-size:56px;margin:0;color:#2a1830;line-height:.9">${title}</h2>
   <div class="kpis">${[['Crowns',S.crowns],['Reputation',S.rep],['Formulae',Object.keys(S.formulas).length+'/'+FORMULAS.length],['Disasters',oops]].map(([l,v])=>`<div class="kpi"><b>${v}</b><span>${l}</span></div>`).join('')}</div>
   <p class="talk" style="font-size:20px;color:#3a2a4a;line-height:1.3">You met ${met.length} regulars and saw ${finished.length} of their stories through. ${good} customer${good===1?'':'s'} walked out happy; ${oops} walked out floating, glowing, forgotten or otherwise altered. Ada Quill has filed her report. Somewhere under the old market, the Meridian Regulator hums a little less evenly than before.</p>
   <div class="margin">"Not bad, dear. Not reliable, but not bad." (found in Marigold's handwriting, on a page that was blank yesterday)</div>
   <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:14px"><button class="btn gold" data-act="closeWeek">${icon('shop',18)}Keep the shop open</button></div></div>`);
}

function volRow(id,label,ic,val){ return `<label class="vol" for="${id}"><span>${icon(ic,18)}${label}</span><input type="range" id="${id}" min="0" max="100" value="${Math.round(val*100)}" data-vol="${id.replace('vol-','')}"><b>${Math.round(val*100)}</b></label>`; }
function showMenu(){
  const st=S.settings; const onTitle=document.body.classList.contains('on-title');
  modal(`<div class="mbox panel settings"><h2 class="ptitle">${icon('gear',20)}Settings</h2>
    <div class="vols">${volRow('vol-music','Music','sparkle',st.music??.55)}${volRow('vol-sfx','Effects','flask',st.sfx??.8)}${volRow('vol-amb','Shop ambience','moon',st.amb??.5)}</div>
    <button class="btn" data-act="sound">${icon(st.sound!==false?'sound':'mute',18)}All sound: ${st.sound!==false?'on':'off'}</button>
    <p class="muted" style="margin:0;font-size:13px;line-height:1.4">Your shop saves automatically in this browser.</p>
    <div class="flowrow">${onTitle?'':`<button class="btn" data-act="toTitle">${icon('home',18)}Title screen</button>`}<button class="btn" data-act="howto">${icon('question',18)}How to play</button><button class="btn red" data-act="askReset">${icon('refresh',18)}New shop</button></div>
    <button class="btn gold" data-act="closeModal" style="align-self:flex-end">${icon('check',18)}Done</button></div>`);
}
function showViewAll(){
  const ids=S.brew.order.filter(id=>S.brew.mix[id]>0);
  modal(`<div class="mbox panel" style="width:640px;padding:22px;display:flex;flex-direction:column;gap:12px"><h2 class="ptitle">${icon('flask',20)}Everything in the cauldron</h2>
   <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;max-height:520px;overflow:auto">${ids.map(id=>`<div class="mcard">${ingArt(id,44)}<div style="flex:1"><div class="nm" style="font-size:20px">${esc(INGM[id].n)}</div></div><div class="token" style="position:static;transform:none;width:auto;height:auto"><div class="qty" style="margin:0"><button data-act="decIng" data-id="${id}">${icon('minus',12)}</button><span>${S.brew.mix[id]}</span><button data-act="addIng" data-id="${id}">${icon('plus',12)}</button></div></div><button class="btn sm ghost" data-act="rmIng" data-id="${id}">${icon('x',13)}</button></div>`).join('')}</div>
   <button class="btn gold" data-act="closeModal" style="align-self:flex-end">Done</button></div>`);
}

/* ================= ACTIONS ================= */
const ACT = {
  go(d){ S.screen=d.to; if(d.to!=='shop') S.editMode=false; SND.play('page'); render(); },
  sound(){ S.settings.sound=S.settings.sound===false; SND.apply(); render(); if($('#modal').classList.contains('show')) showMenu(); },
  settings(){ showMenu(); },
  toTitle(){ closeModal(); S.screen='shop'; render(); showTitle(); S3D.sync(); },
  titlePlay(){ SND.start(); SND.play('chime'); hideTitle(); S3D.sync(); if(!S.seenIntro) setTimeout(showIntro,350); },
  titleNew(){ SND.start(); ACT.askReset(); },
  titleHow(){ SND.start(); showIntro(); },
  menu(){ showMenu(); }, closeModal(){ closeModal(); render(); }, howto(){ showIntro(); },
  askReset(){ modal(`<div class="mbox paper" style="width:460px;padding:24px"><h2 class="hand" style="font-size:40px;margin:0;color:#2a1830">Start over?</h2><p class="talk" style="font-size:18px">This clears your shop, journal and every discovery. Mallow will pretend not to notice.</p><div class="flowrow" style="justify-content:flex-end"><button class="btn ghost" style="color:#2a1830" data-act="closeModal">Keep my shop</button><button class="btn red" data-act="reset">Start a new shop</button></div></div>`); },
  reset(){ S=newState(); buildQueue(); closeModal(); hideTitle(); S3D.sync(); Object.keys(shownVals).forEach(k=>delete shownVals[k]); render(); showIntro(); },
  startGame(){ S.seenIntro=true; closeModal(); SND.start(); SND.play('sting'); FX.flash(PAL.brassHi,.35); render(); },
  selCust(d){ S.selCust=d.id; if(S.screen!=='shop'){ S.screen='shop'; } S.editMode=false; SND.play('click'); render(); },
  selPotion(d){ const u=+d.uid; S.selPotion = S.selPotion===u? null : u; SND.play('click'); render(); },
  toShelf(d){ S.selPotion=+d.uid; S.screen='shop'; render(); },
  ask(){ const q = S.screen==='brew' ? S.queue.find(x=>x.id===S.brewFor) : curCust(); if(!q) return; q.asked=true; SND.play('page'); render(); },
  brewFor(){ const q=curCust(); if(!q) return; S.brewFor=q.id; S.screen='brew'; render(); },
  decline(){ const q=curCust(); if(!q) return; q.done=true; q.result={declined:true}; if(q.kind==='guest'){} render(); },
  offer(){ const q=curCust(); const p=S.selPotion&&getPotion(S.selPotion); if(!q||!p||q.done) return; const r=custReq(q); const price=priceFor(p);
    const lim = q.key==='fennick'?1.6:1.35;
    if(price<=r.budget) return completeSale(q,p,price);
    if(price<=r.budget*lim){ q.haggle={counter:r.budget}; SND.play('click'); return render(); }
    q.haggle={refused:true}; SND.play('oops'); toast(`${first(custName(q))} winces at ${price} crowns. Try a lower price.`,true,'coin'); render(); },
  acceptCounter(){ const q=curCust(); const p=S.selPotion&&getPotion(S.selPotion); if(!q||!p) return; const c=q.haggle.counter; q.haggle=null; completeSale(q,p,c); },
  cancelHaggle(){ const q=curCust(); if(q) q.haggle=null; render(); },
  pour(d){ S.stock=S.stock.filter(p=>p.uid!==+d.uid && p.uid!==d.uid); S.selPotion=null; render(); },
  closeShop(){ const left=S.queue.filter(q=>!q.done).length;
    if(left && !ACT._confirmClose){ ACT._confirmClose=true; modal(`<div class="mbox paper" style="width:480px;padding:24px"><h2 class="hand" style="font-size:40px;margin:0;color:#2a1830">Close early?</h2><p class="talk" style="font-size:18px">${left} customer${left>1?'s are':' is'} still waiting. Walk-ins will leave; regulars will come back another day.</p><div class="flowrow" style="justify-content:flex-end"><button class="btn ghost" style="color:#2a1830" data-act="cancelClose">Keep serving</button><button class="btn gold" data-act="closeShop">${icon('moon',16)}Close anyway</button></div></div>`); return; }
    ACT._confirmClose=false; endDay(); },
  cancelClose(){ ACT._confirmClose=false; closeModal(); },
  sleep(){ closeModal(); nextDay(); },
  closeGazette(){ closeModal(); if(S.day===8 && !S.weekDone){ S.weekDone=true; save(); showWeekEnd(); } SND.play('chime'); },
  closeWeek(){ closeModal(); render(); },
  // brewing
  addIng(d){ const id=d.id; if(avail(id)<=0){ toast(`Out of ${INGM[id].n}. Nessa sells more at the Market.`,false,'cart'); SND.play('oops'); return; }
    S.brew.mix[id]=(S.brew.mix[id]||0)+1; if(!S.brew.order.includes(id)) S.brew.order.push(id); if(S.brew.mix[id]===1) S.brew.justAdded=id; S.lastIng=id; SND.play('add');
    if(S.screen!=='brew'){ S.screen='brew'; render(); return; }
    refreshBrew(); FX.splash(cauldronPt(), INGM[id].p[0]); const cs=$('#cstage'); if(cs){ cs.classList.remove('plop'); void cs.offsetWidth; cs.classList.add('plop'); } if($('#modal').classList.contains('show')) showViewAll(); },
  quickAdd(d){ ACT.addIng(d); },
  decIng(d){ const id=d.id; if(!S.brew.mix[id]) return; S.brew.mix[id]--; if(!S.brew.mix[id]){ delete S.brew.mix[id]; S.brew.order=S.brew.order.filter(x=>x!==id); } SND.play('click'); refreshBrew(); if($('#modal').classList.contains('show')) showViewAll(); },
  rmIng(d){ delete S.brew.mix[d.id]; S.brew.order=S.brew.order.filter(x=>x!==d.id); SND.play('click'); refreshBrew(); if($('#modal').classList.contains('show')) showViewAll(); },
  clearBrew(){ S.brew.mix={}; S.brew.order=[]; refreshBrew(); },
  heat(d){ S.brew.heat=d.v; SND.play('click'); refreshCauldron(); },
  stir(d){ S.brew.stir=d.v; SND.play('click'); refreshCauldron(); },
  pinch(){ const pool=ING.filter(i=>avail(i.id)>0); if(!pool.length) return toast('The pantry is empty.'); const i=pool[Math.floor(Math.random()*pool.length)]; toast(`Mallow nudges in a pinch of ${i.n}.`,true,'cat'); ACT.addIng({id:i.id}); },
  viewAll(){ showViewAll(); },
  libMode(d){ libFilter.mode=d.mode; $('#ingGrid').innerHTML=ingCards(); document.querySelectorAll('.filters button').forEach(b=>b.classList.toggle('on',b.dataset.mode===d.mode)); },
  loadExp(d){ const e=S.experiments[+d.i]; if(!e) return; loadMix(e.mix, e.heat, e.stir); },
  brewFormula(d){ const f=FORMM[d.id]; const base=siblings(f).find(g=>!g.heat&&!g.stir); loadMix(Object.fromEntries(f.core.map(c=>[c,1])), f.heat||((base&&base!==f)?S.brew.heat:(S.brew.heat)), f.stir||S.brew.stir); },
  brew(){ doBrew(); },
  resultOffer(d){ const nm=$('#nameIn'); applyName(nm&&nm.value); closeModal(); S.selCust=S.brewFor; S.selPotion=+d.uid; S.screen='shop'; render(); },
  resultKeep(){ const nm=$('#nameIn'); applyName(nm&&nm.value); closeModal(); render(); },
  resultPour(d){ S.stock=S.stock.filter(p=>p.uid!==+d.uid); S._lastBrew=null; closeModal(); render(); toast('Poured down the drain. The drain hiccups.',true,'trash'); },
  // database / book / market
  selIng(d){ S.ingSel=d.id; SND.play('click'); render(); },
  study(d){ if(S.notes<1) return; const i=INGM[d.id]; const b=i.b.find(x=>!known(d.id).includes(x)); if(!b) return; S.notes--; (S.known[d.id]=S.known[d.id]||[]).push(b); SND.play('chime'); toast(`Study notes: ${i.n} has ${b}.`,true,'scroll'); render(); },
  bookTab(d){ S.bookTab=d.tab; S.bookSel=null; SND.play('page'); render(); },
  bookSel(d){ S.bookSel=d.id; SND.play('page'); render(); },
  buy(d){ const i=INGM[d.id], n=+d.n, cost=i.cost*n; if(S.crowns<cost) return; const src=document.querySelector(`[data-act="buy"][data-id="${d.id}"]`); const pt=stagePoint(src); S.crowns-=cost; S.inv[d.id]=(S.inv[d.id]||0)+n; SND.play('coin'); FX.emit(pt.x,pt.y,{count:10,type:'star',colors:[PAL.brassHi,INGM[d.id].p[0]],speed:3,life:700,size:4}); toast(`Bought ${n} ${i.n}.`,false,'cart'); render(); },
  // build mode
  toggleEdit(){ S.editMode=!S.editMode; S.placing=null; S.editSel=null; if(S.screen!=='shop') S.screen='shop'; SND.play('click'); render(); },
  pickFurn(d){ const k=d.type; const stored=S.storage[k]||0; if(!stored && S.crowns<FURN[k].cost){ toast(`You need ${FURN[k].cost} crowns for that.`,false,'coin'); return; } S.placing={type:k,rot:0}; S.editSel=null; SND.play('click'); render(); },
  rotateFurn(){ if(S.placing){ S.placing.rot=S.placing.rot?0:1; render(); return; } const it=S.layout.find(l=>l.id===S.editSel); if(!it) return; const t={...it,rot:it.rot?0:1}; const c=canPlace(S.layout,t,it.id); if(!c.ok){ toast(c.why,true,'x'); return; } pushUndo(); it.rot=t.rot; render(); },
  moveFurn(){ const it=S.layout.find(l=>l.id===S.editSel); if(!it) return; S.placing={type:it.type,rot:it.rot,moveId:it.id}; render(); },
  storeFurn(){ const it=S.layout.find(l=>l.id===S.editSel); if(!it||FURN[it.type].fixed) return; pushUndo(); S.layout=S.layout.filter(l=>l!==it); S.storage[it.type]=(S.storage[it.type]||0)+1; S.editSel=null; toast(`${FURN[it.type].n} moved to storage.`); render(); },
  undo(){ const u=S.undo.pop(); if(!u) return; S.layout=u.layout; S.crowns=u.crowns; S.storage=u.storage; S.placing=null; S.editSel=null; render(); },
  cancelPlace(){ S.placing=null; render(); }
};
function pushUndo(){ S.undo.push({layout:JSON.parse(JSON.stringify(S.layout)),crowns:S.crowns,storage:{...S.storage}}); if(S.undo.length>20) S.undo.shift(); }
function applyName(v){ const lb=S._lastBrew; if(!lb||!v) return; v=v.trim().slice(0,36); if(!v) return; const p=getPotion(lb.uid);
  if(lb.formula && S.formulas[lb.formula] && v!==FORMM[lb.formula].n) S.formulas[lb.formula].custom=v;
  if(p) p.name=v; const e=S.experiments.find(x=>x.key===lb.key); if(e) e.name=v; }
function loadMix(mix, heat, stir){
  const missing = Object.entries(mix).filter(([id,q])=>(S.inv[id]||0)<q).map(([id])=>INGM[id].n);
  S.brew.mix={}; S.brew.order=[]; S.brew.heat=heat; S.brew.stir=stir;
  Object.entries(mix).forEach(([id,q])=>{ const n=Math.min(q,S.inv[id]||0); if(n>0){ S.brew.mix[id]=n; S.brew.order.push(id);} });
  S.screen='brew'; render(); if(missing.length) toast(`Short on: ${missing.join(', ')}. Visit the Market.`,false,'cart');
}
function cauldronPt(){ return S3D.ok ? S3D.cauldronPos() : stagePoint($('.cauldron-stage .cauldron'),.5,.4); }
function refreshBrew(){ if(S.screen!=='brew') return; $('#ingGrid').innerHTML=ingCards(); refreshCauldron(); $('#ingInfo').innerHTML=ingInfo(S.lastIng); save(); }
function refreshCauldron(){ const c=$('#cauldronPanel'); if(c) c.innerHTML=cauldronHTML(); S3D.sync(); save(); }

function doBrew(){
  const mix={...S.brew.mix}; if(!Object.keys(mix).length) return;
  const res = resolve(mix, S.brew.heat, S.brew.stir);
  Object.entries(mix).forEach(([id,q])=>S.inv[id]-=q);
  const stage=$('#cstage'); if(stage) stage.classList.add('brewing'); SND.play('bubble'); SND.play('whoosh'); const cpt=cauldronPt(); S3D.brewFx(); FX.emit(cpt.x,cpt.y,{count:40,type:'spark',colors:[res.col,PAL.magic,'#fff'],speed:5,angle:-Math.PI/2,spread:1.2,gravity:-.02,life:1100,size:4});
  document.querySelectorAll('.token').forEach((t,i)=>{ t.style.transition='all .5s ease-in '+(i*0.05)+'s'; t.style.left='310px'; t.style.top='160px'; t.style.opacity='0'; t.style.transform='translate(-50%,-50%) scale(.3)'; });
  setTimeout(()=>{
    const newRev=[]; res.reveals.forEach(([id,b])=>{ const k=(S.known[id]=S.known[id]||[]); if(!k.includes(b)){ k.push(b); newRev.push([id,b]); } });
    const newExp = !S.experiments.find(e=>e.key===res.key);
    const seenQ = new Set(S.experiments.flatMap(e=>e.quirks));
    const newQuirk = res.quirks.some(q=>!seenQ.has(q));
    let notes=0, newFormula=false;
    if(res.formula && !S.formulas[res.formula]){ newFormula=true; const fq=S.brewFor&&S.queue.find(x=>x.id===S.brewFor); S.formulas[res.formula]={day:S.day,for:fq?custName(fq):null}; notes+=2; }
    if(newQuirk) notes+=1;
    S.notes+=notes;
    const expRec = {key:res.key,mix:res.mix,heat:res.heat,stir:res.stir,name:res.name,main:res.main,sec:res.sec,expressed:res.expressed,quirks:res.quirks,quirkObjs:res.quirkObjs,stars:res.stars,col:res.col,bottle:res.bottle,formula:res.formula,murky:res.murky,fx:res.fx,day:S.day};
    if(newExp) S.experiments.unshift(expRec); else { const e=S.experiments.find(x=>x.key===res.key); res.name=e.name; }
    let p = S.stock.find(x=>x.key===res.key);
    if(p) p.qty+=res.bottles; else { p={...res, uid:S.nextUid++, qty:res.bottles, price:null}; delete p.reveals; S.stock.unshift(p); }
    S._lastBrew={uid:p.uid,key:res.key,formula:res.formula};
    S.brew.mix={}; S.brew.order=[];
    render();
    showResult(res,{newRev,newExp,newFormula,newQuirk,notes,uid:p.uid});
    const bp=stagePoint($('.result .stagebg'),.5,.5);
    if(newFormula){ SND.play('sting'); FX.flash(PAL.magic,.6); FX.confetti(bp.x,bp.y-40); FX.burst(bp.x,bp.y); }
    else if(newQuirk){ SND.play('sparkle'); FX.flash('#ff9fc0',.4); FX.burst(bp.x,bp.y,[ '#ff9fc0',PAL.magic,'#fff']); }
    else { SND.play('sparkle'); FX.burst(bp.x,bp.y,[res.col,PAL.brassHi]); }
  }, 1100);
}

function completeSale(q, p, price){
  const ev = evaluate(p,q); const O=OUTCOME[ev.outcome]; const r=custReq(q);
  p.qty--; if(p.qty<=0){ S.stock=S.stock.filter(x=>x!==p); S.selPotion=null; }
  S.crowns+=price; let rep=O.rep; if(price>p.value*1.3) rep-=2; else if(price<=p.value) rep+=1;
  if(q.kind==='cast' && CAST[q.key].stages[q.stage].inspect){ if(S.experiments.length>=3){ rep+=5; toast('Ada Quill flips through your experiment log: "Honest records. Good."',true,'scroll'); } else { rep-=2; toast('Ada Quill frowns at your thin experiment log.',true,'scroll'); } }
  S.rep=clamp(S.rep+rep,0,100);
  const reaction = firstSip(p,q,ev);
  q.done=true; q.haggle=null; q.result={ev,price,potion:p.name,bottle:p.bottle,col:p.col,reaction};
  S.sales.push({day:S.day,name:p.name,price,who:custName(q),outcome:ev.outcome,value:p.value});
  const sale={q,p,ev}; S.pendingGaz.push(headlineFor(sale));
  if(q.kind==='cast'){ const c=S.cast[q.key]; c.rapport=clamp(c.rapport+O.rap+(q.asked?0.5:0),0,5); c.memories.push(`Day ${S.day}: ${p.name}, ${O.label.toLowerCase()}`); c.last=ev.outcome;
    const st=CAST[q.key].stages[q.stage]; c.stage++;
    if(st.gift && (ev.outcome==='delight'||ev.outcome==='good')){ S.inv[st.gift.ing]=(S.inv[st.gift.ing]||0)+st.gift.qty; setTimeout(()=>toast(st.gift.note,true,'heart'),600); } }
  const offerEl=document.querySelector('.dialog [data-act="offer"], .detail [data-act="offer"], [data-act="acceptCounter"]');
  SND.play(ev.outcome==='oops'?'oops':'coin'); coinFly(price, offerEl);
  S3D.react(q.id, (ev.outcome==='delight'||ev.outcome==='good')?'happy':ev.outcome==='oops'?'shock':'meh');
  if(S.brewFor===q.id) S.brewFor=null;
  render();
  const por=$('.dialog .bigpor'); if(por){ const pp=stagePoint(por); if(ev.outcome==='delight'||ev.outcome==='good'){ FX.emit(pp.x,pp.y-40,{count:14,type:'star',colors:['#ff9fc0',PAL.brassHi],speed:3.5,angle:-Math.PI/2,spread:2,gravity:.04,life:900,size:5}); } else if(ev.outcome==='oops'){ FX.emit(pp.x,pp.y,{count:16,type:'puff',colors:['#c8b0e0','#a890c8'],speed:2.4,life:800,size:8,glow:false}); } }
  if(S.queue.every(x=>x.done)) setTimeout(()=>toast('Everyone has been served. Close the shop when you\'re ready.',false,'moon'),900);
}

function endDay(){
  const orders = S.sales.filter(s=>s.day===S.day && s.who!=='Walk-in').reduce((a,s)=>a+s.price,0);
  const left = S.queue.filter(q=>!q.done).length;
  const w = walkIns();
  S.pendingGaz.push(...w.heads);
  S.crowns-=UPKEEP;
  const walk = w.sold.reduce((a,s)=>a+s.price,0);
  S.dayStats.push({day:S.day,revenue:orders+walk,walk:w.sold.length,served:S.queue.filter(q=>q.done&&q.result&&!q.result.declined).length});
  SND.play('chime');
  showSummary({orders,walk,walkN:w.n,walkSold:w.sold,left});
  save();
}
function nextDay(){
  const stories=S.pendingGaz.slice(); S.gazette.push(...stories); S.pendingGaz=[];
  S.day++; S.brewFor=null; S.selPotion=null; buildQueue(); S.screen='shop'; render(); showGazette(stories, S.day); SND.play('page'); SND.play('bell');
}

/* ---------- events ---------- */
function bindEvents(){
  const stage=$('#stage');
  stage.addEventListener('scroll', ()=>{ stage.scrollTop=0; stage.scrollLeft=0; });
  const sceneHit = e => S3D.ok && S.screen==='shop' && !document.body.classList.contains('on-title') && e.target.classList && (e.target.classList.contains('room')||e.target.id==='view'||e.target.classList.contains('grid3'));
  stage.addEventListener('mousemove', e=>{ if(!sceneHit(e)) return; const h=S3D.pick(e)||{}; if(S.editMode&&S.placing){ if(h.tile) ghostAt(h.tile.x,h.tile.y); return; } e.target.style.cursor=(S.editMode?h.furn:(h.cust||h.ftype==='cauldron'))?'pointer':''; });
  stage.addEventListener('click', e=>{
    if(sceneHit(e)){ const h=S3D.pick(e)||{};
      if(S.editMode){ if(S.placing){ if(h.tile) placeAt(h.tile.x,h.tile.y); } else if(h.furn){ S.editSel=h.furn; SND.play('click'); render(); } else if(S.editSel){ S.editSel=null; render(); } }
      else if(h.cust) ACT.selCust({id:h.cust}); else if(h.ftype==='cauldron') ACT.go({to:'brew'});
      return; }
    const tile = e.target.closest('.tile');
    if(tile && S.editMode && S.placing){ placeAt(+tile.dataset.x, +tile.dataset.y); return; }
    const f = e.target.closest('.furn');
    if(f && S.editMode && !e.target.closest('.fcard')){ if(S.placing){ /* click through furniture to tile below */ const t=tileFromPoint(e); if(t) placeAt(t.x,t.y); return; } S.editSel=f.dataset.fid; SND.play('click'); render(); return; }
    const el = e.target.closest('[data-act]'); if(!el) return;
    const fn = ACT[el.dataset.act]; if(fn){ e.preventDefault(); fn(el.dataset); }
  });
  stage.addEventListener('mouseover', e=>{
    const h=e.target.closest('[data-hover-ing]'); if(h && $('#ingInfo') && S.lastIng!==h.dataset.hoverIng){ S.lastIng=h.dataset.hoverIng; $('#ingInfo').innerHTML=ingInfo(S.lastIng); }
    if(S.editMode && S.placing){ const t=e.target.closest('.tile'); if(t) ghostAt(+t.dataset.x,+t.dataset.y); }
  });
  stage.addEventListener('input', e=>{
    if(e.target.dataset && e.target.dataset.vol){ const k=e.target.dataset.vol; S.settings[k]=+e.target.value/100; e.target.nextElementSibling.textContent=e.target.value; SND.start(); SND.apply(); save(); }
    if(e.target.id==='priceRange'){ const p=getPotion(+e.target.dataset.uid); if(p){ p.price=+e.target.value; $('#priceVal').textContent=p.price+'c'; } }
    if(e.target.id==='libSearch'){ libFilter.q=e.target.value; $('#ingGrid').innerHTML=ingCards(); }
    if(e.target.id==='dbSearch'){ dbQ=e.target.value; $('#dbGrid').innerHTML=dbCards(); }
  });
  stage.addEventListener('change', e=>{ if(e.target.id==='behSel'){ libFilter.beh=e.target.value; $('#ingGrid').innerHTML=ingCards(); } if(e.target.id==='priceRange') { save(); const btn=document.querySelector('[data-act="offer"]'); } });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape' && $('#modal').classList.contains('show') && !$('#modal .gazette') && !$('[data-act="startGame"]') && !$('[data-act="sleep"]')) { closeModal(); render(); } });
  window.addEventListener('resize', fit);
}
function tileFromPoint(e){ const svg=$('#isoSvg'); if(!svg) return null; const pt=svg.createSVGPoint(); pt.x=e.clientX; pt.y=e.clientY; const m=svg.getScreenCTM(); if(!m) return null; const p=pt.matrixTransform(m.inverse()); const X=p.x/1.15-348, Y=p.y/1.15-192; const gx=Math.floor((X/32+Y/16)/2), gy=Math.floor((Y/16-X/32)/2); if(gx<0||gy<0||gx>=GRID_W||gy>=GRID_H) return null; return {x:gx,y:gy}; }
function placeAt(x,y){
  const pl=S.placing; const it={id:pl.moveId||('f'+Date.now()),type:pl.type,x,y,rot:pl.rot};
  const c=canPlace(S.layout,it,pl.moveId); if(!c.ok){ toast(c.why,true,'x'); SND.play('oops'); return; }
  pushUndo();
  if(pl.moveId){ const o=S.layout.find(l=>l.id===pl.moveId); Object.assign(o,{x,y,rot:pl.rot}); S.editSel=o.id; }
  else { if(S.storage[pl.type]) S.storage[pl.type]--; else S.crowns-=FURN[pl.type].cost; S.layout.push(it); S.editSel=it.id; }
  S.placing=null; SND.play('thud'); render(); if(S3D.ok){ const pp=S3D.furnPos(pl.moveId||it.id); FX.emit(pp.x,pp.y,{count:12,type:'puff',colors:['#e8d8c0','#c8b090'],speed:1.8,gravity:-.02,life:600,size:8,glow:false}); } else { const fe=document.querySelector(`.furn[data-fid="${pl.moveId||it.id}"]`); if(fe) FX.puff(fe); }
}
function fit(){ const s=Math.min(window.innerWidth/1600, window.innerHeight/900); $('#stage').style.transform=`translate(-50%,-50%) scale(${s})`; }

/* ---------- boot ---------- */
function boot(){
  S = load() || newState();
  S.settings = Object.assign({sound:true,music:.55,sfx:.8,amb:.5}, S.settings);
  ING.forEach(i=>{ if(S.inv[i.id]==null) S.inv[i.id]= i.r==='C'?3:i.r==='U'?1:0; });
  if(!S.queue.length) buildQueue();
  const fl=document.createElement('div'); fl.id='flash'; $('#stage').appendChild(fl);
  bindEvents(); fit(); S3D.init(); FX.init(); addFoliage(); S.screen='shop'; render(); showTitle(); S3D.sync();
  document.addEventListener('pointerdown', ()=>SND.start(), {once:true});
}
boot();
