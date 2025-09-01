interface FormatNGNOptions {
  style: "currency";
  currency: "NGN";
  minimumFractionDigits: number;
  maximumFractionDigits: number;
}

export function formatNGN(amount: number | string): string {
  let number: number;

  if (typeof amount === "string") {
    number = parseFloat(amount);
  } else {
    number = amount;
  }

  if (isNaN(number)) {
    throw new Error("Invalid amount: Must be a valid number or numeric string");
  }

  // Format with 2 decimal places
  const options: FormatNGNOptions = {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  const formatted = new Intl.NumberFormat("en-NG", options).format(number);

  // Remove .00 if present for whole numbers
  return formatted.replace(/\.00$/, "");
}
