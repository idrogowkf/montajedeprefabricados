"use client";
import Image, {type ImageProps} from "next/image";
import {useState} from "react";
const fallback=`data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100"><rect width="160" height="100" fill="#111"/><text x="80" y="55" fill="#eab308" font-size="10" text-anchor="middle">imagen no disponible</text></svg>')}`;
export function SafeImage({src,...props}:ImageProps){const[current,setCurrent]=useState(src);return <Image {...props} src={current} onError={()=>setCurrent(fallback)} unoptimized={current===fallback}/>}
