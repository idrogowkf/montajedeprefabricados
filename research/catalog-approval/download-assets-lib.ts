export const isPdfSignature=(bytes:Uint8Array)=>Buffer.from(bytes).subarray(0,5).toString("ascii")==="%PDF-";
export const isImageMime=(mime:string)=>/^image\/(?:jpeg|png|webp|gif|avif|tiff|bmp)/i.test(mime);
