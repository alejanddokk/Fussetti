import {typeCategories,fact,numericFact} from './knowledge.mjs';
export {typeCategories};
const select=(id,label,options,hint='')=>({id,label,kind:'select',options:[['','Sin preferencia / todavía no lo sé'],...options],hint});
const number=(id,label,hint='',max=10000000)=>({id,label,kind:'number',hint,max});
const text=(id,label,hint='')=>({id,label,kind:'text',hint});
const question=(label,title,fields,hint='')=>({label,title,fields,hint});
const budget=()=>question('Presupuesto','Que también cierre en números.',[number('budget','Presupuesto máximo del producto (ARS demo)','Opcional. La entrega se calcula por separado.')]);
export function questionPlan(type,types){
 const use=()=>question('Uso','¿Para qué lo vas a usar?',[select('use','Uso principal',types[type].uses.map(u=>[u,u]))],'El uso nos da contexto. Las características sin publicar se confirman con una sucursal.');
 const features=(list)=>({id:'required',label:'Lo que sí o sí necesitás',kind:'checks',options:list.map(x=>[x,x])});
 const partModel=()=>question('Tu moto','Empecemos por la compatibilidad.',[{id:'bike',label:'Modelo guardado en el catálogo demo',kind:'bike'},text('bikeText','Otro modelo o versión (opcional)'),number('year','Año de la moto (opcional)','El año queda en tu consulta; no confirma compatibilidad.',2100)],'Solo recomendamos compatibilidades confirmadas en el escenario demo. Si no elegís un modelo, verás piezas para revisar con un asesor.');
 if(type==='tv')return [use(),question('Tu espacio','¿Cómo es el lugar donde la vas a mirar?',[
  select('distance','Distancia aproximada a la pantalla',[['menos2','Menos de 2 metros'],['2a3','Entre 2 y 3 metros'],['mas3','Más de 3 metros']]),
  select('screen','Tamaño de pantalla que buscás',[['compacta','Hasta 43 pulgadas'],['media','De 44 a 55 pulgadas'],['grande','Más de 55 pulgadas']]),features(['Smart TV','Resolución 4K'])
 ],'Filtramos por el tamaño que elijas. La distancia se conserva para asesorarte, sin inferir medidas del ambiente.'),budget()];
 if(type==='air')return [question('El ambiente','Contanos qué ambiente querés climatizar.',[
  number('room','Superficie aproximada (m²)','No calculamos capacidad con este único dato.',1000),select('sun','Exposición al sol',[['poco','Poco sol directo'],['mucho','Mucho sol directo']]),select('installation','Instalación',[['nueva','Necesito una instalación nueva'],['reemplazo','Voy a reemplazar un equipo']])
 ],'Superficie, orientación y condiciones de instalación quedan en tu consulta. La capacidad adecuada requiere confirmación.'),question('El equipo','¿Qué tecnología buscás?',[features(['Frío / calor','Tecnología inverter'])]),budget()];
 if(type==='motorcycle')return [use(),question('Tu recorrido','Una elección para tu forma de moverte.',[
  select('experience','Experiencia de manejo',[['primera','Sería mi primera moto'],['habitual','Ya manejo habitualmente']]),select('road','Recorrido habitual',[['ciudad','Ciudad'],['mixto','Ciudad y caminos'],['ruta','Ruta']]),select('style','Estilo publicado que preferís',[['Cubs','Cubs'],['NAVi','NAVi'],['Sport','Sport'],['On/Off','On/Off']])
 ],'El estilo filtra los modelos publicados. La experiencia y el recorrido se conservan para revisar ergonomía y adecuación con el asesor.'),budget()];
 if(['oil','transmission','spare','tire'].includes(type)){
  let fields=type==='oil'?[select('viscosity','Viscosidad indicada por tu manual',[['10W-30','10W-30'],['15W-50','15W-50']])]:type==='tire'?[text('tireSize','Medida exacta indicada en el neumático','Ejemplo de formato: 80/100-14. Filtramos por la medida publicada.')]:[text('partReference','Referencia o pieza que necesitás','La referencia queda en tu consulta. El nombre de una pieza no confirma equivalencias.')];
  return [partModel(),question('La pieza','Los detalles importan.',fields,'La coincidencia de una especificación no confirma por sí sola la compatibilidad con tu moto.'),budget()];
 }
 if(type==='phone')return [use(),question('Memoria','¿Cuánto espacio buscás?',[select('storage','Almacenamiento publicado mínimo',[['128','128 GB'],['256','256 GB']])],'Cámara, batería y conectividad quedan pendientes cuando no figuran en el catálogo.'),budget()];
 if(type==='console')return [question('Tu experiencia','¿Qué tipo de consola buscás?',[select('consoleFamily','Familia publicada',[['PlayStation 5','PlayStation 5'],['Retro NES','Retro NES']])]),use(),budget()];
 if(type==='fan')return [question('El espacio','¿Dónde querés usarlo?',[text('space','Ambiente o ubicación'),select('diameter','Diámetro publicado mínimo',[['20','20 pulgadas'],['24','24 pulgadas']])]),budget()];
 if(type==='coffee')return [question('Tu rutina','¿Cuánto café querés preparar?',[select('cups','Capacidad publicada mínima',[['4','4 tazas'],['6','6 tazas']])],'La capacidad corresponde a lo publicado. Tipo de filtro y accesorios se confirman en la ficha.'),budget()];
 if(type==='oven')return [question('Tu cocina','Hacé lugar para lo que te gusta.',[select('litres','Capacidad publicada mínima',[['30','30 litros'],['60','60 litros'],['100','100 litros']]),text('space','Espacio disponible o medidas del lugar','Las dimensiones exteriores del equipo requieren confirmación.')]),budget()];
 if(type==='yogurt')return [question('Tu rutina','¿Cuántas porciones querés preparar?',[select('jars','Cantidad de frascos publicada mínima',[['4','4 frascos'],['7','7 frascos']])]),budget()];
 if(type==='scale')return [question('Tu cocina','¿Qué necesitás pesar?',[number('kg','Capacidad publicada mínima (kg)','Opcional. La precisión y las unidades de medida requieren confirmación.',100)]),budget()];
 if(type==='vacuum')return [question('La limpieza','¿Qué necesitás limpiar?',[text('task','Superficies y tipo de suciedad'),features(['Polvo y agua']),number('litres','Capacidad publicada mínima (litros)','Opcional.',1000)]),budget()];
 if(type==='washer')return [question('El trabajo','Contanos qué querés limpiar.',[text('task','Superficies o tareas'),number('watts','Potencia publicada mínima que buscás (W)','Opcional. Presión, caudal y accesorios deben confirmarse.',100000)]),budget()];
 if(type==='generator')return [question('Tu necesidad','¿Qué equipos necesitás abastecer?',[text('equipment','Equipos y uso previsto'),number('watts','Potencia publicada mínima que buscás (W)','La potencia publicada no confirma capacidad para el arranque de tus equipos.',100000)]),budget()];
 if(['laundry','washerdryer','dryer'].includes(type))return [question('La capacidad','¿Qué capacidad publicada buscás?',[number('kg','Capacidad mínima (kg)','Solo se filtra cuando la capacidad está publicada. Si falta el dato, no se supone.',100)]),budget()];
 if(['fridge','freezer','waterheater','blender','fryer'].includes(type))return [question('La capacidad','¿Qué capacidad publicada buscás?',[number('litres','Capacidad mínima (litros)','Solo se filtra cuando la capacidad está publicada. Podés dejarlo abierto.',3000)]),budget()];
 if(!['mower','trimmer'].includes(type))return [question('Tu necesidad','¿Qué es importante para tu elección?',[text('task','Uso o requisitos que querés consultar','Se conserva para una consulta. No damos por confirmadas prestaciones sin publicar.')]),budget()];
 return [question('Tu jardín','Contanos cómo es tu jardín.',[number('garden','Superficie aproximada (m²)','Se conserva para la consulta; no determina automáticamente el equipo.',100000),text('task','Terreno y tarea que necesitás hacer')]),budget()];
}
export function newGuide(type='tv'){return {flow:2,selection:'',category:typeCategories[type],step:1,type,use:'',required:[],preferences:[],bike:'',budget:'',context:{}}}
export function normalizeGuide(g){
 if(g.flow!==2){Object.assign(g,{flow:2,selection:'category',category:typeCategories[g.type],step:1,context:{}})}
 g.context||={};return g;
}
export function matchesGuideContext(p,g){
 const c=g.context||{};
 if(c.screen){const n=numericFact(p,'Pantalla');if(n===null||!(c.screen==='compacta'?n<=43:c.screen==='media'?n>43&&n<=55:n>55))return false}
 for(const [key,label] of [['storage','Almacenamiento publicado'],['cups','Capacidad publicada'],['litres','Capacidad publicada'],['jars','Presentación publicada'],['kg','Capacidad publicada'],['diameter','Diámetro publicado'],['watts','Potencia publicada']]){
  if(c[key]){const n=numericFact(p,label);if(n===null||n<Number(c[key]))return false}
 }
 if(c.style&&fact(p,'Estilo')!==c.style)return false;
 if(c.viscosity&&fact(p,'Viscosidad publicada')!==c.viscosity)return false;
 if(c.tireSize&&fact(p,'Medida publicada').replace(/\s/g,'').toLowerCase()!==c.tireSize.replace(/\s/g,'').toLowerCase())return false;
 if(c.consoleFamily&&fact(p,'Familia publicada')!==c.consoleFamily)return false;
 return true;
}
export function guideAnswerSummary(g,products,types){
 const entries=[];
 for(const q of questionPlan(g.type,types))for(const f of q.fields){
  const value=['use','budget','bike','required','preferences'].includes(f.id)?g[f.id]:g.context?.[f.id];
  if(value===''||value===undefined||Array.isArray(value)&&!value.length)continue;
  const label=f.label;let answer=String(value);
  if(f.kind==='select')answer=f.options.find(o=>o[0]===value)?.[1]||answer;
  if(f.id==='bike')answer=products.find(p=>p.id===value)?.name||answer;
  if(Array.isArray(value))answer=value.join(', ');
  entries.push({label,answer});
 }
 return entries;
}
export function validGuideContext(g,types){
 if(g.flow===undefined)return true;if(g.flow!==2||!['','category','type'].includes(g.selection)||!Object.values(typeCategories).includes(g.category)||!g.context||typeof g.context!=='object'||Array.isArray(g.context))return false;
 const fields=questionPlan(g.type,types).flatMap(q=>q.fields);
 return Object.entries(g.context).every(([key,value])=>{
  const f=fields.find(f=>f.id===key);if(!f||typeof value!=='string'||value.length>500)return false;
  if(!value)return true;if(f.kind==='select')return f.options.some(o=>o[0]===value);
  if(f.kind==='number')return Number.isFinite(Number(value))&&Number(value)>=0&&Number(value)<=f.max;
  return f.kind==='text';
 });
}
