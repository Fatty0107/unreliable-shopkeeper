/* ============ CHARACTERS: rigged, outfitted, outlined 3D folk with faces, props and animation ============ */
const C3 = !G3 ? null : (function(){
  const {T,R,ctex,rr,TEX,M,metal,mesh,box,sph,cyl,cone,caps,tor,lathe,bake} = G3;
  const PI = Math.PI;
  /* h: height scale · w: build · head: head size · outfit · props */
  const SPEC = {
    maudie:{h:.8,w:1.08,head:1.1,outfit:'dress',props:['shawl','basket']},
    kest:{h:.9,head:1.08,outfit:'tunic',props:['satchel','bird','goggles']},
    croak:{h:.72,w:1.1,head:1.2,outfit:'coat',props:['cape','cane']},
    tavi:{h:.96,outfit:'robe',props:['leafcloak','pouch','flower']},
    patch:{h:.7,head:1.2,outfit:'doll',props:[]},
    sable:{h:1.06,w:.94,outfit:'tunic',props:['cloak','quiver']},
    ada:{h:1.02,w:.95,outfit:'coat',props:['clipboard','badge']},
    nessa:{h:.96,outfit:'dress',props:['apron','flowercrown']},
    gorvin:{h:1.46,w:1.4,head:.95,outfit:'vest',props:['partyhat'],hunch:.2,hands:1.6},
    bramble:{h:.8,w:1.2,head:1.1,outfit:'dress',props:['apron','bakerhat','rollingpin']},
    miri:{h:.82,w:.9,head:1.12,outfit:'dress',props:['wings','antennae']},
    tallow:{h:1.04,w:1.1,outfit:'wax',props:[]},
    puddle:{h:.96,outfit:'robe',props:['shells','tail']},
    bellmaker:{h:.96,w:1.1,outfit:'brass',props:['bell']},
    tamsin:{h:.98,w:.95,outfit:'coat',props:['tail','scarf']},
    grakka:{h:1.2,w:1.3,outfit:'vest',props:['apron','hammer'],hands:1.3},
    wobble:{h:1.06,w:1.1,outfit:'armor',props:['shield']},
    penny:{h:.9,w:1.15,outfit:'dress',props:['shawl','handbag']},
    fennick:{h:1.1,w:1.05,outfit:'coat',props:['cravat','cane']},
    nib:{h:.72,head:1.15,outfit:'tunic',props:['tail','parcel']},
    dob:{h:.72,w:1.15,head:1.12,outfit:'vest',props:['rope']},
    marrow:{h:1.06,w:.92,outfit:'coat',props:['sash']},
    ottoline:{h:1.5,w:1.1,head:.92,outfit:'dress',props:['shawl','parasol']},
    gus:{h:1.36,w:1.35,head:.98,outfit:'vest',props:['scroll'],hunch:.14,hands:1.4}
  };
  const IRIS = ['#6a4226','#3a6a9a','#3f8a4a','#7a4a9a','#9a6a1a','#2a7a7a'];
  const piv = (x=0,y=0,z=0)=>{ const g=new T.Group(); g.position.set(x,y,z); g.userData.pivot=true; return g; };
  const dbl = (c,o={})=>M(c,Object.assign({side:T.DoubleSide,roughness:.85},o));

  /* ---------- faces are painted onto the head ---------- */
  function faceTex(key, P, expr, blink){
    return ctex(256,256,(c)=>{ const ink='#2a1830', L=88, Rr=168, ey=118; const has=x=>(P.extra||[]).includes(x); const iris=P.iris||IRIS[hashStr(key)%IRIS.length]; c.lineCap='round'; c.lineJoin='round';
      if(has('skull')){ c.fillStyle='#1a1020'; [L,Rr].forEach(x=>{ c.beginPath(); c.ellipse(x,ey,27,expr==='shock'?34:30,0,0,7); c.fill(); c.fillStyle=expr==='sad'?'#6ab8ff':'#8fe0ff'; if(!blink){ c.beginPath(); c.arc(x+(expr==='think'?6:0),ey+2,expr==='happy'?10:7,0,7); c.fill(); } c.fillStyle='#1a1020'; });
        c.beginPath(); c.moveTo(128,150); c.lineTo(118,170); c.lineTo(138,170); c.closePath(); c.fill();
        c.strokeStyle='#1a1020'; c.lineWidth=5; const up=expr==='happy'?10:expr==='sad'?-8:0; c.beginPath(); c.moveTo(84,196-up); c.quadraticCurveTo(128,200+up,172,196-up); c.stroke(); for(let i=0;i<7;i++){ c.beginPath(); c.moveTo(92+i*12,188); c.lineTo(92+i*12,208); c.stroke(); } return; }
      const eye=(x)=>{ if(P.eyes==='button'){ const l=x===L; c.fillStyle=l?'#3a2a4a':'#6a9ae8'; c.strokeStyle=ink; c.lineWidth=5; c.beginPath(); c.arc(x,ey,l?25:21,0,7); c.fill(); c.stroke(); c.fillStyle='rgba(255,255,255,.35)'; c.beginPath(); c.arc(x-7,ey-8,7,0,7); c.fill(); c.fillStyle='#f4ecd8'; [[-7,-7],[7,7],[-7,7],[7,-7]].forEach(([a,b])=>{ c.beginPath(); c.arc(x+a,ey+b,3.2,0,7); c.fill(); }); c.strokeStyle='#f4ecd8'; c.lineWidth=2.5; c.beginPath(); c.moveTo(x-7,ey-7); c.lineTo(x+7,ey+7); c.moveTo(x+7,ey-7); c.lineTo(x-7,ey+7); c.stroke(); return; }
        const sz=P.eyes==='big'||P.bird?1.25:(P.eyes==='small'||P.eyes==='beady')?.66:1; const rx=19*sz, ry=23*sz;
        if(P.bird){ c.fillStyle='#f6e8c0'; c.strokeStyle='#8a5a1a'; c.lineWidth=6; c.beginPath(); c.arc(x,ey,31,0,7); c.fill(); c.stroke(); }
        if(blink||expr==='happy'){ c.strokeStyle=ink; c.lineWidth=8; c.beginPath(); if(expr==='happy') c.arc(x,ey+10,18*sz,PI*1.14,PI*1.86); else c.arc(x,ey-12,18*sz,PI*.16,PI*.84); c.stroke(); return; }
        c.save(); c.beginPath(); c.ellipse(x,ey,rx,expr==='shock'?ry*1.12:ry,0,0,7); c.fillStyle='#fffdf6'; c.fill(); c.clip();
        const dx=expr==='think'?6*sz:0, dy=expr==='sad'?4:expr==='shock'?0:2, ir=expr==='shock'?9*sz:14*sz;
        c.fillStyle=shade(iris,-.35); c.beginPath(); c.arc(x+dx,ey+dy,ir+2,0,7); c.fill(); const ig=c.createRadialGradient(x+dx,ey+dy+4,1,x+dx,ey+dy,ir); ig.addColorStop(0,shade(iris,.45)); ig.addColorStop(1,iris); c.fillStyle=ig; c.beginPath(); c.arc(x+dx,ey+dy,ir,0,7); c.fill();
        c.fillStyle='#160a1e'; c.beginPath(); c.arc(x+dx,ey+dy,ir*.5,0,7); c.fill(); c.fillStyle='rgba(30,10,40,.22)'; c.fillRect(x-rx,ey-ry-4,rx*2,ry*.62);
        c.fillStyle='#fff'; c.beginPath(); c.arc(x+dx-5*sz,ey+dy-7*sz,5*sz,0,7); c.fill(); c.beginPath(); c.arc(x+dx+6*sz,ey+dy+6*sz,2.4*sz,0,7); c.fill(); c.restore();
        c.strokeStyle=ink; c.lineWidth=6.5; c.beginPath(); c.ellipse(x,ey,rx,ry,0,PI*1.05,PI*1.95); c.stroke(); c.lineWidth=2; c.globalAlpha=.5; c.beginPath(); c.ellipse(x,ey,rx,ry,0,PI*.2,PI*.8); c.stroke(); c.globalAlpha=1; };
      if(!P.frog){ eye(L); eye(Rr);
        c.strokeStyle=P.hair&&P.hairStyle!=='none'?shade(P.hair,-.4):ink; c.lineWidth=7;
        const brow=(x,a,b)=>{ c.beginPath(); c.moveTo(x-19,ey-37+a); c.quadraticCurveTo(x,ey-43+(a+b)/2,x+19,ey-37+b); c.stroke(); };
        if(P.eyes!=='button'&&!P.bird){ if(expr==='sad'){ brow(L,-8,4); brow(Rr,4,-8); } else if(expr==='shock'){ brow(L,-12,-14); brow(Rr,-14,-12); } else if(expr==='think'){ brow(L,3,1); brow(Rr,-11,-6); } else if(has('brow')){ c.lineWidth=12; brow(L,-3,8); brow(Rr,8,-3); } else if(expr==='happy'){ brow(L,-6,-8); brow(Rr,-8,-6); } else { c.lineWidth=5.5; brow(L,0,-2); brow(Rr,-2,0); } }
        if(has('lashes')&&!blink){ c.strokeStyle=ink; c.lineWidth=4; [L,Rr].forEach(x=>{ c.beginPath(); c.moveTo(x-16,ey-16); c.lineTo(x-25,ey-25); c.moveTo(x+16,ey-16); c.lineTo(x+25,ey-25); c.moveTo(x-6,ey-22); c.lineTo(x-9,ey-33); c.moveTo(x+6,ey-22); c.lineTo(x+9,ey-33); c.stroke(); }); } }
      if(P.eyes==='glasses'){ c.strokeStyle='#d9a54e'; c.lineWidth=6; c.fillStyle='rgba(255,255,255,.16)'; [L,Rr].forEach(x=>{ c.beginPath(); c.arc(x,ey,32,0,7); c.fill(); c.stroke(); }); c.beginPath(); c.moveTo(L+32,ey-4); c.quadraticCurveTo(128,ey-12,Rr-32,ey-4); c.stroke(); }
      if(P.eyes==='spectacles'){ c.strokeStyle='#2a2a3a'; c.lineWidth=5; c.fillStyle='rgba(255,255,255,.14)'; [L,Rr].forEach(x=>{ rr(c,x-28,ey-21,56,42,10); c.fill(); c.stroke(); }); c.beginPath(); c.moveTo(L+28,ey); c.lineTo(Rr-28,ey); c.stroke(); }
      if(has('monocle')){ c.strokeStyle='#e9c06a'; c.lineWidth=6; c.fillStyle='rgba(255,255,255,.18)'; c.beginPath(); c.arc(Rr,ey,31,0,7); c.fill(); c.stroke(); c.lineWidth=2.5; c.beginPath(); c.moveTo(Rr+28,ey+14); c.quadraticCurveTo(Rr+42,ey+60,Rr+26,ey+112); c.stroke(); }
      if(has('blush')||expr==='happy'){ [[L-16,ey+40],[Rr+16,ey+40]].forEach(([x,y])=>{ const g=c.createRadialGradient(x,y,1,x,y,22); g.addColorStop(0,'rgba(255,100,130,.5)'); g.addColorStop(1,'rgba(255,100,130,0)'); c.fillStyle=g; c.fillRect(x-24,y-24,48,48); }); }
      if(has('freckles')){ c.fillStyle=shade(P.skin,-.38); [[L-18,ey+32],[L-6,ey+40],[L-28,ey+42],[Rr+18,ey+32],[Rr+6,ey+40],[Rr+28,ey+42],[120,ey+30],[136,ey+33]].forEach(([x,y])=>{ c.beginPath(); c.arc(x,y,2.8,0,7); c.fill(); }); }
      if(P.stitched){ c.strokeStyle=ink; c.lineWidth=3; c.beginPath(); c.moveTo(128,4); c.lineTo(124,64); c.moveTo(16,168); c.lineTo(84,210); c.stroke(); for(let i=0;i<5;i++){ c.beginPath(); c.moveTo(118,10+i*12); c.lineTo(134,14+i*12); c.stroke(); c.beginPath(); c.moveTo(22+i*14,164+i*9); c.lineTo(26+i*14,180+i*9); c.stroke(); } }
      const my=P.frog?150:180, mw=P.frog?70:(has('bigjaw')?32:23);
      if(!P.bird && !(has('snout')&&expr!=='happy')){
        c.strokeStyle=ink; c.lineWidth=6; c.fillStyle='#7a2a3a';
        if(expr==='happy'){ c.beginPath(); c.moveTo(128-mw,my-5); c.quadraticCurveTo(128,my+mw*1.3,128+mw,my-5); c.closePath(); c.fill(); c.stroke(); c.save(); c.clip(); c.fillStyle='#ff8fa0'; c.beginPath(); c.ellipse(128,my+mw*.75,mw*.6,mw*.4,0,0,7); c.fill(); c.fillStyle='#fff'; c.fillRect(128-mw,my-6,mw*2,7); c.restore(); }
        else if(expr==='sad'){ c.beginPath(); c.moveTo(128-mw*.8,my+10); c.quadraticCurveTo(128,my-9,128+mw*.8,my+10); c.stroke(); }
        else if(expr==='shock'){ c.beginPath(); c.ellipse(128,my+5,P.frog?19:12,P.frog?21:16,0,0,7); c.fill(); c.stroke(); }
        else if(expr==='think'){ c.beginPath(); c.moveTo(128-mw*.5,my+4); c.quadraticCurveTo(128+4,my+1,128+mw*.75,my-4); c.stroke(); }
        else { c.beginPath(); c.moveTo(128-mw*.85,my-4); c.quadraticCurveTo(128,my+(P.frog?18:12),128+mw*.85,my-4); c.stroke(); c.lineWidth=3; c.beginPath(); c.arc(128-mw*.85,my-5,3,0,7); c.arc(128+mw*.85,my-5,3,0,7); c.stroke(); }
        if(has('fangs')){ c.fillStyle='#fff'; c.lineWidth=2.5; [-24,24].forEach(dx=>{ c.beginPath(); c.moveTo(128+dx-6,my+3); c.lineTo(128+dx,my+19); c.lineTo(128+dx+6,my+3); c.closePath(); c.fill(); c.stroke(); }); }
        if(has('mustache')){ c.fillStyle=P.hair==='#d8b070'?'#c8903a':(P.hair||'#5a3a24'); c.strokeStyle=ink; c.lineWidth=3; c.beginPath(); c.moveTo(128,my-20); c.quadraticCurveTo(98,my-34,76,my-8); c.quadraticCurveTo(104,my-2,128,my-11); c.quadraticCurveTo(152,my-2,180,my-8); c.quadraticCurveTo(158,my-34,128,my-20); c.fill(); c.stroke(); } }
    });
  }

  /* ---------- head: built in "big head" units (radius .4) and scaled down ---------- */
  function buildHead(key, P, expr, sp){
    const has=x=>(P.extra||[]).includes(x), prop=x=>(sp.props||[]).includes(x);
    const skin=M(P.skin,{roughness:.62}), cl=M(P.clothes), cl2=M(P.clothes2||'#ffffff'), hair=M(P.hair||'#5a3a24',{roughness:.75}), hatM=M(P.hatCol||'#3a2a4a'), gold=metal('#e9c06a');
    const head=new T.Group();
    const hs = P.frog?[1.22,.82,1.02]: has('bigjaw')?[1.1,.96,1]: has('skull')?[.96,1.02,.98] : P.bird?[1,1,1] : [1,.95,.97];
    head.add(sph(.4,skin,0,0,0,{s:hs}));
    const tOpen=faceTex(key,P,expr,false), tBlink=(expr==='neutral'||expr==='think')?faceTex(key,P,expr,true):tOpen;
    const faceMat=new T.MeshStandardMaterial({map:tOpen,transparent:true,roughness:.7,depthWrite:false,envMapIntensity:.4});
    head.add(mesh(new T.SphereGeometry(.406,28,18,PI/2-.95,1.9,PI/2-.8,1.6), faceMat,0,0,0,{s:hs,cast:false,recv:false}));
    if(!P.frog&&!P.bird&&!has('snout')&&!has('skull')) head.add(sph(.045,M(shade(P.skin,-.08),{roughness:.6}),0,-.065,.385,{s:[1,.85,.8]}));
    if(has('skull')){ head.add(sph(.2,skin,0,-.26,.12,{s:[1.15,.7,1]})); }
    if(!P.frog&&!P.bird&&!P.candle&&P.ears!=='none'){ const inner=M(shade(P.skin,-.2));
      if(P.ears==='elf') [-1,1].forEach(s=>{ head.add(cone(.08,.34,skin,s*.44,.05,-.02,{r:[0,0,s*-1.15],s:[1,1,.55]})); });
      else if(P.ears==='goblin') [-1,1].forEach(s=>{ head.add(cone(.1,.5,skin,s*.54,.03,-.02,{r:[0,0,s*-1.42],s:[1,1,.45]})); head.add(cone(.05,.3,inner,s*.5,.03,.02,{r:[0,0,s*-1.42],s:[1,1,.3]})); });
      else if(P.ears==='big') [-1,1].forEach(s=>{ head.add(sph(.16,skin,s*.43,0,0,{s:[.45,1,.8]})); head.add(sph(.1,inner,s*.45,0,.03,{s:[.4,1,.7]})); });
      else if(P.ears==='fin') [-1,1].forEach(s=>head.add(cone(.14,.34,M(shade(P.skin,.25)),s*.44,.02,0,{r:[0,0,s*-1.2],s:[1,1,.25]})));
      else [-1,1].forEach(s=>{ head.add(sph(.095,skin,s*.39,-.02,0,{s:[.55,1,.8]})); head.add(sph(.055,inner,s*.405,-.02,.02,{s:[.5,1,.7]})); }); }
    const cap=()=>head.add(mesh(new T.SphereGeometry(.43,28,18,0,6.2832,0,1.72),hair,0,0,0,{s:hs,r:[-.52,0,0]}));
    switch(P.hairStyle){
      case 'curls': cap(); for(let i=0;i<11;i++){ const a=-.45+i/10*(PI+.9); head.add(sph(.155,hair,Math.cos(a)*.36,.19+Math.sin(i*1.3)*.05,-Math.sin(a)*.3+.02)); } head.add(sph(.18,hair,0,.36,0)); head.add(sph(.15,hair,-.2,.33,.14)); head.add(sph(.15,hair,.2,.33,.14)); head.add(sph(.13,hair,0,.3,.26)); break;
      case 'messy': cap(); [[-.2,.36,.1,.5],[.05,.43,.05,-.2],[.25,.34,.1,-.7],[-.05,.38,-.2,.2],[.2,.3,-.2,-.5],[-.3,.26,-.1,.9],[.1,.34,.26,-.3],[-.14,.33,.26,.4]].forEach(([x,y,z,r])=>head.add(cone(.11,.28,hair,x,y,z,{r:[z,0,r]}))); break;
      case 'long': cap(); head.add(sph(.4,hair,0,-.34,-.16,{s:[1.05,1.4,.55]})); [-1,1].forEach(s=>{ head.add(sph(.15,hair,s*.31,-.14,.1,{s:[.6,2,.7]})); if(P.hat!=='hood') head.add(sph(.13,hair,s*.2,.22,.3,{s:[1,.7,.5]})); else head.add(sph(.11,hair,s*.24,.2,.27,{s:[.8,.9,.5]})); }); break;
      case 'braids': cap(); [-1,1].forEach(s=>{ for(let i=0;i<5;i++) head.add(sph(.085-i*.006,hair,s*(.36+i*.012),-.14-i*.12,.08)); head.add(sph(.05,gold,s*.42,-.74,.08)); head.add(sph(.13,hair,s*.18,.24,.3,{s:[1.1,.6,.5]})); }); break;
      case 'bun': cap(); head.add(sph(.18,hair,0,.43,-.12)); head.add(tor(.1,.025,M('#7a2a4a'),0,.33,-.1,{r:[1.2,0,0]})); head.add(sph(.14,hair,-.12,.26,.3,{s:[1.3,.6,.5]})); break;
      case 'tuft': head.add(cone(.1,.26,hair,.04,.44,0,{r:[0,0,-.3]})); head.add(cone(.07,.2,hair,-.06,.42,.03,{r:[0,0,.4]})); break;
      case 'pixie': cap(); [[-.2,.24,.3],[-.07,.29,.33],[.07,.29,.33],[.2,.24,.3]].forEach(([x,y,z])=>head.add(cone(.09,.22,hair,x,y,z,{r:[2.3,0,0]}))); break;
      case 'wave': cap(); head.add(sph(.2,hair,.1,.27,.26,{s:[1.7,.6,.8]})); head.add(sph(.16,hair,-.3,.1,.1,{s:[.6,1.5,.9]})); break;
      case 'flame': [[0,.52,0,.2,.56],[-.18,.43,0,.15,.4],[.18,.43,0,.15,.4],[0,.4,-.2,.15,.36],[-.1,.38,.18,.11,.28],[.12,.38,.16,.11,.28],[-.28,.32,-.05,.1,.26],[.28,.32,-.05,.1,.26]].forEach(([x,y,z,r,h],i)=>{ const m=cone(r,h,M(i%2?'#ff9a3a':'#ffd04a',{emissive:i%2?'#ff7a20':'#ffb030',emissiveIntensity:1.5}),x,y,z,{keep:true,cast:false}); m.userData.flick=i; head.add(m); }); break;
      case 'mohawk': for(let i=0;i<6;i++) head.add(box(.09,.24,.12,hair,0,.42-Math.abs(i-2)*.03,.28-i*.12,{r:[-.4+i*.24,0,0]})); break;
      case 'swoop': cap(); head.add(sph(.21,hair,.14,.33,.24,{s:[1.5,.75,.9]})); head.add(sph(.12,hair,.34,.2,.22,{s:[.8,1.2,.8]})); break;
      case 'quills': for(let i=0;i<26;i++){ const a=i*2.4, el=.2+(i%6)*.16; head.add(cone(.07,.34,hair,Math.cos(a)*Math.cos(el)*.36,Math.sin(el)*.36+.05,-Math.abs(Math.sin(a))*Math.cos(el)*.36-.02,{r:[-1.2+el,0,-Math.cos(a)*.9]})); } break;
    }
    if(P.frog) [-1,1].forEach(s=>{ head.add(sph(.16,skin,s*.24,.3,.1)); head.add(sph(.115,M('#ffe680',{roughness:.3}),s*.24,.31,.19)); head.add(sph(.05,M('#2a1830'),s*.24,.31,.285,{s:[.55,1.4,.5]})); head.add(sph(.03,M('#ffffff',{emissive:'#ffffff',emissiveIntensity:.5}),s*.24-.03,.35,.29)); });
    if(P.bird){ head.add(cone(.11,.3,M('#e8a83a',{roughness:.4}),0,-.08,.46,{r:[PI/2,0,0]})); [-.14,0,.14].forEach((x)=>head.add(cone(.07,.34,cl2,x,.44,-.02,{r:[-.3,0,-x*3]}))); head.add(tor(.41,.03,metal('#c8903a'),0,.12,0,{r:[PI/2,0,0]})); }
    if(P.candle){ head.add(cyl(.014,.014,.14,M('#2a1830'),0,.44,0)); const f=sph(.07,M('#ffd070',{emissive:'#ffb030',emissiveIntensity:3}),0,.57,0,{s:[1,1.9,1],cast:false,keep:true}); f.userData.flick=1; head.add(f); [[-.3,.1,.2],[.26,.18,.22],[.1,.3,.3],[-.12,.34,.2],[.32,0,.1]].forEach(([x,y,z])=>head.add(sph(.07,M(shade(P.skin,.3)),x,y,z,{s:[.7,1.6,.7]}))); }
    if(has('snout')){ head.add(sph(.16,M(shade(P.skin,.22)),0,-.1,.34,{s:[1.1,.8,1]})); head.add(sph(.055,M('#2a1830',{roughness:.3}),0,-.05,.49)); }
    if(has('tusks')) [-1,1].forEach(s=>head.add(cone(.04,.15,M('#fff8e0',{roughness:.4}),s*.14,-.17,.36,{r:[.2,0,s*.15]})));
    if(has('beard')){ head.add(sph(.27,hair,0,-.3,.16,{s:[1.1,.95,.75]})); head.add(sph(.16,hair,0,-.5,.2,{s:[.8,1,.7]})); }
    if(has('horns')) [-1,1].forEach(s=>{ head.add(cone(.07,.26,M('#3a2a2a',{roughness:.4}),s*.24,.4,.05,{r:[0,0,s*-.5]})); });
    if(has('leaf')||prop('flower')){ head.add(sph(.1,M('#8fd06a'),.26,.36,.16,{s:[1.3,.3,.7],r:[0,0,.5]})); }
    if(prop('flower')){ const fx=-.26, fy=.3, fz=.22; for(let i=0;i<5;i++){ const a=i/5*6.283; head.add(sph(.05,M('#ff9fc0'),fx+Math.cos(a)*.06,fy+Math.sin(a)*.06,fz)); } head.add(sph(.04,M('#ffd04a'),fx,fy,fz+.03)); }
    if(prop('flowercrown')) for(let i=0;i<12;i++){ const a=i/12*6.283; head.add(sph(.065,M(['#ff9fc0','#ffd04a','#b98af5','#ffffff'][i%4]),Math.cos(a)*.39,.27+Math.sin(a*3)*.01,Math.sin(a)*.37-.04)); }
    if(prop('goggles')){ head.add(tor(.41,.035,M('#5a3a2a'),0,.2,0,{r:[PI/2-.2,0,0]})); [-1,1].forEach(s=>{ head.add(tor(.085,.03,metal('#c8903a'),s*.13,.24,.37,{r:[-.3,0,0]})); head.add(mesh(new T.CircleGeometry(.08,14),M('#9fe0f0',{roughness:.1,metalness:.3,emissive:'#4aa8c8',emissiveIntensity:.4}),s*.13,.24,.375,{r:[-.3,0,0]})); }); }
    if(prop('antennae')) [-1,1].forEach(s=>{ head.add(cyl(.012,.012,.36,M('#3a2a4a'),s*.14,.54,.06,{r:[.2,0,s*-.35]})); head.add(sph(.045,M('#ffd04a',{emissive:'#ffb030',emissiveIntensity:1.2}),s*.2,.72,.1)); });
    if(prop('partyhat')){ head.add(cone(.12,.3,M('#ff7fa8'),.08,.52,.02,{r:[0,0,-.2]})); head.add(sph(.04,M('#ffd04a'),.11,.68,.02)); head.add(tor(.12,.02,M('#ffd04a'),.07,.38,.02,{r:[PI/2,-.2,0]})); }
    if(prop('bakerhat')){ head.add(cyl(.3,.3,.14,M('#fbf6ee'),0,.36,0)); head.add(sph(.34,M('#fbf6ee'),0,.56,0,{s:[1,.62,1]})); }
    switch(P.hat){
      case 'witch': { const h=new T.Group(); h.add(cyl(.6,.6,.035,hatM,0,0,0)); h.add(cone(.31,.62,hatM,0,.32,0)); h.add(cone(.13,.32,hatM,.07,.7,-.04,{r:[-.3,0,-.6]})); h.add(tor(.285,.045,M('#e8a83a'),0,.06,0,{r:[PI/2,0,0]})); h.add(box(.1,.1,.03,gold,0,.07,.3)); h.add(box(.2,.16,.02,M('#e8a83a'),-.3,.3,.2,{r:[0,-.5,.3]})); h.position.set(0,.27,-.02); h.rotation.set(-.14,0,.1); head.add(h); break; }
      case 'tophat': head.add(cyl(.34,.34,.035,M('#1a1424',{roughness:.4}),0,.36,0)); head.add(cyl(.2,.22,.38,M('#1a1424',{roughness:.4}),0,.56,0)); head.add(cyl(.228,.228,.08,M('#c8343a'),0,.42,0)); break;
      case 'hood': head.add(mesh(new T.SphereGeometry(.47,28,18,0,6.2832,0,1.95),hatM,0,0,-.02,{s:hs,r:[-.82,0,0]})); head.add(cone(.13,.26,hatM,0,.34,-.36,{r:[-1.9,0,0]})); break;
      case 'helm': { const st=metal('#c8d0e0',.28); head.add(mesh(new T.SphereGeometry(.445,24,14,0,6.2832,0,1.5),st,0,.02,0,{r:[-.2,0,0]})); head.add(cone(.08,.4,M('#e84a4a'),0,.6,-.06,{r:[-.35,0,0],s:[.5,1,1.4]})); head.add(box(.06,.32,.1,st,0,.14,.41)); head.add(tor(.44,.035,st,0,.06,0,{r:[PI/2-.2,0,0]})); break; }
      case 'feather': head.add(cyl(.47,.47,.03,M('#5a2a4a'),0,.33,0,{r:[.1,0,.1]})); head.add(cyl(.22,.26,.17,M('#5a2a4a'),0,.42,0)); head.add(tor(.25,.03,M('#f0c0e0'),0,.36,0,{r:[PI/2,0,0]})); head.add(cone(.08,.56,M('#f0c0e0'),.27,.62,-.05,{r:[-.2,0,-.6],s:[1,1,.3]})); break;
      case 'cap': head.add(mesh(new T.SphereGeometry(.428,22,14,0,6.2832,0,1.4),cl,0,.02,0,{r:[-.3,0,0]})); head.add(box(.42,.03,.28,cl,0,.2,.42,{r:[.2,0,0]})); head.add(sph(.04,cl2,0,.44,-.08)); break;
      case 'tricorn': { const hm=M(P.hatCol||'#1f2a44'); head.add(mesh(new T.CylinderGeometry(.6,.6,.05,3),hm,0,.34,-.02,{r:[0,PI,0]})); head.add(mesh(new T.CylinderGeometry(.5,.62,.14,3,1,true),M(P.hatCol||'#1f2a44',{side:T.DoubleSide}),0,.41,-.02,{r:[0,PI,0]})); head.add(cyl(.27,.3,.22,hm,0,.45,-.02)); head.add(tor(.3,.02,gold,0,.36,-.02,{r:[PI/2,0,0]})); head.add(cone(.05,.4,M('#e84a4a'),-.24,.66,.0,{r:[0,0,.5],s:[1,1,.3]})); break; }
    }
    return {head, faceMat, tOpen, tBlink};
  }

  /* ---------- full figure ---------- */
  function build(key, expr='neutral'){
    const P=PORTRAITS[key], sp=SPEC[key]||{outfit:'robe',props:[]}; const w=sp.w||1, hsz=sp.head||1; const outfit=sp.outfit, prop=x=>(sp.props||[]).includes(x), has=x=>(P.extra||[]).includes(x);
    const skin=M(P.skin,{roughness:.62}), cl=M(P.clothes,{roughness:.85}), cl2=M(P.clothes2||'#ffffff',{roughness:.85}), dark=M(shade(P.clothes,-.5)), boot=M('#3a2418',{roughness:.5}), gold=metal('#e9c06a'), steel=metal('#b8c0d0',.3), brass=metal('#c8903a',.35), leather=M('#6a4226',{roughness:.6});
    const root=new T.Group(), rig={hunch:sp.hunch||0}; root.userData.rig=rig;
    const hips=piv(0,.5,0); root.add(hips); rig.hips=hips;
    const bodyM = outfit==='armor'?steel: outfit==='brass'?brass: outfit==='wax'?skin: outfit==='vest'?cl2: cl;
    const legM = outfit==='armor'?steel: outfit==='brass'?brass: outfit==='doll'?cl2: (outfit==='dress'||outfit==='robe')?M('#f0e6d8'): dark;
    // legs
    if(outfit!=='wax') [-1,1].forEach(s=>{ const L=piv(s*.088*w,0,0); if(outfit==='brass'){ L.add(cyl(.025,.025,.44,brass,0,-.22,0)); [-.5,0,.5].forEach(a=>L.add(cone(.02,.14,M('#e8a83a'),Math.sin(a)*.05,-.47,.05+Math.cos(a)*.03,{r:[PI/2,0,-a]}))); }
      else { L.add(caps(.068*Math.min(w,1.25),.26,(outfit==='doll'&&s>0)?cl:legM,0,-.2,0)); L.add(sph(1,outfit==='armor'?steel:boot,0,-.445,.04,{s:[.09*Math.min(w,1.25),.065,.14]})); L.add(cyl(.078*Math.min(w,1.25),.078*Math.min(w,1.25),.07,outfit==='armor'?steel:boot,0,-.39,0)); }
      hips.add(L); rig[s<0?'legL':'legR']=L; });
    hips.add(sph(1,legM,0,.03,0,{s:[.175*w,.13,.135]}));
    // lower garment
    const sk=(pts,mat,o)=>hips.add(lathe(pts.map(p=>[p[0]*w,p[1]]),mat,0,0,0,Object.assign({s:[1,1,.82]},o||{})));
    if(outfit==='dress'){ sk([[.34,-.4],[.345,-.37],[.27,-.14],[.19,.19]],dbl(P.clothes)); hips.add(tor(.34*w,.022,cl2,0,-.385,0,{r:[PI/2,0,0],s:[1,.82,1]})); hips.add(tor(.3*w,.012,cl2,0,-.3,0,{r:[PI/2,0,0],s:[1,.82,1]})); }
    else if(outfit==='robe'){ sk([[.3,-.46],[.31,-.43],[.25,-.14],[.19,.19]],dbl(P.clothes)); hips.add(tor(.305*w,.02,cl2,0,-.445,0,{r:[PI/2,0,0],s:[1,.82,1]})); }
    else if(outfit==='tunic'){ sk([[.255,-.1],[.26,-.07],[.19,.19]],dbl(P.clothes)); hips.add(tor(.255*w,.015,cl2,0,-.09,0,{r:[PI/2,0,0],s:[1,.82,1]})); }
    else if(outfit==='coat'){ sk([[.29,-.3],[.29,-.27],[.2,.19]],dbl(P.clothes),{ps:.38,pl:6.2832-.76}); }
    else if(outfit==='armor'){ sk([[.27,-.12],[.2,.19]],dbl('#b8c0d0',{metalness:.9,roughness:.3,envMapIntensity:1.3})); hips.add(box(.2,.34,.02,M('#c8343a'),0,-.02,.2)); hips.add(box(.08,.08,.025,gold,0,.04,.21)); }
    else if(outfit==='doll'){ sk([[.27,-.08],[.19,.19]],dbl(P.clothes2||'#e8a83a')); }
    else if(outfit==='wax'){ sk([[.36,-.5],[.37,-.46],[.27,0],[.2,.19]],dbl(P.skin,{roughness:.5})); [[.3,-.3,.1],[-.26,-.2,.18],[.1,-.36,.3],[-.1,-.1,.24]].forEach(([x,y,z])=>hips.add(sph(.05,M(shade(P.skin,.25)),x,y,z,{s:[.8,1.8,.8]}))); }
    // torso
    const torso=piv(0,0,0); hips.add(torso); rig.torso=torso; torso.rotation.x=rig.hunch;
    torso.add(lathe([[.185,0],[.19,.08],[.162,.2],[.198,.34],[.172,.42],[.08,.455],[.066,.5]].map(p=>[p[0]*w,p[1]]),bodyM,0,0,0,{s:[1,1,.8]}));
    torso.add(cyl(.062,.068,.1,(outfit==='brass')?brass:skin,0,.5,0));
    if(['tunic','coat','vest','robe','doll'].includes(outfit)){ torso.add(tor(.172*w,.024,outfit==='robe'?M('#c8a878'):leather,0,.19,0,{r:[PI/2,0,0],s:[1,.8,1]})); if(outfit!=='robe') torso.add(box(.06,.06,.02,gold,0,.19,.148)); else torso.add(sph(.03,M('#c8a878'),.08,.17,.14)); }
    if(outfit!=='armor'&&outfit!=='brass'&&outfit!=='wax') torso.add(tor(.085,.03,cl2,0,.465,0,{r:[PI/2,0,0]}));
    if(outfit==='coat'){ [-1,1].forEach(s=>torso.add(box(.07,.17,.02,cl2,s*.062,.37,.145*1,{r:[0,s*.25,s*-.32]}))); for(let i=0;i<3;i++) torso.add(sph(.018,gold,.035,.3-i*.075,.158)); [-1,1].forEach(s=>torso.add(sph(.045,cl,s*.21*w,.43,0,{s:[1.3,.5,1.2]}))); }
    if(outfit==='vest'){ torso.add(lathe([[.205,.03],[.178,.2],[.214,.34],[.19,.43]].map(p=>[p[0]*w,p[1]]),dbl(P.clothes),0,0,0,{s:[1,1,.84],ps:.5,pl:6.2832-1})); }
    if(outfit==='dress'){ torso.add(sph(1,cl2,0,.4,.12,{s:[.1*w,.06,.04]})); for(let i=0;i<3;i++) torso.add(sph(.014,cl2,0,.34-i*.05,.158)); }
    if(outfit==='armor'){ [-1,1].forEach(s=>{ torso.add(sph(.11,steel,s*.22*w,.42,0,{s:[1.1,.8,1.1]})); }); torso.add(tor(.09,.03,steel,0,.47,0,{r:[PI/2,0,0]})); torso.add(lathe([[.1,.2],[.2,.3],[.1,.42]],gold,0,0,.02,{s:[.5,1,.2],ps:-.6,pl:1.2})); }
    if(outfit==='doll'){ torso.add(box(.11,.1,.02,cl2,-.06,.3,.152,{r:[0,-.2,.2]})); torso.add(sph(.03,M('#e8a83a'),.07,.33,.155)); torso.add(sph(.026,M('#8fd0f0'),.05,.12,.16)); for(let i=0;i<5;i++) torso.add(box(.035,.008,.01,M('#2a1830'),.0,.1+i*.07,.162,{r:[0,0,.5]})); }
    if(outfit==='brass'){ torso.add(tor(.19*w,.02,metal('#8a5a1a'),0,.12,0,{r:[PI/2,0,0],s:[1,.8,1]})); torso.add(tor(.2*w,.02,metal('#8a5a1a'),0,.32,0,{r:[PI/2,0,0],s:[1,.8,1]})); const gear=new T.Group(); gear.add(tor(.07,.02,gold,0,0,0)); for(let i=0;i<8;i++){ const a=i/8*6.283; gear.add(box(.03,.03,.03,gold,Math.cos(a)*.095,Math.sin(a)*.095,0,{r:[0,0,a]})); } gear.add(box(.14,.02,.02,gold,0,0,0)); gear.add(box(.02,.14,.02,gold,0,0,0)); gear.position.set(0,.24,.165); gear.userData.keep=true; gear.userData.spin=1; rig.gear=gear; torso.add(gear); for(let i=0;i<6;i++){ const a=i/6*6.283; torso.add(sph(.014,gold,Math.sin(a)*.19*w,.4,Math.cos(a)*.15)); } }
    // arms
    const slv = outfit==='armor'?steel: outfit==='brass'?brass: outfit==='wax'?skin: outfit==='vest'?cl2: cl; const hn=sp.hands||1;
    [-1,1].forEach(s=>{ const m=(outfit==='doll'&&s>0)?cl2:slv; const A=piv(s*.205*w,.405,0); A.rotation.z=s*.16; A.add(sph(.074,m,0,0,0)); A.add(caps(.054,.12,m,0,-.1,0));
      const E=piv(0,-.2,0); E.rotation.x=-.3; E.add(sph(.052,m,0,0,0)); E.add(caps(.048,.1,m,0,-.085,0)); if(outfit==='robe'||outfit==='dress') E.add(cyl(.05,.085,.1,m,0,-.13,0)); if(outfit==='armor') E.add(cyl(.062,.058,.1,steel,0,-.12,0)); else if(outfit!=='wax'&&outfit!=='brass') E.add(tor(.055,.016,cl2,0,-.165,0,{r:[PI/2,0,0]}));
      const hm=outfit==='armor'?steel:outfit==='brass'?brass:skin; E.add(sph(.06*hn,hm,0,-.215,0,{s:[1,1.1,.85]})); E.add(sph(.024*hn,hm,s*-.04*hn,-.2,.035));
      A.add(E); torso.add(A); rig[s<0?'armL':'armR']=A; rig[s<0?'elbowL':'elbowR']=E; });
    const handL=rig.elbowL, handR=rig.elbowR, HY=-.24;
    // head
    const H=buildHead(key,P,expr,sp); const headP=piv(0,.5+.285*hsz,0); H.head.scale.setScalar(.75*hsz); headP.add(H.head); torso.add(headP); rig.head=headP; rig.face=H.faceMat; rig.tOpen=H.tOpen; rig.tBlink=H.tBlink; rig.headInner=H.head;
    // props
    if(prop('shawl')){ torso.add(lathe([[.25*w,.3],[.24*w,.38],[.13,.47]],dbl(P.clothes2||'#fff'),0,0,0,{s:[1,1,.84]})); torso.add(sph(.03,gold,0,.36,.19)); }
    if(prop('cape')||prop('cloak')){ const cm=dbl(prop('cloak')?(P.hatCol||'#3a5a34'):'#1f1a2a'); torso.add(lathe([[.36*w,-.34],[.3*w,0],[.22*w,.4],[.12,.47]],cm,0,0,-.02,{s:[1,1,.9],ps:PI*.5+.25,pl:PI-.5,seg:18})); if(prop('cape')){ torso.add(lathe([[.14,.44],[.2,.62]],dbl('#c8343a'),0,0,-.01,{ps:PI*.5,pl:PI,seg:14})); torso.add(sph(.035,M('#c8343a',{roughness:.2}),0,.44,.14)); } else torso.add(sph(.03,gold,.06,.44,.14)); }
    if(prop('leafcloak')){ for(let i=0;i<9;i++){ const a=PI*.5+.3+i/8*(PI-.6); torso.add(sph(1,M(['#4f9a3c','#6fc257','#3f7d34'][i%3]),Math.sin(a)*.22*w,.36-(i%3)*.1,Math.cos(a)*.2,{s:[.13,.2,.035],r:[.3,a,0]})); } [-1,1].forEach(s=>torso.add(sph(1,M('#6fc257'),s*.2*w,.44,.02,{s:[.12,.05,.11]}))); }
    if(prop('apron')){ hips.add(lathe([[.3*w,-.28],[.25*w,-.1],[.2*w,.19]],dbl('#fbf6ee'),0,0,.012,{s:[1,1,.84],ps:-.75,pl:1.5,seg:12})); torso.add(lathe([[.2*w,.0],[.17*w,.2],[.2*w,.36]],dbl('#fbf6ee'),0,0,.012,{s:[1,1,.82],ps:-.6,pl:1.2,seg:12})); }
    if(prop('satchel')){ torso.add(tor(.26,.018,leather,0,.24,0,{r:[PI/2,.75,0],s:[.78*w,.9,1]})); torso.add(box(.17,.15,.07,leather,.2*w,.02,.06,{r:[0,.2,0]})); torso.add(box(.17,.07,.075,M('#8a5632'),.2*w,.07,.065,{r:[0,.2,0]})); torso.add(sph(.016,gold,.21*w,.045,.105)); }
    if(prop('sash')){ torso.add(tor(.26,.03,M('#c8343a'),0,.24,0,{r:[PI/2,-.75,0],s:[.78*w,.9,1]})); }
    if(prop('rope')){ torso.add(tor(.11,.03,M('#c8a878'),-.2*w,.3,-.04,{r:[0,.4,.3]})); torso.add(tor(.11,.03,M('#b89868'),-.2*w,.28,-.02,{r:[.1,.5,.3]})); }
    if(prop('bird')){ const b=piv(.2*w,.5,-.02); b.add(sph(.055,M('#6ab8ff'),0,.05,0,{s:[1,.95,1.2]})); b.add(sph(.04,M('#6ab8ff'),0,.11,.04)); b.add(cone(.014,.04,M('#ffb030'),0,.11,.085,{r:[PI/2,0,0]})); b.add(cone(.025,.08,M('#3a8ad8'),0,.05,-.08,{r:[-1.9,0,0],s:[1,1,.4]})); b.add(sph(.008,M('#1a1020'),.02,.12,.07)); b.add(sph(.008,M('#1a1020'),-.02,.12,.07)); torso.add(b); rig.bird=b; }
    if(prop('pouch')){ torso.add(sph(.065,leather,-.19*w,.1,.08,{s:[1,1.1,.8]})); torso.add(tor(.03,.01,M('#c8a878'),-.19*w,.17,.08,{r:[PI/2,0,0]})); }
    if(prop('quiver')){ const q=new T.Group(); q.add(cyl(.05,.045,.38,leather,0,0,0)); [[-.02,0],[.02,.01],[0,-.02]].forEach(([x,z],i)=>{ q.add(cyl(.006,.006,.2,M('#c8a878'),x,.26,z)); q.add(cone(.02,.07,M(['#e84a4a','#f0f0f0','#6fc257'][i]),x,.35,z,{s:[1,1,.3]})); }); q.position.set(.08,.3,-.2); q.rotation.set(.1,0,-.45); torso.add(q); }
    if(prop('badge')){ torso.add(mesh(new T.CircleGeometry(.035,5),gold,-.09*w,.36,.16,{r:[0,-.2,0]})); }
    if(prop('shells')){ for(let i=0;i<7;i++){ const a=-.9+i*.3; torso.add(sph(.022,M(i%2?'#ffe0e8':'#bfe8ff',{roughness:.3}),Math.sin(a)*.12,.42-Math.cos(a)*.06,.1+Math.cos(a)*.06)); } }
    if(prop('scarf')){ torso.add(tor(.09,.04,cl2,0,.48,0,{r:[PI/2,0,0]})); torso.add(box(.07,.24,.03,cl2,.07,.36,.14,{r:[0,0,-.15]})); }
    if(prop('cravat')){ torso.add(sph(1,M('#ffffff'),0,.42,.13,{s:[.07,.06,.04]})); torso.add(sph(.018,M('#c8343a',{roughness:.2}),0,.43,.165)); }
    if(prop('tail')){ const tp=piv(0,.02,-.12); const tm = key==='nib'?M(P.skin): key==='puddle'?M(shade(P.skin,.15)) : M(P.skin); for(let i=0;i<7;i++){ const t=i/6; tp.add(sph((key==='nib'?.03:.075)*(1-t*.6),tm,Math.sin(t*2)*.06,-t*t*.1+(key==='nib'?t*.25:-.1*t),-.05-t*.36)); }
      if(key==='tamsin'){ const f=sph(.06,M('#ffd04a',{emissive:'#ff8a20',emissiveIntensity:2.5}),.05,-.2,-.44,{s:[1,1.6,1],keep:true,cast:false}); f.userData.flick=2; tp.add(f); } if(key==='nib') tp.add(cone(.04,.08,tm,.05,.26,-.44,{r:[-.8,0,0]})); if(key==='puddle') tp.add(sph(1,M(shade(P.skin,.3)),.05,-.2,-.46,{s:[.02,.12,.14]})); hips.add(tp); rig.tail=tp; }
    if(prop('wings')){ rig.wings=[]; [-1,1].forEach(s=>{ const wp=piv(s*.05,.34,-.13); const g=new T.PlaneGeometry(.5,.9); g.translate(.25,.2,0); const m=new T.Mesh(g,new T.MeshBasicMaterial({map:TEX.wing,transparent:true,side:T.DoubleSide,depthWrite:false})); if(s<0) m.scale.x=-1; wp.add(m); const g2=new T.PlaneGeometry(.34,.5); g2.translate(.17,-.2,0); const m2=new T.Mesh(g2,m.material); if(s<0) m2.scale.x=-1; m2.rotation.z=s*-.3; wp.add(m2); wp.userData.side=s; torso.add(wp); rig.wings.push(wp); }); }
    // held props
    const hold=(E,g)=>{ g.position.y+=HY; E.add(g); };
    if(prop('basket')){ const g=new T.Group(); g.add(cyl(.1,.08,.1,M('#c8a060'),0,-.1,0)); g.add(tor(.09,.012,M('#a88040'),0,-.04,0)); [['#ff7fa8',-.03],['#b98af5',.04]].forEach(([c,x])=>g.add(sph(.045,M(c),x,-.04,0))); g.add(cyl(.004,.004,.2,steel,.02,.04,0,{r:[0,0,.5]})); hold(handL,g); rig.holdL=1; }
    if(prop('cane')){ const g=new T.Group(); g.add(cyl(.013,.013,.5,M('#2a1a14',{roughness:.4}),0,-.2,.03)); g.add(sph(.03,gold,0,.05,.03)); hold(handR,g); rig.caneR=1; }
    if(prop('parasol')){ const g=new T.Group(); g.add(cyl(.01,.01,.9,M('#5a3a2a'),0,.3,.03)); g.add(mesh(new T.ConeGeometry(.42,.18,10,1,true),dbl('#f0c8e8'),0,.74,.03)); g.add(sph(.025,gold,0,.84,.03)); hold(handR,g); rig.holdR=1; }
    if(prop('clipboard')){ const g=new T.Group(); g.add(box(.18,.24,.015,M('#8a5632'),0,.02,.06,{r:[-.5,0,0]})); g.add(box(.15,.2,.01,M('#fbf6ee'),0,.025,.068,{r:[-.5,0,0]})); g.add(box(.07,.025,.02,steel,0,.1,.02,{r:[-.5,0,0]})); hold(handL,g); rig.holdL=1; }
    if(prop('rollingpin')){ const g=new T.Group(); g.add(cyl(.035,.035,.24,M('#d8b080'),0,0,.02,{r:[0,0,PI/2]})); g.add(cyl(.014,.014,.4,M('#a87840'),0,0,.02,{r:[0,0,PI/2]})); hold(handR,g); rig.holdR=1; }
    if(prop('bell')){ const g=new T.Group(); g.add(lathe([[.0,.0],[.035,.0],[.05,-.06],[.085,-.13],[.095,-.15]],dbl('#e9c06a',{metalness:.9,roughness:.25,envMapIntensity:1.4}),0,0,.02)); g.add(sph(.022,gold,0,-.14,.02)); g.add(cyl(.012,.012,.07,M('#5a3a2a'),0,.03,.02)); hold(handR,g); rig.holdR=1; rig.bell=g; }
    if(prop('hammer')){ const g=new T.Group(); g.add(cyl(.016,.016,.36,M('#8a5632'),0,.08,.03)); g.add(box(.16,.08,.08,metal('#5a5a6a',.4),0,.26,.03)); hold(handR,g); rig.holdR=1; }
    if(prop('shield')){ const g=new T.Group(); g.add(cyl(.2,.2,.025,steel,-.07,.06,0,{r:[0,0,PI/2]})); g.add(cyl(.15,.15,.03,M('#c8343a'),-.075,.06,0,{r:[0,0,PI/2]})); g.add(sph(.04,gold,-.09,.06,0)); hold(handL,g); rig.holdL=1; }
    if(prop('handbag')){ const g=new T.Group(); g.add(box(.15,.11,.06,M('#8f4a7a'),0,-.12,0)); g.add(tor(.05,.01,gold,0,-.05,0)); g.add(sph(.014,gold,0,-.09,.032)); hold(handL,g); }
    if(prop('parcel')){ const g=new T.Group(); g.add(box(.2,.16,.16,M('#c8a060'),0,0,.1)); g.add(box(.205,.02,.165,M('#c8343a'),0,0,.1)); g.add(box(.02,.165,.165,M('#c8343a'),0,0,.1)); hold(handR,g); rig.holdR=1; rig.holdL=1; }
    if(prop('scroll')){ const g=new T.Group(); g.add(cyl(.03,.03,.22,M('#f6ecd4'),0,.02,.03,{r:[0,0,PI/2]})); g.add(cone(.015,.2,M('#f0f0f0'),.06,.14,.03,{s:[1,1,.3],r:[0,0,-.3]})); hold(handL,g); rig.holdL=1; }
    // bake static pieces per animated part and ink the outline
    [rig.elbowL,rig.elbowR,rig.armL,rig.armR,rig.legL,rig.legR,rig.tail,rig.bird].forEach(g=>g&&bake(g,{outline:.011}));
    bake(H.head,{outline:.018}); H.head.userData.pivot=true; bake(torso,{outline:.011}); bake(hips,{outline:.011});
    const sc=sp.h||1; root.scale.setScalar(sc); root.userData.sc=sc; root.userData.key=key;
    return root;
  }

  /* ---------- animation ---------- */
  function animate(c, dt, time){
    const g=c.g, r=g.userData.rig, ph=c.ph||0, k=1-Math.exp(-dt*11); const L=(o,p,v)=>{ o.rotation[p]+=(v-o.rotation[p])*k; };
    let leg=0, aL=0, aR=0, zL=-.16, zR=.16, eL=-.3, eR=-.3, bob=0, lean=r.hunch, twist=0;
    const idle=Math.sin(time*1.7+ph);
    if(c.moving){ const s=Math.sin(time*9.5+ph); leg=s*.8; aL=s*.6; aR=-s*.6; bob=Math.abs(Math.cos(time*9.5+ph))*.035; lean+=.1; twist=s*.08; eL=eR=-.55; }
    else { aL=idle*.04; aR=-idle*.04; zL-=idle*.015; zR+=idle*.015; }
    if(r.holdL){ aL=-.55+idle*.02; eL=-1.05; zL=-.1; } if(r.holdR){ aR=-.5-idle*.02; eR=-1.0; zR=.1; }
    if(r.caneR&&!c.moving){ aR=-.25; eR=-.5; }
    if(c.wave>0){ c.wave-=dt; zR=2.45; aR=0; eR=-.4+Math.sin(time*15)*.5; }
    let hx=0, hy=c.moving?0:Math.sin(time*.6+ph*2)*(c.cur?.1:.3), hz=Math.sin(time*.9+ph)*.05, tz=0;
    if(c.react){ c.react.t+=dt; const t=c.react.t, f=Math.max(0,1-t/1.5);
      if(c.react.type==='happy'){ bob+=Math.abs(Math.sin(t*9))*.24*f; if(f>.1){ zL=-2.5; zR=2.5; aL=aR=0; eL=eR=-.3; } hx=-.2*f; }
      else if(c.react.type==='shock'){ lean-=.28*f; if(f>.1){ zL=-1.2; zR=1.2; eL=eR=-.9; } tz=Math.sin(t*42)*.035*f; hx=-.15*f; }
      else if(c.react.type==='meh'){ hz=.22*f; if(f>.1){ zR=.5; eR=-1.9; aR=-.6; } }
      if(t>1.7) c.react=null; }
    if(r.legL){ L(r.legL,'x',leg); L(r.legR,'x',-leg); }
    L(r.armL,'x',aL); L(r.armR,'x',aR); L(r.armL,'z',zL); L(r.armR,'z',zR); L(r.elbowL,'x',eL); L(r.elbowR,'x',eR);
    r.hips.position.y=.5+bob; L(r.torso,'x',lean); r.torso.rotation.z=tz; L(r.torso,'y',twist); r.torso.scale.y=1+(c.moving?0:idle*.012);
    L(r.head,'y',hy); L(r.head,'z',hz); L(r.head,'x',hx);
    c.blinkT=(c.blinkT??(1+R()*3))-dt; if(c.blinkT<0){ r.face.map=r.tBlink; if(c.blinkT<-.13){ r.face.map=r.tOpen; c.blinkT=2+R()*3.5; } }
    if(r.wings) r.wings.forEach(wp=>{ wp.rotation.y=wp.userData.side*(.55+Math.sin(time*(c.moving?26:7)+ph)*.35); });
    if(r.tail) r.tail.rotation.y=Math.sin(time*2.2+ph)*.35;
    if(r.gear) r.gear.rotation.z+=dt*1.5;
    if(r.bird){ r.bird.rotation.y=Math.sin(time*1.3+ph)*.6; r.bird.position.y=.5+Math.max(0,Math.sin(time*5+ph)-.8)*.12; }
    if(r.bell&&c.moving) r.bell.rotation.z=Math.sin(time*9.5)*.4;
  }
  function dispose(g){ const r=g.userData.rig; if(r){ r.tOpen.dispose(); if(r.tBlink!==r.tOpen) r.tBlink.dispose(); r.face.dispose(); } g.traverse(o=>{ if(o.isMesh&&o.userData.baked) o.geometry.dispose(); }); }
  return { build, animate, dispose, SPEC };
})();
