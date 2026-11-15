// Product types describe the published item, never inferred performance or compatibility.
export const foldOfficial=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
const groups=`
firepit|Fogoneros|Hogar|FOGONERO
grill|Parrilleros|Hogar|PARRILLERO
dresser|Cómodas y chifonieres|Hogar|COMODA,CHIFONIER
poolpump|Bombas filtrantes|Jardín|BOMBA FILTRANTE
pool|Piletas|Jardín|PILETA
laundry|Lavarropas|Electrodomésticos|LAVARROPAS
table|Mesas|Hogar|MESA
chair|Sillones de exterior|Jardín|SILLON
seat|Sillas|Hogar|SILLA
stool|Banquetas|Hogar|BANQUITOS,BANQUETA,MESA/BANQUETA
sofa|Sofás y sillones de interior|Hogar|SOFA,SILLON KAPPESBERG
officechair|Sillas de oficina|Tecnología|SILLA DE OFICINA,SILLA OFICINA
mower|Cortadoras de césped|Jardín|CORTADORA DE CESPED
hedgetrimmer|Cortacercos|Jardín|CORTACERCO
drill|Taladros|Jardín|TALADRO
kitchencabinet|Muebles de cocina|Hogar|BAJO MESADA,ALACENA,DESPENSERO,MODULO
thermos|Termos|Hogar|TERMO
bottle|Botellas|Hogar|BOTELLA
glass|Vasos|Hogar|VASO,VASOS,SET X6 VASOS
pitcher|Jarras|Hogar|JARRA
trimmer|Bordeadoras|Jardín|BORDEADORA
pastamachine|Máquinas de pastas|Hogar|MAQUINA DE PASTAS
banknotecounter|Contadoras de billetes|Tecnología|CONTADORA
powerstation|Estaciones de energía|Jardín|ESTACION
generator|Generadores|Jardín|GENERADOR
poolionizer|Ionizadores para piletas|Jardín|IONIZADOR
gazebo|Gazebos|Jardín|GAZEBO
umbrellabase|Bases de sombrilla|Jardín|BASE SOMBRILLA
umbrella|Sombrillas|Jardín|SOMBRILLA
tvrack|Racks de TV|Hogar|RACK
desk|Escritorios|Hogar|ESCRITORIO
quilt|Acolchados|Hogar|ACOLCHADO
bookcase|Bibliotecas|Hogar|BIBLIOTECA
headboard|Respaldos de cama|Hogar|RESPALDO
toolkit|Maletines de herramientas|Jardín|MALETIN
emergencylight|Luces de emergencia|Hogar|LUZ
pan|Sartenes|Hogar|SARTEN,BIFERA
saucepan|Cacerolas|Hogar|CACEROLA
wok|Woks|Hogar|WOK,SARTEN WOK
brushcutter|Desmalezadoras|Jardín|DESMALEZADORA
wardrobe|Placares|Hogar|PLACARD
plate|Platos|Hogar|PLATO
foodcontainer|Recipientes y viandas|Hogar|TAPER,VIANDA
bakingpan|Moldes y pizzeras|Hogar|MOLDE,PIZZERA
soapdispenser|Dispensers de jabón|Hogar|DISPENSER
goblet|Copas|Hogar|COPA
bowl|Bowls y cuencos|Hogar|BOWL,CUENCO
oilbottle|Aceiteros y vinagreros|Hogar|ACEITERO/VINAGRERO
jar|Frascos|Hogar|FRASCO
butterdish|Mantequeras|Hogar|MANTEQUERA
sugarbowl|Azucareras|Hogar|AZUCARERA
organizer|Organizadores|Hogar|ORGANIZADOR
inflator|Infladores|Jardín|INFLADOR
mate|Mates|Hogar|MATE
towel|Toallas y toallones|Hogar|TOALLA,TOALLON,SET TOALLA,SET TOALLON
cutlery|Juegos de cubiertos|Hogar|JUEGO DE CUBIERTOS
sheets|Sábanas|Hogar|SABANA,JUEGO DE SABANAS
frother|Batidores a pila|Hogar|BATIDOR A PILA
sideboard|Bahiuts|Hogar|BAHIUT
poolfilter|Filtros para piletas|Jardín|POMPONES,FILTRO
chlorinefloat|Boyas para cloro|Jardín|BOYA
basket|Canastos|Hogar|CANASTO
raviolimold|Ravioleras|Hogar|RAVIOLERA
sander|Lijadoras|Jardín|LIJADORA
chainsaw|Electrosierras|Jardín|ELECTROSIERRA
bed|Camas|Hogar|CAMA
shoerack|Zapateros|Hogar|ZAPATERO
drainer|Escurridores|Hogar|ESCURRIDOR
cuttingboard|Tablas de cocina|Hogar|TABLA
kettle|Pavas|Electrodomésticos|PAVA
dressingtable|Tocadores|Hogar|TOCADOR
grinder|Amoladoras|Jardín|AMOLADORA
goal|Arcos de fútbol|Jardín|ARCO DE FUTBOL
poolcover|Cubiertas de pileta|Jardín|CUBRE PILETA
footbath|Lavapiés|Jardín|LAVAPIES
fork|Tenedores|Hogar|TENEDOR
spoon|Cucharas|Hogar|CUCHARA
luggagescale|Balanzas de valija|Hogar|BALANZA DE VALIJA
commercialscale|Balanzas comerciales|Electrodomésticos|BALANZA COMERCIAL
scale|Balanzas de cocina|Hogar|BALANZA DE COCINA
phone|Celulares|Tecnología|CELULAR
laptop|Notebooks|Tecnología|NOTEBOOK
camera|Cámaras|Tecnología|CAMARA
printer|Impresoras|Tecnología|IMPRESORA
tablet|Tablets|Tecnología|TABLET
console|Consolas|Tecnología|CONSOLA
controller|Joysticks|Tecnología|JOYSTICK
mouse|Mouse|Tecnología|MOUSE
phonemount|Soportes para celular|Tecnología|SOPORTE
monitor|Monitores|Tecnología|MONITOR
watch|Relojes|Tecnología|RELOJ
selfiestick|Palos de selfie|Tecnología|SELFIE
charger|Cargadores|Tecnología|CARGADOR
keyboard|Teclados|Tecnología|TECLADO
keyboardset|Combos de teclado y mouse|Tecnología|COMBO GAMING
freezer|Freezers|Electrodomésticos|FREEZER
oven|Hornos eléctricos|Hogar|HORNO
microwave|Microondas|Hogar|MICROONDAS
fan|Ventiladores|Climatización|VENTILADOR
fridge|Heladeras|Hogar|HELADERA
dryer|Secarropas|Electrodomésticos|SECARROPAS
waterheater|Termotanques|Electrodomésticos|TERMOTANQUE
coffee|Cafeteras|Hogar|CAFETERA
fryer|Freidoras|Hogar|FREIDORA,AIR FRYER
blender|Licuadoras|Electrodomésticos|LICUADORA
cooker|Cocinas|Electrodomésticos|COCINA
washerdryer|Lavasecarropas|Electrodomésticos|LAVASECARROPAS
hood|Purificadores de cocina|Hogar|PURIFICADOR,CAMPANA
grater|Ralladores|Electrodomésticos|RALLADOR,RAYADOR
dryingrack|Tendederos|Hogar|TENDEDERO
mixer|Batidoras|Hogar|BATIDORA
citruspress|Exprimidores|Electrodomésticos|EXPRIMIDOR
sandwichmaker|Sandwicheras|Electrodomésticos|SANDWICHERA
toaster|Tostadoras|Electrodomésticos|TOSTADORA
handblender|Minipimers|Electrodomésticos|MINIPIMER
processor|Procesadoras|Electrodomésticos|MULTIPROCESADORA,PROCESADORA,ROBOT DE COCINA
vacuum|Aspiradoras|Jardín|ASPIRADORA
displayfridge|Exhibidoras|Electrodomésticos|EXHIBIDORA
yogurt|Yogurteras|Hogar|YOGURTERA
hob|Anafes|Electrodomésticos|ANAFE
crepemaker|Panquequeras|Electrodomésticos|PANQUEQUERA
steamer|Vaporeras|Electrodomésticos|VAPORERA,VAPORIERA
iron|Planchas|Electrodomésticos|PLANCHA
washer|Hidrolavadoras|Jardín|HIDROLAVADORA
chopper|Picadoras|Electrodomésticos|PICADORA
instantwaterheater|Calefones|Electrodomésticos|CALEFON
juicer|Jugueras|Electrodomésticos|JUGUERA
sewingmachine|Máquinas de coser|Electrodomésticos|MAQUINA DE COSER
radio|Radios|TV y audio|RADIO
headphone|Auriculares|TV y audio|AURICULARES,AURICULAR
speaker|Parlantes|TV y audio|PARLANTE
tv|Televisores|TV y audio|SMART TV
tvmount|Soportes para TV|TV y audio|SOPORTE TV
matekit|Sets de mate y termo|Hogar|SET TERMO
picnicset|Sets de mesa y bancos|Jardín|SET KUSHIRO
knifeset|Sets de cuchillos|Hogar|SET DE CUCHILLOS,SET ASADO
drillbits|Juegos de mechas|Jardín|JUEGO DE MECHAS
`.trim().split('\n').map(line=>{const [id,name,category,prefixes]=line.split('|');return {id,name,category,prefixes:prefixes.split(',')}});
export const officialTypes=Object.fromEntries(groups.map(g=>[g.id,{name:g.name,uses:['Uso cotidiano'],features:[]}]));
export const officialTypeCategories=Object.fromEntries(groups.map(g=>[g.id,g.category]));
const rules=groups.flatMap(g=>g.prefixes.map(prefix=>({prefix,id:g.id}))).sort((a,b)=>b.prefix.length-a.prefix.length);
export function classifyOfficial(row){const n=foldOfficial(row.nombre);return rules.find(r=>n===r.prefix||n.startsWith(r.prefix+' '))?.id||'official'}
export const officialCategory=cat=>({'Hogar, Muebles y Jardín':'Hogar','TV y Audio':'TV y audio'}[cat]||cat);
