/* ============ ART: all illustration is drawn here as SVG ============ */
let _uid = 0; const uid = p => (p||'g') + (++_uid);
const OL = '#2a1830'; // ink outline

/* ---------- UI icons (24x24 stroke) ---------- */
const ICONS = {
 flask:'<path d="M9 3h6M10 3v5.5L5 17a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17l-5-8.5V3"/><path d="M7.5 14h9"/>',
 shop:'<path d="M3 10l1.5-6h15L21 10"/><path d="M3 10c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3"/><path d="M5 13v8h14v-8"/><path d="M10 21v-5h4v5"/>',
 leaf:'<path d="M5 19c0-9 6-14 15-15-1 9-6 15-15 15z"/><path d="M5 19l8-8"/>',
 book:'<path d="M3 5c3-1 6-1 9 1 3-2 6-2 9-1v14c-3-1-6-1-9 1-3-2-6-2-9-1z"/><path d="M12 6v14"/>',
 cart:'<path d="M3 4h2l2.5 11h11l2-8H6.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>',
 chart:'<path d="M4 20h16"/><path d="M7 16v-5M12 16V7M17 16v-8"/>',
 coin:'<circle cx="12" cy="12" r="8"/><path d="M12 8v8M9.5 10c.5-1 1.5-1.5 2.5-1.5s2.5.6 2.5 1.8c0 2.6-5 1.4-5 4 0 1 1 1.7 2.5 1.7 1 0 2-.5 2.5-1.5"/>',
 star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
 gem:'<path d="M6 4h12l3 5-9 11L3 9z"/><path d="M3 9h18M9 4l-1 5 4 11 4-11-1-5"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
 sound:'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
 mute:'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/>',
 search:'<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
 filter:'<path d="M4 5h16l-6 8v6l-4-2v-4z"/>',
 plus:'<path d="M12 5v14M5 12h14"/>', minus:'<path d="M5 12h14"/>', x:'<path d="M6 6l12 12M18 6L6 18"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
 dice:'<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="15" r="1" fill="currentColor"/><circle cx="15" cy="9" r="1" fill="currentColor"/><circle cx="9" cy="15" r="1" fill="currentColor"/>',
 refresh:'<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 5v6h-6"/>',
 question:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7v.5"/><circle cx="12" cy="17" r=".6" fill="currentColor"/>',
 chat:'<path d="M4 5h16v11H9l-5 4z"/>',
 hand:'<path d="M7 11V6a1.5 1.5 0 0 1 3 0v4M10 10V4.5a1.5 1.5 0 0 1 3 0V10M13 10V5.5a1.5 1.5 0 0 1 3 0V12M16 9a1.5 1.5 0 0 1 3 0v5a7 7 0 0 1-7 7h-.5A6.5 6.5 0 0 1 5 14.5L4 12a1.5 1.5 0 0 1 2.6-1.4L7 11"/>',
 move:'<path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"/>',
 rotate:'<path d="M4 12a8 8 0 0 1 14-5.3L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-14 5.3L4 15"/>',
 trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
 undo:'<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',
 hammer:'<path d="M14 6l4 4-9 9-4-4z"/><path d="M13 3l8 8-2 2-8-8z"/>',
 moon:'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',
 heart:'<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
 eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
 scroll:'<path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8"/><path d="M6 4a2 2 0 0 0-2 2v2h4V6a2 2 0 0 0-2-2zM8 8v10a2 2 0 1 1-4 0"/><path d="M11 9h5M11 13h5"/>',
 news:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h4M7 16h4M14 12h3v4h-3z"/>',
 arrowR:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 bottle:'<path d="M10 3h4M10.5 3v4C7 8 6 10 6 13v5a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-5c0-3-1-5-4.5-6V3"/>',
 home:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
 cat:'<path d="M5 20c0-6 2-9 2-9L5 4l4 3h6l4-3-2 7s2 3 2 9z"/><circle cx="9.5" cy="12" r=".7" fill="currentColor"/><circle cx="14.5" cy="12" r=".7" fill="currentColor"/>',
 sparkle:'<path d="M12 3c.5 4 2 6 6 9-4 3-5.5 5-6 9-.5-4-2-6-6-9 4-3 5.5-5 6-9z"/>'
};
function icon(name, size=20, cls=''){ return `<svg class="ic ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]||''}</svg>`; }

