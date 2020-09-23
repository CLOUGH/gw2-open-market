export interface ItemsSearchFilter {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  subCategory?: string;
  rarity?: string;
  minLevel?: number;
  maxLevel?: number;
  maxBuy?: number;
  minBuy?: number;
  maxSell?: number;
  minSell?: number;
  minDemand?: number;
  maxDemand?: number;
  minSupply?: number;
  maxSupply?: number;
  minFlipProfit?: number;
  maxFlipProfit?: number;
  maxRoi?: number;
  minRoi?: number;
  maxDemandSupplyRatio?: number;
  minDemandSupplyRatio?: number;
}
