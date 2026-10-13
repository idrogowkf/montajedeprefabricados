import {readFile,writeFile} from "node:fs/promises";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
import type {ApprovalProduct} from "../catalog-approval/schema";
import type {CollectedCandidate} from "./collect";
import {buildCatalog} from "./normalize";
import {validateSpecializedCatalog} from "./validate";

const root=fileURLToPath(new URL("../../",import.meta.url));
const candidates=JSON.parse(await readFile(join(root,"research/catalog-specialized/candidates.json"),"utf8")) as CollectedCandidate[];
const legacy=JSON.parse(await readFile(join(root,"research/catalog-approval/catalog.json"),"utf8")) as ApprovalProduct[];
const catalog=buildCatalog(candidates,legacy);const validation=validateSpecializedCatalog(catalog);
await writeFile(join(root,"research/catalog-specialized/catalog.json"),JSON.stringify(catalog,null,2));
console.log(JSON.stringify({total:catalog.length,counts:validation.counts,errors:validation.errors.slice(0,20)},null,2));
if(!validation.valid)process.exitCode=1;
