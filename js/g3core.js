/* ============ G3 CORE: textures, materials, mesh helpers, geometry baking, outlines, post-processing ============ */
const G3 = (typeof THREE === 'undefined') ? null : (function(){
  const T = THREE, R = rng(4242);
  function ctex(w,h,draw,rep){ const c=document.createElement('canvas'); c.width=w; c.height=h; draw(c.getContext('2d'),w,h); const t=new T.CanvasTexture(c); t.colorSpace=T.SRGBColorSpace; t.anisotropy=8; if(rep){ t.wrapS=t.wrapT=T.RepeatWrapping; t.repeat.set(rep[0],rep[1]); } return t; }
  function rr(c,x,y,w,h,r){ c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }
  function star(c,x,y,r){ c.beginPath(); for(let k=0;k<8;k++){ const rad=k%2?r*.4:r, a=k*Math.PI/4-Math.PI/2; c.lineTo(x+Math.cos(a)*rad,y+Math.sin(a)*rad); } c.closePath(); c.fill(); }
  const TEX = {};
  function makeTextures(){
    if(TEX.floor) return TEX;
    TEX.floor = ctex(1024,1024,(c,w)=>{ c.fillStyle='#6b4a36'; c.fillRect(0,0,w,w); const n=4, s=w/n;
      for(let j=0;j<n;j++) for(let i=0;i<n;i++){ const v=R(); const col=mixHex(['#b98c62','#9a7150','#a98058','#c09468'],[v,1-v,.5,R()*.6]); const x=i*s+5, y=j*s+5, ww=s-10;
        const g=c.createLinearGradient(x,y,x+ww,y+ww); g.addColorStop(0,shade(col,.12)); g.addColorStop(.5,col); g.addColorStop(1,shade(col,-.16)); c.fillStyle=g; rr(c,x,y,ww,ww,18); c.fill();
        c.strokeStyle='rgba(40,20,10,.35)'; c.lineWidth=3; rr(c,x,y,ww,ww,18); c.stroke(); c.strokeStyle='rgba(255,236,200,.22)'; c.lineWidth=3; c.beginPath(); c.moveTo(x+16,y+6); c.lineTo(x+ww-16,y+6); c.stroke();
        for(let k=0;k<26;k++){ c.fillStyle=`rgba(${R()<.5?'60,34,14':'255,230,190'},${.05+R()*.1})`; c.beginPath(); c.arc(x+10+R()*(ww-20),y+10+R()*(ww-20),1+R()*5,0,7); c.fill(); }
        c.strokeStyle='rgba(50,26,10,.3)'; c.lineWidth=2; for(let k=0;k<2;k++){ c.beginPath(); let px=x+20+R()*(ww-40), py=y+20+R()*(ww-40); c.moveTo(px,py); for(let q=0;q<4;q++){ px+=R()*36-18; py+=R()*36-18; c.lineTo(px,py); } c.stroke(); } } }, [7.5,6]);
    TEX.stone = ctex(1024,512,(c,w,h)=>{ c.fillStyle='#2c1e3c'; c.fillRect(0,0,w,h); const rh=64; for(let j=0;j<8;j++){ let x=(j%2)*-70; while(x<w){ const bw=110+Math.floor(R()*3)*26; const v=R(); const col=mixHex(['#6a5482','#54426c','#77628e','#5e4a70'],[v,1-v,.4,R()*.5]);
          const g=c.createLinearGradient(0,j*rh,0,j*rh+rh); g.addColorStop(0,shade(col,.14)); g.addColorStop(.3,col); g.addColorStop(1,shade(col,-.2)); c.fillStyle=g; rr(c,x+4,j*rh+4,bw-8,rh-8,9); c.fill();
          for(let k=0;k<8;k++){ c.fillStyle=`rgba(${R()<.5?'20,10,30':'230,210,255'},${.04+R()*.08})`; c.beginPath(); c.arc(x+8+R()*(bw-16),j*rh+8+R()*(rh-16),1+R()*4,0,7); c.fill(); } x+=bw; } }
      for(let k=0;k<26;k++){ c.fillStyle=`rgba(80,140,70,${.1+R()*.14})`; c.beginPath(); c.arc(R()*w,R()*h,4+R()*12,0,7); c.fill(); } }, [5,1.6]);
    TEX.wood = ctex(256,256,(c,w)=>{ c.fillStyle='#8a5632'; c.fillRect(0,0,w,w); for(let i=0;i<90;i++){ c.strokeStyle=`rgba(${R()<.55?'50,24,8':'200,140,86'},${.07+R()*.14})`; c.lineWidth=1+R()*3; c.beginPath(); const y=R()*w; c.moveTo(0,y); c.bezierCurveTo(w*.3,y+R()*10-5,w*.6,y+R()*10-5,w,y+R()*8-4); c.stroke(); }
      for(let i=0;i<3;i++){ const x=R()*w,y=R()*w; c.strokeStyle='rgba(50,24,8,.35)'; c.lineWidth=2; for(let r=3;r<14;r+=4){ c.beginPath(); c.ellipse(x,y,r*1.8,r,0,0,7); c.stroke(); } } }, [1,1]);
    TEX.rug = ctex(512,512,(c,w)=>{ c.fillStyle='#55328f'; c.fillRect(0,0,w,w); for(let i=0;i<w;i+=4){ c.fillStyle=`rgba(255,255,255,${i%8?.02:.05})`; c.fillRect(0,i,w,2); }
      c.strokeStyle='#e9c06a'; c.lineWidth=14; c.strokeRect(22,22,w-44,w-44); c.lineWidth=4; c.setLineDash([14,10]); c.strokeRect(50,50,w-100,w-100); c.setLineDash([]);
      c.fillStyle='#7448b8'; c.beginPath(); c.arc(w/2,w/2,150,0,7); c.fill(); c.strokeStyle='#e9c06a'; c.lineWidth=3; c.beginPath(); c.arc(w/2,w/2,164,0,7); c.stroke(); c.fillStyle='#e9c06a'; c.beginPath(); c.arc(w/2,w/2,92,0,7); c.fill(); c.fillStyle='#7448b8'; c.beginPath(); c.arc(w/2+34,w/2-22,80,0,7); c.fill();
      c.fillStyle='#e9c06a'; [[110,110],[400,110],[110,400],[400,400],[256,84],[256,428],[84,256],[428,256]].forEach(([x,y])=>star(c,x,y,13)); for(let i=0;i<26;i++){ c.fillStyle='#c8a04a'; c.fillRect(8+i*19.4,0,6,12); c.fillRect(8+i*19.4,w-12,6,12); } });
    TEX.sky = ctex(256,512,(c,w,h)=>{ const g=c.createLinearGradient(0,0,0,h); g.addColorStop(0,'#141c66'); g.addColorStop(.4,'#4a3cb0'); g.addColorStop(.72,'#b06ac8'); g.addColorStop(.9,'#ff9a88'); g.addColorStop(1,'#ffc890'); c.fillStyle=g; c.fillRect(0,0,w,h);
      c.fillStyle='#fff'; for(let i=0;i<70;i++){ c.globalAlpha=.3+R()*.7; c.beginPath(); c.arc(R()*w,R()*h*.7,R()*1.7+.4,0,7); c.fill(); } c.globalAlpha=1;
      const mg=c.createRadialGradient(168,120,10,168,120,70); mg.addColorStop(0,'rgba(255,244,210,.5)'); mg.addColorStop(1,'rgba(255,244,210,0)'); c.fillStyle=mg; c.fillRect(90,40,160,160);
      c.fillStyle='#fff6da'; c.beginPath(); c.arc(170,120,30,0,7); c.fill(); c.fillStyle='#4436a4'; c.beginPath(); c.arc(184,110,27,0,7); c.fill();
      c.fillStyle='rgba(60,40,120,.6)'; for(let i=0;i<5;i++){ c.beginPath(); c.ellipse(R()*w,h*.62+R()*60,60+R()*40,10+R()*8,0,0,7); c.fill(); }
      c.fillStyle='#3a2a70'; for(let i=0;i<7;i++){ const x=i*42+R()*10, hh=90+R()*60; c.beginPath(); c.moveTo(x-40,h); c.lineTo(x,h-hh); c.lineTo(x+40,h); c.fill(); }
      c.fillStyle='#241a50'; for(let i=0;i<10;i++){ const x=i*29+R()*10, hh=40+R()*60; c.beginPath(); c.moveTo(x-22,h); c.lineTo(x,h-hh); c.lineTo(x+22,h); c.fill(); c.fillRect(x+30,h-26-R()*20,16,60); }
      c.fillStyle='#ffd070'; for(let i=0;i<8;i++){ c.fillRect(20+R()*220,h-22-R()*18,4,5); } });
    TEX.soft = ctex(64,64,(c)=>{ const g=c.createRadialGradient(32,32,0,32,32,32); g.addColorStop(0,'rgba(255,255,255,1)'); g.addColorStop(.35,'rgba(255,255,255,.45)'); g.addColorStop(1,'rgba(255,255,255,0)'); c.fillStyle=g; c.fillRect(0,0,64,64); });
    TEX.blob = ctex(64,64,(c)=>{ const g=c.createRadialGradient(32,32,2,32,32,32); g.addColorStop(0,'rgba(16,6,24,.75)'); g.addColorStop(.6,'rgba(16,6,24,.3)'); g.addColorStop(1,'rgba(16,6,24,0)'); c.fillStyle=g; c.fillRect(0,0,64,64); });
    TEX.ao = ctex(8,64,(c)=>{ const g=c.createLinearGradient(0,0,0,64); g.addColorStop(0,'rgba(14,5,22,0)'); g.addColorStop(1,'rgba(14,5,22,.7)'); c.fillStyle=g; c.fillRect(0,0,8,64); });
    TEX.flame = ctex(64,128,(c)=>{ const g=c.createRadialGradient(32,92,2,32,80,46); g.addColorStop(0,'rgba(255,255,230,1)'); g.addColorStop(.3,'rgba(255,210,90,.95)'); g.addColorStop(.65,'rgba(255,110,30,.55)'); g.addColorStop(1,'rgba(255,60,10,0)'); c.fillStyle=g; c.beginPath(); c.moveTo(32,4); c.bezierCurveTo(60,50,62,96,32,124); c.bezierCurveTo(2,96,4,50,32,4); c.fill(); });
    TEX.swirl = ctex(256,256,(c,w)=>{ c.fillStyle='#9a9a9a'; c.fillRect(0,0,w,w); c.strokeStyle='rgba(255,255,255,.8)'; c.lineCap='round'; for(let k=0;k<3;k++){ c.lineWidth=11-k*2; c.beginPath(); for(let a=0;a<9;a+=.1){ const r=8+a*12, x=128+Math.cos(a+k*2.1)*r, y=128+Math.sin(a+k*2.1)*r; a?c.lineTo(x,y):c.moveTo(x,y); } c.stroke(); } c.fillStyle='rgba(255,255,255,.9)'; for(let i=0;i<16;i++){ c.beginPath(); c.arc(40+R()*176,40+R()*176,3+R()*6,0,7); c.fill(); } });
    TEX.banner = ctex(128,256,(c,w,h)=>{ c.fillStyle='#5a2f9a'; c.fillRect(0,0,w,h); c.strokeStyle='#e9c06a'; c.lineWidth=8; c.strokeRect(8,8,w-16,h-16); c.fillStyle='#e9c06a'; c.beginPath(); c.arc(64,100,34,0,7); c.fill(); c.fillStyle='#5a2f9a'; c.beginPath(); c.arc(78,90,30,0,7); c.fill(); c.fillStyle='#e9c06a'; star(c,64,180,14); star(c,34,208,8); star(c,94,208,8); });
    TEX.bubble = ctex(128,128,(c)=>{ c.fillStyle='#2a1830'; c.beginPath(); c.arc(64,58,50,0,7); c.fill(); c.beginPath(); c.moveTo(40,96); c.lineTo(30,124); c.lineTo(70,104); c.fill(); c.fillStyle='#fbf2dc'; c.beginPath(); c.arc(64,58,43,0,7); c.fill(); c.beginPath(); c.moveTo(44,94); c.lineTo(36,114); c.lineTo(64,100); c.fill(); c.fillStyle='#7a4ad0'; [40,64,88].forEach(x=>{ c.beginPath(); c.arc(x,58,8,0,7); c.fill(); }); });
    TEX.runes = ctex(512,512,(c,w)=>{ c.strokeStyle='#fff'; c.fillStyle='#fff'; c.lineWidth=5; c.beginPath(); c.arc(256,256,240,0,7); c.stroke(); c.lineWidth=3; c.beginPath(); c.arc(256,256,206,0,7); c.stroke(); c.beginPath(); c.arc(256,256,150,0,7); c.stroke();
      for(let i=0;i<16;i++){ const a=i/16*6.283, x=256+Math.cos(a)*223, y=256+Math.sin(a)*223; c.save(); c.translate(x,y); c.rotate(a+Math.PI/2); c.lineWidth=3; c.beginPath(); const k=i%4; if(k===0){ c.moveTo(-7,9); c.lineTo(0,-10); c.lineTo(7,9); c.moveTo(-4,2); c.lineTo(4,2); } else if(k===1){ c.arc(0,0,8,0,7); c.moveTo(0,-12); c.lineTo(0,12); } else if(k===2){ c.moveTo(-8,-8); c.lineTo(8,8); c.moveTo(8,-8); c.lineTo(-8,8); c.moveTo(0,-11); c.lineTo(0,11); } else { c.moveTo(-8,8); c.lineTo(0,-10); c.lineTo(8,8); c.closePath(); } c.stroke(); c.restore(); }
      c.lineWidth=2; for(let k=0;k<2;k++){ c.beginPath(); for(let i=0;i<3;i++){ const a=i/3*6.283+k*Math.PI+Math.PI/2; c.lineTo(256+Math.cos(a)*206,256+Math.sin(a)*206); } c.closePath(); c.stroke(); } });
    TEX.wing = ctex(128,256,(c,w,h)=>{ const g=c.createLinearGradient(0,0,w,h); g.addColorStop(0,'rgba(255,230,250,.95)'); g.addColorStop(1,'rgba(160,220,255,.7)'); c.fillStyle=g; c.beginPath(); c.moveTo(6,h-10); c.bezierCurveTo(-10,90,60,-10,118,30); c.bezierCurveTo(140,120,80,220,6,h-10); c.fill();
      c.strokeStyle='rgba(255,255,255,.9)'; c.lineWidth=3; for(let i=0;i<5;i++){ c.beginPath(); c.moveTo(6,h-10); c.quadraticCurveTo(30+i*10,150-i*16,40+i*18,60+i*12); c.stroke(); } c.fillStyle='rgba(255,180,220,.8)'; c.beginPath(); c.arc(78,84,16,0,7); c.fill(); c.fillStyle='rgba(90,60,140,.7)'; c.beginPath(); c.arc(78,84,7,0,7); c.fill(); });
    return TEX;
  }

  /* ---------- materials & primitives ---------- */
  const MC = {};
  function M(color, o={}){ const k=color+JSON.stringify(o); if(MC[k]) return MC[k]; const p=Object.assign({color, roughness:.8, metalness:0, envMapIntensity:.55}, o); if(p.emissive===true) p.emissive=color; return MC[k]=new T.MeshStandardMaterial(p); }
  const wood = (c='#8a5632')=>{ const k='w'+c; return MC[k]||(MC[k]=new T.MeshStandardMaterial({color:c, map:TEX.wood, roughness:.7, envMapIntensity:.5})); };
  const metal = (c='#e9c06a', r=.3)=>M(c,{metalness:.9,roughness:r,envMapIntensity:1.3});
  function mesh(geo, mat, x=0,y=0,z=0, o={}){ const m=new T.Mesh(geo,mat); m.position.set(x,y,z); if(o.r) m.rotation.set(o.r[0],o.r[1],o.r[2]); if(o.s) m.scale.set(o.s[0],o.s[1],o.s[2]); m.castShadow=o.cast!==false; m.receiveShadow=o.recv!==false; if(o.keep) m.userData.keep=true; return m; }
  const GEO = {};
  const geo = (k, f)=>GEO[k]||(GEO[k]=f());
  const box=(w,h,d,mat,x,y,z,o)=>{ const m=mesh(geo('box',()=>new T.BoxGeometry(1,1,1)),mat,x,y,z,o); m.scale.multiply(new T.Vector3(w,h,d)); return m; };
  const sph=(r,mat,x,y,z,o)=>{ const m=mesh(geo('sph',()=>new T.SphereGeometry(1,24,16)),mat,x,y,z,o); m.scale.multiplyScalar(r); return m; };
  const cyl=(rt,rb,h,mat,x,y,z,o)=>mesh(new T.CylinderGeometry(rt,rb,h,20),mat,x,y,z,o);
  const cone=(r,h,mat,x,y,z,o)=>mesh(new T.ConeGeometry(r,h,16),mat,x,y,z,o);
  const caps=(r,len,mat,x,y,z,o)=>mesh(new T.CapsuleGeometry(r,len,5,14),mat,x,y,z,o);
  const tor=(r,t,mat,x,y,z,o,arc)=>mesh(new T.TorusGeometry(r,t,10,24,arc||6.2832),mat,x,y,z,o);
  function lathe(pts, mat, x,y,z,o={}){ return mesh(new T.LatheGeometry(pts.map(p=>new T.Vector2(p[0],p[1])),o.seg||26,o.ps||0,o.pl||6.2832),mat,x,y,z,o); }
  function archShape(w,h){ const s=new T.Shape(); s.moveTo(-w/2,0); s.lineTo(w/2,0); s.lineTo(w/2,h-w/2); s.absarc(0,h-w/2,w/2,0,Math.PI,false); s.lineTo(-w/2,0); return s; }
  function glow(col, size, x,y,z, op=.5, add=true){ const s=new T.Sprite(new T.SpriteMaterial({map:TEX.soft, color:col, transparent:true, opacity:op, blending:add?T.AdditiveBlending:T.NormalBlending, depthWrite:false})); s.scale.setScalar(size); s.position.set(x,y,z); return s; }

  /* ---------- geometry baking: merge static meshes per material, optional ink outline ---------- */
  function mergeGeo(items){ let nv=0, ni=0; items.forEach(([g])=>{ nv+=g.attributes.position.count; ni+=g.index?g.index.count:g.attributes.position.count; });
    const P=new Float32Array(nv*3), N=new Float32Array(nv*3), U=new Float32Array(nv*2), I=new (nv>65535?Uint32Array:Uint16Array)(ni); let vo=0, io=0; const v=new T.Vector3(), nm=new T.Matrix3();
    items.forEach(([g,m])=>{ const p=g.attributes.position, n=g.attributes.normal, u=g.attributes.uv; nm.getNormalMatrix(m);
      for(let i=0;i<p.count;i++){ v.fromBufferAttribute(p,i).applyMatrix4(m); P[(vo+i)*3]=v.x; P[(vo+i)*3+1]=v.y; P[(vo+i)*3+2]=v.z; if(n){ v.fromBufferAttribute(n,i).applyMatrix3(nm).normalize(); N[(vo+i)*3]=v.x; N[(vo+i)*3+1]=v.y; N[(vo+i)*3+2]=v.z; } if(u){ U[(vo+i)*2]=u.getX(i); U[(vo+i)*2+1]=u.getY(i); } }
      if(g.index){ for(let i=0;i<g.index.count;i++) I[io+i]=g.index.getX(i)+vo; io+=g.index.count; } else { for(let i=0;i<p.count;i++) I[io+i]=vo+i; io+=p.count; } vo+=p.count; });
    const out=new T.BufferGeometry(); out.setAttribute('position',new T.BufferAttribute(P,3)); out.setAttribute('normal',new T.BufferAttribute(N,3)); out.setAttribute('uv',new T.BufferAttribute(U,2)); out.setIndex(new T.BufferAttribute(I,1)); return out; }
  const OLM = {};
  function outlineMat(w){ if(OLM[w]) return OLM[w]; const m=new T.MeshBasicMaterial({color:'#1c0d26', side:T.BackSide}); m.onBeforeCompile=s=>{ s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n transformed += normalize(normal) * '+w.toFixed(4)+';'); }; m.customProgramCacheKey=()=>'ol'+w; return OLM[w]=m; }
  function bake(root, o={}){ root.updateMatrixWorld(true); const inv=new T.Matrix4().copy(root.matrixWorld).invert(); const buckets=new Map(), rm=[], all=[];
    root.traverse(m=>{ if(!m.isMesh||m.userData.keep||m.userData.baked||m.material.transparent) return; let p=m.parent; while(p&&p!==root){ if(p.userData.pivot||p.userData.keep) return; p=p.parent; }
      const k=m.material.uuid+(m.castShadow?'c':'')+(m.receiveShadow?'r':''); if(!buckets.has(k)) buckets.set(k,{mat:m.material,cast:m.castShadow,recv:m.receiveShadow,items:[]});
      const mt=new T.Matrix4().multiplyMatrices(inv,m.matrixWorld); buckets.get(k).items.push([m.geometry,mt]); if(!m.userData.noOutline) all.push([m.geometry,mt]); rm.push(m); });
    rm.forEach(m=>m.parent.remove(m));
    buckets.forEach(b=>{ const mm=new T.Mesh(mergeGeo(b.items),b.mat); mm.castShadow=b.cast; mm.receiveShadow=b.recv; mm.userData.baked=true; root.add(mm); });
    if(o.outline && all.length){ const ol=new T.Mesh(mergeGeo(all), outlineMat(o.outline)); ol.userData.baked=true; ol.castShadow=false; ol.receiveShadow=false; root.add(ol); }
    return root; }

  /* ---------- post-processing: HDR target, bloom, filmic grade, vignette ---------- */
  function makePost(renderer){
    try{
      if(!renderer.capabilities.isWebGL2 || !(renderer.extensions.has('EXT_color_buffer_float')||renderer.extensions.has('EXT_color_buffer_half_float'))) return null;
      const quad=new T.Mesh(new T.PlaneGeometry(2,2)); quad.frustumCulled=false; const qs=new T.Scene(); qs.add(quad); const qc=new T.OrthographicCamera(-1,1,1,-1,0,1);
      const vs='varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }';
      const sm=(fs,u)=>new T.ShaderMaterial({vertexShader:vs,fragmentShader:fs,uniforms:u,depthTest:false,depthWrite:false,toneMapped:false});
      const bright=sm('uniform sampler2D t; uniform float th; varying vec2 vUv; void main(){ vec3 c=min(texture2D(t,vUv).rgb,vec3(12.)); float l=max(c.r,max(c.g,c.b)); gl_FragColor=vec4(c*smoothstep(th,th+.7,l),1.); }',{t:{value:null},th:{value:1.2}});
      const blur=sm('uniform sampler2D t; uniform vec2 d; varying vec2 vUv; void main(){ vec3 c=texture2D(t,vUv).rgb*.227; c+=(texture2D(t,vUv+d*1.385).rgb+texture2D(t,vUv-d*1.385).rgb)*.316; c+=(texture2D(t,vUv+d*3.231).rgb+texture2D(t,vUv-d*3.231).rgb)*.0703; gl_FragColor=vec4(c,1.); }',{t:{value:null},d:{value:new T.Vector2()}});
      const comp=sm(`uniform sampler2D t; uniform sampler2D b1; uniform sampler2D b2; uniform float ex; uniform float bs; uniform float dim; varying vec2 vUv;
        vec3 aces(vec3 x){ return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.); }
        void main(){ vec3 c=texture2D(t,vUv).rgb; c+=(texture2D(b1,vUv).rgb*.55+texture2D(b2,vUv).rgb*.9)*bs; c*=ex;
          c=aces(c); c=pow(c,vec3(1./2.2));
          float l=dot(c,vec3(.299,.587,.114)); c=mix(vec3(l),c,1.14);
          c=mix(c*vec3(.96,.94,1.08),c*vec3(1.06,1.01,.94),smoothstep(.15,.75,l));
          vec2 q=vUv-.5; float v=smoothstep(.9,.3,length(q*vec2(1.,.9))); c*=mix(.66,1.,v); c*=dim;
          gl_FragColor=vec4(c,1.); }`,{t:{value:null},b1:{value:null},b2:{value:null},ex:{value:.82},bs:{value:.42},dim:{value:1}});
      const P={comp, rt:null};
      const mk=(w,h,ms)=>new T.WebGLRenderTarget(Math.max(2,w),Math.max(2,h),{type:T.HalfFloatType,samples:ms||0,depthBuffer:!!ms,minFilter:T.LinearFilter,magFilter:T.LinearFilter});
      P.resize=function(){ const s=renderer.getDrawingBufferSize(new T.Vector2()); [P.rt,P.a1,P.b1,P.a2,P.b2].forEach(r=>r&&r.dispose()); P.w=s.x; P.h=s.y; P.rt=mk(s.x,s.y,4); P.a1=mk(s.x>>1,s.y>>1); P.b1=mk(s.x>>1,s.y>>1); P.a2=mk(s.x>>2,s.y>>2); P.b2=mk(s.x>>2,s.y>>2); };
      const pass=(mat,target)=>{ quad.material=mat; renderer.setRenderTarget(target); renderer.render(qs,qc); };
      P.render=function(scene,camera){ renderer.setRenderTarget(P.rt); renderer.render(scene,camera);
        bright.uniforms.t.value=P.rt.texture; pass(bright,P.a1);
        blur.uniforms.t.value=P.a1.texture; blur.uniforms.d.value.set(1/P.a1.width,0); pass(blur,P.b1); blur.uniforms.t.value=P.b1.texture; blur.uniforms.d.value.set(0,1/P.a1.height); pass(blur,P.a1);
        blur.uniforms.t.value=P.a1.texture; blur.uniforms.d.value.set(1/P.a2.width,0); pass(blur,P.b2); blur.uniforms.t.value=P.b2.texture; blur.uniforms.d.value.set(0,1/P.a2.height); pass(blur,P.a2);
        blur.uniforms.t.value=P.a2.texture; blur.uniforms.d.value.set(2/P.a2.width,0); pass(blur,P.b2); blur.uniforms.t.value=P.b2.texture; blur.uniforms.d.value.set(0,2/P.a2.height); pass(blur,P.a2);
        comp.uniforms.t.value=P.rt.texture; comp.uniforms.b1.value=P.a1.texture; comp.uniforms.b2.value=P.a2.texture; pass(comp,null); };
      P.resize(); return P;
    }catch(e){ return null; }
  }
  /* ---------- image-based light from a tiny painted room ---------- */
  function makeEnv(renderer){ try{ const s=new T.Scene(); const g=ctex(16,128,(c)=>{ const gr=c.createLinearGradient(0,0,0,128); gr.addColorStop(0,'#3a2c7a'); gr.addColorStop(.45,'#5a3a78'); gr.addColorStop(.55,'#8a5a4a'); gr.addColorStop(1,'#c88a58'); c.fillStyle=gr; c.fillRect(0,0,16,128); });
      s.add(new T.Mesh(new T.SphereGeometry(20,16,12), new T.MeshBasicMaterial({map:g, side:T.BackSide})));
      [[-8,6,-10,'#9aa8ff',5],[6,6,-10,'#9aa8ff',5],[0,9,6,'#ffc880',4],[10,3,4,'#ffb060',3],[-10,3,5,'#c08cff',3]].forEach(([x,y,z,c,sz])=>{ const m=new T.Mesh(new T.SphereGeometry(sz,8,6), new T.MeshBasicMaterial({color:new T.Color(c).multiplyScalar(3)})); m.position.set(x,y,z); s.add(m); });
      const pm=new T.PMREMGenerator(renderer); const t=pm.fromScene(s,.03).texture; pm.dispose(); return t; }catch(e){ return null; } }

  return { T, R, ctex, rr, star, TEX, makeTextures, M, MC, wood, metal, mesh, box, sph, cyl, cone, caps, tor, lathe, archShape, glow, bake, mergeGeo, outlineMat, makePost, makeEnv };
})();
