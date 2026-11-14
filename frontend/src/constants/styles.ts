export const focusClass =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2";
export const buttonBaseClass = `flex items-center justify-center gap-2 rounded-md border px-6 py-3 text-sm md:text-base transition disabled:cursor-not-allowed disabled:opacity-50 ${focusClass}`;
export const outlineButtonClass = `${buttonBaseClass} border-black text-black hover:bg-gray-100`;
export const solidButtonClass = `${buttonBaseClass} border-black bg-black text-white hover:bg-gray-900`;
export const fieldClass = `w-full min-w-0 rounded-lg border border-gray-200 bg-white px-4 py-3 text-base text-gray-700 disabled:opacity-50 ${focusClass}`;
export const cardClass = "bg-white border border-gray-200 rounded-lg p-5";
