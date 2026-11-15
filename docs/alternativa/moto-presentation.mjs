// Choose a layout by available screen space, without user-agent detection.
export const MOTO_PHONE_QUERY='(max-width: 767px)';
let selectedModel='';
export const selectedMotoModel=()=>selectedModel;
export const rememberMotoModel=id=>{selectedModel=typeof id==='string'?id:''};
export function isMotoShowroomRoute({path,q}){
 if(['motos','motos-focus'].includes(path[0]))return true;
 return path[0]==='catalogo'&&(q.get('cat')==='Motos'||q.get('tipo')==='motorcycle')&&!q.get('q')&&!q.has('ofertas')&&!q.get('orden');
}
export function watchMotoPresentation(media,currentRoute,onChange){
 const change=()=>{if(isMotoShowroomRoute(currentRoute()))onChange()};
 media.addEventListener('change',change);
 return ()=>media.removeEventListener('change',change);
}
