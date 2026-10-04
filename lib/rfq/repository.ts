import type {CreatedRfq, RfqRepository, RfqRequest} from "./types";

export class SupabaseRfqRepository implements RfqRepository {
  constructor(private readonly url = process.env.SUPABASE_URL, private readonly key = process.env.SUPABASE_SERVICE_ROLE_KEY) {}
  async create(input: RfqRequest): Promise<CreatedRfq> {
    if (!this.url || !this.key) throw new Error("Servicio de solicitudes pendiente de activar");
    const response = await fetch(`${this.url}/rest/v1/rpc/create_rfq_request`, {method: "POST", headers: {apikey: this.key, Authorization: `Bearer ${this.key}`, "Content-Type": "application/json"}, body: JSON.stringify({payload: input}), cache: "no-store"});
    if (!response.ok) throw new Error(`No se pudo guardar la solicitud (${response.status})`);
    const data = await response.json() as CreatedRfq | CreatedRfq[];
    const created = Array.isArray(data) ? data[0] : data;
    if (!created?.id) throw new Error("Respuesta de almacenamiento no válida");
    return created;
  }
}
