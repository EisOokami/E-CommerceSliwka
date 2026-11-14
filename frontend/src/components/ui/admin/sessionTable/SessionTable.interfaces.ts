import type { Session } from "@/interfaces/admin/api";

export interface SessionTableProps {
    sessions: Session[];
    revoke?: (session: Session) => void;
    busy?: boolean;
}
