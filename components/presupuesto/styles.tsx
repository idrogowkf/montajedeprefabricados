import React from "react";

export const BTN="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold ring-1 transition";
export const BTN_SOLID="bg-yellow-400 text-neutral-900 ring-yellow-300 hover:bg-yellow-300";
export const BTN_GHOST="text-neutral-200 ring-neutral-700 hover:bg-neutral-900/60";
export const FIELD="rounded-xl border border-neutral-300/80 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-yellow-400/70 min-w-0";
export const CARD="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 shadow-sm";
export const GRID_FORM="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4";
export const GRID_PARTIDAS="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6";
export const CHIP="inline-flex items-center rounded-xl px-3 py-1 text-xs font-semibold ring-1";
export const HR=<div className="my-6 h-px bg-neutral-200"/>;
export function parseDecimal(value:string){const trimmed=value.trim();if(!trimmed||trimmed===","||trimmed===".")return 0;const parsed=Number(trimmed.replace(",",".").replace(/[^\d.\-]/g,""));return Number.isNaN(parsed)?0:parsed}
