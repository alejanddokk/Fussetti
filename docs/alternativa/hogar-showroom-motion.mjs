import {focusEase,focusOffset,FOCUS_SIDE_SCALE} from './moto-focus.mjs';
import {homeShowroomUi} from './hogar-showroom.mjs';

// The same HorizonX Motion Focus translation/easing used in Motos, with a
// furniture-sized stage. Controls reset the clock without disabling autoplay.
export const HOME_INTERVAL=7800,HOME_DURATION=800;
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
 let index=Math.max(0,items.findIndex(n=>n.dataset[prefix+'Id']===ui.id)),pos=index,target=index,from=pos,start=0,frame=0,timer=0,visible=true,disposed=false,drag=null,suppressUntil=0,infoAnimation=null,hoverDetails=false,hoverStage=false,paused=false,duration=HOME_DURATION;
 const wrap=n=>((n%count)+count)%count,listen=(node,type,fn,options={})=>node.addEventListener(type,fn,{...options,signal});
 const stop=()=>{clearTimeout(timer);timer=0};
 function paint(){
  items.forEach((item,i)=>{
   const p=pose(focusOffset(i,pos,count),stage.clientWidth);
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
  if(user)root.querySelector(attr('status')).textContent=panel.querySelector(options.heading||'h2').textContent+', '+panel.querySelector(prefix==='home'?'.hs-price strong':'.gf-price strong').textContent;
 }
 function schedule(){
  stop();rotation.hidden=reduce.matches||count<2;rotation.textContent=paused?'Reanudar':'Pausar';
  if(disposed||paused||reduce.matches||document.hidden||!visible||count<2||hoverDetails||hoverStage)return;
  timer=setTimeout(()=>{if(!drag&&!document.querySelector('dialog[open]')&&(!root.querySelector(':focus-visible')||document.activeElement===rotation))go(target+1,false);else schedule()},HOME_INTERVAL);
 }
 function tick(now){
  frame=0;if(disposed)return;if(!start)start=now;
  const t=Math.min(1,(now-start)/duration);pos=from+(target-from)*(duration===HOME_DURATION?focusEase(t):t*t*(3-2*t));paint();
  if(t<1)frame=requestAnimationFrame(tick);else{pos=target;paint();start=0;schedule()}
 }
 function go(next,user=true){
  if(disposed)return;duration=user?HOME_DURATION:2400;stop();cancelAnimationFrame(frame);frame=0;start=0;from=pos;
  index=wrap(Math.round(next));target=Math.round(pos+focusOffset(index,pos,count));infoAnimation?.cancel();sync(user);
  if(reduce.matches||Math.abs(target-pos)<.001){pos=target;paint();schedule()}
  else{frame=requestAnimationFrame(tick);infoAnimation=panels[index].animate?.([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:360,easing:'cubic-bezier(.33,0,0,1)'})}
 }
 listen(rotation,'click',()=>{paused=!paused;schedule()});
 listen(stage,'pointerenter',ev=>{if(ev.pointerType==='mouse'){hoverStage=true;schedule()}});
 listen(stage,'pointerleave',()=>{hoverStage=false;schedule()});
 listen(root,'click',ev=>{
  if(performance.now()<suppressUntil&&ev.target.closest(attr('item'))){ev.preventDefault();return}
  if(ev.target.closest(attr('prev')))go(target-1);
  if(ev.target.closest(attr('next')))go(target+1);
  const button=ev.target.closest(attr('item')+','+attr('select'));if(button)go(Number(button.dataset[prefix+'Item']??button.dataset[prefix+'Select']));
 });
 listen(stage,'keydown',ev=>{
  if(ev.ctrlKey||ev.altKey||ev.metaKey||!['ArrowLeft','ArrowRight','Home','End'].includes(ev.key))return;ev.preventDefault();
  go(ev.key==='Home'?0:ev.key==='End'?count-1:target+(ev.key==='ArrowRight'?1:-1));
 });
 listen(stage,'pointerdown',ev=>{if(ev.button!==0||ev.isPrimary===false||ev.target.closest('.hs-arrows,.gf-arrows,.showroom-playback')||count<2)return;drag={id:ev.pointerId,x:ev.clientX,y:ev.clientY};stop()});
 listen(document,'pointerup',ev=>{
  if(!drag||drag.id!==ev.pointerId)return;const dx=ev.clientX-drag.x,dy=ev.clientY-drag.y;drag=null;
  if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){suppressUntil=performance.now()+450;go(target+(dx<0?1:-1))}else schedule();
 });
 listen(document,'pointercancel',()=>{drag=null;schedule()});
 listen(root,'focusout',schedule);listen(document,'visibilitychange',schedule);listen(document,'close',schedule,{capture:true});
 if(options.pauseSummaryHover){listen(root,'pointerover',ev=>{if(ev.pointerType==='mouse'&&ev.target.closest('.gf-details')){hoverDetails=true;stop()}});listen(root,'pointerout',ev=>{if(hoverDetails&&!ev.relatedTarget?.closest?.('.gf-details')){hoverDetails=false;schedule()}})}
 listen(reduce,'change',()=>{drag=null;cancelAnimationFrame(frame);frame=0;infoAnimation?.cancel();pos=target;paint();schedule()});
 const size=new ResizeObserver(paint);size.observe(stage);
 const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;schedule()},{threshold:.15});observer.observe(stage);
 root.querySelectorAll(attr('prev')+','+attr('next')).forEach(b=>b.disabled=count<2);
 sync(false);paint();schedule();
 return ()=>{disposed=true;abort.abort();stop();cancelAnimationFrame(frame);infoAnimation?.cancel();size.disconnect();observer.disconnect();rotation.remove()};
}
