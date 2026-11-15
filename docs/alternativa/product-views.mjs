import {partsBike,bikeLabel,nameMatchesBike,partCode,partFamily,partFamilies,partTitleFacts} from './repuestos-experiencia-model.mjs?v=20261106-ficha1';
import {productHref,productPhoto,photoCaption,photoKind} from './product-media.mjs';
import {types,money,unitPrice,product,profile} from './domain.mjs';
import {catalogueFacts,pendingFor,decisionSummary,splitPayments} from './knowledge.mjs';
import {e,icon} from '../nueva/ui.mjs';
import {action,signal,productLabel} from './horizonx-ui.mjs';
const href=productHref;
const partLabel=p=>partFamilies.find(([id])=>id===partFamily(p))?.[1]||'Repuestos';
const link=(label,url,cls='button')=>`<a class="${cls}" href="${e(url)}">${label}</a>`;
export const hasOffer=(s,p)=>s.config.offers&&p.eligible&&unitPrice(s,p)<p.price;
export const availableHere=(s,p)=>!s.shopping?.branch||p.branchIds.includes(s.shopping.branch);
export const remaining=(s,p)=>Math.max(0,p.stock-(s.cart.find(l=>l.id===p.id)?.qty||0));

export function priceBlock(s,p,large=false){
 const final=unitPrice(s,p),payments=splitPayments(final);
 if(p.source==='fussetti-mercadolibre')return `<div class="${large?'purchase-price':'card-price'}"><small>PRECIO PUBLICADO · MERCADO LIBRE · 5/11/2026</small><strong class="${large?'detail-price':'price'}">${money(final)}</strong>${large&&p.market?.installments?`<p class="price-note">Cuotas publicadas en Mercado Libre: ${e(p.market.installments)}</p>`:''}<p class="small-print">Precio relevado en la tienda Repuestos Fussetti. Stock, pago y entrega simulados.</p></div>`;
 if(p.source==='fussetti-official')return `<div class="${large?'purchase-price':'card-price'}"><small>PRECIO PUBLICADO · 4/11/2026</small><strong class="${large?'detail-price':'price'}">${e(p.official.priceText)}</strong><p class="price-note">${e(p.official.installments)}</p><p class="small-print">Referencia ${e(p.official.reference)} · precio conservado en la compra demo. Pago y entrega simulados.</p></div>`;
 return `<div class="${large?'purchase-price':'card-price'}">
 ${large?'<small>PRECIO FINAL DEMO</small>':''}
 ${hasOffer(s,p)?`<div class="price-before"><del>${money(p.price)}</del><span>${p.cyber?'CYBER':'−'+p.discount+'%'}</span></div>`:''}
 <strong class="${large?'detail-price':'price'}">${money(final)}</strong>
 <p class="price-note">${p.kind==='motorcycle'?'Reserva y financiación simuladas':`3 cuotas demo desde <b>${money(payments[0])}</b>`}</p>
 ${hasOffer(s,p)?`<p class="saving">Ahorrás ${money(p.price-final)}</p>`:''}
 ${large&&p.kind!=='motorcycle'?`<details class="payment-detail"><summary>Ver las cuotas y el total</summary><p>2 cuotas de ${money(payments[0])} y una última de ${money(payments[2])}. Total: ${money(final)}. Simulación sin cobro; entrega por separado.</p></details>`:''}
 </div>`;
}

export function buyButton(s,p,now=false,cls=''){
 if(!p.stock)return `<button class="button card-buy ${cls}" disabled>Sin stock demo</button>`;
 if(!availableHere(s,p))return link('Ver otra sucursal',href(p),'button outline card-buy '+cls);
 if(p.kind==='motorcycle')return link('Reservar moto '+icon('arrow',16),'#reserva/'+p.id,'button card-buy '+cls);
 const pending=p.kind==='repuesto'&&p.compatibilityStatus!=='demo-confirmada',field=pending?'data-part':'data-add';
 return action(!remaining(s,p)?'Máximo agregado':pending?now?'Revisar para comprar':'Revisar compatibilidad':now?'Comprar ahora':'Agregar al carrito',`${field}="${e(p.id)}" ${now?'data-next="checkout"':''} ${!remaining(s,p)?'disabled':''}`,'card-buy '+cls);
}

