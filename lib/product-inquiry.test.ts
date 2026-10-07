import {describe,expect,it} from "vitest";
import {validateProductInquiry,type ProductInquiryInput} from "./product-inquiry";

const valid:ProductInquiryInput={kind:"product",productId:"util-002-anilla-soldable",productName:"ANILLA SOLDABLE",name:"Ana Pérez",company:"Montajes SA",email:"ana@example.com",phone:"+34 600 000 000",message:"Necesito 20 unidades y la ficha técnica.",documents:[],consent:true,website:""};
describe("product inquiry",()=>{
 it("accepts an identified customer request",()=>expect(validateProductInquiry(valid)).toEqual({}));
 it("requires traceable contact and consent",()=>{expect(validateProductInquiry({...valid,email:"",phone:""})).toHaveProperty("contact");expect(validateProductInquiry({...valid,consent:false})).toHaveProperty("consent");});
 it("requires a useful description for assisted searches",()=>expect(validateProductInquiry({...valid,kind:"search",productId:"",productName:"",message:"x"})).toHaveProperty("message"));
});
