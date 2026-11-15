import {sectorCombinations} from './sector-combinations.mjs';
import {product,quote,event,unitPrice} from './domain.mjs';

export const combinations=[
 {id:'living',label:'Living',title:'Tu living, para quedarte.',copy:'Un sillón para bajar un cambio. Un rack para darle lugar a tus planes.',note:'Revisá las medidas del sillón, del rack y de tu ambiente antes de elegir.',items:[{id:'official-3627',qty:1,short:'Sillón Piero'},{id:'official-3444',qty:1,short:'Rack Domus'}]},
 {id:'comedor',label:'Comedor',title:'Una mesa. Muchos encuentros.',copy:'Una mesa y cuatro sillas para compartir las cosas de todos los días.',note:'Confirmá altura, espacio de paso y medidas de mesa y sillas para tu ambiente.',items:[{id:'official-3393',qty:1,short:'Mesa Carl'},{id:'official-3146',qty:4,short:'Silla Jackson'}]},
 {id:'descanso',label:'Descanso',title:'Bajá un cambio.',copy:'Texturas y detalles para darle otro aire a tu momento de descanso.',note:'Ambos productos se publican como Queen. Verificá sus medidas exactas, colores y variantes.',items:[{id:'official-3430',qty:1,short:'Acolchado Queen'},{id:'official-2738',qty:1,short:'Sábanas Queen'}]},
 {id:'mate',label:'Mate',title:'Ese momento para vos.',copy:'Un termo y un mate para acompañar tu pausa, estés donde estés.',note:'La combinación incluye termo y mate. La bombilla no está incluida en esta selección.',items:[{id:'official-3607',qty:1,short:'Termo Outdoors'},{id:'official-2906',qty:1,short:'Mate Mug'}]}
];
export const combinationIndex=(index,count=combinations.length)=>count?((index%count)+count)%count:0;
export const allCombinations=[...combinations,...Object.values(sectorCombinations).flat()];
export const combinationById=id=>allCombinations.find(c=>c.id===id);
export const combinationDefaults=id=>Object.fromEntries((combinationById(id)?.items||[]).map(x=>[x.id,x.qty]));
export const combinationPhoto=p=>p.photo||'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/hogar-combos/'+p.id.replace('official-','')+'.jpg';

export function combinationQuote(s,id,quantities=combinationDefaults(id),branch=s.shopping?.branch){
 const c=combinationById(id),errors=[],lines=[];
 if(!c)return {lines,total:0,count:0,errors:['No encontramos esta combinación.'],nextCart:structuredClone(s.cart)};
 if(!quantities||typeof quantities!=='object'||Array.isArray(quantities))return {lines,total:0,count:0,errors:['Revisá las cantidades de la combinación.'],nextCart:structuredClone(s.cart)};
 if(Object.keys(quantities).some(key=>!c.items.some(x=>x.id===key)))errors.push('La selección contiene un producto ajeno a esta combinación.');
 for(const item of c.items){
  const p=product(s,item.id),qty=quantities[item.id]??item.qty;
  if(!Number.isSafeInteger(qty)||qty<0||qty>999){errors.push('Usá cantidades enteras entre 0 y 999.');continue}
  if(!p||p.source!=='fussetti-official'){errors.push('Falta un producto del catálogo oficial. Recargá la página.');continue}
  const inCart=s.cart.find(l=>l.id===p.id)?.qty||0,max=Math.max(0,p.stock-inCart);
  if(qty>0){
   if(qty>max)errors.push(`${item.short}: podés sumar hasta ${max} unidades demo; ya tenés ${inCart} en el carrito.`);
   if(!p.branchIds.includes(branch))errors.push(`${item.short}: no disponible en la sucursal demo elegida.`);
  }
  lines.push({p,qty,unit:unitPrice(s,p),max,inCart,short:item.short});
 }
 const count=lines.reduce((n,l)=>n+l.qty,0),total=lines.reduce((n,l)=>n+l.qty*l.unit,0);
 if(!Number.isSafeInteger(total))errors.push('El total supera el límite admitido para esta compra demo.');
 if(!count)errors.push('Elegí al menos un producto para continuar.');
 const nextCart=structuredClone(s.cart);
 for(const {p,qty} of lines.filter(l=>l.qty>0)){const row=nextCart.find(l=>l.id===p.id);if(row)row.qty+=qty;else nextCart.push({id:p.id,qty})}
 // Validate the complete resulting basket before applying any mutation.
 if(!errors.length)errors.push(...quote({...s,cart:nextCart},{branch,delivery:s.shopping?.checkout?.delivery||'retiro'}).errors);
 return {lines,total,count,errors:[...new Set(errors)],nextCart};
}
export function addCombination(s,id,quantities,branch=s.shopping?.branch){
 const q=combinationQuote(s,id,quantities,branch);
 if(q.errors.length)throw Error(q.errors.join(' '));
 s.cart=q.nextCart;s.shopping.branch=branch;event(s,'combination_add',id);return q;
}
