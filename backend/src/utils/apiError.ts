export class ApiError extends Error {
    statusCode: number;
    data: unknown;

    constructor({
        statusCode = 500,
        message = "Internal server error",
        data,
    }: {
        statusCode?: number;
        message?: string;
        data?: unknown;
    }) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;

        if (data !== undefined) {
            this.data = data;
        }
    }
}
