import {hogarCollections,collectionProducts,collectionHref} from './hogar-model.mjs';
import {e,icon} from '../nueva/ui.mjs';

// HorizonX Accordion Gallery: six flex-grow panels with an expanded role.
// The exact export is retained in references/horizonx/accordion-gallery-hogar.html.
// Native links preserve one-step navigation and full keyboard/touch access.
export const homeCategories={
 muebles:{copy:'Dale lugar a tus mejores momentos.',photo:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/hogar-combos/3627.jpg',box:[35,205,690,420]},
 cocina:{copy:'Disfrutá más lo cotidiano.',photo:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/categorias-hogar/cocina.jpg',box:[0,190,800,420]},
 descanso:{copy:'Un espacio para bajar un cambio.',photo:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/hogar-combos/3430.jpg',box:[130,65,540,610]},
 patio:{copy:'Hacé lugar para nuevos planes.',photo:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/categorias-hogar/patio.jpg',box:[0,0,800,800]},
 mates:{copy:'Para acompañarte todos los días.',photo:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/categorias-hogar/mates.jpg',box:[200,70,400,680]},
 herramientas:{copy:'Todo para poner tus ideas en marcha.',photo:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/jardin/3632.jpg',box:[90,35,620,725]}
};
const all='#catalogo?cat=Hogar&lista=1';
export function homeCategoryShowcase(rows){
 return `<section class="home-categories" id="hogar-colecciones" data-category-showcase aria-labelledby="category-home-title"><div class="container"><div class="cat-intro"><div><p class="eyebrow">HOGAR FUSSETTI · IDEAS PARA VIVIRLO</p><h2 id="category-home-title">Explorá todas las categorías.</h2><p>Encontrá ideas para cada espacio y elegí con el respaldo de Fussetti.</p></div><div class="cat-intro-actions"><a href="#guia?cat=Hogar" class="button">Ayudame a elegir ${icon('arrow',16)}</a><a href="${all}" class="button outline">Ver todo Hogar ${icon('arrow',16)}</a></div></div><div class="cat-label"><h3>Elegí por tipo de producto</h3><span>Elegí una categoría para empezar</span></div><div class="cat-gallery" aria-label="Categorías de Hogar">${hogarCollections.map((c,i)=>{const a=homeCategories[c.id],count=collectionProducts(rows,c.id).length;return `<a class="cat-panel cat-${e(c.id)}" data-category-panel="${i}" data-active="${i===0}" href="${e(collectionHref(c.id))}"><span class="cat-number">0${i+1}</span><span class="cat-image"><svg viewBox="${a.box.join(' ')}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"><image href="${a.photo}" width="800" height="800"/></svg></span><span class="cat-panel-copy"><strong>${e(c.title)}</strong><span class="cat-description">${e(a.copy)}</span><span class="cat-explore">Explorar categoría ${icon('arrow',15)}</span><small>${count} productos</small></span></a>`}).join('')}</div><div class="cat-after"><span>Inspiración para elegir bien, con Fussetti cerca.</span><a href="${all}">Ver todos los productos de Hogar ${icon('arrow',15)}</a></div></div></section>`;
}
export function bindHomeCategories(host){
 const root=host.querySelector('[data-category-showcase]');if(!root)return ()=>{};
 const panels=[...root.querySelectorAll('[data-category-panel]')],abort=new AbortController(),signal=abort.signal;
 function activate(index){panels.forEach((panel,i)=>panel.dataset.active=String(i===index))}
 panels.forEach((panel,i)=>{panel.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')activate(i)},{signal});panel.addEventListener('focus',()=>activate(i),{signal})});
 return ()=>abort.abort();
}
