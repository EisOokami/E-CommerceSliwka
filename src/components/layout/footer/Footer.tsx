import { FaFacebook, FaInstagram, FaTiktok, FaTwitter } from "react-icons/fa";
import styles from "./Footer.module.scss";

import Logo from "@/components/ui/logo/Logo";

export default function Footer() {
    return (
        <footer className="text-white bg-black">
            <div className="grid gap-10 md:gap-0 container mx-auto py-10 md:py-20">
                <div className="grid md:flex md:justify-between gap-10 md:gap-0">
                    <div className="text-center md:text-left grid content-start justify-items-center md:justify-items-start gap-5 md:w-1/3">
                        <Logo width={50} height={50} />
                        <p className="md:text-xl text-gray-300">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Quisquam aperiam, velit saepe cupiditate in
                            alias corrupti repellat rem excepturi.
                            Reprehenderit.
                        </p>
                    </div>
                    <div className="text-center md:text-left grid gap-2">
                        <h6 className="text-lg md:text-2xl">Services</h6>
                        <ul className={styles["footer__container-links"]}>
                            <li>Bonus program</li>
                            <li>Gift cards</li>
                            <li>Credit and payment</li>
                            <li>Service contracts</li>
                            <li>Non-cash account</li>
                            <li>Payment</li>
                        </ul>
                    </div>
                    <div className="text-center md:text-left grid gap-2">
                        <h6 className="text-lg md:text-2xl">
                            Assistance to the buyer
                        </h6>
                        <ul className={styles["footer__container-links"]}>
                            <li>Find an order</li>
                            <li>Terms of delivery</li>
                            <li>Exchange and return of goods</li>
                            <li>Guarantee</li>
                            <li>Frequently asked questions</li>
                            <li>Terms of use of the site</li>
                        </ul>
                    </div>
                </div>
                <div className="flex justify-center md:justify-normal gap-5">
                    <FaTwitter className={styles.footer__icons} />
                    <FaFacebook className={styles.footer__icons} />
                    <FaTiktok className={styles.footer__icons} />
                    <FaInstagram className={styles.footer__icons} />
                </div>
            </div>
        </footer>
    );
}
