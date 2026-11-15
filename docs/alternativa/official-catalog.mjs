import {searchProducts} from './search-model.mjs';
import {sectorForCategory,sectorSelection,selectionTitle} from './sector-model.mjs';
import {collectionProducts,hogarCollections,gardenCollection} from './hogar-model.mjs';
import {officialData as data,officialError as error} from './official-source.mjs';
import {classifyOfficial,officialTypeCategories} from './official-taxonomy.mjs';
import {types,product,profile} from './domain.mjs';
import {productCard,priceBlock,buyButton,availability} from './product-views.mjs';
import {catalogueFacts} from './knowledge.mjs';
import {signal} from './horizonx-ui.mjs';
import {officialId} from './official-commerce.mjs';
import {e,icon} from '../nueva/ui.mjs';
import {productPhoto} from './product-media.mjs';
function ready(){return !!data}
const loading=()=>`<section class="container page"><h1>Catálogo Fussetti</h1><p role="status">${error||'Cargando los productos y sus fichas…'}</p></section>`;
const cats={'Hogar':'Hogar, Muebles y Jardín','Tecnología':'Tecnología','Electrodomésticos':'Electrodomésticos','TV y audio':'TV y Audio'};
const fold=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function officialSnapshot(){ready();return data}
export const officialRecord=id=>data?.productos.find(p=>officialId(p.id_oficial)===id);
export const officialHasType=type=>!!data?.productos.some(p=>classifyOfficial(p)===type);
export function officialCatalogueView(s,q){
 if(!ready())return loading();
 const type=q.get('tipo')||'';const cat=q.get('cat')||'',category=cats[cat]||cat,search=q.get('q')||'',sub=q.get('sub')||'';let items=data.productos.filter(p=>(!type||classifyOfficial(p)===type)&&(!category||p.categorias.includes(category)||['Jardín','Climatización'].includes(category)&&officialTypeCategories[classifyOfficial(p)]===category)&&(!sub||p.ruta_categorias.some(c=>c.nombre===sub)));
 const sector=sectorForCategory(cat);if(sector&&q.get('seleccion')){const ids=new Set(sectorSelection(data.productos,sector.key,q.get('seleccion')).map(p=>p.id_oficial));items=items.filter(p=>ids.has(p.id_oficial))}
 if(cat==='Hogar'&&q.get('coleccion')){const ids=new Set(collectionProducts(data.productos,q.get('coleccion')).map(p=>p.id_oficial));items=items.filter(p=>ids.has(p.id_oficial))}
 if(search){const ranking=new Map(searchProducts(s.products,search,{state:s}).matches.map((m,i)=>[m.p.id,i]));items=items.filter(p=>ranking.has(officialId(p.id_oficial))).sort((a,b)=>ranking.get(officialId(a.id_oficial))-ranking.get(officialId(b.id_oficial)))}
 if(q.get('orden')==='precio')items.sort((a,b)=>a.precio_centavos-b.precio_centavos);
 const page=Math.max(1,Math.min(Number(q.get('pagina'))||1,Math.ceil(items.length/24)||1));const url=n=>{const params=new URLSearchParams(q);params.set('pagina',n);return '#catalogo?'+params};
 return `<section class="container page catalog-page official-page"><div class="page-title"><p class="eyebrow">PRODUCTOS FUSSETTI</p><h1>${e(sector&&q.get('seleccion')?selectionTitle(sector.key,q.get('seleccion')):q.get('coleccion')==='hasta50'?'Hogar hasta $50.000':(q.get('coleccion')===gardenCollection.id?gardenCollection:hogarCollections.find(c=>c.id===q.get('coleccion')))?.title||(type?types[type].name:category||'Todo el catálogo'))}</h1><p>Nombres, fotos, precios y especificaciones relevados del ecommerce oficial.</p></div>${sector?`<a class="text-link sf-return" href="#${sector.key}">← Volver a ${sector.title}</a>`:''}${cat==='Hogar'?'<a class="text-link hg-return" href="#hogar">← Volver a descubrir Hogar</a>':''}<nav class="chips" aria-label="Rubros del catálogo"><a href="#catalogo" ${!cat?'class="active"':''}>Todos · 589</a>${Object.entries(cats).map(([key,value])=>`<a href="#catalogo?cat=${encodeURIComponent(key)}" ${category===value?'class="active"':''}>${e(value)} · ${data.metadatos.productos_por_categoria[value]}</a>`).join('')}<a href="#catalogo?cat=Motos">Motos</a><a href="#catalogo?cat=Repuestos">Repuestos</a></nav><form id="filters" class="filters"><input type="hidden" name="seleccion" value="${e(q.get('seleccion')||'')}"><input type="hidden" name="lista" value="1"><input type="hidden" name="coleccion" value="${e(q.get('coleccion')||'')}"><input type="hidden" name="tipo" value="${e(type)}"><input type="hidden" name="cat" value="${e(cat)}"><label>Buscar<input name="q" value="${e(search)}" placeholder="Producto, marca o referencia"></label><label>Ordenar<select name="orden"><option value="">Orden del catálogo oficial</option><option value="precio" ${q.get('orden')==='precio'?'selected':''}>Menor precio</option></select></label><button class="button">Aplicar</button><span>${items.length} productos</span></form><p class="official-note">Captura del 4/11/2026. Precios, cuotas y disponibilidad publicados pueden cambiar. ${cat==='Tecnología'?'Tecnología: 46 productos accesibles aunque su portada anuncia 47.':''}</p><div class="product-grid">${items.slice((page-1)*24,page*24).map(row=>{const p=product(s,officialId(row.id_oficial));return p?productCard(s,p):''}).join('')}</div>${!items.length?'<p>No se encontraron productos para esta búsqueda.</p>':''}<nav class="official-pager" aria-label="Páginas del catálogo">${page>1?`<a class="button outline" href="${e(url(page-1))}">← Anterior</a>`:'<span></span>'}<span>Página ${page} de ${Math.ceil(items.length/24)||1}</span>${page*24<items.length?`<a class="button outline" href="${e(url(page+1))}">Siguiente →</a>`:'<span></span>'}</nav></section>`;
}
const gallerySelection=new Map();
export function officialDetailView(s,id){
 if(!ready())return loading();
 const row=data.productos.find(p=>p.id_oficial===id),p=product(s,officialId(id));
 if(!row||!p)return '<section class="container page"><h1>Producto no encontrado</h1><a class="button" href="#catalogo">Volver al catálogo</a></section>';
 const images=row.imagenes;
 const preferred=images.findIndex(image=>image.url===productPhoto(p));
 const initial=preferred>=0?preferred:Math.max(0,images.findIndex(image=>image.portada));
 const index=Math.min(gallerySelection.get(id)??initial,images.length-1),selected=images[index],facts=catalogueFacts(p).filter(a=>a.label!=='Modelo'&&a.label!=='Marca').slice(0,3);
 const related=s.products.filter(x=>x.source==='fussetti-official'&&x.type===p.type&&x.id!==p.id&&x.stock>0).slice(0,2);
 return `<section class="container page product-page official-detail">
 <nav class="breadcrumb" aria-label="Ruta del producto"><a href="#catalogo">Explorar</a><span>/</span><a href="#catalogo?tipo=${p.type}">${e(types[p.type].name)}</a></nav>
 <div class="product-detail">
 <div class="product-gallery" data-official-gallery="${e(id)}">
 <button class="detail-image image-zoom" data-zoom="${e(p.id)}" data-gallery-src="${e(selected.url)}" aria-label="Ampliar imagen de ${e(p.name)}"><img class="official-main-image" src="${e(selected.url)}" alt="${e(selected.leyenda||p.name)}"><span>${icon('search',16)} Ampliar imagen</span></button>
 <p class="gallery-caption" data-gallery-status role="status">Foto ${index+1} de ${images.length} · Publicada por Fussetti.</p>
 <div class="official-gallery" aria-label="Fotos del producto">${images.map((image,i)=>`<button type="button" data-official-image="${i}" aria-pressed="${i===index}" aria-label="Ver foto ${i+1} de ${e(p.name)}"><img src="${e(image.url)}" alt="" loading="lazy"></button>`).join('')}</div>
 ${facts.length?`<div class="product-key-facts">${facts.map(f=>`<div><small>${e(f.label)}</small><b>${e(f.value)}</b></div>`).join('')}</div>`:''}
 </div>
 <div class="detail-copy">
 <div class="product-kicker"><span>${e(p.category)} · ${e(types[p.type].name)}</span>${signal('Datos oficiales','Nombre, precio, fotos y especificaciones relevados de Fussetti al 4/11/2026. La disponibilidad por sucursal, la entrega y la compra son simuladas.','official-source-'+id)}</div>
 <h1>${e(row.nombre)}</h1><p class="detail-model">${row.marca?e(row.marca)+' · ':''}Referencia ${e(row.referencia)}</p>
 <div class="purchase-box">${priceBlock(s,p,true)}
 <div class="purchase-actions">${buyButton(s,p,true)}${buyButton(s,p,false,'outline')}</div>
 <p class="purchase-explanation">Comprar ahora agrega una unidad y abre la compra con tu carrito actual.</p>
 ${availability(s,p,'product-branch')}<p class="small-print">Modo demostración · sin cobros ni operaciones reales.</p></div>
 <div class="detail-secondary"><button class="text-button" data-compare="${e(p.id)}" aria-pressed="${s.compare.includes(p.id)}">${icon('grid',17)} ${s.compare.includes(p.id)?'Quitar de comparación':'Comparar con otra opción'}</button><button class="text-button" data-favorite="${e(p.id)}" aria-pressed="${profile(s).favorites.includes(p.id)}">${icon('heart',17)} ${profile(s).favorites.includes(p.id)?'Guardado en favoritos':'Guardar favorito'}</button></div>
 <a class="detail-guide" href="#guia?tipo=${p.type}"><span>${icon('settings',19)}<b>¿Cuál te conviene?</b><small>Te ayudamos a elegir ${e(types[p.type].name.toLowerCase())}.</small></span>${icon('arrow',19)}</a>
 <details class="official-provenance"><summary>Ver datos de la publicación original</summary><dl><div><dt>Captura</dt><dd>4/11/2026</dd></div><div><dt>Referencia</dt><dd>${e(row.referencia)}</dd></div><div><dt>Disponibilidad publicada</dt><dd>${e(row.disponibilidad_publicada||row.cantidad_publicada_texto||'Sin información publicada.')}</dd></div></dl><a class="text-link" href="${e(row.url_oficial)}" target="_blank" rel="noopener">Ver ficha oficial ↗</a></details>
 </div></div>
 <section class="official-description"><div class="page-title"><p class="eyebrow">CONOCÉ TU ELECCIÓN</p><h2>Descripción publicada.</h2></div><div>${e(row.descripcion||'Sin descripción publicada.')}</div></section>
 <section class="product-understand"><div><div class="page-title"><p class="eyebrow">LOS DATOS, A LA VISTA</p><h2>Especificaciones.</h2><p>La información publicada para este producto, sin completar datos faltantes.</p></div>${row.especificaciones.length?`<table class="official-specs"><caption>Especificaciones publicadas por Fussetti</caption><tbody>${row.especificaciones.map(x=>`<tr><th scope="row">${e(x.nombre)}</th><td>${e(x.valor)}</td></tr>`).join('')}</tbody></table>`:'<p>No hay especificaciones adicionales publicadas.</p>'}</div>
 <aside class="confirm-card">${signal('Por confirmar','El catálogo conserva la información relevada. Las condiciones operativas reales se consultan con Fussetti.','official-pending-'+id,'alert')}<h2>Elegí con respaldo.</h2><ul><li>Stock vigente por sucursal.</li><li>Accesorios que no estén detallados en la publicación.</li><li>Condiciones reales de entrega, financiación y garantía.</li></ul><a class="button outline" href="#consulta?producto=${e(p.id)}">Consultar este producto ${icon('arrow',17)}</a><p class="hint">Consulta local de prueba, sin envío de mensajes externos.</p></aside></section>
 ${related.length?`<section class="commerce-section official-related"><div class="section-title"><div><p class="eyebrow">OTRAS OPCIONES PARA VOS</p><h2>Seguí eligiendo.</h2></div><a class="text-link" href="#catalogo?tipo=${p.type}">Ver todas ${icon('arrow',16)}</a></div><div class="product-grid">${related.map(x=>productCard(s,x)).join('')}</div></section>`:''}
 </section>`;
}
export function bindOfficialGallery(root){
 const gallery=root.querySelector('[data-official-gallery]');if(!gallery)return;
 const id=gallery.dataset.officialGallery,row=data?.productos.find(p=>p.id_oficial===id);if(!row)return;
 gallery.querySelectorAll('[data-official-image]').forEach(button=>button.onclick=()=>{
  const index=Number(button.dataset.officialImage),image=row.imagenes[index];if(!image)return;
  gallerySelection.set(id,index);const hero=gallery.querySelector('.official-main-image');hero.src=image.url;hero.alt=image.leyenda||row.nombre;
  gallery.querySelector('[data-zoom]').dataset.gallerySrc=image.url;
  gallery.querySelectorAll('[data-official-image]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  gallery.querySelector('[data-gallery-status]').textContent=`Foto ${index+1} de ${row.imagenes.length} · Publicada por Fussetti.`;
 });
}
