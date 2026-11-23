/* ============ CHARACTERS v3: sculpted, outfitted, rigged figures with painted faces, props and animation ============ */
PORTRAITS.keeper = {skin:'#f2c39c',hair:'#6a3558',hairStyle:'bob',eyes:'big',ears:'round',clothes:'#3f8f8a',clothes2:'#f4ecd8',hat:'witch',hatCol:'#7a5ab8',bg:'#4a3a6a',extra:['freckles','blush'],iris:'#3fa89a'};
const C3 = !G3 ? null : (function(){
  const {T,R,PI,ctex,rr,TEX,M,CM,fabric,metal,mesh,box,sph,cyl,cone,tor,lathe,loft,loftGeo,tube,tubeGeo,rbox,sculpt,bake} = G3;
  const HR=.4, V=(x,y,z)=>new T.Vector3(x,y,z);
  const sm=(a,b,x)=>{ const t=Math.min(1,Math.max(0,(x-a)/(b-a))); return t*t*(3-2*t); };
  const SPEC = {
    maudie:{h:.8,w:1.05,head:1.12,shape:'round',body:'round',outfit:'dress',pat:['dots','#fbe0ea'],collar:'ruff',sleeve:'puff',shoe:'shoe',props:['shawl','basket','needles'],glasses:'round'},
    kest:{h:.9,head:1.08,shape:'heart',body:'slim',outfit:'tunic',pat:['plain'],collar:'scarf',sleeve:'rolled',shoe:'boot',props:['satchel','bird','goggles']},
    croak:{h:.74,w:1.08,head:1.22,shape:'frog',body:'small',outfit:'coat',pat:['pin','#6a5a7a'],collar:'high',sleeve:'long',shoe:'shoe',props:['cape','cane','cravat','vestfront']},
    tavi:{h:.96,shape:'soft',body:'slim',outfit:'robe',pat:['leaf','#8fb86a'],collar:'round',sleeve:'bell',shoe:'bare',props:['leafcloak','pouch','flower','staff']},
    patch:{h:.72,head:1.22,shape:'round',body:'small',outfit:'doll',pat:['patch','#e8a83a'],collar:'none',sleeve:'long',shoe:'shoe',props:[]},
    sable:{h:1.06,w:.94,shape:'heart',body:'slim',outfit:'tunic',pat:['plain'],collar:'round',sleeve:'long',shoe:'boot',props:['cloak','quiver','bracers']},
    ada:{h:1.02,w:.95,shape:'long',body:'slim',outfit:'coat',pat:['plain'],collar:'lapel',sleeve:'long',shoe:'boot',props:['clipboard','badge','epaulettes','cravat'],glasses:'square'},
    nessa:{h:.96,shape:'heart',body:'slim',outfit:'dress',pat:['floral','#f0e0a0'],collar:'round',sleeve:'puff',shoe:'shoe',props:['apron','flowercrown']},
    gorvin:{h:1.46,w:1.38,head:.96,shape:'brute',body:'barrel',outfit:'vest',pat:['plaid','#8a6a3a'],collar:'none',sleeve:'short',shoe:'bare',props:['partyhat'],hunch:.2,hands:1.6,nose:'big'},
    bramble:{h:.8,w:1.2,head:1.1,shape:'round',body:'round',outfit:'dress',pat:['hstripes','#f2c8c8'],collar:'round',sleeve:'rolled',shoe:'shoe',props:['apron','bakerhat','rollingpin'],nose:'none'},
    miri:{h:.84,w:.9,head:1.14,shape:'heart',body:'small',outfit:'tutu',pat:['stars','#ffe6f4'],collar:'none',sleeve:'short',shoe:'slipper',props:['wings','antennae']},
    tallow:{h:1.04,w:1.1,shape:'ball',body:'round',outfit:'wax',collar:'none',sleeve:'long',shoe:'none',props:[],nose:'none'},
    puddle:{h:.96,shape:'soft',body:'slim',outfit:'robe',pat:['wave','#9fd8f0'],collar:'round',sleeve:'bell',shoe:'bare',props:['shells','tail']},
    bellmaker:{h:.96,w:1.1,shape:'ball',body:'barrel',outfit:'brass',collar:'none',sleeve:'long',shoe:'none',props:['bell'],nose:'none'},
    tamsin:{h:.98,w:.95,shape:'heart',body:'slim',outfit:'coat',pat:['diamond','#9a3a5a'],collar:'lapel',sleeve:'long',shoe:'boot',props:['tail','scarf']},
    grakka:{h:1.22,w:1.3,shape:'brute',body:'barrel',outfit:'vest',pat:['plain'],collar:'none',sleeve:'short',shoe:'boot',props:['apron','hammer','bracers'],hands:1.3,nose:'big'},
    wobble:{h:1.06,w:1.1,shape:'square',body:'barrel',outfit:'armor',collar:'none',sleeve:'long',shoe:'boot',props:['shield']},
    penny:{h:.9,w:1.15,shape:'round',body:'round',outfit:'dress',pat:['floral','#f0c0e0'],collar:'ruff',sleeve:'puff',shoe:'shoe',props:['shawl','handbag']},
    fennick:{h:1.1,w:1.05,shape:'long',body:'slim',outfit:'coat',pat:['pin','#8a6ac0'],collar:'lapel',sleeve:'long',shoe:'shoe',props:['cravat','cane','vestfront'],nose:'pointy'},
    nib:{h:.72,head:1.16,shape:'heart',body:'small',outfit:'tunic',pat:['plain'],collar:'round',sleeve:'short',shoe:'boot',props:['tail','parcel']},
    dob:{h:.72,w:1.15,head:1.12,shape:'round',body:'round',outfit:'vest',pat:['plaid','#3a5a2a'],collar:'round',sleeve:'rolled',shoe:'bare',props:['rope']},
    marrow:{h:1.06,w:.92,shape:'skull',body:'slim',outfit:'coat',pat:['plain'],collar:'lapel',sleeve:'long',shoe:'boot',props:['sash','epaulettes'],nose:'none'},
    ottoline:{h:1.5,w:1.1,head:.92,shape:'long',body:'round',outfit:'dress',pat:['diamond','#8f5fa0'],collar:'ruff',sleeve:'puff',shoe:'shoe',props:['shawl','parasol']},
    gus:{h:1.36,w:1.35,head:.98,shape:'brute',body:'barrel',outfit:'vest',pat:['stripes','#7a6a9a'],collar:'round',sleeve:'rolled',shoe:'boot',props:['scroll'],hunch:.14,hands:1.4,nose:'big'},
    keeper:{h:.94,head:1.16,shape:'heart',body:'slim',outfit:'tunic',pat:['plain'],collar:'round',sleeve:'rolled',shoe:'boot',props:['apron','potionbelt']}
  };
  const IRIS = ['#6a4226','#3a6a9a','#3f8a4a','#7a4a9a','#9a6a1a','#2a7a7a'];
  const SHAPES = { round:{chin:.2,cheek:.09,jaw:0,flat:.3,wide:1.02,long:.96}, soft:{chin:.26,cheek:.06,jaw:0,flat:.3,wide:1,long:.98}, heart:{chin:.34,cheek:.07,jaw:-.02,flat:.3,wide:1,long:.98}, long:{chin:.24,cheek:.03,jaw:0,flat:.3,wide:.93,long:1.06},
    square:{chin:.08,cheek:.04,jaw:.1,flat:.28,wide:1.04,long:.98}, brute:{chin:.02,cheek:.03,jaw:.2,flat:.25,wide:1.1,long:.98}, frog:{chin:.1,cheek:.1,jaw:.12,flat:.2,wide:1.26,long:.8}, skull:{chin:.36,cheek:-.04,jaw:-.04,flat:.3,wide:.96,long:1.02}, ball:{chin:0,cheek:0,jaw:0,flat:.15,wide:1,long:1} };
  function shaper(p){ return v=>{ let x=v.x,y=v.y,z=v.z; const t=sm(-.2,-1,y); x*=1-p.chin*t; z*=1-p.chin*.5*t; const ck=Math.exp(-Math.pow((y+.32)/.3,2)); x*=1+p.cheek*ck*(z>-.3?1:.4); x*=1+p.jaw*sm(.15,-.6,y)*(1-t*.5); if(z>.5) z=.5+(z-.5)*(1-p.flat); v.set(x*p.wide,y*p.long,z); return v; }; }
  const piv=(x=0,y=0,z=0,name)=>{ const g=new T.Group(); g.position.set(x,y,z); g.userData.pivot=true; if(name) g.name=name; return g; };
  const dbl=m=>{ if(!m.userData.dbl){ m.userData.dbl=m.clone(); m.userData.dbl.side=T.DoubleSide; m.userData.dbl.onBeforeCompile=m.onBeforeCompile; m.userData.dbl.customProgramCacheKey=m.customProgramCacheKey; } return m.userData.dbl; };

  /* ---------- painted faces ---------- */
  const FT=new Map();
  function faceTex(key, expr='neutral', variant=''){ const id=key+'|'+expr+'|'+variant; let t=FT.get(id); if(t){ FT.delete(id); FT.set(id,t); return t; } t=paintFace(key,PORTRAITS[key],expr,variant); FT.set(id,t); if(FT.size>70){ const k=FT.keys().next().value; const old=FT.get(k); FT.delete(k); old.dispose(); } return t; }
  function paintFace(key, P, expr, variant){ const blink=variant==='blink', talk=variant==='talk';
    return ctex(384,384,(c)=>{ c.scale(1.5,1.5); const ink='#2a1830', L=86, Rr=170, ey=124; const has=x=>(P.extra||[]).includes(x); const iris=P.iris||IRIS[hashStr(key)%IRIS.length]; c.lineCap='round'; c.lineJoin='round'; const sp=SPEC[key]||{};
      const el=(x,y,rx,ry,a0=0,a1=7)=>{ c.beginPath(); c.ellipse(x,y,rx,ry,0,a0,a1); };
      if(has('skull')){ [L,Rr].forEach((x,i)=>{ c.fillStyle='#150c1c'; c.beginPath(); c.moveTo(x-28,ey-10); c.quadraticCurveTo(x-30,ey-36,x,ey-34); c.quadraticCurveTo(x+30,ey-36,x+28,ey-8); c.quadraticCurveTo(x+24,ey+30,x,ey+30); c.quadraticCurveTo(x-26,ey+30,x-28,ey-10); c.fill();
          if(!blink){ const g=c.createRadialGradient(x,ey,1,x,ey,16); g.addColorStop(0,'#eaffff'); g.addColorStop(.4,expr==='sad'?'#5aa8ff':'#7fe6ff'); g.addColorStop(1,'rgba(90,200,255,0)'); c.fillStyle=g; el(x+(expr==='think'?7:0),ey+(expr==='sad'?5:0),expr==='happy'||expr==='shock'?17:13,expr==='happy'?10:expr==='shock'?17:13); c.fill(); } });
        c.fillStyle='#150c1c'; c.beginPath(); c.moveTo(128,146); c.quadraticCurveTo(114,168,122,172); c.lineTo(128,164); c.lineTo(134,172); c.quadraticCurveTo(142,168,128,146); c.fill();
        const up=expr==='happy'?10:expr==='sad'?-9:0, open=talk||expr==='shock'?10:expr==='happy'?5:0; c.strokeStyle='#150c1c'; c.lineWidth=4.5; c.fillStyle='#150c1c';
        c.beginPath(); c.moveTo(80,192-up); c.quadraticCurveTo(128,198+up,176,192-up); c.lineTo(176,196-up+open); c.quadraticCurveTo(128,204+up+open,80,196-up+open); c.closePath(); if(open) c.fill(); c.stroke(); for(let i=0;i<8;i++){ const x=88+i*11.4; c.beginPath(); c.moveTo(x,184); c.lineTo(x,206+open); c.stroke(); } return; }
      const lidCol=shade(P.skin,-.07);
      const eye=(x,side)=>{ const beady=P.eyes==='beady'||P.eyes==='small'; const sz=P.eyes==='big'?1.18:beady?.7:1; const rx=22*sz, ry=27*sz;
        if(blink||expr==='happy'){ c.strokeStyle=ink; c.lineWidth=7.5; c.beginPath(); if(expr==='happy'&&!blink) c.arc(x,ey+12,19*sz,PI*1.15,PI*1.85); else { c.arc(x,ey-14,19*sz,PI*.17,PI*.83); } c.stroke(); if(has('lashes')){ c.lineWidth=3.5; [-1,0,1].forEach(k=>{ c.beginPath(); const yy=expr==='happy'&&!blink?ey-6:ey+5; c.moveTo(x+side*14+k*5,yy); c.lineTo(x+side*20+k*7,yy+(expr==='happy'&&!blink?-7:7)); c.stroke(); }); } return; }
        if(beady){ c.fillStyle='#1a0e22'; el(x,ey+4,13*sz*1.7,(expr==='shock'?19:16)*sz*1.7); c.fill(); c.fillStyle='#fff'; el(x-5,ey-4,5.5,6.5); c.fill(); el(x+5,ey+10,2.5,2.5); c.fill(); if(expr==='sad'||(expr==='think'&&side>0)){ c.fillStyle=lidCol; c.beginPath(); c.moveTo(x-22,ey-26); c.lineTo(x+22,ey-26); c.lineTo(x+22,ey-(side>0?12:3)); c.lineTo(x-22,ey-(side>0?3:12)); c.fill(); } return; }
        c.save(); el(x,ey,rx,expr==='shock'?ry*1.1:ry); c.fillStyle='#fffdf8'; c.fill(); c.clip();
        const dx=expr==='think'?7*sz:0, dy=expr==='sad'?5:expr==='think'?-4:expr==='shock'?0:2, ir=(expr==='shock'?10:17)*sz, ix=x+dx, iy=ey+dy;
        c.fillStyle=shade(iris,-.5); el(ix,iy,ir+2.5,ir+2.5); c.fill(); const g=c.createRadialGradient(ix,iy+ir*.4,1,ix,iy,ir); g.addColorStop(0,shade(iris,.5)); g.addColorStop(.7,iris); g.addColorStop(1,shade(iris,-.25)); c.fillStyle=g; el(ix,iy,ir,ir); c.fill();
        c.fillStyle='#140a1c'; el(ix,iy,ir*.5,ir*.5); c.fill(); c.fillStyle='rgba(40,16,50,.3)'; c.fillRect(x-rx,ey-ry-3,rx*2,ry*.72);
        c.fillStyle='#fff'; el(ix-ir*.4,iy-ir*.42,ir*.32,ir*.32); c.fill(); el(ix+ir*.42,iy+ir*.4,ir*.15,ir*.15); c.fill(); c.restore();
        let l0=0,l1=0; if(expr==='sad'){ l0=side<0?.62:.2; l1=side<0?.2:.62; } else if(expr==='think'&&side>0){ l0=l1=.42; }
        if(l0||l1){ const yl=ey-ry+ry*2*l0*.5, yr=ey-ry+ry*2*l1*.5; c.fillStyle=lidCol; c.beginPath(); c.moveTo(x-rx-3,ey-ry-5); c.lineTo(x+rx+3,ey-ry-5); c.lineTo(x+rx+3,yr); c.lineTo(x-rx-3,yl); c.fill(); c.strokeStyle=ink; c.lineWidth=6; c.beginPath(); c.moveTo(x-rx,yl); c.lineTo(x+rx,yr); c.stroke(); }
        else { c.strokeStyle=ink; c.lineWidth=7; el(x,ey,rx,ry,PI*1.05,PI*1.95); c.stroke(); c.beginPath(); c.moveTo(x+side*rx*.96,ey-ry*.2); c.lineTo(x+side*(rx+5),ey-ry*.42); c.stroke(); }
        if(has('lashes')){ c.strokeStyle=ink; c.lineWidth=3.5; [0,1].forEach(k=>{ c.beginPath(); c.moveTo(x+side*(rx-3-k*8),ey-ry*.62-k*5); c.lineTo(x+side*(rx+7-k*6),ey-ry*.9-k*7); c.stroke(); }); }
        c.strokeStyle=ink; c.globalAlpha=.4; c.lineWidth=2.2; el(x,ey,rx,ry,PI*.28,PI*.72); c.stroke(); c.globalAlpha=1; };
      const noEyes=P.frog||P.bird||P.eyes==='button';
      if(!noEyes){ eye(L,-1); eye(Rr,1);
        const beady=P.eyes==='beady'||P.eyes==='small'; const by=ey-(beady?30:42)*(P.eyes==='big'?1.1:1);
        c.strokeStyle=P.hair&&P.hairStyle!=='none'?shade(P.hair,-.45):shade(P.skin,-.6); c.lineWidth=has('brow')?12:7;
        const brow=(x,a,b)=>{ c.beginPath(); c.moveTo(x-19,by+a); c.quadraticCurveTo(x,by-7+(a+b)/2,x+19,by+b); c.stroke(); };
        if(expr==='sad'){ brow(L,5,-8); brow(Rr,-8,5); } else if(expr==='shock'){ brow(L,-9,-12); brow(Rr,-12,-9); } else if(expr==='think'){ brow(L,3,2); brow(Rr,-11,-5); } else if(has('brow')){ brow(L,-4,8); brow(Rr,8,-4); } else if(expr==='happy'){ brow(L,-4,-7); brow(Rr,-7,-4); } else { brow(L,1,-2); brow(Rr,-2,1); } }
      if(P.frog){ c.fillStyle=shade(P.skin,-.35); el(116,112,3,4); c.fill(); el(140,112,3,4); c.fill(); }
      const bl=(has('blush')||expr==='happy')?.5:.2; if(!P.candle||true){ [[L-14,ey+44],[Rr+14,ey+44]].forEach(([x,y])=>{ const g=c.createRadialGradient(x,y,1,x,y,24); g.addColorStop(0,`rgba(255,96,128,${bl})`); g.addColorStop(1,'rgba(255,96,128,0)'); c.fillStyle=g; c.fillRect(x-26,y-26,52,52); }); }
      if(has('freckles')){ c.fillStyle=shade(P.skin,-.36); [[L-16,ey+36],[L-4,ey+43],[L-27,ey+45],[Rr+16,ey+36],[Rr+4,ey+43],[Rr+27,ey+45],[118,ey+33],[138,ey+35]].forEach(([x,y])=>{ el(x,y,2.6,2.6); c.fill(); }); }
      if(P.stitched){ c.strokeStyle=ink; c.lineWidth=3; c.beginPath(); c.moveTo(128,2); c.lineTo(125,66); c.stroke(); for(let i=0;i<5;i++){ c.beginPath(); c.moveTo(118,8+i*12); c.lineTo(133,12+i*12); c.stroke(); }
        c.fillStyle='#e8a83a'; c.save(); c.translate(52,176); c.rotate(-.2); c.fillRect(-22,-18,44,36); c.setLineDash([5,5]); c.strokeRect(-18,-14,36,28); c.restore(); c.setLineDash([]); }
      const my=P.frog?150:184, mw=P.frog?72:(has('bigjaw')?34:24);
      if(!P.bird && !(has('snout')&&expr!=='happy'&&!talk)){
        c.strokeStyle=ink; c.lineWidth=5.5; c.fillStyle='#7a2434';
        if(P.stitched){ const up=expr==='happy'?12:expr==='sad'?-10:4; c.beginPath(); c.moveTo(128-mw,my-up*.4); c.quadraticCurveTo(128,my+up,128+mw,my-up*.4); c.stroke(); c.lineWidth=3; for(let i=-2;i<=2;i++){ const x=128+i*mw*.42, y=my+up*(.5-Math.abs(i)*.22); c.beginPath(); c.moveTo(x,y-6); c.lineTo(x,y+6); c.stroke(); } }
        else if(talk){ el(128,my+3,mw*.42,mw*.5); c.fill(); c.stroke(); c.fillStyle='#ff8fa0'; el(128,my+mw*.3,mw*.24,mw*.16); c.fill(); }
        else if(expr==='happy'){ c.beginPath(); c.moveTo(128-mw,my-6); c.quadraticCurveTo(128,my+mw*1.35,128+mw,my-6); c.closePath(); c.fill(); c.stroke(); c.save(); c.clip(); c.fillStyle='#ff8fa0'; el(128,my+mw*.82,mw*.62,mw*.4); c.fill(); c.fillStyle='#fff'; c.fillRect(128-mw,my-7,mw*2,8); c.restore(); }
        else if(expr==='sad'){ c.beginPath(); c.moveTo(128-mw*.8,my+10); c.quadraticCurveTo(128,my-9,128+mw*.8,my+10); c.stroke(); }
        else if(expr==='shock'){ el(128,my+6,P.frog?19:12,P.frog?21:17); c.fill(); c.stroke(); }
        else if(expr==='think'){ c.beginPath(); c.moveTo(128-mw*.45,my+4); c.quadraticCurveTo(128+4,my+1,128+mw*.7,my-5); c.stroke(); }
        else { c.beginPath(); c.moveTo(128-mw*.85,my-5); c.quadraticCurveTo(128,my+(P.frog?19:13),128+mw*.85,my-5); c.stroke(); c.globalAlpha=.25; c.lineWidth=3; c.beginPath(); c.arc(128,my+13,7,PI*.2,PI*.8); c.stroke(); c.globalAlpha=1; }
        if(has('fangs')){ c.fillStyle='#fff'; c.strokeStyle=ink; c.lineWidth=2.5; [-26,26].forEach(dx=>{ c.beginPath(); c.moveTo(128+dx-6,my+3); c.lineTo(128+dx,my+20); c.lineTo(128+dx+6,my+3); c.closePath(); c.fill(); c.stroke(); }); } }
    });
  }

  /* ---------- head ---------- */
  function buildHead(key, P, sp){
    const has=x=>(P.extra||[]).includes(x), prop=x=>(sp.props||[]).includes(x);
    const sh=shaper(SHAPES[sp.shape||'soft']); const skin=CM(P.skin,{roughness:.6}), skinD=CM(shade(P.skin,-.16),{roughness:.6}), c1=CM(P.clothes), c2=CM(P.clothes2||'#ffffff'), hair=CM(P.hair||'#5a3a24',{roughness:.62}), hairD=CM(shade(P.hair||'#5a3a24',-.25),{roughness:.62}), hatM=CM(P.hatCol||'#3a2a4a',{roughness:.85}), gold=metal('#e9c06a'), ink=M('#1a1020',{roughness:.4});
    const head=new T.Group();
    const fp=(px,py,k=1)=>{ const phi=PI/2-.95+1.9*(px/256), th=PI/2-.8+1.6*(py/256); return sh(V(-Math.cos(phi)*Math.sin(th),Math.cos(th),Math.sin(phi)*Math.sin(th))).multiplyScalar(HR*k); };
    const H=(yaw,pitch,k=1)=>sh(V(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch))).multiplyScalar(HR*k);
    const radial=p=>p.clone().normalize();
    const lock=(pts,r,flat=.55,mat=hair,o={})=>{ const m=tube(pts,r,mat,Object.assign({up:radial,flat,seg:8},o)); head.add(m); return m; };
    const blunt=r=>t=>r*(.5+.5*Math.sin(PI*Math.min(1,.12+t*.95)));
    const hg=new T.SphereGeometry(1,38,28); hg.rotateY(-PI/2); sculpt(hg,sh); head.add(mesh(hg,P.bird?metal('#c8903a',.35):skin,0,0,0,{s:[HR,HR,HR]}));
    let faceMat=null;
    if(!P.bird){ const fg=new T.SphereGeometry(1,32,24,PI/2-.95,1.9,PI/2-.8,1.6); sculpt(fg,sh); fg.scale(1.012,1.012,1.012); faceMat=new T.MeshStandardMaterial({map:faceTex(key,'neutral'),transparent:true,roughness:.62,depthWrite:false,envMapIntensity:.4}); const fm=mesh(fg,faceMat,0,0,0,{s:[HR,HR,HR],cast:false,recv:false}); fm.name='face'; head.add(fm); }
    const capG=(k=1.075,th=1.72,tilt=-.52)=>{ const g=new T.SphereGeometry(1,32,22,0,6.2832,0,th); g.rotateY(-PI/2); g.rotateX(tilt); sculpt(g,sh); return g; };
    const cap=(mat=hair,k=1.075,th=1.72,tilt=-.52)=>head.add(mesh(capG(k,th,tilt),mat,0,0,0,{s:[HR*k,HR*k,HR*k]}));
    // nose
    const nose=sp.nose||((P.frog||P.candle||P.stitched)?'none':'button');
    if(nose==='button') head.add(sph(1,skinD,0,0,0,{s:[.042,.036,.034]}).translateOnAxis(fp(128,160,1.0).normalize(),fp(128,160,1.0).length()));
    if(nose==='big'){ const p=fp(128,154,1.0); head.add(sph(1,skinD,p.x,p.y,p.z,{s:[.075,.058,.07]})); [-1,1].forEach(s=>head.add(sph(.016,M('#2a1830'),p.x+s*.03,p.y-.03,p.z+.05))); }
    if(nose==='pointy'){ const p=fp(128,156,.98); head.add(cone(.035,.13,skinD,p.x,p.y-.01,p.z+.04,{r:[PI/2+.25,0,0]})); }
    // ears
    if(!P.frog&&!P.bird&&!P.candle&&P.ears!=='none'&&!has('skull')) [-1,1].forEach(s=>{ const fz=V(0,0,1);
      if(P.ears==='elf'){ head.add(tube([[s*.34,-.06,-.02],[s*.5,.06,-.06],[s*.64,.28,-.13]],t=>.1*Math.pow(1-t,.8)+.008,skin,{up:fz,flat:.34})); head.add(tube([[s*.38,-.04,.012],[s*.49,.06,-.03],[s*.58,.2,-.09]],t=>.055*Math.pow(1-t,.8)+.004,skinD,{up:fz,flat:.3})); }
      else if(P.ears==='goblin'){ head.add(tube([[s*.34,-.04,0],[s*.62,.04,-.04],[s*.98,.17,-.1]],t=>.13*Math.pow(1-t,.75)+.008,skin,{up:fz,flat:.3})); head.add(tube([[s*.4,-.03,.02],[s*.6,.04,-.02],[s*.84,.13,-.07]],t=>.07*Math.pow(1-t,.8)+.004,skinD,{up:fz,flat:.26})); }
      else if(P.ears==='big'){ head.add(sph(1,skin,s*.43,.0,-.02,{s:[.07,.17,.13]})); head.add(sph(1,skinD,s*.455,.0,.0,{s:[.045,.11,.09]})); }
      else if(P.ears==='fin'){ for(let i=0;i<3;i++) head.add(tube([[s*.34,-.02,-.02],[s*(.5+i*.03),.06+i*.08,-.06],[s*(.66-i*.02),.1+i*.14,-.12]],t=>.07*Math.pow(1-t,.7)+.006,CM(shade(P.skin,.25)),{up:fz,flat:.22})); }
      else { head.add(sph(1,skin,s*.385,-.03,-.01,{s:[.055,.095,.075]})); head.add(sph(1,skinD,s*.4,-.03,.008,{s:[.03,.06,.045]})); } });
    // hair
    const bang=(y0,y1,pe,r,m=hair)=>lock([H(y0*.3,1.22,1.05),H((y0+y1)/2,.82,1.11),H(y1,pe+.22,1.1),H(y1*1.04,pe,1.05)],r,.5,m);
    const hood=P.hat==='hood';
    switch(P.hairStyle){
      case 'bob': cap(hairD); [-.62,-.32,0,.32,.62].forEach((y,i)=>bang(y*.5,y,.3,.135,i%2?hairD:hair)); [-1,1].forEach(s=>{ lock([H(s*.9,1.12,1.05),H(s*1.3,.5,1.12),H(s*1.46,-.1,1.15),H(s*1.4,-.58,1.13),H(s*1.18,-.8,1.03)],blunt(.2),.5); lock([H(s*.6,1.0,1.06),H(s*1.02,.45,1.12),H(s*1.2,-.05,1.12),H(s*1.22,-.42,1.08)],blunt(.13),.5,hairD); });
        [2.0,2.55,PI,-2.55,-2.0].forEach((y,i)=>lock([H(y,1.02,1.05),H(y,.3,1.13),H(y,-.3,1.15),H(y,-.72,1.1)],blunt(.2),.5,i%2?hairD:hair)); break;
      case 'curls': cap(hairD); for(let i=0;i<11;i++){ const y=-2.7+i*.54; const p=H(y,.42+Math.sin(i*1.3)*.08,1.13); head.add(sph(.15,i%2?hair:hairD,p.x,p.y,p.z)); } for(let i=0;i<7;i++){ const p=H(-2.6+i*.87,.98,1.14); head.add(sph(.16,i%2?hairD:hair,p.x,p.y,p.z)); } { const p=H(0,1.5,1.16); head.add(sph(.17,hair,p.x,p.y,p.z)); [-.42,0,.42].forEach((y,i)=>{ const q=H(y,.55,1.13); head.add(sph(.115,i===1?hair:hairD,q.x,q.y,q.z)); }); }
        if(prop('needles')){ head.add(sph(.19,hair,0,.3,-.36)); head.add(sph(.12,hairD,0,.42,-.42)); [-1,1].forEach(s=>{ head.add(cyl(.012,.012,.56,CM('#c8a878'),s*.04,.4,-.36,{r:[.5,0,s*.9]})); head.add(sph(.03,CM('#e86a8a'),s*.26,.56,-.24)); }); } break;
      case 'messy': cap(hairD); for(let i=0;i<14;i++){ const y=i*2.4, p=.5+(i%4)*.24; lock([H(y,p,1.0),H(y+.16,p+.05,1.3),H(y+.34,p+.02,1.52+(i%3)*.08)],.14,.7,i%3?hair:hairD); } [-.4,0,.4].forEach(y=>lock([H(y*.6,1.02,1.05),H(y,.62,1.14),H(y*1.25,.33,1.11)],.12,.6)); break;
      case 'long': cap(hairD); if(!hood){ [[.35,-.2],[.3,-.62],[.4,.3],[.45,.75]].forEach(([a,b],i)=>bang(a,b,.3-Math.abs(b)*.1,.13,i%2?hairD:hair)); [2.1,2.6,PI,-2.6,-2.1].forEach((y,i)=>lock([H(y,1.0,1.05),H(y,.2,1.13),H(y,-.5,1.13),[Math.sin(y)*.36,-.88,-.3],[Math.sin(y)*.3,-1.3,-.27]],blunt(.2),.5,i%2?hairD:hair)); }
        [-1,1].forEach(s=>lock([H(s*.8,1.0,1.06),H(s*1.25,.4,1.12),H(s*1.32,-.3,1.13),[s*.4,-.66,.16],[s*.36,-1.02,.2]],t=>.15*(.55+.45*Math.sin(PI*Math.min(1,.1+t*.9)))*(1-t*.35),.55)); break;
      case 'braids': cap(hairD); [-1,1].forEach(s=>{ lock([H(0,1.18,1.05),H(s*.42,.76,1.11),H(s*.86,.4,1.1),H(s*1.18,.14,1.06)],.15,.5); lock([H(s*.2,1.1,1.05),H(s*.7,.7,1.1),H(s*1.2,.36,1.08)],.11,.5,hairD);
          for(let i=0;i<7;i++) head.add(sph(.092-i*.006,i%2?hair:hairD,s*(.38+Math.sin(i*1.1)*.012),-.12-i*.115,.1+(i%2?.02:-.02))); head.add(tor(.05,.02,gold,s*.385,-.9,.1,{r:[PI/2,0,0]})); head.add(tube([[s*.385,-.92,.1],[s*.39,-1.0,.11],[s*.4,-1.08,.12]],.06,hair)); }); break;
      case 'bun': cap(hairD); lock([H(.3,1.12,1.05),H(-.1,.76,1.11),H(-.6,.46,1.1),H(-1.02,.24,1.06)],.15,.5); lock([H(.36,1.06,1.05),H(.72,.62,1.1),H(1.08,.26,1.06)],.13,.5); lock([H(.3,1.2,1.05),H(-.3,.95,1.1),H(-.9,.6,1.09)],.12,.5,hairD);
        if(P.hat==='feather'){ head.add(sph(.16,hair,0,-.02,-.44)); } else { head.add(sph(.19,hair,0,.42,-.14)); head.add(tube([[-.16,.34,-.16],[0,.3,-.36],[.16,.34,-.16]],[.03,.03],CM('#7a2a4a'))); if(sp.h>1.2){ head.add(cyl(.012,.012,.5,gold,0,.46,-.16,{r:[0,0,1.2]})); head.add(sph(.035,CM('#c08cff',{emissive:'#a060ff',emissiveIntensity:.8}),.24,.55,-.16)); } } break;
      case 'tuft': lock([H(0,1.35,.98),H(.1,1.4,1.25),H(.34,1.3,1.46)],.09,.8); lock([H(.1,1.4,.98),H(-.1,1.45,1.22),H(-.4,1.35,1.36)],.07,.8); lock([H(0,1.5,.98),H(0,1.5,1.2),H(.1,1.45,1.36)],.06,.8); break;
      case 'pixie': cap(hairD); [-.74,-.44,-.15,.15,.44,.74].forEach((y,i)=>lock([H(y*.5,1.06,1.05),H(y*.9,.64,1.12),H(y*1.06,.36,1.1)],.115,.55,i%2?hairD:hair)); [-1,1].forEach(s=>lock([H(s*1.1,.6,1.07),H(s*1.42,.1,1.12),H(s*1.36,-.26,1.08)],.1,.55)); lock([H(0,1.5,.98),H(-.1,1.5,1.28),H(.25,1.36,1.5),H(.52,1.2,1.42)],.045,1); break;
      case 'wave': cap(hairD); lock([H(-1.2,.7,1.07),H(-.5,1.2,1.2),H(.3,1.22,1.3),H(.92,.92,1.38),H(1.08,.6,1.28)],blunt(.18),.7); lock([H(-1.4,.4,1.07),H(-.8,.95,1.17),H(0,1.0,1.24),H(.6,.72,1.26)],.15,.7,hairD); lock([H(1.3,.5,1.06),H(1.5,.1,1.1),H(1.4,-.3,1.06)],.11,.6); break;
      case 'flame': { const fl=piv(0,0,0,'flame'); const f1=CM('#ffd04a',{emissive:'#ffb030',emissiveIntensity:1.9,rim:0}), f2=CM('#ff9a3a',{emissive:'#ff6a20',emissiveIntensity:1.6,rim:0}); for(let i=0;i<10;i++){ const y=i*.63, p=i<6?.75:1.2; fl.add(tube([H(y,p,.98),H(y+.12,p+.2,1.36),H(y-.06,Math.min(1.52,p+.42),1.72+(i%3)*.16)],.17,i%2?f1:f2,{up:radial,flat:.75})); } fl.add(tube([H(0,1.5,.98),H(.1,1.5,1.5),H(-.1,1.5,2.05)],.2,f1,{flat:.8})); bake(fl); head.add(fl); break; }
      case 'mohawk': cap(skinD,1.02); [[0,.6],[0,.95],[0,1.3],[0,1.57],[PI,1.3],[PI,.95],[PI,.6]].forEach(([y,p],i)=>head.add(tube([H(y,p,1.0),H(y,p,1.36),H(y,p+(y?-.12:.12),1.64)],.13,i%2?hair:hairD,{up:V(1,0,0),flat:.5}))); break;
      case 'swoop': cap(hairD); [-.52,-.18,.18,.52].forEach((y,i)=>lock([H(y,.5,1.07),H(y*.95,.8,1.34),H(y*.8,1.2,1.37),H(y*.5,1.55,1.17)],blunt(.2),.7,i%2?hairD:hair)); [-1,1].forEach(s=>lock([H(s*1.25,.3,1.06),H(s*1.3,-.1,1.07),H(s*1.2,-.42,1.04)],.085,.5)); break;
      case 'quills': for(let i=0;i<40;i++){ const y=1.15+((i*.618)%1)*(2*PI-2.3), p=-.35+((i*.383)%1)*1.8; head.add(tube([H(y,p,.98),H(y,p,1.5+((i*7)%5)*.05)],.075,i%3?hair:hairD,{seg:6,n:4})); } for(let i=0;i<7;i++){ const y=-.9+i*.3; head.add(tube([H(y,1.05,.98),H(y,1.2,1.42)],.07,hair,{seg:6,n:4})); } break;
    }
    // species
    if(P.frog) [-1,1].forEach(s=>{ const e=H(s*.42,.95,1.0); head.add(sph(.165,skin,e.x,e.y+.02,e.z-.03)); head.add(sph(.118,M('#ffe680',{roughness:.25,envMapIntensity:1.2}),e.x,e.y+.04,e.z+.07)); head.add(sph(1,ink,e.x,e.y+.04,e.z+.165,{s:[.028,.07,.026]})); head.add(sph(.028,M('#ffffff',{emissive:'#ffffff',emissiveIntensity:.6}),e.x-.035,e.y+.085,e.z+.168)); head.add(mesh(new T.SphereGeometry(.17,20,10,0,6.2832,0,.9),skin,e.x,e.y+.02,e.z-.03,{r:[-.5,0,0]})); });
    if(P.bird){ const br=metal('#c8903a',.35), dk=metal('#8a5a1a',.4); head.add(loft([[0,.13,.11],[.14,.08,.07,0,0],[.3,.0,.0,0,0]],M('#e8a83a',{roughness:.35}),0,-.1,.34,{r:[PI/2+.2,0,0],seg:14})); head.add(loft([[0,.09,.05],[.2,.0,.0]],M('#c8882a',{roughness:.35}),0,-.17,.36,{r:[PI/2+.45,0,0],seg:12}));
      [-.2,0,.2].forEach((y,i)=>head.add(tube([H(y,1.3,.98),H(y*1.4,1.4,1.4),H(y*1.8-.1,1.25,1.72)],.1,c2,{up:radial,flat:.4}))); head.add(tor(HR*1.0,.03,dk,0,.1,0,{r:[PI/2,0,0]})); for(let i=0;i<8;i++){ const p=H(i*.785,.26,1.01); head.add(sph(.022,gold,p.x,p.y,p.z)); }
      [-1,1].forEach(s=>{ const e=fp(128+s*42,116,1.0), n=e.clone().normalize(); const eg=new T.Group(); eg.add(tor(.105,.03,dk,0,0,0)); eg.add(cyl(.1,.1,.05,br,0,0,-.01,{r:[PI/2,0,0]})); eg.add(sph(1,M('#ffcf70',{emissive:'#ffa030',emissiveIntensity:1.6,roughness:.15}),0,0,.02,{s:[.085,.085,.04]})); eg.add(sph(1,ink,0,0,.05,{s:[.036,.036,.018]})); eg.position.copy(e); eg.lookAt(e.clone().add(n)); head.add(eg); }); }
    if(P.candle){ head.add(cyl(.016,.016,.16,ink,0,HR+.05,0)); const f=sph(1,CM('#ffd070',{emissive:'#ffb030',emissiveIntensity:3,rim:0}),0,HR+.2,0,{s:[.065,.13,.065],cast:false,keep:true}); f.userData.flick=1; f.name='candleflame'; head.add(f); const wx=CM(shade(P.skin,.2),{roughness:.4}); [[-.9,.5,.3],[.7,.7,.26],[.2,.9,.2],[-.3,1.0,.18],[1.6,.4,.24],[2.6,.6,.3],[-2.2,.5,.22]].forEach(([y,p,l])=>head.add(tube([H(y,p+.3,1.0),H(y,p,1.05),H(y,p-l*2,1.04)],t=>.05*(.7+.5*t),wx,{up:radial,flat:.6}))); head.add(sph(1,wx,0,HR*.98,0,{s:[.2,.05,.2]})); }
    if(P.eyes==='button'){ [[86,-1,'#3a2a4a',.105],[170,1,'#5a8ae0',.09]].forEach(([px,s,col,r])=>{ const e=fp(px,124,1.0), n=e.clone().normalize(); const b=new T.Group(); b.add(cyl(r,r,.03,CM(col,{roughness:.35}),0,0,0,{r:[PI/2,0,0]})); b.add(tor(r*.82,.014,CM(shade(col,.25),{roughness:.35}),0,0,.014)); [[-1,-1],[1,1],[-1,1],[1,-1]].forEach(([a,c])=>b.add(sph(.013,ink,a*r*.3,c*r*.3,.018))); b.add(box(r*.9,.012,.008,CM('#f4ecd8'),0,0,.02,{r:[0,0,.78]})); b.add(box(r*.9,.012,.008,CM('#f4ecd8'),0,0,.02,{r:[0,0,-.78]})); b.position.copy(e); b.lookAt(e.clone().add(n)); head.add(b); }); }
    if(has('snout')){ const sn=CM(shade(P.skin,.22)); head.add(loft([[0,.17,.14],[.1,.13,.11],[.19,.06,.055]],sn,0,-.1,.3,{r:[PI/2,0,0],seg:16,capTop:true})); head.add(sph(.055,M('#2a1830',{roughness:.25}),0,-.085,.5)); }
    if(has('tusks')) [-1,1].forEach(s=>{ const p=fp(128+s*40,204,.97); head.add(tube([[p.x,p.y,p.z],[p.x+s*.012,p.y+.04,p.z+.03],[p.x+s*.024,p.y+.085,p.z+.03]],t=>.032*(1-t*.8),M('#fff8e0',{roughness:.35}))); });
    if(has('brow')||sp.shape==='brute'){ [-1,1].forEach(s=>head.add(tube([fp(128+s*14,80,1.0),fp(128+s*44,70,1.035),fp(128+s*74,78,1.0)],t=>.04*Math.sin(PI*(.15+.7*t)),skinD,{up:radial,flat:.55}))); }
    if(has('beard')){ const p=fp(128,236,.98); head.add(sph(1,hair,p.x,p.y-.04,p.z-.08,{s:[.22,.15,.14]})); [-1,0,1].forEach(s=>head.add(tube([[p.x+s*.09,p.y-.1,p.z-.02],[p.x+s*.1,p.y-.2,p.z+.0],[p.x+s*.07,p.y-.3,p.z-.02]],blunt(.06),s?hairD:hair))); [-1,1].forEach(s=>{ const q=fp(128+s*74,190,.98); head.add(sph(1,hair,q.x,q.y,q.z-.04,{s:[.08,.13,.08]})); }); }
    if(has('mustache')){ const mm=CM(P.hair==='#d8b070'?'#c8903a':(P.hair||'#5a3a24'),{roughness:.6}); [-1,1].forEach(s=>head.add(tube([fp(128,172,1.03),fp(128+s*26,178,1.06),fp(128+s*50,166,1.05),fp(128+s*58,154,1.06)],t=>.036*(1-t*.8),mm,{up:radial,flat:.8}))); }
    if(has('horns')) [-1,1].forEach(s=>head.add(tube([H(s*.5,1.05,.98),H(s*.7,1.2,1.3),H(s*.55,1.4,1.5)],t=>.07*(1-t*.9),M('#3a2a2a',{roughness:.35}))));
    if(has('leaf')||prop('flower')){ const p=H(.62,.95,1.1); head.add(sph(1,CM('#8fd06a'),p.x,p.y,p.z,{s:[.13,.03,.07],r:[0,0,.5]})); }
    if(prop('flower')){ const p=H(-.7,.82,1.13); for(let i=0;i<5;i++){ const a=i/5*6.283; head.add(sph(.052,CM('#ff9fc0'),p.x+Math.cos(a)*.06,p.y+Math.sin(a)*.06,p.z)); } head.add(sph(.04,CM('#ffd04a'),p.x,p.y,p.z+.03)); }
    if(prop('flowercrown')) for(let i=0;i<13;i++){ const p=H(i/13*6.283,.62,1.14); head.add(sph(.068,CM(['#ff9fc0','#ffd04a','#b98af5','#ffffff'][i%4]),p.x,p.y,p.z)); if(i%2) head.add(sph(1,CM('#6fc257'),p.x*1.02,p.y-.03,p.z*1.02,{s:[.07,.02,.04]})); }
    if(prop('goggles')){ head.add(tor(HR*1.06,.035,CM('#5a3a2a'),0,.2,0,{r:[PI/2-.2,0,0]})); [-1,1].forEach(s=>{ const e=H(s*.36,.58,1.1), n=e.clone().normalize(); const gg=new T.Group(); gg.add(cyl(.095,.105,.07,metal('#c8903a',.35),0,0,0,{r:[PI/2,0,0]})); gg.add(sph(1,M('#9fe0f0',{roughness:.08,metalness:.4,emissive:'#4aa8c8',emissiveIntensity:.5,envMapIntensity:1.6}),0,0,.03,{s:[.08,.08,.03]})); gg.position.copy(e); gg.lookAt(e.clone().add(n)); head.add(gg); }); }
    if(prop('antennae')) [-1,1].forEach(s=>{ head.add(tube([H(s*.3,1.3,.98),H(s*.4,1.36,1.5),H(s*.62,1.2,1.84)],[.014,.01],ink)); const p=H(s*.62,1.2,1.86); head.add(sph(.048,CM('#ffd04a',{emissive:'#ffb030',emissiveIntensity:1.5}),p.x,p.y,p.z)); });
    if(prop('partyhat')){ const hp=piv(.1,HR*.92,.02,'hatP'); hp.rotation.z=-.22; hp.add(loft([[0,.13],[.3,.0]],fabric('stripes','#ff7fa8','#fff0f6',3),0,0,0,{seg:14})); hp.add(sph(.04,CM('#ffd04a'),0,.31,0)); hp.add(tor(.13,.022,CM('#ffd04a'),0,0,0,{r:[PI/2,0,0]})); bake(hp,{outline:.018}); head.add(hp); }
    if(prop('bakerhat')){ const w=CM('#fbf6ee'); head.add(loft([[.28,.3],[.42,.31]],w,0,0,0,{seg:20})); head.add(loft([[.42,.3,.3,0,0,.05],[.56,.4,.4,0,0,.09],[.7,.36,.36,0,0,.07],[.78,.14,.14]],w,0,0,0,{seg:28,foldN:7,capTop:true})); }
    if(sp.glasses==='round'){ const fr=metal('#d9a54e',.3); [-1,1].forEach(s=>{ const e=fp(128+s*42,124,1.09), n=e.clone().normalize(); const m=tor(.118,.011,fr,0,0,0); m.userData.noOutline=true; m.position.copy(e); m.lookAt(e.clone().add(n)); head.add(m); const t=tube([fp(128+s*76,122,1.08),H(s*1.35,.1,1.03)],[.008,.008],fr,{seg:5}); t.userData.noOutline=true; head.add(t); }); const b=tube([fp(128-13,120,1.1),fp(128,117,1.11),fp(128+13,120,1.1)],[.009,.009],fr,{seg:5}); b.userData.noOutline=true; head.add(b); }
    if(sp.glasses==='square'){ const fr=M('#2a2a3a',{roughness:.35}); [-1,1].forEach(s=>{ const e=fp(128+s*42,124,1.09), n=e.clone().normalize(); const m=mesh(new T.TorusGeometry(.125,.012,6,4),fr,0,0,0); m.userData.noOutline=true; m.position.copy(e); m.lookAt(e.clone().add(n)); m.rotateZ(PI/4); m.scale.set(1,1,1); head.add(m); const t=tube([fp(128+s*78,122,1.08),H(s*1.35,.1,1.03)],[.008,.008],fr,{seg:5}); t.userData.noOutline=true; head.add(t); }); const b=tube([fp(128-13,122,1.1),fp(128,120,1.11),fp(128+13,122,1.1)],[.01,.01],fr,{seg:5}); b.userData.noOutline=true; head.add(b); }
    if(has('monocle')){ const e=fp(170,124,1.09), n=e.clone().normalize(); const m=tor(.125,.012,gold,0,0,0); m.userData.noOutline=true; m.position.copy(e); m.lookAt(e.clone().add(n)); head.add(m); const ch=tube([fp(196,140,1.08),fp(204,190,1.06),fp(186,236,.98)],[.005,.005],gold,{seg:5}); ch.userData.noOutline=true; head.add(ch); }
    // hats
    switch(P.hat){
      case 'witch': { const h=piv(0,.25,-.02,'hatP'); h.rotation.set(-.14,0,.1); const dd=dbl(hatM);
        h.add(loft([[-.05,.72,.72,0,0,.07],[-.01,.52,.52,0,0,.03],[.03,.31,.31]],dd,0,0,0,{seg:30,foldN:5})); h.add(loft([[.02,.315],[.2,.245,.245,0,.01],[.4,.155,.155,-.02,.05],[.56,.085,.085,-.03,.13],[.67,.04,.04,-.02,.23],[.71,.0,.0,0,.3]],hatM,0,0,0,{seg:20}));
        h.add(loft([[.035,.325],[.11,.292]],CM('#e8a83a',{roughness:.5}),0,0,0,{seg:20,lin:true})); if(key==='keeper'){ h.add(mesh(new T.CircleGeometry(.07,5),gold,0,.08,.315,{r:[-.2,0,0]})); h.add(sph(.03,CM('#fff6c0',{emissive:'#ffd070',emissiveIntensity:1.4}),.3,.69,-.02)); } else { h.add(rbox(.1,.1,.03,gold,0,.075,.31)); h.add(box(.2,.16,.02,fabric('plaid','#e8a83a','#c8502f',2),-.2,.3,.16,{r:[.3,-.9,.3]})); }
        bake(h,{outline:.018}); head.add(h); break; }
      case 'tophat': { const bk=CM('#1a1424',{roughness:.35}); head.add(loft([[.34,.38,.38],[.36,.3,.3],[.37,.2,.2]],dbl(bk),0,0,0,{seg:24})); head.add(loft([[.36,.215],[.56,.2],[.74,.225]],bk,0,0,0,{seg:22,capTop:true})); head.add(loft([[.37,.222],[.45,.216]],CM('#c8343a'),0,0,0,{seg:22,lin:true})); break; }
      case 'hood': cap(hatM,1.17,2.0,-.8); head.add(tube([H(PI,.9,1.15),H(PI,.5,1.4),H(PI,.1,1.5)],t=>.2*(1-t*.8),hatM)); break;
      case 'helm': { const st=metal('#c8d0e0',.28); head.add(mesh(capG(1.12,1.5,-.2),st,0,0,0,{s:[HR*1.12,HR*1.12,HR*1.12]})); head.add(tor(HR*1.1,.035,st,0,.06,0,{r:[PI/2-.2,0,0]})); head.add(rbox(.07,.34,.06,st,0,.13,.44,{r:[-.1,0,0]})); [-.3,0,.3].forEach((x,i)=>head.add(tube([H(0,1.5,1.1),H(PI,1.2-i*.1,1.5),H(PI,.6-i*.2,1.7),H(PI,.1-i*.2,1.6)],t=>.09*(.6+.4*Math.sin(PI*t)),CM('#e84a4a'),{flat:.5}))); break; }
      case 'feather': { const fm=CM('#5a2a4a',{roughness:.85}); head.add(loft([[.3,.52,.52,0,0,.04],[.33,.36,.36],[.35,.26,.26]],dbl(fm),0,0,0,{seg:26,foldN:4})); head.add(loft([[.34,.27],[.44,.25],[.5,.2]],fm,0,0,0,{seg:20,capTop:true})); head.add(loft([[.35,.275],[.4,.268]],CM('#f0c0e0'),0,0,0,{seg:20,lin:true})); head.add(tube([[.2,.4,.1],[.36,.62,-.02],[.46,.86,-.16],[.4,1.04,-.3]],t=>.085*Math.sin(PI*(.1+.9*t)),CM('#f0c0e0'),{up:V(0,0,1),flat:.25})); break; }
      case 'cap': head.add(mesh(capG(1.09,1.38,-.3),c1,0,0,0,{s:[HR*1.09,HR*1.09,HR*1.09]})); head.add(sph(1,c1,0,.2,.4,{s:[.24,.03,.17],r:[.25,0,0]})); head.add(sph(.04,c2,0,HR*1.1,-.08)); break;
      case 'tricorn': { const hm=CM(P.hatCol||'#1f2a44',{roughness:.8}); head.add(mesh(new T.CylinderGeometry(.6,.6,.05,3),hm,0,.34,-.02,{r:[0,PI,0]})); head.add(mesh(new T.CylinderGeometry(.5,.62,.15,3,1,true),dbl(hm),0,.42,-.02,{r:[0,PI,0]})); head.add(loft([[.34,.3],[.5,.27],[.58,.2]],hm,0,0,-.02,{seg:18,capTop:true})); head.add(tor(.3,.02,gold,0,.37,-.02,{r:[PI/2,0,0]})); head.add(tube([[-.24,.5,0],[-.34,.72,-.04],[-.3,.92,-.14]],t=>.07*Math.sin(PI*(.1+.9*t)),CM('#e84a4a'),{up:V(0,0,1),flat:.3})); break; }
    }
    return {head, faceMat, sh, fp, H};
  }

  /* ---------- body ---------- */
  const BODY = { slim:[[-.03,.15,.115,0],[.07,.165,.125,0],[.2,.14,.105,.004],[.32,.176,.118,.012],[.405,.168,.105,.005],[.452,.086,.07,0],[.5,.058,.055,0]],
    round:[[-.03,.19,.15,0],[.09,.215,.175,.015],[.21,.2,.16,.02],[.32,.19,.14,.015],[.405,.172,.115,.005],[.452,.09,.075,0],[.5,.06,.057,0]],
    barrel:[[-.03,.2,.15,0],[.09,.235,.19,.03],[.23,.25,.19,.03],[.35,.255,.17,.015],[.425,.22,.13,0],[.468,.1,.085,0],[.51,.07,.065,0]],
    small:[[-.03,.15,.12,0],[.07,.17,.135,.008],[.19,.155,.12,.008],[.3,.16,.115,.008],[.385,.15,.1,0],[.432,.08,.065,0],[.48,.055,.052,0]] };
  function build(key){
    const P=PORTRAITS[key], sp=SPEC[key]||{outfit:'robe',props:[],body:'slim'}; const w=sp.w||1, hsz=sp.head||1, hn=sp.hands||1, wl=Math.min(w,1.28);
    const outfit=sp.outfit, prop=x=>(sp.props||[]).includes(x), has=x=>(P.extra||[]).includes(x); const C1=P.clothes, C2=P.clothes2||'#ffffff', pat=sp.pat||['plain'];
    const skin=CM(P.skin,{roughness:.6}), c1=CM(C1,{roughness:.86}), c2=CM(C2,{roughness:.86}), boot=CM('#3a2418',{roughness:.5}), sole=CM('#1f1410',{roughness:.7}), gold=metal('#e9c06a'), steel=metal('#b8c0d0',.3), brass=metal('#c8903a',.35), leather=CM('#6a4226',{roughness:.6}), wax=CM(P.skin,{roughness:.42});
    const fab=(ru)=>fabric(pat[0],C1,pat[1]||C2,ru);
    const topM = outfit==='armor'?steel: outfit==='brass'?brass: outfit==='wax'?wax: outfit==='vest'?fabric('plain',C2,C2,4): fab(5);
    const botM = outfit==='armor'?steel: fab(9);
    const trouM = outfit==='armor'?steel: outfit==='brass'?brass: outfit==='doll'?fabric('stripes',C2,shade(C2,-.3),3): (outfit==='dress'||outfit==='robe'||outfit==='tutu')?CM('#f4ead8'): fabric('plain',shade(C1,-.52),'#000000',3);
    const root=new T.Group(); root.name='root'; const info={key,sc:sp.h||1,hunch:sp.hunch||0}; root.userData.info=info;
    const hips=piv(0,.52,0,'hips'); root.add(hips);
    const BT=BODY[sp.body||'slim'].map(r=>[r[0],r[1]*w,r[2]*(1+(w-1)*.6),r[3]]); const ringAt=y=>{ for(let i=0;i<BT.length-1;i++){ if(y<=BT[i+1][0]){ const a=BT[i],b=BT[i+1],t=(y-a[0])/(b[0]-a[0]); return [a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t,a[3]+(b[3]-a[3])*t]; } } return BT[BT.length-1].slice(1); };
    const fz=y=>{ const r=ringAt(y); return r[1]+r[2]; }, shX=BT[4][1]+.03;
    // legs
    if(sp.shoe!=='none') [-1,1].forEach(s=>{ const L=piv(s*.092*w,-.02,0,s<0?'legL':'legR'), K=piv(0,-.22,0,s<0?'kneeL':'kneeR'); L.add(K); const lm=(outfit==='doll'&&s>0)?fabric('dots',C1,C2,3):trouM, bare=sp.shoe==='bare';
      L.add(loft([[-.24,.064*wl],[-.12,.078*wl],[0,.086*wl],[.04,.07*wl]],lm,0,0,0,{seg:12,sub:3})); K.add(sph(.064*wl,lm,0,0,0)); K.add(loft([[-.21,.055*wl],[-.1,.064*wl],[.02,.066*wl]],(bare&&outfit!=='vest'&&outfit!=='tunic')?skin:lm,0,0,0,{seg:12,sub:3}));
      if(bare){ K.add(sph(1,skin,0,-.245,.05,{s:[.085*wl,.045,.15]})); for(let i=0;i<4;i++) K.add(sph(.026-(i*.003),skin,(-.045+i*.032)*wl*s,-.25,.185-i*.012)); }
      else if(sp.shoe==='slipper'){ K.add(sph(1,CM('#f7b8d0'),0,-.245,.045,{s:[.07,.045,.125]})); K.add(tube([[-.06,-.19,.0],[0,-.2,.06],[.06,-.19,0]],[.012,.012],CM('#f7b8d0'),{seg:5})); }
      else { const bm=outfit==='armor'?steel:boot; K.add(sph(1,bm,0,-.235,.05,{s:[.088*wl,.06,.15]})); K.add(rbox(.17*wl,.03,.29,outfit==='armor'?steel:sole,0,-.266,.05,{rad:.012})); if(sp.shoe==='boot'){ K.add(loft([[-.22,.075*wl],[-.1,.076*wl],[-.05,.082*wl]],bm,0,0,0,{seg:12,sub:2})); K.add(tor(.08*wl,.016,outfit==='armor'?steel:CM('#52341f'),0,-.05,0,{r:[PI/2,0,0]})); } else { K.add(tor(.066*wl,.014,bm,0,-.19,.0,{r:[PI/2,0,0]})); if(outfit==='coat'||outfit==='dress') K.add(rbox(.05,.03,.02,gold,0,-.2,.14)); } }
      hips.add(L); });
    else { const b=piv(0,-.02,0,'legL'); hips.add(b); const b2=piv(0,-.02,0,'legR'); hips.add(b2); b.add(piv(0,-.22,0,'kneeL')); b2.add(piv(0,-.22,0,'kneeR')); }
    hips.add(sph(1,outfit==='brass'?brass:trouM,0,.0,0,{s:[.175*w,.12,.135]}));
    if(outfit==='brass') [-1,1].forEach(s=>{ const K=hips.getObjectByName(s<0?'kneeL':'kneeR'), L=K.parent; L.add(cyl(.028,.028,.24,brass,0,-.11,0)); K.add(sph(.045,gold,0,0,0)); K.add(cyl(.024,.024,.24,brass,0,-.12,0)); [-.5,0,.5].forEach(a=>K.add(tube([[0,-.24,0],[Math.sin(a)*.06,-.27,.07],[Math.sin(a)*.1,-.275,.14]],[.02,.008],M('#e8a83a',{roughness:.4}),{seg:6}))); });
    // lower garment
    const F=dbl(botM), hemM=dbl(c2), skirt=(rings,o={})=>hips.add(loft(rings.map(r=>[r[0],r[1]*w,r[2]*w,0,0,r[3]||0]),o.m||F,0,0,0,Object.assign({seg:36,foldN:10},o)));
    const hem=(y,rx,rz,f,o={})=>hips.add(loft([[y,rx*w+.006,rz*w+.006,0,0,f],[y+.035,(rx-.012)*w+.006,(rz-.012)*w+.006,0,0,f*.92]],hemM,0,0,0,Object.assign({seg:36,foldN:10,lin:true},o)));
    if(outfit==='dress'){ skirt([[-.43,.37,.34,.07],[-.35,.352,.322,.065],[-.12,.26,.22,.03],[.1,.19,.15,.008],[.21,.165,.125,0]]); hem(-.43,.37,.34,.07); }
    else if(outfit==='robe'){ skirt([[-.48,.31,.28,.06],[-.38,.3,.27,.055],[-.12,.235,.2,.025],[.21,.165,.125,0]]); hem(-.48,.31,.28,.06); }
    else if(outfit==='tunic'){ skirt([[-.13,.265,.215,.045],[-.02,.235,.19,.03],[.21,.165,.125,0]]); hem(-.13,.265,.215,.045); }
    else if(outfit==='coat'){ skirt([[-.32,.3,.27,.04],[-.2,.28,.25,.035],[.21,.168,.128,0]],{ps:.36,pl:6.2832-.72}); hem(-.32,.3,.27,.04,{ps:.36,pl:6.2832-.72}); }
    else if(outfit==='tutu'){ skirt([[.0,.4,.38,.1],[.1,.26,.24,.05],[.2,.16,.13,0]],{foldN:14}); skirt([[-.05,.36,.34,.09],[.08,.24,.22,.04],[.2,.16,.13,0]],{foldN:11,foldPh:1,m:dbl(CM(shade(C1,.3)))}); }
    else if(outfit==='armor'){ skirt([[-.14,.27,.22,.0],[.2,.19,.15,0]],{foldN:1,seg:20}); hips.add(rbox(.2,.36,.02,fabric('plain','#c8343a','#c8343a',1),0,-.03,.21,{rad:.008})); hips.add(mesh(new T.CircleGeometry(.05,4),gold,0,.02,.222)); }
    else if(outfit==='doll'){ skirt([[-.1,.28,.24,.05],[.2,.17,.13,0]],{m:dbl(fabric('patch',C2,C1,6))}); }
    else if(outfit==='wax'){ skirt([[-.52,.38,.36,.05],[-.46,.385,.365,.04],[0,.27,.22,0],[.2,.2,.16,0]],{m:dbl(wax),foldN:6}); [[.6,-.3,.3],[-.9,-.2,.26],[2.4,-.34,.3],[-2.2,-.1,.24],[1.6,-.4,.34]].forEach(([a,y,r])=>hips.add(tube([[Math.sin(a)*r,y+.2,Math.cos(a)*r],[Math.sin(a)*r*1.06,y,Math.cos(a)*r*1.06],[Math.sin(a)*r*1.1,y-.14,Math.cos(a)*r*1.1]],t=>.04*(.7+.6*t),CM(shade(P.skin,.2),{roughness:.4})))); }
    // torso
    const torso=piv(0,0,0,'torso'); hips.add(torso); torso.rotation.x=info.hunch;
    torso.add(loft(BT,topM,0,0,0,{seg:24,sub:5})); torso.add(cyl(.062,.068,.1,(outfit==='brass')?brass:skin,0,BT[6][0],0));
    const waist=ringAt(.2); if(['tunic','coat','vest','robe','doll'].includes(outfit)){ torso.add(loft([[.172,waist[0]+.014,waist[1]+.014],[.222,waist[0]+.016,waist[1]+.016]],outfit==='robe'?CM('#c8a878'):leather,0,0,waist[2],{seg:22,lin:true,capTop:false})); if(outfit!=='robe') torso.add(rbox(.07,.062,.022,gold,0,.197,waist[1]+waist[2]+.02,{rad:.01})); else torso.add(tube([[.06,.19,waist[1]+.03],[.08,.08,waist[1]+.06],[.07,-.04,waist[1]+.07]],[.014,.014],CM('#c8a878'),{seg:6})); }
    const neckY=BT[5][0];
    if(sp.collar==='round') torso.add(loft([[neckY-.012,.1,.085],[neckY+.03,.078,.068]],c2,0,0,0,{seg:18,lin:true}));
    if(sp.collar==='ruff') torso.add(loft([[neckY-.03,.17,.15,0,0,.13],[neckY+.0,.12,.1,0,0,.08],[neckY+.03,.075,.066]],dbl(CM('#fffaf2')),0,0,0,{seg:36,foldN:12}));
    if(sp.collar==='scarf'){ torso.add(tor(.092,.042,c2,0,neckY+.02,0,{r:[PI/2,0,0]})); torso.add(tube([[.06,neckY,.08],[.1,neckY-.12,fz(.3)+.02],[.09,neckY-.24,fz(.25)+.03]],blunt2(.045),c2,{up:V(0,0,1),flat:.4})); }
    if(sp.collar==='lapel'){ [-1,1].forEach(s=>torso.add(tube([[s*.03,neckY+.02,.06],[s*.085,neckY-.07,fz(.38)+.008],[s*.03,neckY-.2,fz(.26)+.01]],t=>.05*Math.sin(PI*(.12+.8*t)),dbl(CM(shade(C1,.18))),{up:V(0,0,1),flat:.25}))); torso.add(sph(1,c2,0,neckY-.06,fz(.38)-.012,{s:[.05,.09,.02]})); for(let i=0;i<3;i++) torso.add(sph(.017,gold,.03,.3-i*.07,fz(.3-i*.07)+.006)); }
    if(sp.collar==='high'){ torso.add(loft([[neckY-.04,.15,.13],[neckY+.14,.22,.19,-.03]],dbl(CM('#c8343a')),0,0,-.01,{ps:PI*.5-.25,pl:PI+.5,seg:16,lin:true})); }
    if(outfit==='vest'){ torso.add(loft(BT.slice(0,5).map(r=>[r[0]+.012,r[1]+.014,r[2]+.014,r[3]]),dbl(fab(5)),0,0,0,{ps:.42,pl:6.2832-.84,seg:22})); for(let i=0;i<2;i++) torso.add(sph(.017,gold,.062,.26-i*.09,fz(.26-i*.09)+.006)); }
    if(outfit==='dress'||outfit==='tutu'){ torso.add(sph(1,c2,0,.385,fz(.385)-.02,{s:[.07*w,.045,.025]})); for(let i=0;i<3;i++) torso.add(sph(.014,c2,0,.33-i*.055,fz(.33-i*.055)+.002)); torso.add(loft([[.185,waist[0]+.008,waist[1]+.008],[.225,waist[0]+.01,waist[1]+.01]],c2,0,0,waist[2],{seg:22,lin:true})); torso.add(tube([[-.06,.2,-waist[1]-.02],[-.13,.25,-waist[1]-.07],[-.05,.24,-waist[1]-.04]],[.03,.03],c2,{seg:6})); torso.add(tube([[.06,.2,-waist[1]-.02],[.13,.25,-waist[1]-.07],[.05,.24,-waist[1]-.04]],[.03,.03],c2,{seg:6})); }
    if(outfit==='armor'){ [-1,1].forEach(s=>torso.add(sph(1,steel,s*(shX+.02),.415,0,{s:[.125,.09,.125]}))); torso.add(tor(.09,.03,steel,0,neckY+.015,0,{r:[PI/2,0,0]})); torso.add(tube([[0,.4,fz(.4)],[0,.28,fz(.28)+.012],[0,.14,fz(.14)+.004]],[.02,.02],gold,{seg:6})); torso.add(loft([[.16,waist[0]+.02,waist[1]+.02],[.22,waist[0]+.022,waist[1]+.022]],gold,0,0,waist[2],{seg:20,lin:true})); }
    if(outfit==='doll'){ torso.add(rbox(.12,.11,.02,fabric('plaid',C2,'#c8502f',2),-.06,.3,fz(.3)+.002,{r:[0,-.2,.2],rad:.006})); torso.add(sph(.03,CM('#e8a83a'),.07,.33,fz(.33)+.004)); torso.add(sph(.026,CM('#8fd0f0'),.05,.1,fz(.1)+.004)); const ik=M('#2a1830'); for(let i=0;i<5;i++) torso.add(box(.036,.008,.01,ik,0,.1+i*.065,fz(.1+i*.065)+.004,{r:[0,0,.5]})); }
    if(outfit==='brass'){ [.1,.3].forEach(y=>{ const r=ringAt(y); torso.add(loft([[y-.015,r[0]+.01,r[1]+.01],[y+.015,r[0]+.01,r[1]+.01]],metal('#8a5a1a',.4),0,0,r[2],{seg:22,lin:true})); }); const gear=piv(0,.21,fz(.21)+.01,'gear'); gear.userData.keep=true; gear.add(tor(.07,.02,gold,0,0,0)); for(let i=0;i<8;i++){ const a=i/8*6.283; gear.add(box(.03,.03,.03,gold,Math.cos(a)*.095,Math.sin(a)*.095,0,{r:[0,0,a]})); } gear.add(box(.14,.02,.02,gold,0,0,0)); gear.add(box(.02,.14,.02,gold,0,0,0)); torso.add(gear); for(let i=0;i<7;i++){ const a=i/7*6.283, r=ringAt(.4); torso.add(sph(.014,gold,Math.sin(a)*r[0],.4,Math.cos(a)*r[1]+r[2])); } }
    // arms
    const slv = outfit==='armor'?steel: outfit==='brass'?brass: outfit==='wax'?wax: outfit==='vest'?fabric('plain',C2,C2,2): fabric(pat[0]==='patch'?'plain':pat[0],C1,pat[1]||C2,2);
    [-1,1].forEach(s=>{ const m=(outfit==='doll'&&s>0)?fabric('hstripes',C2,C1,2):slv; const A=piv(s*shX,.405,0,s<0?'armL':'armR'); A.rotation.z=s*.2; const E=piv(0,-.19,0,s<0?'elbowL':'elbowR'); E.rotation.x=-.38; A.add(E);
      const sv=sp.sleeve, bareUp=false, bareFore=sv==='short'||sv==='rolled';
      if(sv==='puff'){ A.add(loft([[-.12,.062,.062,0,0,.0],[-.06,.1,.1,0,0,.06],[.02,.105,.105,0,0,.07],[.06,.05,.05]],m,0,0,0,{seg:18,foldN:8,capBot:true})); A.add(loft([[-.2,.052],[-.1,.056]],m,0,0,0,{seg:12,sub:2})); }
      else { A.add(sph(1,m,0,0,0,{s:[.078,.074,.078]})); A.add(loft([[-.2,.054],[-.1,.062],[.0,.07]],m,0,0,0,{seg:12,sub:3})); }
      if(sv==='short'){ A.add(loft([[-.13,.07],[-.11,.072]],c2,0,0,0,{seg:12,lin:true})); }
      E.add(sph(.054,bareFore?skin:m,0,0,0));
      if(sv==='bell'){ E.add(loft([[-.19,.105,.105,0,0,.06],[-.1,.066],[0,.056]],dbl(m),0,0,0,{seg:20,foldN:7})); E.add(loft([[-.19,.05],[-.05,.05]],skin,0,0,0,{seg:10,sub:2})); }
      else E.add(loft([[-.17,.046],[-.08,.054],[0,.055]],bareFore?skin:m,0,0,0,{seg:12,sub:3}));
      if(sv==='rolled'){ E.add(tor(.06,.022,m,0,.012,0,{r:[PI/2,0,0]})); }
      if(outfit==='armor'){ E.add(loft([[-.17,.06],[-.06,.064]],steel,0,0,0,{seg:12,lin:true})); A.add(tor(.06,.016,gold,0,-.17,0,{r:[PI/2,0,0]})); }
      else if(!bareFore&&sv!=='bell'&&outfit!=='wax'&&outfit!=='brass') E.add(loft([[-.175,.054],[-.14,.057]],c2,0,0,0,{seg:12,lin:true}));
      if(prop('bracers')) E.add(loft([[-.165,.054],[-.06,.062]],leather,0,0,0,{seg:12,lin:true}));
      const hm=outfit==='armor'?steel:outfit==='brass'?brass:skin; E.add(sph(1,hm,0,-.215,.008,{s:[.058*hn,.07*hn,.046*hn]})); E.add(sph(1,hm,s*-.045*hn,-.2,.03,{s:[.024*hn,.036*hn,.024*hn],r:[0,0,s*.5]}));
      if(has('skull')){ for(let i=0;i<3;i++) E.add(box(.012,.05,.012,M('#2a1830'),(-.02+i*.02)*hn,-.24,.03)); }
      torso.add(A); });
    const elbowL=torso.getObjectByName('elbowL'), elbowR=torso.getObjectByName('elbowR');
    // head
    const Hd=buildHead(key,P,sp); const headP=piv(0,BT[6][0]+.265*hsz,0,'head'); Hd.head.scale.setScalar(.75*hsz); Hd.head.name='headInner'; headP.add(Hd.head); torso.add(headP);
    // ---- props ----
    const neck=neckY;
    if(prop('shawl')){ torso.add(loft([[.27,.27*w,.21,0,0,.05],[.36,.25*w,.19,0,0,.04],[neck,.11,.095]],dbl(fabric('knit',C2,shade(C2,-.2),6)),0,0,0,{seg:30,foldN:9})); torso.add(sph(.03,gold,0,.37,fz(.37)+.06)); }
    if(prop('cape')||prop('cloak')){ const cp=piv(0,neck,-.02,'cape'); const cm=dbl(prop('cloak')?fabric('plain',P.hatCol||'#3a5a34','#000000',6):fabric('plain','#221a2e','#000000',6)); cp.add(loft([[-.82,.4*w,.36,0,0,.07],[-.5,.33*w,.3,0,0,.05],[-.08,.23*w,.19,0,0,.02],[.0,.12,.1,0,0,0]],cm,0,0,0,{ps:PI*.5+.2,pl:PI-.4,seg:22,foldN:11})); if(prop('cape')) cp.add(loft([[-.8,.385*w,.345,0,0,.07],[-.5,.318*w,.288,0,0,.05],[-.08,.218*w,.178,0,0,.02]],dbl(CM('#a82a34')),0,0,0,{ps:PI*.5+.24,pl:PI-.48,seg:22,foldN:11})); bake(cp,{outline:.011}); torso.add(cp); torso.add(sph(.034,prop('cape')?CM('#c8343a',{roughness:.2}):gold,prop('cape')?0:.07,neck-.02,fz(.43)+.03)); }
    if(prop('leafcloak')){ for(let i=0;i<11;i++){ const a=PI*.5+.25+i/10*(PI-.5); torso.add(sph(1,CM(['#4f9a3c','#6fc257','#3f7d34'][i%3]),Math.sin(a)*.23*w,.36-(i%3)*.11,Math.cos(a)*.2,{s:[.13,.21,.03],r:[.3,a,0]})); } [-1,1].forEach(s=>{ torso.add(sph(1,CM('#6fc257'),s*.2*w,.435,.02,{s:[.13,.045,.12]})); torso.add(sph(1,CM('#4f9a3c'),s*.15*w,.42,.1,{s:[.09,.03,.08],r:[.4,0,0]})); }); }
    if(prop('apron')){ const am=dbl(fabric('plain','#f7f0e2','#000000',3)); hips.add(loft([[-.3,.31*w,.28,0,0,.02],[-.1,.25*w,.21,0,0,.01],[.21,.175*w,.135,0,0,0]],am,0,0,.012,{ps:-.8,pl:1.6,seg:14,foldN:6})); torso.add(loft(BT.slice(1,5).map(r=>[r[0],r[1]+.012,r[2]+.012,r[3]]),am,0,0,.004,{ps:-.62,pl:1.24,seg:12})); torso.add(rbox(.12,.09,.012,CM('#eadfca'),0,.02,fz(.02)+.07,{rad:.008})); [-1,1].forEach(s=>torso.add(tube([[s*.09,.4,fz(.4)+.012],[s*.11,.46,.02],[s*.08,.42,-.1]],[.012,.012],CM('#eadfca'),{seg:5}))); }
    if(prop('potionbelt')){ [[-.13,'#ff6fae',0],[-.19,'#6ad8ff',1]].forEach(([x,col,i])=>{ const a=x<0?-1:1; const zz=Math.sqrt(Math.max(0,1-Math.pow(x/(waist[0]+.03),2)))*(waist[1]+.03)+waist[2]; torso.add(loft([[.05,.0],[.055,.028],[.1,.03],[.13,.014],[.15,.014]],M(col,{emissive:col,emissiveIntensity:.8,roughness:.15}),x,0,zz,{seg:10,lin:true})); torso.add(cyl(.016,.014,.02,CM('#b8865a'),x,.16,zz)); }); torso.add(sph(1,leather,.17*w,.1,.06,{s:[.06,.07,.045]})); torso.add(rbox(.07,.03,.05,CM('#52341f'),.17*w,.15,.06,{rad:.01})); }
    if(prop('satchel')){ torso.add(tor(.26,.018,leather,0,.24,0,{r:[PI/2,.75,0],s:[.76*w,.86,1]})); torso.add(rbox(.18,.15,.075,leather,.2*w,.02,.06,{r:[0,.2,0],rad:.02})); torso.add(rbox(.185,.075,.08,CM('#8a5632'),.2*w,.075,.064,{r:[0,.2,0],rad:.02})); torso.add(sph(.016,gold,.212*w,.045,.108)); }
    if(prop('sash')){ torso.add(tor(.26,.03,CM('#c8343a'),0,.24,0,{r:[PI/2,-.75,0],s:[.76*w,.86,1]})); torso.add(tube([[-.16*w,.06,.08],[-.2*w,-.08,.1],[-.17*w,-.2,.1]],blunt2(.05),CM('#c8343a'),{up:V(0,0,1),flat:.3})); }
    if(prop('rope')){ for(let i=0;i<3;i++) torso.add(tor(.115-i*.004,.028,CM(i%2?'#b89868':'#c8a878'),-.2*w,.3-i*.012,-.03+i*.014,{r:[i*.08,.4+i*.06,.3]})); }
    if(prop('bird')){ const b=piv(.2*w,.49,-.02,'bird'); const bl=CM('#6ab8ff'); b.add(sph(1,bl,0,.05,0,{s:[.055,.052,.066]})); b.add(sph(.042,bl,0,.11,.04)); b.add(sph(1,CM('#f4f8ff'),0,.04,.035,{s:[.036,.034,.03]})); b.add(cone(.014,.04,CM('#ffb030'),0,.108,.086,{r:[PI/2,0,0]})); b.add(tube([[0,.05,-.05],[0,.06,-.1],[0,.1,-.15]],t=>.03*(1-t*.5),CM('#3a8ad8'),{up:V(0,1,0),flat:.35})); [-1,1].forEach(s=>{ b.add(sph(.009,M('#1a1020'),s*.02,.122,.072)); b.add(sph(1,CM('#4a9ae8'),s*.05,.055,-.005,{s:[.015,.035,.045]})); }); bake(b,{outline:.008}); torso.add(b); }
    if(prop('pouch')){ torso.add(sph(1,leather,-.19*w,.1,.08,{s:[.065,.072,.052]})); torso.add(tor(.03,.01,CM('#c8a878'),-.19*w,.17,.08,{r:[PI/2,0,0]})); }
    if(prop('quiver')){ const q=new T.Group(); q.add(loft([[-.2,.045],[.18,.055],[.2,.05]],leather,0,0,0,{seg:12,lin:true,capBot:true})); q.add(tor(.055,.012,gold,0,.17,0,{r:[PI/2,0,0]})); [[-.02,0],[.02,.01],[0,-.02]].forEach(([x,z],i)=>{ q.add(cyl(.006,.006,.22,CM('#c8a878'),x,.29,z)); q.add(tube([[x,.34,z],[x,.39,z],[x,.44,z]],t=>.022*Math.sin(PI*(.1+.9*t)),CM(['#e84a4a','#f0f0f0','#6fc257'][i]),{up:V(1,0,0),flat:.25,seg:6})); }); q.position.set(.08,.28,-.2); q.rotation.set(.1,0,-.45); torso.add(q); torso.add(tube([[-.2,.5,-.2],[-.3,.2,-.24],[-.2,-.12,-.2]],[.012,.012],CM('#7a4a2a'),{seg:6})); }
    if(prop('badge')){ const z=fz(.36); torso.add(mesh(new T.CircleGeometry(.036,5),gold,-.09*w,.36,z*.94+.008,{r:[0,-.25,0]})); }
    if(prop('epaulettes')) [-1,1].forEach(s=>{ torso.add(sph(1,gold,s*(shX+.01),.455,0,{s:[.085,.022,.07]})); for(let i=0;i<5;i++) torso.add(cyl(.008,.008,.045,gold,s*(shX+.05),.43,-.04+i*.02)); });
    if(prop('shells')){ for(let i=0;i<8;i++){ const a=-1+i*.286; torso.add(sph(.022,M(i%2?'#ffe0e8':'#bfe8ff',{roughness:.25}),Math.sin(a)*.125,neck-.01-Math.cos(a)*.07,.085+Math.cos(a)*.065)); } }
    if(prop('cravat')){ torso.add(sph(1,CM('#ffffff'),0,neck-.035,fz(.41)+.0,{s:[.075,.06,.035]})); torso.add(sph(1,CM('#f4f0f8'),0,neck-.1,fz(.36)+.004,{s:[.055,.06,.025]})); torso.add(sph(.018,CM('#c8343a',{roughness:.2}),0,neck-.03,fz(.41)+.036)); }
    if(prop('vestfront')){ torso.add(loft(BT.slice(1,4).map(r=>[r[0],r[1]+.008,r[2]+.008,r[3]]),CM(key==='croak'?'#a82a34':'#e8c04a',{roughness:.6}),0,0,.002,{ps:-.42,pl:.84,seg:10})); for(let i=0;i<3;i++) torso.add(sph(.014,gold,0,.3-i*.07,fz(.3-i*.07)+.012)); }
    if(prop('tail')){ const tp=piv(0,.0,-.1,'tail'); const tm=CM(key==='puddle'?shade(P.skin,.12):P.skin); if(key==='nib'){ tp.add(tube([[0,0,0],[.04,-.06,-.2],[.1,.06,-.4],[.06,.24,-.48]],[.03,.018],tm)); tp.add(cone(.05,.1,tm,.055,.3,-.49,{r:[-.2,0,.1]})); }
      else { tp.add(tube([[0,0,0],[.02,-.1,-.2],[.06,-.2,-.4],[.03,-.22,-.56]],t=>.095*(1-t*.82),tm)); if(key==='tamsin'){ const f=sph(1,CM('#ffd04a',{emissive:'#ff8a20',emissiveIntensity:2.6,rim:0}),.03,-.19,-.6,{s:[.06,.1,.06],keep:true,cast:false}); f.userData.flick=2; tp.add(f); } if(key==='puddle'){ tp.add(sph(1,CM(shade(P.skin,.3)),.03,-.22,-.62,{s:[.02,.13,.15]})); } }
      bake(tp,{outline:.011}); hips.add(tp); }
    if(prop('wings')){ [-1,1].forEach(s=>{ const wp=piv(s*.05,.34,-.12,s<0?'wingL':'wingR'); wp.userData.side=s; const mat=new T.MeshBasicMaterial({map:TEX.wing,transparent:true,side:T.DoubleSide,depthWrite:false,color:new T.Color(1.3,1.3,1.4)}); const g=new T.PlaneGeometry(.52,.94); g.translate(.26,.2,0); const m=new T.Mesh(g,mat); if(s<0) m.scale.x=-1; wp.add(m); const g2=new T.PlaneGeometry(.36,.52); g2.translate(.18,-.2,0); const m2=new T.Mesh(g2,mat); if(s<0) m2.scale.x=-1; m2.rotation.z=s*-.3; wp.add(m2); torso.add(wp); }); }
    // held props (attached to the hand end of a forearm)
    const hold=(E,g)=>{ g.position.y-=.24; E.add(g); };
    if(prop('basket')){ const g=new T.Group(); g.add(loft([[-.15,.075],[-.05,.105]],dbl(fabric('knit','#c8a060','#8a6830',5)),0,0,0,{seg:16,lin:true,capBot:true})); g.add(tor(.105,.012,CM('#a88040'),0,-.05,0,{r:[PI/2,0,0]})); g.add(tor(.09,.011,CM('#a88040'),0,-.03,0)); [['#ff7fa8',-.035],['#b98af5',.04],['#8fd0f0',0]].forEach(([c,x],i)=>g.add(sph(.045,fabric('knit',c,shade(c,-.25),3),x,-.045+(i===2?.03:0),i===2?.03:0))); hold(elbowL,g); info.holdL=1; }
    if(prop('cane')){ const g=new T.Group(); g.add(cyl(.013,.011,.5,CM('#2a1a14',{roughness:.35}),0,-.2,.03)); g.add(sph(.032,gold,0,.055,.03)); g.add(tor(.014,.006,gold,0,.02,.03,{r:[PI/2,0,0]})); hold(elbowR,g); info.caneR=1; }
    if(prop('staff')){ const g=new T.Group(); g.add(tube([[0,-.62,.03],[.01,.0,.03],[-.01,.5,.03],[.05,.68,.03],[.0,.76,.06]],[.02,.016],CM('#7a5a34',{roughness:.7}),{seg:7})); [[.05,.7],[-.03,.62],[.02,.8]].forEach(([x,y],i)=>g.add(sph(1,CM(i%2?'#6fc257':'#8fd06a'),x,y,.05,{s:[.06,.02,.035],r:[0,i,.6]}))); g.add(sph(.03,CM('#fff6c0',{emissive:'#ffe080',emissiveIntensity:1.5}),.0,.78,.06)); hold(elbowR,g); info.caneR=1; }
    if(prop('parasol')){ const g=new T.Group(); g.add(cyl(.01,.01,.9,CM('#5a3a2a'),0,.3,.03)); g.add(loft([[.66,.44,.44,0,0,.05],[.76,.2,.2,0,0,.02],[.82,.0,.0]],dbl(fabric('stripes','#f0c8e8','#fff4fb',8)),0,0,.03,{seg:32,foldN:8})); g.add(sph(.025,gold,0,.84,.03)); hold(elbowR,g); info.holdR=1; }
    if(prop('clipboard')){ const g=new T.Group(); g.add(rbox(.19,.25,.016,CM('#8a5632'),0,.02,.06,{r:[-.5,0,0],rad:.01})); g.add(rbox(.16,.21,.01,CM('#fbf6ee'),0,.025,.07,{r:[-.5,0,0],rad:.004})); for(let i=0;i<4;i++) g.add(box(.11,.006,.004,M('#8a8a9a'),0,.07-i*.03,.058+i*.016,{r:[-.5,0,0]})); g.add(rbox(.07,.025,.02,steel,0,.11,.02,{r:[-.5,0,0],rad:.006})); hold(elbowL,g); info.holdL=1; }
    if(prop('rollingpin')){ const g=new T.Group(); g.add(cyl(.036,.036,.24,CM('#d8b080'),0,0,.02,{r:[0,0,PI/2]})); g.add(cyl(.014,.014,.4,CM('#a87840'),0,0,.02,{r:[0,0,PI/2]})); hold(elbowR,g); info.holdR=1; }
    if(prop('bell')){ const g=piv(0,-.24,.02,'bell'); g.add(lathe([[.0,.0],[.035,.0],[.05,-.06],[.085,-.13],[.098,-.15]],M('#e9c06a',{metalness:.9,roughness:.25,envMapIntensity:1.4,side:T.DoubleSide}),0,0,0)); g.add(sph(.022,gold,0,-.14,0)); g.add(cyl(.012,.012,.07,CM('#5a3a2a'),0,.03,0)); bake(g,{outline:.008}); elbowR.add(g); info.holdR=1; }
    if(prop('hammer')){ const g=new T.Group(); g.add(cyl(.017,.017,.36,CM('#8a5632'),0,.08,.03)); g.add(rbox(.17,.085,.085,metal('#5a5a6a',.4),0,.26,.03,{rad:.015})); hold(elbowR,g); info.holdR=1; }
    if(prop('shield')){ const g=new T.Group(); g.add(cyl(.21,.21,.025,steel,-.07,.06,0,{r:[0,0,PI/2]})); g.add(cyl(.165,.165,.03,fabric('diamond','#c8343a','#e8c06a',4),-.075,.06,0,{r:[0,0,PI/2]})); g.add(sph(.045,gold,-.095,.06,0)); hold(elbowL,g); info.holdL=1; }
    if(prop('handbag')){ const g=new T.Group(); g.add(rbox(.16,.115,.065,CM('#8f4a7a'),0,-.12,0,{rad:.02})); g.add(tor(.05,.01,gold,0,-.05,0)); g.add(sph(.015,gold,0,-.09,.035)); hold(elbowL,g); }
    if(prop('parcel')){ const g=new T.Group(); g.add(rbox(.21,.17,.17,CM('#c8a060'),0,0,.1,{rad:.012})); g.add(box(.215,.022,.175,CM('#c8343a'),0,0,.1)); g.add(box(.022,.175,.175,CM('#c8343a'),0,0,.1)); g.add(tor(.03,.01,CM('#c8343a'),0,.1,.1)); hold(elbowR,g); info.holdR=1; info.holdL=1; }
    if(prop('scroll')){ const g=new T.Group(); g.add(cyl(.032,.032,.22,CM('#f6ecd4'),0,.02,.03,{r:[0,0,PI/2]})); [-1,1].forEach(s=>g.add(cyl(.036,.036,.02,CM('#c8a878'),s*.11,.02,.03,{r:[0,0,PI/2]}))); g.add(tube([[.06,.04,.03],[.1,.16,.03],[.12,.28,.01]],t=>.03*Math.sin(PI*(.1+.9*t)),CM('#f4f4f8'),{up:V(0,0,1),flat:.25,seg:6})); hold(elbowL,g); info.holdL=1; }
    // bake static pieces per animated part and ink the outline
    ['elbowL','elbowR','armL','armR','kneeL','kneeR','legL','legR'].forEach(n=>{ const g=root.getObjectByName(n); if(g) bake(g,{outline:.011}); });
    bake(Hd.head,{outline:.018}); Hd.head.userData.pivot=true; bake(headP,{outline:.011}); bake(torso,{outline:.011}); bake(hips,{outline:.011});
    root.scale.setScalar(info.sc);
    return root;
  }
  const blunt2=r=>t=>r*(.6+.4*Math.sin(PI*Math.min(1,.1+t*.95)));

  /* ---------- instances ---------- */
  const PROTO={};
  const RIGN=['hips','torso','head','headInner','armL','armR','elbowL','elbowR','legL','legR','kneeL','kneeR','cape','tail','wingL','wingR','bird','gear','bell','hatP','flame','face'];
  function proto(key){ return PROTO[key]||(PROTO[key]=build(key)); }
  function rigOf(g){ const r={}; RIGN.forEach(n=>{ const o=g.getObjectByName(n); if(o) r[n]=o; }); r.flick=[]; g.traverse(o=>{ if(o.userData.flick) r.flick.push(o); }); return r; }
  function spawn(key){ const p=proto(key); const g=p.clone(true); const rig=rigOf(g); if(rig.face){ rig.face.material=rig.face.material.clone(); rig.face.material.map=faceTex(key,'neutral'); } return {g, rig, info:p.userData.info, key, face:'neutral', ph:R()*6}; }
  function setFace(c, expr, variant=''){ if(!c.rig.face) return; const t=faceTex(c.key,expr,(expr==='neutral'||expr==='think'||variant==='talk')?variant:''); if(c.rig.face.material.map!==t){ c.rig.face.material.map=t; } }
  /* two-bone reach: puts the hand of one arm on a point given in world space */
  const _q=new T.Quaternion(), _u=new T.Vector3(), _d=new T.Vector3();
  function reach(c, side, world, w=1){ const A=c.rig[side>0?'armR':'armL'], E=c.rig[side>0?'elbowR':'elbowL'], L1=.19, L2=.215; _d.copy(world); c.rig.torso.worldToLocal(_d); _d.sub(A.position); let D=_d.length(); D=Math.min(L1+L2-.004,Math.max(Math.abs(L1-L2)+.01,D));
    const cg=(L1*L1+L2*L2-D*D)/(2*L1*L2), beta=PI-Math.acos(Math.max(-1,Math.min(1,cg))); _u.set(0,-L1-L2*Math.cos(beta),L2*Math.sin(beta)).normalize(); _q.setFromUnitVectors(_u,_d.normalize());
    if(w>=1){ A.quaternion.copy(_q); E.rotation.x=-beta; } else { A.quaternion.slerp(_q,w); E.rotation.x+=(-beta-E.rotation.x)*w; } }

  /* ---------- animation ---------- */
  function animate(c, dt, time){
    const r=c.rig, info=c.info, ph=c.ph||0, k=1-Math.exp(-dt*12); const L=(o,p,v)=>{ if(o) o.rotation[p]+=(v-o.rotation[p])*k; };
    let legL=0, legR=0, knL=.04, knR=.04, aL=0, aR=0, zL=-.2, zR=.2, eL=-.38, eR=-.38, bob=0, lean=info.hunch, twist=0, sway=0, hx=0, hy=0, hz=0, tz=0, sq=1;
    const idle=Math.sin(time*1.7+ph), slow=Math.sin(time*.55+ph*1.7);
    if(c.moving){ const f=c.stride||0, s=Math.sin(f), cs=Math.cos(f); legL=-s*.66; legR=s*.66; knL=.1+Math.max(0,cs)*.95; knR=.1+Math.max(0,-cs)*.95; aL=s*.6; aR=-s*.6; eL=-.6-Math.max(0,-s)*.3; eR=-.6-Math.max(0,s)*.3; bob=Math.abs(cs)*.03-.012; lean+=.09; twist=s*.1; sway=s*.035; hy=-s*.05; }
    else { aL=idle*.035; aR=-idle*.035; zL-=idle*.012; zR+=idle*.012; sway=slow*.022; hy=Math.sin(time*.6+ph*2)*(c.cur?.1:.28)+(c.lookY||0); hz=Math.sin(time*.9+ph)*.045; hx=c.lookX||0; knL=knR=.05+Math.max(0,slow)*.05; }
    if(info.holdL){ aL=-.55+idle*.02; eL=-1.05; zL=-.1; } if(info.holdR){ aR=-.5-idle*.02; eR=-1.0; zR=.1; }
    if(info.caneR&&!c.moving){ aR=-.3; eR=-.45; zR=.12; }
    if(c.talk>0){ c.talk-=dt; const g=Math.sin(time*5+ph); hx+=Math.sin(time*7)*.04; if(!info.holdL&&!c.moving){ aL=-.7+g*.15; eL=-1.3+g*.2; zL=-.3; } if(!info.holdR&&!info.caneR&&!c.moving&&ph>3){ aR=-.6-g*.15; eR=-1.2; zR=.28; } }
    if(c.wave>0){ c.wave-=dt; zR=2.5; aR=0; eR=-.4+Math.sin(time*15)*.5; hz+=.08; }
    if(c.browse>0&&!c.moving){ hx=-.28; hy=Math.sin(time*.7+ph)*.25; if(!info.holdL){ aL=-.9; eL=-1.9; zL=.25; } }
    let face=c.face||'neutral';
    if(c.react){ c.react.t+=dt; const t=c.react.t, f=Math.max(0,1-t/1.6), ty=c.react.type;
      if(ty==='happy'){ const j=Math.abs(Math.sin(t*8.5))*f; bob+=j*.26; sq=1+(j-.3)*.08*f; if(f>.08){ zL=-2.5; zR=2.5; aL=aR=0; eL=eR=-.3; } hx-=.22*f; face='happy'; }
      else if(ty==='shock'){ lean-=.3*f; if(f>.08){ zL=-1.25; zR=1.25; aL=aR=-.2; eL=eR=-1.0; } tz=Math.sin(t*44)*.035*f; hx-=.16*f; bob+=Math.max(0,.1-t)*1.2; face='shock'; }
      else if(ty==='meh'){ hz=.24*f; if(f>.08){ zL=-.55; zR=.55; eL=eR=-1.9; aL=aR=-.5; } face='think'; }
      else if(ty==='sad'){ lean+=.2*f; hx+=.3*f; face='sad'; }
      else if(ty==='cheer'){ const j=Math.abs(Math.sin(t*9))*f; bob+=j*.18; if(f>.08){ zL=-2.3; zR=2.3; aL=aR=-.2; eL=eR=-.5; } face='happy'; }
      else if(ty==='give'){ if(f>.25){ aR=-1.35; eR=-.35; zR=.05; lean+=.1; } face='happy'; }
      else if(ty==='toss'){ const u=Math.min(1,t/.32); if(t<.5){ aL=-2.4+u*1.6; eL=-1.2+u*.9; zL=-.15; twist=-.15+u*.3; } }
      if(t>(c.react.dur||1.7)) c.react=null; }
    L(r.legL,'x',legL); L(r.legR,'x',legR); L(r.kneeL,'x',knL); L(r.kneeR,'x',knR);
    if(!c.ikR){ L(r.armR,'x',aR); L(r.armR,'z',zR); L(r.armR,'y',0); L(r.elbowR,'x',eR); } if(!c.ikL){ L(r.armL,'x',aL); L(r.armL,'z',zL); L(r.armL,'y',0); L(r.elbowL,'x',eL); }
    r.hips.position.y=.52+bob; L(r.hips,'z',sway); L(r.torso,'x',lean); r.torso.rotation.z=tz-r.hips.rotation.z*.6; L(r.torso,'y',twist); r.torso.scale.y=1+(c.moving?0:idle*.012); c.g.scale.set(info.sc/Math.sqrt(sq),info.sc*sq,info.sc/Math.sqrt(sq));
    L(r.head,'y',hy); L(r.head,'z',hz); L(r.head,'x',hx);
    if(r.face){ let v=''; if(c.talk>0&&Math.sin(time*17+ph)>.1) v='talk'; c.blinkT=(c.blinkT??(1+R()*3))-dt; if(c.blinkT<0){ v='blink'; if(c.blinkT<-.13) c.blinkT=2+R()*3.5; } setFace(c,face,v); }
    if(r.wingL){ const a=.55+Math.sin(time*(c.moving?26:6)+ph)*.36; r.wingL.rotation.y=-a; r.wingR.rotation.y=a; }
    if(r.tail) r.tail.rotation.y=Math.sin(time*2.2+ph)*.36+(c.moving?Math.sin(c.stride||0)*.2:0);
    if(r.cape) L(r.cape,'x',c.moving?.38:.04+idle*.015);
    if(r.gear) r.gear.rotation.z+=dt*1.5;
    if(r.hatP) r.hatP.rotation.x+=((c.moving?-.2+Math.sin((c.stride||0)*2)*.04:-.14+idle*.01)-r.hatP.rotation.x)*k;
    if(r.bird){ r.bird.rotation.y=Math.sin(time*1.3+ph)*.6; r.bird.position.y=.49+Math.max(0,Math.sin(time*5+ph)-.8)*.12; }
    if(r.bell&&c.moving) r.bell.rotation.z=Math.sin((c.stride||0))*.45;
    if(r.flame) r.flame.scale.set(1+Math.sin(time*13+ph)*.03,1+Math.sin(time*9+ph)*.07,1+Math.cos(time*11+ph)*.03);
    r.flick.forEach(f=>{ const s=1+Math.sin(time*14+f.userData.flick)*.14; f.scale.y=f.scale.x*1.9*s; });
  }
  function pose(c, o={}){ const r=c.rig, info=c.info; r.armL.rotation.set(info.holdL?-.55:0,0,info.holdL?-.1:-.2); r.elbowL.rotation.x=info.holdL?-1.05:-.38; r.armR.rotation.set(info.holdR?-.5:info.caneR?-.3:0,0,info.holdR?.1:info.caneR?.12:.2); r.elbowR.rotation.x=info.holdR?-1:info.caneR?-.45:-.38; r.head.rotation.set(o.hx||0,o.hy||0,o.hz||0); r.torso.rotation.set(info.hunch+(o.lean||0),0,0); if(r.wingL){ r.wingL.rotation.y=-.5; r.wingR.rotation.y=.5; } }
  return { build, proto, spawn, animate, setFace, reach, pose, faceTex, SPEC };
})();
