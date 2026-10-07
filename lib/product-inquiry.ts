import {ACCEPTED_EXTENSIONS,MAX_FILE_SIZE,MAX_FILES,type UploadedDocument} from "./prestudy";

export type ProductInquiryKind="product"|"datasheet"|"search";
export type ProductInquiryInput={kind:ProductInquiryKind;productId:string;productName:string;name:string;company:string;email:string;phone:string;message:string;documents:UploadedDocument[];consent:boolean;website:string};

export function validateProductInquiry(data:ProductInquiryInput){
 const errors:Record<string,string>={};
 if(!["product","datasheet","search"].includes(data.kind))errors.kind="Tipo de solicitud no válido.";
 if(data.kind!=="search"&&(!data.productId?.trim()||!data.productName?.trim()))errors.product="No se ha identificado el producto.";
 if(!data.name?.trim())errors.name="Indica tu nombre.";
 if(!data.email?.trim()&&!data.phone?.trim())errors.contact="Indica un email o un teléfono.";
 if(data.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))errors.email="Revisa el formato del email.";
 if(!data.message?.trim()||data.message.trim().length<10)errors.message="Describe qué necesitas con algo más de detalle.";
 if(!data.consent)errors.consent="Debes aceptar el tratamiento de los datos para que podamos responderte.";
 if(!Array.isArray(data.documents)||data.documents.length>MAX_FILES)errors.documents=`Puedes adjuntar un máximo de ${MAX_FILES} archivos.`;
 else for(const document of data.documents){const extension=document.name.split(".").pop()?.toLowerCase()??"";if(!ACCEPTED_EXTENSIONS.includes(extension)||!/^https:\/\//.test(document.url)||document.size>MAX_FILE_SIZE){errors.documents="Hay un archivo no válido.";break;}}
 return errors;
}
