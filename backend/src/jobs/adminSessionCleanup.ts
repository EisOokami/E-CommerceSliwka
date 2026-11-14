import * as sessionService from "../services/session.service.js";

export function startAdminSessionCleanup(
    intervalMs = 60 * 60000,
    cleanup = sessionService.cleanupSessions,
) {
    let running: Promise<void> | undefined;
    let stopped = false;

    const run = () => {
        if (stopped || running) {
            return;
        }

        running = cleanup()
            .then(() => undefined)
            .catch(() => {
                console.error(
                    "Admin session cleanup failed; will retry on next interval",
                );
            })
            .finally(() => {
                running = undefined;
            });
    };

    run();

    const timer = setInterval(run, intervalMs);

    timer.unref();

    return async () => {
        stopped = true;

        clearInterval(timer);

        await running;
    };
}
