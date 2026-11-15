import {cyberPhotos} from './cyber-clean-media.mjs';
// Presentation-only replacements: retain the shared catalogue and custom admin photos.
const photos={
 'hogar-3-1':{original:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/assets/5c5ba095b9a1f439.jpg',image:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/products/philips-50pud7309-77-official.png'},
 'hogar-3-0':{original:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/assets/bee979883da75bae.jpg',image:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/products/noblex-91dv75x8580-official.jpg'},
 'hogar-0-0':{original:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/assets/12f6e642bcbeb324.jpg',image:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/products/electrolux-ecm21-official.png'}
};
const selectedPhoto=p=>{const entry=photos[p?.id]||cyberPhotos[p?.id];return entry&&entry.original===p.image?entry:null};
export const officialPhoto=p=>{const entry=selectedPhoto(p);return entry&&entry.kind!=='fussetti'?entry:null};
export const photoKind=p=>selectedPhoto(p)?.kind||(officialPhoto(p)?'manufacturer':'');
export const productPhoto=p=>selectedPhoto(p)?.image||p?.image||'';
export const photoCaption=p=>officialPhoto(p)?'Fotografía oficial del fabricante.':selectedPhoto(p)?.kind==='fussetti'?'Fotografía del producto publicada por Fussetti.':'Imagen del catálogo de referencia.';

export const productHref=p=>p?.source==='fussetti-official'?'#producto-oficial/'+encodeURIComponent(p.official.id):'#producto/'+encodeURIComponent(p.id);
