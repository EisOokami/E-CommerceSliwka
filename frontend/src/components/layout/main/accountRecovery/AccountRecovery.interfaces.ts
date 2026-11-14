import { RecoveryMode } from "@/types/types";

export interface AccountRecoveryProps {
    mode: RecoveryMode;
    token?: string;
    id?: string;
}
