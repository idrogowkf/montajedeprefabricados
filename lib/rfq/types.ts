export type RfqItem = {slug: string; quantity: number};
export type RfqRequest = {
  companyName: string; nif: string; contactName: string; email: string; phone: string;
  deliveryLocation: string; notes: string; idempotencyKey: string; items: RfqItem[];
};
export type CreatedRfq = {id: string; reference: string; duplicate: boolean};
export type RfqRepository = {create(input: RfqRequest): Promise<CreatedRfq>};
