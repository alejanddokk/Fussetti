import {seed} from './domain.mjs';

const snapshot=p=>JSON.stringify({...p,market:{...p.market,baseline:undefined}});

// Source records are a dated listing snapshot; model names are not compatibility proof.
export function extendMarketplaceParts(s,data){
 if(!data?.productos?.length)return;
 const known=new Set(s.products.map(p=>p.id));
 const fresh=data.productos.filter(r=>!known.has('ml-'+r.id)).map(r=>({
  id:'ml-'+r.id,source:'fussetti-mercadolibre',name:r.nombre,category:'Repuestos',kind:'repuesto',
  price:r.precio_centavos,discount:0,eligible:false,stock:5,image:r.imagen,
  market:{id:r.id,url:r.url,capturedAt:data.capturado_en,installments:r.cuotas_publicadas||''}
 }));
 if(!fresh.length)return;
 const added=seed({products:fresh,branches:s.branches}).products;
 for(const p of added){
  p.attributes=[];p.capabilities=[];p.uses=[];p.compatible=[];p.compatibilityStatus='pendiente';
  p.included='Contenido, variantes y compatibilidad: a confirmar en la publicación y con la sucursal.';
  p.market.baseline=snapshot(p);
  s.products.push(p);
 }
}

// Keep the downloaded catalogue out of browser storage; preserve edited or referenced items.
export function compactMarketplaceState(s,data){
 const rows=new Map((data?.productos||[]).map(r=>['ml-'+r.id,r]));
 const used=new Set([...s.compare,...s.cart.map(r=>r.id),...s.orders.flatMap(o=>o.items.map(i=>i.id)),...s.consultations.map(c=>c.productId),...Object.values(s.profiles).flatMap(p=>p.favorites)]);
 const products=s.products.filter(p=>{
  if(p.source!=='fussetti-mercadolibre')return true;
  const row=rows.get(p.id);
  return !row||used.has(p.id)||!p.market?.baseline||p.price!==row.precio_centavos||p.name!==row.nombre||p.image!==row.imagen||snapshot(p)!==p.market.baseline;
 });
 return {...s,products};
}