export function productCard(s,p,reason=''){
 const facts=catalogueFacts(p).filter(a=>a.label!=='Modelo').slice(0,2),count=s.cart.find(l=>l.id===p.id)?.qty||0,label=productLabel(p),saved=profile(s).favorites.includes(p.id);
 return `<article class="product-card" data-product-card="${e(p.id)}">
 <div class="product-media"><a href="${href(p)}"><img src="${e(productPhoto(p))}" data-clean-photo="${photoKind(p)}" alt="${e(p.name)}" loading="lazy"></a>
 <button data-favorite="${e(p.id)}" class="favorite ${saved?'selected':''}" aria-label="${saved?'Quitar de favoritos':'Guardar'} ${e(p.name)}" aria-pressed="${saved}">${icon('heart',19)}</button>
 ${hasOffer(s,p)?`<span class="offer-label">${p.cyber?'CYBER':'−'+p.discount+'%'} <span>DEMO</span></span>`:''}
 <button class="card-quick" data-quick="${e(p.id)}" aria-label="Vista rápida de ${e(p.name)}">${icon('search',15)} Vista rápida</button></div>
 <div class="product-body"><small>${e(p.kind==='repuesto'?partLabel(p):types[p.type].name)}</small><a class="product-name" href="${href(p)}">${e(label.name)}</a>
 ${label.model?`<span class="product-model">${e(label.model)}</span>`:''}
 <div class="card-facts">${facts.map(a=>`<span>${e(a.value)}</span>`).join('')||'<span>Conocé los detalles en la ficha</span>'}</div>
 ${priceBlock(s,p)}
 <span class="stock ${!p.stock?'out':''}">${icon(p.stock?'check':'pin',14)} ${!p.stock?'Sin stock demo':availableHere(s,p)?'Disponible en demo':'Consultá otra sucursal demo'}${count?' · '+count+' en carrito':''}</span>
 ${p.kind==='repuesto'?`<p class="compatibility-note">${p.compatibilityStatus==='demo-confirmada'?'Compatibilidad confirmada solo en demo':'Compatibilidad por confirmar'}</p>`:''}
 ${p.kind==='repuesto'&&partsBike(s)?`<p class="parts-match ${nameMatchesBike(p,partsBike(s))?'':'parts-match--unknown'}">${nameMatchesBike(p,partsBike(s))?'Coincidencia por nombre':'Compatibilidad sin datos'} · ${e(bikeLabel(partsBike(s)))} · confirmar</p>`:''}
 ${reason?`<div class="why"><b>Por qué encaja</b><p>${reason}</p><small>Por confirmar: ${e(pendingFor(p)[0])}.</small></div>`:''}
 ${buyButton(s,p)}
 <div class="card-controls"><button data-compare="${e(p.id)}" aria-pressed="${s.compare.includes(p.id)}">${icon('grid',15)} ${s.compare.includes(p.id)?'En comparación':'Comparar'}</button><a href="${href(p)}">Ver ficha ${icon('arrow',15)}</a></div></div></article>`;
}

export function availability(s,p,id){
 const here=availableHere(s,p);
 return `<div class="availability"><label for="${id}">${icon('pin',17)} Elegí tu sucursal demo</label><select id="${id}">${s.branches.map(b=>`<option value="${e(b.id)}" ${b.id===s.shopping.branch?'selected':''}>${e(b.title)}</option>`).join('')}</select>
 <p class="stock ${!p.stock||!here?'out':''}">${icon(p.stock&&here?'check':'pin',15)} ${!p.stock?'Sin stock demo':here?p.stock+' unidades demo · retiro disponible':'No disponible en esta sucursal demo. Probá otra.'}</p>
 <span>Envío de prueba: ${money(s.config.shipping)}. Elegí retiro o envío al finalizar.</span></div>`;
}

