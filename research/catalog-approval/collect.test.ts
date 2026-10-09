import {describe,expect,it} from "vitest";
import {parseHiltiProduct,parseRothenbergerProduct,parseRothoblaasProduct} from "./collect-parsers";

describe("official product parsers",()=>{
 it("extracts Rothoblaas metadata and the English technical PDF",()=>{
  const html=`<meta property="og:title" content="HBS - Wood screw"><meta property="og:description" content="Structural screw"><meta property="og:image" content="https://cdn.example/hbs.jpg"><a href="/attachments/hbs-installation.pdf">Manual</a><a href="/attachments/hbs-technical-data-sheet-en-europe.pdf">Technical data sheet</a>`;
  expect(parseRothoblaasProduct("https://www.rothoblaas.com/products/fastening/screws/hbs",html)).toMatchObject({manufacturer:"Rothoblaas",reference:"HBS",name:"HBS - Wood screw",description:"Structural screw",imageUrl:"https://cdn.example/hbs.jpg",pdfUrl:"https://www.rothoblaas.com/attachments/hbs-technical-data-sheet-en-europe.pdf"});
 });

 it("extracts Hilti product media and official PDF",()=>{
  const html=`<meta property="og:title" content="Anclaje HST4"><meta property="og:description" content="Anclaje de alto rendimiento"><img src="https://productdata.hilti.com/APQ_HC_f2000/L153712.jpg"><a href="https://productdata.hilti.com/APQ_HC_RAW/ASSET_DOC_123.pdf">Ficha técnica</a>`;
  expect(parseHiltiProduct("https://www.hilti.es/c/x/r18476739",html)).toMatchObject({manufacturer:"Hilti",reference:"R18476739",name:"Anclaje HST4",imageUrl:"https://productdata.hilti.com/APQ_HC_f2000/L153712.jpg",pdfUrl:"https://productdata.hilti.com/APQ_HC_RAW/ASSET_DOC_123.pdf"});
 });

 it("extracts Rothenberger metadata and product document",()=>{
  const html=`<meta property="og:title" content="ROCUT 110"><meta property="og:description" content="Cortatubos de plástico"><meta property="og:image" content="https://cdn.example/rocut.jpg">`;
  const pageData=JSON.stringify({result:{data:{documents:[{url:"https://content.example/ImageServer.php?id=1&downloadname=rocut-110.pdf"}]}}});
  expect(parseRothenbergerProduct("https://rothenberger.com/es-es/productos/cortatubos/rocut-110-unidad-basica-55020",html,pageData)).toMatchObject({manufacturer:"Rothenberger",reference:"55020",name:"ROCUT 110",pdfUrl:"https://content.example/ImageServer.php?id=1&downloadname=rocut-110.pdf"});
 });
});
