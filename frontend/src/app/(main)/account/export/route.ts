import { NextResponse, type NextRequest } from "next/server";
import { storeRequest, StoreApiError } from "@/data/main/services/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        const data = await storeRequest<unknown>("/api/users/me/export", {
            authenticated: true,
        });
        const date = new Date().toISOString().slice(0, 10);

        return new NextResponse(JSON.stringify(data, null, 2), {
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Content-Disposition": `attachment; filename="sliwka-my-data-${date}.json"`,
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        const status = error instanceof StoreApiError ? error.status : 503;

        if (status === 401) {
            return NextResponse.redirect(new URL("/signIn", request.url));
        }

        return new NextResponse(
            status === 429
                ? "Too many export requests. Please try again in an hour."
                : "Your data could not be exported. Please try again later.",
            {
                status,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
            },
        );
    }
}
