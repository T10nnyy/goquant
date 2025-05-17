import { useState, useEffect, useRef, useCallback } from "react";

export interface OrderbookData {
  bids: [number, number][];
  asks: [number, number][];
  timestamp: number;
}

export interface PerformanceMetrics {
  dataProcessingLatency: number;
  uiUpdateLatency: number;
  endToEndLatency: number;
}

interface WebSocketMessage {
  type: string;
  data: {
    bids: [string, string][];
    asks: [string, string][];
    timestamp: number;
  };
}

export function useOrderbookData() {
  const [orderbookData, setOrderbookData] = useState<OrderbookData>({
    bids: [],
    asks: [],
    timestamp: Date.now(),
  });
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("disconnected");
  const [error, setError] = useState<string | null>(null);
  const [performanceMetrics, setPerformanceMetrics] =
    useState<PerformanceMetrics>({
      dataProcessingLatency: 0,
      uiUpdateLatency: 0,
      endToEndLatency: 0,
    });

  const wsRef = useRef<WebSocket | null>(null);
  const tickStartTimeRef = useRef<number>(0);
  const processingStartTimeRef = useRef<number>(0);
  const processingEndTimeRef = useRef<number>(0);
  const renderStartTimeRef = useRef<number>(0);

  // Process WebSocket message
  const processWebSocketMessage = useCallback((message: WebSocketMessage) => {
    processingStartTimeRef.current = performance.now();
    const dataProcessingLatency =
      processingStartTimeRef.current - tickStartTimeRef.current;

    if (message.type === "snapshot" || message.type === "update") {
      // Convert string values to numbers
      const bids = message.data.bids.map(([price, quantity]) => [
        parseFloat(price),
        parseFloat(quantity),
      ]) as [number, number][];

      const asks = message.data.asks.map(([price, quantity]) => [
        parseFloat(price),
        parseFloat(quantity),
      ]) as [number, number][];

      // Sort bids in descending order (highest price first)
      bids.sort((a, b) => b[0] - a[0]);

      // Sort asks in ascending order (lowest price first)
      asks.sort((a, b) => a[0] - b[0]);

      const newData = {
        bids,
        asks,
        timestamp: message.data.timestamp || Date.now(),
      };

      processingEndTimeRef.current = performance.now();
      renderStartTimeRef.current = performance.now();

      setOrderbookData(newData);
    }
  }, []);

  // Update performance metrics after render
  useEffect(() => {
    if (renderStartTimeRef.current > 0) {
      const now = performance.now();
      const uiUpdateLatency = now - renderStartTimeRef.current;
      const endToEndLatency = now - tickStartTimeRef.current;
      const dataProcessingLatency =
        processingEndTimeRef.current - processingStartTimeRef.current;

      setPerformanceMetrics({
        dataProcessingLatency,
        uiUpdateLatency,
        endToEndLatency,
      });

      // Reset for next cycle
      renderStartTimeRef.current = 0;
    }
  }, [orderbookData]);

  // Connect to WebSocket
  useEffect(() => {
    const connectWebSocket = () => {
      setConnectionStatus("connecting");
      setError(null);

      const ws = new WebSocket(
        "wss://ws.gomarket-cpp.goquant.io/ws/l2-orderbook/okx/BTC-USDT-SWAP",
      );

      ws.onopen = () => {
        console.log("WebSocket connected");
        setConnectionStatus("connected");
      };

      ws.onmessage = (event) => {
        tickStartTimeRef.current = performance.now();
        try {
          const message = JSON.parse(event.data);
          processWebSocketMessage(message);
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
          setError("Failed to parse WebSocket message");
        }
      };

      ws.onerror = (event) => {
        console.error("WebSocket error:", event);
        setError("WebSocket connection error");
        setConnectionStatus("disconnected");
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setConnectionStatus("disconnected");

        // Attempt to reconnect after a delay
        setTimeout(() => {
          if (wsRef.current?.readyState === WebSocket.CLOSED) {
            connectWebSocket();
          }
        }, 5000);
      };

      wsRef.current = ws;

      return ws;
    };

    const ws = connectWebSocket();

    // Clean up function
    return () => {
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close();
      }
    };
  }, [processWebSocketMessage]);

  return {
    orderbookData,
    connectionStatus,
    error,
    performanceMetrics,
  };
}
