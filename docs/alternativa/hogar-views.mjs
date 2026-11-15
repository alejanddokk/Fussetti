import {livingPilot,bindLivingPilot} from './hogar-living-piloto.mjs';
import {furnitureShowroom,bindFurnitureShowroom} from './hogar-muebles-showroom.mjs';
import {homeWelcome,homeSpacePicker,bindHomeDiscovery} from './hogar-descubrir.mjs?v=20261106-iconos1';
import {combinationHero} from './hogar-combo-views.mjs';
import {homeCategoryShowcase} from './hogar-categorias.mjs?v=20261106-ambientes1';
import {gardenShowroom} from './garden-showroom.mjs';
import {homeOpportunity,homeChoices,bindHomeChoices} from './hogar-journey.mjs';
import {officialSnapshot} from './official-catalog.mjs';
import {hogarProducts} from './hogar-model.mjs';
import {e,icon} from '../nueva/ui.mjs';
const all='#catalogo?cat=Hogar&lista=1';
const link=(text,href,cls='button')=>`<a class="${cls}" href="${e(href)}">${text} ${icon('arrow',17)}</a>`;
export function hogarView(s,snapshot=officialSnapshot()){
 if(!snapshot)return `<section class="container page"><p class="eyebrow">HOGAR FUSSETTI</p><h1>Tu casa, más vos.</h1><p role="status">Preparando los productos de Hogar…</p><a href="${all}">Ir al catálogo de Hogar</a></section>`;
 const rows=snapshot.productos,home=hogarProducts(rows);
 return `<div class="hogar-store"><div class="container hg-breadcrumb"><a href="#inicio">Inicio</a><span>/</span><span>Hogar, muebles y jardín</span><a href="${all}">Ver los ${home.length} productos ${icon('arrow',14)}</a></div>
 ${livingPilot(s,rows)}
 ${homeSpacePicker()}
 ${homeCategoryShowcase(rows)}
 ${furnitureShowroom(s,rows)}
 ${homeOpportunity(s,rows)}
 ${homeChoices(s,rows)}
 ${combinationHero(s,rows,{secondary:true,secondaryTitle:'Completá tu ambiente.'})}
 ${gardenShowroom(s,rows)}
 <section class="container hg-help"><div><p class="eyebrow">ELEGIR BIEN. SENTIRTE CERCA.</p><h2>Lo elegís vos.<br>Te acompañamos nosotros.</h2><p>Usá la guía para ordenar lo que necesitás o prepará una consulta con el producto que te interesa. Después de comprar, encontrá tus pedidos y comprobantes en tu cuenta demo.</p></div><div>${link('Ayudame a elegir','#guia?cat=Hogar')}${link('Encontrar una sucursal','#sucursales','button outline')}${link(`Explorar los ${home.length} productos`,all,'text-link')}</div></section><p class="container hg-source-note">Precios y cuotas relevados del ecommerce oficial al 4/11/2026. Productos vendidos por separado. Stock por sucursal, entrega, atención y pago simulados; sin cobros reales.</p></div>`;
}
export function bindHogar(root){const a=bindHomeChoices(root),b=bindHomeDiscovery(root),c=bindFurnitureShowroom(root),d=bindLivingPilot(root);return ()=>{a();b();c();d()}}
