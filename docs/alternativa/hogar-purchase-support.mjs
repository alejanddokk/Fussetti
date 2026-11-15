import {e,icon} from '../nueva/ui.mjs';

// Product context stays inside the demo; preparing a consultation sends nothing.
export function homePurchaseSupport(s,p,{compact=false}={}){
 const consultation='#consulta?producto='+encodeURIComponent(p.id)+'&branch='+encodeURIComponent(s.shopping?.branch||'');
 if(compact)return `<aside class="home-purchase-support hps-compact" aria-label="Ayuda para esta compra"><a href="${e(consultation)}">${icon('settings',16)}<span>Consultar este producto</span>${icon('arrow',13)}</a><a href="#sucursales">${icon('pin',16)}<span>Retiro o entrega demo</span>${icon('arrow',13)}</a></aside>`;
 return `<aside class="home-purchase-support" aria-label="Comprá con el respaldo de Fussetti"><p class="hps-heading">Elegís con claridad. Contás con Fussetti.</p><div class="hps-grid"><a class="hps-card" href="${e(consultation)}">${icon('settings',20)}<span><strong>Elegí con ayuda.</strong><span>Prepará una consulta con este producto y lo que necesitás confirmar.</span><em>Consultar este producto ${icon('arrow',13)}</em></span></a><a class="hps-card" href="#sucursales">${icon('pin',20)}<span><strong>Encontrá tu sucursal.</strong><span>Revisá las sucursales y las opciones de retiro o entrega demo.</span><em>Ver sucursales ${icon('arrow',13)}</em></span></a><a class="hps-card" href="#mis-productos">${icon('shield',20)}<span><strong>Tu compra, acompañada.</strong><span>Reuní tus pedidos, comprobantes y productos en tu cuenta demo.</span><em>Ver mis productos ${icon('arrow',13)}</em></span></a></div></aside>`;
}
