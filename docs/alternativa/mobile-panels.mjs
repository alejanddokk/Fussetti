export function bindMobilePanels(host){
 const dialogs=[...host.querySelectorAll('#discovery-menu,#services-menu,.smart-search-dialog')],media=matchMedia('(max-width:800px)'),abort=new AbortController();
 const update=()=>{const v=window.visualViewport;document.documentElement.style.setProperty('--mobile-panel-height',(v?.height||innerHeight)+'px');document.body.classList.toggle('mobile-panel-open',media.matches&&dialogs.some(d=>d.open))};
 const observer=new MutationObserver(update);dialogs.forEach(d=>observer.observe(d,{attributes:true,attributeFilter:['open']}));
 for(const target of [window,window.visualViewport])target?.addEventListener('resize',update,{signal:abort.signal});media.addEventListener('change',update,{signal:abort.signal});update();
 return ()=>{observer.disconnect();abort.abort();document.body.classList.remove('mobile-panel-open')};
}