function compatibility(s,p,id){
 return p.kind==='repuesto'?`<div class="part-status">${partsBike(s)?`<p class="parts-match"><b>Tu moto:</b> ${e(bikeLabel(partsBike(s)))} · ${nameMatchesBike(p,partsBike(s))?'coincidencia por nombre':'sin datos para confirmar compatibilidad'}. Confirmá con la sucursal.</p>`:''}${partCode(p)?`<p class="parts-code">Código en la publicación: <b>${e(partCode(p))}</b></p>`:''}${signal(p.compatibilityStatus==='demo-confirmada'?'Compatibilidad demo':'Compatibilidad por confirmar','El nombre del producto no garantiza compatibilidad por modelo, año y versión. La confirmación de esta demo no es una verificación comercial.',id,'alert')}<p>${p.compatibilityStatus==='demo-confirmada'?'Modelos del escenario: '+e(p.compatible.map(id=>product(s,id)?.name||id).join(', ')):'Revisá modelo, año, versión y especificación antes de elegir.'}</p></div>`:'';
}

// Dedicated parts detail: listing titles provide references, never verified fitment.
function partDetailView(s,p){
 const bike=partsBike(s),matched=bike&&nameMatchesBike(p,bike),code=partCode(p),facts=catalogueFacts(p),titleFacts=partTitleFacts(p),label=productLabel(p),listing=p.source==='fussetti-mercadolibre';
 const bikeHeading=!bike?'Indicá qué moto tenés':matched?'Tu modelo aparece en el título':'Necesitamos confirmar esta pieza';
 const bikeDescription=!bike?'Guardá tu modelo para ver si aparece en el nombre de la publicación.':matched?'Es una coincidencia por nombre, no una confirmación de compatibilidad. Revisá año, versión y código antes de elegir.':'No podemos confirmar compatibilidad con tu modelo desde el nombre de la publicación. Esto no significa que la pieza no sirva; consultá antes de elegir.';
 const family=partLabel(p),date=listing?'5/11/2026':'Dato del catálogo demo';
 const actions=!availableHere(s,p)&&p.stock?'<button type="button" class="button outline" data-part-branch-focus>Elegir otra sucursal</button>':buyButton(s,p,true)+buyButton(s,p,false,'outline').replaceAll('Revisar compatibilidad','Agregar al carrito');
 return `<section class="container page part-detail-page"><div class="breadcrumb"><a href="#catalogo?cat=Repuestos">Repuestos</a><span>/</span><a href="#catalogo?cat=Repuestos&amp;familia=${e(partFamily(p))}">${e(family)}</a><span>/</span><span>Ficha de la pieza</span></div>
 <nav class="part-detail-nav" aria-label="Secciones de la ficha"><button type="button" class="is-active" data-part-section="part-overview" aria-pressed="true">La pieza</button><button type="button" data-part-section="part-fit" aria-pressed="false">Compatibilidad</button><button type="button" data-part-section="part-details" aria-pressed="false">Detalles</button></nav>
 <div class="part-detail-grid" id="part-overview" tabindex="-1"><div class="part-image-column"><div class="part-image-shell"><div class="part-image-top"><span>REPUESTOS FUSSETTI</span><span>${e(family)}</span></div><button class="part-main-image" data-zoom="${e(p.id)}" aria-label="Ampliar imagen de ${e(p.name)}"><img src="${e(productPhoto(p))}" data-clean-photo="${photoKind(p)}" alt="${e(p.name)}"><span>${icon('search',16)} Ampliar imagen</span></button></div><p class="part-photo-note">${photoCaption(p)} · Revisá la pieza y su presentación antes de elegir.</p><div class="part-image-meta"><div><small>CÓDIGO EN EL TÍTULO</small><strong>${code?e(code):'No informado'}</strong></div><div><small>ORIGEN DE LOS DATOS</small><strong>${listing?'Publicación de Repuestos Fussetti':'Catálogo de demostración'}</strong></div></div></div>
 <div class="part-main-copy"><p class="part-detail-kicker">REPUESTOS / ${e(family)}</p><h1>${e(label.name)}</h1>${label.model?`<p class="detail-model">${e(label.model)}</p>`:''}<p class="part-publication-label">Nombre publicado ${listing?'en Mercado Libre':'en el catálogo demo'}${listing?' · relevado el '+date:''}</p><div class="part-price-panel">${priceBlock(s,p,true)}<div class="part-price-status"><span class="part-status-dot ${!p.stock||!availableHere(s,p)?'is-unavailable':''}"></span>${!p.stock?'Sin stock demo':availableHere(s,p)?'Disponible en demo':'Consultar otra sucursal demo'}</div><div class="part-purchase-actions">${actions}</div><p class="part-small-note">Compra y entrega simuladas. No se realiza ningún cobro.</p>${availability(s,p,'product-branch')}</div><div class="part-quick-fit"><span class="part-fit-symbol" aria-hidden="true">!</span><div><strong>${bike?e(bikeHeading):'¿Es la pieza para tu moto?'}</strong><p>${bike?'Tu moto: '+e(bikeLabel(bike))+' · Compatibilidad pendiente de confirmar.':'Contanos el modelo y revisá qué información falta.'}</p><button type="button" data-part-section="part-fit">Revisar compatibilidad →</button></div></div><div class="detail-secondary"><button class="text-button" data-favorite="${e(p.id)}" aria-pressed="${profile(s).favorites.includes(p.id)}">${icon('heart',17)} ${profile(s).favorites.includes(p.id)?'Guardado en favoritos':'Guardar favorito'}</button><button class="text-button" data-compare="${e(p.id)}" aria-pressed="${s.compare.includes(p.id)}">${icon('grid',17)} ${s.compare.includes(p.id)?'Quitar de comparación':'Comparar'}</button></div></div></div>
 <section class="part-fit-section" id="part-fit" tabindex="-1"><div class="part-section-heading"><div><p class="part-detail-kicker">ANTES DE ELEGIR</p><h2>Revisemos tu moto.</h2><p>La referencia de tu moto queda guardada en este perfil demo.</p></div><span class="part-section-number">01 / COMPATIBILIDAD</span></div><div class="part-fit-layout"><div class="part-fit-result"><span class="part-fit-symbol" aria-hidden="true">!</span><div><small>${bike?'TU MOTO':'FALTA TU MOTO'}</small><h3>${e(bikeHeading)}</h3>${bike?`<p class="part-bike-name">${e(bikeLabel(bike))}</p>`:''}<p>${e(bikeDescription)}</p>${p.compatibilityStatus==='demo-confirmada'?'<p class="part-demo-warning">Este producto tiene compatibilidad de ejemplo solo para el escenario demo; no constituye una verificación comercial.</p>':''}<a href="#consulta?producto=${encodeURIComponent(p.id)}">Consultar esta pieza y mi moto →</a></div></div><div class="part-bike-editor"><h3>${bike?'Editar mi moto':'Contanos sobre tu moto'}</h3><p>Solo el modelo es obligatorio.</p><form id="part-detail-bike-form"><label>Marca <span>opcional</span><input name="make" value="${e(bike?.make||'')}" placeholder="Ej. Honda" maxlength="80"></label><label>Modelo <span>obligatorio</span><input name="model" value="${e(bike?.model||'')}" placeholder="Ej. Wave 110" maxlength="80" required></label><label>Año <span>opcional</span><input name="year" value="${e(bike?.year||'')}" placeholder="Ej. 2022" inputmode="numeric" pattern="(19|20)[0-9]{2}" title="Ingresá un año de cuatro dígitos" maxlength="4"></label><label>Versión <span>opcional</span><input name="version" value="${e(bike?.version||'')}" placeholder="Ej. S" maxlength="80"></label><button class="button">${bike?'Actualizar mi moto':'Guardar mi moto'} →</button></form></div></div></section>
 <section class="part-information" id="part-details" tabindex="-1"><div class="part-section-heading"><div><p class="part-detail-kicker">LOS DATOS A LA VISTA</p><h2>Conocé esta pieza.</h2><p>Información publicada y lo que todavía necesitás confirmar.</p></div><span class="part-section-number">02 / DETALLES</span></div><div class="part-information-grid"><div class="part-info-card"><h3>Datos de la publicación</h3><dl><div><dt>Nombre</dt><dd>${e(p.name)}</dd></div><div><dt>Código en el título</dt><dd>${code?e(code):'No informado en el título'}</dd></div>${listing?`<div><dt>Referencia de publicación</dt><dd>${e(p.market?.id||'No informada')}</dd></div><div><dt>Precio relevado</dt><dd>${e(date)} · puede cambiar</dd></div>`:''}${titleFacts.map(a=>`<div><dt>${e(a.label)}</dt><dd>${e(a.value)}</dd></div>`).join('')}${facts.filter(a=>a.label!=='Modelo').map(a=>`<div><dt>${e(a.label)}</dt><dd>${e(a.value)}</dd></div>`).join('')}</dl>${(p.attributes||[]).some(a=>a.status==='demo')?`<details><summary>Ver atributos de ejemplo demo</summary>${p.attributes.filter(a=>a.status==='demo').map(a=>`<p>${e(a.label)}: ${e(a.value)} · ejemplo demo</p>`).join('')}</details>`:''}${listing?`<a href="${e(p.market.url)}" target="_blank" rel="noopener noreferrer">Ver publicación de Repuestos Fussetti ↗</a>`:''}</div><aside class="part-pending-card"><p class="part-detail-kicker">TE AYUDAMOS A ELEGIR</p><h3>Lo que falta confirmar.</h3><ul><li>Modelo, año y versión exactos de tu moto.</li><li>El código, las medidas o la posición de la pieza.</li><li>Qué incluye y sus condiciones en la publicación.</li></ul><p><b>Contenido:</b> ${e(p.included)}</p><a class="button outline" href="#consulta?producto=${encodeURIComponent(p.id)}">Preparar consulta demo →</a><p>La consulta guarda la pieza y tu moto en este navegador. No se envía a la sucursal.</p></aside></div><div class="part-branch-panel"><span>Contá con Fussetti para seguir acompañado.</span><a href="#sucursales">Conocer sucursales →</a></div></section></section>`;
}