/* ---------- Behaviour glyphs (small coloured chips) ---------- */
const BGLYPH = {
 HUSH:'<path d="M8 12h8M12 8v8" opacity="0"/><path d="M7 10c2-2 8-2 10 0M7 14c2 2 8 2 10 0"/>',
 HIDE:'<path d="M3 12s3.5-5 9-5 9 5 9 5-3.5 5-9 5-9-5-9-5z"/><path d="M4 20L20 4"/>',
 DREAM:'<path d="M17 15a6 6 0 1 1-7-9 5 5 0 0 0 7 9z"/>',
 SLEEP:'<path d="M6 7h6l-6 7h6M14 12h4l-4 5h4"/>',
 MEND:'<path d="M12 6v12M6 12h12"/>',
 SOOTHE:'<path d="M4 14c3-3 5 3 8 0s5 3 8 0"/><path d="M4 10c3-3 5 3 8 0s5 3 8 0"/>',
 WARM:'<path d="M12 21c-4 0-6-3-6-6 0-4 4-5 4-10 3 2 8 6 8 10 0 3-2 6-6 6z"/>',
 COOL:'<path d="M12 3v18M4 7.5l16 9M4 16.5l16-9"/>',
 GLOW:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
 FLOAT:'<path d="M12 20V6M7 10l5-5 5 5"/>',
 BIND:'<path d="M9 9a3 3 0 1 0 0 6h2M15 9h-2M15 9a3 3 0 1 1 0 6"/>',
 REVEAL:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="2.5"/>',
 REMEMBER:'<path d="M12 4a8 8 0 1 0 8 8"/><path d="M12 8v4l3 2"/>',
 CHEER:'<circle cx="12" cy="12" r="8"/><path d="M8.5 14c1.5 2 5.5 2 7 0"/>',
 SPARK:'<path d="M13 2L5 14h6l-1 8 8-12h-6z"/>',
 PROTECT:'<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/>',
 RESONATE:'<path d="M8 9v6M12 6v12M16 9v6M4 11v2M20 11v2"/>',
 MISDIRECT:'<path d="M4 8h12l-3-3M20 16H8l3 3"/>',
 GROW:'<path d="M12 21V10"/><path d="M12 13c-4 0-6-3-6-6 4 0 6 2 6 6zM12 10c0-4 2-6 6-6 0 4-2 6-6 6z"/>',
 PRESERVE:'<rect x="6" y="8" width="12" height="12" rx="2"/><path d="M8 8V5h8v3"/>',
 STEADY:'<path d="M4 18h16M7 18V9M12 18V6M17 18V9"/>',
 GUIDE:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5L13 13l-4.5 2.5L11 11z"/>'
};
function bglyph(b, size=14){ return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${BGLYPH[b]||''}</svg>`; }

/* ---------- Ingredient illustrations (64x64) ---------- */
function ingArt(id, size=56){
  const ing = INGM[id]; const [m,a,d] = ing.p; const g = uid('ig');
  const defs = `<defs><radialGradient id="${g}" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="${a}"/><stop offset=".45" stop-color="${m}"/><stop offset="1" stop-color="${d}"/></radialGradient><linearGradient id="${g}l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${m}"/><stop offset="1" stop-color="${d}"/></linearGradient></defs>`;
  const F = `url(#${g})`, L = `url(#${g}l)`, S = `stroke="${OL}" stroke-width="2" stroke-linejoin="round"`;
  let s = '';
  switch(ing.t){
   case 'mushroom': s=`<path d="M28 34c-1 8-3 14-5 18h18c-2-4-4-10-5-18z" fill="#f2ead8" ${S}/><path d="M8 34C8 18 20 9 32 9s24 9 24 25c-6 3-42 3-48 0z" fill="${F}" ${S}/><circle cx="22" cy="22" r="2.5" fill="${a}"/><circle cx="36" cy="17" r="2" fill="${a}"/><circle cx="44" cy="27" r="2.6" fill="${a}"/><circle cx="29" cy="28" r="1.6" fill="${a}"/>`;break;
   case 'berries': s=`<path d="M32 14c2-5 8-8 14-6-3 5-8 7-14 6z" fill="#6fae4f" ${S}/><path d="M32 14v10M32 18l-10 8M32 18l10 9" stroke="${OL}" stroke-width="2" fill="none"/><circle cx="21" cy="36" r="10" fill="${F}" ${S}/><circle cx="43" cy="37" r="10" fill="${F}" ${S}/><circle cx="32" cy="46" r="10" fill="${F}" ${S}/><circle cx="18" cy="32" r="2.5" fill="#fff" opacity=".85"/><circle cx="40" cy="33" r="2.5" fill="#fff" opacity=".85"/><circle cx="29" cy="42" r="2.5" fill="#fff" opacity=".85"/>`;break;
   case 'lily': s=`<path d="M32 40c-2 8 0 14 2 18" stroke="#5f9f4a" stroke-width="3" fill="none"/>${[0,72,144,216,288].map(r=>`<ellipse cx="32" cy="18" rx="8" ry="15" transform="rotate(${r} 32 32)" fill="${F}" ${S}/>`).join('')}<circle cx="32" cy="32" r="6" fill="#f5d36a" ${S}/><circle cx="30" cy="30" r="2" fill="#fff"/>`;break;
   case 'root': s=`<path d="M14 26c6-10 26-12 36-2 6 6 2 16-6 18-4 6-6 12-12 14-2-6-1-10-6-14-10-2-16-8-12-16z" fill="${F}" ${S}/><path d="M24 30c3 2 6 2 9 0M34 38c2 1 5 1 7-1" stroke="${d}" stroke-width="2" fill="none"/><path d="M50 18l6-6M52 26l8-2M44 12l2-8" stroke="${a}" stroke-width="2" stroke-linecap="round"/>`;break;
   case 'petal': s=`<path d="M32 58C14 50 12 30 24 18c2 8 6 10 8 6 2-8 0-14-4-20 18 6 26 24 22 38-2 8-8 14-18 16z" fill="${F}" ${S}/><path d="M32 54c-6-6-6-16 0-26 4 8 6 16 0 26z" fill="${a}" opacity=".8"/>`;break;
   case 'pod': s=`<path d="M32 6c2 0 4 3 4 6M24 14c-8 8-8 34 8 44 16-10 16-36 8-44-4-4-12-4-16 0z" fill="${F}" ${S}/><path d="M32 14v42M26 22c-3 8-3 20 2 28M38 22c3 8 3 20-2 28" stroke="${a}" stroke-width="2" fill="none"/><circle cx="32" cy="26" r="2.5" fill="#ffd36a"/><circle cx="32" cy="36" r="2.5" fill="#ffd36a"/><circle cx="32" cy="46" r="2.5" fill="#ffd36a"/>`;break;
   case 'moss': s=`<path d="M32 56C16 46 6 36 8 24c2-10 14-14 24-4 10-10 22-6 24 4 2 12-8 22-24 32z" fill="${F}" ${S}/><path d="M18 28c2-2 4-2 6 0M30 36c2-2 4-2 6 0M40 26c2-2 4-2 6 0M22 42c2-2 4-2 6 0" stroke="${a}" stroke-width="2" fill="none" opacity=".7"/><path d="M38 40c0-4 4-6 6-4M43 36v6" stroke="${OL}" stroke-width="1.5" fill="#e8e0c8"/><ellipse cx="42" cy="36" rx="4" ry="3" fill="#e8e0c8" ${S}/>`;break;
   case 'leaf': s=`<path d="M10 54C10 28 26 10 54 8c0 28-16 46-44 46z" fill="${F}" ${S}/><path d="M12 52L46 18" stroke="${d}" stroke-width="2"/><path d="M22 40c4-2 2-6 6-8s2-6 6-8 2-6 6-8" stroke="${a}" stroke-width="1.8" fill="none"/>`;break;
   case 'crystal': s=`<path d="M20 56l-6-22 8-14 8 14-2 22z" fill="${F}" ${S}/><path d="M28 56l2-30 8-18 8 18 2 30z" fill="${F}" ${S}/><path d="M44 56l2-18 6-8 6 10-4 16z" fill="${F}" ${S}/><path d="M38 8v48M22 20v36" stroke="${a}" stroke-width="1.5" opacity=".8"/><path d="M33 22l2-4" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`;break;
   case 'pebble': s=`<ellipse cx="32" cy="36" rx="22" ry="16" fill="${F}" ${S}/><ellipse cx="32" cy="36" rx="22" ry="16" fill="${a}" opacity=".35" transform="translate(4 4) scale(.85)"/><ellipse cx="24" cy="29" rx="7" ry="3.5" fill="#fff" opacity=".7" transform="rotate(-18 24 29)"/>`;break;
   case 'dust': s=`<path d="M10 52c4-10 12-16 22-16s18 6 22 16z" fill="${F}" ${S}/><g fill="${a}">${[[18,26],[30,18],[44,24],[24,12],[40,12],[50,34],[14,38]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${1.5+i%3}"/>`).join('')}</g><circle cx="32" cy="44" r="4" fill="#fff" opacity=".6"/>`;break;
   case 'shard': s=`<path d="M22 58L14 30 30 4l20 22-6 32z" fill="${F}" ${S}/><path d="M30 10l-4 16 8 2-6 20" stroke="#fff" stroke-width="2.5" fill="none" stroke-linejoin="round"/><path d="M30 4l2 54" stroke="${a}" opacity=".3" stroke-width="2"/>`;break;
   case 'clover': s=`<path d="M32 36c4 8 4 16 0 22" stroke="#4f8f3a" stroke-width="3" fill="none"/>${[0,120,240].map(r=>`<path d="M32 34c-10-4-14-14-8-18 4-2 7 0 8 3 1-3 4-5 8-3 6 4 2 14-8 18z" transform="rotate(${r} 32 32)" fill="${F}" ${S}/>`).join('')}<circle cx="32" cy="32" r="3" fill="${a}"/>`;break;
   case 'bell': s=`<path d="M32 58V20" stroke="#4f6a8f" stroke-width="3"/><path d="M32 44c-10 0-16-6-16-12 8 0 16 4 16 12zM32 38c10 0 16-6 16-12-8 0-16 4-16 12z" fill="#8fae9f" ${S}/><path d="M24 22c0-8 4-12 8-12s8 4 8 12l3 4H21z" fill="${F}" ${S}/><circle cx="32" cy="28" r="2.5" fill="${a}" ${S}/>`;break;
   case 'mint': s=`<path d="M32 58V24" stroke="#3f8f80" stroke-width="3"/>${[[-1,40],[1,32],[-1,24],[1,16]].map(([side,y])=>`<path d="M32 ${y}c${side*14} -2 ${side*20} -10 ${side*18} -16 ${side*-10} 0 ${side*-18} 6 ${side*-18} 16z" fill="${F}" ${S}/>`).join('')}<g fill="#fff">${[[20,22],[44,30],[22,38],[42,14]].map(([x,y])=>`<path d="M${x} ${y-3}v6M${x-3} ${y}h6" stroke="#fff" stroke-width="1.5"/>`).join('')}</g>`;break;
   case 'poppy': s=`<path d="M32 58c0-10-2-18 2-26" stroke="#5f8f4a" stroke-width="3" fill="none"/><path d="M34 30c-14 2-24-6-22-16 10-2 18 4 22 16zM34 30c14 2 24-6 22-16-10-2-18 4-22 16zM34 30c-6-10-6-20 0-26 6 6 6 16 0 26z" fill="${F}" ${S}/><path d="M18 30c6 6 10 12 16 12s10-6 16-12c-10 0-14 2-16 2s-6-2-16-2z" fill="${m}" ${S}/><circle cx="34" cy="30" r="5" fill="${a}" ${S}/>`;break;
   case 'fruit': s=`<path d="M32 16c0-5 2-8 5-10" stroke="${OL}" stroke-width="2.5" fill="none"/><path d="M34 12c6-4 14-2 16 2-6 4-12 2-16-2z" fill="#6fae4f" ${S}/><path d="M32 18c-14-4-24 6-22 20s12 20 22 18c10 2 20-4 22-18s-8-24-22-18z" fill="${F}" ${S}/><path d="M32 20c-2 10-2 24 0 34" stroke="${d}" stroke-width="1.5" fill="none" opacity=".6"/><ellipse cx="22" cy="30" rx="4" ry="6" fill="#fff" opacity=".35"/>`;break;
   case 'sprig': s=`<path d="M20 58C28 40 34 26 46 8" stroke="#6a4a2a" stroke-width="3" fill="none"/>${[[24,48],[28,40],[32,32],[36,24],[41,16]].map(([x,y],i)=>`<ellipse cx="${x+(i%2?7:-7)}" cy="${y}" rx="6" ry="3.5" transform="rotate(${i%2?-30:30} ${x+(i%2?7:-7)} ${y})" fill="${F}" ${S}/>`).join('')}<circle cx="46" cy="9" r="3.5" fill="${a}" ${S}/>`;break;
   case 'fronds': s=`<path d="M32 58V14M32 40L16 22M32 40l16-18M32 30L20 14M32 30l12-16" stroke="${d}" stroke-width="2.5" fill="none" stroke-linecap="round"/>${[[16,22],[48,22],[20,14],[44,14],[32,12],[24,30],[40,30]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.2" fill="${F}" ${S} stroke-width="1.5"/>`).join('')}`;break;
   case 'anemone': s=`${[0,1,2,3,4,5,6].map(i=>{const x=12+i*6.5;return `<path d="M${x} 34c-2-10 4-14 0-26" stroke="${m}" stroke-width="4" fill="none" stroke-linecap="round"/>`}).join('')}<path d="M10 34c0 14 10 22 22 22s22-8 22-22z" fill="${F}" ${S}/><path d="M16 42h32" stroke="${a}" stroke-width="2"/>`;break;
   case 'morel': s=`<path d="M28 46v12h8V46" fill="#f2ead8" ${S}/><path d="M32 6c12 0 18 16 16 30-2 10-8 12-16 12s-14-2-16-12C14 22 20 6 32 6z" fill="${F}" ${S}/><path d="M22 18l20 4M18 28l28 4M20 38l26 2M28 10l-4 34M38 12l2 34" stroke="${d}" stroke-width="2" fill="none"/>${[[26,22],[36,28],[30,36],[40,18],[24,32]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.8" fill="${a}"/>`).join('')}`;break;
   case 'inkcap': s=`<path d="M29 40c-1 8-1 12-2 16h10c-1-4-1-8-2-16z" fill="#d8d0c8" ${S}/><path d="M18 42c0-20 6-36 14-36s14 16 14 36c-4 2-24 2-28 0z" fill="${F}" ${S}/><path d="M22 42c0 4-1 8 0 10M30 43c0 4 0 8 1 12M40 42c0 3 1 6 0 9" stroke="${a}" stroke-width="2.5" stroke-linecap="round"/><path d="M26 14c-2 6-3 14-2 22" stroke="#fff" stroke-width="2" opacity=".4" fill="none"/>`;break;
   case 'crescent': s=`<path d="M10 54c4-8 12-12 22-12s18 4 22 12z" fill="${F}" ${S}/><path d="M42 10a14 14 0 1 0 6 22 11 11 0 1 1-6-22z" fill="${a}" ${S}/>${[[18,24],[50,40],[14,40]].map(([x,y])=>`<path d="M${x} ${y-3}l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill="${a}"/>`).join('')}`;break;
   case 'drop': s=`<path d="M32 6C24 22 14 30 14 40a18 18 0 0 0 36 0c0-10-10-18-18-34z" fill="${F}" ${S}/><circle cx="28" cy="40" r="3" fill="#fff" opacity=".55"/><circle cx="38" cy="46" r="2" fill="#fff" opacity=".55"/><circle cx="34" cy="34" r="1.6" fill="#fff" opacity=".55"/><path d="M22 36c0-6 4-10 6-14" stroke="#fff" stroke-width="2.5" opacity=".6" fill="none" stroke-linecap="round"/>`;break;
   case 'papermoon': s=`<path d="M40 6a24 24 0 1 0 14 40A20 20 0 1 1 40 6z" fill="${m}" ${S}/><path d="M40 6l-8 16 10 10-12 12 16 6" stroke="${d}" stroke-width="1.5" fill="none" stroke-dasharray="3 2"/><path d="M14 30a20 20 0 0 0 8 16" stroke="${a}" stroke-width="3" fill="none" stroke-linecap="round"/>`;break;
   case 'feather': s=`<path d="M14 58L44 14" stroke="${d}" stroke-width="2.5"/><path d="M44 8c8 10 8 22 0 32-6 8-16 12-24 12 2-8 4-14 10-22-6 4-10 6-14 6 4-10 12-20 28-28z" fill="${F}" ${S}/><path d="M38 20l8 4M32 28l10 4M26 36l10 3" stroke="${d}" stroke-width="1.5" opacity=".6"/>`;break;
   case 'spool': s=`<rect x="14" y="10" width="36" height="8" rx="3" fill="${d}" ${S}/><rect x="14" y="46" width="36" height="8" rx="3" fill="${d}" ${S}/><rect x="18" y="18" width="28" height="28" fill="${F}" ${S}/><path d="M18 22h28M18 27h28M18 32h28M18 37h28M18 42h28" stroke="${a}" stroke-width="1.5"/><path d="M46 30c6 2 10 8 8 16" stroke="${m}" stroke-width="2" fill="none"/>`;break;
   case 'bead': s=`<circle cx="32" cy="32" r="20" fill="${F}" ${S}/><ellipse cx="32" cy="32" rx="6" ry="6" fill="${d}" ${S}/><path d="M12 32a20 20 0 0 1 40 0" stroke="${a}" stroke-width="1.5" fill="none" stroke-dasharray="2 3"/><ellipse cx="23" cy="22" rx="5" ry="3" fill="#fff" opacity=".7" transform="rotate(-30 23 22)"/>`;break;
   case 'phial': s=`<rect x="26" y="6" width="12" height="8" rx="2" fill="#b8865a" ${S}/><path d="M28 14v6c-8 4-12 10-12 18a16 16 0 0 0 32 0c0-8-4-14-12-18v-6z" fill="${F}" ${S}/><circle cx="26" cy="40" r="3" fill="#fff" opacity=".7"/><circle cx="36" cy="34" r="2" fill="#fff" opacity=".7"/><circle cx="34" cy="46" r="2.5" fill="#fff" opacity=".7"/><path d="M24 32c2-3 4-4 8-4" stroke="#fff" stroke-width="2" opacity=".6" fill="none"/>`;break;
   case 'pearl': s=`<path d="M6 44c4-10 12-14 26-14s22 4 26 14c-6 8-16 12-26 12S12 52 6 44z" fill="#d8c8b8" ${S}/><path d="M12 44h40" stroke="#a8988a" stroke-width="1.5"/><circle cx="32" cy="32" r="13" fill="${F}" ${S}/><ellipse cx="27" cy="27" rx="4" ry="2.5" fill="#fff" opacity=".9" transform="rotate(-30 27 27)"/>`;break;
   case 'wool': s=`${[[22,26,12],[38,22,13],[48,36,10],[16,40,11],[32,42,13]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${F}" ${S}/>`).join('')}<path d="M26 30c2-3 6-3 8 0M36 40c2-3 6-3 8 0" stroke="${d}" stroke-width="1.5" fill="none"/>`;break;
   case 'jarwisp': s=`<rect x="20" y="16" width="24" height="6" rx="2" fill="#b8865a" ${S}/><path d="M18 22h28v28a6 6 0 0 1-6 6H24a6 6 0 0 1-6-6z" fill="${m}" fill-opacity=".45" ${S}/><path d="M26 46c-4-6 6-8 2-14s6-8 8-4" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"/><path d="M22 26v18" stroke="#fff" stroke-width="2" opacity=".5"/>`;break;
   case 'scale': s=`<path d="M32 6c14 8 20 20 18 34-2 12-10 18-18 18S16 52 14 40C12 26 18 14 32 6z" fill="${F}" ${S}/><path d="M32 12v40M22 24c4 4 6 4 10 4s6 0 10-4M20 36c4 4 8 4 12 4s8 0 12-4" stroke="${a}" stroke-width="2" fill="none"/>`;break;
   case 'ash': s=`<path d="M8 54c4-10 14-16 24-16s20 6 24 16z" fill="${d}" ${S}/><path d="M14 52c6-6 10-8 18-8s12 2 18 8" fill="${m}"/><path d="M32 40c-8-4-8-12 0-14s8-10 0-14" stroke="${a}" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="24" cy="18" r="1.8" fill="${a}"/><circle cx="42" cy="24" r="1.4" fill="${a}"/>`;break;
   case 'key': s=`<circle cx="20" cy="22" r="12" fill="${F}" ${S}/><circle cx="20" cy="22" r="5" fill="#2a1830"/><path d="M28 30l22 22" stroke="${OL}" stroke-width="9" stroke-linecap="round"/><path d="M28 30l22 22" stroke="${m}" stroke-width="5.5" stroke-linecap="round"/><path d="M44 46l-5 5M50 52l-5 5" stroke="${m}" stroke-width="5" stroke-linecap="round"/>`;break;
   case 'candle': s=`<path d="M22 24h20v30a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4z" fill="${F}" ${S}/><path d="M22 28c4 0 4 6 8 6s2-6 6-6 4 4 6 4" stroke="${d}" stroke-width="1.5" fill="none" opacity=".6"/><path d="M32 24v-6" stroke="${OL}" stroke-width="2.5"/><path d="M32 18c-4-4-2-10 0-12 2 2 4 8 0 12z" fill="${a}" ${S} stroke-width="1.5"/><circle cx="32" cy="12" r="8" fill="${a}" opacity=".25"/>`;break;
   case 'puffball': s=`<ellipse cx="32" cy="54" rx="18" ry="4" fill="#000" opacity=".2"/><path d="M12 38c0-14 9-24 20-24s20 10 20 24c0 10-9 16-20 16s-20-6-20-16z" fill="${F}" ${S}/>${[[24,28],[36,26],[30,38],[42,38],[20,42]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2" fill="${d}" opacity=".5"/>`).join('')}<path d="M26 12c2-4 6-4 8-2M36 8c2-2 5-1 6 1" stroke="${a}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".9"/>`;break;
   default: s=`<circle cx="32" cy="32" r="20" fill="${F}" ${S}/>`;
  }
  return `<svg class="ing-art" width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true">${defs}${s}</svg>`;
}

