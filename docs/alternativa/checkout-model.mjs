export const PAYMENT_LABELS={'tarjeta-demo':'Tarjeta demo','transferencia-demo':'Transferencia demo',rechazado:'Tarjeta demo rechazada'};
export const validCheckoutDraft=d=>!!d&&Number.isInteger(d.step)&&d.step>=1&&d.step<=3&&['retiro','envio'].includes(d.delivery)&&Object.hasOwn(PAYMENT_LABELS,d.payment);
export function normalizeCheckout(s){
 s.shopping.checkout=validCheckoutDraft(s.shopping.checkout)?s.shopping.checkout:{step:1,delivery:'retiro',payment:'tarjeta-demo'};
 return s.shopping.checkout;
}
export const checkoutDraft=s=>({...s.shopping.checkout,branch:s.shopping.branch});
export function changeCheckout(s,patch){
 const current=checkoutDraft(s),next={...current,...patch};
 if(!validCheckoutDraft(next)||!s.branches.some(b=>b.id===next.branch))throw Error('Revisá las opciones de tu compra demo.');
 s.shopping.checkout={step:next.step,delivery:next.delivery,payment:next.payment};s.shopping.branch=next.branch;return checkoutDraft(s);
}
export function changeQuantity(s,id,qty){
 const row=s.cart.find(l=>l.id===id),p=s.products.find(p=>p.id===id);
 if(!row||!p||!Number.isSafeInteger(qty)||qty<1||qty>p.stock)throw Error(p?.stock?`Podés elegir entre 1 y ${p.stock} unidades demo.`:'Este producto ya no tiene stock demo. Quitalo para continuar.');
 row.qty=qty;return qty;
}
export function cartIssues(s){
 return s.cart.flatMap(l=>{const p=s.products.find(p=>p.id===l.id);return !p||p.kind==='motorcycle'||!Number.isSafeInteger(l.qty)||l.qty>p.stock||l.qty<1?[{id:l.id,text:p?.stock?`Quedan ${p.stock} unidades demo. Revisá la cantidad.`:'Sin stock demo. Quitá este producto para continuar.'}]:[]});
}
export function branchAvailability(s,id){
 const missing=s.cart.flatMap(l=>{const p=s.products.find(p=>p.id===l.id);return !p||!p.branchIds.includes(id)||p.stock<l.qty?[p?.name||'Producto no disponible']:[]});
 return {available:!!s.cart.length&&s.branches.some(b=>b.id===id)&&!missing.length,missing};
}