export function detailView(s,id){
 const p=product(s,id);if(!p)return '<section class="container page"><h1>Producto no encontrado.</h1><a class="button" href="#catalogo">Explorar productos</a></section>';
 if(p.kind==='repuesto')return partDetailView(s,p);
 const facts=catalogueFacts(p),pending=pendingFor(p),label=productLabel(p),other=(p.kind==='repuesto'?[]:s.products.filter(x=>x.type===p.type&&x.id!==p.id&&x.stock).sort((a,b)=>unitPrice(s,a)-unitPrice(s,b)).slice(0,2));
 return `<section class="container page product-page">
 <div class="breadcrumb"><a href="#catalogo">Explorar</a> <span>/</span> <a href="#catalogo?tipo=${p.type}">${e(types[p.type].name)}</a></div>
 <div class="product-detail"><div class="product-gallery">
 <button class="detail-image image-zoom" data-zoom="${e(p.id)}" aria-label="Ampliar imagen de ${e(p.name)}"><img src="${e(productPhoto(p))}" data-clean-photo="${photoKind(p)}" alt="${e(p.name)}"><span>${icon('search',16)} Ampliar imagen</span></button>
 <p class="gallery-caption">${photoCaption(p)}</p>
 <div class="product-key-facts">${facts.filter(a=>a.label!=='Modelo').slice(0,3).map(a=>`<div><small>${e(a.label)}</small><b>${e(a.value)}</b></div>`).join('')}</div>
 </div><div class="detail-copy"><div class="product-kicker"><span>${e(p.category)} · ${e(p.kind==='repuesto'?partLabel(p):types[p.type].name)}</span>${signal(facts.length+' datos publicados','Estos datos figuran en el nombre o en el catálogo de referencia. El stock, los precios y la financiación son de demostración.','facts-'+p.id)}</div>
 <h1>${e(label.name)}</h1>${label.model?`<p class="detail-model">Modelo ${e(label.model)}</p>`:''}<p class="product-lead">${e(decisionSummary(p))}</p>
 <div class="purchase-box">${priceBlock(s,p,true)}
 ${compatibility(s,p,'compat-'+p.id)}
 <div class="purchase-actions">${p.kind==='motorcycle'?buyButton(s,p):buyButton(s,p,true)}${p.kind==='motorcycle'?link('Simular financiación','#reserva/'+p.id+'?kind=finance','button outline'):buyButton(s,p,false,'outline')}</div>
 <p class="purchase-explanation">${p.kind==='motorcycle'?'Elegís una sucursal y registrás tu interés, sin pago.':'Comprar ahora agrega una unidad y abre la compra con tu carrito actual.'}</p>
 ${availability(s,p,'product-branch')}
 <p class="small-print">Modo demostración · sin cobros ni operaciones reales.</p></div>
 <div class="detail-secondary"><button class="text-button" data-compare="${e(p.id)}" aria-pressed="${s.compare.includes(p.id)}">${icon('grid',17)} ${s.compare.includes(p.id)?'Quitar de comparación':'Comparar con otra opción'}</button><button class="text-button" data-favorite="${e(p.id)}" aria-pressed="${profile(s).favorites.includes(p.id)}">${icon('heart',17)} ${profile(s).favorites.includes(p.id)?'Guardado en favoritos':'Guardar favorito'}</button></div>
 <a class="detail-guide" href="#guia?tipo=${p.type}"><span>${icon('settings',19)}<b>¿Cuál te conviene?</b><small>Te ayudamos a elegir ${e(types[p.type].name.toLowerCase())}.</small></span>${icon('arrow',19)}</a>
 </div></div>
 <section class="product-understand"><div><div class="page-title"><p class="eyebrow">LOS DATOS, A LA VISTA</p><h2>Conocé tu elección.</h2><p>Características publicadas en el catálogo de referencia.</p></div><dl class="attributes">${facts.map(a=>`<div><dt>${e(a.label)}</dt><dd>${e(a.value)}<small>Dato publicado en catálogo</small></dd></div>`).join('')||'<p>El catálogo no publica especificaciones suficientes para este producto.</p>'}</dl>
 ${p.attributes.some(a=>a.status==='demo')?`<details class="demo-attributes"><summary>Ver atributos de ejemplo demo</summary>${p.attributes.filter(a=>a.status==='demo').map(a=>`<p>${e(a.label)}: ${e(a.value)} · ejemplo demo</p>`).join('')}</details>`:''}</div>
 <aside class="confirm-card">${signal('Por confirmar','Conocer qué falta confirmar también forma parte de elegir bien. Podés guardar una consulta con este producto.','pending-'+p.id,'alert')}<h2>Lo que falta confirmar.</h2><ul>${pending.map(x=>`<li>${e(x)}</li>`).join('')}</ul><p><b>Qué incluye</b><br>${e(p.included)}</p>${p.source==='fussetti-mercadolibre'?`<p><a href="${e(p.market.url)}" target="_blank" rel="noopener noreferrer">Ver publicación de Repuestos Fussetti ↗</a></p>`:''}${link('Consultar este producto '+icon('arrow',17),'#consulta?producto='+encodeURIComponent(p.id),'button outline')}<p class="hint">Tu producto, respuestas y comparación quedan guardados en una consulta local de prueba.</p></aside></section>
 ${other.length?`<section class="commerce-section related-section"><div class="section-title"><div><p class="eyebrow">OTRAS FORMAS DE ELEGIR</p><h2>Miralas una al lado de la otra.</h2></div>${link('Ver todas','#catalogo?tipo='+p.type,'text-link')}</div><div class="related-options">${other.map(x=>`<article><a href="${href(x)}"><img src="${e(productPhoto(x))}" alt="${e(x.name)}"></a><div><a href="${href(x)}"><b>${e(productLabel(x).name)}</b></a><p>${e(decisionSummary(x))}</p><strong>${money(unitPrice(s,x))}</strong><small>${unitPrice(s,x)===unitPrice(s,p)?'Mismo precio que esta opción':money(Math.abs(unitPrice(s,x)-unitPrice(s,p)))+(unitPrice(s,x)>unitPrice(s,p)?' más':' menos')+' que esta opción'}</small><button class="text-button" data-compare-pair="${e(p.id)}" data-other="${e(x.id)}">Ver qué cambia ${icon('arrow',16)}</button></div></article>`).join('')}</div></section>`:''}</section>`;
}

