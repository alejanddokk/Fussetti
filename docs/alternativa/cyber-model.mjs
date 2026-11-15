import {cyberData} from './cyber-data.mjs';
import {seed,upgradeState} from './domain.mjs';
import {typeCategories} from './knowledge.mjs';
const normalize=s=>s.toUpperCase().replace(/[^A-Z0-9]/g,'');
const mapping=[['HELADERA','fridge'],['PARLANTE','speaker'],['GAZEBO','gazebo'],['SOMBRILLA','umbrella'],['CARPA','tent'],['PURIFICADOR','hood'],['FREIDORA','fryer'],['MICROONDAS','microwave'],['BICICLETA','bicycle'],['SILLON','chair'],['SECADOR','hairdryer'],['TERMO','thermos'],['BATIDORA','mixer'],['BORDEADORA','trimmer'],['SMART TV','tv'],['HORNO','oven'],['AIRE ACONDICIONADO','air'],['VENTILADOR','fan'],['CAFETERA','coffee'],['ASPIRADORA','vacuum'],['HIDROLAVADORA','washer']];
export function extendCyber(s){
 if(s.cyberRevision===1)return s;
 for(const row of cyberData){
  const existing=s.products.find(p=>normalize(p.name)===normalize(row.name));
  if(existing){existing.cyber=true;existing.sourceUrl=row.sourceUrl;continue}
  const type=mapping.find(([word])=>row.name.includes(word))?.[1];if(!type)throw Error('Tipo CYBER sin clasificar: '+row.name);
  const item={id:'cyber-'+row.sourceId,name:row.name,type,category:typeCategories[type],price:row.price,salePrice:row.sale,image:row.image,kind:'product',stock:5,discount:Math.floor((row.price-row.sale)/row.price*100),eligible:row.sale<row.price,compatible:[],cyber:true,sourceUrl:row.sourceUrl,description:'Producto de la campaña CYBER Fussetti. Precio de referencia del 04/11/2026. Stock y compra simulados.'};
  item.cyberBasePrice=item.price;item.cyberDiscount=item.discount;
  s.products.push(seed({products:[item],branches:s.branches}).products[0]);
 }
 s.cyberRevision=1;return upgradeState(s);
}
