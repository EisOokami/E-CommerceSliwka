import * as retentionService from "../services/retention.service.js";
import { startAdminSessionCleanup } from "./adminSessionCleanup.js";

export const startRetentionCleanup = () => {
    return startAdminSessionCleanup(
        60 * 60000,
        retentionService.cleanupExpiredData,
    );
};
