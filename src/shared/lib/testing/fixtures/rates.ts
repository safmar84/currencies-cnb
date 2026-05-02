export const validDailyRatesText = `27 Apr 2026 #80
Country|Currency|Amount|Code|Rate
Australia|dollar|1|AUD|14.909
Japan|yen|100|JPY|13.020`;

export const validDailyRates = {
  publishedAt: "27 Apr 2026",
  sequence: 80,
  rows: [
    {
      country: "Australia",
      currency: "dollar",
      amount: 1,
      code: "AUD",
      rate: 14.909,
    },
    {
      country: "Japan",
      currency: "yen",
      amount: 100,
      code: "JPY",
      rate: 13.02,
    },
  ],
};

export const historicalDailyRatesText = `03 Jan 2000 #1
Country|Currency|Amount|Code|Rate
Australia|dollar|1|AUD|23.282

Country|Currency|Amount|Code|Rate
Belgium|frank|100|BEF|89.762`;

export const historicalDailyRates = {
  publishedAt: "03 Jan 2000",
  sequence: 1,
  rows: [
    {
      country: "Australia",
      currency: "dollar",
      amount: 1,
      code: "AUD",
      rate: 23.282,
    },
  ],
};
