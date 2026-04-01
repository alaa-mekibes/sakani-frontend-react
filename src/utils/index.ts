export const priceFormatter = (price: number) => {
    return new Intl.NumberFormat('en-DZ', {
        style: 'currency',
        currency: 'DZD',
        maximumFractionDigits: 0,
    }).format(price);
}