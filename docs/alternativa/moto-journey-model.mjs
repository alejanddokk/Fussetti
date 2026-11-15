// Name matches are discovery hints, never evidence of compatibility.
export const motoModels=s=>s.products.filter(p=>p.type==='motorcycle');
const key=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const references=[['ref-xr250','Honda XR250 Tornado',['xr250','tornado']],['ref-biz125','Honda Biz 125',['biz125']],['ref-cb250','Honda CB250 Twister',['cb250','twister']],['ref-titan150','Honda CG Titan 150',['titan150']]];
const family=p=>key(p.name).replace(/^honda/,'').replace(/[^a-z0-9]/g,'');
export function partsModelOptions(s){
 const actual=motoModels(s).map(p=>({id:p.id,name:p.name,tokens:[family(p)]}));
 const names=s.products.filter(p=>p.kind==='repuesto'||p.category==='Repuestos').map(p=>key(p.name));
 return [...actual,...references.filter(([,name,tokens])=>!actual.some(m=>key(m.name)===key(name))&&names.some(n=>tokens.some(t=>n.includes(t)))).map(([id,name,tokens])=>({id,name,tokens,reference:true}))];
}
export function partsForModel(s,modelId=''){
 const all=s.products.filter(p=>p.kind==='repuesto'||p.category==='Repuestos'),model=partsModelOptions(s).find(m=>m.id===modelId);
 if(!model)return all;
 return all.filter(p=>{
  const explicit=Array.isArray(p.compatible)&&p.compatible.includes(model.id);
  if(p.compatibilityStatus==='demo-confirmada')return explicit;
  const n=key(p.name),tokens=model.tokens.map(t=>t==='wave110s'?'wave110':t);
  return explicit||tokens.some(t=>t&&n.includes(t));
 });
}
export function journeySelection(s,raw={}){
 const models=motoModels(s),saved=s.profiles?.[s.user]?.bike;
 return {modelId:models.find(p=>p.id===raw.modelId)?.id||models.find(p=>p.id===saved)?.id||models[0]?.id||'',partsModelId:partsModelOptions(s).some(p=>p.id===raw.partsModelId)?raw.partsModelId:''};
}
export function journeyLinks(s,modelId,branchId=s.shopping.branch){
 const bike=motoModels(s).find(p=>p.id===modelId),branch=s.branches.find(b=>b.id===branchId),q=new URLSearchParams({motos:'1'});
 if(bike)q.set('producto',bike.id);
 const consult=new URLSearchParams(q);if(branch)consult.set('branch',branch.id);
 return {bike,consult:'#consulta?'+consult,maintenance:'#consulta?'+new URLSearchParams([...consult,['tema','mantenimiento']]),workshop:'#taller?'+q,services:'#services?'+q,branches:'#sucursales?'+q,branch:branch?'#sucursal/'+encodeURIComponent(branch.id)+'?'+q:'#sucursales?'+q,selectedBranch:branch};
}
