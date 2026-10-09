import {approvalSections,type ApprovalProduct,type ApprovalSection,type ApprovalValidation} from "./schema";

export function validateApprovalCatalog(products:ApprovalProduct[]):ApprovalValidation{
 const errors:string[]=[];
 const counts=Object.fromEntries(approvalSections.map(section=>[section,products.filter(product=>product.section===section).length])) as Record<ApprovalSection,number>;
 for(const section of approvalSections)if(counts[section]!==120)errors.push(`${section}: se esperaban 120 productos y hay ${counts[section]}`);
 const ids=new Set<string>(),references=new Set<string>();
 for(const product of products){
  if(ids.has(product.id))errors.push(`id duplicado: ${product.id}`);ids.add(product.id);
  const key=`${product.manufacturer.trim().toLowerCase()}::${product.reference.trim().toLowerCase()}`;
  if(references.has(key))errors.push(`referencia duplicada: ${product.manufacturer} ${product.reference}`);references.add(key);
  for(const field of ["manufacturer","reference","name","description","supplier","origin","productUrl","pdfUrl","imageUrl"] as const)if(!product[field]?.trim())errors.push(`${product.id}: falta ${field}`);
  if(product.checks.product<200||product.checks.product>=400)errors.push(`${product.id}: página no válida`);
  if(product.checks.pdf<200||product.checks.pdf>=400||!product.checks.pdfSignature)errors.push(`${product.id}: PDF no válido`);
  if(product.checks.image<200||product.checks.image>=400||!product.checks.imageMime.startsWith("image/"))errors.push(`${product.id}: imagen no válida`);
 }
 return {valid:errors.length===0,counts,errors};
}
