import "server-only";

import { adminRequest } from "./server";
import type { Session, AuditEvent } from "@/interfaces/admin/api";

export async function getSecurityData() {
    const [sessions, events] = await Promise.all([
        adminRequest<Session[]>("/auth/sessions"),
        adminRequest<AuditEvent[]>("/auth/security-events"),
    ]);

    return { sessions, events };
}
