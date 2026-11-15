import {partsBike,bikeLabel,nameMatchesBike,partCode,partTitleFacts} from './repuestos-experiencia-model.mjs?v=20261106-resultados1';
import {typeCategories} from './knowledge.mjs';
import {types,money,unitPrice,product,recommendations} from './domain.mjs';
import {catalogueFacts,splitPayments} from './knowledge.mjs';
const cell=(text,status)=>({text:String(text),status});
const differs=values=>new Set(values.map(v=>JSON.stringify(v))).size>1;
const row=(id,label,group,values)=>({id,label,group,values,different:differs(values)});

// Only published attributes appear as confirmed specifications. Unknown is never "no".
export function comparisonRows(s,items){
 if(!items.length)return [];
 const labels=[...new Set(items.flatMap(p=>catalogueFacts(p).map(a=>a.label)))];
 const rows=[row('price','Precio final','Precio y financiación',items.map(p=>cell(money(unitPrice(s,p)),['fussetti-official','fussetti-mercadolibre'].includes(p.source)?'catalogo':'demo')))];
 if(items[0].kind!=='motorcycle')rows.push(row('payments','Financiación','Precio y financiación',items.map(p=>{if(p.source==='fussetti-official')return cell(p.official.installments||'Sin cuotas publicadas',p.official.installments?'catalogo':'pendiente');if(p.source==='fussetti-mercadolibre')return cell(p.market?.installments||'Sin cuotas publicadas',p.market?.installments?'catalogo':'pendiente');const parts=splitPayments(unitPrice(s,p));return cell(`2 cuotas de ${money(parts[0])} + 1 de ${money(parts[2])}`,'demo')})));
 if(items.some(p=>p.source==='fussetti-official'))rows.push(row('reference','Referencia oficial','Datos de origen',items.map(p=>cell(p.official?.reference||'Pendiente de confirmar',p.official?.reference?'catalogo':'pendiente'))),row('published-stock','Disponibilidad publicada al 4/11/2026','Datos de origen',items.map(p=>cell(p.official?.availability||'Sin información publicada',p.official?.availability?'catalogo':'pendiente'))));
 rows.push(...labels.map((label,i)=>row('spec-'+i,label,'Características publicadas',items.map(p=>{const a=catalogueFacts(p).find(a=>a.label===label);return a?cell(a.value,'catalogo'):cell('Pendiente de confirmar','pendiente')}))));
 rows.push(row('stock','Stock total del escenario','Disponibilidad demo',items.map(p=>cell(p.stock+' unidades','demo'))));
 rows.push(row('pickup','Retiro en la sucursal elegida','Disponibilidad demo',items.map(p=>cell(!p.stock?'Sin stock demo':p.branchIds.includes(s.shopping.branch)?'Disponible en demo':'Probá otra sucursal','demo'))));
 rows.push(row('services','Servicios asociados','Respaldo demo',items.map(p=>cell(p.services.join(' · ')||'Por confirmar',p.services.length?'demo':'pendiente'))));
 if(items[0].kind==='repuesto'){
  rows.push(row('part-code','Código mencionado en el título','Datos de la pieza',items.map(p=>{const code=partCode(p);return cell(code||'No informado',code?'catalogo':'pendiente')})));
  for(const label of [...new Set(items.flatMap(p=>partTitleFacts(p).map(f=>f.label)))])rows.push(row('part-title-'+label,label,'Datos de la pieza',items.map(p=>{const fact=partTitleFacts(p).find(f=>f.label===label);return cell(fact?.value||'No informado',fact?'catalogo':'pendiente')})));
  const bike=partsBike(s);if(bike)rows.push(row('part-model','Referencia para '+bikeLabel(bike),'Antes de elegir',items.map(p=>cell(nameMatchesBike(p,bike)?'Modelo mencionado en el título; confirmar':'Modelo no mencionado; confirmar','pendiente'))));
 }
 if(items[0].kind==='repuesto')rows.push(row('compatibility','Compatibilidad','Antes de elegir',items.map(p=>p.compatibilityStatus==='demo-confirmada'?cell('Confirmada solo en demo: '+p.compatible.map(id=>product(s,id)?.name||id).join(', '),'demo'):cell('Pendiente por modelo, año y versión','pendiente'))));
 return rows;
}

export function comparisonExamples(items){
 const published=new Set(items.flatMap(p=>catalogueFacts(p).map(a=>a.label)));
 const labels=[...new Set(items.flatMap(p=>p.attributes.filter(a=>a.status==='demo').map(a=>a.label)))].filter(l=>!published.has(l));
 return labels.map((label,i)=>row('example-'+i,label,'Ejemplos del escenario',items.map(p=>{const a=p.attributes.find(a=>a.label===label&&a.status==='demo');return a?cell(a.value,'demo'):cell('Pendiente de confirmar','pendiente')})));
}

export function guideBudgetOptions(s,g){
 const prices=[...new Set(recommendations(s,{...g,budget:''}).items.map(p=>Math.ceil(unitPrice(s,p)/100)))].sort((a,b)=>a-b);
 return [...new Set([prices[0],prices[Math.floor((prices.length-1)/2)],prices.at(-1)].filter(p=>p!==undefined))];
}

export function recommendationReasons(s,p){
 const g=s.guide,parts=['Disponible en el escenario demo'];
 if(g.budget!=='')parts.push('Precio dentro de tu presupuesto');
 if(g.required.length){const demo=g.required.some(label=>p.capabilities.some(c=>c.label===label&&c.status==='demo'));parts.push(demo?'Cumple los requisitos elegidos con datos de ejemplo demo':'Cumple las características publicadas que pediste')}
 if(['screen','storage','cups','litres','jars','kg','diameter','watts','style','viscosity','tireSize','consoleFamily'].some(k=>g.context?.[k]))parts.push('Coincide con tus filtros de especificaciones publicadas');
 if(g.bike)parts.push('Compatibilidad confirmada solo en demo para el modelo elegido');
 return parts;
}

export function matchingComparison(s){
 const items=s.compare.map(id=>product(s,id)).filter(Boolean);
 return items.length<=3&&new Set(items.map(p=>p.type)).size<=1?items:[];
}

export function guideTypes(s,category){
 return Object.entries(types).filter(([type])=>s.products.some(p=>p.type===type&&(typeCategories[type]===category||p.category===category||p.official?.categories?.includes(category)))).sort((a,b)=>a[1].name.localeCompare(b[1].name,'es'));
}
