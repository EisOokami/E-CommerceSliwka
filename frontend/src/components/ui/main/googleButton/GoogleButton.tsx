import { FaGoogle } from "react-icons/fa";
import { outlineButtonClass } from "@/constants/styles";
import { GoogleButtonProps } from "./GoogleButton.interfaces";

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export const isGoogleSignInAvailable = Boolean(apiUrl);

export default function GoogleButton({
    termsAccepted = false,
    disabled = false,
}: Readonly<GoogleButtonProps>) {
    if (!apiUrl) {
        return null;
    }

    const content = (
        <>
            <FaGoogle />
            Continue with Google
        </>
    );

    if (disabled) {
        return (
            <button
                type="button"
                disabled
                className={`${outlineButtonClass} w-full`}
            >
                {content}
            </button>
        );
    }

    return (
        <a
            href={`${apiUrl}/api/auth/google${termsAccepted ? "?terms=accepted" : ""}`}
            className={`${outlineButtonClass} w-full`}
        >
            {content}
        </a>
    );
}
