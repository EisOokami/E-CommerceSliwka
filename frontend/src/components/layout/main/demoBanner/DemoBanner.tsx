import Link from "next/link";

export default function DemoBanner() {
    return (
        <aside className="px-3 py-2 text-sm md:text-base text-center text-black bg-amber-300">
            <p className="container mx-auto text-pretty">
                <strong>DEMO STORE.</strong> This is a portfolio project:
                nothing is sold, orders are never shipped and payments run in
                Stripe test mode only.{" "}
                <strong>
                    Do not enter real card details, names or addresses.
                </strong>{" "}
                <Link href="/terms" className="underline">
                    Terms
                </Link>
                {" · "}
                <Link href="/privacy" className="underline">
                    Privacy
                </Link>
            </p>
        </aside>
    );
}
