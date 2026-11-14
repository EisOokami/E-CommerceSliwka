import { Session, AuditEvent } from "@/interfaces/admin/api";

export interface SecurityProps {
    initialData: { sessions: Session[]; events: AuditEvent[] };
}
