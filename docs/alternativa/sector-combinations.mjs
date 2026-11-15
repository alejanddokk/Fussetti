const item=(id,short)=>({id:'official-'+id,qty:1,short,photo:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/selecciones/'+id+'.jpg'});
export const sectorCombinations={
 electrodomesticos:[
  {id:'electro-cocina',section:'electrodomesticos',label:'Cocina',title:'Más ideas en tu cocina.',copy:'Un horno y una freidora para explorar distintas formas de preparar tus comidas.',note:'Confirmá medidas, accesorios incluidos y condiciones de instalación de cada equipo.',items:[item('3708','Horno BGH 40L'),item('3576','Freidora Kanji 11L')]},
  {id:'electro-lavado',section:'electrodomesticos',label:'Lavado',title:'Renová tu rutina de lavado.',copy:'Elegí el lavarropas y el secarropas por separado, con sus capacidades y precios a la vista.',note:'La selección no confirma instalación en torre. Revisá espacio, conexiones y capacidades de cada equipo.',items:[item('3722','Lavarropas Samsung 7kg'),item('3683','Secarropas Wanke 10kg')]},
  {id:'electro-desayuno',section:'electrodomesticos',label:'Desayuno',title:'Empezá el día a tu manera.',copy:'Café y tostadas. Dos equipos para darle otro lugar a ese primer momento del día.',note:'Revisá dimensiones, accesorios y características publicadas en la ficha de cada producto.',items:[item('3532','Cafetera Smartlife'),item('3517','Tostadora Kanji')]},
  {id:'electro-limpieza',section:'electrodomesticos',label:'Limpieza',title:'Adentro y afuera, nuevos planes.',copy:'Una aspiradora y una hidrolavadora para elegir cómo renovar tus tareas de limpieza.',note:'Revisá superficies admitidas, accesorios, presión y condiciones de uso antes de elegir.',items:[item('3265','Aspiradora Miyawa 12L'),item('2763','Hidrolavadora Karcher')]}
 ],
 tecnologia:[
  {id:'tech-estudio',section:'tecnologia',label:'Estudio',title:'Hacé lugar a lo que viene.',copy:'Una notebook y un mouse para armar tu próxima selección de estudio o trabajo.',note:'Confirmá conexiones del mouse, software y requisitos de las aplicaciones que necesitás.',items:[item('3590','Notebook Gfast Ryzen 5'),item('2407','Mouse Logitech M185')]},
  {id:'tech-escritorio',section:'tecnologia',label:'Escritorio',title:'Completá tu espacio.',copy:'Un monitor y una impresora para sumar a tu equipo y organizar tus próximos proyectos.',note:'La computadora no está incluida. Confirmá conexiones, controladores y compatibilidad con tu equipo.',items:[item('3047','Monitor Noblex 25″'),item('3468','Impresora HP M111A')]},
  {id:'tech-gaming',section:'tecnologia',label:'Gaming',title:'Tu próximo rato de juego.',copy:'Consola y control adicional. Revisá lo que incluye cada producto y elegí cantidades.',note:'Confirmá versión, contenido de la consola y compatibilidad del control antes de comprar.',items:[item('3305','Consola PlayStation 5'),item('3304','Control DualSense PS5')]},
  {id:'tech-dia',section:'tecnologia',label:'Tu día',title:'Llevá tus planes con vos.',copy:'Un celular y un reloj para explorar cómo querés acompañar tus días.',note:'La selección no confirma vinculación entre dispositivos. Revisá sistema, aplicación y compatibilidad del reloj.',items:[item('3634','Samsung A37 8/256GB'),item('2644','Reloj Grow Home GR27')]}
 ],
 'tv-audio':[
  {id:'tv-cine',section:'tv-audio',label:'En casa',title:'Dale otro lugar a tus planes.',copy:'Una pantalla de 50 pulgadas y un parlante para elegir imagen y sonido a tu manera.',note:'No se confirma conexión entre el TV y el parlante. Revisá entradas, salidas y funciones en ambas fichas.',items:[item('3294','TV Philips 50″'),item('2131','Parlante JBL Flip 6')]},
  {id:'tv-grande',section:'tv-audio',label:'A lo grande',title:'Una pantalla para compartir.',copy:'Explorá el TV de 75 pulgadas y una opción de sonido, con sus precios publicados.',note:'Confirmá medidas del espacio y conexiones de los equipos. La selección no garantiza compatibilidad entre ellos.',items:[item('3321','TV Noblex 75″'),item('2158','Parlante Smartlife 55W')]},
  {id:'tv-musica',section:'tv-audio',label:'Tu música',title:'Elegí cómo querés escuchar.',copy:'Un parlante y unos auriculares para distintos momentos, vendidos por separado.',note:'Revisá conectividad, dispositivos admitidos y accesorios en la ficha de cada producto.',items:[item('2131','Parlante JBL Flip 6'),item('1720','Auriculares Philips')]},
  {id:'tv-espacio',section:'tv-audio',label:'Tu espacio',title:'Hacé lugar a tu pantalla.',copy:'Un TV de 32 pulgadas y un soporte para revisar antes de decidir dónde ubicarlo.',note:'La compatibilidad del soporte está pendiente. Confirmá VESA, peso, fijaciones y condiciones de instalación.',items:[item('3698','TV TCL 32″'),item('369','Soporte EsOporter')]}
 ]
};
export const sectorComboPresentation={
 electrodomesticos:{title:'Electrodomésticos para tu día a día.',eyebrow:'ELECTRODOMÉSTICOS FUSSETTI · ELEGÍ TU PRÓXIMO CAMBIO'},
 tecnologia:{title:'Tecnología para tus próximos planes.',eyebrow:'TECNOLOGÍA FUSSETTI · ARMALO A TU MANERA'},
 'tv-audio':{title:'TV y audio. Dale lugar a tus planes.',eyebrow:'TV Y AUDIO FUSSETTI · IMAGEN, SONIDO Y ELECCIÓN'}
};
