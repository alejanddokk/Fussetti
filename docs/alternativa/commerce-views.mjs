import {partsCatalogueView} from './repuestos-experiencia-views.mjs?v=20261106-resultados1';
import {searchProducts} from './search-model.mjs';
export {homeView} from './home-views.mjs';
export {guideView,answerDetails,fitReason,resultsView,compareSummary} from './decision-views.mjs';
import {productCard,hasOffer} from './product-views.mjs?v=20261106-ficha1';
export {productCard,detailView,priceBlock,hasOffer,availableHere,remaining} from './product-views.mjs?v=20261106-ficha1';
import {types,unitPrice} from './domain.mjs';
import {typeCategories,categoryIcons} from './knowledge.mjs';
import {e,icon} from '../nueva/ui.mjs';
const link=(label,url,cls='button')=>`<a class="${cls}" href="${e(url)}">${label}</a>`;
const title=(k,h,p='')=>`<div class="page-title"><p class="eyebrow">${k}</p><h1>${h}</h1>${p?`<p>${p}</p>`:''}</div>`;
export const productGrid=(s,items)=>`<div class="product-grid">${items.map(p=>productCard(s,p)).join('')}</div>`;
export function catalogueView(s,q){
 if(q.get('cat')==='Repuestos')return partsCatalogueView(s,q);
 const cat=q.get('cat')||'',type=q.get('tipo')||'',search=q.get('q')||'',offer=q.has('ofertas');
 let items=s.products.filter(p=>(!cat||p.category===cat)&&(!type||p.type===type)&&(!offer||hasOffer(s,p))&&(!q.has('coleccion')||['Hogar','Climatización','TV y audio'].includes(p.category)));
 if(cat==='Repuestos')items.sort((a,b)=>Number(b.source==='fussetti-mercadolibre')-Number(a.source==='fussetti-mercadolibre'));
 if(search)items=searchProducts(items,search,{state:s}).matches.map(m=>m.p);
 if(q.get('orden')==='precio')items.sort((a,b)=>unitPrice(s,a)-unitPrice(s,b));
 const pageSize=24,total=items.length,pages=Math.max(1,Math.ceil(total/pageSize)),page=cat==='Repuestos'?Math.min(pages,Math.max(1,Number.parseInt(q.get('pagina')||'1',10)||1)):1;
 const pageUrl=n=>{const p=new URLSearchParams(q);p.set('pagina',String(n));return '#catalogo?'+p};
 const shown=cat==='Repuestos'?items.slice((page-1)*pageSize,page*pageSize):items;
 const pager=cat==='Repuestos'&&pages>1?`<nav class="catalog-pager" aria-label="Páginas de repuestos">${page>1?link('← Anterior',pageUrl(page-1),'button outline'):''}<span>Página ${page} de ${pages} · ${total} productos</span>${page<pages?link('Siguiente →',pageUrl(page+1),'button outline'):''}</nav>`:'';
 const cats=Object.keys(categoryIcons),guideUrl=type?'#guia?tipo='+type:cat?'#guia?cat='+encodeURIComponent(cat):'#guia';
 return `<section class="container page catalog-page">${title(offer?'OPORTUNIDADES CON SENTIDO':'EXPLORÁ A TU RITMO',search?'Resultados para “'+e(search)+'”':offer?'Buenas elecciones, mejor precio.':e(types[type]?.name||cat||'Encontrá lo que va con vos.'),'Comprá directo o compará las diferencias. La ayuda está disponible cuando la necesites.')}${cat==='Repuestos'?'<p class="notice">Publicaciones de Repuestos Fussetti en Mercado Libre relevadas el 5/11/2026 y productos demo. Los precios pueden cambiar; confirmá modelo, año y versión. Stock y compra simulados.</p>':''}<div class="catalog-intents">${link('Ayudame a elegir '+icon('arrow',16),guideUrl,'text-link')}<span>${s.shopping?.branch?icon('pin',15)+' Atención demo: '+e(s.branches.find(b=>b.id===s.shopping.branch)?.title):''}</span></div><div class="chips">${link('Todo','#catalogo'+(offer?'?ofertas=1':''),!cat?'active':'')}${cats.map(c=>link(c,'#catalogo?cat='+encodeURIComponent(c)+(offer?'&ofertas=1':''),cat===c?'active':'')).join('')}</div><form id="filters" class="filters"><label>Tipo de producto<select name="tipo"><option value="">Todos</option>${Object.entries(types).filter(([id])=>!cat||typeCategories[id]===cat).map(([id,t])=>`<option value="${id}" ${id===type?'selected':''}>${t.name}</option>`).join('')}</select></label><label>Buscar<input name="q" value="${e(search)}" placeholder="Nombre o modelo"></label><label>Ordenar<select name="orden"><option value="">Selección Fussetti</option><option value="precio" ${q.get('orden')==='precio'?'selected':''}>Menor precio</option></select></label><input type="hidden" name="cat" value="${e(cat)}">${offer?'<input type="hidden" name="ofertas" value="1">':''}${q.has('coleccion')?'<input type="hidden" name="coleccion" value="casa">':''}<button class="button">Aplicar</button><span>${items.length} ${items.length===1?'producto':'productos'}</span></form>${items.length?productGrid(s,shown)+pager:`<div class="empty"><h2>No encontramos esa combinación.</h2><p>Podés quitar un filtro o preparar una consulta con lo que necesitás.</p>${link('Quitar filtros','#catalogo','button outline')}${link('Preparar consulta','#consulta','text-link')}</div>`}</section>`;
}
