import {types,unitPrice} from './domain.mjs';
export const SEARCH_HISTORY_KEY='fussetti-alternativa-search-v1';
export const SEARCH_CATEGORIES=['Hogar','Electrodomésticos','Tecnología','TV y audio','Climatización','Jardín','Motos','Repuestos'];
export const cleanQuery=value=>String(value??'').replace(/[\u0000-\u001f]/g,' ').replace(/\s+/g,' ').trim().slice(0,100);
export const normalizeSearch=value=>cleanQuery(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/(\d)\s+(gb|tb|kg|cm|mm|mah|w)\b/g,'$1$2').trim();
const aliases={tele:'tv',teles:'tv',televisor:'tv',televisores:'tv',celu:'celular',celus:'celular',celulares:'celular',telefono:'celular',telefonos:'celular',smartphone:'celular',smartphones:'celular',movil:'celular',moviles:'celular',laptop:'notebook',laptops:'notebook',notebooks:'notebook',portatil:'notebook',heladeras:'heladera',nevera:'heladera',lavadora:'lavarropas',lavadoras:'lavarropas',refrigerador:'heladera',refrigeradores:'heladera',frigorifico:'heladera',parlantes:'parlante',altavoz:'parlante',altavoces:'parlante',auricular:'auricular',auriculares:'auricular',audifonos:'auricular',freezers:'freezer',consolas:'consola',pulgadas:'pulgada',pulg:'pulgada',pavas:'pava',cafeteras:'cafetera',microondas:'microondas'};
const stop=new Set(['de','del','para','el','la','las','los','un','una','unos','unas','y','con','pulgada']);
export function searchTerms(value){return [...new Set(normalizeSearch(value).split(' ').flatMap(t=>/^\d+[a-z]+$/.test(t)?[t,t.match(/^\d+/)[0]]:[t]).map(t=>aliases[t]||t).filter(t=>t&&!stop.has(t)))].slice(0,16)}
const compact=v=>normalizeSearch(v).replace(/ /g,'');
export const searchCategory=p=>SEARCH_CATEGORIES.find(c=>normalizeSearch(c)===normalizeSearch(p.category))||p.category;
export const inSearchCategory=(p,category)=>!category||searchCategory(p)===category||(p.official?.categories||[]).some(c=>normalizeSearch(c)===normalizeSearch(category));
// One edit, including an adjacent transposition. Numbers/model codes are never corrected.
export function nearWord(a,b){
 if(a.length<4||b.length<4||!/^[a-z]+$/.test(a+b)||Math.abs(a.length-b.length)>1)return false;
 if(a.length===b.length){const d=[];for(let i=0;i<a.length;i++)if(a[i]!==b[i])d.push(i);return d.length===1||d.length===2&&d[1]===d[0]+1&&a[d[0]]===b[d[1]]&&a[d[1]]===b[d[0]]}
 const short=a.length<b.length?a:b,long=a.length<b.length?b:a;let i=0,j=0,skipped=0;while(i<short.length&&j<long.length){if(short[i]===long[j]){i++;j++}else{if(++skipped>1)return false;j++}}return true;
}
export function indexedProducts(products){
 const official=products.filter(p=>p.source==='fussetti-official'),names=new Set(official.map(p=>compact(p.name))),sourceIds=new Set(official.map(p=>p.official.id));
 return products.filter(p=>p.source==='fussetti-official'||!names.has(compact(p.name))&&!sourceIds.has(p.sourceUrl?.match(/\/(\d+)-[^/]*\.html/)?.[1]));
}
function matchProduct(p,query,terms){
 const q=compact(query),ref=compact(p.official?.reference||''),model=compact(p.model||''),name=normalizeSearch(p.name);
 if(q&&q===ref)return {score:10000,fuzzy:0};if(q&&q===model)return {score:9000,fuzzy:0};
 const nameTerms=searchTerms(p.name),tokens=[...new Set([...nameTerms,...searchTerms([p.model,types[p.type]?.name,p.category,p.official?.reference,...(p.attributes||[]).filter(a=>a.status==='catalogo').map(a=>a.label+' '+a.value)].join(' '))])];
 let score=name===normalizeSearch(query)?6000:name.includes(normalizeSearch(query))?100:0,fuzzy=0;
 for(const term of terms){
  if(tokens.includes(term)){score+=nameTerms.includes(term)?35:18;continue}
  if(term.length>=2&&tokens.some(t=>t.startsWith(term))){score+=nameTerms.some(t=>t.startsWith(term))?16:8;continue}
  if(!fuzzy&&tokens.some(t=>nearWord(term,t))){fuzzy++;score+=nameTerms.some(t=>nearWord(term,t))?11:3;continue}
  return null;
 }
 return {score:score+(p.stock>0?1:0),fuzzy};
}
export function searchProducts(products,query,{category='',type='',available=false,maxPrice=null,order='relevancia',state={config:{offers:false}}}={}){
 const text=cleanQuery(query),terms=searchTerms(text),price=Number.isSafeInteger(maxPrice)&&maxPrice>=0?maxPrice:null;
 const matches=indexedProducts(products).filter(p=>inSearchCategory(p,category)&&(!type||p.type===type)&&(!available||p.stock>0)&&(price===null||unitPrice(state,p)<=price)).flatMap(p=>{const match=terms.length?matchProduct(p,text,terms):text?null:{score:0,fuzzy:0};return match?[{p,...match}]:[]});
 matches.sort((a,b)=>order==='precio'?unitPrice(state,a.p)-unitPrice(state,b.p):order==='precio-desc'?unitPrice(state,b.p)-unitPrice(state,a.p):b.score-a.score||a.p.name.localeCompare(b.p.name,'es')||a.p.id.localeCompare(b.p.id));
 const groups=new Map();for(const {p} of matches){const g=groups.get(p.type)||{type:p.type,label:types[p.type]?.name||p.category,count:0};g.count++;groups.set(p.type,g)}
 return {matches,total:matches.length,groups:[...groups.values()].sort((a,b)=>b.count-a.count||a.label.localeCompare(b.label,'es')),fuzzy:matches.some(m=>m.fuzzy>0)};
}
export function searchUrl(query,{category='',type='',available=false,max='',order='',page=1,context=''}={}){
 const q=new URLSearchParams({q:cleanQuery(query)});if(SEARCH_CATEGORIES.includes(category))q.set('cat',category);if(type&&Object.hasOwn(types,type))q.set('tipo',type);if(available)q.set('stock','1');if(max!=='')q.set('max',String(max));if(order&&order!=='relevancia')q.set('orden',order);if(page>1)q.set('pagina',String(Math.floor(page)));if(SEARCH_CATEGORIES.includes(context))q.set('desde',context);return '#buscar?'+q;
}
export function searchOptions(q){const raw=String(q.get('max')||'').replace(',','.'),n=raw===''?null:Number(raw);return {category:SEARCH_CATEGORIES.includes(q.get('cat'))?q.get('cat'):'',type:Object.hasOwn(types,q.get('tipo'))?q.get('tipo'):'',available:q.get('stock')==='1',maxPrice:n!==null&&Number.isFinite(n)&&n>=0&&Number.isSafeInteger(Math.round(n*100))?Math.round(n*100):null,order:['precio','precio-desc'].includes(q.get('orden'))?q.get('orden'):'relevancia'}}
export function contextCategory(s,r){if(SEARCH_CATEGORIES.includes(r.q.get('desde')))return r.q.get('desde');if(SEARCH_CATEGORIES.includes(r.q.get('cat')))return r.q.get('cat');const routes={hogar:'Hogar',electrodomesticos:'Electrodomésticos',tecnologia:'Tecnología','tv-audio':'TV y audio',motos:'Motos','motos-focus':'Motos'};if(routes[r.path[0]])return routes[r.path[0]];if(['producto','producto-oficial'].includes(r.path[0])){const p=s.products.find(p=>p.id===r.path[1]||p.official?.id===r.path[1]);return p?searchCategory(p):''}return ''}
export function readSearchHistory(storage){try{const data=JSON.parse(storage.getItem(SEARCH_HISTORY_KEY)||'[]');return Array.isArray(data)?data.filter(x=>x&&typeof x.query==='string'&&cleanQuery(x.query)===x.query&&x.query.length>=2&&typeof x.category==='string'&&(!x.category||SEARCH_CATEGORIES.includes(x.category))).slice(0,6):[]}catch{return []}}
export function rememberSearch(storage,query,category=''){const text=cleanQuery(query);if(text.length<2)return;const item={query:text,category:SEARCH_CATEGORIES.includes(category)?category:''},list=readSearchHistory(storage).filter(x=>normalizeSearch(x.query)!==normalizeSearch(text)||x.category!==item.category);try{storage.setItem(SEARCH_HISTORY_KEY,JSON.stringify([item,...list].slice(0,6)))}catch{}}
export function removeSearchHistory(storage,index){try{const list=readSearchHistory(storage);list.splice(index,1);storage.setItem(SEARCH_HISTORY_KEY,JSON.stringify(list))}catch{}}
