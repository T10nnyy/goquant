import { OrderbookData } from "../hooks/useOrderbookData";

export interface SimulationParams {
  quantity: number;
  volatility: number;
  feeTier: string;
}

export interface TradingMetricsResult {
  slippage: number;
  fees: number;
  marketImpact: number;
  netCost: number;
  makerProportion: number;
  takerProportion: number;
  baseAsset: string;
  quoteAsset: string;
  quantity: number;
}

// Get fee rate based on tier
function getFeeRate(feeTier: string): number {
  switch (feeTier) {
    case "tier1":
      return 0.001; // 0.10%
    case "tier2":
      return 0.0008; // 0.08%
    case "tier3":
      return 0.0006; // 0.06%
    case "tier4":
      return 0.0004; // 0.04%
    case "tier5":
      return 0.0002; // 0.02%
    default:
      return 0.001; // Default to tier1
  }
}

// Calculate slippage using linear model based on orderbook depth
export function calculateSlippage(
  orderbook: OrderbookData,
  quantity: number,
  side: "buy" | "sell",
): number {
  const orders = side === "buy" ? orderbook.asks : orderbook.bids;

  if (orders.length === 0) return 0;

  // Get mid price
  const midPrice =
    orderbook.bids.length > 0 && orderbook.asks.length > 0
      ? (orderbook.bids[0][0] + orderbook.asks[0][0]) / 2
      : side === "buy"
        ? orderbook.asks[0][0]
        : orderbook.bids[0][0];

  let remainingQuantity = quantity / midPrice; // Convert USD to base asset quantity
  let totalCost = 0;

  // Simulate market order execution through the orderbook
  for (const [price, availableQty] of orders) {
    const qtyToExecute = Math.min(remainingQuantity, availableQty);
    totalCost += qtyToExecute * price;
    remainingQuantity -= qtyToExecute;

    if (remainingQuantity <= 0) break;
  }

  // If we couldn't fill the entire order with the available liquidity
  if (remainingQuantity > 0) {
    // Use the last available price with a penalty
    const lastPrice = orders[orders.length - 1][0];
    totalCost += remainingQuantity * lastPrice * 1.05; // 5% penalty for insufficient liquidity
  }

  const avgExecutionPrice = totalCost / (quantity / midPrice);
  const slippagePercent =
    side === "buy"
      ? (avgExecutionPrice - midPrice) / midPrice
      : (midPrice - avgExecutionPrice) / midPrice;

  return Math.max(slippagePercent, 0); // Ensure non-negative
}

// Calculate market impact using simplified Almgren-Chriss model
export function calculateMarketImpact(
  orderbook: OrderbookData,
  quantity: number,
  volatility: number,
): number {
  if (orderbook.bids.length === 0 || orderbook.asks.length === 0) return 0;

  const midPrice = (orderbook.bids[0][0] + orderbook.asks[0][0]) / 2;
  const spread = orderbook.asks[0][0] - orderbook.bids[0][0];
  const normalizedSpread = spread / midPrice;

  // Calculate market depth (sum of quantities within 1% of mid price)
  const depthThreshold = midPrice * 0.01;
  const bidDepth = orderbook.bids
    .filter(([price]) => midPrice - price <= depthThreshold)
    .reduce((sum, [_, qty]) => sum + qty, 0);

  const askDepth = orderbook.asks
    .filter(([price]) => price - midPrice <= depthThreshold)
    .reduce((sum, [_, qty]) => sum + qty, 0);

  const totalDepth = bidDepth + askDepth;

  // Normalize quantity relative to available depth
  const baseQuantity = quantity / midPrice;
  const normalizedQuantity = totalDepth > 0 ? baseQuantity / totalDepth : 0;

  // Volatility factor (0-100 scale to 0-0.1 scale)
  const volatilityFactor = volatility / 1000;

  // Simplified Almgren-Chriss temporary impact
  const impactFactor = Math.sqrt(normalizedSpread * volatilityFactor);
  const marketImpact =
    impactFactor * normalizedQuantity * Math.sqrt(normalizedQuantity);

  return Math.min(Math.max(marketImpact, 0.0001), 0.05); // Constrain between 0.01% and 5%
}

// Calculate maker/taker proportion using logistic regression model
export function calculateMakerTakerProportion(
  orderbook: OrderbookData,
  volatility: number,
): { maker: number; taker: number } {
  // Higher volatility means more likely to be taker orders
  // Tighter spreads mean more likely to be maker orders

  if (orderbook.bids.length === 0 || orderbook.asks.length === 0) {
    return { maker: 0.5, taker: 0.5 };
  }

  const midPrice = (orderbook.bids[0][0] + orderbook.asks[0][0]) / 2;
  const spread = orderbook.asks[0][0] - orderbook.bids[0][0];
  const normalizedSpread = spread / midPrice;

  // Logistic function to determine maker proportion
  // Lower volatility and wider spreads favor maker orders
  const volatilityFactor = volatility / 100; // Normalize to 0-1
  const spreadFactor = Math.min(normalizedSpread * 100, 1); // Cap at 1

  // Logistic regression formula
  const z = 1.5 - 2 * volatilityFactor + spreadFactor;
  const makerProportion = 1 / (1 + Math.exp(-z));

  return {
    maker: makerProportion,
    taker: 1 - makerProportion,
  };
}

// Main function to calculate all trading metrics
export function calculateTradingMetrics(
  orderbook: OrderbookData,
  params: SimulationParams,
): TradingMetricsResult {
  const { quantity, volatility, feeTier } = params;

  // Calculate slippage (average of buy and sell to simulate round trip)
  const buySlippage = calculateSlippage(orderbook, quantity, "buy");
  const sellSlippage = calculateSlippage(orderbook, quantity, "sell");
  const slippage = (buySlippage + sellSlippage) / 2;

  // Calculate fees
  const feeRate = getFeeRate(feeTier);
  const fees = feeRate;

  // Calculate market impact
  const marketImpact = calculateMarketImpact(orderbook, quantity, volatility);

  // Calculate net cost
  const netCost = slippage + fees + marketImpact;

  // Calculate maker/taker proportion
  const { maker, taker } = calculateMakerTakerProportion(orderbook, volatility);

  return {
    slippage,
    fees,
    marketImpact,
    netCost,
    makerProportion: maker,
    takerProportion: taker,
    baseAsset: "BTC",
    quoteAsset: "USDT",
    quantity,
  };
}
