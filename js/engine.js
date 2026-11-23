/* ============ ENGINE: state, brewing resolver, customers, economy ============ */
PORTRAITS.nessa = {skin:'#b8d89a',hair:'#d86a8a',hairStyle:'curls',eyes:'normal',ears:'elf',clothes:'#5f8f4a',clothes2:'#e8d8a0',bg:'#3a5a3a',extra:['leaf','freckles','blush']};

function hashStr(s){ let h=2166136261; for(const ch of s){ h^=ch.charCodeAt(0); h=Math.imul(h,16777619); } return h>>>0; }
function rng(seed){ return ()=>{ seed=(seed+0x6D2B79F5)|0; let t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const cap = s => s.charAt(0).toUpperCase()+s.slice(1);
const SAVE_KEY='unreliable-shopkeeper-v1';
let S;

function newState(){
  const inv = {}; ING.forEach(i=>{ inv[i.id] = i.r==='C'?4:(i.r==='U'?2:0); });
  inv.honeyamber=3; inv.wool=2; inv.sigh=2; inv.glassberry=2; inv.poppy=2; inv.mirrorsalt=1; inv.moonstone=1; inv.echobead=1;
  const cast={}; Object.keys(CAST).forEach(k=>cast[k]={stage:0,rapport:1,memories:[],last:null});
  return {
    v:1, day:1, crowns:110, rep:20, notes:3, inv, known:{}, formulas:{}, experiments:[], stock:[], queue:[], cast,
    guestsSeen:[], sales:[], dayStats:[], gazette:[], pendingGaz:[], screen:'shop', selCust:null, selPotion:null,
    layout: defaultLayout(), storage:{}, settings:{sound:true}, seenIntro:false, nextUid:1,
    brew:{mix:{}, order:[], heat:'gentle', stir:'cw'}, lastIng:'mooncap', bookTab:'known', bookSel:null, ingSel:'mooncap', editMode:false, editSel:null, placing:null, undo:[]
  };
}
function defaultLayout(){
  let id=0; const L=(type,x,y,rot=0)=>({id:'f'+(++id),type,x,y,rot});
  return [L('counter',4,2),L('cauldron',8,1),L('shelf',1,0),L('shelf',2,0),L('cabinet',5,0),L('plant',9,0),L('rug',4,4),L('window',0,2),L('candles',9,3),L('catbed',8,6),L('plant',0,0),L('lantern',3,0)];
}
function save(){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }catch(e){} }
function load(){ try{ const t=localStorage.getItem(SAVE_KEY); if(t){ const o=JSON.parse(t); if(o && o.v===1) return o; } }catch(e){} return null; }

/* ---------- Brewing resolver: emergent potion effects ---------- */
const HEAT_MOD = {
  cold:{mul:{COOL:1.3,PRESERVE:1.3,SOOTHE:1.3,HUSH:1.2,BREATHE:1.3,SHRINK:1.2,WARM:.7,SPARK:.7,SWIFT:.8},stab:6},
  gentle:{mul:{},stab:8},
  simmer:{mul:'all1.12',stab:0},
  boil:{mul:{WARM:1.3,SPARK:1.3,CHEER:1.3,RESONATE:1.3,MIGHT:1.3,SWIFT:1.2},stab:-14},
  flare:{mul:{SPARK:1.5,GLOW:1.5},stab:-24}
};
function bottleFor(main, quirky){
  if(quirky) return 'oddity';
  if(['SLEEP','DREAM','MEND','SOOTHE','WARM','CHEER'].includes(main)) return 'round';
  if(['REVEAL','REMEMBER','RESONATE','HUSH'].includes(main)) return 'vial';
  if(['FLOAT','GUIDE','COOL','PROTECT'].includes(main)) return 'flat';
  if(['BIND','PRESERVE','GROW','MIGHT'].includes(main)) return 'jar';
  if(['BREATHE','SWIFT'].includes(main)) return 'flat';
  if(main==='CHARM') return 'round';
  if(['STEADY','SPARK','GLOW'].includes(main)) return 'dropper';
  return 'oddity';
}
const techOK = (f,heat,stir) => (!f.heat || f.heat===heat) && (!f.stir || f.stir===stir);
const techN = f => (f.heat?1:0)+(f.stir?1:0);
function matchFormula(mix, heat, stir){ return FORMULAS.filter(f=>f.core.every(c=>mix[c]>0) && techOK(f,heat,stir)).sort((a,b)=>techN(b)-techN(a) || b.core.length-a.core.length || a.id.localeCompare(b.id))[0]; }
function siblings(f){ const k=[...f.core].sort().join('|'); return FORMULAS.filter(g=>[...g.core].sort().join('|')===k); }
const techLabel = f => { const h=f.heat&&HEATS.find(x=>x.id===f.heat), s=f.stir&&STIRS.find(x=>x.id===f.stir); return [h&&h.n, s&&s.n+' stir'].filter(Boolean).join(' · ') || 'Any fire, any stir'; };
function mixKey(mix, heat, stir){ const ids=Object.keys(mix).filter(k=>mix[k]>0).sort(); return ids.map(i=>i+':'+mix[i]).join('|')+'#'+heat+'#'+stir; }

function resolve(mix, heat, stir){
  const ids = Object.keys(mix).filter(k=>mix[k]>0).sort();
  if(!ids.length) return null;
  const key = mixKey(mix,heat,stir); const R = rng(hashStr(key));
  const score={}, src={};
  ids.forEach(id=>{ const q=mix[id]; INGM[id].b.forEach(b=>{ score[b]=(score[b]||0)+Math.sqrt(q); (src[b]=src[b]||[]).push(id); }); });
  const hm = HEAT_MOD[heat];
  Object.keys(score).forEach(b=>{ if(hm.mul==='all1.12') score[b]*=1.12; else if(hm.mul[b]) score[b]*=hm.mul[b]; });
  let stab = 72 + hm.stab;
  if(stir==='alt') stab+=10; if(stir==='still') stab+=4; if(stir==='brisk') stab-=6;
  const distinct = ids.length; stab -= Math.max(0, distinct-4)*7;
  const units = ids.reduce((a,i)=>a+mix[i],0);
  if(units>12) stab -= (units-12)*2;

  const rank = b => score[b] * (src[b].length>=2 ? 1.6 : 1);
  let order = Object.keys(score).sort((a,b)=>rank(b)-rank(a) || a.localeCompare(b));
  const fm = matchFormula(mix, heat, stir);

  let main, sec, expressed, murky=false, formula=null, wild=null;
  if(fm){
    formula = fm; main = fm.main; sec = fm.sec; stab += 12;
    const extras = ids.filter(i=>!fm.core.includes(i));
    expressed = [main, sec];
    extras.forEach(e=>INGM[e].b.forEach(b=>{ if(src[b].length>=2 && !expressed.includes(b)) expressed.push(b); }));
  } else {
    if(stir==='ccw' && order.length>1 && rank(order[1])*1.3 >= rank(order[0])) order=[order[1],order[0],...order.slice(2)];
    main = order[0];
    murky = src[main].length < 2;
    sec = order[1] && (src[order[1]].length>=2 || score[order[1]]>=1.4) ? order[1] : null;
    expressed = [main]; if(sec) expressed.push(sec);
    order.slice(2).forEach(b=>{ if(src[b].length>=2 && expressed.length<5) expressed.push(b); });
    if(heat==='flare'){ const pool=order.filter(b=>!expressed.includes(b)); if(pool.length){ wild = pool[Math.floor(R()*pool.length)]; expressed.push(wild); } }
  }
  // quirks: conflicting behaviours that are both expressed become a strange new effect
  let qpool = new Set(expressed);
  if(stir==='brisk'||heat==='boil') Object.keys(score).forEach(b=>{ if(score[b]>=1.4) qpool.add(b); });
  const quirks = QUIRKS.filter(q=>qpool.has(q.a)&&qpool.has(q.b));
  stab -= quirks.length*14;
  stab = clamp(Math.round(stab),5,100);

  let pot = score[main]; if(stir==='cw') pot*=1.25; if(stir==='still') pot*=.85;
  let stars = murky?1 : pot>=3.0?3 : pot>=1.9?2 : 1;
  if(formula) stars = Math.min(3, stars+1);
  if(stab<30) stars = Math.max(1, stars-1);

  const sides=[]; if(stab<50) sides.push(SIDE_EFFECTS[Math.floor(R()*SIDE_EFFECTS.length)]);
  if(stab<25){ let s2=SIDE_EFFECTS[Math.floor(R()*SIDE_EFFECTS.length)]; if(s2!==sides[0]) sides.push(s2); }
  if(formula) sides.unshift(formula.side);

  const bottles = clamp(1+Math.floor(units/2),1,5);
  const costSum = ids.reduce((a,i)=>a+INGM[i].cost*mix[i],0);
  let value = Math.round(costSum/bottles*1.5 + 8 + stars*7 + (formula?formula.val*0.45:0) - (stab<50?5:0) + quirks.length*3);
  value = Math.max(6,value);

  let name;
  if(formula) name = (S.formulas[formula.id]&&S.formulas[formula.id].custom) || formula.n;
  else {
    const nouns = BEH[main].noun; const noun = nouns[Math.floor(R()*nouns.length)];
    name = murky ? `Murky ${noun}` : (sec ? `${BEH[sec].adj} ${noun}` : noun);
    if(quirks.length && !murky) name = `${quirks[0].name}`;
  }
  const col = formula ? formula.col : mixHex(ids.map(i=>INGM[i].p[0]), ids.map(i=>mix[i]));
  const bottle = formula ? formula.bottle : bottleFor(main, quirks.length>0);
  const fx = formula ? formula.fx : (murky ? `Faintly ${BEH[main].fx}. Nothing else agreed on anything.` : `${cap(BEH[main].fx)}${sec?`, and ${BEH[sec].fx}`:''}.`);

  // which ingredients revealed which behaviours
  const reveals=[];
  expressed.forEach(b=>{ (src[b]||[]).forEach(id=>reveals.push([id,b])); });
  quirks.forEach(q=>[q.a,q.b].forEach(b=>(src[b]||[]).forEach(id=>reveals.push([id,b]))));

  return { key, mix:{...mix}, heat, stir, name, main, sec, expressed, quirks:quirks.map(q=>q.name), quirkObjs:quirks, murky, formula: formula?formula.id:null,
    stab, stars, sides, bottles, value, col, bottle, fx, reveals, units, wild };
}

/* preview clue without revealing everything */
function preview(mix){
  const ids = Object.keys(mix).filter(k=>mix[k]>0);
  if(!ids.length) return {text:'The cauldron waits. Add anything you like.', tone:'idle'};
  const cnt={}; ids.forEach(id=>INGM[id].b.forEach(b=>cnt[b]=(cnt[b]||0)+1));
  const shared = Object.keys(cnt).filter(b=>cnt[b]>=2);
  const knownShared = shared.filter(b=>ids.filter(id=>INGM[id].b.includes(b)).every(id=>(S.known[id]||[]).includes(b)));
  const fm = matchFormula(mix, S.brew.heat, S.brew.stir);
  const sib = fm ? siblings(fm) : FORMULAS.filter(f=>f.core.every(c=>mix[c]>0));
  const hidden = sib.filter(f=>!S.formulas[f.id] && f!==fm).length;
  if(fm && S.formulas[fm.id]) return {text:`You recognise this: ${S.formulas[fm.id].custom||fm.n}.${hidden?' Though a different fire or spoon might change it…':''}`, tone:'known'};
  if(fm) return {text: (fm.heat||fm.stir) ? 'The fire and the spoon are doing something new to this…' : 'The brew is humming a tune you almost recognise…', tone:'formula'};
  if(sib.length) return {text:'These three want to be something, but only over the right fire.', tone:'formula'};
  const conflict = QUIRKS.some(q=>cnt[q.a]&&cnt[q.b]);
  if(knownShared.length) return {text:`Something wants to be ${BEH[knownShared[0]].adj.toLowerCase()}${conflict?', but something else is arguing with it.':'.'}`, tone:'hint'};
  if(shared.length) return {text: conflict ? 'Two things in here disagree. Loudly. This could be interesting.' : `${shared.length>1?'Several things':'Something'} in here agree${shared.length>1?'':'s'} with each other. You can't tell what yet.`, tone: conflict?'warn':'hint'};
  return {text:'Nothing in here agrees on anything yet. It will come out murky.', tone:'murky'};
}

/* ---------- Customers ---------- */
function stageOf(key){ const c=S.cast[key]; return CAST[key].stages[c.stage]; }
function custReq(q){ if(q.kind==='cast'){ return CAST[q.key].stages[q.stage]; } return GUESTS[q.key]; }
function custName(q){ return q.kind==='cast'? CAST[q.key].n : GUESTS[q.key].n; }
function custRole(q){ return q.kind==='cast'? CAST[q.key].role : GUESTS[q.key].role; }

function buildQueue(){
  const R = rng(hashStr('day'+S.day+'q'));
  const cast = Object.keys(CAST).filter(k=>{ const st=CAST[k].stages[S.cast[k].stage]; return st && st.day<=S.day; })
    .sort((a,b)=>CAST[a].stages[S.cast[a].stage].day - CAST[b].stages[S.cast[b].stage].day).slice(0,3);
  let pool = Object.keys(GUESTS).filter(g=>!S.guestsSeen.includes(g));
  if(pool.length<2){ S.guestsSeen=[]; pool=Object.keys(GUESTS); }
  const nG = S.day===1 ? 1 : (cast.length>=3?1:2);
  const guests=[];
  if(S.day===1){ guests.push('gorvin'); }
  else while(guests.length<nG && pool.length){ const i=Math.floor(R()*pool.length); guests.push(pool.splice(i,1)[0]); }
  guests.forEach(g=>S.guestsSeen.push(g));
  const q=[];
  const cq = cast.map(k=>({key:k,kind:'cast',stage:S.cast[k].stage}));
  const gq = guests.map(k=>({key:k,kind:'guest'}));
  // interleave
  while(cq.length||gq.length){ if(cq.length) q.push(cq.shift()); if(gq.length) q.push(gq.shift()); }
  if(S.day===1){ const gi=q.findIndex(x=>x.key==='gorvin'); const [g]=q.splice(gi,1); q.splice(1,0,g); }
  S.queue = q.map((x,i)=>({...x, id:'c'+S.day+'_'+i, asked:false, done:false, result:null}));
  S.selCust = S.queue[0] ? S.queue[0].id : null;
}

function strengthIn(p, b){ if(p.main===b) return 1; if(p.sec===b) return .75; if(p.expressed.includes(b)) return .45; return 0; }
function evaluate(p, q){
  const r = custReq(q); const needs = {...r.needs, ...(r.clueNeeds||{})};
  let tot=0, got=0; Object.entries(needs).forEach(([b,w])=>{ tot+=w; got+=w*strengthIn(p,b); });
  const match = tot? got/tot : 0;
  const quirkHit = (p.quirkObjs||QUIRKS.filter(x=>p.quirks.includes(x.name))).some(x=>x.a===r.bound||x.b===r.bound);
  const violated = strengthIn(p, r.bound)>=.45 || quirkHit;
  let outcome = violated ? 'oops' : match>=.72 ? (p.stars>=2 && !(p.quirks||[]).length ?'delight':'good') : match>=.45 ? 'good' : match>=.2 ? 'meh' : 'baffled';
  return {match, violated, outcome};
}
const OUTCOME = {
  delight:{label:'Delighted',rap:2,rep:3,expr:'happy',col:'var(--good)'},
  good:{label:'Satisfied',rap:1,rep:1,expr:'happy',col:'#bfe08a'},
  meh:{label:'Puzzled',rap:0,rep:-1,expr:'think',col:'var(--brass2)'},
  baffled:{label:'Baffled',rap:-1,rep:-2,expr:'sad',col:'#f0a07a'},
  oops:{label:'Oh no',rap:-1,rep:-2,expr:'shock',col:'var(--bad)'}
};
function firstSip(p, q, ev){
  const r=custReq(q); const nm=custName(q).split(' ')[0];
  if(ev.outcome==='oops'){ const quirk=(p.quirkObjs||[]).find(x=>x.a===r.bound||x.b===r.bound); return quirk? `${nm} takes a sip and… ${quirk.fx}. "I did say: ${r.boundSay.toLowerCase()}"` : `${nm} takes a sip. It ${BEH[r.bound].fx}. "I did say: ${r.boundSay.toLowerCase()}"`; }
  if(p.quirkObjs && p.quirkObjs.length) return `${nm} sips. It works, mostly. Also, they are now ${p.quirkObjs[0].fx}.`;
  if(ev.outcome==='delight') return `${nm} sniffs the cork, then beams. "Oh, that's exactly it."`;
  if(ev.outcome==='good') return `${nm} turns the bottle in the light. "Close enough. I think this will do nicely."`;
  if(ev.outcome==='meh') return `${nm} squints at the label. "It ${BEH[p.main].fx}? I suppose that's… adjacent."`;
  return `${nm} stares at the bottle. "I asked about ${r.topic}. This ${BEH[p.main].fx}."`;
}
function headlineFor(sale){
  const {q, p, ev} = sale; const nm=custName(q); const r=custReq(q);
  const qk = (p.quirkObjs||[])[0];
  const goodish = ev.outcome==='delight'||ev.outcome==='good';
  let head, quote;
  if(q.kind==='cast'){
    head = goodish ? r.gaz.good + (qk ? `. Also: ${first(nm)} was ${qk.fx}` : '') : (qk ? qk.head.replace(/\{c\}/g,nm) : r.gaz.bad);
    quote = goodish ? r.good : r.bad;
  } else {
    if(qk) head = qk.head.replace(/\{c\}/g, nm);
    else if(ev.outcome==='oops') head = BEH[r.bound].oops.replace(/\{c\}/g, nm);
    else if(goodish) head = `${nm} reports total success with ${r.topic}, credits "the odd little shop on Bellwether Lane"`;
    else head = `${nm} sought help with ${r.topic}; potion instead ${BEH[p.main].fx}`;
    quote = goodish ? r.good : r.bad;
    if(goodish && qk) quote += ` (Side effect: ${qk.fx}.)`;
  }
  return {head, quote, who: q.key, tone: goodish?'good':(ev.outcome==='oops'?'bad':'odd'), potion:p.name, day:S.day};
}

/* ---------- Shop layout ---------- */
function fdims(it){ const F=FURN[it.type]; return it.rot?[F.h,F.w]:[F.w,F.h]; }
function occGrid(layout, skipId){
  const g = Array.from({length:GRID_H},()=>Array(GRID_W).fill(null));
  layout.forEach(it=>{ if(it.id===skipId) return; const [w,h]=fdims(it); for(let i=0;i<w;i++)for(let j=0;j<h;j++){ const x=it.x+i,y=it.y+j; if(x<GRID_W&&y<GRID_H && !(g[y][x] && FURN[it.type].flat)) g[y][x]=it; } });
  return g;
}
function canPlace(layout, it, skipId){
  const [w,h]=fdims(it); if(it.x<0||it.y<0||it.x+w>GRID_W||it.y+h>GRID_H) return {ok:false,why:'That would poke through the wall.'};
  const g=occGrid(layout,skipId);
  for(let i=0;i<w;i++)for(let j=0;j<h;j++){ const c=g[it.y+j][it.x+i]; if(!c) continue; const cf=!!FURN[c.type].flat, nf=!!FURN[it.type].flat;
    if(cf&&nf) return {ok:false,why:'Rugs don\'t stack.'}; if(!cf&&!nf) return {ok:false,why:`The ${FURN[c.type].n} is already there.`}; }
  for(let i=0;i<w;i++)for(let j=0;j<h;j++){ if(it.x+i===DOOR.x && it.y+j===DOOR.y && !FURN[it.type].flat) return {ok:false,why:'That blocks the front door.'}; }
  const test = layout.filter(l=>l.id!==skipId).concat([it]);
  if(!pathOK(test)) return {ok:false,why:'A customer would get trapped behind that. Leave a path from the door to the counter.'};
  return {ok:true};
}
function pathOK(layout){
  const g=occGrid(layout); const blocked=(x,y)=>{ const c=g[y][x]; return c && !FURN[c.type].flat; };
  const counter = layout.find(l=>l.type==='counter'); if(!counter) return true;
  const [cw,ch]=fdims(counter); const targets=new Set();
  for(let i=-1;i<=cw;i++)for(let j=-1;j<=ch;j++){ const x=counter.x+i,y=counter.y+j; if(x>=0&&y>=0&&x<GRID_W&&y<GRID_H&&!blocked(x,y)) targets.add(x+','+y); }
  const seen=new Set([DOOR.x+','+DOOR.y]); const st=[[DOOR.x,DOOR.y]];
  if(blocked(DOOR.x,DOOR.y)) return false;
  while(st.length){ const [x,y]=st.pop(); if(targets.has(x+','+y)) return true; [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{ const nx=x+dx,ny=y+dy; if(nx<0||ny<0||nx>=GRID_W||ny>=GRID_H) return; const k=nx+','+ny; if(seen.has(k)||blocked(nx,ny)) return; seen.add(k); st.push([nx,ny]); }); }
  return false;
}
function shopStats(){
  const s={display:2,charm:0,comfort:0,traffic:0};
  S.layout.forEach(it=>Object.entries(FURN[it.type].stats).forEach(([k,v])=>s[k]+=v));
  return s;
}

/* ---------- Economy & days ---------- */
const UPKEEP = 6;
function timeLabel(){ const n=S.queue.length||1; const d=S.queue.filter(x=>x.done).length/n; return d<.25?'Morning':d<.5?'Late morning':d<.75?'Afternoon':d<1?'Evening':'Closing time'; }
function priceFor(p){ return p.price!=null ? p.price : p.value; }
function walkIns(){
  const st=shopStats(); const R=rng(hashStr('walk'+S.day+S.crowns));
  const n = Math.round(1 + st.traffic*0.7 + st.charm*0.25 + S.rep/18 + R()*2);
  const display=[]; S.stock.forEach(p=>{ for(let i=0;i<p.qty && display.length<st.display;i++) display.push(p); });
  const sold=[]; const heads=[];
  for(let i=0;i<n && display.length;i++){
    const idx=Math.floor(R()*display.length); const p=display[idx];
    const ratio = priceFor(p)/p.value; const prob = ratio<=1?0.85:ratio<=1.3?0.55:ratio<=1.7?0.25:0.06;
    if(R()<prob + st.comfort*0.01){ display.splice(idx,1); p.qty--; S.crowns+=priceFor(p); sold.push({name:p.name,price:priceFor(p)});
      S.sales.push({day:S.day,name:p.name,price:priceFor(p),who:'Walk-in',outcome:'walkin',value:p.value});
      if(p.quirkObjs && p.quirkObjs.length && R()<0.7){ const towns=['A passing goblin','The mayor\'s nephew','A visiting gnome accountant','Two schoolchildren','An off-duty Guild clerk','A very old tortoise']; const who=towns[Math.floor(R()*towns.length)]; heads.push({head:p.quirkObjs[0].head.replace(/\{c\}/g, who), quote:`Bought a bottle of ${p.name} from the Crooked Cork shelf.`, who:null, tone:'odd', potion:p.name, day:S.day}); }
    }
  }
  S.stock = S.stock.filter(p=>p.qty>0);
  return {n, sold, heads};
}
