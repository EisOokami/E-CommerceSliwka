import type { Core } from "@strapi/strapi";
import type { TestContext } from "yup";
import crypto from "crypto";
const bcrypt = require("bcryptjs");

const utils = require("@strapi/utils");
const { yup, validateYupSchema } = require("@strapi/utils");
const _ = require("lodash");
const { concat, compact, isArray } = require("lodash/fp");

const getService = (name) => {
    return strapi.plugin("users-permissions").service(name);
};

const callbackSchema = yup.object({
    identifier: yup.string().required(),
    password: yup.string().required(),
});

const createRegisterSchema = (config: {
    validatePassword?: (value: string) => Promise<boolean>;
}) =>
    yup.object({
        email: yup.string().email().required(),
        username: yup.string().required(),
        password: yup
            .string()
            .required()
            .test(function (this: TestContext, value) {
                if (!value) return true;
                const isValid = new TextEncoder().encode(value).length <= 72;
                if (!isValid) {
                    return this.createError({
                        message: "Password must be less than 73 bytes",
                    });
                }
                return true;
            })
            .test(async function (this: TestContext, value) {
                if (typeof config?.validatePassword === "function") {
                    try {
                        const isValid = await config.validatePassword(value);
                        if (!isValid) {
                            return this.createError({
                                message: "Password validation failed.",
                            });
                        }
                    } catch (error) {
                        return this.createError({
                            message: error.message || "An error occurred.",
                        });
                    }
                }
                return true;
            }),
    });

const validateRegisterBody = (payload, config) =>
    validateYupSchema(createRegisterSchema(config))(payload);
const validateCallbackBody = validateYupSchema(callbackSchema);

const sanitizeUser = (user, ctx) => {
    const { auth } = ctx.state;
    const userSchema = strapi.getModel("plugin::users-permissions.user");

    return strapi.contentAPI.sanitize.output(user, userSchema, { auth });
};

const { ApplicationError, ValidationError, ForbiddenError } = utils.errors;

