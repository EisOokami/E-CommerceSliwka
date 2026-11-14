"use client";

import { EmptyStateProps } from "./EmptyState.interfaces";

export default function EmptyState({
    icon: Icon,
    title,
    body,
}: Readonly<EmptyStateProps>) {
    return (
        <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center mb-3">
                <Icon size={32} className="text-gray-500" />
            </div>
            <p className="text-xl font-medium text-black">{title}</p>
            <p className="mt-1 text-base text-gray-500 max-w-sm">{body}</p>
        </div>
    );
}
