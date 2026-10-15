import {describe,expect,it} from "vitest";
import {validateProductInquiry,type ProductInquiryInput} from "./product-inquiry";

const valid:ProductInquiryInput={kind:"product",productId:"util-002-anilla-soldable",productName:"ANILLA SOLDABLE",message:"Necesito 20 unidades y la ficha técnica.",documents:[],consent:true,website:""};
describe("product inquiry",()=>{
 it("accepts an identified customer request",()=>expect(validateProductInquiry(valid)).toEqual({}));
 it("requires consent but does not trust browser-supplied identity",()=>{expect(validateProductInquiry({...valid,consent:false})).toHaveProperty("consent");expect(validateProductInquiry({...valid,name:"Impostor",email:"fake@example.com"} as ProductInquiryInput)).toEqual({});});
 it("requires a useful description for assisted searches",()=>expect(validateProductInquiry({...valid,kind:"search",productId:"",productName:"",message:"x"})).toHaveProperty("message"));
});
