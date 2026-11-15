const text=v=>typeof v==='string'?v.trim():'';
export const branchSearchText=v=>text(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es-AR');
export function branchInfo(b){
 const lines=(b.lines||[]).filter(l=>typeof l==='string'),contacts=[],notes=[];let address=text(b.address),hours=text(b.hours);
 for(const line of lines){for(const part of line.split(/\s*\/\/\s*/)){
  const colon=part.indexOf(':');if(colon<0){notes.push(part);continue}
  const label=part.slice(0,colon).trim(),value=part.slice(colon+1).trim(),key=branchSearchText(label);
  if(!value)continue;
  if(key.startsWith('direccion')){address=address||value;continue}
  if(key.startsWith('horario')){hours=hours||value;continue}
  contacts.push({label:/^(mail|email)$/.test(key)?'Email':label,value});
 }}
 const city=text(b.city)||(text(b.address).includes(',')?text(b.address).split(',').at(-1).trim():/rosario/i.test(b.title||'')?'Rosario':'');
 return {address,hours,city,contacts,notes};
}
export function branchQuery(q=new URLSearchParams()){
 const result=new URLSearchParams();for(const key of ['q','ciudad','producto','modelo']){const value=text(q.get(key)).slice(0,120);if(value)result.set(key,value)}if(q.get('motos')==='1')result.set('motos','1');return result;
}
const suffix=q=>{const params=branchQuery(q);return params.size?'?'+params:''};
export const branchesHref=(q=new URLSearchParams())=>'#sucursales'+suffix(q);
export const branchHref=(id,q=new URLSearchParams())=>'#sucursal/'+encodeURIComponent(id)+suffix(q);
export const branchConsultHref=(id,q=new URLSearchParams())=>'#consulta?branch='+encodeURIComponent(id)+(q.get('motos')==='1'?'&motos=1':'')+['producto','modelo'].map(k=>q.get(k)?'&'+k+'='+encodeURIComponent(text(q.get(k)).slice(0,120)):'').join('');
export function branchResults(s,q=new URLSearchParams()){
 const query=branchQuery(q),search=branchSearchText(query.get('q')),city=query.get('ciudad')||'';
 const cities=[...new Set(s.branches.map(b=>branchInfo(b).city).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));
 const items=s.branches.filter(b=>{const info=branchInfo(b);return (!city||info.city===city)&&(!search||branchSearchText([b.title,info.address,info.city].join(' ')).includes(search))});
 return {items,cities,search:query.get('q')||'',city,query};
}
export function selectBranch(s,id){
 if(!s.branches.some(b=>b.id===id))throw Error('No encontramos esa sucursal.');
 const changed=s.shopping.branch!==id;s.shopping.branch=id;return changed;
}
