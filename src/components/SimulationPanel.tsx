import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlayIcon, RefreshCwIcon } from "lucide-react";

interface SimulationPanelProps {
  onRunSimulation?: (params: SimulationParams) => void;
  isRunning?: boolean;
}

export interface SimulationParams {
  quantity: number;
  volatility: number;
  feeTier: string;
}

const SimulationPanel = ({
  onRunSimulation = () => {},
  isRunning = false,
}: SimulationPanelProps) => {
  const [autoRun, setAutoRun] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(100);
  const [volatility, setVolatility] = useState<number>(50);
  const [feeTier, setFeeTier] = useState<string>("tier1");

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setQuantity(value);
    }
  };

  const handleVolatilityChange = (value: number[]) => {
    setVolatility(value[0]);
  };

  const handleFeeTierChange = (value: string) => {
    setFeeTier(value);
  };

  const handleRunSimulation = () => {
    onRunSimulation({
      quantity,
      volatility,
      feeTier,
    });
  };

  // Auto-run simulation when data changes if autoRun is enabled
  useEffect(() => {
    if (autoRun) {
      handleRunSimulation();
    }
  }, [quantity, volatility, feeTier, autoRun]);

  return (
    <Card className="w-full max-w-md bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Simulation Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity (USD)</Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min={1}
            step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Amount in USD equivalent
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="volatility">Volatility</Label>
          <div className="pt-2">
            <Slider
              id="volatility"
              value={[volatility]}
              onValueChange={handleVolatilityChange}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low</span>
            <span>{volatility}%</span>
            <span>High</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="feeTier">Fee Tier</Label>
          <Select value={feeTier} onValueChange={handleFeeTierChange}>
            <SelectTrigger id="feeTier" className="w-full">
              <SelectValue placeholder="Select fee tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tier1">Tier 1 (0.10%)</SelectItem>
              <SelectItem value="tier2">Tier 2 (0.08%)</SelectItem>
              <SelectItem value="tier3">Tier 3 (0.06%)</SelectItem>
              <SelectItem value="tier4">Tier 4 (0.04%)</SelectItem>
              <SelectItem value="tier5">Tier 5 (0.02%)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4">
          <Button
            onClick={handleRunSimulation}
            className="w-full"
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <PlayIcon className="mr-2 h-4 w-4" />
                Run Simulation
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationPanel;
