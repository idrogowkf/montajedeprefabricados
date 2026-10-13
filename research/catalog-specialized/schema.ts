export const specializedSections=["hormigon","elevacion","altura","epi"] as const;
export type SpecializedSection=(typeof specializedSections)[number];
export type SpecializedProduct={
 id:string;section:SpecializedSection;family:string;manufacturer:string;reference:string;originalName:string;
 nameEs:string;descriptionEs:string;applicationEs:string;capacityEs:string;compatibilityEs:string;
 manufacturingCountry:string;originPriority:1|2|3;originEvidenceUrl:string;supplier:string;
 productUrl:string;pdfUrl:string;imageUrl:string;imageUrls:string[];verifiedAt:string;
 checks:{product:number;pdf:number;image:number;pdfSignature:boolean;imageMime:string};
};
export type SpecializedValidation={valid:boolean;counts:Record<SpecializedSection,number>;errors:string[]};
