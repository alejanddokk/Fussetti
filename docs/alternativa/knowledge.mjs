import {officialTypeCategories} from './official-taxonomy.mjs';
// Product facts come only from the retained catalogue text. No manufacturer specifications are invented.
export const typeCategories={...officialTypeCategories,fridge:'Hogar',speaker:'TV y audio',gazebo:'Jardín',umbrella:'Jardín',tent:'Jardín',hood:'Hogar',fryer:'Hogar',microwave:'Hogar',bicycle:'Jardín',chair:'Jardín',hairdryer:'Hogar',thermos:'Hogar',mixer:'Hogar',trimmer:'Jardín',tv:'TV y audio',phone:'Tecnología',console:'Tecnología',air:'Climatización',fan:'Climatización',motorcycle:'Motos',oil:'Repuestos',transmission:'Repuestos',spare:'Repuestos',tire:'Repuestos',coffee:'Hogar',oven:'Hogar',yogurt:'Hogar',scale:'Hogar',vacuum:'Jardín',washer:'Jardín',generator:'Jardín',mower:'Jardín'};
export const categoryIcons={'Electrodomésticos':'home','Hogar':'home','Tecnología':'bolt','Climatización':'settings','TV y audio':'grid','Jardín':'home','Motos':'bike','Repuestos':'settings'};
export const KNOWLEDGE_REVISION=4;
const row=(label,value)=>({label,value:String(value),status:'catalogo'});
export function publishedFacts(p){
 const name=p.name,upper=name.toUpperCase(),out=[],add=(l,v)=>out.push(row(l,v));let m;
 if(p.model)add('Modelo',p.model);else if(['phone','console'].includes(p.type)&&name.includes(' - '))add('Modelo',name.split(' - ')[0].replace(/^(CELULAR|CONSOLA)\s+/i,''));else if(name.includes(' - '))add('Modelo',name.split(' - ').at(-1));
 if(p.source==='fussetti-official'){
  if(['laundry','dryer'].includes(p.type)&&(m=upper.match(/(\d+(?:[.,]\d+)?)\s*KG\b/)))add('Capacidad publicada',m[1]+' kg');
  if(['fridge','freezer','waterheater','blender','fryer'].includes(p.type)&&(m=upper.match(/(\d+(?:[.,]\d+)?)\s*L(?:TS|ITROS)?\b/)))add('Capacidad publicada',m[1]+' litros');
 }
 if(p.type==='tv'){
  if(m=name.match(/(\d+)[”"]/))add('Pantalla',m[1]+' pulgadas');
  if(/4K/.test(upper))add('Resolución publicada','UHD 4K');else if(/\bHD\b/.test(upper))add('Resolución publicada','HD');
  if(/SMART TV/.test(upper))add('Conectividad publicada','Smart TV');
 }
 if(p.type==='phone'&&(m=upper.match(/(\d+)\/(\d+)GB/))){add('Configuración publicada',m[0]);add('Almacenamiento publicado',m[2]+' GB')}
 if(p.type==='console'){
  if(upper.includes('PS5'))add('Familia publicada','PlayStation 5');else if(/RETRO NES/.test(upper))add('Familia publicada','Retro NES');
  if(/\b1T\b/.test(upper))add('Almacenamiento publicado','1 TB');
  if(m=upper.match(/(\d+) JOYSTICK/))add('Controles publicados',m[1]+' joysticks');
  if(m=upper.match(/(\d+) JUEGOS/))add('Juegos publicados',m[1]);
 }
 if(p.type==='air'){
  if(m=upper.match(/(\d+)W/))add('Potencia publicada',m[1]+' W');
  if(/F\/C/.test(upper))add('Función publicada','Frío / calor');
  if(/INVERTER/.test(upper))add('Tecnología publicada','Inverter');
 }
 if(p.type==='fan'&&(m=name.match(/(\d+)[”"]/)))add('Diámetro publicado',m[1]+' pulgadas');
 if(p.type==='fan'&&upper.includes('DE PIE'))add('Formato publicado','De pie');
 if(['fan','washer','generator'].includes(p.type)&&(m=upper.match(/(\d+)W/)))add('Potencia publicada',m[1]+' W');
 if(['oven','vacuum'].includes(p.type)&&(m=upper.match(/(\d+)LTS/)))add('Capacidad publicada',m[1]+' litros');
 if(p.type==='vacuum'&&upper.includes('POLVO Y AGUA'))add('Uso publicado','Polvo y agua');
 if(p.type==='coffee'&&(m=upper.match(/(\d+) TAZAS/)))add('Capacidad publicada',m[1]+' tazas');
 if(p.type==='yogurt'&&(m=upper.match(/(\d+) FRASCOS/)))add('Presentación publicada',m[1]+' frascos');
 if(p.type==='scale'&&(m=upper.match(/(\d+)KG/)))add('Capacidad publicada',m[1]+' kg');
 if(p.type==='mower'&&(m=upper.match(/(\d+)HP/)))add('Potencia publicada',m[1]+' HP');
 if(p.type==='mower'&&/ELÉCTRICA|ELECTRICA/.test(upper))add('Motor publicado','Eléctrico');
 if(p.type==='motorcycle'&&p.style){if(p.id==='honda-cb300')out.push({label:'Estilo',value:'Pendiente de verificar',status:'pendiente'});else add('Estilo',p.style)}
 if(p.type==='oil'){
  if(m=upper.match(/\b(\d{2})W-?(\d{2})\b/))add('Viscosidad publicada',m[1]+'W-'+m[2]);
  if(m=upper.match(/\b(\d+)\s*L\b/))add('Presentación publicada',m[1]+' litro'+(m[1]==='1'?'':'s'));
  if(upper.includes('MINERAL'))add('Tipo publicado','Mineral');else if(/SEMISINTÉTICO|SEMISINTETICO/.test(upper))add('Tipo publicado','Semisintético');else if(/SINTÉTICO|SINTETICO/.test(upper))add('Tipo publicado','Sintético');
  if(upper.includes('REFRIGERANTE'))add('Tipo publicado','Refrigerante');
 }
 if(p.type==='tire'&&(m=upper.match(/\d+\/\d+-\d+/)))add('Medida publicada',m[0]);
 return out;
}
export function publishedCapabilities(p){
 const n=p.name.toUpperCase(),out=[],add=label=>out.push({label,status:'catalogo'});
 if(p.type==='tv'&&n.includes('SMART TV'))add('Smart TV');if(p.type==='tv'&&n.includes('4K'))add('Resolución 4K');
 if(p.type==='air'&&n.includes('F/C'))add('Frío / calor');if(p.type==='air'&&n.includes('INVERTER'))add('Tecnología inverter');
 if(p.type==='fan'&&n.includes('DE PIE'))add('De pie');if(p.type==='vacuum'&&n.includes('POLVO Y AGUA'))add('Polvo y agua');
 if(p.type==='mower'&&/ELÉCTRICA|ELECTRICA/.test(n))add('Motor eléctrico');return out;
}
export function enrichKnowledge(p){
 const facts=publishedFacts(p),existing=p.attributes||[];
 // Correct the two ambiguous legacy classifications without replacing commercial edits.
 for(const a of existing){
  if(p.id==='honda-cb300'&&a.label==='Estilo'&&a.value==='On/Off'){a.value='Pendiente de verificar';a.status='pendiente'}
  if(a.label==='Tipo publicado'&&a.value==='Sintético'&&/SEMISINTÉTICO|SEMISINTETICO/i.test(p.name))a.value='Semisintético';
  if(a.label==='Modelo'&&['phone','console'].includes(p.type)&&p.name.includes(' - ')&&a.value===p.name.split(' - ').at(-1))a.value=facts.find(f=>f.label==='Modelo').value;
 }
 p.attributes=[...facts.map(a=>existing.find(b=>b.label===a.label)||a),...existing.filter(a=>!facts.some(b=>b.label===a.label))];
 const caps=publishedCapabilities(p);p.capabilities=[...caps.map(a=>p.capabilities?.find(b=>b.label===a.label)||a),...(p.capabilities||[]).filter(a=>!caps.some(b=>b.label===a.label))];
 p.knowledgeRevision=KNOWLEDGE_REVISION;return p;
}
export const catalogueFacts=p=>(p.attributes||publishedFacts(p)).filter(a=>a.status==='catalogo'&&!['Marca / modelo','Contenido y condiciones'].includes(a.label));
export const fact=(p,label)=>catalogueFacts(p).find(a=>a.label===label)?.value||'';
export const numericFact=(p,label)=>{const v=fact(p,label).match(/^\d+(?:[.,]\d+)?/);return v?Number(v[0].replace(',','.')):null};
export function pendingFor(p){
 if(p.kind==='repuesto')return ['Compatibilidad por modelo, año y versión','Contenido exacto y especificación indicada en el manual'];
 if(p.type==='motorcycle')return [...(p.id==='honda-cb300'?['Clasificación y versión exacta del modelo']:[]),'Ergonomía y experiencia de manejo','Documentación, patentamiento y condiciones de financiación'];
 if(p.type==='air')return ['Dimensionamiento para tu ambiente','Instalación, materiales y condiciones de garantía'];
 if(p.type==='tv')return ['Medidas exteriores, conexiones y sistema operativo','Soporte, accesorios y condiciones de garantía'];
 if(p.type==='phone')return ['Conectividad, cámara y autonomía','Accesorios y condiciones de garantía'];
 if(['washer','generator','mower'].includes(p.type))return ['Requisitos de uso y accesorios','Condiciones de instalación o puesta en marcha'];
 return ['Dimensiones y accesorios incluidos','Condiciones de uso, entrega y garantía'];
}
export function decisionSummary(p){
 const values=catalogueFacts(p).filter(a=>a.label!=='Modelo').slice(0,3);
 return values.length?'La publicación indica '+values.map(a=>a.value).join(' · ')+'.':'El modelo publicado es '+(p.model||p.name)+'.';
}
export function comparisonDifferences(items){
 const priority=['Pantalla','Resolución publicada','Capacidad publicada','Almacenamiento publicado','Potencia publicada','Tipo de carga','Tecnología inverter','Material ','Color '];
 const labels=[...new Set(items.flatMap(p=>catalogueFacts(p).map(a=>a.label)))].sort((a,b)=>(priority.includes(a)?priority.indexOf(a):100)-(priority.includes(b)?priority.indexOf(b):100));
 return labels.filter(label=>new Set(items.map(p=>fact(p,label)||'Pendiente')).size>1).filter(l=>l!=='Modelo').slice(0,3).map(label=>({label,values:items.map(p=>fact(p,label)||'Pendiente de confirmar')}));
}
export function splitPayments(cents,count=3){const first=Math.floor(cents/count);return [...Array(count)].map((_,i)=>first+(i===count-1?cents-first*count:0))}