/* ---------- Potion bottles ---------- */
function bottleArt(shape, col, size=64, opts={}){
  const g = uid('bt'); const dark = shade(col,-0.45), light = shade(col,0.5);
  const defs = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${dark}"/><stop offset=".4" stop-color="${col}"/><stop offset="1" stop-color="${shade(col,-0.25)}"/></linearGradient><radialGradient id="${g}r" cx="50%" cy="60%" r="60%"><stop offset="0" stop-color="${light}" stop-opacity=".9"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient></defs>`;
  const S = `stroke="${OL}" stroke-width="2.2" stroke-linejoin="round"`;
  let glass='', liquid='', cork='', extra='';
  const corkC = '#b8865a';
  switch(shape){
   case 'vial': glass=`<path d="M26 14h12v8c0 4 6 6 6 14v18a6 6 0 0 1-6 6H26a6 6 0 0 1-6-6V36c0-8 6-10 6-14z"/>`; liquid=`<path d="M21 36h22v18a5 5 0 0 1-5 5H26a5 5 0 0 1-5-5z"/>`; cork=`<rect x="25" y="6" width="14" height="9" rx="2.5" fill="${corkC}" ${S}/>`; break;
   case 'flat': glass=`<path d="M24 14h16v6l8 4v30a6 6 0 0 1-6 6H22a6 6 0 0 1-6-6V24l8-4z"/>`; liquid=`<path d="M17 32h30v22a5 5 0 0 1-5 5H22a5 5 0 0 1-5-5z"/>`; cork=`<rect x="23" y="6" width="18" height="9" rx="2.5" fill="${corkC}" ${S}/>`; extra=`<rect x="16" y="40" width="32" height="10" fill="#e8dcc0" opacity=".9"/><path d="M16 40h32M16 50h32" stroke="${OL}" stroke-width="1.2"/>`; break;
   case 'jar': glass=`<path d="M14 22h36v32a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6z"/>`; liquid=`<path d="M15 30h34v24a5 5 0 0 1-5 5H20a5 5 0 0 1-5-5z"/>`; cork=`<path d="M12 14h40v9H12z" fill="#c9a6d8" ${S}/><path d="M12 18c6 3 34 3 40 0" stroke="${OL}" stroke-width="1.5" fill="none"/>`; break;
   case 'dropper': glass=`<path d="M24 22h16v6c6 2 8 6 8 12v14a6 6 0 0 1-6 6H22a6 6 0 0 1-6-6V40c0-6 2-10 8-12z"/>`; liquid=`<path d="M17 38h30v16a5 5 0 0 1-5 5H22a5 5 0 0 1-5-5z"/>`; cork=`<rect x="23" y="14" width="18" height="9" rx="2" fill="#4a3a5a" ${S}/><path d="M26 14c0-8 12-8 12 0" fill="#e8b8c8" ${S}/>`; break;
   case 'oddity': glass=`<path d="M28 12h8v8c10 2 16 10 14 20-2 8-6 10-4 16-6 4-22 4-30-2 2-6-4-8-4-16 0-10 6-16 16-18z"/>`; liquid=`<path d="M13 38c8-4 28-4 37 0-1 6-4 9-3 15-6 4-22 4-30-1 1-6-4-8-4-14z"/>`; cork=`<circle cx="32" cy="7" r="6" fill="#e8c06a" ${S}/>`; extra=`<circle cx="32" cy="7" r="2" fill="#fff" opacity=".8"/>`; break;
   default: glass=`<path d="M26 14h12v8c10 3 16 11 16 20a22 22 0 0 1-44 0c0-9 6-17 16-20z"/>`; liquid=`<path d="M11 40h42a21 20 0 0 1-42 0z"/>`; cork=`<rect x="25" y="5" width="14" height="10" rx="2.5" fill="${corkC}" ${S}/>`;
  }
  const clip = uid('cl');
  return `<svg class="bottle-art" width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true">${defs}
   <clipPath id="${clip}">${glass}</clipPath>
   <ellipse cx="32" cy="61" rx="16" ry="2.5" fill="#000" opacity=".25"/>
   <g fill="#ffffff" fill-opacity=".12">${glass}</g>
   <g clip-path="url(#${clip})"><g fill="url(#${g})">${liquid}</g><g fill="url(#${g}r)">${liquid}</g>
    <circle cx="26" cy="48" r="2" fill="#fff" opacity=".6" class="bub"/><circle cx="36" cy="52" r="1.4" fill="#fff" opacity=".6" class="bub b2"/>${opts.sparkle?`<path d="M38 44l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill="#fff"/>`:''}</g>
   <g fill="none" ${S}>${glass}</g>
   <path d="M20 30c-2 6-2 14 0 20" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".55" fill="none" clip-path="url(#${clip})"/>
   ${cork}${extra}</svg>`;
}
function shade(hex, amt){ let c=hex.replace('#',''); if(c.length===3) c=c.split('').map(x=>x+x).join(''); let r=parseInt(c.slice(0,2),16),g=parseInt(c.slice(2,4),16),b=parseInt(c.slice(4,6),16); const t=amt<0?0:255, p=Math.abs(amt); r=Math.round((t-r)*p+r); g=Math.round((t-g)*p+g); b=Math.round((t-b)*p+b); return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join(''); }
function mixHex(cols, weights){ let r=0,g=0,b=0,w=0; cols.forEach((h,i)=>{const c=h.replace('#','');const k=weights?weights[i]:1;r+=parseInt(c.slice(0,2),16)*k;g+=parseInt(c.slice(2,4),16)*k;b+=parseInt(c.slice(4,6),16)*k;w+=k;}); if(!w) return '#7a5ab8'; return '#'+[r,g,b].map(v=>Math.round(v/w).toString(16).padStart(2,'0')).join(''); }

/* ---------- Character portraits (120x120) ---------- */
function portrait(key, expr='neutral', size=96){
  const P = PORTRAITS[key]; const g = uid('pt');
  const sk = P.skin, skD = shade(sk,-0.22), S=`stroke="${OL}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"`;
  let o = `<defs><radialGradient id="${g}" cx="50%" cy="35%" r="70%"><stop offset="0" stop-color="${shade(P.bg,0.25)}"/><stop offset="1" stop-color="${P.bg}"/></radialGradient><linearGradient id="${g}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(sk,0.12)}"/><stop offset="1" stop-color="${skD}"/></linearGradient></defs>`;
  o += `<rect width="120" height="120" fill="url(#${g})"/>`;
  o += `<circle cx="96" cy="22" r="10" fill="#fff" opacity=".06"/><circle cx="18" cy="30" r="5" fill="#fff" opacity=".08"/>`;
  const has = x => (P.extra||[]).includes(x);
  // body
  if(has('cape')) o+=`<path d="M8 120c4-26 24-36 52-36s48 10 52 36z" fill="${P.clothes}" ${S}/><path d="M34 86l26 20 26-20" fill="${shade(P.clothes,0.15)}" ${S}/>`;
  else if(P.candle) o+=`<path d="M30 120V82c0-6 60-6 60 0v38z" fill="${P.clothes}" ${S}/>`;
  else o+=`<path d="M10 120c2-22 20-34 50-34s48 12 50 34z" fill="${P.clothes}" ${S}/><path d="M40 88c6 10 34 10 40 0" fill="${P.clothes2}" ${S}/>`;
  if(has('apron')) o+=`<path d="M38 96h44v24H38z" fill="${P.clothes2}" ${S}/>`;
  if(has('wings')) o+=`<path d="M30 70C6 50 4 80 22 92M90 70c24-20 26 10 8 22" fill="#fff" fill-opacity=".35" ${S}/>`;
  // neck
  if(!P.frog && !P.candle && !P.bird) o+=`<path d="M50 78h20v12c-6 4-14 4-20 0z" fill="${skD}" ${S}/>`;
  if(has('cape')) o+=`<path d="M48 84l12 8 12-8-4 10H52z" fill="${P.clothes2}" ${S}/>`;
  // head shapes
  const eyY = 54;
  if(P.frog){
    o+=`<ellipse cx="60" cy="60" rx="38" ry="28" fill="url(#${g}s)" ${S}/><circle cx="40" cy="38" r="13" fill="url(#${g}s)" ${S}/><circle cx="80" cy="38" r="13" fill="url(#${g}s)" ${S}/>`;
    o+=`<circle cx="40" cy="38" r="8" fill="#ffe680" ${S} stroke-width="1.6"/><circle cx="80" cy="38" r="8" fill="#ffe680" ${S} stroke-width="1.6"/>`;
    const pupil = expr==='shock'?`<circle cx="40" cy="38" r="2" fill="${OL}"/><circle cx="80" cy="38" r="2" fill="${OL}"/>`:`<rect x="38" y="33" width="4" height="10" rx="2" fill="${OL}"/><rect x="78" y="33" width="4" height="10" rx="2" fill="${OL}"/>`;
    o+=pupil;
    o+= mouthPath(expr, 60, 66, 22, true);
    o+=`<path d="M50 70l2 5 2-5M66 70l2 5 2-5" fill="#fff" stroke="${OL}" stroke-width="1.2"/>`;
    o+=`<ellipse cx="34" cy="64" rx="5" ry="3" fill="#ff8fa0" opacity=".5"/><ellipse cx="86" cy="64" rx="5" ry="3" fill="#ff8fa0" opacity=".5"/>`;
  } else if(P.candle){
    o+=`<path d="M34 92V36c0-4 52-4 52 0v56z" fill="url(#${g}s)" ${S}/><path d="M34 40c4 6 6 14 4 22M86 40c-4 8-2 14 0 18M60 36c2 6 6 6 6 12" stroke="${shade(sk,0.3)}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    o+=`<path d="M60 34v-8" stroke="${OL}" stroke-width="3"/><path d="M60 26c-8-6-4-16 0-20 4 4 8 14 0 20z" fill="#ffc84a" ${S}/><circle cx="60" cy="18" r="16" fill="#ffc84a" opacity=".2"/>`;
    o+= eyesFor(P, expr, 48, 72, 58) + mouthPath(expr, 60, 74, 14);
  } else if(P.bird){
    o+=`<path d="M60 24c22 0 34 14 34 34s-14 32-34 32-34-12-34-32 12-34 34-34z" fill="url(#${g}s)" ${S}/>`;
    o+=`<path d="M60 24c-4-10 2-16 8-18-2 6 4 8 0 18M60 24c2-8 10-12 16-10-4 4 0 10-8 12" fill="${P.clothes2}" ${S}/>`;
    o+=`<circle cx="46" cy="52" r="9" fill="#f0e0b0" ${S}/><circle cx="74" cy="52" r="9" fill="#f0e0b0" ${S}/>`;
    o+=`<circle cx="46" cy="52" r="4" fill="${OL}"/><circle cx="74" cy="52" r="4" fill="${OL}"/><circle cx="47" cy="51" r="1.3" fill="#fff"/><circle cx="75" cy="51" r="1.3" fill="#fff"/>`;
    o+=`<path d="M52 62l8 ${expr==='shock'?16:12} 8-${expr==='shock'?16:12}z" fill="#e8a83a" ${S}/>`;
    o+=`<path d="M30 70c4 2 8 2 10 0M80 70c4 2 8 2 10 0" stroke="${OL}" stroke-width="1.5" fill="none"/>`;
  } else {
    // ears behind
    if(P.ears==='elf') o+=`<path d="M30 58L10 36l20 12zM90 58l20-22-20 12z" fill="${sk}" ${S}/>`;
    if(P.ears==='goblin') o+=`<path d="M30 56L4 46l24 22zM90 56l26-10-24 22z" fill="${sk}" ${S}/>`;
    if(P.ears==='big') o+=`<ellipse cx="26" cy="58" rx="9" ry="12" fill="${sk}" ${S}/><ellipse cx="94" cy="58" rx="9" ry="12" fill="${sk}" ${S}/>`;
    if(P.ears==='fin') o+=`<path d="M30 52l-14-8 4 22zM90 52l14-8-4 22z" fill="${shade(sk,0.2)}" ${S}/>`;
    if(P.ears==='round') o+=`<ellipse cx="30" cy="58" rx="6" ry="8" fill="${sk}" ${S}/><ellipse cx="90" cy="58" rx="6" ry="8" fill="${sk}" ${S}/>`;
    // back hair
    if(P.hairStyle==='long') o+=`<path d="M26 50c-6 20-4 38 4 50h60c8-12 10-30 4-50z" fill="${P.hair}" ${S}/>`;
    if(P.hairStyle==='braids') o+=`<path d="M30 56c-6 16-4 32 0 44M90 56c6 16 4 32 0 44" stroke="${P.hair}" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M30 56c-6 16-4 32 0 44M90 56c6 16 4 32 0 44" stroke="${OL}" stroke-width="1.5" fill="none" stroke-dasharray="4 5"/>`;
    if(P.hairStyle==='curls') o+=`${[[30,40],[28,58],[90,40],[92,58],[40,26],[80,26],[60,20]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="12" fill="${P.hair}" ${S}/>`).join('')}`;
    if(P.hairStyle==='quills'||P.spiky) o+=`<path d="M22 64L8 48l18 0L14 30l20 6 0-20 14 14 12-18 12 18 14-14 0 20 20-6-12 18 18 0-14 16z" fill="${P.hair}" ${S}/>`;
    // head
    const jaw = has('bigjaw') ? `<path d="M28 52c0-20 14-30 32-30s32 10 32 30c0 18-10 34-32 34S28 70 28 52z"/>` : `<path d="M32 54c0-20 12-30 28-30s28 10 28 30c0 16-12 30-28 30S32 70 32 54z"/>`;
    o+=`<g fill="url(#${g}s)" ${S}>${jaw}</g>`;
    if(P.stitched) o+=`<path d="M44 30c4 10 2 22-4 30M80 34c-4 8-2 18 4 24" stroke="${OL}" stroke-width="1.5" fill="none" stroke-dasharray="3 3"/><path d="M60 24v6" stroke="${OL}" stroke-width="1.5"/>`;
    if(has('scales')) o+=`${[[44,40],[76,44],[40,66],[80,64]].map(([x,y])=>`<path d="M${x-4} ${y}a4 4 0 0 1 8 0" stroke="${shade(sk,-0.3)}" stroke-width="1.5" fill="none"/>`).join('')}`;
    if(has('snout')) o+=`<ellipse cx="60" cy="64" rx="12" ry="9" fill="${shade(sk,0.2)}" ${S}/><ellipse cx="60" cy="59" rx="4" ry="3" fill="${OL}"/>`;
    // front hair
    if(P.hairStyle==='messy') o+=`<path d="M30 48c-2-18 10-28 30-28s34 10 30 30c-6-6-8-10-10-14-4 6-12 8-16 4-4 6-14 6-18 0-4 4-10 6-16 8z" fill="${P.hair}" ${S}/>`;
    if(P.hairStyle==='curls') o+=`<path d="M34 44c0-14 12-22 26-22s26 8 26 22c-6-4-10-8-12-10-4 4-10 4-14 0-4 4-10 4-14 0-2 2-6 6-12 10z" fill="${P.hair}" ${S}/>`;
    if(P.hairStyle==='braids'||P.hairStyle==='long') o+=`<path d="M32 50c-2-18 10-28 28-28s30 10 28 28c-10-2-18-8-22-16-6 10-20 14-34 16z" fill="${P.hair}" ${S}/>`;
    if(P.hairStyle==='bun') o+=`<circle cx="60" cy="18" r="11" fill="${P.hair}" ${S}/><path d="M32 48c0-16 12-24 28-24s28 8 28 24c-10-8-20-12-28-12s-18 4-28 12z" fill="${P.hair}" ${S}/>`;
    if(P.hairStyle==='tuft') o+=`<path d="M52 24c2-10 10-12 16-8-4 0-6 4-4 8" fill="${P.hair}" ${S}/>`;
    if(P.hairStyle==='pixie') o+=`<path d="M32 48c-4-16 8-28 28-28s32 12 28 28l-6-8-6 6-6-8-6 6-6-8-6 6-6-8z" fill="${P.hair}" ${S}/>`;
    if(P.hairStyle==='wave') o+=`<path d="M32 48c-2-18 12-26 28-26s30 8 28 26c-4-4-8-4-10 0-4-4-8-4-10 0-4-4-8-4-10 0-4-4-8-4-10 0-4-4-8-4-10 0z" fill="${P.hair}" ${S}/>`;
    if(P.hairStyle==='flame') o+=`<path d="M32 48c-6-12 0-26 8-30 0 8 4 10 6 6 2-8 8-14 14-16-2 8 2 12 6 8 4-4 6-8 6-12 8 8 12 22 8 36-6-6-10-10-14-10-8 0-20 6-34 18z" fill="${P.hair}" ${S}/><path d="M50 22c0 6 4 8 6 4" stroke="#fff3a0" stroke-width="2" fill="none"/>`;
    if(P.hairStyle==='mohawk') o+=`<path d="M52 26l2-16 6 8 4-10 4 12 4-6v12z" fill="${P.hair}" ${S}/>`;
    if(P.hairStyle==='swoop') o+=`<path d="M32 46c0-16 12-24 30-24 14 0 26 8 26 20-14-10-30-8-40 4-6-4-10-2-16 0z" fill="${P.hair}" ${S}/>`;
    // face
    o += eyesFor(P, expr, 47, 73, eyY);
    if(has('brow')) o+=`<path d="M38 44c8-4 14-4 20 0M62 44c6-4 12-4 20 0" stroke="${OL}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    if(P.nose==='round'||!has('snout')) o+= has('snout')?'':`<path d="M58 62c2 2 4 2 5 0" stroke="${shade(sk,-0.4)}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    o += mouthPath(expr, 60, 72, 14);
    if(has('blush')) o+=`<ellipse cx="42" cy="66" rx="6" ry="3.5" fill="#ff7f9a" opacity=".45"/><ellipse cx="78" cy="66" rx="6" ry="3.5" fill="#ff7f9a" opacity=".45"/>`;
    if(has('freckles')) o+=`<g fill="${shade(sk,-0.35)}">${[[42,62],[46,65],[40,66],[78,62],[74,65],[80,66]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1"/>`).join('')}</g>`;
    if(has('tusks')) o+=`<path d="M48 76l-2-10 5 7zM72 76l2-10-5 7z" fill="#fff8e0" ${S} stroke-width="1.5"/>`;
    if(has('beard')) o+=`<path d="M40 74c4 14 12 18 20 18s16-4 20-18c-6 6-14 6-20 6s-14 0-20-6z" fill="${P.hair}" ${S}/>`;
    if(has('mustache')) o+=`<path d="M48 68c4-4 8-4 12 0 4-4 8-4 12 0-4 4-8 2-12 0-4 2-8 4-12 0z" fill="${P.hair==='#d8b070'?'#c8903a':P.hair}" ${S} stroke-width="1.5"/>`;
    if(has('monocle')) o+=`<circle cx="73" cy="${eyY}" r="9" fill="none" stroke="#e8c06a" stroke-width="2.5"/><path d="M82 56c4 8 4 16 0 24" stroke="#e8c06a" stroke-width="1.2" fill="none"/>`;
    if(has('horns')) o+=`<path d="M38 30l-8-14 14 8zM82 30l8-14-14 8z" fill="#3a2a2a" ${S}/>`;
    if(has('sweat')) o+=`<path d="M86 38c-3 4-3 7 0 8 3-1 3-4 0-8z" fill="#9ed8f2" ${S} stroke-width="1.2"/>`;
    if(has('droplets')) o+=`<circle cx="94" cy="76" r="3" fill="#bfe8ff" opacity=".8"/><circle cx="24" cy="80" r="2" fill="#bfe8ff" opacity=".8"/>`;
  }
  // hats
  const hc = P.hatCol||'#3a2a4a';
  if(P.hat==='witch') o+=`<path d="M18 40c14-6 70-6 84 0-14 6-70 6-84 0z" fill="${hc}" ${S}/><path d="M34 38c4-14 10-30 34-36-4 10-2 22 18 36z" fill="${hc}" ${S}/><path d="M36 33c14 3 34 3 48 0" stroke="#e8a83a" stroke-width="5"/><circle cx="72" cy="30" r="4" fill="#f5d36a" ${S} stroke-width="1.5"/>`;
  if(P.hat==='tophat') o+=`<path d="M38 22h44" stroke="${OL}" stroke-width="3"/><rect x="44" y="0" width="32" height="22" fill="#1a1424" ${S}/><path d="M44 16h32" stroke="#c8343a" stroke-width="4"/><path d="M34 24h52" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`;
  if(P.hat==='hood') o+=`<path d="M24 60C20 30 36 14 60 14s40 16 36 46c-6-14-10-22-14-24-6 6-36 6-44 0-4 2-8 10-14 24z" fill="${hc}" ${S}/>`;
  if(P.hat==='helm') o+=`<path d="M28 50c0-20 14-30 32-30s32 10 32 30z" fill="#c8d0e0" ${S}/><path d="M60 20v30M28 48h64" stroke="${OL}" stroke-width="2"/><path d="M60 20c-4-8 0-14 6-16 0 6 4 8-2 16" fill="#e84a4a" ${S}/>`;
  if(P.hat==='feather') o+=`<path d="M36 34c6-10 42-10 48 0z" fill="#5a2a4a" ${S}/><path d="M76 30c10-14 22-18 30-16-6 4-14 12-26 18" fill="#f0c0e0" ${S}/>`;
  if(P.hat==='cap') o+=`<path d="M34 40c0-12 12-18 26-18s26 6 26 18z" fill="${P.clothes}" ${S}/><path d="M80 38l18 4-16 2z" fill="${P.clothes}" ${S}/>`;
  if(has('quill')) o+=`<path d="M92 120L112 74c2 6 0 14-6 20l-8 26" fill="#f0f0f0" ${S} stroke-width="1.6"/>`;
  if(has('leaf')) o+=`<path d="M78 26c8-6 16-4 18 0-6 4-12 4-18 0z" fill="#8fd06a" ${S} stroke-width="1.6"/>`;
  if(has('crest')) o+=``;
  if(has('sparkle')) o+=`<path d="M100 40l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#fff6c0"/><path d="M16 86l1.5 3.5 3.5 1.5-3.5 1.5L16 96l-1.5-3.5L11 91l3.5-1.5z" fill="#fff6c0"/>`;
  if(has('flame') && !P.candle) o+='';
  if(has('stitch')) o+=`<circle cx="44" cy="100" r="3.5" fill="#e8a83a" ${S} stroke-width="1.2"/><circle cx="76" cy="104" r="3" fill="#8fd0f0" ${S} stroke-width="1.2"/>`;
  // expression marks
  if(expr==='shock') o+=`<path d="M100 20l-4 12M108 26l-8 8" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`;
  if(expr==='happy') o+=`<path d="M100 18l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill="#ffe680"/>`;
  return `<svg class="portrait" width="${size}" height="${size}" viewBox="0 0 120 120" aria-hidden="true">${o}</svg>`;
}
function eyesFor(P, expr, lx, rx, y){
  const S=`stroke="${OL}" stroke-width="2"`;
  let o='';
  const brow = (dy, tilt) => `<path d="M${lx-7} ${y-10+dy+tilt}q7 -4 14 ${-tilt*0}" stroke="${OL}" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M${rx-7} ${y-10+dy}q7 -4 14 ${tilt}" stroke="${OL}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  if(P.eyes==='button'){ o+=`<circle cx="${lx}" cy="${y}" r="7" fill="#3a2a4a" ${S}/><circle cx="${rx}" cy="${y}" r="6" fill="#8fb8f5" ${S}/>`+[lx,rx].map(x=>`<circle cx="${x-2}" cy="${y-2}" r="1.2" fill="#fff"/><circle cx="${x+2}" cy="${y+2}" r="1.2" fill="#fff"/>`).join(''); return o; }
  if(P.eyes==='gear'){ return o; }
  const happy = expr==='happy', shock = expr==='shock', sad=expr==='sad';
  if(happy && P.eyes!=='goggles') o+=[lx,rx].map(x=>`<path d="M${x-6} ${y+1}q6 -7 12 0" stroke="${OL}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`).join('');
  else {
    const r = P.eyes==='big'?6:P.eyes==='small'||P.eyes==='beady'?3:4.5;
    o+=[lx,rx].map(x=>`<ellipse cx="${x}" cy="${y}" rx="${shock?r+1.5:r}" ry="${shock?r+2:r+1}" fill="#fff" ${S}/><circle cx="${x}" cy="${y+ (sad?1:0)}" r="${Math.max(1.8,r-1.8)}" fill="${OL}"/><circle cx="${x+1}" cy="${y-1.5}" r="1.1" fill="#fff"/>`).join('');
  }
  if(P.eyes==='glasses') o+=[lx,rx].map(x=>`<circle cx="${x}" cy="${y}" r="11" fill="#fff" fill-opacity=".18" stroke="#c8a04a" stroke-width="2.5"/>`).join('')+`<path d="M${lx+11} ${y}h${rx-lx-22}" stroke="#c8a04a" stroke-width="2.5"/>`;
  if(P.eyes==='spectacles') o+=[lx,rx].map(x=>`<rect x="${x-9}" y="${y-6}" width="18" height="12" rx="3" fill="none" stroke="#2a2a3a" stroke-width="2"/>`).join('')+`<path d="M${lx+9} ${y}h${rx-lx-18}" stroke="#2a2a3a" stroke-width="2"/>`;
  if(P.eyes==='goggles') o+=`<path d="M28 ${y-14}h64" stroke="#5a3a2a" stroke-width="5"/>`+[lx,rx].map(x=>`<circle cx="${x}" cy="${y-14}" r="8" fill="#9fe0f0" fill-opacity=".7" stroke="#c8903a" stroke-width="3"/>`).join('');
  if(P.extra && P.extra.includes('lashes')) o+=[lx,rx].map(x=>`<path d="M${x-5} ${y-5}l-3 -3M${x+5} ${y-5}l3 -3" stroke="${OL}" stroke-width="1.5"/>`).join('');
  if(sad) o+=`<path d="M${lx-7} ${y-9}l12 -3M${rx+7} ${y-9}l-12 -3" stroke="${OL}" stroke-width="2.4" stroke-linecap="round"/>`;
  else if(shock) o+=`<path d="M${lx-6} ${y-13}q6 -4 12 0M${rx-6} ${y-13}q6 -4 12 0" stroke="${OL}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  else if(expr==='think') o+=`<path d="M${lx-6} ${y-10}l12 2M${rx-6} ${y-11}q6 -4 12 0" stroke="${OL}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  return o;
}
function mouthPath(expr, x, y, w, wide){
  const h = w/2;
  if(expr==='happy') return `<path d="M${x-h} ${y}q${h} ${wide?14:12} ${w} 0z" fill="#7a2a3a" stroke="${OL}" stroke-width="2.2" stroke-linejoin="round"/><path d="M${x-h/2} ${y+5}q${h/2} 3 ${h} 0" fill="#ff8fa0"/>`;
  if(expr==='sad') return `<path d="M${x-h*0.7} ${y+5}q${h*0.7} -7 ${h*1.4} 0" stroke="${OL}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  if(expr==='shock') return `<ellipse cx="${x}" cy="${y+3}" rx="${h*0.45}" ry="${h*0.6}" fill="#7a2a3a" stroke="${OL}" stroke-width="2.2"/>`;
  if(expr==='think') return `<path d="M${x-h*0.6} ${y+2}l${h*1.2} -2" stroke="${OL}" stroke-width="2.4" stroke-linecap="round"/>`;
  return `<path d="M${x-h*0.7} ${y}q${h*0.7} 5 ${h*1.4} 0" stroke="${OL}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
}

