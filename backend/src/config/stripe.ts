export function validateStripeConfig() {
    const key = process.env.STRIPE_KEY;

    if (key && !/^(sk|rk)_test_[A-Za-z0-9]+$/.test(key)) {
        throw new Error(
            "STRIPE_KEY must be a Stripe test-mode key (sk_test_... or rk_test_...)",
        );
    }
}
