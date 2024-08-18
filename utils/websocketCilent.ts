import { useEffect, useState } from "react";

interface DepthData {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}

const useWebSocket = (url: string) => {
  const [error, setError] = useState<string | null>(null);
  const [depthData, setDepthData] = useState<DepthData | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setDepthData(parsedData);
    };

    ws.onerror = () => {
      setError("WebSocket error");
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, [url]);

  return depthData;
};

export default useWebSocket;
