import {partsModelOptions} from './moto-journey-model.mjs';
// Category and model matching use listing titles only; neither establishes fitment.
const norm=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
const compact=x=>norm(x).replace(/[^A-Z0-9]/g,'');
const clean=x=>String(x||'').replace(/[\u0000-\u001f]/g,' ').replace(/\s+/g,' ').trim().slice(0,80);
export const partFamilies=[
 ['frenos','Frenos',/FRENO|ZAPATA|PASTILLA/],
 ['transmision','Transmisión',/TRANSMISI|PINON|CORONA|CADENA/],
 ['filtros','Filtros',/FILTRO/],
 ['motor','Motor y embrague',/MOTOR|EMBRAGUE|PISTON|VALVULA|CILINDRO|CARBURADOR|ARBO[L]? DE LEVAS/],
 ['electrica','Electricidad e iluminación',/BATERIA|LAMPARA|OPTICA|FARO|GIRO|TABLERO|BOBINA|ESTATOR|ELECTRIC/],
 ['ruedas','Ruedas y neumáticos',/CUBIERTA|NEUMATIC|PIRELLI|CAMARA|LLANTA/],
 ['lubricantes','Lubricantes y fluidos',/ACEITE|LUBRICANTE|REFRIGERANTE|COOLANT/],
 ['accesorios','Accesorios y carrocería',/ESPEJO|GUARDABARRO|CUBRE|PEDALIN|MANUBRIO|ASIENTO|BAUL|TAPA|PROTECTOR/],
 ['otros','Otros repuestos',null]
];
export function partFamily(p){const n=norm(p.name);return partFamilies.find(([, ,rx])=>rx?.test(n))?.[0]||'otros'}
export function partsBike(s){const b=s.profiles?.[s.user]?.partsBike;if(!b||typeof b!=='object')return null;const model=clean(b.model);if(!model)return null;return {make:clean(b.make),model,year:clean(b.year),version:clean(b.version)}}
export function setPartsBike(s,raw){const model=clean(raw.model);if(!model)throw Error('Escribí el modelo de tu moto.');const year=clean(raw.year);if(year&&!/^(19|20)\d{2}$/.test(year))throw Error('Ingresá un año de cuatro dígitos o dejalo vacío.');s.profiles[s.user].partsBike={make:clean(raw.make),model,year,version:clean(raw.version)};return s.profiles[s.user].partsBike}
export const bikeLabel=b=>[b?.make,b?.model,b?.year,b?.version].filter(Boolean).join(' · ');
export function nameMatchesBike(p,b){const value=compact(b?.model);return value.length>=3&&compact(p.name).includes(value)}
export function partMatch(p,b){if(!b)return 'unknown';return nameMatchesBike(p,b)?'reference':'unknown'}
export function partCode(p){const m=String(p.name||'').match(/\b\d{4,6}-[a-z\d]{2,5}-[a-z\d]{2,6}\b/i);return m?m[0].toUpperCase():''}
export function searchPart(p,query){const q=clean(query),v=compact(q);if(!v)return true;const n=compact([p.name,p.market?.id,p.id].join(' '));if(n.includes(v))return true;const tokens=norm(q).split(/[^A-Z0-9]+/).filter(Boolean);return tokens.length>0&&tokens.every(t=>norm([p.name,p.market?.id,p.id].join(' ')).includes(t))}
export function filterParts(s,q,price=p=>p.price){const b=partsBike(s),family=q.get('familia')||'',search=q.get('q')||'',byBike=q.get('mi_moto')==='1'&&!!b;let list=s.products.filter(p=>p.kind==='repuesto'||p.category==='Repuestos');if(q.get('tipo'))list=list.filter(p=>p.type===q.get('tipo'));if(family&&partFamilies.some(f=>f[0]===family))list=list.filter(p=>partFamily(p)===family);if(search)list=list.filter(p=>searchPart(p,search));if(byBike)list=list.filter(p=>nameMatchesBike(p,b));if(q.get('orden')==='precio')list.sort((a,b)=>price(a)-price(b));else list.sort((a,b)=>Number(b.source==='fussetti-mercadolibre')-Number(a.source==='fussetti-mercadolibre'));return list}

// These are literal title excerpts, not verified specifications or fitment.
export function partTitleFacts(p){
 const n=String(p.name||''), out=[];let m;
 if((m=n.match(/\b(?:19|20)\d{2}\s*(?:a|al|hasta|-)\s*(?:19|20)\d{2}\b/i)))out.push({label:'Años mencionados en el título',value:m[0]});
 if((m=n.match(/\b\d{2,3}\/\d{2,3}-\d{1,2}\b/i)))out.push({label:'Medida mencionada en el título',value:m[0]});
 if((m=n.match(/\b\d{1,2}w-?\d{2}\b/i)))out.push({label:'Viscosidad mencionada en el título',value:m[0]});
 const positions=[...n.matchAll(/\b(?:delanter[oa]s?|traser[oa]s?|izquierd[oa]s?|derech[oa]s?)\b/gi)].map(x=>x[0]);
 if(positions.length)out.push({label:'Posición mencionada en el título',value:[...new Set(positions)].join(' · ')});
 return out;
}

// Model suggestions are search terms derived from the site's own models, not fitment data.
export function suggestedPartsModels(s){
 const seen=new Set(),out=[];
 for(const entry of partsModelOptions(s)){
  const n=String(entry.name||'').replace(/^HONDA\s+/i,'').trim();
  const common=n.match(/\b(WAVE|XR|CB|BIZ)\s*(\d{2,3})/i);
  const titan=n.match(/\bTITAN\s*(\d{2,3})/i);
  const model=common?common[1].toUpperCase()+' '+common[2]:titan?'TITAN '+titan[1]:n;
  const key=compact(model);if(!key||seen.has(key))continue;seen.add(key);
  out.push({model,make:/^HONDA\b/i.test(entry.name)?'Honda':'',count:s.products.filter(p=>(p.kind==='repuesto'||p.category==='Repuestos')&&nameMatchesBike(p,{model})).length});
 }
 return out;
}
export function partsQuery(q,changes={}){
 const next=new URLSearchParams(q);next.set('cat','Repuestos');next.delete('pagina');
 for(const [key,value] of Object.entries(changes)){if(value===null||value===undefined||value==='')next.delete(key);else next.set(key,String(value))}
 return next;
}
