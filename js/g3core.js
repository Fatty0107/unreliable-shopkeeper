/* ============ G3 CORE: textures, materials, sculpted geometry, baking, outlines, post-processing ============ */
const G3 = (typeof THREE === 'undefined') ? null : (function(){
  const T = THREE, R = rng(4242), PI = Math.PI;
  function mkc(w,h){ const c=document.createElement('canvas'); c.width=w; c.height=h; return c; }
  function wrapTex(c, rep, srgb=true){ const t=new T.CanvasTexture(c); if(srgb) t.colorSpace=T.SRGBColorSpace; t.anisotropy=8; if(rep){ t.wrapS=t.wrapT=T.RepeatWrapping; t.repeat.set(rep[0],rep[1]); } return t; }
  function ctex(w,h,draw,rep){ const c=mkc(w,h); draw(c.getContext('2d'),w,h); return wrapTex(c,rep); }
  /* colour + height pair drawn in lock-step, so bump detail lines up with the paint */
  function ctex2(w,h,draw,rep){ const a=mkc(w,h), b=mkc(w,h); draw(a.getContext('2d'),b.getContext('2d'),w,h); return [wrapTex(a,rep), wrapTex(b,rep,false)]; }
  function rr(c,x,y,w,h,r){ c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }
  function star(c,x,y,r){ c.beginPath(); for(let k=0;k<8;k++){ const rad=k%2?r*.4:r, a=k*PI/4-PI/2; c.lineTo(x+Math.cos(a)*rad,y+Math.sin(a)*rad); } c.closePath(); c.fill(); }
  const grey = v => { v=Math.max(0,Math.min(255,Math.round(v))); return `rgb(${v},${v},${v})`; };
  const TEX = {};
  function makeTextures(){
    if(TEX.floor) return TEX;
    [TEX.floor, TEX.floorH] = ctex2(1024,1024,(c,hc,w)=>{ c.fillStyle='#5e4032'; c.fillRect(0,0,w,w); hc.fillStyle=grey(40); hc.fillRect(0,0,w,w); const n=4, s=w/n;
      for(let j=0;j<n;j++) for(let i=0;i<n;i++){ const v=R(); const col=mixHex(['#b98c62','#9a7150','#a98058','#c09468'],[v,1-v,.5,R()*.6]); const x=i*s+6, y=j*s+6, ww=s-12;
        const g=c.createLinearGradient(x,y,x+ww,y+ww); g.addColorStop(0,shade(col,.14)); g.addColorStop(.5,col); g.addColorStop(1,shade(col,-.16)); c.fillStyle=g; rr(c,x,y,ww,ww,20); c.fill();
        const hv=150+R()*70; hc.fillStyle=grey(hv); rr(hc,x,y,ww,ww,20); hc.fill(); const hg=hc.createRadialGradient(x+ww/2,y+ww/2,ww*.15,x+ww/2,y+ww/2,ww*.72); hg.addColorStop(0,'rgba(255,255,255,.22)'); hg.addColorStop(1,'rgba(0,0,0,.35)'); hc.fillStyle=hg; rr(hc,x,y,ww,ww,20); hc.fill();
        c.strokeStyle='rgba(40,20,10,.34)'; c.lineWidth=3; rr(c,x,y,ww,ww,20); c.stroke(); c.strokeStyle='rgba(255,236,200,.2)'; c.lineWidth=3; c.beginPath(); c.moveTo(x+18,y+6); c.lineTo(x+ww-18,y+6); c.stroke();
        for(let k=0;k<30;k++){ const dk=R()<.5, px=x+12+R()*(ww-24), py=y+12+R()*(ww-24), pr=1+R()*5; c.fillStyle=`rgba(${dk?'60,34,14':'255,230,190'},${.05+R()*.1})`; c.beginPath(); c.arc(px,py,pr,0,7); c.fill(); hc.fillStyle=`rgba(${dk?'0,0,0':'255,255,255'},.18)`; hc.beginPath(); hc.arc(px,py,pr,0,7); hc.fill(); }
        c.strokeStyle='rgba(50,26,10,.3)'; c.lineWidth=2; hc.strokeStyle='rgba(0,0,0,.55)'; hc.lineWidth=3; for(let k=0;k<2;k++){ c.beginPath(); hc.beginPath(); let px=x+24+R()*(ww-48), py=y+24+R()*(ww-48); c.moveTo(px,py); hc.moveTo(px,py); for(let q=0;q<4;q++){ px+=R()*36-18; py+=R()*36-18; c.lineTo(px,py); hc.lineTo(px,py); } c.stroke(); hc.stroke(); } } }, [7.5,6]);
    [TEX.stone, TEX.stoneH] = ctex2(1024,512,(c,hc,w,h)=>{ c.fillStyle='#281a38'; c.fillRect(0,0,w,h); hc.fillStyle=grey(30); hc.fillRect(0,0,w,h); const rh=64; for(let j=0;j<8;j++){ let x=(j%2)*-70; while(x<w){ const bw=110+Math.floor(R()*3)*26; const v=R(); const col=mixHex(['#6a5482','#54426c','#77628e','#5e4a70'],[v,1-v,.4,R()*.5]);
          const g=c.createLinearGradient(0,j*rh,0,j*rh+rh); g.addColorStop(0,shade(col,.14)); g.addColorStop(.3,col); g.addColorStop(1,shade(col,-.2)); c.fillStyle=g; rr(c,x+4,j*rh+4,bw-8,rh-8,10); c.fill();
          hc.fillStyle=grey(140+R()*80); rr(hc,x+4,j*rh+4,bw-8,rh-8,10); hc.fill(); const hg=hc.createLinearGradient(0,j*rh,0,j*rh+rh); hg.addColorStop(0,'rgba(0,0,0,.3)'); hg.addColorStop(.25,'rgba(255,255,255,.12)'); hg.addColorStop(.75,'rgba(255,255,255,.12)'); hg.addColorStop(1,'rgba(0,0,0,.3)'); hc.fillStyle=hg; rr(hc,x+4,j*rh+4,bw-8,rh-8,10); hc.fill();
          for(let k=0;k<9;k++){ const dk=R()<.5, px=x+8+R()*(bw-16), py=j*rh+8+R()*(rh-16), pr=1+R()*4; c.fillStyle=`rgba(${dk?'20,10,30':'230,210,255'},${.04+R()*.08})`; c.beginPath(); c.arc(px,py,pr,0,7); c.fill(); hc.fillStyle=`rgba(${dk?'0,0,0':'255,255,255'},.2)`; hc.beginPath(); hc.arc(px,py,pr,0,7); hc.fill(); } x+=bw; } }
      for(let k=0;k<26;k++){ c.fillStyle=`rgba(80,140,70,${.1+R()*.14})`; c.beginPath(); c.arc(R()*w,R()*h,4+R()*12,0,7); c.fill(); } }, [5,1.6]);
    [TEX.wood, TEX.woodH] = ctex2(256,256,(c,hc,w)=>{ c.fillStyle='#8a5632'; c.fillRect(0,0,w,w); hc.fillStyle=grey(150); hc.fillRect(0,0,w,w); for(let i=0;i<90;i++){ const dk=R()<.55, lw=1+R()*3, y=R()*w, a=R()*10-5, b=R()*10-5, e=R()*8-4; c.strokeStyle=`rgba(${dk?'50,24,8':'200,140,86'},${.07+R()*.14})`; c.lineWidth=lw; hc.strokeStyle=`rgba(${dk?'0,0,0':'255,255,255'},.16)`; hc.lineWidth=lw; [c,hc].forEach(q=>{ q.beginPath(); q.moveTo(0,y); q.bezierCurveTo(w*.3,y+a,w*.6,y+b,w,y+e); q.stroke(); }); }
      for(let i=0;i<3;i++){ const x=R()*w,y=R()*w; c.strokeStyle='rgba(50,24,8,.35)'; c.lineWidth=2; hc.strokeStyle='rgba(0,0,0,.3)'; hc.lineWidth=2; for(let r=3;r<14;r+=4){ [c,hc].forEach(q=>{ q.beginPath(); q.ellipse(x,y,r*1.8,r,0,0,7); q.stroke(); }); } } }, [1,1]);
    TEX.rug = ctex(512,512,(c,w)=>{ c.fillStyle='#55328f'; c.fillRect(0,0,w,w); for(let i=0;i<w;i+=4){ c.fillStyle=`rgba(255,255,255,${i%8?.02:.05})`; c.fillRect(0,i,w,2); }
      c.strokeStyle='#e9c06a'; c.lineWidth=14; c.strokeRect(22,22,w-44,w-44); c.lineWidth=4; c.setLineDash([14,10]); c.strokeRect(50,50,w-100,w-100); c.setLineDash([]);
      c.fillStyle='#7448b8'; c.beginPath(); c.arc(w/2,w/2,150,0,7); c.fill(); c.strokeStyle='#e9c06a'; c.lineWidth=3; c.beginPath(); c.arc(w/2,w/2,164,0,7); c.stroke(); c.fillStyle='#e9c06a'; c.beginPath(); c.arc(w/2,w/2,92,0,7); c.fill(); c.fillStyle='#7448b8'; c.beginPath(); c.arc(w/2+34,w/2-22,80,0,7); c.fill();
      c.fillStyle='#e9c06a'; [[110,110],[400,110],[110,400],[400,400],[256,84],[256,428],[84,256],[428,256]].forEach(([x,y])=>star(c,x,y,13)); for(let i=0;i<26;i++){ c.fillStyle='#c8a04a'; c.fillRect(8+i*19.4,0,6,12); c.fillRect(8+i*19.4,w-12,6,12); } });
    const skyline=(c,w,h,far,near,lit)=>{ c.fillStyle=far; for(let i=0;i<7;i++){ const x=i*42+R()*10, hh=90+R()*60; c.beginPath(); c.moveTo(x-40,h); c.lineTo(x,h-hh); c.lineTo(x+40,h); c.fill(); }
      c.fillStyle=near; for(let i=0;i<10;i++){ const x=i*29+R()*10, hh=40+R()*60; c.beginPath(); c.moveTo(x-22,h); c.lineTo(x,h-hh); c.lineTo(x+22,h); c.fill(); c.fillRect(x+30,h-26-R()*20,16,60); } if(lit){ c.fillStyle=lit; for(let i=0;i<8;i++) c.fillRect(20+R()*220,h-22-R()*18,4,5); } };
    TEX.sky = ctex(256,512,(c,w,h)=>{ const g=c.createLinearGradient(0,0,0,h); g.addColorStop(0,'#141c66'); g.addColorStop(.4,'#4a3cb0'); g.addColorStop(.72,'#b06ac8'); g.addColorStop(.9,'#ff9a88'); g.addColorStop(1,'#ffc890'); c.fillStyle=g; c.fillRect(0,0,w,h);
      c.fillStyle='#fff'; for(let i=0;i<70;i++){ c.globalAlpha=.3+R()*.7; c.beginPath(); c.arc(R()*w,R()*h*.7,R()*1.7+.4,0,7); c.fill(); } c.globalAlpha=1;
      const mg=c.createRadialGradient(168,120,10,168,120,70); mg.addColorStop(0,'rgba(255,244,210,.5)'); mg.addColorStop(1,'rgba(255,244,210,0)'); c.fillStyle=mg; c.fillRect(90,40,160,160);
      c.fillStyle='#fff6da'; c.beginPath(); c.arc(170,120,30,0,7); c.fill(); c.fillStyle='#4436a4'; c.beginPath(); c.arc(184,110,27,0,7); c.fill();
      c.fillStyle='rgba(60,40,120,.6)'; for(let i=0;i<5;i++){ c.beginPath(); c.ellipse(R()*w,h*.62+R()*60,60+R()*40,10+R()*8,0,0,7); c.fill(); } skyline(c,w,h,'#3a2a70','#241a50','#ffd070'); });
    TEX.skyDay = ctex(256,512,(c,w,h)=>{ const g=c.createLinearGradient(0,0,0,h); g.addColorStop(0,'#6fb4ee'); g.addColorStop(.5,'#a8d8f6'); g.addColorStop(.8,'#ffe6c0'); g.addColorStop(1,'#ffd0a0'); c.fillStyle=g; c.fillRect(0,0,w,h);
      const sg=c.createRadialGradient(70,150,6,70,150,120); sg.addColorStop(0,'rgba(255,252,230,1)'); sg.addColorStop(.18,'rgba(255,240,190,.8)'); sg.addColorStop(1,'rgba(255,240,190,0)'); c.fillStyle=sg; c.fillRect(0,0,w,h);
      c.fillStyle='rgba(255,255,255,.9)'; for(let i=0;i<6;i++){ const x=R()*w, y=60+R()*h*.5; for(let k=0;k<5;k++){ c.beginPath(); c.ellipse(x+k*18-36,y+Math.sin(k*2)*5,22+R()*10,11+R()*5,0,0,7); c.fill(); } } skyline(c,w,h,'#8fb89a','#5f8f6a',null); });
    TEX.soft = ctex(64,64,(c)=>{ const g=c.createRadialGradient(32,32,0,32,32,32); g.addColorStop(0,'rgba(255,255,255,1)'); g.addColorStop(.35,'rgba(255,255,255,.45)'); g.addColorStop(1,'rgba(255,255,255,0)'); c.fillStyle=g; c.fillRect(0,0,64,64); });
    TEX.spark = ctex(64,64,(c)=>{ const g=c.createRadialGradient(32,32,0,32,32,30); g.addColorStop(0,'rgba(255,255,255,1)'); g.addColorStop(.2,'rgba(255,255,255,.5)'); g.addColorStop(1,'rgba(255,255,255,0)'); c.fillStyle=g; c.fillRect(0,0,64,64); c.fillStyle='#fff'; c.beginPath(); c.moveTo(32,0); c.quadraticCurveTo(34,30,64,32); c.quadraticCurveTo(34,34,32,64); c.quadraticCurveTo(30,34,0,32); c.quadraticCurveTo(30,30,32,0); c.fill(); });
    TEX.ring = ctex(128,128,(c)=>{ c.strokeStyle='#fff'; c.lineWidth=7; c.beginPath(); c.arc(64,64,54,0,7); c.stroke(); c.globalAlpha=.35; c.lineWidth=16; c.beginPath(); c.arc(64,64,50,0,7); c.stroke(); });
    TEX.beam = ctex(32,256,(c,w,h)=>{ const g=c.createLinearGradient(0,0,0,h); g.addColorStop(0,'rgba(255,255,255,0)'); g.addColorStop(.55,'rgba(255,255,255,.55)'); g.addColorStop(1,'rgba(255,255,255,1)'); c.fillStyle=g; c.fillRect(0,0,w,h); const g2=c.createLinearGradient(0,0,w,0); g2.addColorStop(0,'rgba(0,0,0,1)'); g2.addColorStop(.5,'rgba(0,0,0,0)'); g2.addColorStop(1,'rgba(0,0,0,1)'); c.globalCompositeOperation='destination-out'; c.fillStyle=g2; c.fillRect(0,0,w,h); });
    TEX.blob = ctex(64,64,(c)=>{ const g=c.createRadialGradient(32,32,2,32,32,32); g.addColorStop(0,'rgba(16,6,24,.75)'); g.addColorStop(.6,'rgba(16,6,24,.3)'); g.addColorStop(1,'rgba(16,6,24,0)'); c.fillStyle=g; c.fillRect(0,0,64,64); });
    TEX.ao = ctex(8,64,(c)=>{ const g=c.createLinearGradient(0,0,0,64); g.addColorStop(0,'rgba(14,5,22,0)'); g.addColorStop(1,'rgba(14,5,22,.7)'); c.fillStyle=g; c.fillRect(0,0,8,64); });
    TEX.flame = ctex(64,128,(c)=>{ const g=c.createRadialGradient(32,92,2,32,80,46); g.addColorStop(0,'rgba(255,255,230,1)'); g.addColorStop(.3,'rgba(255,210,90,.95)'); g.addColorStop(.65,'rgba(255,110,30,.55)'); g.addColorStop(1,'rgba(255,60,10,0)'); c.fillStyle=g; c.beginPath(); c.moveTo(32,4); c.bezierCurveTo(60,50,62,96,32,124); c.bezierCurveTo(2,96,4,50,32,4); c.fill(); });
    TEX.banner = ctex(128,256,(c,w,h)=>{ c.fillStyle='#5a2f9a'; c.fillRect(0,0,w,h); c.strokeStyle='#e9c06a'; c.lineWidth=8; c.strokeRect(8,8,w-16,h-16); c.fillStyle='#e9c06a'; c.beginPath(); c.arc(64,100,34,0,7); c.fill(); c.fillStyle='#5a2f9a'; c.beginPath(); c.arc(78,90,30,0,7); c.fill(); c.fillStyle='#e9c06a'; star(c,64,180,14); star(c,34,208,8); star(c,94,208,8); });
    TEX.bubble = ctex(128,128,(c)=>{ c.fillStyle='#2a1830'; c.beginPath(); c.arc(64,58,50,0,7); c.fill(); c.beginPath(); c.moveTo(40,96); c.lineTo(30,124); c.lineTo(70,104); c.fill(); c.fillStyle='#fbf2dc'; c.beginPath(); c.arc(64,58,43,0,7); c.fill(); c.beginPath(); c.moveTo(44,94); c.lineTo(36,114); c.lineTo(64,100); c.fill(); c.fillStyle='#7a4ad0'; [40,64,88].forEach(x=>{ c.beginPath(); c.arc(x,58,8,0,7); c.fill(); }); });
    TEX.runes = ctex(512,512,(c,w)=>{ c.strokeStyle='#fff'; c.fillStyle='#fff'; c.lineWidth=5; c.beginPath(); c.arc(256,256,240,0,7); c.stroke(); c.lineWidth=3; c.beginPath(); c.arc(256,256,206,0,7); c.stroke(); c.beginPath(); c.arc(256,256,150,0,7); c.stroke();
      for(let i=0;i<16;i++){ const a=i/16*6.283, x=256+Math.cos(a)*223, y=256+Math.sin(a)*223; c.save(); c.translate(x,y); c.rotate(a+PI/2); c.lineWidth=3; c.beginPath(); const k=i%4; if(k===0){ c.moveTo(-7,9); c.lineTo(0,-10); c.lineTo(7,9); c.moveTo(-4,2); c.lineTo(4,2); } else if(k===1){ c.arc(0,0,8,0,7); c.moveTo(0,-12); c.lineTo(0,12); } else if(k===2){ c.moveTo(-8,-8); c.lineTo(8,8); c.moveTo(8,-8); c.lineTo(-8,8); c.moveTo(0,-11); c.lineTo(0,11); } else { c.moveTo(-8,8); c.lineTo(0,-10); c.lineTo(8,8); c.closePath(); } c.stroke(); c.restore(); }
      c.lineWidth=2; for(let k=0;k<2;k++){ c.beginPath(); for(let i=0;i<3;i++){ const a=i/3*6.283+k*PI+PI/2; c.lineTo(256+Math.cos(a)*206,256+Math.sin(a)*206); } c.closePath(); c.stroke(); } });
    TEX.wing = ctex(128,256,(c,w,h)=>{ const g=c.createLinearGradient(0,0,w,h); g.addColorStop(0,'rgba(255,230,250,.95)'); g.addColorStop(1,'rgba(160,220,255,.7)'); c.fillStyle=g; c.beginPath(); c.moveTo(6,h-10); c.bezierCurveTo(-10,90,60,-10,118,30); c.bezierCurveTo(140,120,80,220,6,h-10); c.fill();
      c.strokeStyle='rgba(255,255,255,.9)'; c.lineWidth=3; for(let i=0;i<5;i++){ c.beginPath(); c.moveTo(6,h-10); c.quadraticCurveTo(30+i*10,150-i*16,40+i*18,60+i*12); c.stroke(); } c.fillStyle='rgba(255,180,220,.8)'; c.beginPath(); c.arc(78,84,16,0,7); c.fill(); c.fillStyle='rgba(90,60,140,.7)'; c.beginPath(); c.arc(78,84,7,0,7); c.fill(); });
    TEX.lattice = ctex(128,128,(c,w)=>{ c.strokeStyle='rgba(36,20,12,.95)'; c.lineWidth=5; for(let i=-1;i<3;i++){ c.beginPath(); c.moveTo(i*64,0); c.lineTo(i*64+128,128); c.moveTo(i*64+128,0); c.lineTo(i*64,128); c.stroke(); } c.strokeStyle='rgba(255,255,255,.14)'; c.lineWidth=1.5; for(let i=-1;i<3;i++){ c.beginPath(); c.moveTo(i*64+3,0); c.lineTo(i*64+131,128); c.stroke(); } });
    TEX.board = ctex(256,320,drawBoard);
    return TEX;
  }
  function refreshBoard(){ if(!TEX.board) return; const cv=TEX.board.image; drawBoard(cv.getContext('2d'),cv.width,cv.height); TEX.board.needsUpdate=true; }
  function drawBoard(c,w,h){ c.fillStyle='#22302c'; c.fillRect(0,0,w,h); for(let i=0;i<60;i++){ c.fillStyle=`rgba(255,255,255,${R()*.05})`; c.fillRect(R()*w,R()*h,20+R()*60,2); }
      c.fillStyle='#f4ecd8'; c.textAlign='center'; c.font='700 34px Caveat, cursive'; c.fillText("Today's brews",w/2,50); c.strokeStyle='#f4ecd8'; c.lineWidth=2; c.beginPath(); c.moveTo(40,62); c.lineTo(w-40,62); c.stroke();
      c.font='500 26px Caveat, cursive'; c.textAlign='left'; [['Something',' 12c','#ffb3c7'],['Probably fine',' 18c','#9ed8f2'],['Do not shake',' 25c','#f5d36a'],['Ask first',' ??c','#b9f5a0']].forEach(([a,b,col],i)=>{ c.fillStyle=col; c.beginPath(); c.arc(34,100+i*46,8,0,7); c.fill(); c.fillStyle='#f4ecd8'; c.fillText(a,54,108+i*46); c.textAlign='right'; c.fillText(b,w-26,108+i*46); c.textAlign='left'; });
      c.font='500 20px Caveat, cursive'; c.textAlign='center'; c.fillStyle='#c8c0b0'; c.fillText('no refunds · some regrets',w/2,h-22); }

  /* ---------- fabric: tiling patterns with a soft top-to-hem shade ---------- */
  const CLOTH = {};
  function cloth(kind='plain', c1='#888888', c2='#ffffff', ru=4){ const key=[kind,c1,c2,ru].join('|'); if(CLOTH[key]) return CLOTH[key];
    return CLOTH[key]=ctex(128,256,(c,w,h)=>{ c.fillStyle=c1; c.fillRect(0,0,w,h); c.fillStyle=c2; c.strokeStyle=c2; c.lineCap='round';
      const each=(sx,sy,fn)=>{ for(let y=sy/2,r=0;y<h+sy;y+=sy,r++) for(let x=(r%2?sx/2:0);x<w+sx;x+=sx) fn(x,y,r); };
      switch(kind){
        case 'dots': each(64,44,(x,y)=>{ c.beginPath(); c.arc(x,y,8,0,7); c.fill(); }); break;
        case 'stripes': for(let x=0;x<w;x+=32) c.fillRect(x+4,0,13,h); break;
        case 'pin': c.globalAlpha=.5; for(let x=0;x<w;x+=16) c.fillRect(x+6,0,2.5,h); break;
        case 'hstripes': for(let y=12;y<h;y+=40) c.fillRect(0,y,w,15); break;
        case 'plaid': c.globalAlpha=.4; for(let x=0;x<w;x+=64){ c.fillRect(x+8,0,20,h); c.fillRect(x+42,0,5,h); } for(let y=0;y<h;y+=64){ c.fillRect(0,y+8,w,20); c.fillRect(0,y+42,w,5); } break;
        case 'floral': each(64,52,(x,y,r)=>{ for(let i=0;i<5;i++){ const a=i/5*6.283+r; c.beginPath(); c.arc(x+Math.cos(a)*7,y+Math.sin(a)*7,5.2,0,7); c.fill(); } c.save(); c.fillStyle='#ffd27a'; c.beginPath(); c.arc(x,y,3.6,0,7); c.fill(); c.restore(); }); break;
        case 'stars': each(64,50,(x,y)=>star(c,x,y,10)); break;
        case 'leaf': each(64,46,(x,y,r)=>{ c.save(); c.translate(x,y); c.rotate(r*1.3); c.beginPath(); c.moveTo(-12,0); c.quadraticCurveTo(0,-10,12,0); c.quadraticCurveTo(0,10,-12,0); c.fill(); c.restore(); }); break;
        case 'wave': c.lineWidth=5; for(let y=16;y<h;y+=34){ c.beginPath(); for(let x=0;x<=w;x+=4){ const yy=y+Math.sin(x/w*PI*4)*7; x?c.lineTo(x,yy):c.moveTo(x,yy); } c.stroke(); } break;
        case 'diamond': each(64,64,(x,y)=>{ c.beginPath(); c.moveTo(x,y-32); c.lineTo(x+32,y); c.lineTo(x,y+32); c.lineTo(x-32,y); c.fill(); }); break;
        case 'knit': c.lineWidth=4; c.globalAlpha=.6; for(let y=0;y<h;y+=18){ c.beginPath(); for(let x=0;x<=w;x+=16) c.lineTo(x,y+((x/16)%2?9:0)); c.stroke(); } break;
        case 'scale': c.lineWidth=3; c.globalAlpha=.5; each(32,20,(x,y)=>{ c.beginPath(); c.arc(x,y,15,.15,PI-.15); c.stroke(); }); break;
        case 'patch': { const cols=[c2,shade(c1,.25),shade(c2,-.25),shade(c1,-.2)]; for(let i=0;i<10;i++){ const x=Math.floor(R()*4)*32, y=R()*h, ww=32+Math.floor(R()*2)*32, hh=30+R()*40; c.fillStyle=cols[i%4]; c.fillRect(x,y,ww,hh); c.strokeStyle='rgba(30,10,40,.7)'; c.lineWidth=2; c.setLineDash([5,5]); c.strokeRect(x+3,y+3,ww-6,hh-6); c.setLineDash([]); } break; }
      }
      c.globalAlpha=1; for(let i=0;i<260;i++){ c.fillStyle=`rgba(${i%2?'255,255,255':'0,0,0'},.035)`; c.fillRect(R()*w,R()*h,1+R()*10,1); }
      const g=c.createLinearGradient(0,0,0,h); g.addColorStop(0,'rgba(255,255,255,.1)'); g.addColorStop(.5,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(20,0,30,.3)'); c.fillStyle=g; c.fillRect(0,0,w,h);
    },[ru,1]); }

  /* ---------- materials ---------- */
  const MC = {};
  const mkey = o => JSON.stringify(o,(k,v)=>(v&&v.isTexture)?('t'+v.uuid):v);
  function M(color, o={}){ const k=color+mkey(o); if(MC[k]) return MC[k]; const p=Object.assign({color, roughness:.8, metalness:0, envMapIntensity:.55}, o); if(p.emissive===true) p.emissive=color; return MC[k]=new T.MeshStandardMaterial(p); }
  /* character material: adds a soft rim light so figures separate from the room */
  function CM(color, o={}){ const k='cm'+color+mkey(o); if(MC[k]) return MC[k]; const p=Object.assign({color, roughness:.72, metalness:0, envMapIntensity:.6}, o); const rim=p.rim??1; delete p.rim; if(p.emissive===true) p.emissive=color; const m=new T.MeshStandardMaterial(p);
    m.onBeforeCompile=s=>{ const inj='float rimF = pow(1.0 - clamp(dot(normalize(vViewPosition), normal), 0.0, 1.0), 3.2);\n outgoingLight += vec3(1.0,0.84,0.96) * rimF * '+(0.5*rim).toFixed(3)+' * (0.3 + diffuseColor.rgb);\n'; s.fragmentShader=s.fragmentShader.replace('#include <opaque_fragment>',inj+'#include <opaque_fragment>').replace('#include <output_fragment>',inj+'#include <output_fragment>'); };
    m.customProgramCacheKey=()=>'rim'+rim; return MC[k]=m; }
  const fabric = (kind,c1,c2,ru,o)=>CM('#ffffff',Object.assign({map:cloth(kind,c1,c2,ru),roughness:.86},o||{}));
  const wood = (c='#8a5632')=>{ const k='w'+c; return MC[k]||(MC[k]=new T.MeshStandardMaterial({color:c, map:TEX.wood, bumpMap:TEX.woodH, bumpScale:.012, roughness:.68, envMapIntensity:.5})); };
  const metal = (c='#e9c06a', r=.3)=>M(c,{metalness:.9,roughness:r,envMapIntensity:1.3});

  /* ---------- primitives ---------- */
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
  function archShape(w,h){ const s=new T.Shape(); s.moveTo(-w/2,0); s.lineTo(w/2,0); s.lineTo(w/2,h-w/2); s.absarc(0,h-w/2,w/2,0,PI,false); s.lineTo(-w/2,0); return s; }
  function glow(col, size, x,y,z, op=.5, add=true, map){ const s=new T.Sprite(new T.SpriteMaterial({map:map||TEX.soft, color:col, transparent:true, opacity:op, blending:add?T.AdditiveBlending:T.NormalBlending, depthWrite:false})); s.scale.setScalar(size); s.position.set(x,y,z); return s; }

  /* ---------- sculpted geometry ---------- */
  function smoothNormals(g){ g.computeVertexNormals(); const p=g.attributes.position, n=g.attributes.normal, map=new Map();
    for(let i=0;i<p.count;i++){ const k=Math.round(p.getX(i)*2e3)+'|'+Math.round(p.getY(i)*2e3)+'|'+Math.round(p.getZ(i)*2e3); let a=map.get(k); if(!a){ a=[0,0,0,[]]; map.set(k,a); } a[0]+=n.getX(i); a[1]+=n.getY(i); a[2]+=n.getZ(i); a[3].push(i); }
    map.forEach(a=>{ if(a[3].length<2) return; const l=Math.hypot(a[0],a[1],a[2])||1; a[3].forEach(i=>n.setXYZ(i,a[0]/l,a[1]/l,a[2]/l)); }); return g; }
  function sculpt(g, fn){ const p=g.attributes.position, v=new T.Vector3(); for(let i=0;i<p.count;i++){ v.fromBufferAttribute(p,i); fn(v); p.setXYZ(i,v.x,v.y,v.z); } return smoothNormals(g); }
  function bufGeo(P,U,I){ const g=new T.BufferGeometry(); g.setAttribute('position',new T.Float32BufferAttribute(P,3)); g.setAttribute('uv',new T.Float32BufferAttribute(U,2)); g.setIndex(I); return smoothNormals(g); }
  /* loft: stacked elliptical rings (bottom to top) with offsets and optional pleats.  ring = [y, rx, rz, z, x, fold] */
  function loftGeo(ctrl, o={}){
    let C=ctrl.map(c=>Array.isArray(c)?{y:c[0],rx:c[1],rz:c[2]??c[1],z:c[3]||0,x:c[4]||0,fold:c[5]||0}:Object.assign({x:0,z:0,fold:0},c,{rz:c.rz??c.rx}));
    if(C[0].y>C[C.length-1].y) C=C.reverse();
    const seg=o.seg||22, sub=o.sub||5, ps=o.ps||0, pl=o.pl||PI*2, fN=o.foldN||9, lin=o.lin;
    const cr=(a,b,c,d,t)=>lin? b+(c-b)*t : .5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t);
    const rings=[]; for(let i=0;i<C.length-1;i++){ const p0=C[Math.max(0,i-1)],p1=C[i],p2=C[i+1],p3=C[Math.min(C.length-1,i+2)]; const n=(i===C.length-2)?sub+1:sub;
      for(let k=0;k<n;k++){ const t=k/sub; rings.push({y:p1.y+(p2.y-p1.y)*t, rx:Math.max(0,cr(p0.rx,p1.rx,p2.rx,p3.rx,t)), rz:Math.max(0,cr(p0.rz,p1.rz,p2.rz,p3.rz,t)), x:cr(p0.x,p1.x,p2.x,p3.x,t), z:cr(p0.z,p1.z,p2.z,p3.z,t), fold:p1.fold+(p2.fold-p1.fold)*t}); } }
    const nr=rings.length, P=[],U=[],I=[];
    for(let i=0;i<nr;i++){ const r=rings[i]; for(let j=0;j<=seg;j++){ const a=ps+pl*j/seg; const F=1+r.fold*Math.sin(a*fN+(o.foldPh||0)); P.push(r.x+Math.sin(a)*r.rx*F, r.y, r.z+Math.cos(a)*r.rz*F); U.push(j/seg, i/(nr-1)); } }
    for(let i=0;i<nr-1;i++) for(let j=0;j<seg;j++){ const a=i*(seg+1)+j, b=a+1, c=a+seg+1, d=c+1; I.push(a,b,c, b,d,c); }
    if(o.capTop){ const ci=P.length/3, r=rings[nr-1], base=(nr-1)*(seg+1); P.push(r.x,r.y,r.z); U.push(.5,1); for(let j=0;j<seg;j++) I.push(base+j,base+j+1,ci); }
    if(o.capBot){ const ci=P.length/3, r=rings[0]; P.push(r.x,r.y,r.z); U.push(.5,0); for(let j=0;j<seg;j++) I.push(j+1,j,ci); }
    return bufGeo(P,U,I); }
  const loft=(ctrl,mat,x,y,z,o={})=>mesh(loftGeo(ctrl,o),mat,x,y,z,o);
  /* tube: tapered tube along a smooth curve; flat<1 squashes it against the "up" direction (hair locks, straps, tails) */
  function tubeGeo(pts, r, o={}){ const V=pts.map(p=>p.isVector3?p:new T.Vector3(p[0],p[1],p[2])); const curve=new T.CatmullRomCurve3(V,false,'catmullrom',o.tension??.5); const n=o.n||Math.max(6,(V.length-1)*4), seg=o.seg||8;
    const rf=typeof r==='function'?r:Array.isArray(r)?(t=>r[0]+(r[1]-r[0])*t):(t=>r*Math.pow(Math.sin(PI*(.15+.85*t)),.7)); const fl=o.flat||1;
    const P=[],U=[],I=[]; const tan=new T.Vector3(), N=new T.Vector3(), B=new T.Vector3(), p=new T.Vector3(), up=new T.Vector3(); const fr=o.up?null:curve.computeFrenetFrames(n,false);
    for(let i=0;i<=n;i++){ const t=i/n; curve.getPoint(t,p); if(fr){ N.copy(fr.normals[i]); B.copy(fr.binormals[i]); } else { curve.getTangent(t,tan); up.copy(typeof o.up==='function'?o.up(p):o.up); B.crossVectors(tan,up); if(B.lengthSq()<1e-8) B.set(1,0,0); B.normalize(); N.crossVectors(B,tan).normalize(); }
      const rad=Math.max(0,rf(t)); for(let j=0;j<=seg;j++){ const a=j/seg*PI*2, cn=Math.cos(a)*rad*fl, sn=Math.sin(a)*rad; P.push(p.x+N.x*cn+B.x*sn, p.y+N.y*cn+B.y*sn, p.z+N.z*cn+B.z*sn); U.push(j/seg,t); } }
    for(let i=0;i<n;i++) for(let j=0;j<seg;j++){ const a=i*(seg+1)+j, b=a+1, c=a+seg+1, d=c+1; I.push(a,b,c, b,d,c); }
    let ci=P.length/3; curve.getPoint(0,p); P.push(p.x,p.y,p.z); U.push(.5,0); for(let j=0;j<seg;j++) I.push(j+1,j,ci);
    ci=P.length/3; curve.getPoint(1,p); P.push(p.x,p.y,p.z); U.push(.5,1); const base=n*(seg+1); for(let j=0;j<seg;j++) I.push(base+j,base+j+1,ci);
    return bufGeo(P,U,I); }
  const tube=(pts,r,mat,o={})=>mesh(tubeGeo(pts,r,o),mat,0,0,0,o);
  /* rounded box */
  function rboxGeo(w,h,d,r=.03,s=1){ const key='rb'+[w,h,d,r,s].join('|'); if(GEO[key]) return GEO[key]; const seg=s*2+1; r=Math.min(r,w/2-1e-4,h/2-1e-4,d/2-1e-4); const g=new T.BoxGeometry(1,1,1,seg,seg,seg); const p=g.attributes.position, n=g.attributes.normal, hs=.5/seg, v=new T.Vector3(), nn=new T.Vector3(); const bx=w/2-r, by=h/2-r, bz=d/2-r;
    for(let i=0;i<p.count;i++){ v.fromBufferAttribute(p,i); nn.set(v.x-Math.sign(v.x)*hs, v.y-Math.sign(v.y)*hs, v.z-Math.sign(v.z)*hs).normalize(); p.setXYZ(i,bx*Math.sign(v.x)+nn.x*r, by*Math.sign(v.y)+nn.y*r, bz*Math.sign(v.z)+nn.z*r); n.setXYZ(i,nn.x,nn.y,nn.z); } return GEO[key]=g; }
  const rbox=(w,h,d,mat,x,y,z,o={})=>mesh(rboxGeo(w,h,d,o.rad??Math.min(w,h,d)*.18,o.seg||1),mat,x,y,z,o);

  /* ---------- baking: merge static meshes per material, optional ink outline ---------- */
  function mergeGeo(items){ let nv=0, ni=0; items.forEach(([g])=>{ nv+=g.attributes.position.count; ni+=g.index?g.index.count:g.attributes.position.count; });
    const P=new Float32Array(nv*3), N=new Float32Array(nv*3), U=new Float32Array(nv*2), I=new (nv>65535?Uint32Array:Uint16Array)(ni); let vo=0, io=0; const v=new T.Vector3(), nm=new T.Matrix3();
    items.forEach(([g,m])=>{ const p=g.attributes.position, n=g.attributes.normal, u=g.attributes.uv; nm.getNormalMatrix(m); const flip=m.determinant()<0;
      for(let i=0;i<p.count;i++){ v.fromBufferAttribute(p,i).applyMatrix4(m); P[(vo+i)*3]=v.x; P[(vo+i)*3+1]=v.y; P[(vo+i)*3+2]=v.z; if(n){ v.fromBufferAttribute(n,i).applyMatrix3(nm).normalize(); N[(vo+i)*3]=v.x; N[(vo+i)*3+1]=v.y; N[(vo+i)*3+2]=v.z; } if(u){ U[(vo+i)*2]=u.getX(i); U[(vo+i)*2+1]=u.getY(i); } }
      const cnt=g.index?g.index.count:p.count; for(let i=0;i<cnt;i+=3){ const a=(g.index?g.index.getX(i):i)+vo, b=(g.index?g.index.getX(i+1):i+1)+vo, c=(g.index?g.index.getX(i+2):i+2)+vo; I[io+i]=a; I[io+i+1]=flip?c:b; I[io+i+2]=flip?b:c; } io+=cnt; vo+=p.count; });
    const out=new T.BufferGeometry(); out.setAttribute('position',new T.BufferAttribute(P,3)); out.setAttribute('normal',new T.BufferAttribute(N,3)); out.setAttribute('uv',new T.BufferAttribute(U,2)); out.setIndex(new T.BufferAttribute(I,1)); return out; }
  const OLM = {};
  function outlineMat(w){ if(OLM[w]) return OLM[w]; const m=new T.MeshBasicMaterial({color:'#1c0d26', side:T.BackSide}); m.onBeforeCompile=s=>{ s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n transformed += normalize(normal) * '+w.toFixed(4)+';'); }; m.customProgramCacheKey=()=>'ol'+w; return OLM[w]=m; }
  function bake(root, o={}){ root.updateMatrixWorld(true); const inv=new T.Matrix4().copy(root.matrixWorld).invert(); const buckets=new Map(), rm=[], all=[];
    root.traverse(m=>{ if(!m.isMesh||m.userData.keep||m.userData.baked||m.material.transparent) return; let p=m.parent; while(p&&p!==root){ if(p.userData.pivot||p.userData.keep) return; p=p.parent; }
      const k=m.material.uuid+(m.castShadow?'c':'')+(m.receiveShadow?'r':''); if(!buckets.has(k)) buckets.set(k,{mat:m.material,cast:m.castShadow,recv:m.receiveShadow,items:[]});
      const mt=new T.Matrix4().multiplyMatrices(inv,m.matrixWorld); buckets.get(k).items.push([m.geometry,mt]); if(!m.userData.noOutline) all.push([m.geometry,mt]); rm.push(m); });
    rm.forEach(m=>m.parent.remove(m));
    buckets.forEach(b=>{ const mm=new T.Mesh(mergeGeo(b.items),b.mat); mm.castShadow=b.cast; mm.receiveShadow=b.recv; mm.userData.baked=true; root.add(mm); });
    if(o.outline && all.length){ const ol=new T.Mesh(mergeGeo(all), outlineMat(o.outline)); ol.userData.baked=true; ol.userData.ink=true; ol.castShadow=false; ol.receiveShadow=false; root.add(ol); }
    return root; }

  /* ---------- post-processing: HDR target, bloom, tilt-shift, filmic grade, vignette ---------- */
  function makePost(renderer){
    try{
      if(!renderer.capabilities.isWebGL2 || !(renderer.extensions.has('EXT_color_buffer_float')||renderer.extensions.has('EXT_color_buffer_half_float'))) return null;
      const quad=new T.Mesh(new T.PlaneGeometry(2,2)); quad.frustumCulled=false; const qs=new T.Scene(); qs.add(quad); const qc=new T.OrthographicCamera(-1,1,1,-1,0,1);
      const vs='varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }';
      const sm=(fs,u)=>new T.ShaderMaterial({vertexShader:vs,fragmentShader:fs,uniforms:u,depthTest:false,depthWrite:false,toneMapped:false});
      const bright=sm('uniform sampler2D t; uniform float th; varying vec2 vUv; void main(){ vec3 c=min(texture2D(t,vUv).rgb,vec3(12.)); float l=max(c.r,max(c.g,c.b)); gl_FragColor=vec4(c*smoothstep(th,th+.7,l),1.); }',{t:{value:null},th:{value:1.2}});
      const copy=sm('uniform sampler2D t; varying vec2 vUv; void main(){ gl_FragColor=vec4(min(texture2D(t,vUv).rgb,vec3(6.)),1.); }',{t:{value:null}});
      const blur=sm('uniform sampler2D t; uniform vec2 d; varying vec2 vUv; void main(){ vec3 c=texture2D(t,vUv).rgb*.227; c+=(texture2D(t,vUv+d*1.385).rgb+texture2D(t,vUv-d*1.385).rgb)*.316; c+=(texture2D(t,vUv+d*3.231).rgb+texture2D(t,vUv-d*3.231).rgb)*.0703; gl_FragColor=vec4(c,1.); }',{t:{value:null},d:{value:new T.Vector2()}});
      const comp=sm(`uniform sampler2D t; uniform sampler2D b1; uniform sampler2D b2; uniform sampler2D soft; uniform float ex; uniform float bs; uniform float dim; uniform float flash; uniform vec3 flashCol; uniform float fy; uniform float fw; uniform float ts; varying vec2 vUv;
        vec3 aces(vec3 x){ return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.); }
        void main(){ vec3 c=texture2D(t,vUv).rgb; float k=smoothstep(fw,fw+.3,abs(vUv.y-fy))*ts; c=mix(c,texture2D(soft,vUv).rgb,k);
          c+=(texture2D(b1,vUv).rgb*.55+texture2D(b2,vUv).rgb*.9)*bs; c*=ex*dim; c+=flashCol*flash;
          c=aces(c); c=pow(c,vec3(1./2.2));
          float l=dot(c,vec3(.299,.587,.114)); c=mix(vec3(l),c,1.14);
          c=mix(c*vec3(.96,.94,1.08),c*vec3(1.06,1.01,.94),smoothstep(.15,.75,l));
          vec2 q=vUv-.5; float v=smoothstep(.9,.3,length(q*vec2(1.,.9))); c*=mix(.66,1.,v);
          gl_FragColor=vec4(c,1.); }`,{t:{value:null},b1:{value:null},b2:{value:null},soft:{value:null},ex:{value:.82},bs:{value:.42},dim:{value:1},flash:{value:0},flashCol:{value:new T.Color(1,.95,.9)},fy:{value:.52},fw:{value:.2},ts:{value:.85}});
      const P={comp, rt:null};
      const mk=(w,h,ms)=>new T.WebGLRenderTarget(Math.max(2,w),Math.max(2,h),{type:T.HalfFloatType,samples:ms||0,depthBuffer:!!ms,minFilter:T.LinearFilter,magFilter:T.LinearFilter});
      P.resize=function(){ const s=renderer.getDrawingBufferSize(new T.Vector2()); [P.rt,P.a1,P.b1,P.a2,P.b2,P.s1,P.s2].forEach(r=>r&&r.dispose()); P.rt=mk(s.x,s.y,4); P.a1=mk(s.x>>1,s.y>>1); P.b1=mk(s.x>>1,s.y>>1); P.a2=mk(s.x>>2,s.y>>2); P.b2=mk(s.x>>2,s.y>>2); P.s1=mk(s.x>>2,s.y>>2); P.s2=mk(s.x>>2,s.y>>2); };
      const pass=(mat,target)=>{ quad.material=mat; renderer.setRenderTarget(target); renderer.render(qs,qc); };
      const blr=(src,tmp,dst,k)=>{ blur.uniforms.t.value=src.texture; blur.uniforms.d.value.set(k/dst.width,0); pass(blur,tmp); blur.uniforms.t.value=tmp.texture; blur.uniforms.d.value.set(0,k/dst.height); pass(blur,dst); };
      P.render=function(scene,camera){ renderer.setRenderTarget(P.rt); renderer.render(scene,camera);
        bright.uniforms.t.value=P.rt.texture; pass(bright,P.a1); blr(P.a1,P.b1,P.a1,1); blr(P.a1,P.b2,P.a2,1); blr(P.a2,P.b2,P.a2,2);
        if(comp.uniforms.ts.value>0){ copy.uniforms.t.value=P.rt.texture; pass(copy,P.s1); blr(P.s1,P.s2,P.s1,1.2); }
        comp.uniforms.t.value=P.rt.texture; comp.uniforms.b1.value=P.a1.texture; comp.uniforms.b2.value=P.a2.texture; comp.uniforms.soft.value=P.s1.texture; pass(comp,null); };
      P.resize(); return P;
    }catch(e){ return null; }
  }
  /* ---------- image-based light from a tiny painted room ---------- */
  function makeEnv(renderer){ try{ const s=new T.Scene(); const g=ctex(16,128,(c)=>{ const gr=c.createLinearGradient(0,0,0,128); gr.addColorStop(0,'#3a2c7a'); gr.addColorStop(.45,'#5a3a78'); gr.addColorStop(.55,'#8a5a4a'); gr.addColorStop(1,'#c88a58'); c.fillStyle=gr; c.fillRect(0,0,16,128); });
      s.add(new T.Mesh(new T.SphereGeometry(20,16,12), new T.MeshBasicMaterial({map:g, side:T.BackSide})));
      [[-8,6,-10,'#9aa8ff',5],[6,6,-10,'#9aa8ff',5],[0,9,6,'#ffc880',4],[10,3,4,'#ffb060',3],[-10,3,5,'#c08cff',3]].forEach(([x,y,z,c,sz])=>{ const m=new T.Mesh(new T.SphereGeometry(sz,8,6), new T.MeshBasicMaterial({color:new T.Color(c).multiplyScalar(3)})); m.position.set(x,y,z); s.add(m); });
      const pm=new T.PMREMGenerator(renderer); const t=pm.fromScene(s,.03).texture; pm.dispose(); return t; }catch(e){ return null; } }
  /* rasterise one of the game's SVG illustrations into a sprite texture */
  const SVGT = {};
  function svgTex(key, svg, size=128){ if(SVGT[key]) return SVGT[key]; const c=mkc(size,size); const t=new T.CanvasTexture(c); t.colorSpace=T.SRGBColorSpace; SVGT[key]=t;
    try{ const im=new Image(); im.onload=()=>{ try{ c.getContext('2d').drawImage(im,0,0,size,size); t.needsUpdate=true; t.userData.ready=true; }catch(e){} }; im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg.replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" ')); }catch(e){} return t; }

  return { T, R, PI, ctex, rr, star, TEX, makeTextures, cloth, fabric, M, CM, MC, wood, metal, mesh, box, sph, cyl, cone, caps, tor, lathe, loft, loftGeo, tube, tubeGeo, rbox, rboxGeo, sculpt, smoothNormals, archShape, glow, bake, mergeGeo, outlineMat, makePost, makeEnv, svgTex, refreshBoard };
})();
