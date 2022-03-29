export function isNumber(n: any): boolean {
    return Number(n) == n;
}
export function isNumberStrict(n: any): boolean {
    return Number(n) === n;
}