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
    identifier: yup
        .string()
        .trim()
        .required("Please enter a valid email address")
        .email("Please enter a valid email address"),
    password: yup
        .string()
        .required("Password must be between 8 and 100 characters")
        .min(8, "Password must be between 8 and 100 characters")
        .max(100, "Password must be between 8 and 100 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/\d/, "Password must contain at least one number")
        .matches(
            /[@$!%*?&#^()\-=+~`'"/|.,;:\[\]{}]/,
            "Password must contain at least one special character (@$!%*?&#^()-=+~`'\"/|.,;:[]{})",
        ),
});

const createRegisterSchema = (config: {
    validatePassword?: (value: string) => Promise<boolean>;
}) =>
    yup.object({
        email: yup
            .string()
            .trim()
            .required("Please enter a valid email address")
            .email("Please enter a valid email address"),
        username: yup
            .string()
            .required("Username must be between 3 and 40 characters")
            .min(3, "Username must be between 3 and 40 characters")
            .max(40, "Username must be between 3 and 40 characters")
            .matches(
                /^[A-Za-z\s]+$/,
                "Username must contain only letters and spaces",
            ),
        password: yup
            .string()
            .required("Password must be between 8 and 100 characters")
            .min(8, "Password must be between 8 and 100 characters")
            .max(100, "Password must be between 8 and 100 characters")
            .matches(
                /[A-Z]/,
                "Password must contain at least one uppercase letter",
            )
            .matches(
                /[a-z]/,
                "Password must contain at least one lowercase letter",
            )
            .matches(/\d/, "Password must contain at least one number")
            .matches(
                /[@$!%*?&#^()\-=+~`'"/|.,;:\[\]{}]/,
                "Password must contain at least one special character (@$!%*?&#^()-=+~`'\"/|.,;:[]{})",
            )
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

const updateUserBodySchema = yup.object().shape({
    email: yup
        .string()
        .trim()
        .required("Please enter a valid email address")
        .email("Please enter a valid email address"),
    username: yup
        .string()
        .required("Username must be between 3 and 40 characters")
        .min(3, "Username must be between 3 and 40 characters")
        .max(40, "Username must be between 3 and 40 characters")
        .matches(
            /^[A-Za-z\s]+$/,
            "Username must contain only letters and spaces",
        ),
    password: yup.mixed(),
    // .string()
    // .required("Password must be between 8 and 100 characters")
    // .min(8, "Password must be between 8 and 100 characters")
    // .max(100, "Password must be between 8 and 100 characters")
    // .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    // .matches(/\d/, "Password must contain at least one number")
    // .matches(
    //     /[@$!%*?&#^()\-=+~`'"/|.,;:\[\]{}]/,
    //     "Password must contain at least one special character (@$!%*?&#^()-=+~`'\"/|.,;:[]{})",
    // )
    // .test(
    //     "password-validation",
    //     "Password must be at least 1 character",
    //     function validatePassword(value) {
    //         if (value == null || value === "") {
    //             return true;
    //         }
    //         return typeof value === "string" && value.length >= 1;
    //     },
    // ),
    role: yup.lazy((value) =>
        typeof value === "object"
            ? yup.object().shape({
                  connect: yup
                      .array()
                      .of(yup.object().shape({ id: yup.strapiID().required() }))
                      .required(),
                  disconnect: yup
                      .array()
                      .test(
                          "CheckDisconnect",
                          "Cannot remove role",
                          function test(disconnectValue) {
                              if (
                                  value.connect.length === 0 &&
                                  disconnectValue.length > 0
                              ) {
                                  return false;
                              }

                              return true;
                          },
                      )
                      .required(),
              })
            : yup.strapiID(),
    ),
});

const createChangePasswordSchema = (config) =>
    yup
        .object({
            password: yup
                .string()
                .required("New password must be between 8 and 100 characters")
                .min(8, "New password must be between 8 and 100 characters")
                .max(100, "New password must be between 8 and 100 characters")
                .matches(
                    /[A-Z]/,
                    "New password must contain at least one uppercase letter",
                )
                .matches(
                    /[a-z]/,
                    "New password must contain at least one lowercase letter",
                )
                .matches(/\d/, "New password must contain at least one number")
                .matches(
                    /[@$!%*?&#^()\-=+~`'"/|.,;:\[\]{}]/,
                    "New password must contain at least one special character (@$!%*?&#^()-=+~`'\"/|.,;:[]{})",
                )
                .test(function (this: TestContext, value) {
                    if (!value) return true;
                    const isValid =
                        new TextEncoder().encode(value).length <= 72;
                    if (!isValid) {
                        return this.createError({
                            message: "New password must be less than 73 bytes",
                        });
                    }
                    return true;
                })
                .test(async function (this: TestContext, value) {
                    if (typeof config?.validatePassword === "function") {
                        try {
                            const isValid =
                                await config.validatePassword(value);
                            if (!isValid) {
                                return this.createError({
                                    message: "New password validation failed.",
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
            passwordConfirmation: yup
                .string()
                .required(
                    "Confirm new password must be between 8 and 100 characters",
                )
                .min(
                    8,
                    "Confirm new password must be between 8 and 100 characters",
                )
                .max(
                    100,
                    "Confirm new password must be between 8 and 100 characters",
                )
                .matches(
                    /[A-Z]/,
                    "Confirm new password must contain at least one uppercase letter",
                )
                .matches(
                    /[a-z]/,
                    "Confirm new password must contain at least one lowercase letter",
                )
                .matches(
                    /\d/,
                    "Confirm new password must contain at least one number",
                )
                .matches(
                    /[@$!%*?&#^()\-=+~`'"/|.,;:\[\]{}]/,
                    "Confirm new password must contain at least one special character (@$!%*?&#^()-=+~`'\"/|.,;:[]{})",
                )
                .oneOf([yup.ref("password")], "New passwords do not match"),
            currentPassword: yup
                .string()
                .required(
                    "Current password must be between 8 and 100 characters",
                )
                .min(8, "Current password must be between 8 and 100 characters")
                .max(
                    100,
                    "Current password must be between 8 and 100 characters",
                )
                .matches(
                    /[A-Z]/,
                    "Current password must contain at least one uppercase letter",
                )
                .matches(
                    /[a-z]/,
                    "Current password must contain at least one lowercase letter",
                )
                .matches(
                    /\d/,
                    "Current password must contain at least one number",
                )
                .matches(
                    /[@$!%*?&#^()\-=+~`'"/|.,;:\[\]{}]/,
                    "Current password must contain at least one special character (@$!%*?&#^()-=+~`'\"/|.,;:[]{})",
                ),
        })
        .noUnknown();

const validateRegisterBody = (payload, config) =>
    validateYupSchema(createRegisterSchema(config))(payload);
const validateCallbackBody = validateYupSchema(callbackSchema);
const validateUpdateUserBody = validateYupSchema(updateUserBodySchema);
const validateChangePasswordBody = (payload, config) =>
    validateYupSchema(createChangePasswordSchema(config))(payload);

const sanitizeUser = (user, ctx) => {
    const { auth } = ctx.state;
    const userSchema = strapi.getModel("plugin::users-permissions.user");

    return strapi.contentAPI.sanitize.output(user, userSchema, { auth });
};

const sanitizeOutput = async (user, ctx) => {
    const schema = strapi.getModel("plugin::users-permissions.user");
    const { auth } = ctx.state;

    return strapi.contentAPI.sanitize.output(user, schema, { auth });
};

const { ApplicationError, ValidationError, ForbiddenError, NotFoundError } =
    utils.errors;

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

                    const csrfToken = crypto.randomBytes(32).toString("hex");

                    await getService("user").edit(user.id, {
                        csrfToken,
                    });

                    return ctx.send({
                        jwt: getService("jwt").issue({ id: user.id }),
                        csrfToken,
                        user: await sanitizeUser(user, ctx),
                    });
                } catch (error) {
                    throw new ApplicationError(error.message);
                }
            };

        strapi.plugins["users-permissions"].controllers["auth"].changePassword =
            async (ctx) => {
                if (!ctx.state.user) {
                    throw new ApplicationError(
                        "You must be authenticated to reset your password",
                    );
                }

                const validations = strapi.config.get(
                    "plugin::users-permissions.validationRules",
                );

                const { currentPassword, password } =
                    await validateChangePasswordBody(
                        ctx.request.body,
                        validations,
                    );

                const user = await strapi.db
                    .query("plugin::users-permissions.user")
                    .findOne({ where: { id: ctx.state.user.id } });

                const validPassword = await getService("user").validatePassword(
                    currentPassword,
                    user.password,
                );

                if (!validPassword) {
                    throw new ValidationError(
                        "The provided current password is invalid",
                    );
                }

                if (currentPassword === password) {
                    throw new ValidationError(
                        "Your new password must be different than your current password",
                    );
                }

                await getService("user").edit(user.id, { password });

                const csrfToken = crypto.randomBytes(32).toString("hex");

                await getService("user").edit(user.id, {
                    csrfToken,
                });

                ctx.send({
                    jwt: getService("jwt").issue({ id: user.id }),
                    csrfToken,
                    user: await sanitizeUser(user, ctx),
                });
            };

        strapi.plugins["users-permissions"].controllers["user"].update = async (
            ctx,
        ) => {
            const advancedConfigs = (await strapi
                .store({
                    type: "plugin",
                    name: "users-permissions",
                    key: "advanced",
                })
                .get()) as any;

            const { id } = ctx.params;
            const { email, username, password } = ctx.request.body;

            const user = await getService("user").fetch(id);
            if (!user) {
                throw new NotFoundError(`User not found`);
            }

            if (user.documentId !== ctx.state.user.documentId) {
                throw new NotFoundError(`User not found`);
            }

            await validateUpdateUserBody(ctx.request.body);

            if (
                user.provider === "local" &&
                _.has(ctx.request.body, "password") &&
                !password
            ) {
                throw new ValidationError("password.notNull");
            }

            if (_.has(ctx.request.body, "username")) {
                const userWithSameUsername = await strapi.db
                    .query("plugin::users-permissions.user")
                    .findOne({ where: { username } });

                if (
                    userWithSameUsername &&
                    _.toString(userWithSameUsername.id) !== _.toString(id)
                ) {
                    throw new ApplicationError("Username already taken");
                }
            }

            if (
                _.has(ctx.request.body, "email") &&
                advancedConfigs.unique_email
            ) {
                const userWithSameEmail = await strapi.db
                    .query("plugin::users-permissions.user")
                    .findOne({ where: { email: email.toLowerCase() } });

                if (
                    userWithSameEmail &&
                    _.toString(userWithSameEmail.id) !== _.toString(id)
                ) {
                    throw new ApplicationError("Email already taken");
                }
                ctx.request.body.email = ctx.request.body.email.toLowerCase();
            }

            const updateData = {
                ...ctx.request.body,
            };

            const data = await getService("user").edit(user.id, updateData);
            const sanitizedData = await sanitizeOutput(data, ctx);

            ctx.send(sanitizedData);
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
