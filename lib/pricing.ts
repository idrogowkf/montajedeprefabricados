export type PriceInputs = {cost:number;inboundShipping:number;handling:number;contingencyPercent:number;targetMarginPercent:number;vatPercent:number};
const money=(value:number)=>Math.round((value+Number.EPSILON)*100)/100;
export function grossMarginPercent(cost:number,salePriceNet:number){return salePriceNet<=0?0:money(((salePriceNet-cost)/salePriceNet)*100)}
export function calculatePrice(input:PriceInputs){
  if(input.targetMarginPercent<0||input.targetMarginPercent>=100) throw new Error("Target margin must be between 0 and 99.99");
  const base=input.cost+input.inboundShipping+input.handling;
  const landedCost=money(base*(1+input.contingencyPercent/100));
  const salePriceNet=money(landedCost/(1-input.targetMarginPercent/100));
  const grossProfit=money(salePriceNet-landedCost);
  return {landedCost,salePriceNet,grossProfit,salePriceVat:money(salePriceNet*(1+input.vatPercent/100)),actualMarginPercent:grossMarginPercent(landedCost,salePriceNet)};
}
