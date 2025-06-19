import Button from "@/components/ui/button/Button";

export default function NotFoundRoot() {
    return (
        <main className="grid justify-items-center content-center mb-auto py-10 md:py-20 text-center">
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
        </main>
    );
}
