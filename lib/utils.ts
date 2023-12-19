import { PriceHistoryItem, Product } from "@/types";

const Notification = {
  WELCOME: 'WELCOME',
  CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
  LOWEST_PRICE: 'LOWEST_PRICE',
  THRESHOLD_MET: 'THRESHOLD_MET',
}

const THRESHOLD_PERCENTAGE = 40;

// Extracts and returns the price from a list of possible elements.
export function extractPrice(...elements: any) {
  for (const element of elements) {
    const priceText = element.text().trim();

    if(priceText) {
      const cleanPrice = priceText.replace(/[^\d.]/g, '');

      let firstPrice; 

      if (cleanPrice) {
        firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0];
      } 

      return firstPrice || cleanPrice;
    }
  }

  return '';
}

// Extracts and returns the currency symbol from an element.
export function extractCurrency(element: any) {
  const currencyText = element.text().trim().slice(0, 1);
  return currencyText ? currencyText : "";
}

// Extracts description from two possible elements from amazon
export function extractDescription($: any) {
  // these are possible elements holding description of the product
  const selectors = [
    ".a-unordered-list .a-list-item",
    ".a-expander-content p",
    // Add more selectors here if needed
  ];

  for (const selector of selectors) {
    const elements = $(selector);
    if (elements.length > 0) {
      const textContent = elements
        .map((_: any, element: any) => $(element).text().trim())
        .get()
        .join("\n");
      return textContent;
    }
  }

  // If no matching elements were found, return an empty string
  return "";
}

// export function getHighestPrice(priceList: PriceHistoryItem[]) {
//   let highestPrice = priceList[0];

//   for (let i = 0; i < priceList.length; i++) {
//     if (priceList[i].price > highestPrice.price) {
//       highestPrice = priceList[i];
//     }
//   }

//   return highestPrice.price;
// }

export function getHighestPrice(priceList: PriceHistoryItem[]) {
  if (priceList.length === 0) return 0;

  let highestPrice = priceList[0].price;

  for (let i = 0; i < priceList.length; i++) {
    let currentPrice = Number(priceList[i].price); // Make sure it's a number
    if (currentPrice > highestPrice) {
      highestPrice = currentPrice;
    }
  }

  return highestPrice;
}


// export function getLowestPrice(priceList: PriceHistoryItem[]) {
//   let lowestPrice = priceList[0];

//   for (let i = 0; i < priceList.length; i++) {
//     if (priceList[i].price < lowestPrice.price) {
//       lowestPrice = priceList[i];
//     }
//   }

//   return lowestPrice.price;
// }

export function getLowestPrice(priceList: PriceHistoryItem[]) {
  if (priceList.length === 0) return 0;

  let lowestPrice = priceList[0].price;

  for (let i = 0; i < priceList.length; i++) {
    let currentPrice = Number(priceList[i].price); // Make sure it's a number
    if (currentPrice < lowestPrice) {
      lowestPrice = currentPrice;
    }
  }

  return lowestPrice;
}


// export function getAveragePrice(priceList: PriceHistoryItem[]) {
//   const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
//   const averagePrice = sumOfPrices / priceList.length || 0;

//   return averagePrice;
// }

// export function getAveragePrice(priceList: PriceHistoryItem[]) {
//   if (priceList.length === 0) return 0;

//   const sumOfPrices = priceList.reduce((acc, curr) => acc + Number(curr.price), 0); // Make sure it's a number
//   return sumOfPrices / priceList.length;
// }

export function getAveragePrice(priceList: PriceHistoryItem[]) {
  if (priceList.length === 0) return 0;

  const sumOfPrices = priceList.reduce((acc, curr) => acc + Number(curr.price), 0); // Make sure it's a number
  const averagePrice = sumOfPrices / priceList.length;

  // Ensure that the average price is always between the highest and lowest prices
  const highestPrice = getHighestPrice(priceList);
  const lowestPrice = getLowestPrice(priceList);

  if (averagePrice > highestPrice) {
    return highestPrice;
  } else if (averagePrice < lowestPrice) {
    return lowestPrice;
  }

  return averagePrice;
}

export const getEmailNotifType = (
  scrapedProduct: Product,
  currentProduct: Product
) => {
  const lowestPrice = getLowestPrice(currentProduct.priceHistory);

  if (scrapedProduct.currentPrice < lowestPrice) {
    return Notification.LOWEST_PRICE as keyof typeof Notification;
  }
  if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
    return Notification.CHANGE_OF_STOCK as keyof typeof Notification;
  }
  if (scrapedProduct.discountRate >= THRESHOLD_PERCENTAGE) {
    return Notification.THRESHOLD_MET as keyof typeof Notification;
  }

  return null;
};

export const formatNumber = (num: number = 0) => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};