export const moneyUnits = (value: string) => {
    const [whole, fraction = ""] = value.split(".");

    return BigInt(whole!) * 10000n + BigInt(fraction.padEnd(4, "0"));
};
