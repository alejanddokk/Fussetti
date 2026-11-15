// Scroll only the thumbnail strip, never the page itself.
export function followMotoThumbnail(button,reducedMotion=false){
 const strip=button?.parentElement;
 if(!strip||typeof strip.scrollTo!=='function'||!strip.clientWidth)return;
 const outer=strip.getBoundingClientRect(),item=button.getBoundingClientRect();
 const max=Math.max(0,strip.scrollWidth-strip.clientWidth);
 const left=Math.max(0,Math.min(max,strip.scrollLeft+item.left-outer.left-(strip.clientWidth-item.width)/2));
 if(Math.abs(left-strip.scrollLeft)>1)strip.scrollTo({left,behavior:reducedMotion?'instant':'smooth'});
}
