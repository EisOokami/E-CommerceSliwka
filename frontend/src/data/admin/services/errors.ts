export class AdminApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public details: { field: string; message: string }[] = [],
    ) {
        super(message);
    }
}

export function errorMessage(error: unknown) {
    return error instanceof Error
        ? error.message
        : "Something went wrong. Please retry.";
}

export type ActionResult<T> =
    | { ok: true; data: T }
    | {
          ok: false;
          error: {
              status: number;
              message: string;
              details: { field: string; message: string }[];
          };
      };
