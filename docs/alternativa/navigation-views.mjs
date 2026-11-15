import {pageZoom} from './interface-scale.mjs';
import {searchHeaderView} from './search-views.mjs';
import {sectors,sectorForCategory,sectorHref} from './sector-model.mjs';
import {productPhoto} from './product-media.mjs';
import {servicesTrigger,servicesMenu,bindServices} from './services-menu.mjs?v=20261105-reveal1';
import {e,icon} from '../nueva/ui.mjs';
import {profile,money,unitPrice} from './domain.mjs';
import {typeCategories} from './knowledge.mjs';
import {departments,departmentTypes,catalogueUrl,availableSelection} from './discovery-model.mjs';
import {productLabel} from './horizonx-ui.mjs';


// Font Awesome Free motorcycle (CC BY 4.0); original and licence in vendor/fontawesome.
const navigationIcon=(name,size=20)=>name==='bike'?`<svg width="${size}" height="${size*.8}" fill="currentColor" aria-hidden="true" focusable="false" viewBox="0 0 640 512"><!--! Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. --><path d="M280 32c-13.3 0-24 10.7-24 24s10.7 24 24 24l57.7 0 16.4 30.3L256 192l-45.3-45.3c-12-12-28.3-18.7-45.3-18.7L64 128c-17.7 0-32 14.3-32 32l0 32 96 0c88.4 0 160 71.6 160 160c0 11-1.1 21.7-3.2 32l70.4 0c-2.1-10.3-3.2-21-3.2-32c0-52.2 25-98.6 63.7-127.8l15.4 28.6C402.4 276.3 384 312 384 352c0 70.7 57.3 128 128 128s128-57.3 128-128s-57.3-128-128-128c-13.5 0-26.5 2.1-38.7 6L418.2 128l61.8 0c17.7 0 32-14.3 32-32l0-32c0-17.7-14.3-32-32-32l-20.4 0c-7.5 0-14.7 2.6-20.5 7.4L391.7 78.9l-14-26c-7-12.9-20.5-21-35.2-21L280 32zM462.7 311.2l28.2 52.2c6.3 11.7 20.9 16 32.5 9.7s16-20.9 9.7-32.5l-28.2-52.2c2.3-.3 4.7-.4 7.1-.4c35.3 0 64 28.7 64 64s-28.7 64-64 64s-64-28.7-64-64c0-15.5 5.5-29.7 14.7-40.8zM187.3 376c-9.5 23.5-32.5 40-59.3 40c-35.3 0-64-28.7-64-64s28.7-64 64-64c26.9 0 49.9 16.5 59.3 40l66.4 0C242.5 268.8 190.5 224 128 224C57.3 224 0 281.3 0 352s57.3 128 128 128c62.5 0 114.5-44.8 125.8-104l-66.4 0zM128 384a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>`:icon(name,size);

