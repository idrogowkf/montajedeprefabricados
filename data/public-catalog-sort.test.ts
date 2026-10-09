import {describe,expect,it} from "vitest";
import {sortPublicCatalog,type PublicCatalogProduct} from "./public-catalog";

const product=(id:string,price:number,rating:number,reviews:number)=>({id,price,rating,reviews} as PublicCatalogProduct);

describe("public catalog sorting",()=>{
  const products=[product("b",30,4.8,3),product("a",10,4.3,80),product("c",20,4.9,20)];
  it("sorts a copy by ascending price",()=>{
    expect(sortPublicCatalog(products,"price-asc").map(item=>item.id)).toEqual(["a","c","b"]);
    expect(products.map(item=>item.id)).toEqual(["b","a","c"]);
  });
  it("sorts best rated products using reviews as a tie-break signal",()=>{
    expect(sortPublicCatalog(products,"rating").map(item=>item.id)).toEqual(["c","b","a"]);
  });
});
