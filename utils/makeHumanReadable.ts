function makeHumanReadable(num : number) {
    const units = ["","K", "M", "G", "T"];
    const base = 1000;

    let exponent = 0;
    while (num >= base && exponent < units.length) {
        num /= base;
        exponent++;
    }

    return `${num.toFixed(2)}${units[exponent]}`;
}

export default makeHumanReadable;