import { Reauthentication } from "@/interfaces/admin/api";

export interface ReauthDialogProps {
    title: string;
    mfa: boolean;
    action: (credentials: Reauthentication) => Promise<unknown>;
    finish: (success: boolean) => void;
}
