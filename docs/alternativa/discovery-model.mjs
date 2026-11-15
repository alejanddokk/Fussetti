import {sectorForCategory} from './sector-model.mjs';
import {types,unitPrice} from './domain.mjs';
import {typeCategories} from './knowledge.mjs';

export const departments=[
 {name:'Electrodomésticos',icon:'home',line:'Todo para tu casa.',description:'241 productos relevados del catálogo oficial.',type:'fridge'},
 {name:'Hogar',icon:'home',line:'Hacé más tuyo cada día.',description:'Cocina, pequeños electrodomésticos y nuevas rutinas.',type:'coffee'},
 {name:'Tecnología',icon:'bolt',line:'Conectá con lo que te gusta.',description:'Celulares y consolas para trabajar, jugar y disfrutar.',type:'phone'},
 {name:'Climatización',icon:'settings',line:'Dale aire a tus espacios.',description:'Aires y ventiladores. Te ayudamos a revisar qué necesitás.',type:'air'},
 {name:'TV y audio',icon:'grid',line:'Tus planes, en otra pantalla.',description:'Compará tamaños y características publicadas.',type:'tv'},
 {name:'Jardín',icon:'home',line:'Tus proyectos, en marcha.',description:'Herramientas para cuidar y disfrutar tus espacios.',type:'washer'},
 {name:'Motos',icon:'bike',line:'Tu próximo camino empieza acá.',description:'Modelos, reserva y financiación de demostración.',type:'motorcycle'},
 {name:'Repuestos',icon:'settings',line:'Cuidá lo que te mueve.',description:'Piezas y lubricantes. Confirmá la compatibilidad antes de elegir.',type:'oil'}
];
export const catalogueUrl=category=>category==='Hogar'?'#hogar':sectorForCategory(category)?'#'+sectorForCategory(category).key:'#catalogo?cat='+encodeURIComponent(category);
export const departmentTypes=category=>Object.entries(types).filter(([id])=>typeCategories[id]===category);
export function availableSelection(s,type,preferred=''){
 const items=s.products.filter(p=>p.type===type&&p.stock>0);
 return items.find(p=>p.id===preferred)||items[0]||null;
}
export function discoveryOffers(s){
 const eligible=s.products.filter(p=>p.stock>0&&s.config.offers&&p.eligible&&p.discount>0&&unitPrice(s,p)<p.price);
 const selected=eligible.filter(p=>p.cyber).sort((a,b)=>(b.price-unitPrice(s,b))-(a.price-unitPrice(s,a))).filter((p,i,items)=>items.findIndex(x=>x.type===p.type)===i).slice(0,4);if(selected.length)return {items:selected,maxDiscount:Math.max(...eligible.map(p=>p.discount)),count:eligible.length};
 for(const type of ['coffee','tv','air','washer']){const p=eligible.find(p=>p.type===type);if(p)selected.push(p)}
 for(const p of eligible)if(selected.length<4&&!selected.some(a=>a.type===p.type))selected.push(p);
 return {items:selected,maxDiscount:eligible.length?Math.max(...eligible.map(p=>p.discount)):0,count:eligible.length};
}
export function departmentPrice(s,category){
 const prices=s.products.filter(p=>p.category===category&&p.stock>0).map(p=>unitPrice(s,p));
 return prices.length?Math.min(...prices):null;
}
