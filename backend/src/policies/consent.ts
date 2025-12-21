import utils from "@strapi/utils";
const { PolicyError } = utils.errors;

export default async (policyContext, config, { strapi }) => {
    if (policyContext.state.user.agreeToTermsAndPrivacy) {
        return true;
    } else {
        const user = policyContext.state.user.username;

        throw new PolicyError(
            `Hi ${user}, Please agree to terms and conditions to continue.`,
            {
                policy: "consent-policy",
            },
        );
    }
};
