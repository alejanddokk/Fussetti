import {selectedMotoModel,rememberMotoModel} from './moto-presentation.mjs';
import {followMotoThumbnail} from './moto-thumbnails.mjs';
/* HorizonX Fold Carousel spring integration and Glass Exit Carousel timing.
   Original HorizonX code. HorizonX Tools License. Original exports retained in
   references/horizonx. Adapted to native HTML/WAAPI with local product photos. */
export const wrapMoto=(value,n)=>n?((value%n)+n)%n:0;
export function springStep(pos,vel,target,dt,omega){
 const x=pos-target,e=Math.exp(-omega*dt),c=vel+omega*x;
 let p=target+(x+c*dt)*e,v=(vel-omega*c*dt)*e;
 if(Math.abs(p-target)<1e-4&&Math.abs(v)<1e-3){p=target;v=0}return [p,v];
}
export const flingTarget=(pos,velocity)=>Math.round(pos+Math.max(-0.6,Math.min(0.599999,velocity*0.119999)));
export const MOTO_INTERVAL=7800;
// Sample Fold's critically damped spring into compositor-only keyframes.
export function motoEntranceFrames(direction=1,distance=90){
 let p=0,v=0;const frames=[];
 for(let i=0;i<=30;i++){
  if(i)[p,v]=springStep(p,v,1,.78/30,12);
  if(i===30)p=1;
  const rest=1-p;
  frames.push({offset:i/30,opacity:Math.min(1,p*2.4),transform:`translate3d(${direction*distance*rest}px,${10*rest}px,0) rotateY(${direction*3*rest}deg) scale(${1-.035*rest})`});
 }
 return frames;
}
// Glass Exit's fast attack / long settle curve, without its optical distortion.
const EXIT_EASE='cubic-bezier(.360001,0,.120001,1)';
export function bindMotoCarousel(root){
 const carousel=root.querySelector('.moto-carousel');if(!carousel)return ()=>{};
 const stage=carousel.querySelector('.moto-carousel-window'),slides=[...carousel.querySelectorAll('[data-moto-slide]')],buttons=[...carousel.querySelectorAll('[data-moto-index]')];
 const rotation=carousel.querySelector('[data-moto-rotation]');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),count=slides.length;
 if(!count)return ()=>{};
 let index=Math.max(0,slides.findIndex(s=>s.dataset.motoSlide===selectedMotoModel())),timer=0,drag=null,hover=false,focused=false,visible=true,paused=false,disposed=false,suppressUntil=0;
 const cleanups=[],animations=new Set(),listen=(node,type,fn,opts)=>{node.addEventListener(type,fn,opts);cleanups.push(()=>node.removeEventListener(type,fn,opts))};
 const stop=()=>{clearTimeout(timer);timer=0};
 const animate=(node,frames,options)=>{
  if(reduced.matches||!node.animate)return;
  const a=node.animate(frames,options);animations.add(a);a.finished.then(()=>animations.delete(a),()=>animations.delete(a));return a;
 };
 const cancel=()=>{animations.forEach(a=>a.cancel());animations.clear();slides.forEach((s,i)=>{s.hidden=i!==index;s.querySelector('.moto-slide-visual').style.transform=''})};
 function schedule(){
  stop();const running=!paused&&!reduced.matches&&!hover&&!focused&&visible&&!document.hidden&&!document.querySelector('dialog[open]')&&!drag&&!disposed&&count>1;
  rotation.hidden=reduced.matches||count<2;rotation.textContent=paused?'Reanudar':'Pausar';
  carousel.dataset.autoplay=String(running);
  carousel.querySelector('.moto-carousel-count').setAttribute('aria-live',running?'off':'polite');
  if(running)timer=setTimeout(()=>show(index+1,false),MOTO_INTERVAL);
 }
 function sync(){
  rememberMotoModel(slides[index].dataset.motoSlide);carousel.dataset.activeIndex=String(index);
  slides.forEach((slide,i)=>{slide.inert=i!==index;slide.setAttribute('aria-hidden',String(i!==index));slide.dataset.active=String(i===index)});
  buttons.forEach((b,i)=>{if(i===index)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current')});
  followMotoThumbnail(buttons[index],reduced.matches);
  carousel.querySelector('[data-moto-counter]').textContent=String(index+1).padStart(2,'0');
  carousel.querySelector('[data-moto-name]').textContent=slides[index].querySelector('h2').textContent;
  carousel.querySelector('[data-moto-position]').style.width=`${(index+1)/count*100}%`;
  for(const n of [index,wrapMoto(index+1,count),wrapMoto(index-1,count)])slides[n].querySelector('.moto-slide-visual>img').loading='eager';
 }
 function entrance(slide,direction){
  animate(slide.querySelector('.moto-slide-visual'),motoEntranceFrames(direction,stage.clientWidth<800?45:90),{duration:780,easing:'linear'});
  [...slide.querySelector('.moto-slide-copy').children].forEach((node,i)=>animate(node,[{opacity:0,transform:'translate3d(0,20px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:560,delay:50+i*38,easing:EXIT_EASE,fill:'backwards'}));
 }
 function show(next,user=true){
  const target=wrapMoto(next,count);
  stop();cancel();
  slides.forEach(s=>{s.querySelector('.moto-slide-visual').style.transform='';s.hidden=true});
  const previous=index;index=target;sync();
  const current=slides[index];current.hidden=false;
  if(previous!==index&&!reduced.matches){
   let direction=wrapMoto(index-previous,count);if(direction>count/2)direction-=count;direction=Math.sign(direction)||1;
   const old=slides[previous];old.hidden=false;
   const distance=user?'36px':'100%';
   const duration=user?460:2400;
   const timing={duration,easing:user?EXIT_EASE:'cubic-bezier(.33,.12,.42,1)'};
   const exit=(direction>0?'-':'')+distance;
   const entry=(direction<0?'-':'')+distance;
   const out=animate(old,[{transform:'translateX(0)'},{transform:'translateX('+exit+')',opacity:user?0:1}],timing);
   out?.finished.then(()=>{if(index!==previous)old.hidden=true},()=>{});
   if(user)entrance(current,direction);
   else animate(current,[{transform:'translateX('+entry+')'},{transform:'translateX(0)'}],timing);
  }
  schedule();
 }
 listen(rotation,'click',()=>{paused=!paused;schedule()});
 listen(stage,'click',ev=>{if(ev.detail&&performance.now()<suppressUntil){ev.preventDefault();ev.stopPropagation()}},true);
 listen(carousel.querySelector('[data-moto-prev]'),'click',()=>show(index-1));
 listen(carousel.querySelector('[data-moto-next]'),'click',()=>show(index+1));
 buttons.forEach((b,i)=>listen(b,'click',()=>show(i)));
 listen(stage,'keydown',ev=>{
  if(['ArrowLeft','ArrowRight','Home','End','Escape'].includes(ev.key)){
   ev.preventDefault();if(ev.key==='Escape'){paused=true;schedule();return}
   show(ev.key==='Home'?0:ev.key==='End'?count-1:index+(ev.key==='ArrowRight'?1:-1));
  }
 });
 listen(stage,'pointerenter',ev=>{if(ev.pointerType==='mouse'){hover=true;schedule()}});
 listen(stage,'pointerleave',()=>{hover=false;schedule()});
 listen(carousel,'focusin',()=>{focused=document.activeElement!==rotation;schedule()});
 listen(carousel,'focusout',ev=>{focused=carousel.contains(ev.relatedTarget)&&ev.relatedTarget!==rotation;schedule()});
 listen(stage,'pointerdown',ev=>{
  if(drag||count<2||ev.button!==0||(ev.target.closest('a,button')&&!ev.target.closest('.moto-slide-visual')))return;
  drag={id:ev.pointerId,x:ev.clientX,y:ev.clientY,lastX:ev.clientX,lastT:performance.now(),velocity:0,moved:false,dx:0};stop();
 });
 listen(stage,'pointermove',ev=>{
  if(!drag||drag.id!==ev.pointerId)return;
  const dx=ev.clientX-drag.x,dy=ev.clientY-drag.y;
  if(!drag.moved){
   if(Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>12){drag=null;schedule();return}
   if(Math.abs(dx)<12)return;
   cancel();drag.moved=true;carousel.dataset.dragging='true';
   try{stage.setPointerCapture(ev.pointerId)}catch{}
  }
  const now=performance.now();drag.dx=dx;drag.velocity=(ev.clientX-drag.lastX)/Math.max(1,now-drag.lastT);drag.lastX=ev.clientX;drag.lastT=now;
  if(!reduced.matches)slides[index].querySelector('.moto-slide-visual').style.transform=`translate3d(${Math.max(-65,Math.min(65,dx*.25))}px,0,0)`;
  ev.preventDefault();
 });
 const end=ev=>{
  if(!drag||drag.id!==ev.pointerId)return;
  const d=drag;drag=null;delete carousel.dataset.dragging;if(d.moved)suppressUntil=performance.now()+450;
  if(d.moved&&(Math.abs(d.dx)>stage.clientWidth*.1||Math.abs(d.velocity)>.4))show(index+(d.dx<0?1:-1));
  else{const visual=slides[index].querySelector('.moto-slide-visual'),from=visual.style.transform;visual.style.transform='';if(from)animate(visual,[{transform:from},{transform:'translate3d(0,0,0)'}],{duration:350,easing:EXIT_EASE});schedule()}
  try{if(stage.hasPointerCapture(ev.pointerId))stage.releasePointerCapture(ev.pointerId)}catch{}
 };
 const abortDrag=ev=>{if(drag&&drag.id===ev.pointerId){drag.dx=0;drag.velocity=0;end(ev)}};
 listen(document,'pointerup',end);listen(document,'pointercancel',abortDrag);listen(stage,'lostpointercapture',ev=>{if(ev.target===stage)abortDrag(ev)});
 listen(document,'visibilitychange',schedule);listen(document,'close',schedule,true);
 listen(reduced,'change',()=>{cancel();const id=drag?.id;drag=null;delete carousel.dataset.dragging;try{if(id!==undefined&&stage.hasPointerCapture(id))stage.releasePointerCapture(id)}catch{}schedule()});
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule()},{threshold:.25});observer.observe(carousel);cleanups.push(()=>observer.disconnect());
 carousel.querySelectorAll('[data-moto-prev],[data-moto-next]').forEach(b=>b.disabled=count<2);
 slides.forEach((s,i)=>s.hidden=i!==index);sync();entrance(slides[index],1);schedule();
 return ()=>{disposed=true;stop();cancel();cleanups.forEach(f=>f())};
}