/* ---------- Mallow the cat ---------- */
function catArt(size=60, sleeping=true){
  return `<svg width="${size}" height="${size*0.7}" viewBox="0 0 80 56" aria-hidden="true"><ellipse cx="40" cy="50" rx="30" ry="5" fill="#000" opacity=".2"/><path d="M12 44c0-14 12-22 28-22s28 6 28 18c0 6-6 8-14 8H20c-6 0-8-2-8-4z" fill="#2a2230" stroke="${OL}" stroke-width="2"/><path d="M40 24c6 4 10 12 8 22-6 0-14-4-14-12 0-4 2-8 6-10z" fill="#f2e6d8" stroke="${OL}" stroke-width="1.6"/><path d="M14 30l-2-12 8 6zM30 26l2-12 6 10z" fill="#2a2230" stroke="${OL}" stroke-width="2" stroke-linejoin="round"/><path d="M16 36q3 2 6 0M26 36q3 2 6 0" stroke="#f5d36a" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M66 42c8 0 10-8 6-12" stroke="#2a2230" stroke-width="5" fill="none" stroke-linecap="round"/>${sleeping?`<text x="56" y="16" font-family="Caveat" font-size="14" fill="#f2e6d8">z</text><text x="64" y="8" font-family="Caveat" font-size="10" fill="#f2e6d8">z</text>`:''}</svg>`;
}

