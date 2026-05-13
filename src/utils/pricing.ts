export function calculatePricing(basePricePerNight: number, nights: number, hasPerks: boolean) {
  const basePrice = basePricePerNight * nights;
  const discount = hasPerks ? Math.round(basePrice * 0.1) : 0;
  const totalPrice = basePrice - discount;
  
  return { basePrice, discount, totalPrice };
}