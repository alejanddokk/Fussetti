export let officialData=null,officialError='';
let pending;
export function loadOfficialData(){
 if(officialData)return Promise.resolve(officialData);
 if(!pending)pending=fetch(new URL('./official/catalogo.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('Catálogo no disponible');return r.json()}).then(data=>{officialData=data;officialError='';return data}).catch(error=>{officialError='No se pudo cargar el catálogo oficial. Recargá para volver a intentar.';throw error});
 return pending;
}