export default {
    /**
     * An asynchronous register function that runs before
     * your application is initialized.
     *
     * This gives you an opportunity to extend code.
     */
    register({ strapi }: { strapi: Core.Strapi }) {
        strapi.plugins["users-permissions"].controllers["auth"].register =
            async (ctx) => {
                const pluginStore = await strapi.store({
                    type: "plugin",
                    name: "users-permissions",
                });

                const settings = (await pluginStore.get({
                    key: "advanced",
                })) as any;

                if (!settings.allow_register) {
                    throw new ApplicationError(
                        "Register action is currently disabled",
                    );
                }

                const { register } = strapi.config.get(
                    "plugin::users-permissions",
                ) as any;
                const alwaysAllowedKeys = ["username", "password", "email"];

                const allowedKeys = compact(
                    concat(
                        alwaysAllowedKeys,
                        isArray(register?.allowedFields)
                            ? register.allowedFields
                            : [],
                    ),
                );

                const invalidKeys = Object.keys(ctx.request.body).filter(
                    (key) => !allowedKeys.includes(key),
                );

                if (invalidKeys.length > 0) {
                    throw new ValidationError(
                        `Invalid parameters: ${invalidKeys.join(", ")}`,
                    );
                }

                const params = {
                    ..._.pick(ctx.request.body, allowedKeys),
                    provider: "local",
                };

                const validations = strapi.config.get(
                    "plugin::users-permissions.validationRules",
                );

                await validateRegisterBody(params, validations);

                const role = await strapi.db
                    .query("plugin::users-permissions.role")
                    .findOne({ where: { type: settings.default_role } });

                if (!role) {
                    throw new ApplicationError(
                        "Impossible to find the default role",
                    );
                }

                const { email, username, provider } = params;

                const identifierFilter = {
                    $or: [
                        { email: email.toLowerCase() },
                        { username: email.toLowerCase() },
                        { username },
                        { email: username },
                    ],
                };

                const conflictingUserCount = await strapi.db
                    .query("plugin::users-permissions.user")
                    .count({
                        where: { ...identifierFilter, provider },
                    });

                if (conflictingUserCount > 0) {
                    throw new ApplicationError(
                        "Email or Username are already taken",
                    );
                }

                if (settings.unique_email) {
                    const conflictingUserCount = await strapi.db
                        .query("plugin::users-permissions.user")
                        .count({
                            where: { ...identifierFilter },
                        });

                    if (conflictingUserCount > 0) {
                        throw new ApplicationError(
                            "Email or Username are already taken",
                        );
                    }
                }

                const csrfToken = crypto.randomBytes(32).toString("hex");

                const newUser = {
                    ...params,
                    role: role.id,
                    email: email.toLowerCase(),
                    username,
                    confirmed: !settings.email_confirmation,
                    csrfToken,
                };

                const user = await getService("user").add(newUser);
                const sanitizedUser = await sanitizeUser(user, ctx);

                if (settings.email_confirmation) {
                    try {
                        await getService("user").sendConfirmationEmail(
                            sanitizedUser,
                        );
                    } catch (err) {
                        strapi.log.error(err);
                        throw new ApplicationError(
                            "Error sending confirmation email",
                        );
                    }

                    return ctx.send({ user: sanitizedUser });
                }

                const jwt = getService("jwt").issue(_.pick(user, ["id"]));

                return ctx.send({
                    jwt,
                    csrfToken,
                    user: sanitizedUser,
                });
            };

        strapi.plugins["users-permissions"].controllers["auth"].callback =
            async (ctx) => {
                const provider = ctx.params.provider || "local";
                const params = ctx.request.body;

                const store = strapi.store({
                    type: "plugin",
                    name: "users-permissions",
                });
                const grantSettings = await store.get({ key: "grant" });

                const grantProvider = provider === "local" ? "email" : provider;

                if (!_.get(grantSettings, [grantProvider, "enabled"])) {
                    throw new ApplicationError("This provider is disabled");
                }

                if (provider === "local") {
                    await validateCallbackBody(params);

                    const { identifier } = params;

                    const user = await strapi.db
                        .query("plugin::users-permissions.user")
                        .findOne({
                            where: {
                                provider,
                                $or: [
                                    { email: identifier.toLowerCase() },
                                    { username: identifier },
                                ],
                            },
                        });

                    if (!user) {
                        throw new ValidationError(
                            "Invalid identifier or password",
                        );
                    }

                    if (!user.password) {
                        throw new ValidationError(
                            "Invalid identifier or password",
                        );
                    }

                    const validPassword = await getService(
                        "user",
                    ).validatePassword(params.password, user.password);

                    if (!validPassword) {
                        throw new ValidationError(
                            "Invalid identifier or password",
                        );
                    }

                    const advancedSettings = await store.get({
                        key: "advanced",
                    });
                    const requiresConfirmation = _.get(
                        advancedSettings,
                        "email_confirmation",
                    );

                    if (requiresConfirmation && user.confirmed !== true) {
                        throw new ApplicationError(
                            "Your account email is not confirmed",
                        );
                    }

                    if (user.blocked === true) {
                        throw new ApplicationError(
                            "Your account has been blocked by an administrator",
                        );
                    }

                    const csrfToken = crypto.randomBytes(32).toString("hex");

                    await getService("user").edit(user.id, {
                        csrfToken,
                    });

                    return ctx.send({
                        jwt: getService("jwt").issue({ id: user.id }),
                        csrfToken,
                        user: await sanitizeUser(user, ctx),
                    });
                }

                try {
                    const user = await getService("providers").connect(
                        provider,
                        ctx.query,
                    );

                    if (user.blocked) {
                        throw new ForbiddenError(
                            "Your account has been blocked by an administrator",
                        );
                    }

                    return ctx.send({
                        jwt: getService("jwt").issue({ id: user.id }),
                        user: await sanitizeUser(user, ctx),
                    });
                } catch (error) {
                    throw new ApplicationError(error.message);
                }
            };
    },

    /**
     * An asynchronous bootstrap function that runs before
     * your application gets started.
     *
     * This gives you an opportunity to set up your data model,
     * run jobs, or perform some special logic.
     */
    bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};
