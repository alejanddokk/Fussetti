import {partsBike} from './repuestos-experiencia-model.mjs';
import {officialTypes} from './official-taxonomy.mjs';
import {normalizeCheckout,validCheckoutDraft} from './checkout-model.mjs';
import {ensureCare,validCare,seedCareExample,supportContext} from './care-domain.mjs';
import {enrichKnowledge,publishedFacts,publishedCapabilities,KNOWLEDGE_REVISION} from './knowledge.mjs';
import {newGuide,normalizeGuide,matchesGuideContext,validGuideContext} from './guide-plan.mjs';
export const KEY='fussetti-alternativa-demo-v1';
export const money=n=>new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:2}).format(n/100);
export const types={
 ...officialTypes,
 fridge:{name:"Heladeras",uses:['Uso cotidiano'],features:[]},
 speaker:{name:"Parlantes",uses:['Uso cotidiano'],features:[]},
 gazebo:{name:"Gazebos",uses:['Uso cotidiano'],features:[]},
 umbrella:{name:"Sombrillas",uses:['Uso cotidiano'],features:[]},
 tent:{name:"Carpas",uses:['Uso cotidiano'],features:[]},
 hood:{name:"Purificadores de cocina",uses:['Uso cotidiano'],features:[]},
 fryer:{name:"Freidoras",uses:['Uso cotidiano'],features:[]},
 microwave:{name:"Microondas",uses:['Uso cotidiano'],features:[]},
 bicycle:{name:"Bicicletas",uses:['Uso cotidiano'],features:[]},
 chair:{name:"Sillones de exterior",uses:['Uso cotidiano'],features:[]},
 hairdryer:{name:"Secadores de cabello",uses:['Uso cotidiano'],features:[]},
 thermos:{name:"Termos",uses:['Uso cotidiano'],features:[]},
 mixer:{name:"Batidoras",uses:['Uso cotidiano'],features:[]},
 trimmer:{name:"Bordeadoras",uses:['Uso cotidiano'],features:[]},

 tv:{name:'Televisores',uses:['Series y películas','Uso familiar','Videojuegos'],features:['Smart TV','Pantalla grande','Resolución 4K']},
 phone:{name:'Celulares',uses:['Uso cotidiano','Trabajo y estudio','Fotos y entretenimiento'],features:['Almacenamiento amplio','Uso simple','Pantalla amplia']},
 console:{name:'Consolas',uses:['Videojuegos','Entretenimiento familiar'],features:['Juego en compañía','Biblioteca amplia']},
 air:{name:'Aires acondicionados',uses:['Climatizar un ambiente','Confort diario'],features:['Frío / calor','Tecnología inverter']},
 fan:{name:'Ventiladores',uses:['Refrescar un ambiente','Confort diario'],features:['De pie','Gran diámetro']},
 motorcycle:{name:'Motos',uses:['Movilidad diaria','Paseos y recorridos','Uso mixto'],features:['Uso urbano','Uso mixto','Manejo accesible']},
 oil:{name:'Lubricantes',uses:['Mantenimiento de la moto','Reposición'],features:['Uso en mantenimiento','Presentación pequeña']},
 transmission:{name:'Kits de transmisión',uses:['Mantenimiento de la moto','Reemplazo de piezas'],features:['Kit de piezas','Compatibilidad confirmada']},
 spare:{name:'Otros repuestos',uses:['Reemplazo de piezas','Cuidado de la moto'],features:['Compatibilidad confirmada','Protección']},
 tire:{name:'Neumáticos',uses:['Reemplazo de piezas','Cuidado de la moto'],features:['Uso urbano','Compatibilidad confirmada']},
 coffee:{name:'Cafeteras',uses:['Desayunos y meriendas','Uso cotidiano'],features:['Formato compacto','Preparación simple']},
 oven:{name:'Hornos eléctricos',uses:['Cocinar en casa','Uso familiar'],features:['Gran capacidad','Preparación simple']},
 yogurt:{name:'Yogurteras',uses:['Preparar en casa','Uso cotidiano'],features:['Porciones individuales','Preparación simple']},
 scale:{name:'Balanzas de cocina',uses:['Cocinar en casa','Preparar en casa'],features:['Formato compacto','Medición digital']},
 vacuum:{name:'Aspiradoras',uses:['Limpieza del hogar','Mantenimiento'],features:['Polvo y agua','Formato compacto']},
 washer:{name:'Hidrolavadoras',uses:['Limpieza exterior','Mantenimiento'],features:['Uso exterior','Limpieza con agua']},
 generator:{name:'Generadores',uses:['Respaldo de energía','Trabajo'],features:['Uso exterior','Equipo portátil']},
 mower:{name:'Cortadoras de césped',uses:['Cuidado del jardín','Mantenimiento'],features:['Motor eléctrico','Uso exterior']}
};
// Legacy or unclassified records remain valid for checkout but are excluded from guide type choices.
Object.defineProperty(types,'official',{value:{name:'Producto del catálogo oficial',uses:[],features:[]},enumerable:false});
function typeOf(p){const n=p.name.toUpperCase();if(p.kind==='motorcycle')return 'motorcycle';if(p.kind==='repuesto')return /ACEITE|MOTUL|REFRIGERANTE/.test(n)?'oil':/TRANSMISI/.test(n)?'transmission':/PIRELLI/.test(n)?'tire':'spare';for(const [word,type] of [['SMART TV','tv'],['CELULAR','phone'],['CONSOLA','console'],['AIRE ACONDICIONADO','air'],['VENTILADOR','fan'],['CAFETERA','coffee'],['HORNO','oven'],['YOGURTERA','yogurt'],['BALANZA','scale'],['ASPIRADORA','vacuum'],['HIDROLAVADORA','washer'],['GENERADOR','generator'],['CORTADORA','mower']])if(n.includes(word))return type;return 'spare'}
function enrich(p){const type=p.type||typeOf(p);return enrichKnowledge({...p,type,attributes:[...publishedFacts({...p,type}),{label:'Contenido y condiciones',value:'A confirmar con la sucursal',status:'pendiente'}],capabilities:publishedCapabilities({...p,type}),uses:[],compatible:[],compatibilityStatus:'pendiente',services:['Retiro en sucursal demo','Asesoramiento demo'],branchIds:[],included:'Unidad del modelo publicado. Accesorios y condiciones de entrega: a confirmar.'})}
export function upgradeState(s){
 for(const p of s.products)if(p.knowledgeRevision!==KNOWLEDGE_REVISION)enrichKnowledge(p);
 normalizeGuide(s.guide);s.shopping||={};if(!s.branches.some(b=>b.id===s.shopping.branch))s.shopping.branch=s.branches[0].id;
 normalizeCheckout(s);return ensureCare(s);
}
export function seed(catalog){const s={version:1,clock:'2026-11-03T12:00:00-03:00',products:catalog.products.map(enrich),branches:structuredClone(catalog.branches),user:'ana',profiles:{ana:{name:'Ana Demo',favorites:[],bike:''},bruno:{name:'Bruno Demo',favorites:[],bike:''},sofia:{name:'Sofía Demo',favorites:[],bike:''}},guide:{...newGuide('tv'),selection:'category'},compare:[],cart:[],orders:[],consultations:[],events:[],config:{offers:true,shipping:800000},sequence:0};for(const p of s.products)p.branchIds=s.branches.map(b=>b.id);return upgradeState(s)}
export const unitPrice=(s,p)=>p.source==='fussetti-official'?p.price:s.config.offers&&p.eligible&&Number.isInteger(p.salePrice)&&p.price===p.cyberBasePrice&&p.discount===p.cyberDiscount?p.salePrice:Math.round(p.price*(1-(s.config.offers&&p.eligible?p.discount:0)/100));
export const product=(s,id)=>s.products.find(p=>p.id===id);
export const profile=s=>s.profiles[s.user];
export function event(s,name,detail=''){s.events.unshift({name,detail,at:s.clock});s.events=s.events.slice(0,500)}
export function toggleCompare(s,id){const p=product(s,id);if(!p)throw Error('Producto no encontrado.');if(p.type==='official')throw Error('Falta clasificar este producto para poder compararlo.');if(s.compare.includes(id)){s.compare=s.compare.filter(x=>x!==id);return}if(s.compare.length>=3)throw Error('Podés comparar hasta tres productos. Quitá uno para agregar otro.');if(s.compare.length&&product(s,s.compare[0]).type!==p.type)throw Error('Elegí productos del mismo tipo para comparar diferencias útiles.');s.compare.push(id);event(s,'comparison_add',id)}
export function recommendations(s,g=s.guide){const candidates=s.products.filter(p=>p.type===g.type);const typed=candidates.some(p=>p.source==='fussetti-official')?candidates.filter(p=>p.source==='fussetti-official'):candidates;const available=typed.filter(p=>p.stock>0);const affordable=available.filter(p=>g.budget===''||unitPrice(s,p)<=Number(g.budget)*100);const required=affordable.filter(p=>g.required.every(f=>p.capabilities.some(c=>c.label===f&&c.status!=='pendiente')));const contextual=required.filter(p=>matchesGuideContext(p,g));const compatible=contextual.filter(p=>!g.bike||p.compatibilityStatus==='demo-confirmada'&&p.compatible.includes(g.bike));const ranked=compatible.map(p=>({p,score:Number(!g.use||p.uses.includes(g.use))+g.preferences.filter(f=>p.capabilities.some(c=>c.label===f&&c.status!=='pendiente')).length})).sort((a,b)=>b.score-a.score||unitPrice(s,a.p)-unitPrice(s,b.p)||a.p.id.localeCompare(b.p.id));let reason=!typed.length?'No hay productos de este tipo.':!available.length?'No hay disponibilidad demo para este tipo.':!affordable.length?'El presupuesto no alcanza para las opciones disponibles.':!required.length?'Entre las opciones disponibles dentro de tu presupuesto, ninguna tiene confirmados todos los requisitos obligatorios.':!contextual.length?'No hay opciones disponibles con los datos publicados que cumplan el tamaño, la capacidad o la especificación que elegiste.':!compatible.length?'No hay compatibilidad confirmada en la demo para la moto elegida.':'';return {items:ranked.slice(0,3).map(x=>x.p),reason,total:compatible.length}}
export function add(s,id){const p=product(s,id);if(!p||p.stock<1)throw Error('Producto sin disponibilidad demo.');if(p.kind==='motorcycle')throw Error('Las motos se gestionan con una reserva.');if(s.shopping?.branch&&!p.branchIds.includes(s.shopping.branch))throw Error('Este producto no está disponible en la sucursal demo elegida. Podés cambiarla desde la ficha.');const row=s.cart.find(x=>x.id===id);if((row?.qty||0)>=p.stock)throw Error('Alcanzaste la disponibilidad demo.');if(row)row.qty++;else s.cart.push({id,qty:1});event(s,'cart_add',id)}
export function quote(s,{delivery='retiro',branch=s.shopping?.branch||s.branches[0]?.id}={}){const errors=[];if(!s.cart.length)errors.push('Tu carrito está vacío.');const selected=s.branches.find(b=>b.id===branch);if(!selected)errors.push('Elegí una sucursal válida.');if(!['retiro','envio'].includes(delivery))errors.push('Elegí entrega o retiro.');let base=0,subtotal=0;const lines=[];for(const row of s.cart){const p=product(s,row.id);if(!p||!Number.isInteger(row.qty)||row.qty<1||p.kind==='motorcycle'){errors.push('Revisá la cantidad y disponibilidad de tu carrito.');continue}if(row.qty>p.stock)errors.push('Revisá la cantidad y disponibilidad de tu carrito.');if(selected&&!p.branchIds.includes(branch))errors.push(`${p.name}: no disponible en esta sucursal demo.`);base+=p.price*row.qty;subtotal+=unitPrice(s,p)*row.qty;lines.push({id:p.id,name:p.name,image:p.image,qty:row.qty,unit:unitPrice(s,p),...(p.source==='fussetti-official'?{official:structuredClone(p.official)}:{})})}const shipping=delivery==='envio'?s.config.shipping:0;return {base,discount:base-subtotal,subtotal,shipping,total:subtotal+shipping,lines,errors}}
function nextId(s,prefix){return `${prefix}-${String(++s.sequence).padStart(4,'0')}`}
export function purchase(s,options){const q=quote(s,options);if(q.errors.length)throw Error(q.errors.join(' '));if(options.payment==='rechazado')throw Error('Pago demo rechazado. Podés elegir otro medio simulado.');if(!['tarjeta-demo','transferencia-demo'].includes(options.payment))throw Error('Elegí un medio de pago demo.');const order={id:nextId(s,'ALT'),kind:'purchase',user:s.user,status:'Recibido',created:s.clock,branch:options.branch,delivery:options.delivery,payment:options.payment,customerName:profile(s).name,inventoryApplied:true,items:q.lines.map(l=>({...l,aftercare:structuredClone(product(s,l.id).aftercare)})),summary:{base:q.base,discount:q.discount,subtotal:q.subtotal,shipping:q.shipping,total:q.total}};for(const row of q.lines)product(s,row.id).stock-=row.qty;s.orders.unshift(order);s.cart=[];event(s,'order_demo',order.id);return order}
export function reserve(s,id,kind,branch){const p=product(s,id);if(!p||p.kind!=='motorcycle'||p.stock<1)throw Error('Moto sin disponibilidad demo.');if(!['reservation','finance'].includes(kind)||!s.branches.some(b=>b.id===branch)||!p.branchIds.includes(branch))throw Error('Elegí una sucursal y operación disponibles.');const o={id:nextId(s,'MOTO'),kind,user:s.user,status:'Recibido',created:s.clock,branch,items:[{id:p.id,name:p.name,image:p.image,qty:1,unit:unitPrice(s,p)}],summary:{total:0}};p.stock--;s.orders.unshift(o);event(s,'reservation_demo',o.id);return o}
export function setStatus(s,id,status){const o=s.orders.find(o=>o.id===id);if(!o||!['Recibido','Confirmado','Entregado','Cancelado'].includes(status))throw Error('Estado inválido.');if(o.status===status)return;if(o.status==='Cancelado')throw Error('Un pedido cancelado no puede reactivarse.');if(status!=='Cancelado'&&['Recibido','Confirmado','Entregado'].indexOf(status)<['Recibido','Confirmado','Entregado'].indexOf(o.status))throw Error('El pedido no puede retroceder.');if(status==='Entregado'&&!o.deliveredAt){if(Date.parse(s.clock)<Date.parse(o.created))throw Error('La entrega demo no puede ser anterior a la compra.');o.deliveredAt=s.clock}if(status==='Cancelado')o.cancelledAt=s.clock;if(status==='Cancelado'&&o.inventoryApplied!==false)for(const l of o.items){const p=product(s,l.id);if(p)p.stock+=l.qty}o.status=status;event(s,'order_status',`${id}: ${status}`)}
export function consult(s,{branch,productId='',message='',assetId='',topic='producto',partsContext=false}){if(!s.branches.some(b=>b.id===branch))throw Error('Elegí una sucursal.');const care=assetId?supportContext(s,assetId,topic):null;if(care&&care.productId!==productId)throw Error('El producto no coincide con el equipo de la consulta.');const bike=(partsContext||product(s,productId)?.kind==='repuesto')?partsBike(s):null;const c={id:nextId(s,'CONS'),branch,productId,...(care?{care}:{}),...(bike?{partsBike:structuredClone(bike)}:{}),guide:structuredClone(s.guide),compare:[...s.compare],message,user:s.user,created:s.clock};s.consultations.unshift(c);event(s,'consultation_demo',c.id);return c}
export function createCareExample(s){
 ensureCare(s);const existing=s.orders.find(o=>o.user===s.user&&o.careExample);if(existing)return existing;
 const items=['hogar-0-0','hogar-3-1'].map(id=>product(s,id)).filter(Boolean).map(p=>({id:p.id,name:p.name,image:p.image,qty:1,unit:unitPrice(s,p),aftercare:structuredClone(p.aftercare)}));
 if(!items.length)throw Error('No hay modelos para preparar el ejemplo de posventa.');
 const base=items.reduce((n,l)=>n+product(s,l.id).price,0),subtotal=items.reduce((n,l)=>n+l.unit,0);
 const o={id:nextId(s,'EJEMPLO'),kind:'purchase',user:s.user,customerName:profile(s).name,status:'Entregado',created:s.clock,deliveredAt:s.clock,branch:s.shopping.branch,delivery:'retiro',payment:'tarjeta-demo',items,careExample:true,inventoryApplied:false,summary:{base,discount:base-subtotal,subtotal,shipping:0,total:subtotal}};
 s.orders.unshift(o);seedCareExample(s,o);event(s,'care_example',o.id);return o;
}
export function prepareScenario(s,name){
 const g={step:5,type:'tv',use:'',required:[],preferences:[],bike:'',budget:''};
 if(name==='presupuesto')g.budget='1';
 else if(name==='pendientes'){
  g.required=['Resolución 4K'];
  s.products.filter(p=>p.type==='tv').forEach(p=>p.capabilities=p.capabilities.map(c=>c.label==='Resolución 4K'?{...c,status:'pendiente'}:c));
 }else if(name==='agotado'){
  g.type='coffee';s.products.filter(p=>p.type==='coffee').forEach(p=>p.stock=0);
 }else if(name==='compatibilidad'){
  const bike=s.products.find(p=>p.kind==='motorcycle'),part=s.products.find(p=>p.type==='spare');
  if(!bike||!part)throw Error('Faltan productos para preparar este caso.');
  part.stock=Math.max(1,part.stock);part.compatible=[bike.id];part.compatibilityStatus='demo-confirmada';
  part.capabilities=part.capabilities.filter(c=>c.label!=='Compatibilidad confirmada').concat({label:'Compatibilidad confirmada',status:'demo'});
  profile(s).bike=bike.id;g.type=part.type;g.bike=bike.id;
 }else throw Error('Escenario no reconocido.');
 s.guide=g;event(s,'scenario_demo',name);
}
const int=n=>Number.isSafeInteger(n)&&n>=0;
const text=x=>typeof x==='string';
const strings=x=>Array.isArray(x)&&x.every(text);
const localImage=x=>text(x)&&/^\/(?![\/\\])/.test(x)&&!x.includes('\\');
const brandImage=x=>{
 if(localImage(x))return true;
 if(!text(x)||x.includes('\\'))return false;
 try{
  const asset=new URL(x);
  return asset.origin==='https://fussetti-replica-20261102.germanvives15.chatgpt.site'&&!asset.username&&!asset.password&&/^\/(?:alternativa\/|motos\/|nueva\/)?assets\//.test(asset.pathname);
 }catch{return false}
};
const productImage=x=>brandImage(x)||text(x)&&(/^https:\/\/www\.fussetti\.com\/\d+-large_default\/[a-zA-Z0-9_-]+\.(jpg|png|webp)$/.test(x)||/^https:\/\/http2\.mlstatic\.com\/D_[A-Za-z0-9_-]+\.(jpg|png|webp)$/.test(x));
const validOfficial=o=>!!o&&text(o.id)&&/^\d+$/.test(o.id)&&['reference','url','priceText','installments','availability','description'].every(k=>text(o[k]))&&o.url.startsWith('https://www.fussetti.com/')&&Array.isArray(o.specifications)&&o.specifications.every(a=>a&&text(a.nombre)&&text(a.valor));
const unique=x=>new Set(x).size===x.length;
const knownType=x=>text(x)&&Object.hasOwn(types,x);
function validGuide(g,products){
 return !!g&&int(g.step)&&g.step>=1&&g.step<=5&&knownType(g.type)&&g.type!=='official'&&(!g.searchContext||typeof g.searchContext.query==='string'&&g.searchContext.query.length<=100&&typeof g.searchContext.category==='string'&&g.searchContext.category.length<=80)&&text(g.use)&&strings(g.required)&&strings(g.preferences)&&g.required.concat(g.preferences).every(f=>types[g.type].features.includes(f))&&text(g.bike)&&(!g.bike||products.some(p=>p.id===g.bike&&p.kind==='motorcycle'))&&text(g.budget)&&(g.budget===''||Number.isFinite(Number(g.budget))&&Number(g.budget)>=0&&Number.isSafeInteger(Math.round(Number(g.budget)*100)))&&validGuideContext(g,types);
}
export function valid(s){
 try{
  if(!s||s.version!==1||!Number.isFinite(Date.parse(s.clock))||!int(s.sequence)||!s.config||typeof s.config.offers!=='boolean'||!int(s.config.shipping))return false;
  if(!Array.isArray(s.products)||!s.products.length||!s.products.every(p=>p&&text(p.id)&&p.id&&text(p.name)&&text(p.category)&&knownType(p.type)&&['motorcycle','product','repuesto'].includes(p.kind)&&(p.type==='motorcycle')===(p.kind==='motorcycle')&&int(p.price)&&(p.salePrice===undefined||(int(p.salePrice)&&p.salePrice<=p.price))&&int(p.stock)&&int(p.discount)&&p.discount<=80&&typeof p.eligible==='boolean'&&productImage(p.image)&&strings(p.uses)&&strings(p.compatible)&&strings(p.services)&&strings(p.branchIds)&&text(p.included)&&['pendiente','demo-confirmada'].includes(p.compatibilityStatus)&&(p.compatibilityStatus!=='demo-confirmada'||p.compatible.length>0)&&Array.isArray(p.attributes)&&p.attributes.every(a=>a&&text(a.label)&&text(a.value)&&['catalogo','demo','pendiente'].includes(a.status))&&Array.isArray(p.capabilities)&&p.capabilities.every(a=>a&&text(a.label)&&['catalogo','demo','pendiente'].includes(a.status))))return false;
  if(!s.products.every(p=>p.source!=='fussetti-official'?p.type!=='official':validOfficial(p.official)&&p.id==='official-'+p.official.id))return false;
  const ids=new Set(s.products.map(p=>p.id));if(ids.size!==s.products.length)return false;
  if(!Array.isArray(s.branches)||!s.branches.length||!s.branches.every(b=>b&&text(b.id)&&text(b.title)&&brandImage(b.image)&&strings(b.lines)&&(b.address===undefined||text(b.address))))return false;
  const branches=new Set(s.branches.map(b=>b.id));if(branches.size!==s.branches.length||!s.products.every(p=>p.branchIds.every(b=>branches.has(b))&&p.compatible.every(id=>s.products.some(m=>m.id===id&&m.kind==='motorcycle'))))return false;
  if(!s.profiles||!['ana','bruno','sofia'].includes(s.user)||!['ana','bruno','sofia'].every(id=>s.profiles[id]&&text(s.profiles[id].name)&&strings(s.profiles[id].favorites)&&s.profiles[id].favorites.every(x=>ids.has(x))&&text(s.profiles[id].bike)&&(!s.profiles[id].bike||s.products.some(p=>p.id===s.profiles[id].bike&&p.kind==='motorcycle'))))return false;
  if(!validGuide(s.guide,s.products)||!validGuideContext(s.guide,types)||s.shopping&&(!s.shopping.branch||!branches.has(s.shopping.branch)||s.shopping.checkout!==undefined&&!validCheckoutDraft(s.shopping.checkout)))return false;
  const validComparison=list=>strings(list)&&list.length<=3&&unique(list)&&list.every(id=>ids.has(id))&&new Set(list.map(id=>product(s,id).type)).size<=1;
  if(!validComparison(s.compare)||!Array.isArray(s.cart)||!s.cart.every(r=>r&&ids.has(r.id)&&product(s,r.id).kind!=='motorcycle'&&int(r.qty)&&r.qty>0)||!unique(s.cart.map(r=>r.id)))return false;
  if(!Array.isArray(s.orders)||!unique(s.orders.map(o=>o.id))||!s.orders.every(o=>{
   if(!o||!text(o.id)||!['ana','bruno','sofia'].includes(o.user)||!branches.has(o.branch)||!['purchase','reservation','finance'].includes(o.kind)||!['Recibido','Confirmado','Entregado','Cancelado'].includes(o.status)||!Number.isFinite(Date.parse(o.created))||!Array.isArray(o.items)||!o.items.length||!o.items.every(l=>l&&ids.has(l.id)&&text(l.name)&&productImage(l.image)&&int(l.qty)&&l.qty>0&&int(l.unit)&&(l.official===undefined||validOfficial(l.official)))||!o.summary||!int(o.summary.total))return false;
   if(o.kind!=='purchase')return o.summary.total===0&&o.items.length===1&&o.items[0].qty===1&&product(s,o.items[0].id).kind==='motorcycle';
   const q=o.summary,lineTotal=o.items.reduce((n,l)=>n+l.unit*l.qty,0);
   return ['retiro','envio'].includes(o.delivery)&&['tarjeta-demo','transferencia-demo'].includes(o.payment)&&['base','discount','subtotal','shipping'].every(k=>int(q[k]))&&q.subtotal===lineTotal&&q.base-q.discount===q.subtotal&&q.total===q.subtotal+q.shipping;
  }))return false;
  if(!validCare(s))return false;
 return Array.isArray(s.consultations)&&unique(s.consultations.map(c=>c.id))&&s.consultations.every(c=>c&&text(c.id)&&branches.has(c.branch)&&['ana','bruno','sofia'].includes(c.user)&&text(c.message)&&text(c.productId)&&(!c.productId||ids.has(c.productId))&&validComparison(c.compare)&&validGuide(c.guide,s.products)&&validGuideContext(c.guide,types)&&Number.isFinite(Date.parse(c.created)))&&Array.isArray(s.events)&&s.events.every(x=>x&&text(x.name)&&text(x.detail)&&Number.isFinite(Date.parse(x.at)));
 }catch{return false}
}
