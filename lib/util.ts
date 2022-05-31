export function getRandomIconFromAddress(address: string) {
    const num = parseInt(address.slice(-4), 16);
    return `/logo/${num % 4}.png`;
}