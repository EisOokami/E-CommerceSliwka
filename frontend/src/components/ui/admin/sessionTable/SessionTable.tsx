"use client";

import { focusClass } from "@/constants/styles";
import { cn } from "@/lib/utils";
import { SessionTableProps } from "./SessionTable.interfaces";

export default function SessionTable({
    sessions,
    revoke,
    busy = false,
}: Readonly<SessionTableProps>) {
    return (
        <div className="overflow-auto relative">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="text-xs text-gray-500 border-b border-gray-200">
                        <th className="py-2 pr-3 font-medium">Device</th>
                        <th className="pr-3 font-medium">Last activity</th>
                        <th className="pr-3 font-medium">Expires</th>
                        <th>
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sessions.map((session) => (
                        <tr
                            key={session.id}
                            className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                        >
                            <td className="py-3 pr-3">
                                <p className="max-w-xs break-words text-sm text-gray-900">
                                    {session.userAgent ?? "Unknown device"}
                                    {session.current && (
                                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700 ml-2 align-middle">
                                            This device
                                        </span>
                                    )}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {session.ip ?? "Unknown IP"} · Created{" "}
                                    {session.createdAt
                                        ? new Date(
                                              session.createdAt,
                                          ).toLocaleString()
                                        : "-"}
                                </p>
                            </td>
                            <td className="pr-3 text-xs text-gray-700">
                                {session.lastActivityAt
                                    ? new Date(
                                          session.lastActivityAt,
                                      ).toLocaleString()
                                    : "-"}
                            </td>
                            <td className="pr-3 text-xs text-gray-700">
                                {session.expiresAt
                                    ? new Date(
                                          session.expiresAt,
                                      ).toLocaleString()
                                    : "-"}
                            </td>
                            <td className="text-right">
                                {revoke && (
                                    <button
                                        disabled={busy}
                                        className={cn(
                                            focusClass,
                                            "inline-flex items-center justify-center gap-1.5 h-8 rounded-md border px-3 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 border-gray-200 text-gray-700 hover:bg-gray-50",
                                        )}
                                        onClick={() => revoke(session)}
                                    >
                                        Revoke
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {!sessions.length && (
                <p className="py-6 text-sm text-gray-500">
                    No active sessions.
                </p>
            )}
        </div>
    );
}
