import {combinations,combinationIndex,combinationById,combinationDefaults,combinationQuote} from './hogar-combinations.mjs';
import {comboUi,combinationDialog,combinationMoney} from './hogar-combo-views.mjs';
import {e} from '../nueva/ui.mjs';
export const COMBINATION_INTERVAL=6000;

// Skewed Carousel (HorizonX): translated track, perspective, distance-based scale.
// Native CSS transitions replace GSAP; cyclic copies keep the end-to-start step short.
export function bindCombinations(host,s,onAdd,options={}){
 const choices=options.choices||combinations,ui=options.ui||comboUi,count=choices.length;
 const root=host.querySelector('[data-combo-root]');if(!root&&!host.querySelector('[data-home-combo]'))return ()=>{};
 const gallery=root?.querySelector('.hc-gallery'),track=root?.querySelector('.hc-track'),slots=[...(root?.querySelectorAll('[data-combo-slot]')||[])],tabs=[...(root?.querySelectorAll('[data-combo-tab]')||[])],infos=[...(root?.querySelectorAll('[data-combo-info]')||[])],dialog=document.querySelector('#combination-dialog');
 const abort=new AbortController(),signal=abort.signal,reduce=matchMedia('(prefers-reduced-motion:reduce)');
 let active=combinationIndex(ui.index,count),cursor=count+active,pitch=1,timer=null,settle=null,visible=true,drag=null,opener=null,blockClick=false,disposed=false;
 const animations=new Set(),listen=(node,event,fn)=>node?.addEventListener(event,fn,{signal});
 const clearAuto=()=>{clearTimeout(timer);timer=null};
 const canAuto=()=>!disposed&&!reduce.matches&&!document.hidden&&visible&&!drag&&!document.querySelector('dialog[open]')&&!root.querySelector(':focus-visible');
 function schedule(){clearAuto();if(!root||disposed||reduce.matches||document.hidden||!visible)return;timer=setTimeout(()=>{if(canAuto())go(active+1,'auto');else schedule()},COMBINATION_INTERVAL)}
 function paint(animate=true){
  if(!root)return;
  const transition=animate&&!reduce.matches?'transform 480ms cubic-bezier(.23,1,.32,1)':'none';
  track.style.transition=transition;track.style.transform=`translateX(${-(cursor+.5)*pitch}px)`;
  slots.forEach((slot,n)=>{const card=slot.firstElementChild,distance=n-cursor,current=Math.abs(distance)<.001;card.style.transition=transition;card.style.transform=`rotateY(${Math.max(-2,Math.min(2,distance))*8}deg) scale(${current?1:.9})`;card.style.opacity=Math.abs(distance)>1.8?'.35':'1';card.style.zIndex=String(100-Math.round(Math.abs(distance)*10));card.inert=!current;const button=card.querySelector('button');button.tabIndex=current?0:-1;button.setAttribute('aria-current',String(current))});
  root.dataset.activeIndex=String(active);gallery.dataset.position=String(cursor);
  tabs.forEach((tab,n)=>{tab.setAttribute('aria-selected',String(n===active));tab.tabIndex=n===active?0:-1});
  infos.forEach((info,n)=>{info.hidden=n!==active;info.inert=n!==active});
  root.querySelector('[data-combo-counter]').textContent=String(active+1).padStart(2,'0')+' / '+String(count).padStart(2,'0');
 }
 function measure(){if(!gallery)return;pitch=Math.round(gallery.clientWidth*.84);root.style.setProperty('--hc-pitch',pitch+'px');paint(false)}
 function go(index,source='manual'){
  clearTimeout(settle);if(cursor<count/2||cursor>count*2.5-1){cursor=count+active;paint(false)}
  const target=combinationIndex(index,count);let delta=target-active;if(delta>count/2)delta-=count;if(delta< -count/2)delta+=count;
  cursor+=delta;active=target;ui.index=active;paint();
  if(root&&source!=='auto')root.querySelector('[data-combo-status]').textContent=choices[active].label+': '+choices[active].title;
  settle=setTimeout(()=>{if(cursor<count||cursor>=count*2){cursor=count+active;paint(false)}},reduce.matches?0:500);schedule();
 }
 function morph(origin){
  if(reduce.matches||!origin?.width)return;
  const sheet=dialog.querySelector('.hc-dialog-sheet'),media=dialog.querySelector('.hc-dialog-media'),curve=springCurve(.1,200),frames=morphFrames(origin,sheet.getBoundingClientRect(),media.getBoundingClientRect(),curve.samples,{cardRadius:10,radius:12});
  for(const [node,keyframes] of [[sheet,frames.sheet],[media,frames.media]]){const animation=node.animate(keyframes,{duration:curve.duration,easing:'linear'});animations.add(animation);animation.finished.catch(()=>{}).finally(()=>animations.delete(animation))}
 }
 function open(id,trigger){
  const c=combinationById(id);if(!c)return;clearAuto();opener=trigger;
  const origin=(trigger.closest('[data-home-showroom]')?.querySelector('.hs-item[aria-pressed="true"]')||slots[cursor]?.firstElementChild)?.getBoundingClientRect();
  const draft=ui.drafts[id]||combinationDefaults(id);ui.drafts[id]=draft;
  dialog.dataset.section=c.section||'hogar';dialog.innerHTML=combinationDialog(s,c,draft,s.shopping.branch);dialog.dataset.combination=id;
  if(!dialog.open)dialog.showModal();dialog.querySelector('[data-combo-close]').focus({preventScroll:true});morph(origin);
 }
 function formValues(){const form=dialog.querySelector('form');if(!form)return null;const c=combinationById(dialog.dataset.combination),draft=Object.fromEntries(c.items.map(item=>{const value=form.elements.namedItem(item.id).value;return [item.id,value===''?NaN:Number(value)]}));ui.drafts[c.id]=draft;return {c,draft,branch:form.elements.branch.value}}
 function refresh(message=''){
  const v=formValues();if(!v)return;const q=combinationQuote(s,v.c.id,v.draft,v.branch),errors=message?[message]:q.errors;
  dialog.querySelector('[data-combo-total]').textContent=combinationMoney(q.total);const box=dialog.querySelector('[data-combo-errors]');box.hidden=!errors.length;box.innerHTML=errors.map(e).join('<br>');dialog.querySelectorAll('[data-combo-submit]').forEach(b=>b.disabled=!!errors.length);return {v,q};
 }
 function commit(checkout){
  const next=refresh();if(!next||next.q.errors.length)return;
  dialog.querySelectorAll('[data-combo-submit]').forEach(b=>b.disabled=true);
  try{onAdd(next.v.c.id,next.v.draft,next.v.branch,checkout)}catch(error){refresh(error.message)}
 }
 listen(host,'click',ev=>{
  const button=ev.target.closest('button');if(!button)return;
  if(button.matches('[data-home-combo]')){const n=choices.findIndex(c=>c.id===button.dataset.homeCombo);if(n>=0){go(n,'related');open(button.dataset.homeCombo,button)}return}
  if(button.matches('[data-combo-prev]'))go(active-1);
  if(button.matches('[data-combo-next]'))go(active+1);
  if(button.matches('[data-combo-tab]'))go(Number(button.dataset.comboTab));
  if(button.matches('[data-combo-open]'))open(button.dataset.comboOpen,button);
  if(button.matches('[data-combo-purchase]')){try{onAdd(button.dataset.comboPurchase,combinationDefaults(button.dataset.comboPurchase),s.shopping.branch,true)}catch(error){open(button.dataset.comboPurchase,button);refresh(error.message)}}
  if(button.matches('[data-combo-scene]')&&!blockClick)open(choices[active].id,button);
 });
 listen(root,'keydown',ev=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(ev.key)||ev.target.closest('input,select'))return;
  if(!ev.target.closest('.hc-gallery,[role=tablist]'))return;ev.preventDefault();
  go(ev.key==='Home'?0:ev.key==='End'?count-1:active+(ev.key==='ArrowRight'?1:-1));
  if(ev.target.matches('[role=tab]'))tabs[active].focus({preventScroll:true});
 });
 listen(gallery,'pointerdown',ev=>{if(ev.target.closest('.hc-arrows')||ev.button!==0)return;drag={x:ev.clientX,y:ev.clientY,pointer:ev.pointerId};blockClick=false;clearAuto()});
 listen(window,'pointerup',ev=>{if(!drag||ev.pointerId!==drag.pointer)return;const dx=ev.clientX-drag.x,dy=ev.clientY-drag.y;drag=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){blockClick=true;go(active+(dx<0?1:-1),'swipe');setTimeout(()=>blockClick=false,0)}else schedule()});
 listen(window,'pointercancel',()=>{drag=null;schedule()});
 listen(root,'focusout',()=>setTimeout(()=>{if(!disposed)schedule()},0));
 listen(document,'visibilitychange',schedule);listen(reduce,'change',()=>{paint(false);schedule()});
 listen(dialog,'input',()=>refresh());listen(dialog,'change',()=>refresh());listen(dialog,'submit',ev=>{ev.preventDefault();commit(false)});
 listen(dialog,'click',ev=>{if(ev.target.closest('[data-combo-close]'))dialog.close();if(ev.target.closest('[data-combo-checkout]'))commit(true);if(ev.target.closest('a[href]'))dialog.close();if(ev.target===dialog){const r=dialog.getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)dialog.close()}});
 listen(dialog,'close',()=>{animations.forEach(a=>a.cancel());animations.clear();if(opener?.isConnected)opener.focus({preventScroll:true});schedule()});
 const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;schedule()},{threshold:.08});if(root)observer.observe(root);
 const size=new ResizeObserver(measure);if(gallery)size.observe(gallery);measure();schedule();
 return ()=>{disposed=true;abort.abort();clearAuto();clearTimeout(settle);observer.disconnect();size.disconnect();animations.forEach(a=>a.cancel());if(dialog.open)dialog.close()};
}

