import React, { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp } from "lucide-react";

interface OrderbookData {
  bids: [number, number][];
  asks: [number, number][];
  timestamp: number;
}

interface OrderbookVisualizationProps {
  data?: OrderbookData;
  maxDepth?: number;
}

const OrderbookVisualization: React.FC<OrderbookVisualizationProps> = ({
  data = {
    bids: [
      [19500, 2.5],
      [19450, 3.2],
      [19400, 1.8],
      [19350, 4.1],
      [19300, 2.7],
    ],
    asks: [
      [19550, 1.9],
      [19600, 2.8],
      [19650, 3.5],
      [19700, 2.1],
      [19750, 1.6],
    ],
    timestamp: Date.now(),
  },
  maxDepth = 10,
}) => {
  const [activeTab, setActiveTab] = useState<string>("table");

  // Calculate the maximum quantity for scaling the depth chart
  const maxQuantity = useMemo(() => {
    const allQuantities = [...data.bids, ...data.asks].map((order) => order[1]);
    return Math.max(...allQuantities);
  }, [data]);

  // Format price with appropriate decimal places
  const formatPrice = (price: number) => {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Format quantity with appropriate decimal places
  const formatQuantity = (quantity: number) => {
    return quantity.toLocaleString("en-US", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  };

  // Calculate the spread between best bid and best ask
  const spread = useMemo(() => {
    if (data.bids.length > 0 && data.asks.length > 0) {
      const bestBid = data.bids[0][0];
      const bestAsk = data.asks[0][0];
      return bestAsk - bestBid;
    }
    return 0;
  }, [data]);

  // Format the spread as a percentage
  const spreadPercentage = useMemo(() => {
    if (data.bids.length > 0 && data.asks.length > 0) {
      const bestBid = data.bids[0][0];
      return (spread / bestBid) * 100;
    }
    return 0;
  }, [data, spread]);

  return (
    <Card className="w-full h-full bg-white">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Orderbook Visualization</span>
          <div className="text-sm font-normal">
            Spread:{" "}
            <span className="font-semibold">
              ${formatPrice(spread)} ({spreadPercentage.toFixed(4)}%)
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="depth">Depth Chart</TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Bids Table */}
              <div>
                <h3 className="text-sm font-semibold mb-2 text-green-600">
                  Bids
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Price (USDT)</TableHead>
                      <TableHead>Quantity (BTC)</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.bids.slice(0, maxDepth).map((bid, index) => {
                      const [price, quantity] = bid;
                      const total = price * quantity;
                      return (
                        <TableRow
                          key={`bid-${index}`}
                          className="text-green-600"
                        >
                          <TableCell>{formatPrice(price)}</TableCell>
                          <TableCell>{formatQuantity(quantity)}</TableCell>
                          <TableCell>{formatPrice(total)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Asks Table */}
              <div>
                <h3 className="text-sm font-semibold mb-2 text-red-600">
                  Asks
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Price (USDT)</TableHead>
                      <TableHead>Quantity (BTC)</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.asks.slice(0, maxDepth).map((ask, index) => {
                      const [price, quantity] = ask;
                      const total = price * quantity;
                      return (
                        <TableRow key={`ask-${index}`} className="text-red-600">
                          <TableCell>{formatPrice(price)}</TableCell>
                          <TableCell>{formatQuantity(quantity)}</TableCell>
                          <TableCell>{formatPrice(total)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="depth" className="mt-4">
            <div className="h-80 relative">
              {/* Depth Chart Visualization */}
              <div className="flex h-full">
                {/* Bids Side */}
                <div className="w-1/2 h-full flex flex-col-reverse justify-end relative">
                  {data.bids.slice(0, maxDepth).map((bid, index) => {
                    const [price, quantity] = bid;
                    const width = (quantity / maxQuantity) * 100;
                    return (
                      <div
                        key={`bid-bar-${index}`}
                        className="flex items-center justify-end mb-1"
                      >
                        <div className="text-xs mr-2">{formatPrice(price)}</div>
                        <div
                          className="bg-green-500 opacity-70 h-6"
                          style={{ width: `${width}%` }}
                        ></div>
                      </div>
                    );
                  })}
                </div>

                {/* Center Line */}
                <div className="border-l border-gray-300 h-full"></div>

                {/* Asks Side */}
                <div className="w-1/2 h-full flex flex-col-reverse justify-end relative">
                  {data.asks.slice(0, maxDepth).map((ask, index) => {
                    const [price, quantity] = ask;
                    const width = (quantity / maxQuantity) * 100;
                    return (
                      <div
                        key={`ask-bar-${index}`}
                        className="flex items-center mb-1"
                      >
                        <div
                          className="bg-red-500 opacity-70 h-6"
                          style={{ width: `${width}%` }}
                        ></div>
                        <div className="text-xs ml-2">{formatPrice(price)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Indicators */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-center text-sm text-gray-600">
                <div className="flex items-center">
                  <ArrowDown className="h-4 w-4 text-green-600 mr-1" />
                  <span>Bids</span>
                </div>
                <div className="mx-4">|</div>
                <div className="flex items-center">
                  <span>Asks</span>
                  <ArrowUp className="h-4 w-4 text-red-600 ml-1" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-xs text-gray-500 mt-4 text-right">
          Last updated: {new Date(data.timestamp).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderbookVisualization;
