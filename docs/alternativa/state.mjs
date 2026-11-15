import {loadOfficialData,officialData} from './official-source.mjs';
import {extendOfficial} from './official-commerce.mjs';
import {extendCyber} from './cyber-model.mjs';
import {seed,valid,KEY,upgradeState} from './domain.mjs';
import {extendMarketplaceParts,compactMarketplaceState} from './repuestos-mercadolibre.mjs';
export const catalog=await fetch(new URL('../nueva/catalog.json', import.meta.url)).then(r=>{if(!r.ok)throw Error('No se pudo cargar el catálogo.');return r.json()});
await loadOfficialData().catch(()=>null);
const marketplaceParts=await fetch(new URL('./repuestos/mercadolibre.json', import.meta.url)).then(r=>r.ok?r.json():null).catch(()=>null);
export let state;
try{const data=JSON.parse(localStorage.getItem(KEY));state=valid(data)?upgradeState(data):seed(catalog)}catch{state=seed(catalog)}
extendCyber(state);extendOfficial(state,officialData);extendMarketplaceParts(state,marketplaceParts);
export function save(){localStorage.setItem(KEY,JSON.stringify(compactMarketplaceState(state,marketplaceParts)))}
export function replace(data){if(!valid(data))throw Error('El archivo no es un escenario válido de la alternativa.');state=upgradeState(data);extendCyber(state);extendOfficial(state,officialData);extendMarketplaceParts(state,marketplaceParts);save()}
export function reset(){state=seed(catalog);extendCyber(state);extendOfficial(state,officialData);extendMarketplaceParts(state,marketplaceParts);save()}
window.addEventListener('storage',e=>{if(e.key===KEY&&e.newValue){try{const next=JSON.parse(e.newValue);if(valid(next)){state=upgradeState(next);extendOfficial(state,officialData);extendMarketplaceParts(state,marketplaceParts);window.dispatchEvent(new CustomEvent('alternative-update'))}}catch{}}});
save();
