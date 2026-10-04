import type {RfqRepository, RfqRequest} from "./types";

export async function submitRfq(input: RfqRequest, repository: RfqRepository, notify: (input: RfqRequest, reference: string) => Promise<unknown>) {
  const created = await repository.create(input);
  if (created.duplicate) return {...created, notification: "skipped" as const};
  try {
    await notify(input, created.reference);
    return {...created, notification: "sent" as const};
  } catch (error) {
    console.error("RFQ saved but notification failed", error instanceof Error ? error.message : "unknown");
    return {...created, notification: "pending" as const};
  }
}
