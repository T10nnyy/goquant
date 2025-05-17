import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DollarSignIcon,
  PercentIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";

interface TradingMetricsProps {
  slippage?: number;
  fees?: number;
  marketImpact?: number;
  netCost?: number;
  makerProportion?: number;
  takerProportion?: number;
  baseAsset?: string;
  quoteAsset?: string;
  quantity?: number;
}

const TradingMetrics: React.FC<TradingMetricsProps> = ({
  slippage = 0.12,
  fees = 0.05,
  marketImpact = 0.08,
  netCost = 0.25,
  makerProportion = 0.35,
  takerProportion = 0.65,
  baseAsset = "BTC",
  quoteAsset = "USDT",
  quantity = 100,
}) => {
  // Format numbers for display
  const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;
  const formatUSD = (value: number) => `$${value.toFixed(2)}`;

  // Calculate absolute values for display
  const slippageUSD = quantity * slippage;
  const feesUSD = quantity * fees;
  const marketImpactUSD = quantity * marketImpact;
  const netCostUSD = quantity * netCost;

  return (
    <div className="w-full space-y-4 bg-background p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Trading Metrics</h2>
        <Badge variant="outline" className="text-sm">
          {baseAsset}/{quoteAsset} • {formatUSD(quantity)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Slippage Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUpIcon className="h-5 w-5 text-amber-500" />
                Slippage
              </CardTitle>
              <Badge variant="secondary">{formatPercent(slippage)}</Badge>
            </div>
            <CardDescription>
              Expected price deviation from mid-market
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Cost Impact:</span>
              <span className="font-medium">{formatUSD(slippageUSD)}</span>
            </div>
            <Progress value={slippage * 100 * 5} className="h-2 mt-2" />
          </CardContent>
        </Card>

        {/* Fees Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSignIcon className="h-5 w-5 text-green-500" />
                Fees
              </CardTitle>
              <Badge variant="secondary">{formatPercent(fees)}</Badge>
            </div>
            <CardDescription>
              Exchange trading fees based on selected tier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Cost Impact:</span>
              <span className="font-medium">{formatUSD(feesUSD)}</span>
            </div>
            <Progress value={fees * 100 * 5} className="h-2 mt-2" />
          </CardContent>
        </Card>

        {/* Market Impact Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingDownIcon className="h-5 w-5 text-red-500" />
                Market Impact
              </CardTitle>
              <Badge variant="secondary">{formatPercent(marketImpact)}</Badge>
            </div>
            <CardDescription>
              Estimated price movement caused by your order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Cost Impact:</span>
              <span className="font-medium">{formatUSD(marketImpactUSD)}</span>
            </div>
            <Progress value={marketImpact * 100 * 5} className="h-2 mt-2" />
          </CardContent>
        </Card>

        {/* Net Cost Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <PercentIcon className="h-5 w-5 text-blue-500" />
                Net Cost
              </CardTitle>
              <Badge variant="destructive">{formatPercent(netCost)}</Badge>
            </div>
            <CardDescription>
              Total trading cost (slippage + fees + impact)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Cost:</span>
              <span className="font-medium">{formatUSD(netCostUSD)}</span>
            </div>
            <Progress value={netCost * 100 * 2.5} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Maker/Taker Proportion */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Maker/Taker Proportion</CardTitle>
          <CardDescription>Estimated order fill distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
              <div
                className="bg-blue-500 h-full"
                style={{ width: `${makerProportion * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium min-w-16 text-right">
              {formatPercent(makerProportion)}
            </span>
            <ArrowDownIcon className="h-4 w-4 text-blue-500" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
              <div
                className="bg-amber-500 h-full"
                style={{ width: `${takerProportion * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium min-w-16 text-right">
              {formatPercent(takerProportion)}
            </span>
            <ArrowUpIcon className="h-4 w-4 text-amber-500" />
          </div>
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Maker Orders</span>
            <span>Taker Orders</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingMetrics;