// Pure sampled spring and geometry from HorizonX Morph Dialog. The native dialog
// supplies focus containment/Escape; these frames preserve the card-to-sheet motion.

const clamp = (value, min, max) => value < min ? min : value > max ? max : value;
const lerp = (a, b, t) => a + (b - a) * t;
const round = (value) => Math.round(value * 100) / 100;

// The clip-path inset that shows only `inner` of the box `outer`, both in the
// same coordinate space, rounded to the card's corner.
function clipFrom(inner, outer, radius) {
  const top = round(Math.max(0, inner.top - outer.top));
  const left = round(Math.max(0, inner.left - outer.left));
  const right = round(Math.max(0, outer.left + outer.width - (inner.left + inner.width)));
  const bottom = round(Math.max(0, outer.top + outer.height - (inner.top + inner.height)));
  return `inset(${top}px ${right}px ${bottom}px ${left}px round ${radius}px)`;
}

// One keyframe per spring sample, so the photo and the dialog's outline move
// as one shape. `p` is 0 at the card and 1 at the open dialog (past 1 while the
// spring overshoots). The photo travels straight from the card to its place in
// the dialog; the outline starts hugging the photo and only widens to the full
// dialog as `p^2.2`, so the white of the dialog appears behind the photo rather
// than as a frame around it, and closes back onto it with no rim at the end.
export function morphFrames(card, sheet, photo, progress, { cardRadius, radius }) {
  const last = Math.max(1, progress.length - 1);
  const sheetFrames = [];
  const mediaFrames = [];
  progress.forEach((p, index) => {
    const offset = round(index / last);
    const e = Math.pow(clamp(p, 0, 1), 2.2);
    const m = {
      left: lerp(card.left, photo.left, p),
      top: lerp(card.top, photo.top, p),
      width: lerp(card.width, photo.width, p),
      height: lerp(card.height, photo.height, p)
    };
    const outline = {
      left: lerp(m.left, sheet.left, e),
      top: lerp(m.top, sheet.top, e),
      width: lerp(m.width, sheet.width, e),
      height: lerp(m.height, sheet.height, e)
    };
    sheetFrames.push({ offset, clipPath: clipFrom(outline, sheet, round(lerp(cardRadius, radius, e))) });
    const sx = m.width / photo.width;
    const sy = m.height / photo.height;
    const corner = lerp(cardRadius, radius - 6, e);
    mediaFrames.push({
      offset,
      transform: `translate(${round(m.left - photo.left)}px,${round(m.top - photo.top)}px) scale(${Math.round(sx * 1000) / 1000},${Math.round(sy * 1000) / 1000})`,
      borderRadius: `${round(corner / sx)}px / ${round(corner / sy)}px`
    });
  });
  return { sheet: sheetFrames, media: mediaFrames };
}

// Tab and Shift+Tab inside the dialog wrap around its controls.
function nextFocus(count, current, backwards) {
  if (count <= 0) return -1;
  if (current < 0) return backwards ? count - 1 : 0;
  return (current + (backwards ? count - 1 : 1)) % count;
}

// A damped spring from 0 to 1 sampled at 60 fps until it settles.
export function springCurve(bounce = 0.18, stiffness = 200) {
  const zeta = clamp(1 - bounce, 0.15, 1);
  const c = 2 * zeta * Math.sqrt(stiffness);
  let x = 0;
  let v = 0;
  const dt = 1 / 240;
  const samples = [0];
  let t = 0;
  let calm = 0;
  while (t < 3) {
    for (let n = 0; n < 4; n += 1) {
      v += (stiffness * (1 - x) - c * v) * dt;
      x += v * dt;
    }
    t += 1 / 60;
    samples.push(x);
    calm = Math.abs(1 - x) < 0.002 && Math.abs(v) < 0.0200004 ? calm + 1 : 0;
    if (calm > 3) break;
  }
  samples[samples.length - 1] = 1;
  return { samples, duration: Math.round(t * 1000) };
}

