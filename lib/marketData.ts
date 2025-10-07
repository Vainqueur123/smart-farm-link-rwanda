export interface YearlyPrices {
  [year: string]: number; // year: price
}

export interface ProductPriceData {
  product: string;
  yearlyPrices: YearlyPrices;
  metadata?: {
    unit?: string;
    source?: string;
    lastUpdated?: string;
  };
}

export interface PricePoint {
  date: string;
  price: number;
  year: number;
  month: number;
}

export interface PriceStatistics {
  min: number;
  max: number;
  average: number;
  median: number;
  standardDeviation: number;
}

export const mockMarketData: ProductPriceData[] = [
  {
    product: "Maize",
    yearlyPrices: {
      "2020": 220,
      "2021": 250,
      "2022": 270,
      "2023": 300,
      "2024": 320
    }
  },
  {
    product: "Beans",
    yearlyPrices: {
      "2020": 350,
      "2021": 370,
      "2022": 400,
      "2023": 430,
      "2024": 460
    }
  },
  {
    product: "Rice",
    yearlyPrices: {
      "2020": 400,
      "2021": 420,
      "2022": 450,
      "2023": 480,
      "2024": 500
    }
  },
  {
    product: "Potatoes",
    yearlyPrices: {
      "2020": 200,
      "2021": 220,
      "2022": 240,
      "2023": 260,
      "2024": 280
    }
  }
];

export const productOptions = mockMarketData.map(item => ({
  value: item.product.toLowerCase(),
  label: item.product
}));

export const getProductData = (productName: string) => {
  return mockMarketData.find(p => p.product.toLowerCase() === productName.toLowerCase());
};

export const calculatePriceStatistics = (prices: number[]): PriceStatistics => {
  if (!prices.length) {
    return {
      min: 0,
      max: 0,
      average: 0,
      median: 0,
      standardDeviation: 0
    };
  }

  const sorted = [...prices].sort((a, b) => a - b);
  const sum = sorted.reduce((a, b) => a + b, 0);
  const avg = sum / sorted.length;
  
  // Calculate standard deviation
  const squareDiffs = sorted.map(value => Math.pow(value - avg, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
  const stdDev = Math.sqrt(avgSquareDiff);

  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    average: Number(avg.toFixed(2)),
    median: sorted[Math.floor(sorted.length / 2)],
    standardDeviation: Number(stdDev.toFixed(2))
  };
};

export const getPriceDistribution = (productName: string, data?: ProductPriceData[]) => {
  const products = data || mockMarketData;
  const product = products.find(p => p.product.toLowerCase() === productName.toLowerCase());
  if (!product) return [];
  
  const prices = Object.values(product.yearlyPrices);
  if (!prices.length) return [];

  const stats = calculatePriceStatistics(prices);
  const range = stats.max - stats.min;
  const bucketSize = Math.ceil(range / 5);
  
  const ranges = Array.from({ length: 5 }, (_, i) => ({
    range: `${Math.round(stats.min + (i * bucketSize))}-${Math.round(stats.min + ((i + 1) * bucketSize))} RWF`,
    min: stats.min + (i * bucketSize),
    max: stats.min + ((i + 1) * bucketSize),
    count: 0
  }));

  prices.forEach(price => {
    for (let i = 0; i < ranges.length; i++) {
      if (price >= ranges[i].min && price <= ranges[i].max) {
        ranges[i].count++;
        break;
      }
    }
  });

  return ranges.map(({ range, count }) => ({ range, count }));
};

export const getPriceTrendData = (productName: string, data?: ProductPriceData[]) => {
  const products = data || mockMarketData;
  const product = products.find(p => p.product.toLowerCase() === productName.toLowerCase());
  if (!product) return [];
  
  const entries = Object.entries(product.yearlyPrices);
  if (!entries.length) return [];

  // Calculate year-over-year change
  const sortedYears = Object.keys(product.yearlyPrices).sort();
  
  return entries.map(([year, price], index) => {
    const prevYearPrice = index > 0 ? 
      product.yearlyPrices[sortedYears[index - 1]] : 
      null;
    
    const change = prevYearPrice !== null ? 
      ((price - prevYearPrice) / prevYearPrice) * 100 : 
      null;

    return {
      year,
      price,
      date: `${year}-01-01`,
      change: change !== null ? Number(change.toFixed(1)) : null,
      isLatest: index === entries.length - 1
    };
  });
};

export const getAvailableProducts = (data?: ProductPriceData[]) => {
  const products = data || mockMarketData;
  return products.map(item => ({
    value: item.product.toLowerCase(),
    label: item.product,
    unit: item.metadata?.unit || 'kg'
  }));
};