const closeButton=label=>`<button class="shopping-close" data-shopping-close aria-label="${label}">×</button>`;
export function quickView(s,id){
 const p=product(s,id);if(!p)return '';
 const label=productLabel(p),facts=catalogueFacts(p).filter(a=>a.label!=='Modelo').slice(0,3);
 return `${closeButton('Cerrar vista rápida')}<div class="shopping-content quick-view"><p class="eyebrow">TU ELECCIÓN, MÁS CERCA</p><h2 id="shopping-title">Vista rápida.</h2><div class="quick-product-overview"><div class="quick-product-image"><img src="${e(productPhoto(p))}" data-clean-photo="${photoKind(p)}" alt="${e(p.name)}"></div><div class="quick-product-identity"><p class="quick-type">${e(types[p.type].name)}</p><h3>${e(label.name)}</h3>${label.model?`<p class="product-model">${e(label.model)}</p>`:''}<div class="quick-facts">${facts.map(a=>`<span>${e(a.value)}</span>`).join('')}</div></div></div>${priceBlock(s,p,true)}${availability(s,p,'quick-branch')}${compatibility(s,p,'quick-compat-'+p.id)}<p class="purchase-explanation">${p.kind==='motorcycle'?'Reserva demo sin cobro.':'Comprar ahora agrega una unidad y abre el checkout con tu carrito actual.'}</p></div><div class="shopping-footer"><div class="quick-actions">${buyButton(s,p,p.kind!=='motorcycle')}${p.kind!=='motorcycle'?buyButton(s,p,false,'outline'):''}</div>${link('Ver todos los detalles '+icon('arrow',16),href(p),'text-link')}</div>`;
}

