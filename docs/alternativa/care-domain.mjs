const USERS=['ana','bruno','sofia'];
const own=(s,user)=>USERS.includes(user)&&s.profiles[user];
const product=(s,id)=>s.products.find(p=>p.id===id);
const text=(v,max=1000)=>typeof v==='string'&&v.length<=max;
const integer=v=>Number.isSafeInteger(v)&&v>=0;
export const SUPPORT_TOPICS={manual:'Manual y documentación',garantia:'Información de garantía',mantenimiento:'Mantenimiento y cuidado',producto:'Consulta sobre mi producto'};
export function isDay(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value+'T12:00:00Z').toISOString().slice(0,10)===value}
export const scenarioDay=s=>new Intl.DateTimeFormat('sv-SE',{timeZone:'America/Argentina/Buenos_Aires',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(s.clock));
export function dateLabel(value){if(!value)return 'Pendiente';const date=isDay(value)?new Date(value+'T12:00:00Z'):new Date(value);return Number.isFinite(+date)?new Intl.DateTimeFormat('es-AR',{timeZone:isDay(value)?'UTC':'America/Argentina/Buenos_Aires',dateStyle:'medium'}).format(date):'Pendiente'}
export function addDays(day,days){const d=new Date(day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10)}
export function addMonths(day,months){const d=new Date(day+'T12:00:00Z'),target=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+months,1,12));target.setUTCDate(Math.min(d.getUTCDate(),new Date(Date.UTC(target.getUTCFullYear(),target.getUTCMonth()+1,0)).getUTCDate()));return target.toISOString().slice(0,10)}
export function validDocumentUrl(value){try{if(/^\/(?![\/\\])/.test(value)&&!value.includes('\\'))return true;const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password}catch{return false}}
export function defaultAftercare(p){
 return {revision:1,documents:p.id==='hogar-3-1'?[{id:'philips-qsg-7309',title:'Guía de inicio rápido · Philips 50PUD7309/77',kind:'Guía de inicio rápido',status:'verificado',model:'50PUD7309/77',url:'https://www.documents.philips.com/assets/20240618/b57aa473521d481184e2b19300230799.pdf',source:'https://www.philips.com.ar/c-p/50PUD7309_77/televisor-led-4k-50pud7309/soporte',checkedOn:'2026-11-03'}]:[],warranty:{status:'pendiente',months:null,notes:'Condiciones y documentación de garantía pendientes de confirmar.',source:''}};
}
export function ensureCare(s){
 s.care||={version:1,registrations:[],records:[],sequence:0};
 for(const p of s.products)if(!p.aftercare)p.aftercare=defaultAftercare(p);
 for(const order of s.orders.filter(o=>o.careExample))assetsFor(s,order.user,{includeCancelled:true}).filter(a=>a.orderId===order.id).forEach((a,index)=>{const r=s.care.records.find(r=>r.user===order.user&&r.assetId===a.id);if(r?.serial==='DEMO-'+order.id+'-'+a.unit)r.serial='DEMO-'+order.id+'-'+(index+1)});
 return s;
}
const nextId=(s,prefix)=>`${prefix}-${String(++s.care.sequence).padStart(4,'0')}`;
export function assetsFor(s,user=s.user,{includeCancelled=false}={}){
 const result=[];if(!own(s,user))return result;
 for(const order of s.orders.filter(o=>o.user===user&&o.kind==='purchase'&&(includeCancelled||o.status!=='Cancelado'))){
  order.items.forEach((line,lineIndex)=>{for(let unit=0;unit<line.qty;unit++)result.push({id:JSON.stringify([order.id,lineIndex,unit]),source:'purchase',user,productId:line.id,name:line.name,image:line.image,unit:unit+1,quantity:line.qty,orderId:order.id,orderStatus:order.status,purchasedOn:scenarioDay({clock:order.created}),deliveredOn:order.deliveredAt?scenarioDay({clock:order.deliveredAt}):'',branch:order.branch,unitPrice:line.unit,policy:line.aftercare?.warranty||null,example:!!order.careExample})});
 }
 for(const r of (s.care?.registrations||[]).filter(r=>r.user===user)){
  const p=product(s,r.productId);if(p)result.push({id:r.id,source:'registered',user,productId:p.id,name:p.name,image:p.image,unit:1,quantity:1,orderId:'',orderStatus:'Modelo guardado',purchasedOn:r.purchasedOn,deliveredOn:'',branch:r.branch,unitPrice:null,policy:null,example:true});
 }
 return result;
}
export function assetFor(s,id,{includeCancelled=true}={}){return assetsFor(s,s.user,{includeCancelled}).find(a=>a.id===id)||null}
export function requireAsset(s,id,editable=true){const asset=assetFor(s,id);if(!asset)throw Error('Este producto no pertenece al perfil demo actual.');if(editable&&asset.orderStatus==='Cancelado')throw Error('La compra está cancelada. Conservamos la documentación y el historial en modo lectura.');return asset}
export function recordFor(s,id){return s.care?.records.find(r=>r.assetId===id&&r.user===s.user)||null}
function record(s,asset){let r=recordFor(s,asset.id);if(!r){r={assetId:asset.id,user:s.user,alias:'',serial:'',notes:'',warrantyDemoMonths:null,maintenance:[],reminders:[]};s.care.records.push(r)}return r}
export function registerModel(s,{productId,purchasedOn='',branch=s.shopping.branch,alias='',serial=''}){
 ensureCare(s);const p=product(s,productId);if(!p||!s.branches.some(b=>b.id===branch))throw Error('Elegí un modelo y una sucursal válidos.');
 if(purchasedOn&&(!isDay(purchasedOn)||purchasedOn>scenarioDay(s)))throw Error('La fecha de compra de ejemplo debe ser válida y no futura.');
 if(!text(alias,64)||!text(serial,100))throw Error('Revisá el nombre y el número de serie de ejemplo.');
 const r={id:nextId(s,'MODELO'),user:s.user,productId,purchasedOn,branch,created:s.clock};s.care.registrations.unshift(r);const asset=assetFor(s,r.id);Object.assign(record(s,asset),{alias:alias.trim(),serial:serial.trim()});return asset;
}
export function saveAssetDetails(s,id,{alias='',serial='',notes=''}){
 const asset=requireAsset(s,id);if(!text(alias,64)||!text(serial,100)||!text(notes,1000))throw Error('Los datos de ejemplo superan el tamaño permitido.');
 Object.assign(record(s,asset),{alias:alias.trim(),serial:serial.trim(),notes:notes.trim()});
}
export function documentResources(s,asset){
 const p=product(s,asset.productId),sameModel=doc=>!doc.model||asset.name.toUpperCase().includes(doc.model.toUpperCase());
 return (p?.aftercare?.documents||[]).map(doc=>({...doc,available:doc.status!=='pendiente'&&sameModel(doc)&&validDocumentUrl(doc.url),needsModelCheck:!sameModel(doc)}));
}
export function warrantyFor(s,asset){
 const r=recordFor(s,asset.id),policy=asset.policy||{status:'pendiente',months:null,notes:'Condiciones no registradas al realizar esta compra demo.',source:''};
 const months=r?.warrantyDemoMonths||policy.status==='demo'&&policy.months||null;
 if(asset.orderStatus==='Cancelado')return {state:'cancelled',label:'Compra cancelada',months:null,start:'',end:'',notes:'La compra de ejemplo está cancelada. Conservamos su historial; este prototipo no determina derechos de garantía.'};
 if(asset.source==='registered')return {state:'pending',label:'Compra sin verificar',months:null,start:'',end:'',notes:'Guardar un modelo no acredita una compra ni confirma su garantía.'};
 if(asset.orderStatus!=='Entregado')return {state:'pending',label:'Entrega pendiente',months:null,start:'',end:'',notes:'La operación está en preparación. Aún no hay una fecha de entrega registrada.'};
 if(!months||!asset.deliveredOn)return {state:'pending',label:'Condiciones por confirmar',months:null,start:asset.deliveredOn,end:'',notes:!asset.deliveredOn?'Esta compra anterior no tiene fecha de entrega registrada. No inferimos una fecha de inicio.':policy.notes||'Falta incorporar la documentación de garantía.'};
 const end=addMonths(asset.deliveredOn,months),past=end<scenarioDay(s);return {state:'demo',label:past?'Plazo de ejemplo finalizado':'Plazo de ejemplo',months,start:asset.deliveredOn,end,notes:'Simulación de '+months+' meses desde la entrega demo. No confirma cobertura, reparaciones ni condiciones reales.',past};
}
const asKm=value=>value===''||value===undefined||value===null?null:Number(value);
function validateKm(s,asset,value){const km=asKm(value);if(km!==null&&(!integer(km)||km>10000000||product(s,asset.productId)?.kind!=='motorcycle'))throw Error('El kilometraje debe ser un entero válido para una moto.');return km}
export function addMaintenance(s,id,{title,date,notes='',odometer=''}){
 const asset=requireAsset(s,id);if(!text(title,100)||!title.trim()||!text(notes,1000)||!isDay(date)||date>scenarioDay(s))throw Error('Ingresá una tarea, una fecha realizada válida y notas breves.');
 const km=validateKm(s,asset,odometer),entry={id:nextId(s,'CUIDADO'),title:title.trim(),date,notes:notes.trim(),odometer:km,created:s.clock,reminderId:''};record(s,asset).maintenance.unshift(entry);return entry;
}
export function addReminder(s,id,{title,date,notes='',odometer=''}){
 const asset=requireAsset(s,id);if(!text(title,100)||!title.trim()||!text(notes,1000)||!isDay(date))throw Error('Ingresá una tarea, una fecha válida y notas breves.');
 const km=validateKm(s,asset,odometer),reminder={id:nextId(s,'RECORDATORIO'),title:title.trim(),date,notes:notes.trim(),odometer:km,status:'pendiente',created:s.clock,completedOn:''};record(s,asset).reminders.unshift(reminder);return reminder;
}
export function changeReminder(s,assetId,id,status){
 const asset=requireAsset(s,assetId),r=record(s,asset),reminder=r.reminders.find(x=>x.id===id);if(!reminder||!['pendiente','realizado','descartado'].includes(status))throw Error('Recordatorio no encontrado o estado inválido.');
 if(status===reminder.status)return reminder;reminder.status=status;
 if(status==='realizado'){
  reminder.completedOn=scenarioDay(s);
  if(!r.maintenance.some(m=>m.reminderId===id))r.maintenance.unshift({id:nextId(s,'CUIDADO'),title:reminder.title,date:reminder.completedOn,notes:reminder.notes,odometer:reminder.odometer,created:s.clock,reminderId:id});
 }
 return reminder;
}
export function reminderState(s,r){return r.status!=='pendiente'?r.status:r.date<scenarioDay(s)?'Fecha pasada':r.date===scenarioDay(s)?'Hoy':'Programado'}
export function receiptFor(s,id){
 const order=s.orders.find(o=>o.id===id&&o.user===s.user);if(!order)return null;
 return {id:order.id,kind:order.kind,status:order.status,created:order.created,deliveredAt:order.deliveredAt||'',customer:order.customerName||s.profiles[order.user].name,branch:s.branches.find(b=>b.id===order.branch)?.title||'Sucursal de referencia',delivery:order.delivery||'',payment:order.payment||'',items:structuredClone(order.items),summary:structuredClone(order.summary)};
}
export function supportContext(s,id,topic){
 const asset=requireAsset(s,id,false);if(!Object.hasOwn(SUPPORT_TOPICS,topic))throw Error('Elegí un motivo de consulta válido.');const r=recordFor(s,id),w=warrantyFor(s,asset);
 const latest=[...(r?.maintenance||[])].sort((a,b)=>b.date.localeCompare(a.date))[0];
 return {assetId:id,topic,productId:asset.productId,productName:asset.name,orderId:asset.orderId,orderStatus:asset.orderStatus,serial:r?.serial||'',warrantyLabel:w.label,lastMaintenance:latest?.title||'',recordedOn:scenarioDay(s)};
}
export function seedCareExample(s,order){
 order.careExample=true;const assets=assetsFor(s).filter(a=>a.orderId===order.id);
 assets.forEach((asset,index)=>{const r=record(s,asset);r.alias=asset.productId==='hogar-3-1'?'La tele del living':'La cafetera de casa';r.serial='DEMO-'+order.id+'-'+(index+1);r.warrantyDemoMonths=12;if(!r.reminders.length)addReminder(s,asset.id,{title:'Revisar documentación y cuidado del equipo',date:addDays(scenarioDay(s),30),notes:'Recordatorio personal de ejemplo. La tarea y su fecha no proceden de un cronograma del fabricante.'})});
 return assets;
}
function validAftercare(v){
 return !!v&&v.revision===1&&Array.isArray(v.documents)&&v.documents.length<=20&&new Set(v.documents.map(d=>d.id)).size===v.documents.length&&v.documents.every(d=>text(d.id,100)&&text(d.title,200)&&text(d.kind,100)&&['pendiente','demo','verificado'].includes(d.status)&&text(d.model,100)&&text(d.url,2000)&&(!d.url||validDocumentUrl(d.url))&&text(d.source,2000)&&(!d.source||validDocumentUrl(d.source))&&text(d.checkedOn,10)&&(!d.checkedOn||isDay(d.checkedOn))&&(d.status!=='verificado'||d.model&&d.url&&d.source&&isDay(d.checkedOn)))&&v.warranty&&['pendiente','demo'].includes(v.warranty.status)&&(v.warranty.months===null||integer(v.warranty.months)&&v.warranty.months>0&&v.warranty.months<=120)&&text(v.warranty.notes,2000)&&text(v.warranty.source,2000)&&(!v.warranty.source||validDocumentUrl(v.warranty.source))&&(v.warranty.status!=='demo'||v.warranty.months>0);
}
export function validCare(s){
 try{
  if(!s.products.every(p=>p.aftercare===undefined||validAftercare(p.aftercare)))return false;
  if(!s.orders.every(o=>(o.deliveredAt===undefined||Number.isFinite(Date.parse(o.deliveredAt))&&Date.parse(o.deliveredAt)>=Date.parse(o.created))&&(o.cancelledAt===undefined||Number.isFinite(Date.parse(o.cancelledAt)))&&(o.customerName===undefined||text(o.customerName,100))&&(o.inventoryApplied===undefined||typeof o.inventoryApplied==='boolean')&&(o.inventoryApplied!==false||o.careExample===true)&&o.items.every(l=>l.aftercare===undefined||validAftercare(l.aftercare))))return false;
  if(!Array.isArray(s.consultations)||!s.consultations.every(c=>{
   if(c.care===undefined)return true;const x=c.care,a=assetsFor(s,c.user,{includeCancelled:true}).find(a=>a.id===x.assetId);
   return a&&Object.hasOwn(SUPPORT_TOPICS,x.topic)&&a.productId===x.productId&&c.productId===x.productId&&a.orderId===x.orderId&&text(x.productName,500)&&text(x.orderStatus,100)&&text(x.serial,100)&&text(x.warrantyLabel,200)&&text(x.lastMaintenance,100)&&isDay(x.recordedOn);
  }))return false;
  if(s.care===undefined)return true;
  const c=s.care;if(!c||c.version!==1||!integer(c.sequence)||!Array.isArray(c.registrations)||!Array.isArray(c.records))return false;
  if(new Set(c.registrations.map(r=>r.id)).size!==c.registrations.length||!c.registrations.every(r=>text(r.id,100)&&own(s,r.user)&&product(s,r.productId)&&s.branches.some(b=>b.id===r.branch)&&text(r.purchasedOn,10)&&(!r.purchasedOn||isDay(r.purchasedOn))&&Number.isFinite(Date.parse(r.created))))return false;
  if(new Set(c.records.map(r=>r.user+'|'+r.assetId)).size!==c.records.length)return false;
  return c.records.every(r=>{
   const asset=assetsFor(s,r.user,{includeCancelled:true}).find(a=>a.id===r.assetId);if(!asset||!text(r.alias,64)||!text(r.serial,100)||!text(r.notes,1000)||r.warrantyDemoMonths!==null&&(!integer(r.warrantyDemoMonths)||r.warrantyDemoMonths<1||r.warrantyDemoMonths>120)||!Array.isArray(r.maintenance)||!Array.isArray(r.reminders))return false;
   const km=v=>v===null||integer(v)&&v<=10000000&&product(s,asset.productId)?.kind==='motorcycle';
   return new Set(r.maintenance.map(m=>m.id)).size===r.maintenance.length&&new Set(r.reminders.map(m=>m.id)).size===r.reminders.length&&r.maintenance.every(m=>text(m.id,100)&&text(m.title,100)&&m.title.trim()&&isDay(m.date)&&text(m.notes,1000)&&km(m.odometer)&&Number.isFinite(Date.parse(m.created))&&text(m.reminderId,100)&&(!m.reminderId||r.reminders.some(x=>x.id===m.reminderId)))&&r.reminders.every(m=>text(m.id,100)&&text(m.title,100)&&m.title.trim()&&isDay(m.date)&&text(m.notes,1000)&&km(m.odometer)&&['pendiente','realizado','descartado'].includes(m.status)&&Number.isFinite(Date.parse(m.created))&&text(m.completedOn,10)&&(!m.completedOn||isDay(m.completedOn))&&(m.status!=='realizado'||isDay(m.completedOn)));
  });
 }catch{return false}
}
