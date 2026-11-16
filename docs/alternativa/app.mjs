import {revealRoute} from "./scene.mjs?v=vitrina1";
import {bindMobilePanels} from './mobile-panels.mjs';
let disposeMobilePanels=()=>{};
let partsScrollResults=false;
import {setPartsBike,partsBike,bikeLabel,partsQuery} from './repuestos-experiencia-model.mjs?v=20261106-busca1';
import {applyInterfaceScale} from './interface-scale.mjs';
import {bindTvShowcase} from './tv-audio-showcase.mjs';
import {bindTechShowcase} from './tecnologia-showcase.mjs';
import {bindHomeCategories} from './hogar-categorias.mjs';
import {bindMotoJourney} from './moto-journey.mjs?v=credit-options1';
import {bindGardenShowroom} from './garden-showroom.mjs';
import {bindSmartSearch} from './search-controller.mjs?v=20261105-reveal1';
import {searchResultsView,searchJourneyNotice} from './search-views.mjs?v=20261104-cartlist1';
import {cleanQuery,SEARCH_CATEGORIES} from './search-model.mjs';
import {bindLenders} from './moto-lenders.mjs?v=credit-options1';
import {sectorComboOptions} from './sector-combo-views.mjs';
import {addCombination} from './hogar-combinations.mjs';
import {bindCombinations} from './hogar-combo-motion.mjs';
import {bindHomeShowroom} from './hogar-showroom-motion.mjs?v=vitrina1';
import {sectorView} from './sector-views.mjs?v=20261104-tech1';
import {sectorForCategory} from './sector-model.mjs';
import {createMotoFinance} from './moto-finance.mjs?v=vitrina1';
import {hogarView,bindHogar} from './hogar-views.mjs?v=20261106-iconos1';
import {guideTypes} from './decision-model.mjs';
import {registerOfficial} from './official-commerce.mjs';
import {officialCatalogueView,officialDetailView,officialRecord,officialHasType,bindOfficialGallery} from './official-catalog.mjs';
import {cyberView} from './cyber-views.mjs';
import {focusView,bindMotoFocus} from './moto-focus.mjs?v=fotos2';
import {workshopView,officialServicesView,bindMaintenanceTabs} from './service-pages.mjs';
import {bindBranchGallery} from './branch-gallery.mjs';
import {branchesView,branchDetailView} from './branch-views.mjs';
import {branchInfo,branchQuery,branchesHref,selectBranch} from './branch-model.mjs';
import {campaignHeader,bindCampaign} from './campaign-carousel.mjs';
import {bindPartsCarousel} from './moto-parts.mjs?v=vitrina1';
import {motoHeader,motoFooter,isMotoExperience} from './moto-showroom.mjs?v=vitrina1';
import {cartView,checkoutView,purchaseOrderView} from './checkout-views.mjs?v=20261106-mobile3';
import {checkoutDraft,changeCheckout,changeQuantity} from './checkout-model.mjs';
import {navigationView,bindNavigation} from './navigation-views.mjs?v=20261105-nav-movil2';
import {comparisonView,guideSummary} from './decision-views.mjs?v=20261106-resultados1';
import {comparisonRail} from './horizonx-ui.mjs';
import {quickView,cartAddedView,galleryView} from './product-views.mjs?v=20261106-ficha-movil1';
import {myProductsView,registerView,ownedProductView,accountCareView,careOrderPanel,careOrdersView,receiptsView,receiptView,receiptDownload,careContextPanel,savedCareContext} from './care-views.mjs';
import {assetFor,registerModel,saveAssetDetails,addMaintenance,addReminder,changeReminder,SUPPORT_TOPICS} from './care-domain.mjs';
import {productCard,homeView,catalogueView,guideView,fitReason,resultsView,detailView,answerDetails,compareSummary} from './commerce-views.mjs?v=20261106-resultados1';
import {questionPlan,newGuide,typeCategories} from './guide-plan.mjs';
import {state as s,save,replace as replaceState} from './state.mjs';
import {types,money,unitPrice,product,profile,event,toggleCompare,recommendations,add,quote,purchase,reserve,consult,setStatus,createCareExample} from './domain.mjs';
import {e,icon} from '../nueva/ui.mjs';
const app=document.querySelector('#app');
const motoFinance=createMotoFinance(s);
const motoShowroom=()=>focusView(s);
const campaignState={index:0,paused:false};let campaignController=null;
let differences=false,careDraft={},checkoutError='',cartError='',cartErrorId='',checkoutBusy=false;
const categories=['Electrodomésticos','Hogar','Tecnología','Climatización','TV y audio','Jardín','Motos','Repuestos'];
const link=(label,href,cls='button')=>`<a class="${cls}" href="${e(href)}">${label}</a>`;
const pHref=p=>'#producto/'+encodeURIComponent(p.id);
function route(){const [path,qs='']=(location.hash.slice(1)||'inicio').split('?');return {path:path.split('/').map(decodeURIComponent),q:new URLSearchParams(qs)}}
function toast(message,href='',label='Ver carrito'){const el=document.querySelector('#toast');el.innerHTML=e(message)+(href?` <a href="${e(href)}">${e(label)} →</a>`:'');el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),4500)}
function header(){return isMotoExperience(s,route())?motoHeader(s,route()):navigationView(s,route())}
function mobileSection(){const p=route().path[0];if(['guia','resultados','comparar'].includes(p))return 'guia';if(['carrito','checkout'].includes(p))return 'carrito';if(['cuenta','mimoto','favoritos','pedidos','pedido','consultas','mis-productos','mi-producto','agregar-producto','mis-comprobantes','comprobante'].includes(p))return 'cuenta';return p==='inicio'?'inicio':'catalogo'}
function footer(){if(isMotoExperience(s,route()))return motoFooter(s,route());return `<footer><div class="container footer-grid"><div class="footer-wordmark">Fussetti<span>Comprar es el comienzo.<br>Estamos para lo que sigue.</span></div><div><b>Encontrá lo que buscás</b><a href="#catalogo">Todo el catálogo</a><a href="#guia">Ayudame a elegir</a><a href="#comparar">Comparar productos</a><a href="#favoritos">Mis favoritos</a><a href="#mis-productos">Mis productos</a><a href="#mis-comprobantes">Mis comprobantes demo</a></div><div><b>Contá con nosotros</b><a href="#sucursales">Sucursales</a><a href="#taller">Taller oficial</a><a href="#services">Services Oficiales</a><a href="#financiacion">Financiación demo</a><a href="#consulta">Preparar una consulta demo</a></div><div><b>Fussetti Lab</b><a href="https://fussetti-replica-20261102.germanvives15.chatgpt.site/nueva/">Experiencia con beneficios ↗</a><a href="https://fussetti-replica-20261102.germanvives15.chatgpt.site/version-anterior/">Réplica anterior ↗</a><a href="./admin/">Administrar alternativa ↗</a><p>Datos guardados en este navegador.<br>Sin operaciones comerciales reales.</p></div></div><div class="container footer-bottom">Modo demostración · 589 productos del catálogo oficial y ${s.products.filter(p=>p.source!=='fussetti-official'&&p.source!=='fussetti-mercadolibre').length} modelos demo · ${s.products.filter(p=>p.source==='fussetti-mercadolibre').length} publicaciones de repuestos relevadas · Precios oficiales relevados al 4/11/2026; existencias, entrega y pedidos simulados.</div></footer><nav class="mobile-nav" aria-label="Navegación móvil">${[['home','Inicio','inicio'],['grid','Explorar','catalogo'],['settings','Elegir','guia'],['cart','Carrito','carrito'],['user','Cuenta','cuenta']].map(([i,n,h])=>`<a href="#${h}" ${mobileSection()===h?'aria-current="page"':''}>${icon(i,21)}<span>${n}</span></a>`).join('')}</nav>`}
const title=(eyebrow,heading,text='')=>`<div class="page-title"><p class="eyebrow">${eyebrow}</p><h1>${heading}</h1>${text?`<p>${text}</p>`:''}</div>`;
function card(p,why=''){return productCard(s,p,why)}
const grid=items=>`<div class="product-grid">${items.map(p=>card(p)).join('')}</div>`;
function home(){return homeView(s)}
function catalog(q){if(q.get('q')&&!q.get('cat')&&!q.get('tipo')&&!q.has('ofertas')&&!q.get('coleccion')&&!q.get('seleccion'))return searchResultsView(s,q);const sector=sectorForCategory(q.get('cat'));if(sector&&!['q','tipo','orden','pagina','lista','seleccion','coleccion','ofertas','sub'].some(k=>q.has(k)))return sectorView(s,sector.key);if(q.get('cat')==='Hogar'&&!['q','tipo','orden','pagina','lista','coleccion','ofertas','sub'].some(k=>q.has(k)))return hogarView(s);if(!q.has('ofertas')&&(officialHasType(q.get('tipo'))||!q.get('tipo')&&(!q.get('cat')||['Hogar','Tecnología','Electrodomésticos','TV y audio','TV y Audio','Jardín','Climatización'].includes(q.get('cat')))))return officialCatalogueView(s,q);return (q.get('cat')==='Motos'||q.get('tipo')==='motorcycle')&&!q.get('q')&&!q.has('ofertas')&&!q.get('orden')?motoShowroom():catalogueView(s,q)}
function empty(h,p=''){return `<div class="empty"><h2>${h}</h2><p>${p}</p>${link('Volver al catálogo','#catalogo','button outline')}${link('Preparar consulta','#consulta','text-link')}</div>`}
function guide(){return searchJourneyNotice(s.guide.searchContext)+guideView(s)}
function why(p){return fitReason(s,p)}
function resultPage(){return searchJourneyNotice(s.guide.searchContext)+resultsView(s)}
function comparePage(){return comparisonView(s,{differences})}
function detailPage(id){const p=product(s,id);return p?.source==='fussetti-official'?officialDetailView(s,p.official.id):detailView(s,id)}
function summary(q){return `<div class="summary"><p><span>Productos de referencia</span><b>${money(q.base)}</b></p><p><span>Descuentos de producto</span><b>−${money(q.discount)}</b></p><p><span>Entrega demo</span><b>${q.shipping?money(q.shipping):'Sin cargo'}</b></p><p class="total"><span>Total demo</span><b>${money(q.total)}</b></p></div>`}
function cartPage(){return cartView(s,{error:cartError,errorId:cartErrorId})}
function checkoutPage(){return checkoutView(s,{error:checkoutError})}
const branchOptions=id=>s.branches.map(b=>`<option value="${e(b.id)}" ${id===b.id?'selected':''}>${e(b.title)}</option>`).join('');
function reservePage(id){const p=product(s,id);if(!p||p.kind!=='motorcycle')return empty('Moto no encontrada.');return `<section class="container page">${title('TU PRÓXIMO CAMINO','Una moto. Muchas posibilidades.','Probá una reserva o solicitud de financiación sin pagos ni evaluación crediticia.')}<div class="detail-layout"><div class="detail-image"><img src="${e(p.image)}" alt="${e(p.name)}"></div><form id="reserve" class="panel" data-id="${e(p.id)}"><h2>${e(p.name)}</h2><p>Referencia demo: <b>${money(unitPrice(s,p))}</b></p><label>Quiero probar<select name="kind"><option value="reservation" ${route().q.get('kind')!=='finance'?'selected':''}>Reserva demo</option><option value="finance" ${route().q.get('kind')==='finance'?'selected':''}>Financiación demo</option></select></label><label>Sucursal<select name="branch">${branchOptions(s.shopping.branch)}</select></label><p>Perfil: ${e(profile(s).name)}. No ingreses DNI ni datos reales.</p><button class="button" ${!p.stock?'disabled':''}>Confirmar solicitud demo →</button></form></div></section>`}
function ordersPage(){return careOrdersView(s)}
function orderPage(id){const o=s.orders.find(o=>o.id===id&&o.user===s.user);if(!o)return empty('Pedido no encontrado.');if(o.kind==='purchase')return purchaseOrderView(s,o);return `<section class="container page">${title('OPERACIÓN SIMULADA','Tu elección quedó registrada.',e(o.id))}${careOrderPanel(s,o)}<div class="checkout-layout"><div class="panel"><span class="status">${e(o.status)}</span><h2>${o.kind==='purchase'?'Tu compra demo':o.kind==='finance'?'Tu solicitud de financiación demo':'Tu reserva demo'}</h2>${o.items.map(l=>`<p class="order-item"><span>${l.qty} × ${e(l.name)}</span><b>${money(l.unit*l.qty)}</b></p>`).join('')}<p>Sucursal: ${e(s.branches.find(b=>b.id===o.branch)?.title)}</p>${o.kind==='purchase'?`<p>${o.delivery==='envio'?'Envío de prueba':'Retiro en sucursal demo'} · ${o.payment==='transferencia-demo'?'Transferencia demo':'Tarjeta demo'}</p>`:''}${o.status!=='Cancelado'?`<button class="button outline" data-cancel="${e(o.id)}">Cancelar operación demo</button>`:''}${link('Mis pedidos','#pedidos','text-link')}</div><aside class="panel"><h2>Resumen</h2>${o.kind==='purchase'?summary(o.summary):'<p>No hubo cobro ni evaluación crediticia.</p>'}<p class="small-print">Podés cambiar el estado desde el panel de esta alternativa.</p></aside></div></section>`}
function accountPage(){return accountCareView(s)}
function favoritesPage(){const items=profile(s).favorites.map(id=>product(s,id)).filter(Boolean);return `<section class="container page">${title('GUARDADO PARA DESPUÉS','Tus favoritos.')}${items.length?grid(items):empty('Todavía no guardaste productos.')}</section>`}
function shoppingConsultContext(g,comparison,p,bike=null){return `${bike?`<p><b>Moto indicada:</b> ${e(bikeLabel(bike))} · compatibilidad pendiente de confirmar.</p>`:''}${answerDetails(s,g)}<p><b>Producto:</b> ${e(p?.name||'Consulta general')}</p><p><b>Guía:</b> ${e(types[g.type].name)} · ${e(g.use||'Sin uso preferido')}</p><p><b>Presupuesto:</b> ${g.budget===''?'Abierto':money(Number(g.budget)*100)}</p><p><b>Requisitos:</b> ${g.required.map(e).join(', ')||'Sin requisitos'}</p><p><b>Preferencias:</b> ${g.preferences.map(e).join(', ')||'Sin preferencias'}</p><p><b>Moto de la guía:</b> ${e(product(s,g.bike)?.name||'Sin modelo elegido')}</p><p><b>Comparación:</b> ${comparison.map(id=>e(product(s,id).name)).join(', ')||'Sin productos'}</p>`}
function consultPage(q){const careAsset=q.get('equipo')?assetFor(s,q.get('equipo')):null;if(q.get('equipo')&&!careAsset)return empty('Este producto no está disponible para el perfil actual.');const topic=Object.hasOwn(SUPPORT_TOPICS,q.get('tema'))?q.get('tema'):'producto',id=careAsset?.productId||q.get('producto')||'',p=product(s,id),reference=!p?String(q.get('modelo')||'').slice(0,120):'';return `<section class="container page">${title('UNA PERSONA DEL OTRO LADO','Prepará tu consulta.','Conservamos el contexto para que no tengas que empezar de nuevo.')}<div class="checkout-layout"><form class="panel" id="consult" data-id="${e(p?.id||'')}" data-asset="${e(careAsset?.id||'')}" data-topic="${e(topic)}" data-parts-context="${q.get('motos')==='1'||p?.kind==='repuesto'?'1':'0'}"><label>Sucursal<select name="branch">${branchOptions(s.shopping.branch)}</select></label><label>¿Qué querés consultar? Usá un ejemplo ficticio.<textarea name="message" rows="4" maxlength="1000" placeholder="Por ejemplo: quisiera confirmar accesorios y retiro.">${reference?e('Quisiera confirmar compatibilidad de repuestos para '+reference+'.'):''}</textarea></label><p class="notice">Esta consulta es simulada. No se envía a la sucursal ni genera mensajes externos.</p><button class="button">Guardar consulta demo →</button></form><aside class="panel"><h2>Tu contexto</h2>${reference?`<p>Modelo de referencia: <b>${e(reference)}</b>. Compatibilidad pendiente de confirmar.</p>`:''}${careAsset?careContextPanel(s,careAsset.id,topic):''}${careAsset?'':shoppingConsultContext(s.guide,s.compare,p,(q.get('motos')==='1'||p?.kind==='repuesto')?partsBike(s):null)}</aside></div></section>`}
function consultationsPage(){const items=s.consultations.filter(c=>c.user===s.user);return `<section class="container page">${title('CONTEXTO GUARDADO','Tus consultas demo.','Estos registros no fueron enviados a ninguna sucursal.')}${items.length?items.map(c=>`<article class="panel consultation"><b>${e(c.id)} · ${e(s.branches.find(b=>b.id===c.branch)?.title)}</b>${savedCareContext(c.care)}<p>${e(c.message||'Sin mensaje adicional.')}</p>${c.care?'':shoppingConsultContext(c.guide,c.compare,product(s,c.productId),c.partsBike)}</article>`).join(''):empty('Todavía no preparaste consultas.')}</section>`}
function branchesPage(){return branchesView(s,route().q)}
function branchPage(id){return branchDetailView(s,id,route().q)}
function workshopPage(){return workshopView(s,route().q)}
function servicesPage(){return officialServicesView(s,route().q)}
function financingPage(){return `<section class="container page">${title('UNA ELECCIÓN QUE TE CIERRE','Financiación, con claridad.','En este prototipo podés recorrer una solicitud de financiación de moto usando un perfil ficticio.')}<div class="panel"><h2>Empezá por la moto que querés.</h2><p>Podés comparar precios demo y elegir una sucursal. No pedimos DNI, ingresos ni datos crediticios, y no se evalúa ni se envía una solicitud real.</p>${link('Explorar motos','#catalogo?cat=Motos')}${link('Necesito orientación','#guia','text-link')}</div></section>`}
function currentPage(){const {path:[page,id],q}=route();switch(page){case 'inicio':return home();case 'hogar':return hogarView(s);case 'electrodomesticos':case 'tecnologia':case 'tv-audio':return sectorView(s,page);case 'cyber':return cyberView(s);case 'motos':case 'motos-focus':return motoShowroom();case 'catalogo':return catalog(q);case 'buscar':return searchResultsView(s,q);case 'guia':return guide();case 'resultados':return resultPage();case 'comparar':return comparePage();case 'producto':return detailPage(id);case 'producto-oficial':return officialDetailView(s,id);case 'carrito':return cartPage();case 'checkout':return checkoutPage();case 'reserva':return reservePage(id);case 'pedido':return orderPage(id);case 'pedidos':return ordersPage();case 'cuenta':case 'mimoto':return accountPage();case 'mis-productos':return myProductsView(s,q);case 'mi-producto':return ownedProductView(s,id,q);case 'agregar-producto':return registerView(s,q,careDraft);case 'mis-comprobantes':return receiptsView(s);case 'comprobante':return receiptView(s,id);case 'favoritos':return favoritesPage();case 'consulta':return consultPage(q);case 'consultas':return consultationsPage();case 'sucursales':return branchesPage();case 'sucursal':return branchPage(id);case 'taller':return workshopPage();case 'services':return servicesPage();case 'financiacion':return financingPage();default:return empty('No encontramos esta página.')}}
function safe(fn){return async ev=>{try{await fn(ev);save()}catch(error){toast(error.message)}}}
function focusGuide(){const h=app.querySelector('#guide-form h2');h?.setAttribute('tabindex','-1');h?.focus({preventScroll:true});h?.scrollIntoView({block:'nearest'})}
function guideSave(form){
 if(!form.checkValidity())return false;
 const data=new FormData(form),g=s.guide,plan=questionPlan(g.type,types),step=Math.min(g.step,plan.length);
 for(const f of plan[step-1].fields){
  if(f.kind==='checks')g[f.id]=data.getAll(f.id);
  else if(['use','budget','bike'].includes(f.id))g[f.id]=String(data.get(f.id)||'').trim();
  else g.context[f.id]=String(data.get(f.id)||'').trim();
 }
 return true;
}
function enterGuide(){
 if(route().path[0]!=='guia')return;
 const q=route().q,t=q.get('tipo'),cat=q.get('cat'),searchQuery=cleanQuery(q.get('busqueda')),previousSearch=s.guide.searchContext?.query;
 if(t&&Object.keys(types).includes(t)&&(s.guide.type!==t||s.guide.selection)){s.guide=newGuide(t)}
 else if(cat&&categories.includes(cat)&&(s.guide.category!==cat||s.guide.selection==='category')){const ids=guideTypes(s,cat).map(([id])=>id);if(ids.length===1)s.guide=newGuide(ids[0]);else{s.guide.category=cat;s.guide.selection='type'}}
 if(searchQuery){const searchCategory=q.get('searchcat')||cat||'';s.guide.searchContext={query:searchQuery,category:SEARCH_CATEGORIES.includes(searchCategory)?searchCategory:''};if(searchQuery!==previousSearch&&!t){s.guide.selection=cat?'type':'category';s.guide.step=1}}else delete s.guide.searchContext;
 if(q.has('editar')){s.guide.selection='';s.guide.step=Math.max(1,Math.min(questionPlan(s.guide.type,types).length,Number(q.get('paso'))||1));history.replaceState(null,'',withGuideSearch('#guia?tipo='+s.guide.type))}
 s.guide.step=Math.min(s.guide.step,questionPlan(s.guide.type,types).length);save();
}
function bindSignals(root){
 root.querySelectorAll('.hx-signal').forEach(w=>{
  const b=w.querySelector('button'),tip=w.querySelector('.stt-tooltip');
  const close=()=>{w.classList.remove('open');b.setAttribute('aria-expanded','false')};
  const open=(kind='click')=>{w.dataset.interaction=kind;w.classList.add('open');b.setAttribute('aria-expanded','true');tip.style.setProperty('--tip-offset','0px');const r=tip.getBoundingClientRect();tip.style.setProperty('--tip-offset',Math.min(0,window.innerWidth-18-r.right)+Math.max(0,18-r.left)+'px')};
  b.onclick=()=>w.classList.contains('open')&&w.dataset.interaction==='click'?close():open('click');
  w.onpointerenter=ev=>{if(ev.pointerType==='mouse'&&!w.classList.contains('open'))open('hover')};w.onpointerleave=()=>{if(w.dataset.interaction==='hover')close()};b.onfocus=()=>{if(b.matches(':focus-visible'))open('focus')};
  b.onkeydown=ev=>{if(ev.key==='Escape'){ev.preventDefault();ev.stopPropagation();close()}};
  b.onblur=close;
 });
}
function bindProductActions(root){
 root.querySelectorAll('[data-add]').forEach(b=>b.onclick=safe(()=>performAdd(b.dataset.add,b.dataset.next)));
 root.querySelectorAll('[data-part]').forEach(b=>b.onclick=()=>{document.querySelector('#shopping-dialog').close();openPart(b.dataset.part,b.dataset.next)});
 root.querySelectorAll('[data-quick]').forEach(b=>b.onclick=()=>openShopping(b.dataset.quick,'preview'));
 root.querySelectorAll('[data-zoom]').forEach(b=>b.onclick=()=>openShopping(b.dataset.zoom,'gallery',b.dataset.gallerySrc));
}
let shoppingReturnSelector='',shoppingSearchContext=null;
function ensureCommerceProduct(id){if(product(s,id))return;const row=officialRecord(id);if(!row)throw Error('No se encontró el producto. Recargá su ficha para intentar nuevamente.');registerOfficial(s,row);save()}
function openShopping(id,view,image,searchContext){
 ensureCommerceProduct(id);
 const dialog=document.querySelector('#shopping-dialog'),wasOpen=dialog.open;
 if(!wasOpen){shoppingSearchContext=searchContext||null;const trigger=document.activeElement;const key=['data-quick','data-add','data-zoom','data-part'].find(k=>trigger?.hasAttribute(k));shoppingReturnSelector=key?`[${key}="${CSS.escape(trigger.getAttribute(key))}"]`:''}
 dialog.className=view==='gallery'?'shopping-gallery':'shopping-drawer';dialog.dataset.product=id;dialog.dataset.view=view;
 dialog.innerHTML=view==='gallery'?galleryView(product(s,id),image):view==='added'?cartAddedView(s,id):quickView(s,id);
 if(!dialog.open)dialog.showModal();
 dialog.querySelectorAll('[data-shopping-close]').forEach(b=>b.onclick=()=>dialog.close());
 dialog.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>dialog.close()));
 bindProductActions(dialog);bindSignals(dialog);if(wasOpen)dialog.querySelector('.shopping-close')?.focus({preventScroll:true});
 dialog.querySelector('#quick-branch')?.addEventListener('change',ev=>{s.shopping.branch=ev.target.value;save();render();openShopping(id,'preview');dialog.querySelector('#quick-branch').focus()});
}
function performAdd(id,next='',searchContext){
 ensureCommerceProduct(id);add(s,id);save();
 if(next==='checkout'){shoppingSearchContext=null;changeCheckout(s,{step:1});checkoutError='';save();document.querySelector('#shopping-dialog').close();event(s,'quick_purchase',id);save();if(location.hash==='#checkout'){render();app.querySelector('#contenido')?.focus({preventScroll:true});window.scrollTo({top:0})}else location.hash='checkout'}
 else if(searchContext){render();disposeSearch.resume?.(searchContext);toast('Agregaste una unidad al carrito. Tu búsqueda sigue abierta.')}
 else{render();openShopping(id,'added')}
}
function openPart(id,next='',searchContext){
 const p=product(s,id),dialog=document.querySelector('#part-dialog');
 dialog.innerHTML=`<button class="dialog-close" aria-label="Cerrar revisión de compatibilidad">×</button><p class="eyebrow">REVISÁ LA PIEZA</p><h2 id="part-dialog-title">Confirmá que sea la que necesitás.</h2><p><b>${e(p.name)}</b></p><p>La compatibilidad por modelo, año y versión está pendiente. Agregarla al carrito no confirma que corresponda a tu moto.</p><div class="form-actions"><button class="button" id="part-accept">Agregar esta pieza</button><a class="text-link" href="#consulta?producto=${encodeURIComponent(id)}">Prefiero consultar</a></div>`;
 let accepted=false;dialog.querySelector('.dialog-close').onclick=()=>dialog.close();dialog.querySelector('a').onclick=()=>dialog.close();
 if(searchContext)dialog.addEventListener('close',()=>{if(!accepted)disposeSearch.resume?.(searchContext)},{once:true});
 dialog.querySelector('#part-accept').onclick=safe(()=>{accepted=true;dialog.close();try{performAdd(id,next,searchContext)}catch(error){if(searchContext)disposeSearch.resume?.(searchContext);throw error}});dialog.showModal();
}
function withGuideSearch(href){const c=s.guide.searchContext;return c?.query?href+(href.includes('?')?'&':'?')+new URLSearchParams({busqueda:c.query,searchcat:c.category}):href}
function newGuideInSearch(type){const g=newGuide(type);if(s.guide.searchContext)g.searchContext=structuredClone(s.guide.searchContext);return g}
function guideSelectionUrl(){history.replaceState(null,'',withGuideSearch(s.guide.selection==='category'?'#guia':s.guide.selection==='type'?'#guia?cat='+encodeURIComponent(s.guide.category):'#guia?tipo='+s.guide.type))}
function refreshGuideSummary(){const summary=app.querySelector('#guide-live-summary');if(summary)summary.innerHTML=guideSummary(s)}
function editGuide(step){
 s.guide.selection='';s.guide.step=Math.max(1,Math.min(questionPlan(s.guide.type,types).length,Number(step)||1));save();
 const hash=withGuideSearch('#guia?editar=1&paso='+s.guide.step);if(location.hash===hash){render();focusGuide()}else location.hash=hash;
}
let disposeTvShowcase=()=>{},disposeSearch=()=>{};
let disposeCombinations=()=>{};
let disposeTech=()=>{},disposeHomeShowroom=()=>{},disposeGardenShowroom=()=>{},disposeHomeCategories=()=>{},disposeHogar=()=>{};
let disposeLenders=()=>{};
let disposeFocus=()=>{};
let disposeJourney=()=>{},disposeParts=()=>{},disposeNavigation=()=>{};
function updateQuantity(id,qty,delta=0){try{changeQuantity(s,id,qty);cartError='';event(s,'cart_quantity',id)}catch(err){cartError=err.message;cartErrorId=id}save();render();const input=app.querySelector('[data-qty="'+CSS.escape(id)+'"]');const group=input?.closest('.ck-quantity');const step=group?.querySelector('[data-delta="'+delta+'"]:not(:disabled)')||group?.querySelector('button:not(:disabled)');(delta&&!cartError?(step||input?.closest('.ck-line')):input)?.focus({preventScroll:true});input?.setAttribute('aria-invalid',cartError?'true':'false');if(cartError)input?.setAttribute('aria-describedby','cart-error')}
function focusCheckout(){const h=app.querySelector('#checkout-error')||app.querySelector('#checkout-stage-title');h?.focus({preventScroll:true});h?.scrollIntoView({block:'nearest'})}
function bindCheckout(){
 app.querySelectorAll('[data-checkout-step]').forEach(b=>b.onclick=()=>{changeCheckout(s,{step:Number(b.dataset.checkoutStep)});checkoutError='';save();render();focusCheckout()});
 app.querySelectorAll('[data-show-costs]').forEach(b=>b.addEventListener('click',()=>{const h=app.querySelector('#buy-summary-title');h?.focus({preventScroll:true});h?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}));
 const form=app.querySelector('#checkout');if(!form)return;
 form.addEventListener('change',ev=>{if(['delivery','branch','payment'].includes(ev.target.name)){changeCheckout(s,{[ev.target.name]:ev.target.value});checkoutError='';save();render();const control=app.querySelector('input[name="'+ev.target.name+'"][value="'+CSS.escape(ev.target.value)+'"]');control?.focus({preventScroll:true});if(ev.target.name==='branch')control?.scrollIntoView({block:'nearest'})}});
 form.onsubmit=ev=>{ev.preventDefault();if(checkoutBusy)return;const d=checkoutDraft(s),q=quote(s,d);if(q.errors.length){checkoutError=q.errors.join(' ');render();focusCheckout();return}if(d.step<3){changeCheckout(s,{step:d.step+1});event(s,'checkout_step',String(d.step+1));save();render();focusCheckout();return}
 checkoutBusy=true;const submit=form.querySelector('[type=submit]');if(submit)submit.disabled=true;try{const o=purchase(s,d);changeCheckout(s,{step:1});checkoutError='';save();location.hash='pedido/'+o.id}catch(err){checkoutError=err.message;event(s,'checkout_rejected',d.payment);save();render();focusCheckout()}finally{checkoutBusy=false}
 };
}
function bind(){
 disposeMobilePanels=bindMobilePanels(app);
 disposeTvShowcase=bindTvShowcase(app);
 disposeSearch=bindSmartSearch(app,s,{onProductAction:(action,id,next,context)=>{if(action==='preview')openShopping(id,'preview',undefined,context);else if(action==='part')openPart(id,next,context);else if(action==='remove'||action==='decrease'){const row=s.cart.find(l=>l.id===id);if(!row)throw Error('El producto ya no está en el carrito.');if(action==='remove')s.cart=s.cart.filter(l=>l.id!==id);else changeQuantity(s,id,row.qty-1);event(s,'cart_quantity',id);save();render();disposeSearch.resume?.(context);toast(action==='remove'?'Producto eliminado del carrito.':'Cantidad actualizada.')}else performAdd(id,next,context)},onError:error=>toast(error.message)});
 bindOfficialGallery(app);
 disposeHogar=bindHogar(app);
 disposeHomeCategories=bindHomeCategories(app);
 disposeHomeShowroom=bindHomeShowroom(app);
 disposeTech=bindTechShowcase(app);
 disposeGardenShowroom=bindGardenShowroom(app);
 disposeCombinations=bindCombinations(app,s,(id,quantities,branch,checkout)=>{
  const q=addCombination(s,id,quantities,branch);
  if(checkout){changeCheckout(s,{step:1});checkoutError='';event(s,'combination_purchase',id)}
  save();document.querySelector('#combination-dialog').close();
  if(checkout)location.hash='checkout';else{render();toast('Combinación agregada: '+q.count+' productos.','#carrito','Revisar carrito')}
 },sectorComboOptions(app.querySelector('[data-combo-root]')?.dataset.comboSection));
 bindBranchGallery(app);
 bindMaintenanceTabs(app,(href,brand)=>{const top=scrollY;history.replaceState(history.state,'',href);render();app.querySelector('[data-service-brand="'+brand+'"]').focus({preventScroll:true});window.scrollTo({top,behavior:'instant'})});
 disposeNavigation=bindNavigation(app,s);disposeParts=app.querySelector('[data-moto-journey]')?()=>{}:bindPartsCarousel(app);disposeJourney=bindMotoJourney(app,s,{enhanceParts:root=>{bindProductActions(root);bindSignals(root)},onBranch:id=>{selectBranch(s,id);save()},onFinance:()=>motoFinance.update(app,route())});disposeFocus=bindMotoFocus(app);disposeLenders=bindLenders(app);
 const branchFilters=app.querySelector('#branch-filters');
 if(branchFilters){branchFilters.onsubmit=ev=>{ev.preventDefault();const next=branchQuery(route().q),data=new FormData(branchFilters);for(const key of ['q','ciudad'])next.set(key,String(data.get(key)||''));location.hash=branchesHref(next).slice(1)};branchFilters.querySelector('[name=ciudad]').onchange=()=>branchFilters.requestSubmit()}
 app.querySelectorAll('[data-select-branch]').forEach(b=>b.onclick=safe(()=>{if(selectBranch(s,b.dataset.selectBranch)){save();render();toast('Sucursal elegida para tu recorrido demo.')}}));
 app.querySelectorAll('[data-copy-branch]').forEach(b=>b.onclick=async()=>{const branch=s.branches.find(x=>x.id===b.dataset.copyBranch),address=branch&&branchInfo(branch).address;if(!address)return;try{await navigator.clipboard.writeText(address);toast('Dirección copiada.')}catch{toast('No pudimos copiarla. Podés seleccionar la dirección del local.')}});
 app.querySelector('#search-filters')?.addEventListener('submit',ev=>{ev.preventDefault();if(!ev.target.reportValidity())return;location.hash='buscar?'+new URLSearchParams(new FormData(ev.target))});
 app.querySelector('#filters')?.addEventListener('submit',ev=>{ev.preventDefault();const data=new URLSearchParams(new FormData(ev.target));location.hash='catalogo?'+data});
 app.querySelector('#parts-bike-form')?.addEventListener('submit',safe(ev=>{ev.preventDefault();const form=Object.fromEntries(new FormData(ev.currentTarget));setPartsBike(s,form);save();partsScrollResults=true;const next='catalogo?'+partsQuery(route().q,{mi_moto:'1',q:form.q?.trim(),familia:form.familia});if(location.hash.slice(1)===next)render();else location.hash=next}));
 app.querySelectorAll('[data-bike-suggestion]').forEach(b=>b.addEventListener('click',()=>{const form=app.querySelector('#parts-bike-form');if(!form)return;const model=form.elements.namedItem('model'),make=form.elements.namedItem('make');if(model.value.trim().toUpperCase()!==b.dataset.bikeSuggestion.toUpperCase()){form.elements.namedItem('year').value='';form.elements.namedItem('version').value=''}model.value=b.dataset.bikeSuggestion;make.value=b.dataset.bikeMake;app.querySelectorAll('[data-bike-suggestion]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const feedback=app.querySelector('.parts-selection-feedback');if(feedback)feedback.textContent='Referencia seleccionada: '+b.dataset.bikeSuggestion+'. Podés completar año, versión y pieza antes de buscar.';model.focus({preventScroll:true})}));
 app.querySelector('#parts-bike-model')?.addEventListener('input',ev=>{const value=ev.currentTarget.value.trim().toUpperCase();app.querySelectorAll('[data-bike-suggestion]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.bikeSuggestion.toUpperCase()===value)));const feedback=app.querySelector('.parts-selection-feedback');if(feedback)feedback.textContent=''});
 app.querySelector('[data-parts-clear]')?.addEventListener('click',()=>{delete profile(s).partsBike;save();const next='catalogo?cat=Repuestos';if(location.hash.slice(1)===next)render();else location.hash=next});
 app.querySelector('#parts-filters')?.addEventListener('submit',ev=>{ev.preventDefault();partsScrollResults=true;const next='catalogo?'+new URLSearchParams(new FormData(ev.currentTarget));if(location.hash.slice(1)===next)render();else location.hash=next});
 app.querySelector('#parts-hero-search')?.addEventListener('submit',ev=>{ev.preventDefault();partsScrollResults=true;const data=new FormData(ev.currentTarget);const next='catalogo?'+partsQuery(route().q,{q:String(data.get('q')||'').trim()});if(location.hash.slice(1)===next)render();else location.hash=next});
 app.querySelectorAll('[data-parts-category],[data-parts-page]').forEach(a=>a.addEventListener('click',ev=>{if(ev.button||ev.metaKey||ev.ctrlKey||ev.shiftKey||ev.altKey)return;partsScrollResults=true;if(a.getAttribute('href')===location.hash){ev.preventDefault();render()}}));
 app.querySelectorAll('[data-parts-focus]').forEach(b=>b.addEventListener('click',()=>{const field=app.querySelector('#'+b.dataset.partsFocus);field?.scrollIntoView({behavior:'smooth',block:'center'});field?.focus({preventScroll:true})}));
 app.querySelectorAll('[data-part-section]').forEach(b=>b.addEventListener('click',()=>{const target=app.querySelector('#'+b.dataset.partSection);app.querySelectorAll('.part-detail-nav [data-part-section]').forEach(t=>{const selected=t.dataset.partSection===b.dataset.partSection;t.classList.toggle('is-active',selected);t.setAttribute('aria-pressed',String(selected))});target?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});target?.focus({preventScroll:true})}));
 app.querySelector('[data-part-branch-focus]')?.addEventListener('click',()=>{const field=app.querySelector('#product-branch');field?.scrollIntoView({behavior:'smooth',block:'center'});field?.focus({preventScroll:true})});
 app.querySelector('#part-detail-bike-form')?.addEventListener('submit',safe(ev=>{ev.preventDefault();setPartsBike(s,Object.fromEntries(new FormData(ev.currentTarget)));save();render();requestAnimationFrame(()=>{app.querySelectorAll('.part-detail-nav [data-part-section]').forEach(t=>{const selected=t.dataset.partSection==='part-fit';t.classList.toggle('is-active',selected);t.setAttribute('aria-pressed',String(selected))});const target=app.querySelector('#part-fit');target?.scrollIntoView({behavior:'instant',block:'start'});target?.focus({preventScroll:true})})}));


 app.querySelectorAll('[data-favorite]').forEach(b=>b.onclick=safe(()=>{const list=profile(s).favorites,id=b.dataset.favorite;profile(s).favorites=list.includes(id)?list.filter(x=>x!==id):[...list,id];save();render();toast('Favoritos actualizados.')}));
 app.querySelectorAll('[data-compare]').forEach(b=>b.onclick=safe(()=>{const inResults=!!b.closest('.parts-results-grid'),id=b.dataset.compare,top=window.scrollY;toggleCompare(s,id);save();render();if(inResults){window.scrollTo({top,behavior:'instant'});app.querySelector('.parts-results-grid [data-compare="'+CSS.escape(id)+'"]')?.focus({preventScroll:true})}toast('Comparación actualizada.','#comparar','Ver diferencias')}));
 bindProductActions(app);bindSignals(app);
 app.querySelectorAll('[data-compare-pair]').forEach(b=>b.onclick=safe(()=>{ensureCommerceProduct(b.dataset.comparePair);ensureCommerceProduct(b.dataset.other);if(product(s,b.dataset.comparePair).type!==product(s,b.dataset.other).type)throw Error('Elegí dos productos del mismo tipo.');s.compare=[b.dataset.comparePair,b.dataset.other];event(s,'comparison_pair',s.compare.join(','));save();location.hash='comparar'}));
 app.querySelector('#product-branch')?.addEventListener('change',ev=>{s.shopping.branch=ev.target.value;save();render()});
 app.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{s.cart=s.cart.filter(x=>x.id!==b.dataset.remove);save();render()});
 app.querySelectorAll('[data-qty]').forEach(input=>{const commit=()=>{if(input.isConnected&&Number(input.value)!==s.cart.find(l=>l.id===input.dataset.qty)?.qty)updateQuantity(input.dataset.qty,Number(input.value))};input.onchange=commit;input.onblur=commit;input.onkeydown=ev=>{if(ev.key==='Enter'){ev.preventDefault();commit()}}});
 app.querySelectorAll('[data-quantity-step]').forEach(b=>b.onclick=()=>updateQuantity(b.dataset.quantityStep,(s.cart.find(l=>l.id===b.dataset.quantityStep)?.qty||0)+Number(b.dataset.delta),Number(b.dataset.delta)));
 app.querySelectorAll('[data-cancel]').forEach(b=>b.onclick=safe(()=>{setStatus(s,b.dataset.cancel,'Cancelado');save();render()}));
 app.querySelector('#guide-form')?.addEventListener('submit',safe(ev=>{ev.preventDefault();if(!guideSave(ev.target))return;const last=questionPlan(s.guide.type,types).length;if(s.guide.step>=last){event(s,'guide_complete',s.guide.type);save();location.hash='resultados'}else{s.guide.step++;save();render();focusGuide()}}));
 app.querySelector('#guide-form')?.addEventListener('input',ev=>{if(guideSave(ev.currentTarget)){save();refreshGuideSummary()}});
 app.querySelector('#guide-form')?.addEventListener('change',ev=>{if(guideSave(ev.currentTarget)){save();refreshGuideSummary()}});
 app.querySelectorAll('[data-guide-edit]').forEach(b=>b.onclick=()=>editGuide(b.dataset.guideEdit));
 app.querySelector('[data-guide-change]')?.addEventListener('click',()=>{const form=app.querySelector('#guide-form');if(form&&!guideSave(form)){form.reportValidity();return}s.guide.selection='type';guideSelectionUrl();save();render();document.querySelector('#contenido').focus()});
 app.querySelectorAll('[data-guide-budget]').forEach(b=>b.onclick=()=>{const form=app.querySelector('#guide-form');form.elements.budget.value=b.dataset.guideBudget;if(guideSave(form)){save();refreshGuideSummary()}form.elements.budget.focus()});
 app.querySelector('[data-comparison-table]')?.addEventListener('click',()=>{const target=app.querySelector('.comparison-detail-heading h2');target.setAttribute('tabindex','-1');target.focus({preventScroll:true});target.scrollIntoView({block:'start'})});
 app.querySelector('#compare-branch')?.addEventListener('change',ev=>{s.shopping.branch=ev.target.value;save();render()});
 app.querySelector('#guide-back')?.addEventListener('click',()=>{const form=app.querySelector('#guide-form');if(!guideSave(form)){form.reportValidity();return}if(s.guide.step>1)s.guide.step--;else s.guide.selection='type';guideSelectionUrl();save();render();focusGuide()});
 app.querySelectorAll('[data-guide-step]').forEach(b=>b.onclick=()=>{const form=app.querySelector('#guide-form');if(!guideSave(form)){form.reportValidity();return}s.guide.step=Number(b.dataset.guideStep);save();render();focusGuide()});
 app.querySelectorAll('[data-guide-category]').forEach(b=>b.onclick=()=>{const category=b.dataset.guideCategory,ids=guideTypes(s,category).map(([id])=>id);if(ids.length===1)s.guide=newGuideInSearch(ids[0]);else{s.guide.category=category;s.guide.selection='type'}guideSelectionUrl();save();render();document.querySelector('#contenido').focus()});
 app.querySelector('#guide-type-search')?.addEventListener('input',ev=>{const fold=v=>v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();let count=0;app.querySelectorAll('[data-guide-type]').forEach(b=>{b.hidden=!fold(b.textContent).includes(fold(ev.target.value));if(!b.hidden)count++});app.querySelector('#guide-type-empty').hidden=count>0});
 app.querySelectorAll('[data-guide-type]').forEach(b=>b.onclick=()=>{s.guide=newGuideInSearch(b.dataset.guideType);guideSelectionUrl();event(s,'guide_type',s.guide.type);save();render();focusGuide()});
 app.querySelector('[data-guide-category-back]')?.addEventListener('click',()=>{s.guide.selection='category';guideSelectionUrl();save();render();document.querySelector('#contenido').focus()});
 app.querySelector('#compare-results')?.addEventListener('click',()=>{s.compare=recommendations(s).items.map(p=>p.id);event(s,'recommendations_compare',s.guide.type);save();location.hash='comparar'});
 app.querySelectorAll('.comparison-scroll').forEach(el=>el.addEventListener('keydown',ev=>{if(['ArrowLeft','ArrowRight'].includes(ev.key)){ev.preventDefault();ev.currentTarget.scrollBy({left:ev.key==='ArrowRight'?240:-240,behavior:'instant'})}}));
 app.querySelector('#differences')?.addEventListener('change',ev=>{differences=ev.target.checked;render()});app.querySelector('#clear-compare')?.addEventListener('click',()=>{s.compare=[];save();render();document.querySelector('#contenido').focus()});
 bindCheckout();
 app.querySelector('#reserve')?.addEventListener('submit',safe(ev=>{ev.preventDefault();const data=Object.fromEntries(new FormData(ev.target)),o=reserve(s,ev.target.dataset.id,data.kind,data.branch);save();toast('Operación demo registrada.');location.hash='pedido/'+o.id}));
 app.querySelector('#profile')?.addEventListener('change',ev=>{s.user=ev.target.value;save();render()});
 app.querySelector('#my-bike')?.addEventListener('submit',ev=>{ev.preventDefault();profile(s).bike=new FormData(ev.target).get('bike');save();render();toast('Modelo guardado en tu perfil demo.')});
 app.querySelector('#consult')?.addEventListener('submit',safe(ev=>{ev.preventDefault();const data=Object.fromEntries(new FormData(ev.target));consult(s,{...data,productId:ev.target.dataset.id,assetId:ev.target.dataset.asset||'',topic:ev.target.dataset.topic||'producto',partsContext:ev.target.dataset.partsContext==='1'});save();location.hash='consultas'}));
 app.querySelectorAll('[data-care-example]').forEach(b=>b.onclick=safe(()=>{const next=structuredClone(s),order=createCareExample(next);replaceState(next);location.hash='mis-productos';render();toast('Ejemplo de posventa preparado. Tu carrito y stock se conservaron.')}));
 app.querySelector('#care-search')?.addEventListener('submit',ev=>{ev.preventDefault();location.hash='mis-productos?'+new URLSearchParams(new FormData(ev.target))});
 app.querySelector('#care-category')?.addEventListener('change',ev=>{careDraft=Object.fromEntries(new FormData(app.querySelector('#care-register')));careDraft.productId='';location.hash='agregar-producto?cat='+encodeURIComponent(ev.target.value)});
 app.querySelector('#care-register')?.addEventListener('submit',safe(ev=>{ev.preventDefault();const asset=registerModel(s,Object.fromEntries(new FormData(ev.target)));careDraft={};event(s,'owned_model',asset.productId);save();location.hash='mi-producto/'+encodeURIComponent(asset.id)}));
 app.querySelector('#care-details')?.addEventListener('submit',safe(ev=>{ev.preventDefault();saveAssetDetails(s,ev.target.dataset.asset,Object.fromEntries(new FormData(ev.target)));event(s,'owned_details',ev.target.dataset.asset);save();render();toast('Datos de ejemplo guardados.')}));
 app.querySelector('#care-history')?.addEventListener('submit',safe(ev=>{ev.preventDefault();addMaintenance(s,ev.target.dataset.asset,Object.fromEntries(new FormData(ev.target)));event(s,'maintenance_record',ev.target.dataset.asset);save();render();toast('Cuidado realizado guardado en el historial.')}));
 app.querySelector('#care-reminder')?.addEventListener('submit',safe(ev=>{ev.preventDefault();addReminder(s,ev.target.dataset.asset,Object.fromEntries(new FormData(ev.target)));event(s,'personal_reminder',ev.target.dataset.asset);save();render();toast('Recordatorio personal guardado.')}));
 app.querySelectorAll('[data-reminder]').forEach(b=>b.onclick=safe(()=>{changeReminder(s,b.dataset.asset,b.dataset.reminder,b.dataset.state);event(s,'reminder_status',b.dataset.state);save();render();toast('Recordatorio actualizado.')}));
 app.querySelectorAll('[data-download-receipt]').forEach(b=>b.onclick=safe(()=>{const content=receiptDownload(s,b.dataset.downloadReceipt),url=URL.createObjectURL(new Blob([content],{type:'text/html;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='comprobante-demo-'+b.dataset.downloadReceipt.replace(/[^a-zA-Z0-9_-]/g,'_')+'.html';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);event(s,'receipt_download',b.dataset.downloadReceipt)}));
 app.querySelector('#print-receipt')?.addEventListener('click',()=>window.print());
 app.querySelector('.receipt-table-scroll')?.addEventListener('keydown',ev=>{if(['ArrowLeft','ArrowRight'].includes(ev.key)){ev.preventDefault();ev.currentTarget.scrollBy({left:ev.key==='ArrowRight'?220:-220,behavior:'instant'})}});
 const branchParam=route().q.get('branch');if(branchParam&&app.querySelector('#consult'))app.querySelector('#consult select').value=branchParam;
}
function render(){disposeMobilePanels();disposeTvShowcase();disposeTech();disposeHogar();disposeJourney();disposeSearch();disposeHomeCategories();disposeGardenShowroom();disposeHomeShowroom();disposeCombinations();disposeNavigation();campaignController?.destroy();disposeParts();disposeFocus();disposeLenders();const active=document.activeElement;const key=['data-service-brand','data-select-branch','data-compare','data-favorite','data-qty','data-add','data-part','data-quick','data-zoom','data-guide-step','id'].find(k=>active?.hasAttribute(k));const focus=key?`[${key}="${CSS.escape(active.getAttribute(key))}"]`:null;document.title='Fussetti · '+({taller:'Taller oficial',services:'Services Oficiales',sucursales:'Sucursales',sucursal:s.branches.find(b=>b.id===route().path[1])?.title||'Sucursal',electrodomesticos:'Electrodomésticos · Para vivir mejor',tecnologia:'Tecnología · Más cerca','tv-audio':'TV y audio · Tu próximo plan',hogar:'Hogar · Tu casa, más vos',inicio:'Elegir bien, vivir mejor',cyber:'CYBER FUSSETTI!',motos:'Motos · Honda','motos-focus':'Motos en primer plano',guia:'Ayudame a elegir',resultados:'Tus opciones',comparar:'Comparar productos',buscar:'Resultados de búsqueda',carrito:'Tu carrito',checkout:'Tu compra',cuenta:'Tu espacio','mis-productos':'Mis productos','mi-producto':'Mi producto','mis-comprobantes':'Mis comprobantes',comprobante:'Comprobante demo'}[route().path[0]]||'Descubrí y elegí');const dealership=isMotoExperience(s,route());applyInterfaceScale(dealership);app.innerHTML=campaignHeader(s,route().path[0],header(),campaignState)+(!dealership||s.compare.every(id=>product(s,id)?.type==='motorcycle')?comparisonRail(s,route().path[0]):'')+`<main id="contenido" class="${dealership?'moto-content':''}" tabindex="-1">${currentPage()}</main>`+footer();bind();campaignController=bindCampaign(app.querySelector('.campaign-carousel'),campaignState);motoFinance.update(app,route());if(partsScrollResults){partsScrollResults=false;requestAnimationFrame(()=>{const target=app.querySelector('#parts-results');target?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});target?.focus({preventScroll:true})})}else if(focus)app.querySelector(focus)?.focus({preventScroll:true})}
document.querySelector('.skip').addEventListener('click',ev=>{ev.preventDefault();const main=document.querySelector('#contenido');main.focus();main.scrollIntoView({block:'start'})});
let previous=route().path[0];window.addEventListener('hashchange',()=>{const r=route();if(r.path[0]==='inicio'){location.replace('../');return}enterGuide();if(r.path[0]==='guia'&&previous!=='guia')event(s,'guide_start',s.guide.type);if(r.path[0]==='producto'&&previous==='resultados')event(s,'recommendation_open',r.path[1]||'');if(r.path[0]==='checkout'&&previous!=='checkout'){checkoutError='';event(s,'checkout_start')}if(r.path[0]!=='carrito')cartError='';if(r.path[0]==='comparar')event(s,'comparison_view');previous=r.path[0];save();render();document.querySelector('#contenido').focus({preventScroll:true});window.scrollTo({top:0});revealRoute();});window.addEventListener('alternative-update',render);if(previous==='inicio'){location.replace('../')}else{enterGuide();render();revealRoute()}

const shoppingDialog=document.querySelector('#shopping-dialog');
shoppingDialog.addEventListener('click',ev=>{if(ev.target===shoppingDialog){const r=shoppingDialog.getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)shoppingDialog.close()}});
shoppingDialog.addEventListener('close',()=>{if(shoppingSearchContext){const context=shoppingSearchContext;shoppingSearchContext=null;disposeSearch.resume?.(context)}else if(route().path[0]!=='checkout'){if(shoppingReturnSelector)app.querySelector(shoppingReturnSelector)?.focus({preventScroll:true})}});
window.addEventListener('hashchange',()=>{shoppingDialog.close();document.querySelector('#part-dialog').close()});
