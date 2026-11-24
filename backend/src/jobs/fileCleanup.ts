import * as imageStorageService from "../services/imageStorage.service.js";
import { startAdminSessionCleanup } from "./adminSessionCleanup.js";

export async function cleanupFiles() {
    for (const file of await imageStorageService.pendingFileDeletions()) {
        try {
            await imageStorageService.removeStoredFile(file.fileUrl);
            await imageStorageService.finishFileDeletion(file.fileUrl);
        } catch {
            console.error("File cleanup failed; queued for retry");
        }
    }
}

export const startFileCleanup = () => {
    return startAdminSessionCleanup(60000, cleanupFiles);
};
