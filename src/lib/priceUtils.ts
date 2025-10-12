/**
 * Utility functions for handling price formatting and parsing
 */

/**
 * Format a number or string as a currency string with £ symbol and comma separators
 * @param price - The price as a number or string
 * @returns Formatted price string (e.g., "£1,000,000")
 */
export function formatPrice(price: number | string): string {
  // Handle string inputs (for backwards compatibility)
  if (typeof price === 'string') {
    // If it already has £ symbol, just return it if it looks formatted
    if (price.includes('£') && price.includes(',')) {
      return price;
    }
    // Parse string to number
    const numPrice = parsePrice(price);
    if (isNaN(numPrice) || numPrice < 0) {
      return '£0';
    }
    return `£${numPrice.toLocaleString('en-GB')}`;
  }
  
  // Handle number inputs
  if (isNaN(price) || price < 0) {
    return '£0';
  }
  
  return `£${price.toLocaleString('en-GB')}`;
}

/**
 * Parse a price string to a number, removing £ symbol and commas
 * @param priceString - The price string (e.g., "£1,000,000" or "1000000")
 * @returns The price as a number
 */
export function parsePrice(priceString: string): number {
  if (!priceString || typeof priceString !== 'string') {
    return 0;
  }
  
  // Remove £ symbol, commas, and any whitespace
  const cleanedPrice = priceString.replace(/[£,\s]/g, '');
  const parsed = parseInt(cleanedPrice, 10);
  
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Validate if a price string is valid
 * @param priceString - The price string to validate
 * @returns True if valid, false otherwise
 */
export function isValidPrice(priceString: string): boolean {
  if (!priceString || typeof priceString !== 'string') {
    return false;
  }
  
  const cleaned = priceString.replace(/[£,\s]/g, '');
  const parsed = parseInt(cleaned, 10);
  
  return !isNaN(parsed) && parsed >= 0;
}

/**
 * Format a price input for display while typing (adds commas as user types)
 * @param value - The current input value
 * @returns Formatted value for display
 */
export function formatPriceInput(value: string): string {
  // Remove all non-numeric characters
  const numericValue = value.replace(/[^\d]/g, '');
  
  if (!numericValue) {
    return '';
  }
  
  // Add commas for thousands
  return parseInt(numericValue, 10).toLocaleString('en-GB');
}

/**
 * Convert old string prices to numbers (for migration purposes)
 * @param oldPrice - The old price string (e.g., "£450,000")
 * @returns The price as a number
 */
export function migrateOldPrice(oldPrice: string): number {
  return parsePrice(oldPrice);
}
