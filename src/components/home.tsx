import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderbookVisualization from "./OrderbookVisualization";
import SimulationPanel from "./SimulationPanel";
import TradingMetrics from "./TradingMetrics";
import PerformanceDashboard from "./PerformanceDashboard";
import { ArrowUpDown, BarChart3, Gauge, Settings } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background p-6 flex flex-col gap-6">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            High-Performance Trade Simulator
          </h1>
          <p className="text-muted-foreground">
            Real-time orderbook data and trading metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            <span className="text-sm font-medium">Connected</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Orderbook Visualization */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5" />
                Orderbook Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrderbookVisualization />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Simulation Controls */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Simulation Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimulationPanel />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trading Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Trading Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TradingMetrics />
          </CardContent>
        </Card>

        {/* Performance Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="latency">
              <TabsList className="mb-4">
                <TabsTrigger value="latency">Latency</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="rendering">Rendering</TabsTrigger>
              </TabsList>
              <TabsContent value="latency" className="mt-0">
                <PerformanceDashboard
                  currentMetrics={{
                    dataProcessingLatency: 15,
                    uiUpdateLatency: 10,
                    endToEndLatency: 25,
                  }}
                />
              </TabsContent>
              <TabsContent value="processing" className="mt-0">
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  Processing metrics visualization
                </div>
              </TabsContent>
              <TabsContent value="rendering" className="mt-0">
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  Rendering metrics visualization
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
