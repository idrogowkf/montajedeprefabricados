export const approvalSections=["hormigon","acero","madera","pvc","altura","epi"] as const;
export type ApprovalSection=(typeof approvalSections)[number];
export type ApprovalProduct={
 id:string;section:ApprovalSection;tags:string[];manufacturer:string;reference:string;name:string;description:string;
 applications:string[];supplier:string;origin:string;productUrl:string;pdfUrl:string;imageUrl:string;verifiedAt:string;
 checks:{product:number;pdf:number;image:number;pdfSignature:boolean;imageMime:string};
};
export type ApprovalValidation={valid:boolean;counts:Record<ApprovalSection,number>;errors:string[]};
