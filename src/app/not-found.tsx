import Button from "@/components/ui/button/Button";

export default function NotFoundRoot() {
    return (
        <div className="w-full h-svh pb-32 grid justify-items-center content-center text-center">
            <h3 className="font-bold text-xl md:text-4xl">
                Whoops, that page is gone.
            </h3>
            <h1 className="text-[200px] md:text-[300px] xl:text-[400px] font-bold text-gray-300">
                404
            </h1>
            <Button
                text="Back to Home page"
                theme="dark"
                href="/"
                className="text-sm md:text-xl"
                inline
                isLink
            />
        </div>
    );
}
