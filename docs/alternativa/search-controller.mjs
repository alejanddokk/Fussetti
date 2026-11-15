import {pageZoom} from './interface-scale.mjs';
import {cleanQuery,readSearchHistory,rememberSearch,removeSearchHistory,SEARCH_HISTORY_KEY,searchUrl} from './search-model.mjs';
import {suggestionsView,searchCartSummary} from './search-views.mjs?v=20261104-cartlist1';
export function bindSmartSearch(root,s,{onProductAction,onError}={}){
 const wrap=root.querySelector('[data-smart-search]');if(!wrap)return ()=>{};
 const form=wrap.querySelector('#search'),input=form.querySelector('input'),dialog=wrap.querySelector('dialog'),mobileForm=dialog.querySelector('form'),mobileInput=mobileForm.querySelector('input'),content=dialog.querySelector('[data-search-content]'),status=dialog.querySelector('.smart-search-status'),media=matchMedia('(max-width:700px)'),abort=new AbortController();
 const reduce=matchMedia('(prefers-reduced-motion:reduce)');let revealFrame=0;
 const on=(node,event,fn)=>node?.addEventListener(event,fn,{signal:abort.signal});
 let query=input.value,category=wrap.dataset.scope||'',context=wrap.dataset.context||'',active=-1,timer,renderedQuery='',closing=false,disposed=false;
 const currentInput=()=>dialog.open&&dialog.dataset.mobile==='true'?mobileInput:input;
 function geometry(){
  if(!dialog.open)return;
  if(dialog.dataset.mobile==='true'){dialog.style.setProperty('--search-vh',(window.visualViewport?.height||innerHeight)+'px');return}
  const rect=form.getBoundingClientRect(),width=Math.min(Math.max(rect.width,430),innerWidth-32),left=Math.max(16,Math.min(rect.left,innerWidth-width-16));
  const zoom=pageZoom();dialog.style.left=left/zoom+'px';dialog.style.top=Math.max(8,rect.bottom+9)/zoom+'px';dialog.style.width=width/zoom+'px';dialog.style.maxHeight=Math.max(150,innerHeight-Math.max(8,rect.bottom+9)-14)/zoom+'px';
 }
 function expanded(open){input.setAttribute('aria-expanded',String(open));mobileInput.setAttribute('aria-expanded',String(open));if(!open){input.removeAttribute('aria-activedescendant');mobileInput.removeAttribute('aria-activedescendant')}}
 function draw(){
  if(disposed)return;active=-1;renderedQuery=query;timer=null;if(input.value!==query)input.value=query;if(mobileInput.value!==query)mobileInput.value=query;
  wrap.querySelectorAll('[data-search-clear]').forEach(b=>b.hidden=!query);
  const details=dialog.querySelector('[data-search-cart-details]'),cartOpen=details?.open,cartScroll=details?.querySelector('.smart-search-cart-products')?.scrollTop||0;const result=suggestionsView(s,query,{category,context,history:readSearchHistory(localStorage)});content.innerHTML=result.html;dialog.querySelector('[data-search-cart]').innerHTML=searchCartSummary(s);const updated=dialog.querySelector('[data-search-cart-details]');if(updated&&cartOpen){updated.open=true;updated.querySelector('.smart-search-cart-products').scrollTop=cartScroll}
  input.removeAttribute('aria-activedescendant');mobileInput.removeAttribute('aria-activedescendant');status.textContent=query.length>=2?result.count+(result.count===1?' resultado para ':' resultados para ')+query:'';geometry();
 }
 function close({restore=true}={}){
  cancelAnimationFrame(revealFrame);revealFrame=0;dialog.removeAttribute('data-revealing');clearTimeout(timer);closing=true;expanded(false);document.body.classList.remove('smart-search-open');if(dialog.open)dialog.close();if(restore)input.focus({preventScroll:true});else input.blur();
  queueMicrotask(()=>{closing=false});
 }
 function reveal(){
  if(media.matches)return;
  const rect=form.getBoundingClientRect(),zoom=pageZoom(),desired=Math.min(600*zoom,(dialog.scrollHeight+20)*zoom),available=innerHeight-rect.bottom-24;
  if(available>=desired)return;
  const start=scrollY,target=Math.min(Math.max(0,document.documentElement.scrollHeight-innerHeight),Math.max(0,start+rect.top-18)),distance=target-start;
  if(Math.abs(distance)<2)return;
  if(reduce.matches){window.scrollTo({top:target,behavior:'instant'});geometry();return}
  dialog.setAttribute('data-revealing','');const began=performance.now();
  const tick=now=>{if(disposed||!dialog.open)return;const t=Math.min(1,(now-began)/420);window.scrollTo({top:start+distance*(1-Math.pow(1-t,3)),behavior:'instant'});geometry();if(t<1)revealFrame=requestAnimationFrame(tick);else{revealFrame=0;dialog.removeAttribute('data-revealing')}};
  revealFrame=requestAnimationFrame(tick);
 }
 function open(){
  if(closing||disposed)return;
  if(dialog.open)return;
  const mobile=media.matches;dialog.dataset.mobile=String(mobile);dialog.removeAttribute('style');draw();document.body.classList.add('smart-search-open');expanded(true);
  if(mobile){dialog.showModal();mobileInput.value=query;mobileInput.focus({preventScroll:true})}else{dialog.show();input.focus({preventScroll:true})}
  dialog.scrollTop=0;geometry();reveal();
 }
 function submit(){rememberSearch(localStorage,query,category);const href=searchUrl(query,{category,context});close({restore:false});if(location.hash===href){window.dispatchEvent(new Event('alternative-update'))}else location.hash=href}
 function resume(snapshot){if(disposed||snapshot.hash!==location.hash)return;closing=false;query=snapshot.query;category=snapshot.category;context=snapshot.context;open();dialog.scrollTop=snapshot.scrollTop||0;currentInput().focus({preventScroll:true});const details=dialog.querySelector('[data-search-cart-details]');if(details&&snapshot.cartOpen){details.open=true;details.querySelector('.smart-search-cart-products').scrollTop=snapshot.cartScroll||0}const row=[...content.querySelectorAll('[data-search-option]')].find(r=>r.querySelector('[data-search-product]')?.dataset.searchProduct===snapshot.product);if(row){active=Number(row.dataset.searchOption);row.setAttribute('aria-selected','true');currentInput().setAttribute('aria-activedescendant',row.id)}const cartRow=snapshot.inCart?[...dialog.querySelectorAll('[data-cart-line]')].find(r=>r.dataset.cartLine===snapshot.product):null,targetRow=snapshot.inCart?cartRow:row;if(['decrease','remove','increment'].includes(snapshot.action)&&targetRow){const target=[...targetRow.querySelectorAll('[data-search-commerce]:not(:disabled)')].find(b=>b.dataset.searchCommerce===(snapshot.action==='increment'?'add':snapshot.action))||targetRow.querySelector('[data-search-commerce]:not(:disabled)');target?.focus({preventScroll:true})}else if(snapshot.inCart&&details)details.querySelector('summary')?.focus({preventScroll:true})}
 on(form,'submit',ev=>{ev.preventDefault();query=cleanQuery(input.value);submit()});on(mobileForm,'submit',ev=>{ev.preventDefault();query=cleanQuery(mobileInput.value);submit()});
 on(input,'focus',open);on(input,'click',open);
 for(const field of [input,mobileInput]){
  on(field,'input',ev=>{query=field.value.slice(0,100);active=-1;field.removeAttribute('aria-activedescendant');if(ev.isComposing)return;if(!dialog.open)open();clearTimeout(timer);timer=setTimeout(draw,90)});
  on(field,'compositionend',()=>{query=field.value.slice(0,100);draw()});
  on(field,'keydown',ev=>{
   if(ev.isComposing)return;
   if(ev.key==='Escape'){ev.preventDefault();ev.stopPropagation();close();return}
   if(['ArrowDown','ArrowUp'].includes(ev.key)){
    ev.preventDefault();if(!dialog.open)open();clearTimeout(timer);if(renderedQuery!==query)draw()
    const options=[...content.querySelectorAll('[data-search-option]')];if(!options.length)return;
    active=active<0?(ev.key==='ArrowDown'?0:options.length-1):(active+(ev.key==='ArrowDown'?1:-1)+options.length)%options.length;options.forEach((a,i)=>a.setAttribute('aria-selected',String(i===active)));field.setAttribute('aria-activedescendant',options[active].id);options[active].scrollIntoView({block:'nearest'});return;
   }
   if(ev.key==='Tab'&&!ev.shiftKey&&active>=0){const row=content.querySelectorAll('[data-search-option]')[active],target=row?.querySelector('[data-search-commerce]:not(:disabled)');if(target){ev.preventDefault();target.focus();return}}
   if(ev.key==='Enter'&&active>=0){ev.preventDefault();content.querySelectorAll('[data-search-option]')[active]?.querySelector('a[href]')?.click()}
  });
 }
 on(wrap,'click',ev=>{
  const purchase=ev.target.closest('[data-search-commerce]');if(purchase){ev.preventDefault();if(purchase.disabled||!onProductAction)return;const cart=dialog.querySelector('[data-search-cart-details]'),snapshot={query,category,context,scrollTop:dialog.scrollTop,hash:location.hash,product:purchase.dataset.searchProduct,inCart:!!purchase.closest('[data-cart-line]'),cartOpen:!!cart?.open,cartScroll:cart?.querySelector('.smart-search-cart-products')?.scrollTop||0,action:purchase.classList.contains('smart-search-qty-button')&&purchase.dataset.searchCommerce==='add'?'increment':purchase.dataset.searchCommerce};rememberSearch(localStorage,query,category);close({restore:false});try{onProductAction(purchase.dataset.searchCommerce,purchase.dataset.searchProduct,purchase.dataset.searchNext,snapshot)}catch(error){resume(snapshot);status.textContent=error.message;onError?.(error)}return}
  const clear=ev.target.closest('[data-search-clear]');if(clear){query='';draw();if(!dialog.open)open();currentInput().focus({preventScroll:true});return}
  if(ev.target.closest('[data-search-close]')){close({restore:false});return}
  const scope=ev.target.closest('[data-search-scope]');if(scope){category=scope.dataset.searchScope;draw();currentInput().focus({preventScroll:true});return}
  const idea=ev.target.closest('[data-search-idea]');if(idea){query=idea.dataset.searchIdea;draw();currentInput().focus({preventScroll:true});return}
  const recent=ev.target.closest('[data-search-recent]');if(recent){const row=readSearchHistory(localStorage)[Number(recent.dataset.searchRecent)];if(row){query=row.query;category=row.category;if(category)context=category;draw();currentInput().focus({preventScroll:true})}return}
  const remove=ev.target.closest('[data-search-history-remove]');if(remove){removeSearchHistory(localStorage,Number(remove.dataset.searchHistoryRemove));draw();currentInput().focus({preventScroll:true});return}
  if(ev.target.closest('[data-search-history-clear]')){try{localStorage.removeItem(SEARCH_HISTORY_KEY)}catch{}draw();currentInput().focus({preventScroll:true});return}
  if(dialog.open&&ev.target.closest('a[href]')){rememberSearch(localStorage,query,category);close({restore:false})}
 });
 on(document,'pointerdown',ev=>{if(dialog.open&&dialog.dataset.mobile!=='true'&&!wrap.contains(ev.target))close({restore:false})});
 on(document,'focusin',ev=>{if(dialog.open&&dialog.dataset.mobile!=='true'&&!wrap.contains(ev.target))close({restore:false})});
 on(dialog,'cancel',()=>{closing=true;expanded(false);document.body.classList.remove('smart-search-open');queueMicrotask(()=>closing=false)});
 on(dialog,'close',()=>{if(!dialog.open){expanded(false);document.body.classList.remove('smart-search-open')}});
 on(dialog,'keydown',ev=>{if(ev.key==='Escape'&&!ev.target.matches('input')){ev.preventDefault();ev.stopPropagation();close()}});
 on(window,'resize',geometry);on(window,'scroll',geometry);on(window.visualViewport,'resize',geometry);
 on(media,'change',()=>{if(dialog.open){close({restore:false});open()}});
 const dispose=()=>{disposed=true;cancelAnimationFrame(revealFrame);clearTimeout(timer);abort.abort();document.body.classList.remove('smart-search-open');if(dialog.open)dialog.close()};dispose.resume=resume;return dispose;
}
