"use client";

import {useMemo,useState} from "react";
import {catalogCategories,type CatalogCategoryId} from "@/data/catalog-taxonomy";
import {findTechnicalCandidates,formatTechnicalRequest,nextFinderStep,previousFinderStep,type TechnicalCandidate,type TechnicalFinderState,type TechnicalFinderStep} from "@/data/technical-finder";
import type {PublicCatalogProduct} from "@/data/public-catalog";

const stepNumber:Record<TechnicalFinderStep,number>={intent:1,context:2,details:3,results:4};
const mainIntents:CatalogCategoryId[]=["elevacion","fijacion","corte","epi","altura","sellado","utiles"];

export function TechnicalFinder({products,initialIntent,onResults,onRequest,onClose}:{
  products:PublicCatalogProduct[];
  initialIntent?:CatalogCategoryId;
  onResults:(candidates:TechnicalCandidate[])=>void;
  onRequest:(message:string)=>void;
  onClose:()=>void;
}){
  const [state,setState]=useState<TechnicalFinderState>(initialIntent?{intent:initialIntent}:{});
  const [step,setStep]=useState<TechnicalFinderStep>(initialIntent?"context":"intent");
  const candidates=useMemo(()=>step==="results"?findTechnicalCandidates(products,state):[],[products,state,step]);
  const advance=()=>{const next=nextFinderStep(state);setStep(next);if(next==="results"){const results=findTechnicalCandidates(products,state);onResults(results);}};
  const back=()=>setStep(previousFinderStep(step));
  return <div className="overlay finder-overlay" role="presentation" onClick={event=>{if(event.target===event.currentTarget)onClose();}}>
    <section className="technical-finder" role="dialog" aria-modal="true" aria-label="Selector técnico">
      <header><div><span>SELECCIÓN ASISTIDA</span><h2>Selector técnico</h2><small>Paso {stepNumber[step]} de 4</small></div><button className="close" type="button" onClick={onClose} aria-label="Cerrar selector">×</button></header>
      <div className="finder-progress" aria-hidden="true"><i style={{width:`${stepNumber[step]*25}%`}}/></div>
      {step==="intent"&&<div className="finder-step"><h3>¿Qué trabajo necesitas realizar?</h3><div className="finder-intents">{mainIntents.map(id=><button type="button" key={id} onClick={()=>{setState({intent:id});setStep("context");}}>{catalogCategories.find(category=>category.id===id)?.label}</button>)}</div></div>}
      {step==="context"&&<div className="finder-step"><h3>{state.intent==="elevacion"?"¿Qué pieza necesitas manipular?":"¿Sobre qué elemento vas a trabajar?"}</h3><div className="finder-fields"><label>Pieza, soporte o aplicación<input value={state.piece??""} onChange={event=>setState(current=>({...current,piece:event.target.value}))} placeholder="Ej.: arqueta, placa base, losa…"/></label><label>Material<select value={state.material??""} onChange={event=>setState(current=>({...current,material:event.target.value}))}><option value="">Selecciona</option><option>hormigón</option><option>acero</option><option>madera</option><option>PVC</option><option>otro</option></select></label></div><FinderActions onBack={back} onNext={advance} nextDisabled={!state.piece?.trim()||!state.material}/></div>}
      {step==="details"&&<div className="finder-step"><h3>Completa los datos que condicionan la selección</h3><div className="finder-fields"><label>Dimensiones y geometría<textarea value={state.dimensions??""} onChange={event=>setState(current=>({...current,dimensions:event.target.value}))} placeholder="Diámetro, espesor, ancho y puntos de agarre"/></label><label>Peso de la pieza (kg)<input type="number" min="1" value={state.weightKg??""} onChange={event=>setState(current=>({...current,weightKg:Number(event.target.value)||undefined}))}/></label><label>Apertura necesaria (mm), si se conoce<input type="number" min="1" value={state.openingMm??""} onChange={event=>setState(current=>({...current,openingMm:Number(event.target.value)||undefined}))}/></label><label>Condiciones de uso<input value={state.conditions??""} onChange={event=>setState(current=>({...current,conditions:event.target.value}))} placeholder="Interior, exterior, eólico…"/></label><label>Código postal de entrega<input value={state.delivery??""} onChange={event=>setState(current=>({...current,delivery:event.target.value}))}/></label></div><FinderActions onBack={back} onNext={advance} nextDisabled={!state.weightKg||!state.dimensions?.trim()}/></div>}
      {step==="results"&&<div className="finder-step finder-results"><h3>Resultado orientativo</h3><p>Estos candidatos no sustituyen la validación del fabricante ni un plan de izado.</p><div className="finder-summary"><strong>Resumen editable</strong><span>{state.piece} · {state.material}{state.weightKg?` · ${state.weightKg} kg`:""}</span><button type="button" onClick={()=>setStep(state.intent==="elevacion"?"details":"context")}>Editar datos</button></div>{candidates.length?<div className="finder-candidates">{candidates.slice(0,6).map(candidate=><article key={candidate.product.id}><img src={candidate.product.imageUrl} alt=""/><div><small>{candidate.product.brand} · {candidate.product.reference}</small><strong>{candidate.product.name}</strong><span className={candidate.status}>{candidate.status==="compatible"?"Compatible con los datos indicados":"Requiere confirmación técnica"}</span>{candidate.reasons.length>0&&<p>{candidate.reasons[0]}</p>}</div></article>)}</div>:<p>No hay un candidato seguro con estos datos.</p>}<button className="finder-request" type="button" onClick={()=>onRequest(formatTechnicalRequest(state))}>Solicitar selección y oferta</button><button className="finder-back" type="button" onClick={back}>Volver</button></div>}
    </section>
  </div>;
}

function FinderActions({onBack,onNext,nextDisabled}:{onBack:()=>void;onNext:()=>void;nextDisabled:boolean}){return <div className="finder-actions"><button type="button" onClick={onBack}>Volver</button><button type="button" onClick={onNext} disabled={nextDisabled}>Continuar</button></div>}
