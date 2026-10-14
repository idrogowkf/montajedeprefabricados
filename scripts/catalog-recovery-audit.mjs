import {createServer} from "vite";

const server=await createServer({appType:"custom",server:{middlewareMode:true},logLevel:"error"});
try{
  const {catalogProducts}=await server.ssrLoadModule("/data/catalog.ts");
  const {auditRecoveredProduct,recoveredCatalogProducts}=await server.ssrLoadModule("/data/catalog-recovery.ts");
  const counts=(key,products)=>Object.fromEntries([...new Set(products.map(product=>product[key]??"sin-clasificar"))].sort().map(value=>[value,products.filter(product=>(product[key]??"sin-clasificar")===value).length]));
  const rejected=recoveredCatalogProducts.flatMap(product=>auditRecoveredProduct(product).map(reason=>({id:product.id,reason})));
  const lifting=catalogProducts.filter(product=>product.category==="elevacion");
  const forbidden=catalogProducts.flatMap(product=>auditRecoveredProduct(product).filter(reason=>reason==="forbidden-image"||reason==="brand-category").map(reason=>({id:product.id,reason})));
  console.log(JSON.stringify({total:catalogProducts.length,lifting:lifting.length,recovered:recoveredCatalogProducts.length,categories:counts("category",catalogProducts),brands:counts("brand",recoveredCatalogProducts),accepted:recoveredCatalogProducts.length,rejected:rejected.length,rejectionReasons:counts("reason",rejected)},null,2));
  if(lifting.length!==60||rejected.length||forbidden.length)process.exitCode=1;
}finally{
  await server.close();
}
