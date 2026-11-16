import {bindRailPlayback} from "../rail-motion.mjs?v=vitrina1";
import {focusEase,focusOffset,FOCUS_SIDE_SCALE} from './moto-focus.mjs';
import {homeShowroomUi} from './hogar-showroom.mjs';

// The same HorizonX Motion Focus translation/easing used in Motos, with a
// furniture-sized stage. Controls reset the clock without disabling autoplay.
const HOME_DURATION=570;
export function homePose(offset,width){
 const d=Math.abs(offset),p=Math.min(1,d),pitch=Math.max(125,Math.min(490,width*.61));
 return {x:offset*pitch,scale:1-(1-FOCUS_SIDE_SCALE)*p,opacity:Math.max(0,1-.66*p)*Math.max(0,Math.min(1,(1.85-d)/.65)),visible:d<1.85,z:Math.round(400-d*100)};
}
export function bindHomeShowroom(host,options={}){
 const prefix=options.prefix||'home',ui=options.ui||homeShowroomUi,pose=options.pose||homePose,attr=key=>'[data-'+prefix+'-'+key+']';
 const root=host.querySelector(attr('showroom'));if(!root)return ()=>{};
 const stage=root.querySelector(attr('stage')),items=[...root.querySelectorAll(attr('item'))],panels=[...root.querySelectorAll(attr('panel'))],selectors=[...root.querySelectorAll(attr('select'))],count=items.length;
 const rotation=document.createElement('button');
 rotation.type='button';rotation.className='moto-rotation showroom-playback';
 rotation.textContent='Pausar';stage.append(rotation);
 const reduce=matchMedia('(prefers-reduced-motion:reduce)'),abort=new AbortController(),signal=abort.signal;
 let index=-1,pos=Math.max(0,items.findIndex(n=>n.dataset[prefix+'Id']===ui.id)),frame=0,drag=null,suppressUntil=0,infoAnimation=null,width=stage.clientWidth;
 const wrap=n=>((n%count)+count)%count,listen=(node,type,fn,options={})=>node.addEventListener(type,fn,{...options,signal});
 function paint(announce=false){
  const active=wrap(Math.round(pos));if(active!==index){index=active;sync(announce)}
  items.forEach((item,i)=>{
   const p=pose(focusOffset(i,pos,count),width);
   if(!p.visible&&item.contains(document.activeElement))stage.focus({preventScroll:true});
   item.style.transform=`translate3d(calc(-50% + ${p.x}px),-50%,0) scale(${p.scale})`;
   item.style.opacity=String(p.opacity);item.style.zIndex=String(p.z);item.style.visibility=p.visible?'visible':'hidden';
   item.tabIndex=p.visible?0:-1;item.setAttribute('aria-hidden',String(!p.visible));
  });
 }
 function sync(user){
  ui.id=items[index].dataset[prefix+'Id'];root.dataset.activeIndex=String(index);
  items.forEach((item,i)=>item.setAttribute('aria-pressed',String(i===index)));
  panels.forEach((panel,i)=>{panel.hidden=i!==index;panel.inert=i!==index});
  selectors.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
  const selected=selectors[index],strip=selected?.parentElement;
  if(options.scrollSelector&&strip&&strip.scrollWidth>strip.clientWidth)strip.scrollTo({left:selected.offsetLeft-(strip.clientWidth-selected.offsetWidth)/2,behavior:reduce.matches?'instant':'smooth'});
  const panel=panels[index];
  const guide=prefix==='home'&&!host.querySelector('[data-category-showcase]')?host.querySelector('[data-home-benefit="guide"]'):null,details=prefix==='home'&&!host.querySelector('[data-category-showcase]')?host.querySelector('[data-home-benefit="details"]'):null;
  if(guide)guide.href=panel.querySelector('.hs-context-links a').href;
  if(details)details.href=panel.querySelector('.hs-actions a').href;
  if(user&&status)status.textContent=panel.querySelector(options.heading||'h2').textContent+', '+panel.querySelector(prefix==='home'?'.hs-price strong':'.gf-price strong').textContent;
 }
 const status=root.querySelector(attr('status'));
 const playback=bindRailPlayback({
  viewport:stage,scope:root,toggle:rotation,blocked:()=>Boolean(drag||frame||count<2),
  advance:delta=>{pos+=delta/7600;paint()},
  onReduced:()=>{cancelAnimationFrame(frame);frame=0;infoAnimation?.cancel();pos=Math.round(pos);paint()},
  onMode:playing=>status?.setAttribute('aria-live',playing?'off':'polite')
 });
 if(count<2)rotation.remove();
 function go(next){
  cancelAnimationFrame(frame);frame=0;
  const from=pos,target=Math.round(pos+focusOffset(wrap(next),pos,count));
  playback.hold();
  if(reduce.matches||Math.abs(target-from)<.001){pos=target;paint(true);return}
  const began=performance.now();
  function tick(now){
   const t=Math.min(1,(now-began)/HOME_DURATION);pos=from+(target-from)*focusEase(t);paint(t===1);
   frame=t<1?requestAnimationFrame(tick):0;
   if(!frame){playback.refresh();const panel=panels[index];infoAnimation?.cancel();infoAnimation=panel.animate?.([{opacity:.64,translate:'0 6px'},{opacity:1,translate:'0 0'}],{duration:310,easing:'ease-out'})}
  }
  frame=requestAnimationFrame(tick);
 }
 listen(root,'click',ev=>{
  if(performance.now()<suppressUntil&&ev.target.closest(attr('item'))){ev.preventDefault();return}
  if(ev.target.closest(attr('prev')))go(index-1);
  if(ev.target.closest(attr('next')))go(index+1);
  const button=ev.target.closest(attr('item')+','+attr('select'));if(button)go(Number(button.dataset[prefix+'Item']??button.dataset[prefix+'Select']));
 });
 listen(stage,'keydown',ev=>{
  if(ev.ctrlKey||ev.altKey||ev.metaKey||!['ArrowLeft','ArrowRight','Home','End'].includes(ev.key))return;ev.preventDefault();
  go(ev.key==='Home'?0:ev.key==='End'?count-1:index+(ev.key==='ArrowRight'?1:-1));
 });
 listen(stage,'pointerdown',ev=>{if(ev.button!==0||ev.isPrimary===false||ev.target.closest('.hs-arrows,.gf-arrows,.showroom-playback')||count<2)return;cancelAnimationFrame(frame);frame=0;drag={id:ev.pointerId,x:ev.clientX,y:ev.clientY};playback.refresh()});
 listen(document,'pointerup',ev=>{
  if(!drag||drag.id!==ev.pointerId)return;const dx=ev.clientX-drag.x,dy=ev.clientY-drag.y;drag=null;
  if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){suppressUntil=performance.now()+450;go(index+(dx<0?1:-1))}else playback.hold();
 });
 listen(document,'pointercancel',()=>{if(drag){drag=null;playback.hold()}});
 const size=new ResizeObserver(()=>{width=stage.clientWidth;paint()});size.observe(stage);
 root.querySelectorAll(attr('prev')+','+attr('next')).forEach(b=>b.disabled=count<2);
 paint();
 return ()=>{abort.abort();playback.destroy();cancelAnimationFrame(frame);infoAnimation?.cancel();size.disconnect();rotation.remove()};
}
