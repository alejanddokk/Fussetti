import {cyberPhotos} from './cyber-clean-media.mjs';
import {officialData} from './official-source.mjs';
import {officialPhotoSelection} from './official-photo-selection.mjs';
// Presentation-only replacements: retain the shared catalogue and custom admin photos.
const photos={
 'honda-wave-110-s':{original:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/motos/assets/2a3232f2f2b889b8.jpg',image:new URL('../assets/wave-110-transparent.webp',import.meta.url).href,kind:'fussetti'},
 'hogar-3-1':{original:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/assets/5c5ba095b9a1f439.jpg',image:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/products/philips-50pud7309-77-official.png'},
 'hogar-3-0':{original:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/assets/bee979883da75bae.jpg',image:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/products/noblex-91dv75x8580-official.jpg'},
 'hogar-0-0':{original:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/assets/12f6e642bcbeb324.jpg',image:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/products/electrolux-ecm21-official.png'}
};
let officialRows;
function alternateOfficialPhoto(product) {
 if(product?.source!=='fussetti-official'||!officialData)return null;
 const id=product.official?.id;
 if(!Object.hasOwn(officialPhotoSelection,id))return null;
 officialRows??=new Map(officialData.productos.map(row=>[row.id_oficial,row]));
 const [cover,preferred]=officialPhotoSelection[id];
 const images=officialRows.get(id)?.imagenes;
 if(images?.[cover]?.url!==product.image||!images[preferred]?.url)return null;
 return {image:images[preferred].url,kind:'fussetti'};
}
function selectedPhoto(product) {
 const entry=photos[product?.id]||cyberPhotos[product?.id];
 return entry?.original===product?.image ? entry : alternateOfficialPhoto(product);
}
export const officialPhoto=p=>{const entry=selectedPhoto(p);return entry&&entry.kind!=='fussetti'?entry:null};
export const photoKind=p=>selectedPhoto(p)?.kind||(officialPhoto(p)?'manufacturer':'');
export const productPhoto=p=>selectedPhoto(p)?.image||p?.image||'';
export const photoCaption=p=>officialPhoto(p)?'Fotografía oficial del fabricante.':selectedPhoto(p)?.kind==='fussetti'?'Fotografía del producto publicada por Fussetti.':'Imagen del catálogo de referencia.';

export const productHref=p=>p?.source==='fussetti-official'?'#producto-oficial/'+encodeURIComponent(p.official.id):'#producto/'+encodeURIComponent(p.id);
