/* ============ SCENE3D: the living 3D shop, cameras, picking, portraits ============ */
const S3D = (function(){
  const A = { ok:false, sync(){}, pick(){ return null; }, ghost(){}, stagePos(){ return {x:800,y:450}; }, furnPos(){ return {x:800,y:450}; }, cauldronPos(){ return {x:800,y:400}; }, brewFx(){}, react(){}, portraitURL(){ return null; }, resize(){}, init(){} };
  if(!G3 || !C3) return A;
  const {T,R,TEX,M,MC,wood,metal,mesh,box,sph,cyl,cone,caps,tor,lathe,archShape,glow,bake} = G3;
  const V3=(x,y,z)=>new T.Vector3(x,y,z), PI=Math.PI;
  let renderer, scene, camera, post=null, last=0, time=0;
  const BOTTLE_COLS = ['#ff5fa8','#4ac8ff','#ffc83a','#6fe05a','#b07af5','#ff8a4a'];

  /* ---------- bottles: three silhouettes, glowing contents ---------- */
  const BPROF = [ [[0,0],[.085,0],[.118,.05],[.112,.13],[.05,.19],[.04,.26],[.054,.27]], [[0,0],[.07,0],[.075,.2],[.04,.24],[.036,.3],[.05,.31]], [[0,0],[.05,0],[.13,.03],[.14,.08],[.06,.14],[.035,.2],[.035,.26],[.05,.27]] ];
  const BG=[]; let corkG;
  function bottle(col, s=1, shape=0){ if(!BG.length){ BPROF.forEach(p=>BG.push(new T.LatheGeometry(p.map(q=>new T.Vector2(q[0],q[1])),14))); corkG=new T.CylinderGeometry(.042,.036,.055,8); }
    const k='btl'+col; const gm=MC[k]||(MC[k]=new T.MeshStandardMaterial({color:shade(col,-.2),emissive:col,emissiveIntensity:.75,roughness:.12,metalness:.15,envMapIntensity:1.6}));
    const g=new T.Group(); const top=BPROF[shape][BPROF[shape].length-1][1]; g.add(mesh(BG[shape],gm,0,0,0,{cast:false})); g.add(mesh(corkG,M('#b8865a'),0,top+.02,0,{cast:false})); g.scale.setScalar(s); return g; }

  /* ---------- the room ---------- */
  const flick=[]; const twinkle=[];
  function buildRoom(){
    const g=new T.Group(); const st=new T.Group(); g.add(st);   // st = static, baked
    st.add(mesh(new T.PlaneGeometry(30,24), new T.MeshStandardMaterial({map:TEX.floor, roughness:.78, envMapIntensity:.5}), 7,0,6,{r:[-PI/2,0,0],cast:false}));
    st.add(mesh(new T.PlaneGeometry(30,6.4), new T.MeshStandardMaterial({map:TEX.stone, roughness:.92, envMapIntensity:.35}), 7,3.2,0,{cast:false}));
    const sl=TEX.stone.clone(); sl.repeat.set(4,1.6); sl.needsUpdate=true;
    st.add(mesh(new T.PlaneGeometry(24,6.4), new T.MeshStandardMaterial({map:sl, roughness:.92, envMapIntensity:.35}), 0,3.2,6,{r:[0,PI/2,0],cast:false}));
    // soft occlusion where walls meet the floor
    const aoM=new T.MeshBasicMaterial({map:TEX.ao, transparent:true, depthWrite:false});
    g.add(mesh(new T.PlaneGeometry(30,1.3),aoM,7,.012,.65,{r:[-PI/2,0,PI],cast:false,recv:false})); g.add(mesh(new T.PlaneGeometry(24,1.3),aoM,.65,.012,6,{r:[-PI/2,0,-PI/2],cast:false,recv:false}));
    g.add(mesh(new T.PlaneGeometry(30,1.6),aoM,7,.8,.012,{cast:false,recv:false})); g.add(mesh(new T.PlaneGeometry(24,1.6),aoM,.012,.8,6,{r:[0,PI/2,0],cast:false,recv:false}));
    g.add(mesh(new T.PlaneGeometry(30,1.4),aoM,7,4.6,.014,{r:[0,0,PI],cast:false,recv:false}));
    const dk=wood('#5a3420'), md=wood('#7a4a2a'), gold=metal('#e9c06a');
    st.add(box(30,.4,.18,dk,7,.2,.09)); st.add(box(.18,.4,24,dk,.09,.2,6)); st.add(box(30,.08,.24,md,7,.44,.12)); st.add(box(.24,.08,24,md,.12,.44,6));
    st.add(box(30,.44,.36,dk,7,5.3,.18)); st.add(box(.36,.44,24,dk,.18,5.3,6));
    [0.2,2.6,6.1,9.6,13].forEach(x=>{ st.add(box(.38,5.3,.32,md,x,2.65,.16)); st.add(box(.5,.3,.42,dk,x,.6,.2)); st.add(box(.5,.24,.42,dk,x,4.96,.2)); });
    [3.2,6.2,9.4].forEach(z=>{ st.add(box(.32,5.3,.38,md,.16,2.65,z)); st.add(box(.42,.3,.5,dk,.2,.6,z)); });
    [1.4,6.1,10.8].forEach(x=>{ st.add(box(.28,.32,3.4,dk,x,5.46,1.7)); st.add(box(.22,1.4,.22,dk,x,4.88,.58,{r:[.7,0,0]})); });
    // arched windows with curtains
    [[4.35,2.6,3.5],[7.85,2.6,3.5],[11.5,2.2,3.2]].forEach(([x,w,h])=>{ const y0=1.55;
      st.add(mesh(new T.ShapeGeometry(archShape(w+.4,h+.22),24), dk, x,y0-.09,.03,{cast:false}));
      const sky=TEX.sky.clone(); sky.repeat.set(1/w,1/h); sky.offset.set(.5,0); sky.needsUpdate=true;
      g.add(mesh(new T.ShapeGeometry(archShape(w,h),24), new T.MeshBasicMaterial({map:sky, color:new T.Color(1.25,1.2,1.4)}), x,y0,.05,{cast:false,recv:false}));
      st.add(box(.09,h-.1,.07,dk,x,y0+h/2-.05,.09,{cast:false})); [.3,.6].forEach(k=>st.add(box(w,.08,.07,dk,x,y0+h*k,.09,{cast:false}))); st.add(box(w+.7,.16,.5,md,x,y0-.08,.25));
      [-1,1].forEach(s=>{ for(let i=0;i<3;i++) st.add(cyl(.1,.13,h+.2,M('#5a2f8a',{roughness:.95}),x+s*(w/2+.02+i*.13),y0+h/2+.05,.2+i*.02)); st.add(tor(.2,.035,gold,x+s*(w/2+.15),y0+h*.42,.22,{r:[PI/2,0,0],s:[1,.6,1]})); });
      st.add(cyl(.04,.04,w+1,gold,x,y0+h+.2,.26,{r:[0,0,PI/2]}));
      // sill dressing
      const b=bottle(BOTTLE_COLS[Math.floor(x)%6],1.3,2); b.position.set(x-w*.3,y0,.3); st.add(b); st.add(cyl(.09,.07,.13,M('#b8683a'),x+w*.28,y0+.065,.3)); for(let i=0;i<5;i++) st.add(sph(1,M('#6fc257'),x+w*.28+Math.cos(i*1.3)*.07,y0+.2+i*.02,.3+Math.sin(i*1.3)*.07,{s:[.09,.03,.05],r:[0,i*1.3,.5]}));
      g.add(glow('#8f8cff', 5, x,y0+h*.55,.5,.2)); });
    // moonlight shafts
    [[4.35,2.6],[7.85,2.6]].forEach(([x,w])=>{ const geo=new T.BufferGeometry(); const y1=4.9; const v=[x-w/2,y1,.1, x+w/2,y1,.1, x+w/2-1.2,.02,6.6, x-w/2,y1,.1, x+w/2-1.2,.02,6.6, x-w/2-1.2,.02,6.6];
      geo.setAttribute('position', new T.Float32BufferAttribute(v,3)); g.add(new T.Mesh(geo,new T.MeshBasicMaterial({color:'#9aa8ff',transparent:true,opacity:.085,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending})));
      const pool=mesh(new T.PlaneGeometry(w+.6,3.2),new T.MeshBasicMaterial({map:TEX.soft,color:'#8f9cff',transparent:true,opacity:.22,depthWrite:false,blending:T.AdditiveBlending}),x-1.1,.02,5,{r:[-PI/2,0,.18],cast:false,recv:false}); g.add(pool); });
    // wall sconces between the windows
    [2.6,6.1,9.6].forEach((x,i)=>{ st.add(box(.12,.3,.16,dk,x,3.0,.4)); st.add(cyl(.11,.08,.05,gold,x,3.16,.46)); st.add(cyl(.04,.04,.2,M('#f6ecd4'),x,3.28,.46));
      const f=sph(.045,M('#ffe0a0',{emissive:'#ffb030',emissiveIntensity:4}),x,3.43,.46,{s:[1,1.8,1],cast:false,keep:true}); g.add(f); const sp=glow('#ffb060',1.5,x,3.42,.5,.5); g.add(sp); flick.push({sprite:sp,sb:1.5,ph:i*1.7}); });
    // fairy lights strung along the back beam
    const fcols=['#ffd27a','#ff9fc0','#c08cff','#8fe0ff']; const fm=fcols.map(c=>M(c,{emissive:c,emissiveIntensity:3.2}));
    for(let s=0;s<4;s++){ const x0=[.2,2.6,6.1,9.6][s], x1=[2.6,6.1,9.6,13][s]; const n=Math.round((x1-x0)*3.2); for(let i=1;i<n;i++){ const t=i/n, x=x0+(x1-x0)*t, y=5.02-Math.sin(t*PI)*.34; const b=sph(.045,fm[(i+s)%4],x,y,.42,{cast:false,recv:false,keep:true}); b.userData.tw=(i*1.7+s); twinkle.push(b); g.add(b); if(i%3===0) g.add(glow(fcols[(i+s)%4],.5,x,y,.46,.35)); } }
    // door
    const dz=DOOR.y+.5; st.add(mesh(new T.ShapeGeometry(archShape(1.6,3.0),18), dk, .03,0,dz,{r:[0,PI/2,0],cast:false}));
    st.add(mesh(new T.ShapeGeometry(archShape(1.25,2.75),18), wood('#9a6238'), .06,0,dz,{r:[0,PI/2,0],cast:false}));
    st.add(sph(.07,gold,.14,1.25,dz+.42)); [0.7,1.5,2.2].forEach(y=>st.add(box(.035,.09,1.2,M('#3a2414',{metalness:.5,roughness:.5}),.09,y,dz,{cast:false}))); st.add(mesh(new T.CircleGeometry(.22,16),new T.MeshBasicMaterial({color:new T.Color(1.3,1.1,1.6)}),.1,2.2,dz,{r:[0,PI/2,0],cast:false,recv:false,keep:true}));
    st.add(mesh(new T.PlaneGeometry(1.0,.75), M('#7a3a3a',{roughness:1}), .78,.016,dz,{r:[-PI/2,0,0],cast:false}));
    // banner, wall shelves with jars and books, hanging herbs
    st.add(mesh(new T.PlaneGeometry(1.1,2.2), new T.MeshStandardMaterial({map:TEX.banner, roughness:.95}), .1,3.3,4.9,{r:[0,PI/2,0],cast:false})); st.add(cyl(.03,.03,1.3,gold,.12,4.42,4.9,{r:[PI/2,0,0]}));
    st.add(box(.38,.07,2.4,md,.23,2.5,1.7)); [1.0,2.4].forEach(z=>st.add(box(.3,.25,.06,dk,.2,2.36,z,{r:[0,0,0]}))); for(let i=0;i<6;i++){ const b=bottle(BOTTLE_COLS[i],1.15,i%3); b.position.set(.26,2.54,.75+i*.38); st.add(b); }
    st.add(box(.38,.07,1.8,md,.23,3.5,2.0)); const bk=['#8a2a3a','#2a5a8a','#3a7a4a','#c8903a','#5a3a8a','#8a5a2a']; for(let i=0;i<9;i++){ const h=.3+R()*.14; st.add(box(.24,h,.1+R()*.05,M(bk[i%6]),.24,3.54+h/2,1.25+i*.17,{r:[i===8?.3:0,0,0]})); }
    [[1.4,1.2],[6.1,1.0],[10.8,1.3]].forEach(([x,z],k)=>{ for(let i=0;i<3;i++){ const xx=x-.4+i*.4; st.add(cyl(.008,.008,.5,M('#3a2414'),xx,5.05,z,{cast:false})); st.add(cone(.11,.42,M(['#7a9a5a','#9a7ac8','#c8a05a'][(i+k)%3]),xx,4.62,z,{r:[PI,0,0]})); st.add(tor(.045,.012,M('#c8a878'),xx,4.8,z,{r:[PI/2,0,0]})); } });
    // hanging lanterns
    [[2.6,3.9,2.6],[9.3,3.9,2.4],[6.1,4.3,1.3]].forEach(([x,y,z],i)=>{ st.add(cyl(.012,.012,5.3-y,M('#2a1a14'),x,(5.3+y)/2,z,{cast:false}));
      g.add(cyl(.17,.2,.34,M('#ffcf70',{emissive:'#ffa030',emissiveIntensity:2.6,roughness:.4}),x,y-.17,z,{cast:false,keep:true})); st.add(cone(.26,.2,dk,x,y+.1,z)); st.add(cyl(.21,.17,.05,dk,x,y-.36,z)); [0,1.57,3.14,4.71].forEach(a=>st.add(box(.02,.36,.02,M('#2a1a14'),x+Math.cos(a)*.185,y-.17,z+Math.sin(a)*.185,{cast:false})));
      const L=new T.PointLight('#ffb060', i===2?20:30, 11, 2); L.position.set(x,y-.3,z); g.add(L); const sp=glow('#ffb060',2.2,x,y-.17,z,.5); g.add(sp); flick.push({light:L, base:L.intensity, sprite:sp, sb:2.2, ph:i*2}); });
    // vines
    const leafG=new T.SphereGeometry(.13,7,5); const lm=[M('#4f9a3c'),M('#6fc257'),M('#3f7d34')];
    for(let i=0;i<26;i++){ const x=.5+R()*12.5, len=.4+R()*1.5; const n=3+Math.floor(len*4.5); for(let k=0;k<n;k++) st.add(mesh(leafG,lm[(i+k)%3], x+Math.sin(k*1.7+i)*.1, 5.15-k*(len/n), .34+R()*.14,{s:[1,.32,.72],r:[R()*1.2-.6,R()*3,R()*1.2-.6],cast:false})); if(i%4===0) st.add(sph(.05,M('#ff9fc0',{emissive:'#ff7fa8',emissiveIntensity:.6}),x,5.1-len,.42,{cast:false})); }
    for(let i=0;i<11;i++){ const z=.6+R()*7.4, len=.4+R()*1.1; const n=3+Math.floor(len*4.5); for(let k=0;k<n;k++) st.add(mesh(leafG,lm[(i+k)%3], .36+R()*.12, 5.15-k*(len/n), z+Math.sin(k*1.7+i)*.1,{s:[.72,.32,1],r:[R()-.5,R()*3,R()-.5],cast:false})); }
    // set dressing beyond the playable floor
    const s1=furnModel('cabinet',3); s1.position.set(12.1,0,.5); g.add(s1); const p1=furnModel('plant'); p1.position.set(10.9,0,.6); p1.scale.setScalar(1.3); g.add(p1); const p2=furnModel('plant',2); p2.position.set(11.7,0,7.4); p2.scale.setScalar(1.5); g.add(p2);
    const barrel=(x,z,s)=>{ st.add(lathe([[0,0],[.3,0],[.36,.3],[.36,.5],[.3,.8],[0,.8]],md,x,0,z,{s:[s,s,s]})); [.18,.62].forEach(y=>st.add(tor(.345*s,.02*s,M('#3a2a1a',{metalness:.6,roughness:.5}),x,y*s,z,{r:[PI/2,0,0]}))); };
    barrel(12.7,2.7,1.1); barrel(13.5,3.5,.9); st.add(box(.8,.8,.8,md,11.2,.4,3.6,{r:[0,.4,0]})); st.add(box(.5,.5,.5,dk,11.25,1.05,3.6,{r:[0,.9,0]})); const bb=bottle('#b07af5',1.6,2); bb.position.set(12.7,.9,2.7); st.add(bb);
    bake(st);
    return g;
  }

  /* ---------- furniture: origin at footprint centre, front faces +z ---------- */
  const caul={};
  function shelfUnit(w, h, seed){ const g=new T.Group(); const wd=wood('#8a5632'), dk=wood('#5e381f'), gold=metal('#e9c06a'); const d=.62;
    g.add(box(w,h,.06,dk,0,h/2,-d/2+.03)); g.add(box(.08,h,d,wd,-w/2+.04,h/2,0)); g.add(box(.08,h,d,wd,w/2-.04,h/2,0));
    g.add(box(w,.62,d,wd,0,.31,0)); g.add(box(w+.1,.08,d+.08,dk,0,.65,0)); g.add(box(w+.06,.1,d+.04,dk,0,.05,0));
    const cols=Math.round(w/.45); for(let i=0;i<cols;i++){ const x=-w/2+(i+.5)*(w/cols); g.add(box(w/cols-.1,.4,.03,dk,x,.33,d/2+.005,{cast:false})); g.add(box(w/cols-.18,.3,.02,wd,x,.33,d/2+.012,{cast:false})); g.add(sph(.03,gold,x,.33,d/2+.04,{cast:false})); }
    const ys=[.69, .69+(h-.8)/3, .69+2*(h-.8)/3]; ys.forEach((y,r)=>{ if(r) g.add(box(w-.12,.05,d-.06,wd,0,y-.025,0)); const n=Math.round(w/.3); for(let i=0;i<n;i++){ const sd=(i*2+r*3+seed);
        if((sd*7)%11===0){ for(let k=0;k<3;k++) g.add(box(.2-k*.02,.045,.26,M(['#8a2a3a','#2a5a8a','#3a7a4a'][(k+sd)%3]),-w/2+(i+.5)*(w/n),y+.025+k*.047,.04,{r:[0,k*.3-.2,0],cast:false})); }
        else { const b=bottle(BOTTLE_COLS[sd%6], .95+((i+r)%3)*.12, sd%3); b.position.set(-w/2+(i+.5)*(w/n), y, .05+((i+r)%2)*.11); g.add(b); } } });
    g.add(box(w+.12,.1,d+.08,dk,0,h,0)); g.add(mesh(new T.ShapeGeometry(archShape(w*.72,.36),12), dk, 0,h+.04,d/2-.02)); g.add(mesh(new T.CircleGeometry(.07,5),gold,0,h+.2,d/2-.01,{cast:false}));
    return g; }
  function furnModel(type, seed=0){
    const g=new T.Group(); const wd=wood('#8a5632'), dk=wood('#5e381f'), gold=metal('#e9c06a');
    switch(type){
      case 'shelf': bake(g.add(shelfUnit(.92,2.25,seed))); return g;
      case 'cabinet': bake(g.add(shelfUnit(1.9,2.7,seed+1))); return g;
      case 'table': { g.add(cyl(.5,.5,.07,wd,0,.72,0)); g.add(cyl(.07,.1,.7,dk,0,.36,0)); g.add(cyl(.3,.34,.06,dk,0,.03,0)); g.add(cyl(.44,.44,.02,M('#6a3fae'),0,.765,0,{cast:false})); g.add(tor(.44,.012,gold,0,.77,0,{r:[PI/2,0,0]}));
        [[-.18,.08,0],[.16,-.1,2],[.02,.2,4]].forEach(([x,z,c])=>{ const b=bottle(BOTTLE_COLS[(c+seed)%6],1.35,(c+seed)%3); b.position.set(x,.78,z); g.add(b); }); break; }
      case 'counter': { g.add(box(1.86,.86,.78,wd,0,.43,0)); g.add(box(2.02,.1,.94,dk,0,.91,0)); g.add(box(1.94,.08,.84,dk,0,.04,0)); [-.62,0,.62].forEach(x=>{ g.add(box(.5,.56,.03,dk,x,.45,.395,{cast:false})); g.add(box(.4,.46,.02,wd,x,.45,.405,{cast:false})); });
        g.add(box(.74,.02,.96,M('#6a3fae',{roughness:.95}),0,.965,0,{cast:false})); g.add(mesh(new T.PlaneGeometry(.74,.62), M('#6a3fae',{side:T.DoubleSide,roughness:.95}),0,.65,.485,{cast:false}));
        g.add(mesh(new T.CircleGeometry(.13,4), M('#e9c06a',{emissive:'#a8782a',emissiveIntensity:.5}),0,.66,.49,{cast:false})); g.add(box(.78,.04,.02,gold,0,.36,.488,{cast:false}));
        g.add(box(.3,.03,.4,M('#f6ecd4'),-.52,.985,.02,{r:[0,.2,.12]})); g.add(box(.3,.03,.4,M('#f6ecd4'),-.24,.985,.08,{r:[0,.2,-.12]})); g.add(box(.62,.02,.44,M('#7a2a3a'),-.38,.968,.05,{r:[0,.2,0]}));
        g.add(mesh(new T.SphereGeometry(.11,18,10,0,7,0,1.6),gold,.62,.97,.1)); g.add(sph(.03,gold,.62,1.1,.1));
        g.add(cyl(.012,.012,.3,gold,.3,1.1,.22)); g.add(box(.3,.012,.012,gold,.3,1.25,.22)); [-1,1].forEach(s=>{ g.add(cyl(.004,.004,.12,gold,.3+s*.14,1.19,.22)); g.add(cyl(.06,.04,.02,gold,.3+s*.14,1.12,.22)); }); g.add(cyl(.07,.09,.03,gold,.3,.97,.22));
        g.add(cyl(.05,.04,.1,M('#2a2a4a'),-.75,1.0,-.2)); g.add(cone(.012,.26,M('#f0f0f0'),-.73,1.14,-.2,{r:[0,0,-.3],s:[1,1,.3]}));
        const b=bottle('#b07af5',1.2,0); b.position.set(.72,.97,-.22); g.add(b); const b2=bottle('#6fe05a',1,1); b2.position.set(.5,.97,-.27); g.add(b2); break; }
      case 'cauldron': { const stone=M('#6a5a6e',{roughness:.95}); for(let i=0;i<10;i++){ const a=i/10*6.283; g.add(box(.3,.16,.2,stone,Math.cos(a)*.68,.08,Math.sin(a)*.68,{r:[0,-a+PI/2,0]})); }
        g.add(cyl(.62,.62,.02,M('#2a1c1c'),0,.012,0,{cast:false})); [0,1.05,2.1].forEach(a=>g.add(cyl(.055,.055,.85,dk,0,.09,0,{r:[PI/2,0,a]})));
        [0,2.09,4.19].forEach(a=>g.add(cyl(.03,.045,.34,M('#2a2230',{metalness:.6,roughness:.5}),Math.cos(a)*.4,.2,Math.sin(a)*.4,{r:[Math.sin(a)*.3,0,-Math.cos(a)*.3]})));
        const iron=M('#4a3d60',{roughness:.42,metalness:.6,envMapIntensity:1.2,side:T.DoubleSide});
        const pot=lathe([[0,.22],[.3,.23],[.52,.38],[.62,.64],[.58,.9],[.48,1.03],[.53,1.07],[.56,1.1]],iron,0,0,0,{keep:true}); g.add(pot); caul.pot=pot;
        g.add(tor(.545,.05,M('#5a4a70',{roughness:.35,metalness:.7,envMapIntensity:1.3}),0,1.09,0,{r:[PI/2,0,0]})); [-1,1].forEach(s=>g.add(tor(.13,.032,iron,s*.63,.88,0)));
        g.add(tor(.12,.036,gold,0,.68,.615,{r:[-.12,0,2.2],cast:false},3.7)); [[-.33,.5,.51,.05],[.35,.78,.5,.05],[.22,.44,.51,.04],[-.2,.86,.5,.035]].forEach(([x,y,z,r])=>g.add(mesh(new T.CircleGeometry(r,4),gold,x,y,z,{r:[-.2,x*1.2,0],cast:false})));
        caul.liqMat=new T.MeshBasicMaterial({map:TEX.swirl, color:'#b86af0'}); caul.liquid=mesh(new T.CircleGeometry(.51,32),caul.liqMat,0,1.0,0,{r:[-PI/2,0,0],cast:false,recv:false,keep:true}); g.add(caul.liquid);
        caul.runes=mesh(new T.PlaneGeometry(2.7,2.7),new T.MeshBasicMaterial({map:TEX.runes,color:'#b86af0',transparent:true,opacity:.5,depthWrite:false,blending:T.AdditiveBlending}),0,.02,0,{r:[-PI/2,0,0],cast:false,recv:false}); g.add(caul.runes);
        caul.flames=[]; for(let i=0;i<8;i++){ const f=new T.Sprite(new T.SpriteMaterial({map:TEX.flame,color:'#ffffff',transparent:true,blending:T.AdditiveBlending,depthWrite:false})); f.userData={a:i/8*6.283,ph:i*1.3}; f.center.set(.5,.1); caul.flames.push(f); g.add(f); }
        caul.embers=[]; for(let i=0;i<10;i++){ const e=glow('#ffb040',.07,0,0,0,1); e.userData={ph:R(),a:R()*6.28,r:.3+R()*.4}; caul.embers.push(e); g.add(e); }
        caul.bubbles=[]; for(let i=0;i<8;i++){ const b=sph(.05,new T.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:.7}),0,1,0,{cast:false,recv:false}); b.userData={a:R()*6.28,r:.1+R()*.32,ph:R()*3,sp:.5+R()}; caul.bubbles.push(b); g.add(b); }
        caul.steam=[]; for(let i=0;i<8;i++){ const s=glow('#c08cff',.8,0,1.2,0,.25,false); s.userData={ph:i/8}; caul.steam.push(s); g.add(s); }
        caul.fire=new T.PointLight('#ff8a30',26,7,2); caul.fire.position.set(0,.5,.5); g.add(caul.fire);
        caul.brew=new T.PointLight('#b86af0',20,7,2); caul.brew.position.set(0,1.5,0); g.add(caul.brew);
        caul.glow=glow('#b86af0',2.8,0,1.2,0,.4); g.add(caul.glow); caul.fglow=glow('#ff8a30',2,0,.3,.3,.5); g.add(caul.fglow); caul.group=g; break; }
      case 'plant': { g.add(lathe([[0,0],[.17,0],[.2,.06],[.27,.36],[.29,.4],[.25,.4]],M('#b8683a',{roughness:.7}),0,0,0)); g.add(tor(.27,.03,M('#c87848'),0,.39,0,{r:[PI/2,0,0]})); g.add(cyl(.24,.24,.02,M('#3a2414'),0,.39,0,{cast:false}));
        const cols=['#4f9a3c','#6fc257','#3f7d34','#86d26a']; for(let i=0;i<17;i++){ const a=i*2.4+seed, r=.08+(i%4)*.1, y=.52+(i%6)*.13; g.add(sph(1,M(cols[i%4]),Math.cos(a)*r,y,Math.sin(a)*r,{s:[.24,.05,.11],r:[0,-a,.45+(i%3)*.3]})); g.add(cyl(.012,.012,y-.38,M('#3f7d34'),Math.cos(a)*r*.5,(y+.38)/2,Math.sin(a)*r*.5,{cast:false,r:[Math.sin(a)*.3,0,-Math.cos(a)*.3]})); }
        if(seed%2) for(let i=0;i<3;i++) g.add(sph(.05,M('#ff9fc0',{emissive:'#ff7fa8',emissiveIntensity:.5}),Math.cos(i*2.1)*.2,1.05+i*.06,Math.sin(i*2.1)*.2)); break; }
      case 'bench': { g.add(box(1.8,.1,.6,wd,0,.4,0)); [[-.8,-.22],[.8,-.22],[-.8,.22],[.8,.22]].forEach(([x,z])=>g.add(box(.1,.4,.1,dk,x,.2,z))); g.add(box(1.8,.5,.08,wd,0,.72,-.28)); [-.86,.86].forEach(x=>g.add(box(.08,.3,.56,dk,x,.6,0)));
        g.add(box(1.62,.13,.5,M('#8a4f9a',{roughness:1}),0,.5,.02)); g.add(sph(1,M('#f0b84a',{roughness:1}),-.55,.66,-.1,{s:[.2,.15,.1],r:[.3,0,.2]})); g.add(sph(1,M('#6ab8d8',{roughness:1}),.5,.66,-.12,{s:[.18,.14,.1],r:[.3,0,-.2]})); break; }
      case 'rug': { g.add(mesh(new T.PlaneGeometry(1.92,1.92), new T.MeshStandardMaterial({map:TEX.rug, roughness:1}),0,.014,0,{r:[-PI/2,0,0],cast:false})); return g; }
      case 'candles': { g.add(cyl(.2,.25,.05,gold,0,.025,0)); g.add(lathe([[.03,.05],[.06,.2],[.03,.5],[.05,.9],[.035,1.1]],gold,0,0,0)); g.add(box(.72,.04,.04,gold,0,.95,0)); [-.33,0,.33].forEach((x,i)=>{ const y=i===1?1.16:1.0; g.add(cyl(.06,.04,.06,gold,x,y-.02,0)); g.add(cyl(.036,.036,.24,M('#f6ecd4'),x,y+.12,0)); g.add(sph(.045,M('#ffe0a0',{emissive:'#ffb030',emissiveIntensity:4}),x,y+.3,0,{s:[1,1.8,1],cast:false,keep:true})); });
        const L=new T.PointLight('#ffb050',11,5,2); L.position.set(0,1.5,.1); g.add(L); const sp=glow('#ffb050',1.7,0,1.4,0,.5); g.add(sp); flick.push({light:L,base:11,sprite:sp,sb:1.7,ph:seed,dyn:true}); break; }
      case 'window': { g.add(cyl(.46,.5,.3,wd,0,.15,0)); g.add(cyl(.34,.38,.3,dk,0,.45,0)); g.add(cyl(.48,.48,.02,M('#6a3fae'),0,.31,0,{cast:false})); g.add(tor(.48,.014,gold,0,.315,0,{r:[PI/2,0,0]}));
        const cr=mesh(new T.OctahedronGeometry(.2,0),M('#c08cff',{emissive:'#a060ff',emissiveIntensity:2.6,roughness:.15}),0,.95,0,{s:[1,1.6,1],cast:false,keep:true}); cr.userData.spin=1; g.add(cr); g.add(cone(.1,.14,gold,0,.66,0,{r:[PI,0,0]}));
        [[-.3,.2],[.3,.2],[0,.36]].forEach(([x,z],i)=>{ const b=bottle(BOTTLE_COLS[(i*2+seed)%6],1.3,i%3); b.position.set(x,.32,z); g.add(b); });
        const L=new T.PointLight('#b070ff',9,4.5,2); L.position.set(0,1.2,.2); g.add(L); g.add(glow('#b070ff',1.6,0,.95,0,.45)); break; }
      case 'catbed': { g.add(tor(.3,.12,M('#a8505a',{roughness:1}),0,.11,0,{r:[PI/2,0,0]})); g.add(cyl(.3,.3,.08,M('#e8c0a0',{roughness:1}),0,.07,0));
        const cat=new T.Group(), bk=M('#2a2230',{roughness:.9}); cat.add(sph(1,bk,0,.2,0,{s:[.25,.15,.2]})); cat.add(sph(.13,bk,.2,.27,.08)); cat.add(cone(.045,.09,bk,.16,.39,.03)); cat.add(cone(.045,.09,bk,.25,.39,.1)); cat.add(sph(1,M('#f2e6d8'),.1,.17,.14,{s:[.08,.064,.05]})); cat.add(sph(.02,M('#ff9fb0'),.3,.26,.14));
        cat.add(tor(.17,.035,bk,-.08,.12,.12,{r:[PI/2,0,2.6]},3.4)); cat.userData.breathe=1; cat.userData.keep=true; g.add(cat); break; }
      case 'lantern': { g.add(cyl(.16,.22,.08,dk,0,.04,0)); g.add(cyl(.04,.055,1.8,dk,0,.9,0)); g.add(box(.44,.05,.05,dk,.17,1.76,0)); g.add(box(.2,.04,.04,dk,.1,1.66,0,{r:[0,0,.7]})); g.add(cyl(.01,.01,.14,M('#2a1a14'),.34,1.67,0,{cast:false}));
        g.add(cyl(.11,.13,.24,M('#ffcf70',{emissive:'#ffa030',emissiveIntensity:2.8}),.34,1.48,0,{cast:false,keep:true})); g.add(cone(.17,.13,dk,.34,1.66,0)); g.add(cyl(.14,.11,.04,dk,.34,1.35,0));
        const L=new T.PointLight('#ffb050',13,5.5,2); L.position.set(.34,1.45,.15); g.add(L); const sp=glow('#ffb050',1.7,.34,1.48,0,.5); g.add(sp); flick.push({light:L,base:13,sprite:sp,sb:1.7,ph:seed+1,dyn:true}); break; }
    }
    bake(g);
    return g;
  }

  /* ---------- portraits rendered from the 3D figures ---------- */
  let pR, pScene, pCam; const pCache={};
  function portraitURL(key, expr='neutral'){
    if(!A.ok) return null; const k=key+'|'+expr; if(pCache[k]) return pCache[k];
    try{
      if(!pR){ pR=new T.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true}); pR.setSize(256,256,false); pR.setClearColor(0,0); pR.toneMapping=T.ACESFilmicToneMapping; pR.toneMappingExposure=1.05; if('useLegacyLights' in pR) pR.useLegacyLights=false;
        pScene=new T.Scene(); pScene.environment=G3.makeEnv(pR); pScene.add(new T.HemisphereLight('#fff0ff','#8a6a9a',.9)); const k1=new T.DirectionalLight('#ffe2b8',2.6); k1.position.set(2,2.5,3); pScene.add(k1); const k2=new T.DirectionalLight('#9a8cff',2.2); k2.position.set(-3,1.8,-2.5); pScene.add(k2); const k3=new T.DirectionalLight('#ffb0d0',.8); k3.position.set(-2,0,2); pScene.add(k3);
        pCam=new T.PerspectiveCamera(26,1,.1,20); }
      const m=C3.build(key,expr), r=m.userData.rig, sp=C3.SPEC[key]||{}; m.scale.setScalar(1); m.rotation.y=.32; r.head.rotation.y=-.2;
      if(expr==='think'){ r.head.rotation.z=-.12; r.head.rotation.y=-.35; } if(expr==='sad'){ r.head.rotation.x=.16; } if(expr==='happy'){ r.head.rotation.z=.07; r.head.rotation.x=-.06; } if(expr==='shock'){ r.head.rotation.x=-.12; r.torso.rotation.x=-.1; }
      if(r.holdL){ r.armL.rotation.x=-.55; r.elbowL.rotation.x=-1.05; } if(r.holdR){ r.armR.rotation.x=-.5; r.elbowR.rotation.x=-1; }
      const P=PORTRAITS[key]; const hy=1.0+.285*(sp.head||1); const tall=P.hat==='witch'||P.hat==='tophat'||P.hat==='tricorn'||P.candle||P.hairStyle==='flame'||(sp.props||[]).some(x=>x==='bakerhat'||x==='partyhat'||x==='antennae'); const d=tall?3.0:2.45;
      pCam.position.set(.5, hy+.1+(tall?.08:0), d); pCam.lookAt(0, hy-.06+(tall?.1:0), 0);
      pScene.add(m); pR.render(pScene,pCam); pScene.remove(m); C3.dispose(m);
      const dURL=pR.domElement.toDataURL('image/png'); const bin=atob(dURL.split(',')[1]); const u8=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u8[i]=bin.charCodeAt(i);
      return pCache[k]=URL.createObjectURL(new Blob([u8],{type:'image/png'}));
    }catch(e){ return null; }
  }

  /* ---------- scene state ---------- */
  let furnRoot, charRoot, gridOverlay, selMark, ghostG=null, ghostKey='', bubble, layoutSig='';
  const furn={}, chars={};
  const cam={pos:V3(6,10,18), look:V3(5,.8,3.6), off:[0,0], tp:V3(6,10,18), tl:V3(5,.8,3.6), to:[0,0]};
  let mode='shop';

  function init(){
    try{ renderer=new T.WebGLRenderer({antialias:true, powerPreference:'high-performance'}); }catch(e){ return; }
    if(!renderer.getContext()) return;
    A.low=/low/.test(location.hash);
    renderer.shadowMap.enabled=!A.low; renderer.shadowMap.type=T.PCFSoftShadowMap; renderer.toneMapping=T.ACESFilmicToneMapping; renderer.toneMappingExposure=1.0; if('useLegacyLights' in renderer) renderer.useLegacyLights=false;
    const cv=renderer.domElement; cv.id='gl'; const st=document.getElementById('stage'); st.insertBefore(cv, st.firstChild);
    scene=new T.Scene(); scene.background=new T.Color('#120a1e'); scene.fog=new T.Fog('#1a1030',24,50);
    camera=new T.PerspectiveCamera(38,16/9,.5,80);
    G3.makeTextures();
    scene.environment=G3.makeEnv(renderer);
    scene.add(new T.HemisphereLight('#8a78e8','#b07a58',.75));
    const moon=new T.DirectionalLight('#9aa4ff',1.6); moon.position.set(8,11,-7); moon.target.position.set(5,0,5); moon.castShadow=true; moon.shadow.mapSize.set(2048,2048); Object.assign(moon.shadow.camera,{left:-12,right:12,top:12,bottom:-12,near:1,far:40}); moon.shadow.bias=-.0006; moon.shadow.normalBias=.03; moon.shadow.radius=3; scene.add(moon, moon.target);
    const key=new T.SpotLight('#ffcf9a',190,30,.62,.6,2); key.position.set(6.5,9,10); key.target.position.set(5,0,3.6); key.castShadow=true; key.shadow.mapSize.set(2048,2048); key.shadow.bias=-.0004; key.shadow.normalBias=.03; key.shadow.radius=4; scene.add(key, key.target);
    const rim=new T.DirectionalLight('#c08cff',.5); rim.position.set(-6,5,8); scene.add(rim);
    scene.add(buildRoom());
    furnRoot=new T.Group(); charRoot=new T.Group(); scene.add(furnRoot, charRoot);
    gridOverlay=new T.Group(); const lm=new T.LineBasicMaterial({color:new T.Color(2.4,1.9,1),transparent:true,opacity:.6}); const pts=[]; for(let x=0;x<=GRID_W;x++) pts.push(x,.022,0,x,.022,GRID_H); for(let z=0;z<=GRID_H;z++) pts.push(0,.022,z,GRID_W,.022,z);
    const lg=new T.BufferGeometry(); lg.setAttribute('position',new T.Float32BufferAttribute(pts,3)); gridOverlay.add(new T.LineSegments(lg,lm));
    gridOverlay.add(mesh(new T.PlaneGeometry(.9,.9),new T.MeshBasicMaterial({color:'#ff8a80',transparent:true,opacity:.4}),DOOR.x+.5,.025,DOOR.y+.5,{r:[-PI/2,0,0],cast:false,recv:false})); gridOverlay.visible=false; scene.add(gridOverlay);
    selMark=mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({color:new T.Color(2,1.6,.8),transparent:true,opacity:.4,depthWrite:false}),0,.03,0,{r:[-PI/2,0,0],cast:false,recv:false}); selMark.visible=false; scene.add(selMark);
    bubble=new T.Sprite(new T.SpriteMaterial({map:TEX.bubble,transparent:true,depthTest:false})); bubble.scale.setScalar(.6); bubble.visible=false; bubble.renderOrder=5; scene.add(bubble);
    const dn=160, dp=new Float32Array(dn*3); for(let i=0;i<dn;i++){ dp[i*3]=R()*13; dp[i*3+1]=.3+R()*4.5; dp[i*3+2]=R()*9; } const dg=new T.BufferGeometry(); dg.setAttribute('position',new T.BufferAttribute(dp,3));
    A.dust=new T.Points(dg,new T.PointsMaterial({map:TEX.soft,color:new T.Color(1.2,1,.7),size:.07,transparent:true,opacity:.55,depthWrite:false,blending:T.AdditiveBlending})); scene.add(A.dust);
    A.ok=true; document.body.classList.add('has3d'); A.resize(); post=/nopost/.test(location.hash)?null:G3.makePost(renderer);
    window.addEventListener('resize',()=>{ A.resize(); if(post) post.resize(); });
    requestAnimationFrame(frame);
  }
  A.resize=function(){ if(!renderer) return; const s=Math.max(.4,stageScale()); renderer.setPixelRatio(Math.min(2,(window.devicePixelRatio||1)*s)*(A.low?.5:1)); renderer.setSize(1600,900,false); };

  function place(g, it){ const [w,h]=fdims(it); g.position.set(it.x+w/2,0,it.y+h/2); g.rotation.y=it.rot?PI/2:0; }
  function rebuildFurniture(){ for(let i=flick.length-1;i>=0;i--) if(flick[i].dyn) flick.splice(i,1);
    while(furnRoot.children.length) furnRoot.remove(furnRoot.children[0]); Object.keys(furn).forEach(k=>delete furn[k]);
    S.layout.forEach((it,i)=>{ const g=furnModel(it.type,i); place(g,it); g.userData.fid=it.id; g.userData.type=it.type; if(!FURN[it.type].flat){ const [w,h]=fdims(it); const b=mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:TEX.blob,transparent:true,depthWrite:false,opacity:.8}),0,.018,0,{r:[-PI/2,0,0],cast:false,recv:false}); b.scale.set(FURN[it.type].w*1.5,FURN[it.type].h*1.5,1); g.add(b); } furnRoot.add(g); furn[it.id]=g; }); }
  function counterSpot(){ const c=S.layout.find(l=>l.type==='counter'); if(!c) return [5,5]; const [w,h]=fdims(c); return c.rot?[c.x+w+.8,c.y+h/2]:[c.x+w/2,c.y+h+.8]; }
  const WAIT=[[1.5,6.3],[2.7,7.1],[1.2,5.0],[3.9,7.3],[5.0,7.2]];
  function addChar(q, at){ const g=C3.build(q.key); g.userData.cid=q.id; g.position.set(at[0],0,at[1]); const sc=g.userData.sc; const b=mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:TEX.blob,transparent:true,depthWrite:false}),0,.02/sc,0,{r:[-PI/2,0,0],cast:false,recv:false}); b.scale.setScalar(.95); g.add(b); charRoot.add(g); return chars[q.id]={g,ph:R()*6,t:at}; }
  function dropChar(id){ const c=chars[id]; if(!c) return; charRoot.remove(c.g); C3.dispose(c.g); delete chars[id]; }

  A.sync=function(){ if(!A.ok||!S) return;
    const sig=JSON.stringify(S.layout.map(l=>[l.id,l.type,l.x,l.y,l.rot])); if(sig!==layoutSig){ layoutSig=sig; rebuildFurniture(); }
    const title=document.body.classList.contains('on-title');
    mode = title?'title': S.screen==='brew'?'brew': (S.screen==='shop'&&S.editMode)?'edit':'shop';
    gridOverlay.visible = mode==='edit';
    const sel=mode==='edit'&&S.editSel&&S.layout.find(l=>l.id===S.editSel); if(sel){ const [w,h]=fdims(sel); selMark.visible=true; selMark.scale.set(w,h,1); selMark.position.set(sel.x+w/2,.03,sel.y+h/2); } else selMark.visible=false;
    if(!(mode==='edit'&&S.placing) && ghostG){ scene.remove(ghostG); ghostG=null; ghostKey=''; }
    const showPeople = mode==='shop'||mode==='title';
    const want={}; if(showPeople){ let wi=0; const cs=counterSpot(); S.queue.forEach(q=>{ if(q.done) return; want[q.id]={q, t:(q.id===S.selCust&&mode==='shop')? cs : WAIT[Math.min(wi++,WAIT.length-1)]}; }); }
    Object.keys(chars).forEach(id=>{ const c=chars[id]; if(!want[id]){ if(!showPeople) dropChar(id); else if(c.react) c.pendingLeave=true; else if(!c.leaving){ c.leaving=true; c.t=[DOOR.x+.4,DOOR.y+.5]; } } });
    const fresh=A._seen!==S.day;
    Object.keys(want).forEach((id,i)=>{ const w=want[id]; let c=chars[id]; if(!c){ c=addChar(w.q, fresh?[DOOR.x+.5-i*.01,DOOR.y+.5]:w.t); c.delay=fresh?i*.7:0; } c.leaving=false; c.pendingLeave=false; const cur=id===S.selCust&&mode==='shop'; if(cur&&!c.cur) c.wave=1.2; c.t=w.t; c.cur=cur; });
    A._seen=S.day;
    charRoot.visible = showPeople;
    const ci=S.layout.find(l=>l.type==='cauldron'); const ids=Object.keys(S.brew.mix).filter(k=>S.brew.mix[k]>0);
    const col = (S.screen==='brew'&&ids.length) ? mixHex(ids.map(i=>INGM[i].p[0]),ids.map(i=>S.brew.mix[i])) : (S.screen==='brew' ? '#7a5ab8' : (S.stock[0]?S.stock[0].col:'#b86af0'));
    if(caul.liqMat){ caul.target=new T.Color(col); caul.heat=({cold:.1,gentle:.55,simmer:.85,boil:1.2,flare:1.6})[S.screen==='brew'?S.brew.heat:'gentle']; caul.stir=({still:0,cw:1,ccw:-1,brisk:3.2,alt:9})[S.screen==='brew'?S.brew.stir:'cw']; }
    const aim=(sel2,ax,ay)=>{ const el=document.querySelector(sel2); if(!el) return [0,0]; const p=stagePoint(el,ax,ay); return [800-p.x,450-p.y]; };
    if(mode==='brew'&&ci){ const cx=ci.x+.5, cz=ci.y+.5; cam.tp.set(cx+.4,3.4,cz+6.4); cam.tl.set(cx,.62,cz); cam.to=aim('#cstage',.5,.52);
      Object.values(furn).forEach(g=>{ g.visible = !(g.userData.type!=='cauldron'&&g.userData.type!=='rug' && g.position.z>cz+.45 && Math.abs(g.position.x-cx)<2.8); }); }
    else { Object.values(furn).forEach(g=>g.visible=true);
      if(mode==='edit'){ cam.tp.set(5.5,16.5,15.2); cam.tl.set(5,.2,4.1); cam.to=aim('#room',.5,.36); }
      else { cam.tp.set(6.3,9.6,18.4); cam.tl.set(5,.8,3.9); cam.to=S.screen==='shop'?aim('#room',.5,.37):[46,100]; } }
  };

  A.ghost=function(type,x,y,rot,ok){ if(!A.ok) return; const k=type+rot; if(!ghostG||ghostKey!==k){ if(ghostG) scene.remove(ghostG); const fl=flick.length, saved=Object.assign({},caul); ghostG=furnModel(type,0); flick.length=fl; Object.keys(caul).forEach(k=>delete caul[k]); Object.assign(caul,saved); ghostKey=k; ghostG.userData.col=null; scene.add(ghostG); }
    const col=ok?'#8fdc6f':'#ff8a80'; if(ghostG.userData.col!==col){ ghostG.userData.col=col; const gm=new T.MeshBasicMaterial({color:col,transparent:true,opacity:.55,depthWrite:false}); ghostG.traverse(o=>{ if(o.isMesh){ o.material=gm; o.castShadow=false; } if(o.isLight||o.isSprite) o.visible=false; }); }
    place(ghostG,{type,x,y,rot}); };

  const ray=new T.Raycaster(), ndc=new T.Vector2();
  A.pick=function(e){ if(!A.ok) return null; const r=renderer.domElement.getBoundingClientRect(); ndc.set(((e.clientX-r.left)/r.width)*2-1, -((e.clientY-r.top)/r.height)*2+1); ray.setFromCamera(ndc,camera);
    const out={}; const up=(o,k)=>{ while(o&&!o.userData[k]) o=o.parent; return o; };
    if(charRoot.visible){ const ch=ray.intersectObjects(charRoot.children,true)[0]; const o=ch&&up(ch.object,'cid'); if(o) out.cust=o.userData.cid; }
    const fh=ray.intersectObjects(furnRoot.children,true).find(h=>h.object.visible&&!h.object.isSprite); if(fh){ const o=up(fh.object,'fid'); if(o){ out.furn=o.userData.fid; out.ftype=o.userData.type; } }
    const p=V3(0,0,0); if(ray.ray.intersectPlane(new T.Plane(V3(0,1,0),0),p)){ const gx=Math.floor(p.x), gy=Math.floor(p.z); if(gx>=0&&gy>=0&&gx<GRID_W&&gy<GRID_H) out.tile={x:gx,y:gy}; }
    return out; };
  A.stagePos=function(x,y,z){ if(!A.ok) return {x:800,y:450}; const v=V3(x,y,z).project(camera); return {x:(v.x*.5+.5)*1600, y:(1-(v.y*.5+.5))*900}; };
  A.furnPos=function(id){ const g=furn[id]; return g?A.stagePos(g.position.x,.5,g.position.z):{x:800,y:450}; };
  A.cauldronPos=function(){ const g=caul.group; return g?A.stagePos(g.position.x,1.05,g.position.z):{x:800,y:400}; };
  A.brewFx=function(){ caul.pulse=1; };
  A.react=function(id, type){ const c=chars[id]; if(c) c.react={type,t:0}; };
  A.portraitURL=portraitURL;

  const tmpC=new T.Color();
  function frame(now){ requestAnimationFrame(frame); const dt=Math.min(.05,(now-last)/1000||.016); last=now; if(document.hidden) return; time+=dt;
    const k=1-Math.exp(-dt*3.2); cam.pos.lerp(cam.tp,k); cam.look.lerp(cam.tl,k); cam.off[0]+=(cam.to[0]-cam.off[0])*k; cam.off[1]+=(cam.to[1]-cam.off[1])*k;
    camera.position.copy(cam.pos); camera.lookAt(cam.look); camera.setViewOffset(1600,900,cam.off[0],cam.off[1],1600,900);
    flick.forEach(f=>{ const n=.86+.14*Math.sin(time*9+f.ph)*Math.sin(time*5.3+f.ph*2); if(f.light) f.light.intensity=f.base*n; f.sprite.scale.setScalar(f.sb*(.9+.1*n)); });
    twinkle.forEach(b=>{ b.scale.setScalar(.045*(.8+.3*Math.sin(time*2.2+b.userData.tw))); });
    if(caul.liqMat && caul.group && caul.group.parent){ if(caul.target) caul.liqMat.color.lerp(caul.target,.08); const h=caul.heat??.6, pulse=caul.pulse||0; caul.pulse=Math.max(0,pulse-dt*.9); const cold=h<.2;
      tmpC.copy(caul.liqMat.color).multiplyScalar(1.6+pulse*3); const st=caul.stir??1; caul.liquid.rotation.z += dt*(st===9?Math.sin(time*2)*3:st)*.9; caul.liquid.position.y=1.0+Math.sin(time*3)*.008;
      caul.flames.forEach(f=>{ const u=f.userData; const s=h*(.75+.35*Math.sin(time*12+u.ph)*Math.sin(time*7.3+u.ph*2)); const r=.34+.08*Math.sin(time*3+u.ph); f.position.set(Math.cos(u.a+time*.4)*r,.06,Math.sin(u.a+time*.4)*r); f.scale.set(.3+h*.12, Math.max(.02,.62*s), 1); f.material.color.set(cold?'#6ab8ff':'#ffffff'); f.material.opacity=cold?.5:.95; });
      caul.embers.forEach(e=>{ const u=e.userData; const p=(time*(.35+h*.3)+u.ph)%1; e.position.set(Math.cos(u.a+p*2)*u.r*(1-p*.3),.2+p*1.9,Math.sin(u.a+p*2)*u.r*(1-p*.3)); e.material.opacity=(cold?0:1)*(1-p)*Math.min(1,h); e.scale.setScalar(.05+.05*(1-p)); });
      caul.fire.intensity=(5+h*30)*(.85+.15*Math.sin(time*13)); caul.fire.color.set(cold?'#6ab8ff':'#ff8a30'); caul.fglow.material.opacity=.15+h*.35; caul.fglow.material.color.set(cold?'#6ab8ff':'#ff8a30');
      caul.brew.color.copy(caul.liqMat.color); caul.brew.intensity=18+pulse*140+Math.sin(time*2)*3; caul.glow.material.color.copy(caul.liqMat.color); caul.glow.material.opacity=.3+pulse*.5; caul.glow.scale.setScalar(2.8+pulse*2.6);
      caul.runes.material.color.copy(caul.liqMat.color).multiplyScalar(1.3+pulse*3); caul.runes.rotation.z+=dt*(.12+pulse*2); caul.runes.material.opacity=mode==='brew'?.75:.4;
      caul.pot.rotation.z=pulse>0?Math.sin(time*50)*.03*pulse:0;
      caul.bubbles.forEach(b=>{ const u=b.userData; const p=(time*u.sp*(.4+h)+u.ph)%1; b.position.set(Math.cos(u.a)*u.r,1.0+p*.18,Math.sin(u.a)*u.r); b.scale.setScalar(.05*(.4+p*1.1)); b.material.opacity=.75*(1-p); });
      caul.steam.forEach(s=>{ const p=(time*.2+s.userData.ph)%1; s.position.set(Math.sin(p*5+s.userData.ph*9)*.24,1.15+p*2.3,Math.cos(p*4+s.userData.ph*7)*.14); s.scale.setScalar(.5+p*1.6); s.material.opacity=.26*(1-p)*(.45+h*.5); s.material.color.copy(caul.liqMat.color).lerp(tmpC.set('#ffffff'),.35); }); }
    furnRoot.traverse(o=>{ if(o.userData.spin){ o.rotation.y+=dt*.8; o.position.y=.95+Math.sin(time*1.6)*.05; } if(o.userData.breathe){ o.scale.y=1+Math.sin(time*1.8)*.04; } });
    let curC=null; Object.keys(chars).forEach(id=>{ const c=chars[id], g=c.g; if(c.delay>0){ c.delay-=dt; g.visible=false; return; } g.visible=true;
      if(c.pendingLeave&&!c.react){ c.pendingLeave=false; c.leaving=true; c.t=[DOOR.x+.4,DOOR.y+.5]; }
      const dx=c.t[0]-g.position.x, dz=c.t[1]-g.position.z, d=Math.hypot(dx,dz); const turn=(ty,sp)=>{ g.rotation.y+=((ty-g.rotation.y+PI*3)%(PI*2)-PI)*sp; };
      if(d>.06 && !c.react){ c.moving=true; const sp=Math.min(d,dt*2.2*Math.sqrt(g.userData.sc)); g.position.x+=dx/d*sp; g.position.z+=dz/d*sp; turn(Math.atan2(dx,dz),.18); }
      else { c.moving=false; if(c.leaving){ dropChar(id); return; } turn(c.cur?.1:.55,.08); }
      C3.animate(c,dt,time); if(c.cur&&!c.leaving) curC=c; });
    if(curC&&mode==='shop'&&!curC.react){ bubble.visible=true; const sc=curC.g.userData.sc; bubble.position.set(curC.g.position.x+.36*sc, 1.9*sc+Math.sin(time*2.4)*.04, curC.g.position.z+.1); } else bubble.visible=false;
    if(A.dust){ const a=A.dust.geometry.attributes.position; for(let i=0;i<a.count;i++){ let y=a.getY(i)+dt*.06; if(y>5) y=.3; a.setY(i,y); a.setX(i,a.getX(i)+Math.sin(time*.4+i)*dt*.04); } a.needsUpdate=true; }
    if(post){ post.comp.uniforms.dim.value=1; post.render(scene,camera); } else { renderer.setRenderTarget(null); renderer.render(scene,camera); }
  }
  A.init=init;
  return A;
})();

/* portraits come from the 3D figures wherever the scene is available */
const _flatPortrait = portrait;
portrait = function(key, expr='neutral', size=96){ const u=S3D.portraitURL(key,expr); if(!u) return _flatPortrait(key,expr,size); const P=PORTRAITS[key];
  return `<img class="portrait" width="${size}" height="${size}" src="${u}" alt="" draggable="false" style="background:radial-gradient(circle at 50% 36%, ${shade(P.bg,.55)}, ${shade(P.bg,.1)} 60%, ${shade(P.bg,-.3)})">`; };