/* ---------- Isometric shop drawing ---------- */
const TW = 64, TH = 32;
function isoPt(x, y, ox, oy){ return [ (x - y) * TW/2 + ox, (x + y) * TH/2 + oy ]; }
function isoBox(x,y,w,h,ht,col,top,ox,oy,extra=''){
  const A=isoPt(x,y,ox,oy), B=isoPt(x+w,y,ox,oy), C=isoPt(x+w,y+h,ox,oy), D=isoPt(x,y+h,ox,oy);
  const up = p => [p[0], p[1]-ht];
  const pts = a => a.map(p=>p.join(',')).join(' ');
  return `<polygon points="${pts([D,C,up(C),up(D)])}" fill="${shade(col,-0.18)}" stroke="${OL}" stroke-width="1.5" stroke-linejoin="round"/>`+
         `<polygon points="${pts([C,B,up(B),up(C)])}" fill="${shade(col,-0.38)}" stroke="${OL}" stroke-width="1.5" stroke-linejoin="round"/>`+
         `<polygon points="${pts([up(A),up(B),up(C),up(D)])}" fill="${top}" stroke="${OL}" stroke-width="1.5" stroke-linejoin="round"/>`+extra;
}
function furnitureSVG(item, ox, oy, state){
  const F = FURN[item.type]; let {x,y} = item; let w=item.rot?F.h:F.w, h=item.rot?F.w:F.h;
  const A=isoPt(x,y,ox,oy), B=isoPt(x+w,y,ox,oy), C=isoPt(x+w,y+h,ox,oy), D=isoPt(x,y+h,ox,oy);
  const cx=(A[0]+C[0])/2, cy=(A[1]+C[1])/2;
  let s='';
  const potColors=['#e86aa0','#6ad0f0','#f5c84a','#7fd66a','#b88af0','#f08a5a'];
  const minib=(px,py,c,sc=1)=>`<g transform="translate(${px} ${py}) scale(${sc})"><rect x="-1.5" y="-12" width="3" height="3" fill="#b8865a"/><path d="M-1.5 -9h3v2c3 1 4 3 4 5a5.5 5 0 0 1-11 0c0-2 1-4 4-5z" fill="${c}" stroke="${OL}" stroke-width="1"/><circle cx="-1.5" cy="-3" r="1" fill="#fff" opacity=".7"/></g>`;
  switch(item.type){
   case 'rug': {
     const pts=[A,B,C,D].map(p=>p.join(',')).join(' ');
     s=`<polygon points="${pts}" fill="${F.col}" stroke="${OL}" stroke-width="1.5"/><polygon points="${[A,B,C,D].map(p=>[(p[0]-cx)*.78+cx,(p[1]-cy)*.78+cy].join(',')).join(' ')}" fill="none" stroke="#e8c06a" stroke-width="2" stroke-dasharray="6 4"/><path d="M${cx-10} ${cy}a10 6 0 1 0 14 -5 8 5 0 1 1 -14 5z" fill="#e8c06a"/>`;
     break; }
   case 'cauldron': {
     s=`<ellipse cx="${cx}" cy="${cy+2}" rx="30" ry="14" fill="#5a4040" stroke="${OL}" stroke-width="1.5"/><ellipse cx="${cx}" cy="${cy}" rx="22" ry="8" fill="#ff9a3a" opacity=".8" class="fireglow"/>`+
       `<path d="M${cx-26} ${cy-30}c-4 20 6 32 26 32s30-12 26-32z" fill="#2f2640" stroke="${OL}" stroke-width="2"/><ellipse cx="${cx}" cy="${cy-30}" rx="27" ry="9" fill="#3f3354" stroke="${OL}" stroke-width="2"/><ellipse cx="${cx}" cy="${cy-30}" rx="21" ry="6" fill="${state.cauldronCol||'#b86af0'}" class="brewglow"/>`+
       `<circle cx="${cx-6}" cy="${cy-32}" r="2.5" fill="#fff" opacity=".7" class="bub"/><circle cx="${cx+8}" cy="${cy-31}" r="1.8" fill="#fff" opacity=".7" class="bub b2"/>`+
       `<path d="M${cx-4} ${cy-38}c-8-10 8-14 0-26M${cx+6} ${cy-40}c-6-8 6-10 0-20" stroke="${state.cauldronCol||'#c88af0'}" stroke-width="5" fill="none" opacity=".35" stroke-linecap="round" class="steam"/>`+
       `<path d="M${cx-10} ${cy-18}l2 4 4 1-4 1-2 4-2-4-4-1 4-1z" fill="#e8c06a"/>`;
     break; }
   case 'plant': {
     s=isoBox(x+.25,y+.25,.5,.5,16,F.col,shade(F.col,0.2),ox,oy);
     const t=[cx,cy-16];
     s+=`<g>${[-30,-10,10,30,-50,50].map((r,i)=>`<path d="M${t[0]} ${t[1]}q${Math.sin(r/57)*20} -${26-i*2} ${Math.sin(r/57)*34} -${10+i*2}" stroke="#3f7a34" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M${t[0]} ${t[1]}q${Math.sin(r/57)*20} -${26-i*2} ${Math.sin(r/57)*34} -${10+i*2}" stroke="#6fbf5a" stroke-width="4" fill="none" stroke-linecap="round"/>`).join('')}</g>`;
     break; }
   case 'candles': {
     s=`<ellipse cx="${cx}" cy="${cy}" rx="10" ry="5" fill="#8f6a2a" stroke="${OL}" stroke-width="1.2"/><path d="M${cx} ${cy}v-26M${cx-12} ${cy-22}q12 10 24 0" stroke="#c8a04a" stroke-width="3" fill="none"/>`+
       [-12,0,12].map(dx=>`<rect x="${cx+dx-2.5}" y="${cy-(dx?34:40)}" width="5" height="12" fill="#f5ead0" stroke="${OL}" stroke-width="1"/><path d="M${cx+dx} ${cy-(dx?34:40)}c-3-3-1-7 0-8 1 1 3 5 0 8z" fill="#ffc84a" class="flick"/><circle cx="${cx+dx}" cy="${cy-(dx?38:44)}" r="9" fill="#ffc84a" opacity=".18"/>`).join('');
     break; }
   case 'lantern': {
     s=`<ellipse cx="${cx}" cy="${cy}" rx="9" ry="4.5" fill="#3a2a1a" stroke="${OL}" stroke-width="1.2"/><path d="M${cx} ${cy}v-44" stroke="#4a3a2a" stroke-width="4"/><path d="M${cx} ${cy-44}h12v6" stroke="#4a3a2a" stroke-width="3" fill="none"/><rect x="${cx+6}" y="${cy-38}" width="12" height="16" rx="2" fill="#f5c04a" stroke="${OL}" stroke-width="1.5" class="flick"/><circle cx="${cx+12}" cy="${cy-30}" r="16" fill="#f5c04a" opacity=".18"/>`;
     break; }
   case 'catbed': {
     s=`<ellipse cx="${cx}" cy="${cy}" rx="22" ry="11" fill="${F.col}" stroke="${OL}" stroke-width="1.5"/><ellipse cx="${cx}" cy="${cy-2}" rx="16" ry="7" fill="${F.top}"/>`+`<g transform="translate(${cx-22} ${cy-26}) scale(.55)">${catArt(80).replace(/<svg[^>]*>|<\/svg>/g,'')}</g>`;
     break; }
   default: {
     let extra='';
     if(item.type==='shelf'||item.type==='cabinet'||item.type==='window'){
       // bottles on the front-left face
       const rows = item.type==='table'?1:3, n = Math.round(w*3+h*0);
       for(let r=0;r<rows;r++){ const lift = 12 + r*((F.ht-14)/rows);
         extra+=`<path d="M${D[0]} ${D[1]-lift+2}L${C[0]} ${C[1]-lift+2}" stroke="${shade(F.col,-0.45)}" stroke-width="2"/>`;
         const cnt = Math.max(2, Math.round((w+h)*1.6));
         for(let i=0;i<cnt;i++){ const t=(i+0.5)/cnt; const px=D[0]+(C[0]-D[0])*t, py=D[1]+(C[1]-D[1])*t-lift; extra+=minib(px,py,potColors[(i*3+r+x+y)%potColors.length],1); }
       }
       if(item.type==='window'){ extra+=`<path d="M${A[0]} ${A[1]-F.ht}q${(B[0]-A[0])/2} -24 ${B[0]-A[0]} ${B[1]-A[1]}" stroke="#e8c06a" stroke-width="3" fill="none"/>`; }
     }
     if(item.type==='table'){ extra+=minib(cx-8,cy-F.ht+2,potColors[1],1.2)+minib(cx+8,cy-F.ht+4,potColors[2],1.2); }
     if(item.type==='counter'){ extra+=`<rect x="${cx-14}" y="${cy-F.ht-16}" width="16" height="10" fill="#e8dcc0" stroke="${OL}" stroke-width="1.2" transform="skewY(-10)"/><circle cx="${cx+14}" cy="${cy-F.ht-6}" r="6" fill="#e8c06a" stroke="${OL}" stroke-width="1.2"/><path d="M${cx+14} ${cy-F.ht-12}v-4" stroke="${OL}" stroke-width="1.5"/>`+minib(cx-24,cy-F.ht+6,'#b88af0',1.1); }
     if(item.type==='bench'){ extra+=`<ellipse cx="${cx-8}" cy="${cy-F.ht-2}" rx="9" ry="4" fill="#f5c84a" stroke="${OL}" stroke-width="1"/>`; }
     s = isoBox(x,y,w,h,F.ht,F.col,F.top,ox,oy,extra);
   }
  }
  const selCls = state.selected ? ' sel' : '';
  return `<g class="furn${selCls}" data-fid="${item.id}">${s}</g>`;
}
