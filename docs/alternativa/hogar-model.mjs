import {officialId,initialOfficialStock} from './official-commerce.mjs';
const plain=v=>v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
export const hogarCollections=[
 {id:'muebles',title:'Muebles y espacios',line:'Un lugar para vos.',image:'3627',pattern:/SOFA|SILLON|SILLA|MESA|COMODA|CHIFONIER|PLACARD|RACK|BIBLIOTECA|ESCRITORIO|ALACENA|BAJO MESADA|BANQU|MODULAR|BAHIUT|ORGANIZADOR|CANASTO|ZAPATERO|DESPENSERO|MODULO|TOCADOR/},
 {id:'cocina',title:'Cocina y mesa',line:'Disfrutá lo cotidiano.',image:'3200',pattern:/SARTEN|CACEROLA|WOK|PLATO|VASO|COPA|BOWL|CUBIERTO|PIZZERA|MOLDE|TAPER|VIANDA|FRASCO|AZUCARERA|MANTEQUERA|ACEITERO|JARRA|PASTAS|DISPENSER|BATIDOR|BIFERA|CUCHILLO|RAVIOLERA|ESCURRIDOR|TABLA PLEGABLE|PAVA|TENEDOR|CUCHARA|CUENCO/},
 {id:'descanso',title:'Descanso y baño',line:'Tu momento de bajar un cambio.',image:'3430',pattern:/COLCHON|SOMMIER|ALMOHADA|SABANA|ACOLCHADO|TOALL|RESPALDO|FRAZADA|CUBRECAMA|CAMA BOX/},
 {id:'patio',title:'Patio y aire libre',line:'Hacé lugar para nuevos planes.',image:'3718',pattern:/FOGONERO|PARRILL|PILETA|BOMBA FILTRANTE|SOMBRILLA|GAZEBO|CARPA|INFLABLE|IONIZADOR|BICICLETA|POMPONES FILTRANTES|FILTRO SKIMMER|BOYA FLOTANTE|ARCO DE FUTBOL|SET ASADO/},
 {id:'mates',title:'Termos y mates',line:'Para acompañar tus días.',image:'3599',pattern:/TERMO|MATE|BOTELLA|BOMBILLA/},
 {id:'herramientas',title:'Herramientas y jardín',line:'Ideas que ponés en marcha.',image:'3632',pattern:/CORTADORA|CORTACERCO|TALADRO|BORDEADORA|DESMALEZADORA|HERRAMIENTA|GENERADOR|ESTACION DE ENERGIA|INFLADOR|HIDROLAVADORA|MOTOSIERRA|AMOLADORA|LIJADORA|ELECTROSIERRA|JUEGO DE MECHAS/}
];
export const hogarProducts=rows=>rows.filter(p=>p.categorias.includes('Hogar, Muebles y Jardín'));
export const gardenCollection={id:'jardin',title:'Productos de jardín',pattern:/CORTADORA DE CESPED|CORTACERCO|BORDEADORA|DESMALEZADORA|MOTOSIERRA|SOPLADOR/};
export const collectionHref=id=>'#catalogo?cat=Hogar&lista=1&coleccion='+encodeURIComponent(id);
export function collectionProducts(rows,id){
 const home=hogarProducts(rows);
 if(id==='hasta50')return home.filter(p=>p.precio_centavos<=5000000);
 const collection=id===gardenCollection.id?gardenCollection:hogarCollections.find(c=>c.id===id);
 return collection?home.filter(p=>collection.pattern.test(plain(p.nombre))):home;
}
export function hogarSelection(s,rows,ids,limit=4){
 const available=hogarProducts(rows).filter(p=>(s.products.find(x=>x.id===officialId(p.id_oficial))?.stock??initialOfficialStock(p))>0);
 return [...ids.map(id=>available.find(p=>p.id_oficial===id)).filter(Boolean),...available].filter((p,i,a)=>a.findIndex(x=>x.id_oficial===p.id_oficial)===i).slice(0,limit);
}
