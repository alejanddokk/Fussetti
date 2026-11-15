import {classifyOfficial,officialCategory,foldOfficial} from './official-taxonomy.mjs';
import {publishedFacts,publishedCapabilities} from './knowledge.mjs';
import {seed,product,upgradeState} from './domain.mjs';

export const officialId=id=>'official-'+id;
export const isOfficial=p=>p?.source==='fussetti-official';
export function initialOfficialStock(row){
 const quantity=String(row.cantidad_publicada_texto||'').match(/^\s*(\d+)/)||String(row.disponibilidad_publicada||'').match(/Disponible:\s*(\d+)/i);
 if(quantity)return Number(quantity[1]);
 if(/out_of_stock|unavailable/.test(row.codigo_disponibilidad||''))return 0;
 // A test allowance, never an assertion about real inventory or branch stock.
 return 5;
}
export function registerOfficial(s,row){
 if(!row||!Number.isSafeInteger(row.precio_centavos)||row.precio_centavos<0)throw Error('El producto no tiene un precio publicado válido.');
 const id=officialId(row.id_oficial),existing=product(s,id);
 if(existing){
  existing.price=row.precio_centavos;existing.discount=0;existing.eligible=false;
  if(existing.officialClassification!==1){existing.type=classifyOfficial(row);existing.category=officialCategory(row.categorias[0]);existing.official.categories=row.categorias.map(officialCategory);applyOfficialFacts(existing,row);existing.officialClassification=1}
  return existing; // Never replenish depleted stock or rewrite order snapshots during migration.
 }
 const cover=row.imagenes.find(i=>i.portada)||row.imagenes[0];
 const item={id,source:'fussetti-official',name:row.nombre,model:row.modelo||'',category:officialCategory(row.categorias[0]),type:classifyOfficial(row),officialClassification:1,kind:'product',price:row.precio_centavos,discount:0,eligible:false,stock:initialOfficialStock(row),image:cover.url,
  official:{categories:row.categorias.map(officialCategory),id:row.id_oficial,reference:row.referencia||'',url:row.url_oficial,capturedAt:row.capturado_en,priceText:row.precio_texto,installments:row.cuotas_texto||'',availability:row.disponibilidad_publicada||row.cantidad_publicada_texto||'',description:row.descripcion||'',specifications:structuredClone(row.especificaciones)},
  attributes:row.especificaciones.map(x=>({label:x.nombre,value:x.valor,status:'catalogo'}))};
 // Use the existing checkout/aftercare schema without copying gallery payloads into localStorage.
 const p=seed({products:[item],branches:s.branches}).products[0];
 applyOfficialFacts(p,row);
 p.included='Contenido según la descripción publicada. Accesorios no detallados: a confirmar.';
 s.products.push(p);upgradeState(s);return p;
}

function applyOfficialFacts(p,row){
 const source=row.especificaciones.map(x=>({label:x.nombre,value:x.valor,status:'catalogo'}));
 const facts=publishedFacts(p).filter(f=>!source.some(a=>a.label===f.label)&&(f.label!=='Modelo'||row.modelo));
 const value=(...names)=>source.find(a=>names.includes(foldOfficial(a.label).trim()))?.value||'';
 const add=(label,value)=>{if(!value)return;const existing=source.concat(facts).find(a=>a.label===label);if(!existing){facts.push({label,value,status:'catalogo'});return}const a=parseFloat(existing.value.replace(',','.')),b=parseFloat(value.replace(',','.'));if(Number.isFinite(a)&&Number.isFinite(b)&&a!==b){existing.status='pendiente';existing.value='Información publicada inconsistente: '+existing.value+' / '+value+'. A confirmar.'}};
 const unit=(v,re)=>v.match(re)?.[1]?.replace(',','.');
 if(p.type==='tv'){const n=unit(value('PULGADAS','TAMANO DE PANTALLA'),/^(\d+(?:[.,]\d+)?)/);if(n)add('Pantalla',n+' pulgadas')}
 if(['phone','tablet','laptop'].includes(p.type)){const n=unit(value('MEMORIA INTERNA'),/(\d+)\s*GB\b/i);if(n)add('Almacenamiento publicado',n+' GB')}
 if(['laundry','washerdryer','dryer','scale'].includes(p.type)){const n=unit(value(...(p.type==='dryer'?['CAPACIDAD DE SECADO']:p.type==='scale'?['CAPACIDAD DE VOLUMEN']:['CAPACIDAD DE LAVADO'])),/(\d+(?:[.,]\d+)?)\s*KG\b/i);if(n)add('Capacidad publicada',n+' kg')}
 if(['fridge','freezer','waterheater','blender','fryer','oven','vacuum'].includes(p.type)){const n=unit(value('CAPACIDAD DE VOLUMEN'),/(\d+(?:[.,]\d+)?)\s*(?:L|LTS|LITROS)\b/i);if(n)add('Capacidad publicada',n+' litros')}
 if(['washer','generator','fan'].includes(p.type)){const n=unit(value('POTENCIA'),/(\d+(?:[.,]\d+)?)\s*W\b/i);if(n)add('Potencia publicada',n+' W')}
 if(p.type==='tv'){const resolution=value('RESOLUCION');if(/\b4K\b/i.test(resolution))add('Resolución publicada','UHD 4K')}

 p.attributes=[...source,...facts];p.capabilities=publishedCapabilities(p);if(p.type==='tv'&&facts.some(a=>a.label==='Resolución publicada'&&a.value==='UHD 4K')&&!p.capabilities.some(c=>c.label==='Resolución 4K'))p.capabilities.push({label:'Resolución 4K',status:'catalogo'});
}
export function extendOfficial(s,data){if(data)for(const row of data.productos)registerOfficial(s,row);if(s.compare.length)s.compare=s.compare.filter(id=>product(s,id)?.type===product(s,s.compare[0])?.type).slice(0,3);return s}
