import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, Zap } from "lucide-react";

interface PerformanceMetric {
  timestamp: number;
  dataProcessingLatency: number;
  uiUpdateLatency: number;
  endToEndLatency: number;
}

interface PerformanceDashboardProps {
  metrics?: PerformanceMetric[];
  currentMetrics?: {
    dataProcessingLatency: number;
    uiUpdateLatency: number;
    endToEndLatency: number;
  };
}

const PerformanceDashboard = ({
  metrics = [],
  currentMetrics = {
    dataProcessingLatency: 5,
    uiUpdateLatency: 8,
    endToEndLatency: 15,
  },
}: PerformanceDashboardProps) => {
  const [activeTab, setActiveTab] = useState("chart");
  const [visibleMetrics, setVisibleMetrics] = useState({
    dataProcessing: true,
    uiUpdate: true,
    endToEnd: true,
  });

  // Generate sample data if no metrics provided
  const [sampleData, setSampleData] = useState<PerformanceMetric[]>([]);

  useEffect(() => {
    if (metrics.length === 0) {
      // Generate sample data for demonstration
      const now = Date.now();
      const samples = Array.from({ length: 20 }, (_, i) => ({
        timestamp: now - (19 - i) * 1000,
        dataProcessingLatency: 3 + Math.random() * 5,
        uiUpdateLatency: 6 + Math.random() * 6,
        endToEndLatency: 12 + Math.random() * 8,
      }));
      setSampleData(samples);
    }
  }, [metrics.length]);

  const displayData = metrics.length > 0 ? metrics : sampleData;

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 10) return "text-green-500";
    if (latency < 20) return "text-yellow-500";
    return "text-red-500";
  };

  const toggleMetricVisibility = (
    metric: "dataProcessing" | "uiUpdate" | "endToEnd",
  ) => {
    setVisibleMetrics((prev) => ({
      ...prev,
      [metric]: !prev[metric],
    }));
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold">
              Performance Metrics
            </CardTitle>
            <CardDescription>Real-time latency measurements</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Updated: {formatTime(Date.now())}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="current">Current Values</TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="data-processing"
                  checked={visibleMetrics.dataProcessing}
                  onCheckedChange={() =>
                    toggleMetricVisibility("dataProcessing")
                  }
                />
                <Label htmlFor="data-processing" className="text-xs">
                  Data Processing
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="ui-update"
                  checked={visibleMetrics.uiUpdate}
                  onCheckedChange={() => toggleMetricVisibility("uiUpdate")}
                />
                <Label htmlFor="ui-update" className="text-xs">
                  UI Update
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="end-to-end"
                  checked={visibleMetrics.endToEnd}
                  onCheckedChange={() => toggleMetricVisibility("endToEnd")}
                />
                <Label htmlFor="end-to-end" className="text-xs">
                  End-to-End
                </Label>
              </div>
            </div>
          </div>

          <TabsContent value="chart" className="mt-0">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={displayData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={formatTime}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    label={{
                      value: "Latency (ms)",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle" },
                    }}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value.toFixed(2)} ms`, ""]}
                    labelFormatter={(label) => formatTime(label)}
                  />
                  <Legend />
                  {visibleMetrics.dataProcessing && (
                    <Line
                      type="monotone"
                      dataKey="dataProcessingLatency"
                      name="Data Processing"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  )}
                  {visibleMetrics.uiUpdate && (
                    <Line
                      type="monotone"
                      dataKey="uiUpdateLatency"
                      name="UI Update"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  )}
                  {visibleMetrics.endToEnd && (
                    <Line
                      type="monotone"
                      dataKey="endToEndLatency"
                      name="End-to-End"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="current" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-50">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium">Data Processing</h3>
                    </div>
                    <span
                      className={`text-xl font-bold ${getLatencyColor(currentMetrics.dataProcessingLatency)}`}
                    >
                      {currentMetrics.dataProcessingLatency.toFixed(2)} ms
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Time from WebSocket tick to parsed data
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-50">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-green-500" />
                      <h3 className="font-medium">UI Update</h3>
                    </div>
                    <span
                      className={`text-xl font-bold ${getLatencyColor(currentMetrics.uiUpdateLatency)}`}
                    >
                      {currentMetrics.uiUpdateLatency.toFixed(2)} ms
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Time from model output to UI update
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-50">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                      <h3 className="font-medium">End-to-End</h3>
                    </div>
                    <span
                      className={`text-xl font-bold ${getLatencyColor(currentMetrics.endToEndLatency)}`}
                    >
                      {currentMetrics.endToEndLatency.toFixed(2)} ms
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Total time from WebSocket tick to UI update
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PerformanceDashboard;
