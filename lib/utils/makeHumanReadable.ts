function makeHumanReadable(value : number) {
    const units = ["", "K", "M", "G", "T", "P", "E"];
    const base = 1000;

    let exponent = 0;
    while (value >= base && exponent < units.length) {
        value /= base;
        exponent++;
    }

    return `${value.toFixed(2)}${units[exponent]}`;
}

export default makeHumanReadable;