export function cartAddedView(s,id){
 const p=product(s,id),line=s.cart.find(l=>l.id===id);if(!p||!line)return '';
 const subtotal=s.cart.reduce((sum,l)=>sum+unitPrice(s,product(s,l.id))*l.qty,0),count=s.cart.reduce((sum,l)=>sum+l.qty,0);
 return `${closeButton('Cerrar confirmación del carrito')}<div class="shopping-content"><div class="added-check" aria-hidden="true">${icon('check',26)}</div><p class="eyebrow">UNA BUENA ELECCIÓN</p><h2 id="shopping-title">Ya está en tu carrito.</h2><p class="shopping-status" role="status">Agregaste una unidad de ${e(p.name)}.</p><div class="added-product"><img src="${e(productPhoto(p))}" data-clean-photo="${photoKind(p)}" alt=""><div><b>${e(productLabel(p).name)}</b><span>${line.qty} ${line.qty===1?'unidad':'unidades'} en tu carrito</span><strong>${money(unitPrice(s,p)*line.qty)}</strong></div></div><div class="added-summary"><span>${count} ${count===1?'producto':'productos'} en total</span><p><span>Subtotal de productos</span><b>${money(subtotal)}</b></p><small>El envío se calcula al finalizar. Podés elegir retiro en sucursal demo.</small></div></div><div class="shopping-footer"><div class="quick-actions">${link('Finalizar compra demo '+icon('arrow',18),'#checkout','button hx-checkout-link')}${link('Revisar mi carrito','#carrito','button outline')}<button class="text-button" data-shopping-close>Seguir eligiendo</button></div><p class="small-print">Carrito guardado en este navegador · sin cobros.</p></div>`;
}

export function galleryView(p,image=productPhoto(p)){return `<div class="gallery-lightbox">${closeButton('Cerrar imagen ampliada')}<h2 id="shopping-title">${e(p.name)}</h2><img src="${e(image)}" data-clean-photo="${photoKind(p)}" alt="${e(p.name)}"><p>${photoCaption(p)}</p></div>`}
