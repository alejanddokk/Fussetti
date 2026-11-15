import {combinationHero} from './hogar-combo-views.mjs';
import {sectorCombinations,sectorComboPresentation} from './sector-combinations.mjs';
import {sectors} from './sector-model.mjs';

export const sectorComboUi=Object.fromEntries(Object.keys(sectorCombinations).map(key=>[key,{index:0,drafts:{}}]));
export function sectorComboOptions(key){return sectorCombinations[key]?{choices:sectorCombinations[key],ui:sectorComboUi[key]}:{}}
export function sectorCombinationHero(s,key,rows,secondary=false){
 const options={...sectorComboOptions(key),...sectorComboPresentation[key],key,name:sectors[key].title,secondary,secondaryTitle:secondary?"Ideas para completar tu equipo.":undefined};
 return `<div class="specific-sector-hero specific-${key}">${combinationHero(s,rows,options)}</div>`;
}

export function retailEntrances(){
 const cards=[{title:'Hogar',key:'hogar',copy:'Espacios para vivirlos.',count:249,photo:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/hogar-combos/3627.jpg'}, {title:'Electrodomésticos',key:'electrodomesticos',copy:'Ideas para tu día a día.',count:241,photo:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/sectores/3586.jpg'}, {title:'Tecnología',key:'tecnologia',copy:'Armá tus próximos planes.',count:46,photo:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/sectores/3634.jpg'}, {title:'TV y audio',key:'tv-audio',copy:'Dale lugar a lo que te gusta.',count:53,photo:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/sectores/3700.jpg'}];
 return `<section class="container retail-entrances" aria-labelledby="retail-title"><div class="retail-entrances-heading"><p class="eyebrow">CUATRO FORMAS DE ENCONTRAR LO TUYO</p><h2 id="retail-title">Entrá a tu próxima elección.</h2></div><div class="retail-entrances-grid">${cards.map(c=>`<a href="#${c.key}" class="retail-entrance retail-entrance-${c.key}"><span class="retail-entrance-image"><img src="${c.photo}" alt="" loading="lazy"></span><small>${c.count} productos del catálogo oficial</small><h3>${c.title}</h3><p>${c.copy}</p><b>Conocé la sección <span aria-hidden="true">→</span></b></a>`).join('')}</div></section>`;
}
