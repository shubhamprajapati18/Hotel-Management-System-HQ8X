/**
 * Format a number using Indian locale (e.g., 1,20,000 instead of 120,000)
 * and prefix with ₹ symbol.
 */
export function formatINR(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "₹0";
  return `₹${num.toLocaleString("en-IN")}`;
}

/**
 * Format for chart axis labels (e.g., ₹1.2L, ₹50k)
 */
export function formatINRShort(value: number): string {
  if (value >= 10_00_000) return `₹${(value / 10_00_000).toFixed(1)}Cr`;
  if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(1)}L`;
  if (value >= 1_000) return `₹${(value / 1_000).toFixed(0)}k`;
  return `₹${value}`;
}