const navLink=(text,url,active=false,cls='')=>`<a href="${e(url)}" class="${cls}" ${url==='#cuenta'?'aria-label="Mi cuenta"':url==='#favoritos'?'aria-label="Mis favoritos"':''} ${active?'aria-current="page"':''}>${text}</a>`;
export function navigationPanel(s,category){
 const sector=sectorForCategory(category);
 if(sector)return `<div class="navigation-panel-copy"><p class="eyebrow">${e(sector.hook.toUpperCase())}</p><h3 tabindex="-1">${sector.title}</h3><p>${sector.count} productos con fichas, precios y detalles oficiales. Explorá las selecciones o empezá por una guía.</p><div class="navigation-types">${sector.collections.map(c=>navLink(c.title+' '+icon('arrow',16),sectorHref(sector.key,c.id))).join('')}</div><div class="navigation-panel-actions">${navLink('Descubrir '+sector.title+' '+icon('arrow',17),'#'+sector.key,false,'button')}${navLink('Ver los '+sector.count+' productos',sectorHref(sector.key),false,'text-link')}${navLink('Ayudame a elegir','#guia?cat='+encodeURIComponent(sector.category),false,'text-link')}</div></div>`;
 if(category==='Hogar')return `<div class="navigation-panel-copy"><p class="eyebrow">TU CASA, MÁS VOS</p><h3 tabindex="-1">Hogar</h3><p>Muebles, cocina, descanso y jardín. Encontrá ideas y productos para renovar tu casa.</p><div class="navigation-types">${[['muebles','Muebles y espacios'],['cocina','Cocina y mesa'],['descanso','Descanso y baño'],['patio','Patio y aire libre'],['mates','Termos y mates'],['herramientas','Herramientas y jardín']].map(([id,label])=>navLink(label+' '+icon('arrow',16),'#catalogo?cat=Hogar&lista=1&coleccion='+id)).join('')}</div><div class="navigation-panel-actions">${navLink('Descubrir Hogar '+icon('arrow',17),'#hogar',false,'button')}${navLink('Ver los 249 productos','#catalogo?cat=Hogar&lista=1',false,'text-link')}</div></div>`;
 const counts={'Hogar':249,'Tecnología':46,'Electrodomésticos':241,'TV y audio':53};
 if(counts[category])return `<div class="navigation-panel-copy"><p class="eyebrow">CATÁLOGO OFICIAL RELEVADO</p><h3 tabindex="-1">${e(category)}</h3><p>${counts[category]} productos con precios, fotos, descripciones y especificaciones publicadas.</p><div class="navigation-panel-actions"><a class="button" href="#catalogo?cat=${encodeURIComponent(category)}">Ver los ${counts[category]} productos →</a><a class="text-link" href="#guia?cat=${encodeURIComponent(category)}">Ayudame a elegir →</a></div></div>`;

 const d=departments.find(d=>d.name===category)||departments[0],p=availableSelection(s,d.type);
 return `<div class="navigation-panel-copy"><p class="eyebrow">ENCONTRÁ LO QUE BUSCÁS</p><h3 tabindex="-1">${d.name}</h3><p>${d.description}</p><div class="navigation-types">${departmentTypes(d.name).map(([id,t])=>navLink(t.name+' '+icon('arrow',16),'#catalogo?tipo='+id+'&cat='+encodeURIComponent(d.name))).join('')}</div><div class="navigation-panel-actions">${navLink('Ver todo '+d.name+' '+icon('arrow',17),catalogueUrl(d.name),false,'button')}${navLink('Ayudame a elegir','#guia?cat='+encodeURIComponent(d.name),false,'discovery-text-link')}</div></div>${p?`<a class="navigation-pick" href="#producto/${encodeURIComponent(p.id)}"><span>UNA IDEA PARA EMPEZAR</span><img src="${e(productPhoto(p))}" alt="${e(p.name)}"><b>${e(productLabel(p).name)}</b><strong>${money(unitPrice(s,p))}</strong><small>Precio demo · Ver ficha ${icon('arrow',15)}</small></a>`:''}`;
}
export function navigationView(s,r){
 const page=r.path[0],category=r.q.get('cat')||typeCategories[r.q.get('tipo')]||sectors[page]?.category||'',offers=r.q.has('ofertas'),count=s.cart.reduce((a,b)=>a+b.qty,0);
 return `<div class="demo-bar"><span><span class="demo-brand">FUSSETTI LAB </span><b>Modo demostración</b><span class="demo-description"> · precios, stock y operaciones de prueba</span></span><div><a href="https://fussetti-replica-20261102.germanvives15.chatgpt.site/nueva/" aria-label="Comparar con la versión nueva"><span class="demo-compare-long">Comparar con /nueva/ ↗</span><span class="demo-compare-short">Comparar ↗</span></a><a href="./admin/">Panel demo ↗</a></div></div><header class="site-header discovery-header"><div class="container masthead"><button class="navigation-mobile-toggle" data-navigation-open aria-haspopup="dialog" aria-expanded="false" aria-controls="discovery-menu" aria-label="Abrir categorías">${icon('grid',23)}</button><a class="brand" href="../" ${page==='inicio'?'aria-current="page"':''}><img src="https://fussetti-replica-20261102.germanvives15.chatgpt.site/assets/fb489145f77311a2.jpg" alt="Fussetti"><span>Elegir bien. Sentirte cerca.</span></a>${searchHeaderView(s,r)}<div class="navigation-account">${navLink(icon('heart',21)+'<span>Guardados</span>','#favoritos',page==='favoritos','head-icon')}${navLink(icon('user',22)+'<span>'+e(profile(s).name.split(' ')[0])+'</span>','#cuenta',page==='cuenta','head-icon')}${navLink(icon('cart',24)+'<span class="cart-count">'+count+'</span>','#carrito',page==='carrito','head-icon navigation-cart').replace('<a ','<a aria-label="Carrito, '+count+' productos" ')}</div></div><nav class="container main-nav" aria-label="Navegación principal"><button class="navigation-categories" data-navigation-open aria-haspopup="dialog" aria-controls="discovery-menu" aria-expanded="false">${icon('grid',17)} Categorías</button><div class="retail-section-links" aria-label="Secciones comerciales">${[['Hogar','hogar'],['Electrodomésticos','electrodomesticos'],['Tecnología','tecnologia'],['TV y audio','tv-audio']].map(([name,key])=>navLink(name,'#'+key,page===key||page==='catalogo'&&(category===name||sectorForCategory(category)?.key===key)&&!offers,'retail-section-link')).join('')}</div><div class="retail-specialties">${navLink(navigationIcon('bike',20)+' Motos',catalogueUrl('Motos'),page==='catalogo'&&category==='Motos'&&!offers)}${navLink('Repuestos',catalogueUrl('Repuestos'),page==='catalogo'&&category==='Repuestos'&&!offers)}${navLink(icon('bolt',16)+' CYBER FUSSETTI!','#cyber',page==='cyber','nav-offers')}</div><div class="mobile-category-row"><div class="mobile-category-scroll" id="mobile-category-scroll" data-mobile-category-scroll role="group" tabindex="0" aria-label="Secciones de la tienda; desplazá para ver más">${[['Hogar','hogar'],['Electrodomésticos','electrodomesticos'],['Tecnología','tecnologia'],['TV y audio','tv-audio']].map(([name,key])=>navLink(name,'#'+key,page===key||page==='catalogo'&&(category===name||sectorForCategory(category)?.key===key)&&!offers,'mobile-category-link')).join('')}${navLink(navigationIcon('bike',18)+' Motos',catalogueUrl('Motos'),page==='catalogo'&&category==='Motos'&&!offers,'mobile-category-link')}${navLink('Repuestos',catalogueUrl('Repuestos'),page==='catalogo'&&category==='Repuestos'&&!offers,'mobile-category-link')}${navLink(icon('bolt',15)+' CYBER FUSSETTI!','#cyber',page==='cyber','mobile-category-link')}</div><button type="button" class="mobile-category-more" data-mobile-category-more aria-controls="mobile-category-scroll" aria-label="Ver más secciones" title="Ver más secciones">${icon('arrow',18)}</button></div><span class="retail-nav-spacer"></span>${navLink('<span class="ihb-fill" aria-hidden="true"></span><span class="ihb-rest">Ayudame a elegir '+icon('arrow',16)+'</span><span class="ihb-swap" aria-hidden="true">Ayudame a elegir '+icon('arrow',16)+'</span>','#guia',page==='guia'||page==='resultados','nav-guide hx-action')}${servicesTrigger(page,'navigation-services')}</nav></header>
 <dialog id="discovery-menu" class="navigation-dialog" aria-labelledby="navigation-title"><div class="navigation-dialog-head"><div><button class="navigation-back" data-navigation-back hidden type="button">${icon('arrow',17)} Volver a categorías</button><p class="eyebrow">FUSSETTI · ENCONTRÁ TU PRÓXIMA ELECCIÓN</p><h2 id="navigation-title" tabindex="-1">Explorá las categorías</h2></div><button class="navigation-close" data-navigation-close aria-label="Cerrar categorías">${icon('close',23)}</button></div><div class="navigation-dialog-body"><nav class="navigation-departments" aria-label="Categorías de productos">${departments.map(d=>`<button data-nav-category="${e(d.name)}" aria-controls="navigation-panel" aria-pressed="${d.name===(departments.find(d=>d.name===category)?.name||'Hogar')}"><span>${navigationIcon(d.icon,20)} ${d.name}</span>${icon('arrow',17)}</button>`).join('')}</nav><div class="navigation-panel" id="navigation-panel" aria-live="polite">${navigationPanel(s,category)}</div></div><nav class="navigation-dialog-foot" aria-label="Explorar y recibir ayuda">${navLink('Todo el catálogo '+icon('arrow',16),'#catalogo')}${navLink('Comparar productos','#comparar')}${navLink('CYBER FUSSETTI!','#cyber',page==='cyber','navigation-mobile-cyber')}${servicesTrigger(page)}</nav></dialog>${servicesMenu(s,page)}`;
}

