import {describe,expect,it} from "vitest";
import {parseElebiaProduct,parsePfeiferVariants,parseProbstVariants,parseWimagProduct} from "./collect-parsers";

describe("specialized official source parsers",()=>{
 it("extracts an Elebia Spanish product with capacity and manual",()=>{
  const html=`<meta property="og:title" content="Gancho NEO100"><meta property="og:description" content="Gancho de elevación de 100 toneladas"><meta property="og:image" content="https://elebia.com/neo100.jpg"><a href="https://elebia.com/manual-neo100.pdf">Manual de usuario</a>`;
  expect(parseElebiaProduct("https://elebia.com/es/neo100",html)).toMatchObject({manufacturer:"Elebia",reference:"NEO100",capacityEs:"100 toneladas",manufacturingCountry:"España",pdfUrl:"https://elebia.com/manual-neo100.pdf"});
 });
 it("expands real PFEIFER order numbers from a Spanish product page",()=>{
  const html=`<h1>Anclaje de barra</h1><meta property="og:image" content="https://pfeifer.info/barra.jpg"><p>El anclaje se utiliza para elementos prefabricados.</p><div>Número de pedido | 275100 WLL [kN] | 20</div><div>Número de pedido | 275103 WLL [kN] | 40</div><a href="/out/assets/PFEIFER_BARRA_PPES.PDF">Prospecto</a>`;
  const items=parsePfeiferVariants("https://www.pfeifer.info/es/anclaje-de-barra.html",html);
  expect(items.map(item=>item.reference)).toEqual(["275100","275103"]);
  expect(items[1]).toMatchObject({capacityEs:"40 kN",manufacturingCountry:"Alemania"});
 });
 it("expands Probst order numbers and working loads",()=>{
  const html=`<h1>Pinza para prefabricados</h1><meta property="og:image" content="https://probst.com/ftz.jpg"><table><tr><td>FTZ-UNI-15</td><td>53100256</td><td>1500 kg</td></tr><tr><td>FTZ-UNI-25</td><td>53100313</td><td>2500 kg</td></tr></table><a href="/manuals/FTZ_ES.pdf">Manual ES</a>`;
  const items=parseProbstVariants("https://www.probst-handling.com/es/productos/details/ftz",html);
  expect(items.map(item=>item.reference)).toEqual(["53100256","53100313"]);
  expect(items[0]).toMatchObject({nameEs:"Pinza para prefabricados FTZ-UNI-15",capacityEs:"1.500 kg",manufacturingCountry:"Alemania"});
 });
 it("extracts a German WIMAG lifting device and translates its visible name",()=>{
  const html=`<h2>110 | Pipe Suspension Grab</h2><p>For moving prefabricated manholes.</p><img src="/fileadmin/user_upload/110-grab.jpg"><a href="/fileadmin/user_upload/110-Pipe-Suspension-Grab.pdf">Download datasheet</a>`;
  expect(parseWimagProduct("https://wimag.de/en/pipe-suspension-grab.html",html)).toMatchObject({manufacturer:"WIMAG",reference:"110",nameEs:"Pinza suspendida para tubos WIMAG 110",manufacturingCountry:"Alemania",pdfUrl:"https://wimag.de/fileadmin/user_upload/110-Pipe-Suspension-Grab.pdf"});
 });
 it("ignores video placeholders before the actual WIMAG product image",()=>{
  const html=`<h2>110 | Pipe Suspension Grab</h2><img src="/fileadmin/user_upload/youtube-placeholder.jpg"><img src="/fileadmin/user_upload/110-pipe-grab.jpg"><a href="/fileadmin/user_upload/110-datasheet.pdf">Ficha</a>`;
  expect(parseWimagProduct("https://wimag.de/en/pipe-suspension-grab.html",html).imageUrl).toBe("https://wimag.de/fileadmin/user_upload/110-pipe-grab.jpg");
 });
});