// Reserve the panel's measured height, rather than a fixed minimum below the header.
export function navigationRevealTarget({viewportHeight,menuHeight,headerBottom,headerHeight,scrollTop}){
 if(headerBottom+menuHeight+12<=viewportHeight)return scrollTop;
 const top=Math.min(headerHeight,Math.max(8,viewportHeight-menuHeight-12));
 return Math.max(0,scrollTop+headerBottom-top);
}

// HorizonX Curtain Menu reveal, adapted to an anchored desktop panel and mobile drill-down.
// Native dialog retains Escape, focus containment and restoration to the trigger.
export function bindNavigation(root,s){
 const disposeServices=bindServices(root);
 const dialog=root.querySelector('#discovery-menu'),triggers=[...root.querySelectorAll('[data-navigation-open]')];
 if(!dialog)return disposeServices;
 const abort=new AbortController(),mobile=matchMedia('(max-width:800px)'),reduce=matchMedia('(prefers-reduced-motion:reduce)'),panel=dialog.querySelector('#navigation-panel'),list=dialog.querySelector('.navigation-departments'),foot=dialog.querySelector('.navigation-dialog-foot'),back=dialog.querySelector('[data-navigation-back]'),title=dialog.querySelector('#navigation-title'),buttons=[...list.querySelectorAll('[data-nav-category]')];
 let selected=buttons.find(b=>b.getAttribute('aria-pressed')==='true')?.dataset.navCategory||'Hogar',detail=false,opener=null,opening=false,cancelScroll=null;
 const listen=(node,type,fn)=>node.addEventListener(type,fn,{signal:abort.signal});
 const categoryStrip=root.querySelector('[data-mobile-category-scroll]'),categoryMore=root.querySelector('[data-mobile-category-more]');
 if(categoryStrip&&categoryMore){
  const updateStrip=()=>{const end=categoryStrip.scrollLeft+categoryStrip.clientWidth>=categoryStrip.scrollWidth-2;categoryMore.classList.toggle('is-end',end);categoryMore.setAttribute('aria-label',end?'Volver al inicio de secciones':'Ver más secciones');categoryMore.title=end?'Volver al inicio de secciones':'Ver más secciones';categoryMore.disabled=categoryStrip.scrollWidth<=categoryStrip.clientWidth+1};
  listen(categoryMore,'click',()=>{const end=categoryStrip.scrollLeft+categoryStrip.clientWidth>=categoryStrip.scrollWidth-2;categoryStrip.scrollTo({left:end?0:categoryStrip.scrollLeft+categoryStrip.clientWidth*.8,behavior:reduce.matches?'instant':'smooth'})});
  listen(categoryStrip,'scroll',updateStrip);listen(window,'resize',updateStrip);
  if(mobile.matches){const active=categoryStrip.querySelector('[aria-current="page"]');if(active&&active.offsetLeft+active.offsetWidth>categoryStrip.clientWidth)categoryStrip.scrollLeft=active.offsetLeft}
  updateStrip();
 }
 function revealTarget(){
  let menuHeight;
  if(dialog.open)menuHeight=(dialog.scrollHeight+dialog.offsetHeight-dialog.clientHeight)*pageZoom();
  else{dialog.setAttribute('data-measuring','');menuHeight=dialog.getBoundingClientRect().height;dialog.removeAttribute('data-measuring')}
  const header=root.querySelector('.discovery-header').getBoundingClientRect();
  return navigationRevealTarget({viewportHeight:innerHeight,menuHeight,headerBottom:header.bottom,headerHeight:header.height,scrollTop:scrollY});
 }
 function scrollForMenu(target){
  const start=scrollY,distance=target-start;
  if(reduce.matches||Math.abs(distance)<1){window.scrollTo({top:target,behavior:'instant'});return Promise.resolve(true)}
  return new Promise(resolve=>{
   const began=performance.now();let frame;
   cancelScroll=()=>{cancelAnimationFrame(frame);cancelScroll=null;resolve(false)};
   const tick=now=>{const t=Math.min(1,(now-began)/420);window.scrollTo({top:start+distance*(1-Math.pow(1-t,3)),behavior:'instant'});if(t<1)frame=requestAnimationFrame(tick);else{cancelScroll=null;resolve(true)}};
   frame=requestAnimationFrame(tick);
  });
 }
 function stopOpening(){cancelScroll?.();opening=false;triggers.forEach(b=>b.removeAttribute('aria-busy'))}
 function layout(){
  list.hidden=mobile.matches&&detail;panel.hidden=mobile.matches&&!detail;panel.inert=panel.hidden;back.hidden=!mobile.matches||!detail;foot.hidden=mobile.matches&&detail;
  title.textContent=mobile.matches&&detail?selected:'Explorá las categorías';panel.querySelector('h3').hidden=mobile.matches;
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.navCategory===selected&&(!mobile.matches||detail))));
  if(!mobile.matches&&dialog.open){
   const target=revealTarget();if(Math.abs(scrollY-target)>1)window.scrollTo({top:target,behavior:'instant'});
   dialog.style.setProperty('--navigation-top',Math.max(8,root.querySelector('.discovery-header').getBoundingClientRect().bottom)/pageZoom()+'px');
  }
 }
 triggers.forEach(b=>listen(b,'click',async()=>{
  if(dialog.open||opening)return;
  opener=b;detail=false;layout();opening=true;b.setAttribute('aria-busy','true');
  const ready=mobile.matches||await scrollForMenu(revealTarget());
  if(!ready||!opening||abort.signal.aborted){stopOpening();return}
  opening=false;b.removeAttribute('aria-busy');dialog.scrollTop=0;dialog.showModal();triggers.forEach(t=>t.setAttribute('aria-expanded','true'));layout();
  (mobile.matches?buttons[0]:buttons.find(t=>t.dataset.navCategory===selected))?.focus({preventScroll:true});
 }));
 listen(dialog.querySelector('[data-navigation-close]'),'click',()=>dialog.close());
 listen(dialog,'close',()=>{triggers.forEach(b=>b.setAttribute('aria-expanded','false'));if(!root.querySelector('#services-menu')?.open)opener?.focus({preventScroll:true})});
 listen(dialog,'click',ev=>{
  if(ev.target===dialog){const r=dialog.getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)dialog.close()}
  if(ev.target.closest('a[href]'))dialog.close();
 });
 buttons.forEach(b=>listen(b,'click',()=>{selected=b.dataset.navCategory;panel.innerHTML=navigationPanel(s,selected);detail=true;layout();if(mobile.matches){dialog.scrollTop=0;title.focus({preventScroll:true})}}));
 listen(back,'click',()=>{detail=false;layout();dialog.scrollTop=0;buttons.find(b=>b.dataset.navCategory===selected)?.focus({preventScroll:true})});
 listen(window,'keydown',ev=>{if(opening&&ev.key==='Escape'){ev.preventDefault();stopOpening()}});
 listen(window,'wheel',()=>{if(opening)stopOpening()});listen(window,'touchstart',()=>{if(opening)stopOpening()});
 listen(window,'resize',()=>{if(opening)stopOpening();if(dialog.open)layout()});
 listen(mobile,'change',()=>{if(dialog.open){layout();if(mobile.matches&&!detail)buttons.find(b=>b.dataset.navCategory===selected)?.focus({preventScroll:true});else if(mobile.matches)title.focus({preventScroll:true});else panel.querySelector('h3')?.focus({preventScroll:true})}});
 layout();
 return ()=>{stopOpening();abort.abort();if(dialog.open)dialog.close();disposeServices()};
}
